import React from 'react';
import { Plus, X, PiggyBank, TrendingUp, Package } from 'lucide-react';
import { CATS_GASTO, CAT_ICONOS } from '../constants/categorias';
import { fmtInt } from '../utils/format';
import { generarSugerencias } from '../utils/clasificar';
import PresupuestoCard from '../components/PresupuestoCard';
import MetaCard from '../components/MetaCard';
import { S, enfocar, desenfocar } from '../estilos';

// Página Metas: presupuestos por categoría + metas de ahorro. Los handlers
// de submit/borrado viven en App.js; esta página también dispara addPres y
// setPresupuestos directamente para el botón "Activar todos" de sugerencias
// (igual que en el App.js original).
export default function PaginaMetas({
  presupuestos, gastoPorCat,
  showPresForm, setShowPresForm, presForm, setPresForm, presEditId, setPresEditId,
  handlePresSubmit, handlePresDel,
  txs, sugerenciasDescartadas, setSugerenciasDescartadas, addPres, setPresupuestos,
  metas, showMetaForm, setShowMetaForm, metaForm, setMetaForm, metaEditId, setMetaEditId,
  handleMetaSubmit, handleMetaDel,
  abonarMetaId, setAbonarMetaId, abonarMonto, setAbonarMonto, handleAbonar,
}) {
  return (
    <div>
      <div style={S.pageHeader('linear-gradient(135deg,#0f766e,#0d9488)')}>
        <div style={S.bubble(-40,'-40px',undefined,undefined,140,140,0.07)}/>
        <div style={S.pageTitle}>Presupuestos y Metas</div><div style={S.pageSub}>Controla tus límites y objetivos</div>
      </div>
      <div style={{padding:'16px'}}>
        {(() => { const total=presupuestos.reduce((s,p)=>s+p.limite,0); const gastado=presupuestos.reduce((s,p)=>s+(gastoPorCat[p.categoria]||0),0); const pct=total>0?Math.min(100,Math.round(gastado/total*100)):0; return (
          <div style={{background:'linear-gradient(135deg,#0f766e,#0d9488)',borderRadius:20,padding:'16px',marginBottom:16,boxShadow:'0 4px 20px rgba(13,148,136,0.25)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div><div style={{color:'rgba(255,255,255,0.7)',fontSize:11,textTransform:'uppercase',letterSpacing:0.5,marginBottom:3}}>Presupuesto total</div><div style={{color:'#fff',fontSize:24,fontWeight:800}}>{fmtInt(total)}</div></div>
              <div style={{textAlign:'right'}}><div style={{color:'rgba(255,255,255,0.7)',fontSize:11,marginBottom:3}}>Usado</div><div style={{color:'#fff',fontSize:24,fontWeight:800}}>{pct}%</div></div>
            </div>
            <div style={{background:'rgba(255,255,255,0.2)',borderRadius:100,height:8,overflow:'hidden'}}><div style={{width:`${pct}%`,height:'100%',background:'#fff',borderRadius:100}}/></div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}><span style={{color:'rgba(255,255,255,0.7)',fontSize:11}}>{fmtInt(gastado)} gastado</span><span style={{color:'rgba(255,255,255,0.7)',fontSize:11}}>{fmtInt(total-gastado)} libre</span></div>
          </div>
        ); })()}

        {/* Sugerencias automáticas */}
        {(()=>{
          const sugs = generarSugerencias(txs, presupuestos);
          if (sugs.length===0 || sugerenciasDescartadas) return null;
          return (
            <div style={{background:'linear-gradient(135deg,#0f766e,#0d9488)',borderRadius:18,padding:'16px',marginBottom:14,boxShadow:'0 4px 20px rgba(13,148,136,0.2)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <TrendingUp size={15} color="rgba(255,255,255,0.8)"/>
                <span style={{color:'#fff',fontSize:13,fontWeight:800}}>Presupuestos sugeridos</span>
              </div>
              <div style={{color:'rgba(255,255,255,0.7)',fontSize:11,marginBottom:12,lineHeight:1.5}}>Basado en tus últimos gastos, te sugiero estos límites:</div>
              {sugs.map((s,i)=>{
                const info=CAT_ICONOS[s.categoria]||{icon:Package,color:'#6b7280'};
                return (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.15)',borderRadius:12,padding:'10px 12px',marginBottom:8}}>
                    <div style={{width:32,height:32,borderRadius:10,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><info.icon size={15} color="#fff"/></div>
                    <div style={{flex:1}}>
                      <div style={{color:'#fff',fontSize:12,fontWeight:700}}>{s.categoria}</div>
                      <div style={{color:'rgba(255,255,255,0.6)',fontSize:10}}>basado en {s.basadoEn} gastos</div>
                    </div>
                    <div style={{color:'#fff',fontSize:14,fontWeight:800}}>S/ {s.sugerido}</div>
                  </div>
                );
              })}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:4}}>
                <button onClick={()=>{sugs.forEach(s=>{setPresupuestos(prev=>[...prev,{id:'temp_'+Date.now()+Math.random(),categoria:s.categoria,limite:s.sugerido}]);if(addPres) addPres({categoria:s.categoria,limite:s.sugerido}).catch(err=>console.error('[PaginaMetas] addPres (sugerencia) falló:', err));});setSugerenciasDescartadas(true);}}
                  style={{padding:'10px',borderRadius:12,border:'none',background:'#fff',color:'#0f766e',fontWeight:800,fontSize:13,fontFamily:'inherit',cursor:'pointer'}}>
                  Activar todos
                </button>
                <button onClick={()=>setSugerenciasDescartadas(true)}
                  style={{padding:'10px',borderRadius:12,border:'1.5px solid rgba(255,255,255,0.4)',background:'transparent',color:'rgba(255,255,255,0.8)',fontWeight:700,fontSize:13,fontFamily:'inherit',cursor:'pointer'}}>
                  No por ahora
                </button>
              </div>
            </div>
          );
        })()}

        <div style={S.secHeader}>
          <div style={S.secTitle}>Por categoría</div>
          <button style={{...S.seeAll,background:'linear-gradient(135deg,#0d9488,#0f766e)',color:'#fff',padding:'6px 12px',borderRadius:20}} onClick={()=>{setPresForm({categoria:'Alimentación',limite:''});setPresEditId(null);setShowPresForm(true);}}><Plus size={12}/>Nuevo</button>
        </div>
        {showPresForm && (
          <div style={{...S.formCard,marginBottom:12,border:'1px solid #ccfbf1'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><span style={{fontSize:14,fontWeight:700,color:'#1f1b4b'}}>{presEditId?'Editar':'Nuevo presupuesto'}</span><button onClick={()=>{setShowPresForm(false);setPresEditId(null);}} style={{background:'none',border:'none',cursor:'pointer'}}><X size={18} color="#9ca3af"/></button></div>
            <label style={S.label}>Categoría</label><select style={S.select} value={presForm.categoria} onChange={e=>setPresForm(p=>({...p,categoria:e.target.value}))}>{CATS_GASTO.map(c=><option key={c}>{c}</option>)}</select>
            <label style={S.label}>Límite mensual (S/.)</label><input style={S.input} type="number" placeholder="0.00" value={presForm.limite} onChange={e=>setPresForm(p=>({...p,limite:e.target.value}))} onFocus={enfocar} onBlur={desenfocar}/>
            <button style={{...S.submitBtn,background:'linear-gradient(135deg,#0d9488,#0f766e)'}} onClick={handlePresSubmit}><Plus size={16}/>{presEditId?'Guardar':'Agregar'}</button>
          </div>
        )}
        {presupuestos.map(p=><PresupuestoCard key={p.id} presupuesto={p} gastado={gastoPorCat[p.categoria]||0} onEdit={()=>{setPresForm({categoria:p.categoria,limite:String(p.limite)});setPresEditId(p.id);setShowPresForm(true);}} onDelete={()=>handlePresDel(p.id)}/>)}

        <div style={{...S.secHeader,marginTop:8}}>
          <div style={S.secTitle}>Metas de ahorro</div>
          <button style={{...S.seeAll,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',padding:'6px 12px',borderRadius:20}} onClick={()=>{setMetaForm({nombre:'',objetivo:'',actual:'',color:'#6366f1'});setMetaEditId(null);setShowMetaForm(true);}}><Plus size={12}/>Nueva</button>
        </div>
        {showMetaForm && (
          <div style={{...S.formCard,marginBottom:12,border:'1px solid #ede9fe'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><span style={{fontSize:14,fontWeight:700,color:'#1f1b4b'}}>{metaEditId?'Editar':'Nueva meta'}</span><button onClick={()=>{setShowMetaForm(false);setMetaEditId(null);}} style={{background:'none',border:'none',cursor:'pointer'}}><X size={18} color="#9ca3af"/></button></div>
            {[{l:'Nombre',k:'nombre',t:'text',ph:'ej. Vacaciones'},{l:'Objetivo (S/.)',k:'objetivo',t:'number',ph:'0.00'},{l:'Ya tengo (S/.)',k:'actual',t:'number',ph:'0.00'}].map(f=><div key={f.k}><label style={S.label}>{f.l}</label><input style={S.input} type={f.t} placeholder={f.ph} value={metaForm[f.k]} onChange={e=>setMetaForm(p=>({...p,[f.k]:e.target.value}))} onFocus={enfocar} onBlur={desenfocar}/></div>)}
            <label style={S.label}>Color</label>
            <div style={{display:'flex',gap:8,marginBottom:16}}>{['#6366f1','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4'].map(c=><div key={c} onClick={()=>setMetaForm(p=>({...p,color:c}))} style={{width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',border:metaForm.color===c?'3px solid #1f1b4b':'3px solid transparent'}}/>)}</div>
            <button style={S.submitBtn} onClick={handleMetaSubmit}><Plus size={16}/>{metaEditId?'Guardar':'Crear meta'}</button>
          </div>
        )}
        {abonarMetaId && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
            <div style={{background:'#fff',borderRadius:'24px 24px 0 0',padding:'24px',width:'100%',maxWidth:420}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><span style={{fontSize:16,fontWeight:800,color:'#1f1b4b'}}>Abonar a meta</span><button onClick={()=>setAbonarMetaId(null)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={20} color="#9ca3af"/></button></div>
              <label style={S.label}>Monto (S/.)</label>
              <input style={S.input} type="number" placeholder="0.00" value={abonarMonto} onChange={e=>setAbonarMonto(e.target.value)} onFocus={enfocar} onBlur={desenfocar} autoFocus/>
              <button style={S.submitBtn} onClick={handleAbonar}><PiggyBank size={18}/>Abonar</button>
            </div>
          </div>
        )}
        {metas.map(m=><MetaCard key={m.id} meta={m} onAbonar={()=>{setAbonarMetaId(m.id);setAbonarMonto('');}} onEdit={()=>{setMetaForm({nombre:m.nombre,objetivo:String(m.objetivo),actual:String(m.actual),color:m.color});setMetaEditId(m.id);setShowMetaForm(true);}} onDelete={()=>handleMetaDel(m.id)}/>)}
      </div>
    </div>
  );
}
