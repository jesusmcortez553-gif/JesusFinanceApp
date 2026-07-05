import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Package, Pencil, TrendingDown, TrendingUp, BarChart2,
  Target, Search, Calendar, CreditCard, Clock, Receipt, Landmark, CheckCircle,
} from 'lucide-react';
import { CAT_ICONOS } from '../constants/categorias';
import { fmt, fmtFecha } from '../utils/format';
import { getCicloActual, parseLimitePago } from '../utils/bcp';
import CustomTooltip from '../components/CustomTooltip';
import { S } from '../estilos';

// Página Stats: score financiero, insights automáticos, distribución de
// gastos y fechas importantes. Toda la data llega calculada desde App.js
// (useMemo); esta página solo la presenta.
export default function PaginaStats({
  saldoCuenta, setShowSaldoSetup, stats, prestamos, topDay, txs, catData, barData,
}) {
  return (
    <div>
      <div style={S.pageHeader('linear-gradient(135deg,#0f172a,#1e3a5f)')}>
        <div style={S.bubble(-40,'-40px',undefined,undefined,140,140,0.07)}/>
        <div style={S.pageTitle}>Análisis Inteligente</div>
        <div style={S.pageSub}>Lo que tus números te dicen</div>
      </div>
      <div style={{padding:'16px'}}>

        {/* Saldo en cuenta */}
        {saldoCuenta !== null && (
          <div style={{background:'linear-gradient(135deg,#1d4ed8,#0891b2)',borderRadius:20,padding:'16px',marginBottom:14,boxShadow:'0 4px 20px rgba(29,78,216,0.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{color:'rgba(255,255,255,0.6)',fontSize:11,textTransform:'uppercase',letterSpacing:0.5,marginBottom:4}}>Saldo disponible en cuenta</div>
                <div style={{color:'#fff',fontSize:32,fontWeight:800}}>{fmt(saldoCuenta)}</div>
                <div style={{color:'rgba(255,255,255,0.6)',fontSize:11,marginTop:4}}>
                  {saldoCuenta < 200 ? 'Saldo bajo — considera reducir gastos' :
                   saldoCuenta < 500 ? 'Saldo moderado' : 'Saldo saludable'}
                </div>
              </div>
              <button onClick={()=>setShowSaldoSetup(true)} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:12,padding:'8px 12px',color:'#fff',fontSize:12,fontFamily:'inherit',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
                <Pencil size={13} color="#fff"/>Editar
              </button>
            </div>
          </div>
        )}

        {/* Score financiero */}
        {(() => {
          const tasaAhorro = stats.ingresos > 0 ? (stats.balance / stats.ingresos) * 100 : 0;
          const cuotasMes  = prestamos.reduce((s,p)=>s+p.cuotaMensual,0);
          const ratioDeuda = stats.ingresos > 0 ? (cuotasMes / stats.ingresos) * 100 : 0;
          let score = 100;
          if (tasaAhorro < 10) score -= 20;
          else if (tasaAhorro < 20) score -= 10;
          if (ratioDeuda > 40) score -= 25;
          else if (ratioDeuda > 30) score -= 15;
          else if (ratioDeuda > 20) score -= 5;
          const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
          const scoreLabel = score >= 80 ? 'Excelente' : score >= 60 ? 'Regular' : 'En riesgo';
          return (
            <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:20,padding:'18px',marginBottom:14,boxShadow:'0 8px 32px rgba(15,23,42,0.3)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{color:'rgba(255,255,255,0.6)',fontSize:11,textTransform:'uppercase',letterSpacing:0.5,marginBottom:6}}>Score financiero</div>
                  <div style={{color:scoreColor,fontSize:48,fontWeight:800,lineHeight:1}}>{score}</div>
                  <div style={{color:scoreColor,fontSize:13,fontWeight:700,marginTop:4}}>{scoreLabel}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <div style={{background:'rgba(255,255,255,0.08)',borderRadius:12,padding:'8px 12px'}}>
                      <div style={{color:'rgba(255,255,255,0.5)',fontSize:9,textTransform:'uppercase'}}>Tasa ahorro</div>
                      <div style={{color: tasaAhorro>=20?'#34d399':tasaAhorro>=10?'#fbbf24':'#f87171', fontSize:15,fontWeight:800}}>{tasaAhorro.toFixed(1)}%</div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.08)',borderRadius:12,padding:'8px 12px'}}>
                      <div style={{color:'rgba(255,255,255,0.5)',fontSize:9,textTransform:'uppercase'}}>Deuda/Ingreso</div>
                      <div style={{color: ratioDeuda<=20?'#34d399':ratioDeuda<=35?'#fbbf24':'#f87171', fontSize:15,fontWeight:800}}>{ratioDeuda.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{background:'rgba(255,255,255,0.1)',borderRadius:100,height:6,overflow:'hidden',marginTop:14}}>
                <div style={{width:`${score}%`,height:'100%',background:scoreColor,borderRadius:100,transition:'width 1s'}}/>
              </div>
            </div>
          );
        })()}

        {/* Día con más gastos */}
        {topDay && (() => {
          const diasData = {};
          txs.filter(t=>t.tipo==='gasto').forEach(t=>{ diasData[t.fecha]=(diasData[t.fecha]||0)+t.monto; });
          const top3 = Object.entries(diasData).sort((a,b)=>b[1]-a[1]).slice(0,3);
          return (
            <div style={{background:'#fff',borderRadius:20,padding:'16px',marginBottom:14,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <div style={{width:32,height:32,borderRadius:10,background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center'}}><TrendingDown size={16} color="#d97706"/></div>
                <div style={S.secTitle}>Días con más gastos</div>
              </div>
              {top3.map(([fecha,monto],i)=>(
                <div key={fecha} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<2?'1px solid #f5f3ff':'none'}}>
                  <div style={{width:24,height:24,borderRadius:8,background:i===0?'#fef3c7':i===1?'#f5f3ff':'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:i===0?'#d97706':'#6b7280'}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{fmtFecha(fecha)}</div>
                    <div style={{fontSize:11,color:'#9ca3af'}}>{txs.filter(t=>t.fecha===fecha&&t.tipo==='gasto').map(t=>t.descripcion).join(', ')}</div>
                  </div>
                  <div style={{fontSize:14,fontWeight:800,color:i===0?'#ef4444':'#1f1b4b'}}>{fmt(monto)}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Categoría que más crece */}
        {(() => {
          const top = catData[0];
          if (!top) return null;
          const [cat, total] = top;
          const info = CAT_ICONOS[cat]||{icon:Package,color:'#6b7280'};
          const Icon = info.icon;
          const pct  = stats.gastos > 0 ? Math.round(total/stats.gastos*100) : 0;
          return (
            <div style={{background:'#fff',borderRadius:20,padding:'16px',marginBottom:14,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <div style={{width:32,height:32,borderRadius:10,background:info.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={16} color={info.color}/></div>
                <div style={S.secTitle}>Mayor categoría de gasto</div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div>
                  <div style={{fontSize:20,fontWeight:800,color:'#1f1b4b'}}>{cat}</div>
                  <div style={{fontSize:12,color:'#9ca3af',marginTop:2}}>{pct}% del total de gastos</div>
                </div>
                <div style={{fontSize:22,fontWeight:800,color:info.color}}>{fmt(total)}</div>
              </div>
              <div style={{background:'#f5f3ff',borderRadius:100,height:8,overflow:'hidden'}}>
                <div style={{width:`${pct}%`,height:'100%',background:`linear-gradient(90deg,${info.color},${info.color}99)`,borderRadius:100}}/>
              </div>
            </div>
          );
        })()}

        {/* Pie por categoría */}
        <div style={{background:'#fff',borderRadius:20,padding:'16px',marginBottom:14,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <div style={{width:32,height:32,borderRadius:10,background:'#ede9fe',display:'flex',alignItems:'center',justifyContent:'center'}}><BarChart2 size={16} color="#7c3aed"/></div>
            <div style={S.secTitle}>Distribución de gastos</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={catData.map(([name,value])=>({name,value}))} cx="50%" cy="50%" innerRadius={52} outerRadius={78} dataKey="value" paddingAngle={3}>
                {catData.map(([cat],i)=><Cell key={i} fill={CAT_ICONOS[cat]?.color||'#6b7280'}/>)}
              </Pie>
              <Tooltip formatter={v=>fmt(v)}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {catData.map(([cat,val])=>{ const info=CAT_ICONOS[cat]||{icon:Package,color:'#6b7280'}; const Icon=info.icon; const pct=stats.gastos>0?Math.round(val/stats.gastos*100):0; return (
              <div key={cat} style={{display:'flex',alignItems:'center',gap:5,background:'#f9f8ff',borderRadius:20,padding:'4px 10px'}}>
                <Icon size={11} color={info.color}/>
                <span style={{fontSize:11,color:'#1f1b4b',fontWeight:600}}>{cat}</span>
                <span style={{fontSize:10,color:'#9ca3af'}}>{pct}%</span>
              </div>
            );})}
          </div>
        </div>

        {/* Mes a mes */}
        <div style={{background:'#fff',borderRadius:20,padding:'16px',marginBottom:14,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <div style={{width:32,height:32,borderRadius:10,background:'#dcfce7',display:'flex',alignItems:'center',justifyContent:'center'}}><TrendingUp size={16} color="#16a34a"/></div>
            <div style={S.secTitle}>Comparativa mensual</div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={barData} margin={{top:5,right:5,left:-25,bottom:0}}>
              <XAxis dataKey="mes" tick={{fontSize:9,fill:'#9ca3af'}}/><YAxis tick={{fontSize:9,fill:'#9ca3af'}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="ingresos" fill="#10b981" radius={[4,4,0,0]} name="Ingresos"/>
              <Bar dataKey="gastos"   fill="#7c3aed" radius={[4,4,0,0]} name="Gastos"/>
            </BarChart>
          </ResponsiveContainer>
          {barData.length >= 2 && (()=>{
            const ultimo = barData[barData.length-1];
            const anterior = barData[barData.length-2];
            const diffGasto = ultimo.gastos - (anterior?.gastos||0);
            const diffIngreso = ultimo.ingresos - (anterior?.ingresos||0);
            if (!ultimo.gastos) return null;
            return (
              <div style={{marginTop:10,background:'#f9f8ff',borderRadius:12,padding:'10px 12px'}}>
                <div style={{fontSize:12,color:'#1f1b4b',lineHeight:1.6}}>
                  {diffGasto > 0
                    ? <span>Gastas <strong style={{color:'#ef4444'}}>S/ {Math.abs(diffGasto).toFixed(0)} más</strong> que el mes pasado</span>
                    : <span>Gastas <strong style={{color:'#10b981'}}>S/ {Math.abs(diffGasto).toFixed(0)} menos</strong> que el mes pasado</span>}
                  {diffIngreso > 0 && <span> · Ingresos <strong style={{color:'#10b981'}}>+S/ {diffIngreso.toFixed(0)}</strong></span>}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Conclusiones inteligentes */}
        {(()=>{
          const insights = [];
          const tasaAhorro = stats.ingresos>0?(stats.balance/stats.ingresos)*100:0;
          const cuotasMes  = prestamos.reduce((s,p)=>s+p.cuotaMensual,0);
          const topCat     = catData[0];
          const gastosDiarios = txs.filter(t=>t.tipo==='gasto');
          const porDia = {0:0,1:0,2:0,3:0,4:0,5:0,6:0};
          gastosDiarios.forEach(t=>{ const d=new Date(t.fecha).getDay(); porDia[d]=(porDia[d]||0)+t.monto; });
          const diaMasGasto = Object.entries(porDia).sort((a,b)=>b[1]-a[1])[0];
          const diasSemana = ['domingos','lunes','martes','miércoles','jueves','viernes','sábados'];

          const gastoTC = txs.filter(t=>t.tipo==='gasto'&&t.medioPago==='tc').reduce((s,t)=>s+t.monto,0);
          const pctTC   = stats.gastos>0?Math.round(gastoTC/stats.gastos*100):0;

          if (tasaAhorro >= 20) insights.push({ color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'Target', titulo:`Ahorras el ${tasaAhorro.toFixed(1)}% de tus ingresos`, texto:`Estás por encima del 20% recomendado. Cada mes guardas ${fmt(stats.balance)} que trabajan para ti.` });
          else if (tasaAhorro > 0) insights.push({ color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', icon:'BarChart2', titulo:`Ahorro al ${tasaAhorro.toFixed(1)}%`, texto:`Para llegar al 20% recomendado necesitas ahorrar ${fmt(stats.ingresos*0.2)} al mes. Te faltan ${fmt(stats.ingresos*0.2-stats.balance)}.` });

          if (topCat && topCat[0] !== 'Deporte') insights.push({ color:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe', icon:'Search', titulo:`${topCat[0]} es tu mayor gasto`, texto:`Represents el ${Math.round(topCat[1]/stats.gastos*100)}% de tus gastos totales — equivale a ${fmt(topCat[1])} este mes.` });

          if (diaMasGasto && porDia[diaMasGasto[0]] > 0) insights.push({ color:'#0891b2', bg:'#eff6ff', border:'#bfdbfe', icon:'Calendar', titulo:`Los ${diasSemana[diaMasGasto[0]]} gastas más`, texto:`${fmt(diaMasGasto[1])} en total. Estar consciente de este patrón es el primer paso para cambiarlo.` });

          if (pctTC > 50) insights.push({ color:'#ef4444', bg:'#fef2f2', border:'#fecaca', icon:'CreditCard', titulo:`${pctTC}% de tus gastos van a TC`, texto:`Más de la mitad de tus gastos acumulan deuda. Cuando puedas, prioriza pagar con efectivo para no inflar el consumido.` });
          else if (pctTC > 0) insights.push({ color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'CreditCard', titulo:`Solo el ${pctTC}% va a TC`, texto:`Buen balance. Usas la tarjeta con moderación. Sigue así y tu deuda TC será manejable.` });

          const gastoDeporte = txs.filter(t=>t.tipo==='gasto'&&t.categoria==='Deporte').reduce((s,t)=>s+t.monto,0);
          if (gastoDeporte > 0) insights.push({ color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', icon:'TrendingUp', titulo:'Inviertes en tu salud física', texto:`Has gastado ${fmt(gastoDeporte)} en deporte. Eso no es un gasto — es una inversión en tu energía y rendimiento.` });

          if (cuotasMes > 0 && stats.ingresos > 0) {
            const ratio = Math.round(cuotasMes/stats.ingresos*100);
            const diasTrabajo = Math.round(cuotasMes/(stats.ingresos/30));
            insights.push({ color: ratio>30?'#f97316':'#6366f1', bg: ratio>30?'#fff7ed':'#f5f3ff', border: ratio>30?'#fed7aa':'#ddd6fe', icon:'Clock', titulo:`Tus cuotas = ${diasTrabajo} días de trabajo`, texto:`Pagas ${fmt(cuotasMes)}/mes en créditos — el ${ratio}% de tus ingresos. Al terminar el crédito ****6347 recuperas ${fmt(272.28)}/mes.` });
          }

          if (insights.length===0) return null;
          return (
            <div style={{background:'#fff',borderRadius:20,padding:'16px',marginBottom:14,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <div style={{width:32,height:32,borderRadius:10,background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center'}}><TrendingUp size={16} color="#d97706"/></div>
                <div style={S.secTitle}>Lo que tus números dicen</div>
              </div>
              {insights.map((ins,i)=>(
                <div key={i} style={{background:ins.bg,border:`1px solid ${ins.border}`,borderRadius:14,padding:'12px 14px',marginBottom:i<insights.length-1?10:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                    <>{ins.icon==='Target'&&<Target size={16} color={ins.color}/>}{ins.icon==='BarChart2'&&<BarChart2 size={16} color={ins.color}/>}{ins.icon==='Search'&&<Search size={16} color={ins.color}/>}{ins.icon==='Calendar'&&<Calendar size={16} color={ins.color}/>}{ins.icon==='CreditCard'&&<CreditCard size={16} color={ins.color}/>}{ins.icon==='TrendingUp'&&<TrendingUp size={16} color={ins.color}/>}{ins.icon==='Clock'&&<Clock size={16} color={ins.color}/>}</>
                    <span style={{fontSize:13,fontWeight:700,color:ins.color}}>{ins.titulo}</span>
                  </div>
                  <div style={{fontSize:12,color:'#374151',lineHeight:1.6,paddingLeft:24}}>{ins.texto}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Fechas importantes */}
        {(() => {
          const ciclo = getCicloActual();
          const hoy = new Date();
          hoy.setHours(0,0,0,0);
          const pagoDate = parseLimitePago(ciclo.limitePago);
          const diasPago = Math.ceil((pagoDate - hoy) / (1000*60*60*24));
          const mes = hoy.getMonth();
          const diaCierre = (mes === 6 || mes === 11) ? 24 : 25;
          const cierreDate = new Date(hoy.getFullYear(), mes, diaCierre);
          if (cierreDate < hoy) cierreDate.setMonth(cierreDate.getMonth()+1);
          const diasCierre = Math.ceil((cierreDate - hoy) / (1000*60*60*24));
          const urgP = diasPago<=3?'#ef4444':diasPago<=10?'#f59e0b':'#10b981';
          const urgC = diasCierre<=3?'#ef4444':diasCierre<=5?'#f59e0b':'#7c3aed';

          const fechas = [
            { label:'Cierre TC', fecha:ciclo.cierreHasta, dias:diasCierre, color:urgC, Icon:Receipt, sub:'Último día para consumir este ciclo' },
            { label:'Pago TC', fecha:ciclo.limitePago, dias:diasPago, color:urgP, Icon:CreditCard, sub:'Fecha límite de pago' },
            ...prestamos.filter(p=>p.capitalPendiente>0).map(p=>{
              const d = Math.ceil((new Date(p.proximoPago)-hoy)/(1000*60*60*24));
              return { label:`Cuota ${p.numero}`, fecha:fmtFecha(p.proximoPago), dias:d, color:d<=3?'#ef4444':d<=10?'#f59e0b':'#10b981', Icon:Landmark, sub:`${fmt(p.cuotaMensual)} · Cuota ${p.cuotaActual+1}/${p.totalCuotas}` };
            }),
          ];

          return (
            <div style={{background:'#fff',borderRadius:20,padding:'16px',marginBottom:14,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <div style={{width:32,height:32,borderRadius:10,background:'#ede9fe',display:'flex',alignItems:'center',justifyContent:'center'}}><Calendar size={16} color="#7c3aed"/></div>
                <div style={S.secTitle}>Fechas importantes</div>
              </div>
              {fechas.map((f,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<fechas.length-1?'1px solid #f5f3ff':'none'}}>
                  <div style={{width:38,height:38,borderRadius:12,background:f.color+'15',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <f.Icon size={17} color={f.color}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{f.label}</div>
                    <div style={{fontSize:11,color:'#9ca3af',marginTop:1}}>{f.sub}</div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:14,fontWeight:800,color:f.color}}>{f.fecha}</div>
                    <div style={{fontSize:11,fontWeight:600,color:f.color,marginTop:1}}>
                      {f.dias===0?'Hoy':f.dias===1?'Mañana':`${f.dias} días`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Solo si casi termina un crédito */}
        {prestamos.find(p=>p.cuotaActual>=p.totalCuotas-5&&p.cuotaActual>0) && (
          <div style={{background:'#f0fdf4',border:'1.5px solid #bbf7d0',borderRadius:20,padding:'16px',marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <CheckCircle size={16} color="#16a34a"/>
              <span style={{fontSize:14,fontWeight:700,color:'#16a34a'}}>¡Casi terminas un crédito!</span>
            </div>
            <div style={{fontSize:13,color:'#166534',lineHeight:1.6}}>
              El crédito ****6347 tiene solo 5 cuotas restantes. Al terminar tendrás <strong>S/ 272.28 extra libre por mes</strong>.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
