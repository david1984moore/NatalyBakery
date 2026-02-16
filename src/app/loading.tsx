export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #F8ECDF 0%, #EFE2D2 100%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Optional: Add a subtle loading indicator */}
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid rgba(0,0,0,0.1)',
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
