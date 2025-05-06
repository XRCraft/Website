# Deploying Your Next.js XRCraftMC Website with Nginx

This guide provides instructions on how to deploy your Next.js application (built with `npm run build`) on a server running Nginx.

**Prerequisites:**

*   A server (e.g., Ubuntu, Debian, CentOS) with root or sudo access.
*   Node.js and npm (or yarn) installed on the server.
*   Nginx installed and running on the server.
*   Your Next.js application code uploaded to the server.
*   A domain name pointed to your server's IP address (optional but recommended).

**Steps:**

1.  **Build Your Next.js App:**
    *   Navigate to your project directory on the server:
        ```bash
        cd /path/to/your/XRCraftMC
        ```
    *   Install dependencies:
        ```bash
        npm install
        # or: yarn install
        ```
    *   Build the production version:
        ```bash
        npm run build
        # or: yarn build
        ```
    This creates an optimized build in the `.next` directory.

2.  **Set Up a Process Manager (Recommended):**
    *   It's highly recommended to use a process manager like `pm2` to keep your Next.js app running in the background and automatically restart it if it crashes.
    *   Install `pm2` globally:
        ```bash
        npm install pm2 -g
        # or: yarn global add pm2
        ```
    *   Start your Next.js app using `pm2`:
        ```bash
        pm2 start npm --name "xrcraftmc-web" -- start
        # or if using yarn:
        # pm2 start yarn --name "xrcraftmc-web" -- start
        ```
        *   `--name "xrcraftmc-web"`: Assigns a name to the process.
        *   `-- start`: Tells pm2 to run the `start` script from your `package.json`.
    *   Ensure `pm2` restarts on server reboot:
        ```bash
        pm2 startup
        # Follow the instructions output by this command
        pm2 save
        ```
    Your Next.js app should now be running, typically on `http://localhost:3000`.

3.  **Configure Nginx as a Reverse Proxy:**
    *   You need to tell Nginx to forward requests for your domain (or IP) to the running Next.js application (which is on `localhost:3000` by default).
    *   Open your existing Nginx configuration file for the site. This is often located in `/etc/nginx/sites-available/your_domain` or `/etc/nginx/conf.d/your_domain.conf`. If you're adding it to the default config, it might be `/etc/nginx/nginx.conf` or `/etc/nginx/sites-available/default`.
    *   **Inside the `server { ... }` block** for your domain (or the default server block if you don't have a specific one), add or modify the `location / { ... }` block like this:

        ```nginx
        server {
            listen 80; # Or listen 443 ssl; if you have HTTPS configured
            server_name your_domain.com www.your_domain.com; # Replace with your actual domain or server IP

            # ... other configurations like SSL certificate paths if using HTTPS ...

            location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to proxying
                # try_files $uri $uri/ @proxy;
                # If you are using Next.js App Router (which this project does),
                # you generally just want to proxy everything directly.

                proxy_pass http://localhost:3000; # Forward requests to the Next.js app
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            # Optional: If you want Nginx to serve static files directly for better performance
            # (Make sure the path matches your build output)
            # location /_next/static/ {
            #     alias /path/to/your/XRCraftMC/.next/static/;
            #     expires 1y;
            #     access_log off;
            # }

            # ... other location blocks if needed ...
        }
        ```

    *   **Explanation:**
        *   `proxy_pass http://localhost:3000;`: This is the core line. It tells Nginx to send incoming requests to your Next.js app running on port 3000.
        *   The `proxy_set_header` lines ensure that necessary information (like the original host, IP address, and protocol) is passed to your Next.js application. This is important for features like redirects and logging.
        *   The headers related to `Upgrade` and `Connection` are important for supporting WebSockets if your application uses them.

4.  **Test and Reload Nginx:**
    *   Test your Nginx configuration for syntax errors:
        ```bash
        sudo nginx -t
        ```
    *   If the test is successful, reload Nginx to apply the changes:
        ```bash
        sudo systemctl reload nginx
        # or: sudo service nginx reload
        ```

5.  **Access Your Website:**
    *   Open your web browser and navigate to your domain or server IP address. You should see your XRCraftMC Next.js website!

**Troubleshooting:**

*   **502 Bad Gateway:** This usually means Nginx can't reach your Next.js app. Check if the app is running using `pm2 list`. Ensure the `proxy_pass` directive points to the correct port (default is 3000). Check firewall rules (`ufw status` if using ufw).
*   **404 Not Found:** Double-check your Nginx `location` block and the `proxy_pass` directive.
*   **Check Logs:** Look at Nginx error logs (often `/var/log/nginx/error.log`) and your application logs (use `pm2 logs xrcraftmc-web`).
