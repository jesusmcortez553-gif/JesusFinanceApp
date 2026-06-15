import React from 'react';
import { TrendingDown } from 'lucide-react';
import { fmt, fmtShort } from '../utils/format';

export default function ResumenDeudas({ tcs, prestamos }) {
  const totalTC        = tcs.reduce((s,t) => s+t.deudaActual, 0);
  const totalPrestamos = prestamos.reduce((s,p) => s+p.capitalPendiente, 0);
  const cuotasMes      = prestamos.reduce((s,p) => s+p.cuotaMensual, 0);
  const total          = totalTC + totalPrestamos;

  return (
    <div style={{background:'linear-gradient(135deg,#1e1b4b,#312e81)',borderRadius:20,padding:'18px',marginBottom:16,boxShadow:'0 8px 32px rgba(30,27,75,0.3)'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
        <TrendingDown size={16} color="rgba(255,255,255,0.7)"/>
        <span style={{color:'rgba(255,255,255,0.7)',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:0.5}}>Total deudas</span>
      </div>
      <div style={{color:'#fff',fontSize:32,fontWeight:800,letterSpacing:-1,marginBottom:14}}>{fmt(total)}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        {[
          {label:'TC',        val:totalTC,        color:'#fbbf24'},
          {label:'Créditos',  val:totalPrestamos, color:'#60a5fa'},
          {label:'Cuotas/mes',val:cuotasMes,      color:'#34d399'},
        ].map(s => (
          <div key={s.label} style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 8px',textAlign:'center'}}>
            <div style={{color:'rgba(255,255,255,0.6)',fontSize:9,textTransform:'uppercase',letterSpacing:0.3,marginBottom:4}}>{s.label}</div>
            <div style={{color:s.color,fontSize:13,fontWeight:800}}>{fmtShort(s.val)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
