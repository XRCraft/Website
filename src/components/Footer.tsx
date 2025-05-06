export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-mcbrown pixel-border mt-12 p-0 text-center text-xs text-mcsky font-minecraft shadow-lg relative overflow-hidden" style={{ minHeight: '40px', height: '40px' }}>
      <div className="grass-block-bg" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '40px', zIndex: 0 }} aria-hidden="true"></div>
      <div
        className="absolute left-1/2 bottom-0 z-10"
        style={{
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.5)',
          color: '#232323',
          minHeight: '40px',
          height: '40px',
          borderRadius: '0.5rem 0.5rem 0 0', // Only round the top corners
          padding: '0.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '90vw',
        }}
      >
        <span style={{ textAlign: 'center', fontSize: '0.75rem', lineHeight: '40px', display: 'block', whiteSpace: 'nowrap' }}>
          © {currentYear} XRCraftMC. All rights reserved. XRCraft is not affiliated with Mojang Studios or Microsoft. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
