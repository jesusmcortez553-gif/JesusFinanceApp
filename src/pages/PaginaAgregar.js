import React from 'react';
import {
  Package, ArrowUpCircle, ArrowDownCircle, Wallet,
  Calendar, AlertTriangle, CheckCircle, CreditCard, Plus,
} from 'lucide-react';
import { CAT_ICONOS, CATS_GASTO, CATS_INGRESO } from '../constants/categorias';
import { extraerMonto } from '../utils/clasificar';
import { getCicloActual } from '../utils/bcp';
import { S, enfocar, desenfocar } from '../estilos';

// Página Agregar: formulario de nueva transacción / edición. Toda la lógica
// de clasificación automática y el submit viven en App.js; esta página solo
// renderiza el formulario y delega en los handlers recibidos por props.
export default function PaginaAgregar({
  txForm, setTxForm, txEditId,
  autoClasif, setAutoClasif, alertaEmoc, setAlertaEmoc, alertaAceptada, tipoEspecial,
  medioPago, setMedioPago, showDatePicker, setShowDatePicker,
  handleDescChange, elegirCategoria, handleTxSubmit, tcs,
}) {
  return (
    <div>
      <div style={S.pageHeader()}><div style={S.bubble(-40,'-40px',undefined,undefined,140,140,0.07)}/><div style={S.pageTitle}>{txEditId?'Editar':'Nueva transacción'}</div><div style={S.pageSub}>Registra tus movimientos</div></div>
      <div style={S.formWrap}><div style={S.formCard}>

        {/* Tipo toggle */}
        <div style={S.typeToggle}>{['gasto','ingreso'].map(tipo=><button key={tipo} style={S.typeBtn(txForm.tipo===tipo,tipo)} onClick={()=>{setTxForm(f=>({...f,tipo,categoria:tipo==='gasto'?'Alimentación':'Salario'}));setAutoClasif(null);setAlertaEmoc(null);setMedioPago('efectivo');}}>{tipo==='ingreso'?<><ArrowUpCircle size={16}/>Ingreso</>:<><ArrowDownCircle size={16}/>Gasto</>}</button>)}</div>

        {/* Descripción + monto en una línea */}
        <label style={S.label}>¿Qué compraste? (puedes incluir el monto)</label>
        <input style={S.input} type="text" placeholder="ej: ceviche 29 · uber 12 · salario 2500"
          value={txForm.descripcion}
          onChange={e=>handleDescChange(e.target.value)}
          onFocus={enfocar} onBlur={desenfocar}/>
        {extraerMonto(txForm.descripcion).monto && (
          <div style={{marginTop:-8,marginBottom:10,display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'#f0fdf4',borderRadius:10,border:'1px solid #bbf7d0'}}>
            <CheckCircle size={13} color="#16a34a"/>
            <span style={{fontSize:12,color:'#16a34a',fontWeight:600}}>
              Monto detectado: S/ {extraerMonto(txForm.descripcion).monto}
            </span>
          </div>
        )}

        {/* SUGERENCIAS DE CATEGORÍA EN TIEMPO REAL */}
        {txForm.tipo==='gasto' && txForm.descripcion.length >= 2 && (()=>{
          const elegida = autoClasif?.elegida ? autoClasif.categoria : null;
          const sugerencias = autoClasif
            ? [autoClasif.categoria, ...CATS_GASTO.filter(c=>c!==autoClasif.categoria).slice(0,2)]
            : CATS_GASTO.slice(0,4);
          return (
            <div style={{marginBottom:14,marginTop:-4}}>
              {autoClasif && (
                <div style={{fontSize:11,color:'#9ca3af',marginBottom:8,display:'flex',alignItems:'center',gap:5}}>
                  <CheckCircle size={11} color="#10b981"/>
                  Detecté <strong style={{color:'#1f1b4b'}}>{autoClasif.categoria}</strong>{autoClasif.forzado?' · categoría explícita':autoClasif.ajustado?' · ajustado por horario':''} — toca para confirmar u elige otra
                </div>
              )}
              {!autoClasif && (
                <div style={{fontSize:11,color:'#9ca3af',marginBottom:8}}>
                  No reconocí la categoría — elige una:
                </div>
              )}
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {sugerencias.map((cat,i) => {
                  const info = CAT_ICONOS[cat]||{icon:Package,color:'#6b7280'};
                  const Icon = info.icon;
                  const esDetectada = i===0 && autoClasif && !elegida;
                  const esElegida   = elegida === cat;
                  return (
                    <button key={cat} onClick={()=>elegirCategoria(cat)}
                      style={{display:'flex',alignItems:'center',gap:6,
                        padding:'7px 13px',borderRadius:20,border:'none',cursor:'pointer',
                        fontFamily:'inherit',fontSize:12,fontWeight:700,transition:'all 0.15s',
                        background: esElegida ? info.color : esDetectada ? info.color+'22' : '#f5f3ff',
                        color:       esElegida ? '#fff'       : esDetectada ? info.color       : '#6b7280',
                        boxShadow:   esElegida ? `0 4px 12px ${info.color}44` : 'none',
                        transform:   esElegida ? 'scale(1.05)' : 'scale(1)',
                      }}>
                      <Icon size={13} color={esElegida?'#fff':info.color}/>
                      {cat}
                      {esDetectada && !esElegida && <span style={{fontSize:9,opacity:0.7}}>sugerida</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Monto — se llena solo si escribiste el número en la descripción */}
        <label style={S.label}>
          Monto (S/.) {extraerMonto(txForm.descripcion).monto ? <span style={{color:'#10b981',fontSize:10,fontWeight:600}}>✓ detectado</span> : <span style={{color:'#9ca3af',fontSize:10}}>o escríbelo aquí</span>}
        </label>
        <input style={S.input} type="number" placeholder="0.00" value={txForm.monto}
          onChange={e=>setTxForm(p=>({...p,monto:e.target.value}))} onFocus={enfocar} onBlur={desenfocar}/>

        {/* Fecha — hoy por defecto, botón ayer, picker opcional */}
        <label style={S.label}>¿Cuándo fue?</label>
        <div style={{display:'flex',gap:8,marginBottom:showDatePicker?8:12}}>
          {(()=>{ const hoyDate=new Date(); const ayerDate=new Date(); ayerDate.setDate(ayerDate.getDate()-1); const fmtLocal=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; return [{label:'Hoy',val:fmtLocal(hoyDate)},{label:'Ayer',val:fmtLocal(ayerDate)}]; })().map(op=>(
            <button key={op.label} onClick={()=>{setTxForm(p=>({...p,fecha:op.val}));setShowDatePicker(false);}}
              style={{flex:1,padding:'10px',borderRadius:12,border:`2px solid ${txForm.fecha===op.val&&!showDatePicker?'#7c3aed':'#f0eeff'}`,
                background:txForm.fecha===op.val&&!showDatePicker?'#f5f3ff':'#fafaf9',
                color:txForm.fecha===op.val&&!showDatePicker?'#7c3aed':'#9ca3af',
                fontWeight:700,fontSize:13,fontFamily:'inherit',cursor:'pointer',transition:'all 0.15s'}}>
              {op.label}
            </button>
          ))}
          <button onClick={()=>setShowDatePicker(v=>!v)}
            style={{flex:1,padding:'10px',borderRadius:12,border:`2px solid ${showDatePicker?'#7c3aed':'#f0eeff'}`,
              background:showDatePicker?'#f5f3ff':'#fafaf9',color:showDatePicker?'#7c3aed':'#9ca3af',
              fontWeight:700,fontSize:13,fontFamily:'inherit',cursor:'pointer',transition:'all 0.15s',
              display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
            <Calendar size={14} color={showDatePicker?'#7c3aed':'#9ca3af'}/>Otra
          </button>
        </div>
        {showDatePicker && (
          <input style={{...S.input,marginBottom:12}} type="date" value={txForm.fecha}
            onChange={e=>setTxForm(p=>({...p,fecha:e.target.value}))} onFocus={enfocar} onBlur={desenfocar}/>
        )}

        {/* Medio de pago — solo para gastos */}
        {txForm.tipo==='gasto' && !tipoEspecial && (
          <div style={{marginBottom:14}}>
            <label style={S.label}>¿Cómo pagaste?</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[{id:'efectivo',label:'Efectivo / Cuenta',sub:'Resta tu balance'}, ...(tcs.length > 0 ? tcs.map(tc=>({id:`tc_${tc.id}`,label:`${tc.banco} ${tc.numero}`,sub:'Sube deuda TC'})) : [{id:'tc',label:'VISA ****2769',sub:'Agrega tu TC en Deudas'}])].map(mp=>(
                <button key={mp.id} onClick={()=>setMedioPago(mp.id)}
                  style={{padding:'10px 12px',borderRadius:12,border:`2px solid ${medioPago===mp.id?'#7c3aed':'#f0eeff'}`,
                    background:medioPago===mp.id?'#f5f3ff':'#fafaf9',
                    cursor:'pointer',fontFamily:'inherit',textAlign:'left',transition:'all 0.15s'}}>
                  <div style={{fontSize:12,fontWeight:700,color:medioPago===mp.id?'#7c3aed':'#1f1b4b',marginBottom:2,display:'flex',alignItems:'center',gap:5}}>
                    {mp.id==='tc'?<CreditCard size={12} color={medioPago===mp.id?'#7c3aed':'#9ca3af'}/>:<Wallet size={12} color={medioPago===mp.id?'#7c3aed':'#9ca3af'}/>}
                    {mp.label}
                  </div>
                  <div style={{fontSize:10,color:'#9ca3af'}}>{mp.sub}</div>
                </button>
              ))}
            </div>
            {medioPago==='tc' && (
              <div style={{marginTop:8,background:'#fef9ec',border:'1px solid #fde68a',borderRadius:10,padding:'8px 12px',fontSize:11,color:'#92400e'}}>
                Este gasto no restará tu balance — se suma a tu deuda TC y pagas el {getCicloActual().limitePago}
              </div>
            )}
          </div>
        )}

        {/* Categoría final — solo visible si no hay sugerencias activas */}
        {(txForm.tipo==='ingreso' || txForm.descripcion.length < 2) && (
          <div>
            <label style={S.label}>Categoría</label>
            <select style={S.select} value={txForm.categoria}
              onChange={e=>setTxForm(p=>({...p,categoria:e.target.value}))}>
              {(txForm.tipo==='gasto'?CATS_GASTO:CATS_INGRESO).map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        )}
        {/* Indicador de categoría elegida */}
        {txForm.tipo==='gasto' && txForm.descripcion.length >= 2 && (autoClasif?.elegida) && (()=>{
          const cat = txForm.categoria;
          const info = CAT_ICONOS[cat]||{icon:Package,color:'#6b7280'};
          const Icon = info.icon;
          return (
            <div style={{display:'flex',alignItems:'center',gap:8,background:info.color+'12',border:`1.5px solid ${info.color}30`,borderRadius:12,padding:'10px 14px',marginBottom:12}}>
              <Icon size={16} color={info.color}/>
              <span style={{fontSize:13,fontWeight:700,color:info.color}}>Categoría: {cat}</span>
              <button onClick={()=>setAutoClasif(prev=>({...prev,elegida:false}))} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',fontSize:11,color:'#9ca3af'}}>cambiar</button>
            </div>
          );
        })()}

        {/* ALERTA EMOCIONAL */}
        {alertaEmoc && (
          <div style={{background:alertaEmoc.bg,border:`1.5px solid ${alertaEmoc.border}`,borderRadius:16,padding:'14px 16px',marginBottom:14}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
              <AlertTriangle size={18} color={alertaEmoc.color} style={{flexShrink:0,marginTop:1}}/>
              <div style={{fontSize:13,color:alertaEmoc.color,fontWeight:600,lineHeight:1.5}}>{alertaEmoc.msg}</div>
            </div>
            {alertaAceptada && (
              <div style={{fontSize:12,color:alertaEmoc.color,fontStyle:'italic',marginBottom:8,paddingLeft:28}}>
                Entendido. Si aun así quieres registrarlo, toca "Registrar" de nuevo.
              </div>
            )}
          </div>
        )}

        {/* BANNER TIPO ESPECIAL */}
        {tipoEspecial === 'salario' && (
          <div style={{background:'#f0fdf4',border:'1.5px solid #86efac',borderRadius:14,padding:'12px 14px',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <CheckCircle size={15} color="#16a34a"/>
              <span style={{fontSize:13,fontWeight:700,color:'#16a34a'}}>Salario detectado</span>
            </div>
            <div style={{fontSize:12,color:'#166534',lineHeight:1.5}}>
              Se registrará como ingreso. Recuerda pagar tus cuotas manualmente desde la pestaña Deudas cuando corresponda.
            </div>
          </div>
        )}
        {tipoEspecial === 'disposicion' && (
          <div style={{background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:14,padding:'12px 14px',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <AlertTriangle size={15} color="#dc2626"/>
              <span style={{fontSize:13,fontWeight:700,color:'#dc2626'}}>Disposición de efectivo</span>
            </div>
            <div style={{fontSize:12,color:'#991b1b',lineHeight:1.5}}>
              Se registrará como ingreso y subirá tu deuda en la VISA BCP.<br/>
              <strong>TEA: 87.50%</strong> — intereses desde el primer día.
            </div>
          </div>
        )}
        {tipoEspecial === 'pagoTC' && (
          <div style={{background:'#eff6ff',border:'1.5px solid #bfdbfe',borderRadius:14,padding:'12px 14px',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <CreditCard size={15} color="#1d4ed8"/>
              <span style={{fontSize:13,fontWeight:700,color:'#1d4ed8'}}>Pago de tarjeta detectado</span>
            </div>
            <div style={{fontSize:12,color:'#1e40af',lineHeight:1.5}}>
              El monto se descontará del consumido de tu VISA BCP ****2769.
            </div>
          </div>
        )}

        <button style={{...S.submitBtn, background: alertaEmoc && !alertaAceptada ? `linear-gradient(135deg,${alertaEmoc.color},${alertaEmoc.color}cc)` : tipoEspecial==='disposicion' ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : tipoEspecial==='salario' ? 'linear-gradient(135deg,#16a34a,#15803d)' : tipoEspecial==='pagoTC' ? 'linear-gradient(135deg,#1d4ed8,#1e40af)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)'}}
          onClick={handleTxSubmit}>
          <Plus size={18}/>
          {alertaEmoc && !alertaAceptada ? 'Soy consciente — continuar' : tipoEspecial==='salario' ? 'Registrar salario' : tipoEspecial==='disposicion' ? 'Confirmar disposición' : tipoEspecial==='pagoTC' ? 'Registrar pago TC' : txEditId?'Guardar cambios':'Registrar'}
        </button>

      </div></div>
    </div>
  );
}
