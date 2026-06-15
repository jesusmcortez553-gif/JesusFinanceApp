import React from 'react';
import { Flag, Plus, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { fmtInt } from '../utils/format';

const actionBtn = (bg) => ({ width:30,height:30,borderRadius:9,background:bg,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 });

export default function MetaCard({ meta, onAbonar, onEdit, onDelete }) {
  const pct  = Math.min(100, Math.round(meta.actual / meta.objetivo * 100));
  const resta = meta.objetivo - meta.actual;
  const done  = pct >= 100;

  return (
    <div style={{background:'#fff',borderRadius:18,padding:'14px 16px',marginBottom:10,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',border:done?'1.5px solid #bbf7d0':'1.5px solid transparent'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:38,height:38,borderRadius:12,background:meta.color+'20',display:'flex',alignItems:'center',justifyContent:'center'}}><Flag size={18} color={meta.color}/></div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{meta.nombre}</div>
            <div style={{fontSize:11,color:'#9ca3af'}}>Objetivo: {fmtInt(meta.objetivo)}</div>
          </div>
        </div>
        <div style={{display:'flex',gap:6}}>
          <button onClick={onEdit}   style={actionBtn('#f5f3ff')}><Pencil size={12} color="#7c3aed"/></button>
          <button onClick={onDelete} style={actionBtn('#fef2f2')}><Trash2 size={12} color="#ef4444"/></button>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
        <span style={{fontSize:13,fontWeight:800,color:meta.color}}>{fmtInt(meta.actual)}</span>
        {!done && <span style={{fontSize:12,color:'#9ca3af'}}>Faltan {fmtInt(resta)}</span>}
        {done  && <span style={{fontSize:12,color:'#10b981',fontWeight:700,display:'flex',alignItems:'center',gap:4}}><CheckCircle size={13}/>Completado</span>}
      </div>
      <div style={{background:'#f5f5ff',borderRadius:100,height:10,overflow:'hidden',marginBottom:8}}>
        <div style={{width:`${pct}%`,height:'100%',background:`linear-gradient(90deg,${meta.color},${meta.color}bb)`,borderRadius:100,transition:'width 1s'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:11,color:'#9ca3af'}}>{pct}% completado</span>
        {!done && <button onClick={onAbonar} style={{background:`linear-gradient(135deg,${meta.color},${meta.color}cc)`,color:'#fff',border:'none',borderRadius:20,padding:'5px 14px',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}><Plus size={12}/>Abonar</button>}
      </div>
    </div>
  );
}
