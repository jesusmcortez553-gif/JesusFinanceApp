import React from 'react';
import { CreditCard, Receipt, Calendar } from 'lucide-react';
import { fmt, fmtInt, urgenciaColor } from '../utils/format';
import { getCicloActual, parseLimitePago } from '../utils/bcp';

export default function TarjetaVisual({ tc }) {
  const disponible = tc.lineaTotal - tc.consumido;
  const pctUsado   = Math.round(tc.consumido / tc.lineaTotal * 100);
  const ciclo      = getCicloActual();
  const pagoDate   = parseLimitePago(ciclo.limitePago);
  const diasVence  = Math.ceil((pagoDate - new Date()) / (1000*60*60*24));
  const urg        = urgenciaColor(diasVence);

  return (
    <div style={{marginBottom:14}}>
      <div style={{background:tc.gradiente,borderRadius:20,padding:'20px 22px',marginBottom:12,boxShadow:'0 8px 32px rgba(0,0,0,0.2)',position:'relative',overflow:'hidden',minHeight:160}}>
        <div style={{position:'absolute',top:-30,right:-30,width:130,height:130,borderRadius:'50%',background:'rgba(255,255,255,0.08)'}}/>
        <div style={{position:'absolute',bottom:-20,left:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.06)'}}/>
        <div style={{position:'relative',zIndex:2}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
            <div>
              <div style={{color:'rgba(255,255,255,0.7)',fontSize:10,letterSpacing:1,textTransform:'uppercase'}}>BCP</div>
              <div style={{color:'#fff',fontSize:13,fontWeight:700,marginTop:2}}>{tc.nombre}</div>
            </div>
            <CreditCard size={28} color="rgba(255,255,255,0.6)" />
          </div>
          <div style={{color:'rgba(255,255,255,0.7)',fontSize:12,letterSpacing:3,marginBottom:12}}>{tc.numero}</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
            <div>
              <div style={{color:'rgba(255,255,255,0.6)',fontSize:10,marginBottom:2}}>Consumido</div>
              <div style={{color:'#fff',fontSize:20,fontWeight:800}}>{fmt(tc.consumido)}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{color:'rgba(255,255,255,0.6)',fontSize:10,marginBottom:2}}>Disponible</div>
              <div style={{color:'#fff',fontSize:18,fontWeight:700}}>{fmt(disponible)}</div>
            </div>
          </div>
          <div style={{marginTop:10,background:'rgba(255,255,255,0.2)',borderRadius:100,height:4,overflow:'hidden'}}>
            <div style={{width:`${pctUsado}%`,height:'100%',background:'#fff',borderRadius:100}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
            <span style={{color:'rgba(255,255,255,0.6)',fontSize:10}}>Línea: {fmtInt(tc.lineaTotal)}</span>
            <span style={{color:'rgba(255,255,255,0.6)',fontSize:10}}>{pctUsado}% usado</span>
          </div>
        </div>
      </div>

      <div style={{background:'#fff',borderRadius:16,padding:'14px 16px',boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          <div style={{background:'#f9f8ff',borderRadius:12,padding:'10px 12px'}}>
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:4}}>
              <Receipt size={12} color="#7c3aed"/>
              <span style={{fontSize:10,color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:0.3}}>Facturación</span>
            </div>
            <div style={{fontSize:14,fontWeight:800,color:'#1f1b4b'}}>{ciclo.cierreDesde} – {ciclo.cierreHasta}</div>
            <div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>Ciclo activo</div>
          </div>
          <div style={{background:urg.bg,borderRadius:12,padding:'10px 12px',border:`1px solid ${urg.border}`}}>
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:4}}>
              <Calendar size={12} color={urg.badge}/>
              <span style={{fontSize:10,color:urg.text,fontWeight:600,textTransform:'uppercase',letterSpacing:0.3}}>Límite pago</span>
            </div>
            <div style={{fontSize:14,fontWeight:800,color:urg.text}}>{ciclo.limitePago}</div>
            <div style={{fontSize:11,color:urg.text,marginTop:2,fontWeight:600}}>{diasVence > 0 ? `${diasVence} días` : 'Vencido'}</div>
          </div>
        </div>
        <div style={{borderTop:'1px solid #f5f3ff',paddingTop:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <span style={{fontSize:12,color:'#9ca3af',fontWeight:600}}>Deuda total facturada</span>
            <span style={{fontSize:16,fontWeight:800,color:'#ef4444'}}>{fmt(tc.deudaActual)}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
            <span style={{fontSize:12,color:'#9ca3af',fontWeight:600}}>Ciclo actual</span>
            <span style={{fontSize:12,fontWeight:700,color:'#1f1b4b'}}>{ciclo.cierreDesde} – {ciclo.cierreHasta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
