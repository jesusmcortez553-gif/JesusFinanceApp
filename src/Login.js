import React from 'react';

export default function Login({ onLogin }) {
  return (
    <div style={{
      fontFamily:"'DM Sans', sans-serif",
      minHeight:'100vh',
      background:'linear-gradient(135deg,#5b21b6 0%,#7c3aed 45%,#4f46e5 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"/>
      <div style={{
        background:'#fff', borderRadius:28, padding:'40px 32px',
        width:'100%', maxWidth:360, margin:'0 16px',
        boxShadow:'0 24px 60px rgba(0,0,0,0.25)',
        textAlign:'center',
      }}>
        {/* Logo */}
        <div style={{
          width:64, height:64, borderRadius:20,
          background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 20px', fontSize:28,
          boxShadow:'0 8px 24px rgba(124,58,237,0.35)',
        }}>💜</div>

        <div style={{fontSize:26,fontWeight:800,color:'#1f1b4b',marginBottom:6}}>
          Finanzas
        </div>
        <div style={{fontSize:14,color:'#9ca3af',marginBottom:32,lineHeight:1.6}}>
          Tu dinero, tus patrones,<br/>sin decidir nada.
        </div>

        {/* Features */}
        {[
          '🔥 Clasificación automática',
          '📊 Insights de tus patrones reales',
          '💳 TC y créditos sincronizados',
          '🎯 Cero fricción',
        ].map((f,i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:10,
            background:'#f9f8ff', borderRadius:12, padding:'10px 14px',
            marginBottom:8, textAlign:'left',
          }}>
            <span style={{fontSize:13,color:'#1f1b4b',fontWeight:500}}>{f}</span>
          </div>
        ))}

        {/* Google Login Button */}
        <button onClick={onLogin} style={{
          width:'100%', marginTop:24, padding:'14px',
          background:'#fff', border:'2px solid #e5e7eb',
          borderRadius:14, cursor:'pointer', fontFamily:'inherit',
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          fontSize:15, fontWeight:700, color:'#1f1b4b',
          transition:'all 0.2s', boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
        }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='#7c3aed'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='#e5e7eb'}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Entrar con Google
        </button>

        <div style={{fontSize:11,color:'#d1d5db',marginTop:16,lineHeight:1.5}}>
          Tus datos están seguros y son privados.<br/>Solo tú puedes verlos.
        </div>
      </div>
    </div>
  );
}
