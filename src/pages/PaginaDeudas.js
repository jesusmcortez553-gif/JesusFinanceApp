import React from 'react';
import { Plus, X, Pencil, Trash2, CreditCard, Landmark, Clock } from 'lucide-react';
import { fmt, fmtFecha, diasHasta, urgenciaColor } from '../utils/format';
import TarjetaVisual from '../components/TarjetaVisual';
import PrestamoCard from '../components/PrestamoCard';
import ResumenDeudas from '../components/ResumenDeudas';
import { S, enfocar, desenfocar } from '../estilos';

// Página Deudas: tarjetas de crédito y préstamos. Los handlers de
// creación/edición/borrado y el pago manual de cuotas viven en App.js.
export default function PaginaDeudas({
  user, tcs, prestamos, proximosVenc,
  subTabDeudas, setSubTabDeudas,
  showTcForm, setShowTcForm, tcEditId, setTcEditId, tcForm, setTcForm, handleTcSubmit, handleTcDel,
  showPresForm2, setShowPresForm2, presForm2, setPresForm2, presEditId2, setPresEditId2,
  handlePres2Submit, handlePres2Edit, handlePres2Del, handlePagarCuota,
}) {
  return (
    <div>
      <div style={S.pageHeader('linear-gradient(135deg,#1e1b4b,#4338ca)')}>
        <div style={S.bubble(-40,'-40px',undefined,undefined,140,140,0.07)}/>
        <div style={S.pageTitle}>Deudas y Créditos</div>
        <div style={S.pageSub}>{user?.displayName?.split(' ')[0] || 'Usuario'}</div>
      </div>
      <div style={{padding:'16px'}}>
        <ResumenDeudas tcs={tcs} prestamos={prestamos}/>

        {/* Próximos vencimientos */}
        <div style={{...S.card, marginBottom:14}}>
          <div style={{...S.secTitle, marginBottom:12, display:'flex', alignItems:'center', gap:8}}><Clock size={16} color="#7c3aed"/>Próximos vencimientos</div>
          {proximosVenc.map((v,i)=>{
            const dias = diasHasta(v.fecha); const urg = urgenciaColor(dias);
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<proximosVenc.length-1?'1px solid #f5f3ff':'none'}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:urg.badge,flexShrink:0}}/>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:'#1f1b4b'}}>{v.nombre}</div><div style={{fontSize:11,color:'#9ca3af'}}>{v.tipo} · {fmtFecha(v.fecha)}</div></div>
                <div style={{textAlign:'right'}}><div style={{fontSize:13,fontWeight:800,color:urg.text}}>{fmt(v.monto)}</div><div style={{fontSize:10,color:urg.text,fontWeight:600}}>{dias>0?`${dias}d`:' Vence hoy'}</div></div>
              </div>
            );
          })}
        </div>

        {/* Sub tabs TC / Préstamos */}
        <div style={{display:'flex',gap:8,marginBottom:14}}>
          {[{id:'tc',label:'Tarjetas',Icon:CreditCard},{id:'prestamos',label:'Créditos',Icon:Landmark}].map(({id,label,Icon})=>(
            <button key={id} onClick={()=>setSubTabDeudas(id)} style={{flex:1,padding:'10px',borderRadius:14,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontFamily:'inherit',fontWeight:700,fontSize:13,transition:'all 0.2s',background:subTabDeudas===id?'linear-gradient(135deg,#4338ca,#6366f1)':'#fff',color:subTabDeudas===id?'#fff':'#9ca3af',boxShadow:subTabDeudas===id?'0 4px 16px rgba(67,56,202,0.3)':'none'}}>
              <Icon size={16}/>{label}
            </button>
          ))}
        </div>

        {/* TC */}
        {subTabDeudas==='tc' && (
          <div>
            {tcs.map(tc=>(
              <div key={tc.id} style={{position:'relative'}}>
                <TarjetaVisual tc={tc}/>
                <div style={{display:'flex',gap:6,marginTop:-8,marginBottom:12,justifyContent:'flex-end'}}>
                  <button onClick={()=>{setTcEditId(tc.id);setTcForm({nombre:tc.nombre,banco:tc.banco,numero:tc.numero,lineaTotal:String(tc.lineaTotal),consumido:String(tc.consumido),deudaActual:String(tc.deudaActual),tea:String(tc.tea||''),diaCorte:String(tc.diaCorte||25),diaPago:String(tc.diaPago||22),color:tc.color||'#b45309'});setShowTcForm(true);}}
                    style={{padding:'6px 10px',borderRadius:10,border:'none',background:'#f0f0f7',cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontSize:11,color:'#6366f1',fontFamily:'inherit',fontWeight:600}}>
                    <Pencil size={12}/>Editar
                  </button>
                  <button onClick={()=>handleTcDel(tc.id)}
                    style={{padding:'6px 10px',borderRadius:10,border:'none',background:'#fef2f2',cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontSize:11,color:'#ef4444',fontFamily:'inherit',fontWeight:600}}>
                    <Trash2 size={12}/>Eliminar
                  </button>
                </div>
              </div>
            ))}

            <button onClick={()=>{setTcEditId(null);setTcForm({nombre:'',banco:'',numero:'',lineaTotal:'',consumido:'',deudaActual:'',tea:'',diaCorte:'',diaPago:'',color:'#b45309'});setShowTcForm(true);}}
              style={{width:'100%',padding:'12px',borderRadius:14,border:'2px dashed #c7d2fe',background:'#f0f0f7',color:'#6366f1',fontFamily:'inherit',fontWeight:700,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginBottom:12}}>
              <Plus size={16}/>Agregar tarjeta de crédito
            </button>

            {showTcForm && (
              <div style={{...S.formCard,marginTop:4,border:'1px solid #e0e7ff'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                  <span style={{fontSize:14,fontWeight:700,color:'#1f1b4b'}}>{tcEditId?'Editar tarjeta':'Nueva tarjeta'}</span>
                  <button onClick={()=>{setShowTcForm(false);setTcEditId(null);}} style={{background:'none',border:'none',cursor:'pointer'}}><X size={18} color="#9ca3af"/></button>
                </div>
                {[
                  {l:'Banco',k:'banco',t:'text',ph:'ej. BCP, Interbank, BBVA'},
                  {l:'Nombre de la tarjeta',k:'nombre',t:'text',ph:'ej. VISA BCP LATAM Pass'},
                  {l:'Últimos 4 dígitos',k:'numero',t:'text',ph:'****1234'},
                  {l:'Línea de crédito total (S/.)',k:'lineaTotal',t:'number',ph:'0.00'},
                  {l:'Consumido actual (S/.)',k:'consumido',t:'number',ph:'0.00'},
                  {l:'Deuda actual (S/.)',k:'deudaActual',t:'number',ph:'0.00'},
                  {l:'TEA % (tasa anual)',k:'tea',t:'number',ph:'34.33'},
                  {l:'Día de corte',k:'diaCorte',t:'number',ph:'25'},
                  {l:'Día límite de pago',k:'diaPago',t:'number',ph:'22'},
                ].map(f=>(
                  <div key={f.k}>
                    <label style={S.label}>{f.l}</label>
                    <input style={S.input} type={f.t} placeholder={f.ph}
                      value={tcForm[f.k]} onChange={e=>setTcForm(p=>({...p,[f.k]:e.target.value}))}
                      onFocus={enfocar} onBlur={desenfocar}/>
                  </div>
                ))}
                <button style={{...S.submitBtn,background:'linear-gradient(135deg,#92400e,#b45309)'}}
                  onClick={handleTcSubmit}>
                  <Plus size={16}/>{tcEditId?'Guardar cambios':'Agregar tarjeta'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Préstamos */}
        {subTabDeudas==='prestamos' && (
          <div>
            {prestamos.map(p=><PrestamoCard key={p.id} prestamo={p} onEdit={()=>handlePres2Edit(p)} onDelete={()=>handlePres2Del(p.id)} onPagar={()=>handlePagarCuota(p)}/>)}

            <button onClick={()=>{setPresEditId2(null);setPresForm2({nombre:'',banco:'',numero:'',montoOriginal:'',capitalPendiente:'',cuotaMensual:'',proximoPago:'',tea:'',tcea:'',totalCuotas:'',cuotaActual:'0',color:'#1d4ed8'});setShowPresForm2(true);}}
              style={{width:'100%',padding:'12px',borderRadius:14,border:'2px dashed #c7d2fe',background:'#f0f0f7',color:'#6366f1',fontFamily:'inherit',fontWeight:700,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <Plus size={16}/>Agregar crédito
            </button>

            {showPresForm2 && (
              <div style={{...S.formCard,marginTop:12,border:'1px solid #e0e7ff'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                  <span style={{fontSize:14,fontWeight:700,color:'#1f1b4b'}}>{presEditId2?'Editar crédito':'Nuevo crédito'}</span>
                  <button onClick={()=>{setShowPresForm2(false);setPresEditId2(null);}} style={{background:'none',border:'none',cursor:'pointer'}}><X size={18} color="#9ca3af"/></button>
                </div>
                {[{l:'Nombre',k:'nombre',t:'text',ph:'ej. Crédito Efectivo'},{l:'Banco',k:'banco',t:'text',ph:'ej. BCP'},{l:'N° (últimos 4)',k:'numero',t:'text',ph:'****1234'},{l:'Monto original (S/.)',k:'montoOriginal',t:'number',ph:'0.00'},{l:'Capital pendiente (S/.)',k:'capitalPendiente',t:'number',ph:'0.00'},{l:'Cuota mensual (S/.)',k:'cuotaMensual',t:'number',ph:'0.00'},{l:'Total cuotas',k:'totalCuotas',t:'number',ph:'36'},{l:'Cuota actual N°',k:'cuotaActual',t:'number',ph:'0'},{l:'Próximo pago',k:'proximoPago',t:'date',ph:''},{l:'TEA %',k:'tea',t:'number',ph:'8.70'},{l:'TCEA %',k:'tcea',t:'number',ph:'10.21'}].map(f=>(
                  <div key={f.k}><label style={S.label}>{f.l}</label><input style={S.input} type={f.t} placeholder={f.ph} value={presForm2[f.k]} onChange={e=>setPresForm2(p=>({...p,[f.k]:e.target.value}))} onFocus={enfocar} onBlur={desenfocar}/></div>
                ))}
                <button style={{...S.submitBtn,background:'linear-gradient(135deg,#4338ca,#6366f1)'}} onClick={handlePres2Submit}><Plus size={16}/>{presEditId2?'Guardar':'Agregar crédito'}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
