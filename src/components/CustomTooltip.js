import React from 'react';

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:'#1f1b4b',borderRadius:10,padding:'8px 12px'}}>
      <div style={{color:'rgba(255,255,255,0.55)',fontSize:10,marginBottom:3}}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{color:'#fff',fontSize:12,fontWeight:700}}>{p.value >= 1000 ? `S/${(p.value/1000).toFixed(1)}k` : `S/${Math.round(p.value)}`}</div>)}
    </div>
  );
}
