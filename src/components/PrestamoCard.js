import React from 'react';
import { Landmark, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { fmt, fmtFecha, diasHasta, urgenciaColor } from '../utils/format';

const actionBtn = (bg) => ({ width:30,height:30,borderRadius:9,background:bg,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 });

export default function PrestamoCard({ prestamo, onEdit, onDelete }) {
  const pct       = Math.round(prestamo.pagado / prestamo.montoOriginal * 100);
  const diasV     = diasHasta(prestamo.proximoPago);
  const urg       = urgenciaColor(diasV);
  const restaCuotas = prestamo.totalCuotas - prestamo.cuotaActual;

  return (
    <div style={{background:'#fff',borderRadius:18,padding:'16px',marginBottom:12,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',border:`1.5px solid ${diasV<=10?urg.border:'transparent'}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:42,height:42,borderRadius:13,background:prestamo.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Landmark size={20} color={prestamo.color}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'#1f1b4b'}}>{prestamo.nombre}</div>
            <div style={{fontSize:11,color:'#9ca3af'}}>{prestamo.banco} · {prestamo.numero}</div>
          </div>
        </div>
        <div style={{display:'flex',gap:6}}>
          <button onClick={onEdit}   style={actionBtn('#f5f3ff')}><Pencil size={12} color="#7c3aed"/></button>
          <button onClick={onDelete} style={actionBtn('#fef2f2')}><Trash2 size={12} color="#ef4444"/></button>
        </div>
      </div>

      <div style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
          <span style={{fontSize:12,color:'#9ca3af'}}>Capital pendiente</span>
          <span style={{fontSize:14,fontWeight:800,color:'#ef4444'}}>{fmt(prestamo.capitalPendiente)}</span>
        </div>
        <div style={{background:'#f5f5ff',borderRadius:100,height:8,overflow:'hidden',marginBottom:4}}>
          <div style={{width:`${pct}%`,height:'100%',background:`linear-gradient(90deg,${prestamo.color},${prestamo.color}cc)`,borderRadius:100,transition:'width 1s'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:10,color:'#9ca3af'}}>{pct}% pagado ({fmt(prestamo.pagado)})</span>
          {prestamo.cuotaActual > 0 && <span style={{fontSize:10,color:'#9ca3af'}}>Cuota {prestamo.cuotaActual}/{prestamo.totalCuotas}</span>}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        <div style={{background:'#f9f8ff',borderRadius:12,padding:'10px'}}>
          <div style={{fontSize:10,color:'#9ca3af',marginBottom:3}}>Cuota mensual</div>
          <div style={{fontSize:15,fontWeight:800,color:'#1f1b4b'}}>{fmt(prestamo.cuotaMensual)}</div>
        </div>
        <div style={{background:urg.bg,border:`1px solid ${urg.border}`,borderRadius:12,padding:'10px'}}>
          <div style={{fontSize:10,color:urg.text,marginBottom:3,fontWeight:600}}>Próximo pago</div>
          <div style={{fontSize:13,fontWeight:800,color:urg.text}}>{fmtFecha(prestamo.proximoPago)}</div>
          <div style={{fontSize:10,color:urg.text,marginTop:1}}>{diasV>0?`${diasV} días`:'Vencido'}</div>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#f9f8ff',borderRadius:12,padding:'10px 12px'}}>
        <div style={{display:'flex',gap:16}}>
          <div><div style={{fontSize:10,color:'#9ca3af'}}>TEA</div><div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{prestamo.tea}%</div></div>
          <div><div style={{fontSize:10,color:'#9ca3af'}}>TCEA</div><div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{prestamo.tcea}%</div></div>
          <div><div style={{fontSize:10,color:'#9ca3af'}}>Cuotas restantes</div><div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{restaCuotas}</div></div>
        </div>
        {prestamo.automatico && (
          <div style={{background:'#dcfce7',borderRadius:8,padding:'4px 8px',display:'flex',alignItems:'center',gap:4}}>
            <CheckCircle size={11} color="#16a34a"/>
            <span style={{fontSize:10,color:'#16a34a',fontWeight:700}}>Auto</span>
          </div>
        )}
      </div>
    </div>
  );
}
