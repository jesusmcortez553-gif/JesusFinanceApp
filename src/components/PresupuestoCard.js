import React from 'react';
import { Package, AlertTriangle, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { CAT_ICONOS } from '../constants/categorias';
import { fmtInt } from '../utils/format';

const actionBtn = (bg) => ({ width:30,height:30,borderRadius:9,background:bg,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 });

export default function PresupuestoCard({ presupuesto, gastado, onEdit, onDelete }) {
  const info    = CAT_ICONOS[presupuesto.categoria] || { icon:Package, color:'#6b7280' };
  const Icon    = info.icon;
  const pct     = Math.min(100, Math.round(gastado / presupuesto.limite * 100));
  const libre   = presupuesto.limite - gastado;
  const sobre   = pct >= 100;
  const alerta  = pct >= 80 && pct < 100;
  const barColor = sobre ? '#ef4444' : alerta ? '#f59e0b' : info.color;

  return (
    <div style={{background:'#fff',borderRadius:18,padding:'14px 16px',marginBottom:10,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',border:`1.5px solid ${sobre?'#fecaca':alerta?'#fde68a':'transparent'}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:38,height:38,borderRadius:12,background:info.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={18} color={info.color}/></div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{presupuesto.categoria}</div>
            <div style={{fontSize:11,color:'#9ca3af'}}>Límite: {fmtInt(presupuesto.limite)}</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          {sobre ? <AlertTriangle size={16} color="#ef4444"/> : alerta ? <AlertTriangle size={16} color="#f59e0b"/> : <CheckCircle size={16} color="#10b981"/>}
          <button onClick={onEdit}   style={actionBtn('#f5f3ff')}><Pencil size={12} color="#7c3aed"/></button>
          <button onClick={onDelete} style={actionBtn('#fef2f2')}><Trash2 size={12} color="#ef4444"/></button>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
        <span style={{fontSize:12,fontWeight:700,color:barColor}}>{fmtInt(gastado)} gastado</span>
        <span style={{fontSize:12,fontWeight:700,color:libre>=0?'#10b981':'#ef4444'}}>{libre>=0?`${fmtInt(libre)} libre`:`${fmtInt(Math.abs(libre))} excedido`}</span>
      </div>
      <div style={{background:'#f5f3ff',borderRadius:100,height:5,overflow:'hidden'}}>
        <div style={{width:`${pct}%`,height:'100%',background:barColor,borderRadius:100,transition:'width 1s'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:5}}>
        <span style={{fontSize:10,color:'#9ca3af'}}>{pct}% usado</span>
        {sobre  && <span style={{fontSize:10,color:'#ef4444',fontWeight:700}}>Límite superado</span>}
        {alerta && <span style={{fontSize:10,color:'#f59e0b',fontWeight:700}}>Casi en el límite</span>}
      </div>
    </div>
  );
}
