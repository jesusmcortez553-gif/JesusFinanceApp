import React from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Package, ArrowUpCircle, ArrowDownCircle, Wallet,
  Pencil, Trash2, User, ChevronRight, Calendar,
  AlertTriangle, CreditCard, Clock, Flame, Plus,
} from 'lucide-react';
import { CAT_ICONOS } from '../constants/categorias';
import { fmt, fmtInt, fmtFecha, diasHasta } from '../utils/format';
import { alertaTC } from '../utils/bcp';
import CustomTooltip from '../components/CustomTooltip';
import { S } from '../estilos';

// Página de Inicio: dashboard, gráfico de movimientos, gastos por categoría
// y transacciones recientes. Puramente presentacional — toda la data y los
// handlers vienen de App.js.
export default function PaginaInicio({
  user, onLogout, streak,
  saldoCuenta, setShowSaldoSetup,
  stats, alertas, gastoPorCat, proximosVenc,
  chartPeriod, setChartPeriod, areaData, barData,
  catData, maxGasto, showAll, setShowAll, recentTxs,
  handleTxEdit, handleTxDel,
}) {
  return (
    <>
      <div style={S.header}>
        <div style={S.bubble(-40,'-40px',undefined,undefined,160,160,0.07)}/>
        <div style={S.bubble(20,'60px',undefined,undefined,80,80,0.05)}/>
        <div style={S.bubble(undefined,undefined,'-15px','-15px',110,110,0.04)}/>
        <div style={S.hContent}>
          <div style={S.topRow}>
            <div><div style={S.greeting}>Buenos días</div><div style={S.userName}>{user?.displayName?.split(' ')[0]||'Jesús'}</div></div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              {streak && streak.dias > 0 && (
                <div style={{display:'flex',alignItems:'center',gap:4,background:'rgba(255,255,255,0.15)',borderRadius:20,padding:'4px 10px'}}>
                  <Flame size={14} color="#f97316"/>
                  <span style={{color:'#fff',fontSize:12,fontWeight:700}}>{streak.dias}</span>
                </div>
              )}
              {user?.photoURL
                ? <img src={user.photoURL} alt="avatar" style={{width:38,height:38,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.4)',cursor:'pointer'}} onClick={onLogout}/>
                : <div style={S.avatarCircle} onClick={onLogout}><User size={20} color="rgba(255,255,255,0.9)"/></div>
              }
            </div>
          </div>
          <div style={S.balLabel}>Balance total</div>
          <div style={S.balAmount}>{fmt(stats.balance)}</div>
          {saldoCuenta !== null && (
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:8,background:'rgba(255,255,255,0.12)',borderRadius:12,padding:'6px 12px',width:'fit-content'}}>
              <Wallet size={13} color="rgba(255,255,255,0.7)"/>
              <span style={{color:'rgba(255,255,255,0.7)',fontSize:12}}>En cuenta: </span>
              <span style={{color:'#fff',fontSize:13,fontWeight:800}}>{fmt(saldoCuenta)}</span>
              <button onClick={()=>setShowSaldoSetup(true)} style={{background:'none',border:'none',cursor:'pointer',padding:0,marginLeft:2}}>
                <Pencil size={11} color="rgba(255,255,255,0.5)"/>
              </button>
            </div>
          )}
          {saldoCuenta === null && (
            <button onClick={()=>setShowSaldoSetup(true)} style={{marginTop:8,background:'rgba(255,255,255,0.12)',border:'1px dashed rgba(255,255,255,0.3)',borderRadius:12,padding:'6px 12px',color:'rgba(255,255,255,0.6)',fontSize:12,fontFamily:'inherit',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
              <Plus size={12} color="rgba(255,255,255,0.6)"/> Agregar saldo de cuenta
            </button>
          )}
          <div style={S.pillRow}><button style={S.pill(true)}>Resumen</button><button style={S.pill(false)}>Mayo 2026</button></div>
        </div>
      </div>

      {alertas.length>0 && (
        <div style={{padding:'12px 16px 0'}}>
          {alertas.map(a=>{ const pct=Math.round((gastoPorCat[a.categoria]||0)/a.limite*100); const sobre=pct>=100;
            return <div key={a.id} style={{background:sobre?'#fef2f2':'#fffbeb',border:`1px solid ${sobre?'#fecaca':'#fde68a'}`,borderRadius:14,padding:'10px 14px',marginBottom:8,display:'flex',alignItems:'center',gap:10}}><AlertTriangle size={16} color={sobre?'#ef4444':'#f59e0b'}/><div style={{flex:1}}><span style={{fontSize:12,fontWeight:700,color:sobre?'#dc2626':'#92400e'}}>{sobre?`Límite superado: ${a.categoria}`:`Casi en límite: ${a.categoria}`}</span><span style={{fontSize:11,color:'#9ca3af',marginLeft:6}}>{pct}%</span></div></div>;
          })}
        </div>
      )}

      {/* Alertas TC facturación y pago */}
      {alertaTC().map((a,i)=>(
        <div key={i} style={{margin:'8px 16px 0',background:a.bg,border:`1px solid ${a.border}`,borderRadius:14,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
          <Calendar size={16} color={a.color}/>
          <div style={{flex:1}}><span style={{fontSize:12,fontWeight:700,color:a.color}}>{a.msg}</span></div>
        </div>
      ))}

      {/* Alerta vencimientos próximos */}
      {proximosVenc.filter(v=>diasHasta(v.fecha)<=10).map((v,i)=>(
        <div key={i} style={{margin:'8px 16px 0',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:14,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
          <Clock size={16} color="#ef4444"/>
          <div style={{flex:1}}>
            <span style={{fontSize:12,fontWeight:700,color:'#dc2626'}}>Pago en {diasHasta(v.fecha)} días — {v.nombre}</span>
            <div style={{fontSize:12,color:'#9ca3af'}}>{fmt(v.monto)} · {fmtFecha(v.fecha)}</div>
          </div>
        </div>
      ))}

      <div style={(alertas.length>0 || alertaTC().length>0 || proximosVenc.filter(v=>diasHasta(v.fecha)<=10).length>0) ? S.statsRowWithAlerts : S.statsRow}>
        {[{label:'Ingresos',val:stats.ingresos,color:'#10b981',Icon:ArrowUpCircle},{label:'Gastos',val:stats.gastos,color:'#ef4444',Icon:ArrowDownCircle},{label:'Ahorro',val:stats.balance,color:'#7c3aed',Icon:Wallet}].map(s=>(
          <div key={s.label} style={S.statCard}><div style={S.statIconWrap(s.color)}><s.Icon size={16} color={s.color}/></div><div style={S.statLabel}>{s.label}</div><div style={S.statVal(s.color)}>{fmt(s.val)}</div></div>
        ))}
      </div>

      <div style={S.section}>
        <div style={S.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={S.secTitle}>Movimientos</div>
            <div style={S.chartToggle}>{['día','mes'].map(p=><button key={p} style={S.chartBtn(chartPeriod===p)} onClick={()=>setChartPeriod(p)}>{p}</button>)}</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            {chartPeriod==='día' ? (
              <AreaChart data={areaData} margin={{top:5,right:5,left:-25,bottom:0}}>
                <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="dia" tick={{fontSize:9,fill:'#9ca3af'}} interval={6}/><YAxis tick={{fontSize:9,fill:'#9ca3af'}}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="monto" stroke="#7c3aed" strokeWidth={2.5} fill="url(#grad)" dot={false} activeDot={{r:4,fill:'#7c3aed'}}/>
              </AreaChart>
            ) : (
              <BarChart data={barData} margin={{top:5,right:5,left:-25,bottom:0}}>
                <XAxis dataKey="mes" tick={{fontSize:9,fill:'#9ca3af'}}/><YAxis tick={{fontSize:9,fill:'#9ca3af'}}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="ingresos" fill="#10b981" radius={[5,5,0,0]}/><Bar dataKey="gastos" fill="#7c3aed" radius={[5,5,0,0]}/>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div style={S.section}>
        <div style={S.card}>
          {catData.map(([cat,total])=>{ const info=CAT_ICONOS[cat]||{icon:Package,color:'#6b7280'}; const Icon=info.icon; return (
            <div key={cat} style={S.catRow}><div style={S.catTop}><div style={S.catName}><div style={{width:28,height:28,borderRadius:9,background:info.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={14} color={info.color}/></div>{cat}</div><span style={S.catAmt}>{fmtInt(total)}</span></div><div style={S.progBg}><div style={S.progFill(info.color,Math.round(total/maxGasto*100))}/></div></div>
          );})}
        </div>
      </div>

      <div style={S.section}>
        <div style={S.secHeader}><div style={S.secTitle}>Recientes</div><button style={S.seeAll} onClick={()=>setShowAll(v=>!v)}>{showAll?'Ver menos':'Ver todo'}<ChevronRight size={13} color="#7c3aed"/></button></div>
        <div style={S.card}>
          {recentTxs.map((t,i)=>{ const info=CAT_ICONOS[t.categoria]||{icon:Package,color:'#6b7280'}; const Icon=info.icon; return (
            <div key={t.id} style={S.txItem(i===recentTxs.length-1)}>
              <div style={S.txIconWrap(info.color)}><Icon size={17} color={info.color}/></div>
              <div style={{flex:1,minWidth:0}}><div style={S.txName}>{t.descripcion}</div><div style={S.txMeta}>{t.categoria} · {fmtFecha(t.fecha)}{t.medioPago==='tc'?<> · <CreditCard size={9} color="#b45309" style={{display:'inline',verticalAlign:'middle',marginLeft:2}}/></>:''}</div></div>
              <div style={S.txAmt(t.tipo)}>{t.tipo==='ingreso'?'+':'-'}{fmt(t.monto)}</div>
              <button onClick={()=>handleTxEdit(t)} style={S.actionBtn('#f5f3ff')}><Pencil size={13} color="#7c3aed"/></button>
              <button onClick={()=>handleTxDel(t.id)} style={S.actionBtn('#fef2f2')}><Trash2 size={13} color="#ef4444"/></button>
            </div>
          );})}
        </div>
      </div>
    </>
  );
}
