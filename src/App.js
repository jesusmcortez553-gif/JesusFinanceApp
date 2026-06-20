import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Package, Home, BarChart2, Plus, Target,
  ArrowUpCircle, ArrowDownCircle, Wallet,
  Pencil, Trash2, User, ChevronRight, Calendar,
  AlertTriangle, CheckCircle, PiggyBank, X,
  CreditCard, Landmark, Clock, TrendingDown, TrendingUp, Receipt, Search, Flame,
} from 'lucide-react';
import { CAT_ICONOS, CATS_GASTO, CATS_INGRESO, MESES, PALABRAS_SALARIO, PALABRAS_DISPOSICION, PALABRAS_PAGO_TC } from './constants/categorias';
import { fmt, fmtInt, fmtFecha, diasHasta, urgenciaColor } from './utils/format';
import { getCicloActual, parseLimitePago, alertaTC } from './utils/bcp';
import { limpiarDescripcion, extraerMonto, detectarAlerta, clasificarGasto, clasificarIngreso, generarSugerencias } from './utils/clasificar';
import CustomTooltip from './components/CustomTooltip';
import TarjetaVisual from './components/TarjetaVisual';
import PrestamoCard from './components/PrestamoCard';
import ResumenDeudas from './components/ResumenDeudas';
import PresupuestoCard from './components/PresupuestoCard';
import MetaCard from './components/MetaCard';

// â”€â”€â”€ STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const S = {
  app:   { fontFamily:"'DM Sans', sans-serif", minHeight:'100vh', background:'#f0f0f7', display:'flex', justifyContent:'center' },
  phone: { width:'100%', maxWidth:420, minHeight:'100vh', background:'#f0f0f7', position:'relative', paddingBottom:88 },
  header:{ background:'linear-gradient(135deg,#5b21b6 0%,#7c3aed 45%,#4f46e5 100%)', padding:'52px 24px 72px', position:'relative', overflow:'hidden' },
  bubble:(t,r,b,l,w,h,op)=>({ position:'absolute', top:t, right:r, bottom:b, left:l, width:w, height:h, borderRadius:'50%', background:`rgba(255,255,255,${op})`, pointerEvents:'none' }),
  hContent:{ position:'relative', zIndex:2 },
  topRow:  { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  greeting:{ color:'rgba(255,255,255,0.7)', fontSize:13, marginBottom:3 },
  userName:{ color:'#fff', fontSize:20, fontWeight:800 },
  avatarCircle:{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.4)', display:'flex', alignItems:'center', justifyContent:'center' },
  balLabel: { color:'rgba(255,255,255,0.65)', fontSize:11, letterSpacing:1, textTransform:'uppercase', marginBottom:4 },
  balAmount:{ color:'#fff', fontSize:36, fontWeight:800, letterSpacing:-1, lineHeight:1 },
  pillRow:  { display:'flex', gap:8, marginTop:16 },
  pill:(active)=>({ padding:'7px 18px', borderRadius:20, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, background:active?'#fff':'rgba(255,255,255,0.18)', color:active?'#7c3aed':'#fff', transition:'all 0.2s' }),
  statsRow: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, padding:'0 16px', marginTop:-36, marginBottom:16, position:'relative', zIndex:10 },
  statsRowWithAlerts: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, padding:'0 16px', marginTop:16, marginBottom:16, position:'relative', zIndex:10 },
  statCard: { background:'#fff', borderRadius:16, padding:'12px 10px', boxShadow:'0 4px 20px rgba(91,33,182,0.12)', display:'flex', flexDirection:'column', alignItems:'center', gap:4 },
  statIconWrap:(color)=>({ width:30, height:30, borderRadius:10, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center' }),
  statLabel:{ fontSize:10, color:'#9ca3af', fontWeight:600 },
  statVal:(color)=>({ fontSize:14, fontWeight:800, color }),
  section:  { padding:'0 16px', marginBottom:14 },
  secHeader:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  secTitle: { fontSize:15, fontWeight:700, color:'#1f1b4b' },
  seeAll:   { display:'flex', alignItems:'center', gap:2, fontSize:11, color:'#7c3aed', fontWeight:700, background:'none', border:'none', cursor:'pointer' },
  card:     { background:'#fff', borderRadius:20, padding:'14px', marginBottom:10, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' },
  chartToggle:{ display:'flex', gap:6 },
  chartBtn:(active)=>({ padding:'5px 14px', borderRadius:20, border:'none', cursor:'pointer', background:active?'linear-gradient(135deg,#7c3aed,#4f46e5)':'#f5f3ff', color:active?'#fff':'#7c3aed', fontSize:11, fontWeight:700, transition:'all 0.2s' }),
  txItem:(last)=>({ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:last?'none':'1px solid #f5f3ff' }),
  txIconWrap:(color)=>({ width:40, height:40, borderRadius:13, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }),
  txName:{ fontSize:13, fontWeight:700, color:'#1f1b4b', marginBottom:2 },
  txMeta:{ fontSize:11, color:'#9ca3af' },
  txAmt:(tipo)=>({ marginLeft:'auto', fontSize:14, fontWeight:800, flexShrink:0, color:tipo==='ingreso'?'#10b981':'#ef4444' }),
  actionBtn:(bg)=>({ width:30, height:30, borderRadius:9, background:bg, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }),
  catRow:  { marginBottom:12 },
  catTop:  { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 },
  catName: { display:'flex', alignItems:'center', gap:7, fontSize:12, fontWeight:600, color:'#1f1b4b' },
  catAmt:  { fontSize:12, fontWeight:800, color:'#ef4444' },
  progBg:  { background:'#f5f3ff', borderRadius:100, height:5, overflow:'hidden' },
  progFill:(color,pct)=>({ width:`${pct}%`, height:'100%', background:color, borderRadius:100, transition:'width 1s' }),
  pageHeader:(g)=>({ background:g||'linear-gradient(135deg,#5b21b6,#7c3aed)', padding:'52px 24px 28px', position:'relative', overflow:'hidden' }),
  pageTitle:{ color:'#fff', fontSize:20, fontWeight:800, position:'relative', zIndex:2 },
  pageSub:  { color:'rgba(255,255,255,0.6)', fontSize:13, marginTop:4, position:'relative', zIndex:2 },
  formWrap: { padding:'16px' },
  formCard: { background:'#fff', borderRadius:24, padding:'20px', boxShadow:'0 4px 24px rgba(91,33,182,0.1)' },
  typeToggle:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 },
  typeBtn:(active,tipo)=>({ padding:'12px', borderRadius:14, border:`2px solid ${active?(tipo==='ingreso'?'#10b981':'#ef4444'):'#f0eeff'}`, background:active?(tipo==='ingreso'?'#f0fdf4':'#fef2f2'):'#fafaf9', color:active?(tipo==='ingreso'?'#10b981':'#ef4444'):'#9ca3af', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }),
  label:  { display:'block', fontSize:11, fontWeight:700, color:'#9ca3af', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 },
  input:  { width:'100%', padding:'12px 14px', borderRadius:12, border:'2px solid #f0eeff', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', color:'#1f1b4b', background:'#fafaf9', marginBottom:12, transition:'border 0.2s' },
  select: { width:'100%', padding:'12px 14px', borderRadius:12, border:'2px solid #f0eeff', fontSize:14, fontFamily:'inherit', background:'#fafaf9', color:'#1f1b4b', marginBottom:16, outline:'none' },
  submitBtn:{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:14, fontSize:15, fontWeight:700, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 4px 16px rgba(124,58,237,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 },
  bottomNav:{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:420, background:'#fff', borderTop:'1px solid #ede9fe', display:'flex', justifyContent:'space-around', alignItems:'center', padding:'8px 0 20px', boxShadow:'0 -4px 20px rgba(91,33,182,0.08)', zIndex:100 },
  navBtn:  { display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer', padding:'4px 14px' },
  navLabel:(active)=>({ fontSize:9, fontWeight:700, color:active?'#7c3aed':'#9ca3af' }),
  fab:     { width:50, height:50, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(124,58,237,0.45)', border:'none', cursor:'pointer', marginTop:-18 },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// APP PRINCIPAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export default function App({ user, data, onLogout }) {
  const [tab, setTab]         = useState('home');
  // â”€â”€ FIREBASE DATA â”€â”€
  const {
    txs: fbTxs, presupuestos: fbPres, metas: fbMetas,
    tcs = [], prestamos = [],
    saldoCuenta, setSaldoCuenta,
    streak, addTx, updateTx, deleteTx,
    addPres, updatePres, deletePres,
    addMeta, updateMeta, deleteMeta,
    addTc, updateTc, deleteTc,
    addPrestamo, updatePrestamo, deletePrestamo,
  } = data || {};

  const [txs, setTxs]               = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [metas, setMetas]           = useState([]);
  const [showTcForm, setShowTcForm] = useState(false);
  const [tcEditId, setTcEditId]     = useState(null);
  const [tcForm, setTcForm]         = useState({
    nombre:'', banco:'', numero:'', lineaTotal:'',
    consumido:'', deudaActual:'', tea:'', diaCorte:'', diaPago:'',
    color:'#b45309',
  });

  // Sync Firebase data to local state
  React.useEffect(() => { if (fbTxs !== undefined) setTxs(fbTxs); }, [fbTxs]);
  React.useEffect(() => { if (fbPres !== undefined) setPresupuestos(fbPres); }, [fbPres]);
  React.useEffect(() => { if (fbMetas !== undefined) setMetas(fbMetas); }, [fbMetas]);
  const [chartPeriod, setChartPeriod] = useState('día');
  const [showAll, setShowAll] = useState(false);
  const [subTabDeudas, setSubTabDeudas] = useState('tc');

  // Formulario TX
  const hoy = new Date().toISOString().split('T')[0];
  const [txForm, setTxForm]     = useState({ tipo:'gasto', categoria:'Alimentación', descripcion:'', monto:'', fecha:hoy });
  const [txEditId, setTxEditId] = useState(null);
  const [autoClasif, setAutoClasif] = useState(null);
  const [alertaEmoc, setAlertaEmoc] = useState(null);
  const [alertaAceptada, setAlertaAceptada] = useState(false);
  const [tipoEspecial, setTipoEspecial] = useState(null);
  const [showResumenSalario, setShowResumenSalario] = useState(false);
  const [resumenSalario, setResumenSalario]         = useState(null);
  const [medioPago, setMedioPago] = useState('efectivo'); // 'efectivo' | 'tc'
  const [lastMedioPago, setLastMedioPago] = useState('efectivo');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Formulario presupuestos
  const [presForm, setPresForm]     = useState({ categoria:'Alimentación', limite:'' });
  const [presEditId, setPresEditId] = useState(null);
  const [showPresForm, setShowPresForm] = useState(false);
  const [sugerenciasDescartadas, setSugerenciasDescartadas] = useState(false);

  // Formulario metas
  const [metaForm, setMetaForm]     = useState({ nombre:'', objetivo:'', actual:'', color:'#6366f1' });
  const [metaEditId, setMetaEditId] = useState(null);
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [abonarMetaId, setAbonarMetaId] = useState(null);
  const [abonarMonto, setAbonarMonto]   = useState('');

  // Saldo de cuenta
  const [showSaldoSetup, setShowSaldoSetup] = useState(false);
  const [saldoInput, setSaldoInput]   = useState('');

  // Formulario préstamo
  const [showPresForm2, setShowPresForm2] = useState(false);
  const [presForm2, setPresForm2] = useState({ nombre:'', banco:'', numero:'', montoOriginal:'', capitalPendiente:'', cuotaMensual:'', proximoPago:'', tea:'', tcea:'', totalCuotas:'', cuotaActual:'0', color:'#1d4ed8', automatico:false });
  const [presEditId2, setPresEditId2] = useState(null);

  const stats = useMemo(()=>{
    const ing=txs.filter(t=>t.tipo==='ingreso').reduce((s,t)=>s+t.monto,0);
    const gas=txs.filter(t=>t.tipo==='gasto').reduce((s,t)=>s+t.monto,0);
    return {ingresos:ing,gastos:gas,balance:ing-gas};
  },[txs]);

  const gastoPorCat = useMemo(()=>{ const m={}; txs.filter(t=>t.tipo==='gasto').forEach(t=>{m[t.categoria]=(m[t.categoria]||0)+t.monto;}); return m; },[txs]);
  const alertas     = useMemo(()=>presupuestos.filter(p=>(gastoPorCat[p.categoria]||0)/p.limite*100>=80),[presupuestos,gastoPorCat]);

  const areaData = useMemo(()=>{ const mesActual=new Date().toISOString().slice(0,7); const d={}; txs.filter(t=>t.tipo==='gasto'&&t.fecha.startsWith(mesActual)).forEach(t=>{const n=parseInt(t.fecha.split('-')[2]);d[n]=(d[n]||0)+t.monto;}); const diasMes=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate(); return Array.from({length:diasMes},(_,i)=>({dia:`${i+1}`,monto:d[i+1]||0})); },[txs]);
  const barData  = useMemo(()=>{ const m={}; txs.forEach(t=>{const mes=MESES[parseInt(t.fecha.split('-')[1])-1]; if(!m[mes])m[mes]={mes,ingresos:0,gastos:0}; m[mes][t.tipo==='ingreso'?'ingresos':'gastos']+=t.monto;}); return Object.values(m); },[txs]);
  const catData  = useMemo(()=>Object.entries(gastoPorCat).sort((a,b)=>b[1]-a[1]).slice(0,8),[gastoPorCat]);
  const maxGasto = Math.max(...catData.map(c=>c[1]),1);
  const recentTxs= useMemo(()=>[...txs]
    .sort((a,b)=>{
      // Primero por fecha descendente
      const fechaDiff = new Date(b.fecha) - new Date(a.fecha);
      if (fechaDiff !== 0) return fechaDiff;
      // Mismo día â†’ orden de ingreso (createdAt o id numérico)
      const aTime = a.createdAt || (typeof a.id === 'number' ? a.id : 0);
      const bTime = b.createdAt || (typeof b.id === 'number' ? b.id : 0);
      return bTime - aTime;
    })
    .slice(0, showAll?50:5)
  ,[txs,showAll]);
  const topDay   = useMemo(()=>{ const d={}; txs.filter(t=>t.tipo==='gasto').forEach(t=>{d[t.fecha]=(d[t.fecha]||0)+t.monto;}); return Object.entries(d).sort((a,b)=>b[1]-a[1])[0]; },[txs]);

  // Próximos vencimientos (TC + Préstamos)
  const proximosVenc = useMemo(()=>{
    const lista = [];
    const cicloProx = getCicloActual(); const [pd,pm,py] = cicloProx.limitePago.split('/'); tcs.forEach(tc => lista.push({ nombre:tc.nombre, monto:tc.deudaActual, fecha:`20${py}-${pm}-${pd}`, tipo:'TC', color:tc.color }));
    prestamos.forEach(p => lista.push({ nombre:p.nombre+' '+p.numero, monto:p.cuotaMensual, fecha:p.proximoPago, tipo:'Crédito', color:p.color }));
    return lista.sort((a,b)=>new Date(a.fecha)-new Date(b.fecha));
  },[tcs,prestamos]);

  const if_ = (e) => { e.target.style.borderColor='#7c3aed'; };
  const ib_ = (e) => { e.target.style.borderColor='#f0eeff'; };

  const handleDescChange = (valor) => {
    const texto = valor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const esSalario     = PALABRAS_SALARIO.some(p=>texto.includes(p));
    const esDisposicion = PALABRAS_DISPOSICION.some(p=>texto.includes(p));
    const esPagoTC      = PALABRAS_PAGO_TC.some(p=>texto.includes(p));
    // BLOQUE 2: extraer monto del texto
    const { monto: montoDetectado } = extraerMonto(valor);
    if (montoDetectado) {
      setTxForm(f=>({...f, descripcion:valor, monto:String(montoDetectado)}));
    } else {
      setTxForm(f=>({...f, descripcion:valor}));
    }
    setTipoEspecial(esSalario?'salario':esDisposicion?'disposicion':esPagoTC?'pagoTC':null);
    if (txForm.tipo === 'ingreso') {
      const result = clasificarIngreso(valor);
      setAutoClasif(result);
      if (result) setTxForm(f=>({...f, descripcion:valor, categoria:result.categoria}));
    } else if (txForm.tipo === 'gasto' && !esDisposicion && !esPagoTC) {
      // Pasar monto detectado O el que está en el campo para que la capa 6 funcione
      const montoParaClasif = montoDetectado || parseFloat(txForm.monto) || 0;
      const result = clasificarGasto(valor, montoParaClasif);
      setAutoClasif(result);
      const alerta = detectarAlerta(valor);
      setAlertaEmoc(alerta);
      setAlertaAceptada(false);
    } else {
      setAutoClasif(null);
      setAlertaEmoc(null);
    }
  };

  const elegirCategoria = (cat) => {
    setTxForm(f=>({...f, categoria:cat}));
    setAutoClasif(prev => prev ? {...prev, categoria:cat, elegida:true} : null);
  };

  const handleTxSubmit = () => {
    if(!txForm.descripcion||!txForm.monto) return;
    if(alertaEmoc && !alertaAceptada) { setAlertaAceptada(true); return; }

    const monto = parseFloat(txForm.monto);
    const fecha = txForm.fecha;

    if (tipoEspecial === 'salario' && txForm.tipo === 'ingreso') {
      const salarioTx = { ...txForm, monto, categoria:'Salario' };
      if(addTx) addTx(salarioTx).catch(()=>{});
      setTxs(p=>[...p, {...salarioTx, id:'temp_'+Date.now()}]);
      const cuotasDescontadas = [];
      (prestamos||[]).forEach(p => {
        if (p.capitalPendiente > 0) {
          cuotasDescontadas.push({ nombre: p.nombre+' '+p.numero, monto: p.cuotaMensual });
          const cuotaTx = { tipo:'gasto', categoria:'Servicios', descripcion:`Cuota ${p.nombre} ${p.numero}`, monto:p.cuotaMensual, fecha };
          if(addTx) addTx(cuotaTx).catch(()=>{});
          setTxs(prev=>[...prev, {...cuotaTx, id:'temp_'+(Date.now()+Math.random())}]);
          const updP = { ...p, capitalPendiente: Math.max(0, p.capitalPendiente - p.cuotaMensual), pagado:(p.pagado||0)+p.cuotaMensual, cuotaActual:(p.cuotaActual||0)+1 };
          if(updatePrestamo) updatePrestamo(p.id, updP).catch(()=>{});
        }
      });
      const totalDesc = cuotasDescontadas.reduce((s,c)=>s+c.monto,0);
      setResumenSalario({ ingreso:monto, cuotas:cuotasDescontadas, total:totalDesc });
      setShowResumenSalario(true);
      setTxForm({tipo:'ingreso',categoria:'Salario',descripcion:'',monto:'',fecha:new Date().toISOString().split('T')[0]});
      setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
      return;
    }

    if (tipoEspecial === 'disposicion') {
      const ingTx = { ...txForm, tipo:'ingreso', monto, categoria:'Disposición TC' };
      const intTx = { tipo:'gasto', categoria:'Servicios', descripcion:'Interés disposición TC', monto:0, fecha };
      if(addTx) addTx(ingTx).catch(()=>{});
      if(addTx) addTx(intTx).catch(()=>{});
      setTxs(p=>[...p, {...ingTx, id:'temp_'+Date.now()}, {...intTx, id:'temp_'+(Date.now()+1)}]);
      if(tcs && tcs[0] && updateTc) {
        const tc0 = tcs[0];
        updateTc(tc0.id, { ...tc0, consumido: tc0.consumido+monto, deudaActual: tc0.deudaActual+monto }).catch(()=>{});
      }
      setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;})()});
      setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
      setTab('home');
      return;
    }

    if (tipoEspecial === 'pagoTC') {
      if(tcs && tcs[0] && updateTc) {
        const tc0 = tcs[0];
        updateTc(tc0.id, { ...tc0, consumido: Math.max(0,tc0.consumido-monto), deudaActual: Math.max(0,tc0.deudaActual-monto) }).catch(()=>{});
      }
      const pagoTx = { ...txForm, monto, categoria:'Servicios', descripcion:'Pago tarjeta de crédito' };
      if(addTx) addTx(pagoTx).catch(()=>{});
      setTxs(p=>[...p, {...pagoTx, id:'temp_'+Date.now()}]);
      setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;})()});
      setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
      setTab('home');
      return;
    }

    let categoriaFinal = txForm.categoria;
    if (txForm.tipo === 'gasto' && autoClasif && !autoClasif.elegida) {
      const reclasif = clasificarGasto(txForm.descripcion, monto);
      categoriaFinal = reclasif ? reclasif.categoria : autoClasif.categoria;
    }
    const descLimpia = limpiarDescripcion(txForm.descripcion, monto, categoriaFinal);
    if (txForm.tipo === 'gasto' && medioPago === 'efectivo' && saldoCuenta !== null) {
      if(setSaldoCuenta) setSaldoCuenta(Math.max(0, saldoCuenta - monto));
    }
    if (txForm.tipo === 'gasto' && medioPago.startsWith('tc')) {
      const tcId = medioPago.replace('tc_','');
      if(updateTc && tcs) {
        const tc = tcs.find(t=>String(t.id)===String(tcId)) || (tcs.length>0?tcs[0]:null);
        if(tc) updateTc(tc.id, { ...tc, consumido: tc.consumido+monto, deudaActual: tc.deudaActual+monto }).catch(()=>{});
      }
    }
    if (txForm.tipo === 'ingreso' && saldoCuenta !== null && tipoEspecial !== 'disposicion') {
      if(setSaldoCuenta) setSaldoCuenta(saldoCuenta + monto);
    }
    if(txEditId){
      const txEditada = { tipo:txForm.tipo, descripcion:descLimpia, categoria:categoriaFinal, monto, fecha:txForm.fecha, medioPago };
      setTxs(p=>p.map(t=>String(t.id)===String(txEditId)?{...t,...txEditada}:t));
      if(updateTx) updateTx(String(txEditId), txEditada).catch(e=>console.error('updateTx failed:',e));
      setTxEditId(null);
    } else {
      const newId = Date.now();
      const txFinal = {...txForm, descripcion:descLimpia, categoria:categoriaFinal, monto, medioPago, createdAt:newId};
      if(addTx) {
        addTx({...txFinal}).catch(e=>console.error('addTx failed:',e));
        setTxs(p=>[...p, {...txFinal, id:'temp_'+newId}]);
      } else {
        setTxs(p=>[...p, {...txFinal, id:newId}]);
      }
    }
    setLastMedioPago(medioPago);
    setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;})()});
    setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
    setShowDatePicker(false);
    setTab('home');
  };
  const openAdd = () => {
    setTxEditId(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
    setMedioPago(lastMedioPago); setShowDatePicker(false);
    setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;})()});
    setTab('agregar');
  };
  const handleTxEdit = (t) => {
    setTxForm({...t,monto:String(t.monto)}); setTxEditId(t.id);
    setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
    setMedioPago(t.medioPago||'efectivo'); setShowDatePicker(false);
    setTab('agregar');
  };
  const handleTxDel  = (id) => {
    if(window.confirm('¿Eliminar?')) {
      setTxs(p=>p.filter(t=>String(t.id)!==String(id)));
      if(deleteTx) deleteTx(String(id)).catch(()=>{});
    }
  };

  const handlePresSubmit = () => {
    if(!presForm.categoria||!presForm.limite) return;
    const obj = {...presForm, limite:parseFloat(presForm.limite)};
    if(presEditId){
      setPresupuestos(p=>p.map(x=>x.id===presEditId?{...obj,id:presEditId}:x));
      if(updatePres) updatePres(presEditId, obj).catch(()=>{});
      setPresEditId(null);
    } else {
      const newId = Date.now();
      setPresupuestos(p=>[...p,{...obj,id:newId}]);
      if(addPres) addPres(obj).catch(()=>{});
    }
    setPresForm({categoria:'Alimentación',limite:''}); setShowPresForm(false);
  };
  const handlePresDel = (id) => {
    if(window.confirm('¿Eliminar?')) {
      setPresupuestos(p=>p.filter(x=>x.id!==id));
      if(deletePres) deletePres(id).catch(()=>{});
    }
  };

  const handleMetaSubmit = () => {
    if(!metaForm.nombre||!metaForm.objetivo) return;
    const obj = {...metaForm, objetivo:parseFloat(metaForm.objetivo), actual:parseFloat(metaForm.actual||0)};
    if(metaEditId){
      setMetas(p=>p.map(m=>m.id===metaEditId?{...obj,id:metaEditId}:m));
      if(updateMeta) updateMeta(metaEditId, obj).catch(()=>{});
      setMetaEditId(null);
    } else {
      setMetas(p=>[...p,{...obj,id:Date.now()}]);
      if(addMeta) addMeta(obj).catch(()=>{});
    }
    setMetaForm({nombre:'',objetivo:'',actual:'',color:'#6366f1'}); setShowMetaForm(false);
  };
  const handleMetaDel = (id) => {
    if(window.confirm('¿Eliminar?')) {
      setMetas(p=>p.filter(m=>m.id!==id));
      if(deleteMeta) deleteMeta(id).catch(()=>{});
    }
  };
  const handleAbonar = () => {
    if(!abonarMonto) return;
    const meta = metas.find(m=>m.id===abonarMetaId);
    if(!meta) return;
    const nuevoActual = Math.min(meta.objetivo, meta.actual + parseFloat(abonarMonto));
    setMetas(p=>p.map(m=>m.id===abonarMetaId?{...m,actual:nuevoActual}:m));
    if(updateMeta) updateMeta(abonarMetaId, {...meta,actual:nuevoActual}).catch(()=>{});
    setAbonarMetaId(null); setAbonarMonto('');
  };

  const handleTcSubmit = () => {
    if (!tcForm.banco || !tcForm.lineaTotal) return;
    const tc = {
      nombre: tcForm.nombre || `Tarjeta ${tcForm.banco}`,
      banco: tcForm.banco,
      numero: tcForm.numero || '****0000',
      lineaTotal: parseFloat(tcForm.lineaTotal) || 0,
      consumido: parseFloat(tcForm.consumido) || 0,
      deudaActual: parseFloat(tcForm.deudaActual) || 0,
      tea: parseFloat(tcForm.tea) || 0,
      diaCorte: parseInt(tcForm.diaCorte) || 25,
      diaPago: parseInt(tcForm.diaPago) || 22,
      color: tcForm.color || '#b45309',
      gradiente: 'linear-gradient(135deg,#92400e,#b45309,#d97706)',
    };
    if (tcEditId) {
      if(updateTc) updateTc(tcEditId, tc).catch(()=>{});
      setTcEditId(null);
    } else {
      if(addTc) addTc(tc).catch(()=>{});
    }
    setTcForm({nombre:'',banco:'',numero:'',lineaTotal:'',consumido:'',deudaActual:'',tea:'',diaCorte:'',diaPago:'',color:'#b45309'});
    setShowTcForm(false);
  };

  const handleTcDel = (id) => {
    if (window.confirm('¿Eliminar tarjeta?')) if(deleteTc) deleteTc(id).catch(()=>{});
  };

  const handlePres2Submit = () => {
    if(!presForm2.nombre||!presForm2.cuotaMensual) return;
    const obj = {...presForm2, montoOriginal:parseFloat(presForm2.montoOriginal||0), capitalPendiente:parseFloat(presForm2.capitalPendiente||0), pagado:parseFloat(presForm2.montoOriginal||0)-parseFloat(presForm2.capitalPendiente||0), cuotaMensual:parseFloat(presForm2.cuotaMensual), tea:parseFloat(presForm2.tea||0), tcea:parseFloat(presForm2.tcea||0), totalCuotas:parseInt(presForm2.totalCuotas||0), cuotaActual:parseInt(presForm2.cuotaActual||0) };
    if(presEditId2){
      if(updatePrestamo) updatePrestamo(presEditId2, obj).catch(()=>{});
      setPresEditId2(null);
    } else {
      if(addPrestamo) addPrestamo(obj).catch(()=>{});
    }
    setPresForm2({nombre:'',banco:'',numero:'',montoOriginal:'',capitalPendiente:'',cuotaMensual:'',proximoPago:'',tea:'',tcea:'',totalCuotas:'',cuotaActual:'0',color:'#1d4ed8',automatico:false});
    setShowPresForm2(false);
  };
  const handlePres2Edit = (p) => { setPresForm2({...p,montoOriginal:String(p.montoOriginal),capitalPendiente:String(p.capitalPendiente),cuotaMensual:String(p.cuotaMensual),tea:String(p.tea),tcea:String(p.tcea),totalCuotas:String(p.totalCuotas),cuotaActual:String(p.cuotaActual)}); setPresEditId2(p.id); setShowPresForm2(true); };
  const handlePres2Del  = (id) => { if(window.confirm('¿Eliminar?')) if(deletePrestamo) deletePrestamo(id).catch(()=>{}); };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"/>
      <div style={S.phone}>

        {/* â•â• HOME â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {tab==='home' && <>
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
        </>}

        {/* â•â• AGREGAR TX â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {tab==='agregar' && (
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
                onFocus={if_} onBlur={ib_}/>
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
                // Mostrar top 3 sugerencias o todas si no hay detección
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
                Monto (S/.) {extraerMonto(txForm.descripcion).monto ? <span style={{color:'#10b981',fontSize:10,fontWeight:600}}>âœ“ detectado</span> : <span style={{color:'#9ca3af',fontSize:10}}>o escríbelo aquí</span>}
              </label>
              <input style={S.input} type="number" placeholder="0.00" value={txForm.monto}
                onChange={e=>setTxForm(p=>({...p,monto:e.target.value}))} onFocus={if_} onBlur={ib_}/>

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
                  onChange={e=>setTxForm(p=>({...p,fecha:e.target.value}))} onFocus={if_} onBlur={ib_}/>
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
                    Al registrar, se descontarán automáticamente:<br/>
                    <strong>Crédito ****6347</strong> — S/ 272.28<br/>
                    <strong>Crédito ****6069</strong> — S/ 103.90
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
                {alertaEmoc && !alertaAceptada ? 'Soy consciente — continuar' : tipoEspecial==='salario' ? 'Registrar salario + descontar cuotas' : tipoEspecial==='disposicion' ? 'Confirmar disposición' : tipoEspecial==='pagoTC' ? 'Registrar pago TC' : txEditId?'Guardar cambios':'Registrar'}
              </button>

            </div></div>
          </div>
        )}

        {/* â•â• DEUDAS (TC + PRÉSTAMOS) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {tab==='deudas' && (
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
                            onFocus={if_} onBlur={ib_}/>
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
                  {prestamos.map(p=><PrestamoCard key={p.id} prestamo={p} onEdit={()=>handlePres2Edit(p)} onDelete={()=>handlePres2Del(p.id)}/>)}

                  <button onClick={()=>{setPresEditId2(null);setPresForm2({nombre:'',banco:'',numero:'',montoOriginal:'',capitalPendiente:'',cuotaMensual:'',proximoPago:'',tea:'',tcea:'',totalCuotas:'',cuotaActual:'0',color:'#1d4ed8',automatico:false});setShowPresForm2(true);}}
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
                        <div key={f.k}><label style={S.label}>{f.l}</label><input style={S.input} type={f.t} placeholder={f.ph} value={presForm2[f.k]} onChange={e=>setPresForm2(p=>({...p,[f.k]:e.target.value}))} onFocus={if_} onBlur={ib_}/></div>
                      ))}
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                        <input type="checkbox" id="auto" checked={presForm2.automatico} onChange={e=>setPresForm2(p=>({...p,automatico:e.target.checked}))} style={{width:18,height:18}}/>
                        <label htmlFor="auto" style={{fontSize:13,color:'#1f1b4b',fontWeight:600}}>Débito automático</label>
                      </div>
                      <button style={{...S.submitBtn,background:'linear-gradient(135deg,#4338ca,#6366f1)'}} onClick={handlePres2Submit}><Plus size={16}/>{presEditId2?'Guardar':'Agregar crédito'}</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* â•â• METAS / PRESUPUESTOS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {tab==='metas' && (
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

              {/* â”€â”€ FASE C: Sugerencias automáticas â”€â”€ */}
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
                      const info=CAT_ICONOS[s.categoria]||{icon:Package,color:'#6b7280'}; const Icon=info.icon;
                      return (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.15)',borderRadius:12,padding:'10px 12px',marginBottom:8}}>
                          <div style={{width:32,height:32,borderRadius:10,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={15} color="#fff"/></div>
                          <div style={{flex:1}}>
                            <div style={{color:'#fff',fontSize:12,fontWeight:700}}>{s.categoria}</div>
                            <div style={{color:'rgba(255,255,255,0.6)',fontSize:10}}>basado en {s.basadoEn} gastos</div>
                          </div>
                          <div style={{color:'#fff',fontSize:14,fontWeight:800}}>S/ {s.sugerido}</div>
                        </div>
                      );
                    })}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:4}}>
                      <button onClick={()=>{sugs.forEach(s=>{setPresupuestos(prev=>[...prev,{id:Date.now()+Math.random(),categoria:s.categoria,limite:s.sugerido}]);if(addPres) addPres({categoria:s.categoria,limite:s.sugerido}).catch(()=>{});});setSugerenciasDescartadas(true);}}
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
                  <label style={S.label}>Límite mensual (S/.)</label><input style={S.input} type="number" placeholder="0.00" value={presForm.limite} onChange={e=>setPresForm(p=>({...p,limite:e.target.value}))} onFocus={if_} onBlur={ib_}/>
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
                  {[{l:'Nombre',k:'nombre',t:'text',ph:'ej. Vacaciones'},{l:'Objetivo (S/.)',k:'objetivo',t:'number',ph:'0.00'},{l:'Ya tengo (S/.)',k:'actual',t:'number',ph:'0.00'}].map(f=><div key={f.k}><label style={S.label}>{f.l}</label><input style={S.input} type={f.t} placeholder={f.ph} value={metaForm[f.k]} onChange={e=>setMetaForm(p=>({...p,[f.k]:e.target.value}))} onFocus={if_} onBlur={ib_}/></div>)}
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
                    <input style={S.input} type="number" placeholder="0.00" value={abonarMonto} onChange={e=>setAbonarMonto(e.target.value)} onFocus={if_} onBlur={ib_} autoFocus/>
                    <button style={S.submitBtn} onClick={handleAbonar}><PiggyBank size={18}/>Abonar</button>
                  </div>
                </div>
              )}
              {metas.map(m=><MetaCard key={m.id} meta={m} onAbonar={()=>{setAbonarMetaId(m.id);setAbonarMonto('');}} onEdit={()=>{setMetaForm({nombre:m.nombre,objetivo:String(m.objetivo),actual:String(m.actual),color:m.color});setMetaEditId(m.id);setShowMetaForm(true);}} onDelete={()=>handleMetaDel(m.id)}/>)}
            </div>
          </div>
        )}

        {/* â•â• STATS FASE D — ANÁLISIS CON CONCLUSIONES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {tab==='stats' && (
          <div>
            <div style={S.pageHeader('linear-gradient(135deg,#0f172a,#1e3a5f)')}>
              <div style={S.bubble(-40,'-40px',undefined,undefined,140,140,0.07)}/>
              <div style={S.pageTitle}>Análisis Inteligente</div>
              <div style={S.pageSub}>Lo que tus números te dicen</div>
            </div>
            <div style={{padding:'16px'}}>

              {/* â”€â”€ FASE E: Saldo en stats â”€â”€ */}
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

              {/* â”€â”€ Score financiero â”€â”€ */}
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

              {/* â”€â”€ Día con más gastos â”€â”€ */}
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

              {/* â”€â”€ Categoría que más crece â”€â”€ */}
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

              {/* â”€â”€ Pie por categoría â”€â”€ */}
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

              {/* â”€â”€ Mes a mes â”€â”€ */}
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
                {/* FASE D: Conclusión del gráfico */}
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

              {/* â”€â”€ FASE D: Conclusiones inteligentes â”€â”€ */}
              {(()=>{
                const insights = [];
                const tasaAhorro = stats.ingresos>0?(stats.balance/stats.ingresos)*100:0;
                const cuotasMes  = prestamos.reduce((s,p)=>s+p.cuotaMensual,0);
                const topCat     = catData[0];
                const gastosDiarios = txs.filter(t=>t.tipo==='gasto');
                // Día de la semana con más gastos
                const porDia = {0:0,1:0,2:0,3:0,4:0,5:0,6:0};
                gastosDiarios.forEach(t=>{ const d=new Date(t.fecha).getDay(); porDia[d]=(porDia[d]||0)+t.monto; });
                const diaMasGasto = Object.entries(porDia).sort((a,b)=>b[1]-a[1])[0];
                const diasSemana = ['domingos','lunes','martes','miércoles','jueves','viernes','sábados'];

                // Gastos con TC vs efectivo
                const gastoTC = txs.filter(t=>t.tipo==='gasto'&&t.medioPago==='tc').reduce((s,t)=>s+t.monto,0);
                                const pctTC   = stats.gastos>0?Math.round(gastoTC/stats.gastos*100):0;

                if (tasaAhorro >= 20) insights.push({ color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'Target', titulo:`Ahorras el ${tasaAhorro.toFixed(1)}% de tus ingresos`, texto:`Estás por encima del 20% recomendado. Cada mes guardas ${fmt(stats.balance)} que trabajan para ti.` });
                else if (tasaAhorro > 0) insights.push({ color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', icon:'BarChart2', titulo:`Ahorro al ${tasaAhorro.toFixed(1)}%`, texto:`Para llegar al 20% recomendado necesitas ahorrar ${fmt(stats.ingresos*0.2)} al mes. Te faltan ${fmt(stats.ingresos*0.2-stats.balance)}.` });

                if (topCat && topCat[0] !== 'Deporte') insights.push({ color:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe', icon:'Search', titulo:`${topCat[0]} es tu mayor gasto`, texto:`Represents el ${Math.round(topCat[1]/stats.gastos*100)}% de tus gastos totales — equivale a ${fmt(topCat[1])} este mes.` });

                if (diaMasGasto && porDia[diaMasGasto[0]] > 0) insights.push({ color:'#0891b2', bg:'#eff6ff', border:'#bfdbfe', icon:'Calendar', titulo:`Los ${diasSemana[diaMasGasto[0]]} gastas más`, texto:`${fmt(diaMasGasto[1])} en total. Estar consciente de este patrón es el primer paso para cambiarlo.` });

                if (pctTC > 50) insights.push({ color:'#ef4444', bg:'#fef2f2', border:'#fecaca', icon:'CreditCard', titulo:`${pctTC}% de tus gastos van a TC`, texto:`Más de la mitad de tus gastos acumulan deuda. Cuando puedas, prioriza pagar con efectivo para no inflar el consumido.` });
                else if (pctTC > 0) insights.push({ color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'CreditCard', titulo:`Solo el ${pctTC}% va a TC`, texto:`Buen balance. Usas la tarjeta con moderación. Sigue así y tu deuda TC será manejable.` });

                // Insight positivo si gasta en deporte
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

              {/* â”€â”€ Fechas importantes â”€â”€ */}
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
                  { label:'Pago TC', fecha:ciclo.limitePago, dias:diasPago, color:urgP, Icon:CreditCard, sub:'Fecha límite de pago VISA BCP' },
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

              {/* â”€â”€ Solo si casi termina un crédito â”€â”€ */}
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
        )}

        {/* â•â• MODAL SALDO DE CUENTA (FASE E) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {showSaldoSetup && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:300,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
            <div style={{background:'#fff',borderRadius:'24px 24px 0 0',padding:'24px',width:'100%',maxWidth:420}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <span style={{fontSize:18,fontWeight:800,color:'#1f1b4b'}}>Saldo en cuenta</span>
                <button onClick={()=>setShowSaldoSetup(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={20} color="#9ca3af"/></button>
              </div>
              <div style={{fontSize:12,color:'#9ca3af',marginBottom:16,lineHeight:1.5}}>
                Ingresa cuánto tienes ahora mismo en tu cuenta. La app descontará automáticamente cada gasto en efectivo y sumará cada ingreso.
              </div>
              <label style={S.label}>Saldo actual (S/.)</label>
              <input style={S.input} type="number" placeholder="0.00" value={saldoInput}
                onChange={e=>setSaldoInput(e.target.value)}
                onFocus={e=>e.target.style.borderColor='#7c3aed'}
                onBlur={e=>e.target.style.borderColor='#f0eeff'}
                autoFocus/>
              <div style={{display:'flex',gap:8}}>
                <button style={{...S.submitBtn}} onClick={()=>{
                  if(!saldoInput) return;
                  if(setSaldoCuenta) setSaldoCuenta(parseFloat(saldoInput));
                  setSaldoInput(''); setShowSaldoSetup(false);
                }}><Wallet size={18}/>Guardar saldo</button>
              </div>
              {saldoCuenta !== null && (
                <button onClick={()=>{if(setSaldoCuenta) setSaldoCuenta(null); setShowSaldoSetup(false);}}
                  style={{width:'100%',marginTop:10,padding:'10px',background:'none',border:'none',color:'#9ca3af',fontSize:12,fontFamily:'inherit',cursor:'pointer'}}>
                  Eliminar saldo de cuenta
                </button>
              )}
            </div>
          </div>
        )}

        {/* â•â• MODAL RESUMEN SALARIO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {showResumenSalario && resumenSalario && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:300,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
            <div style={{background:'#fff',borderRadius:'24px 24px 0 0',padding:'24px',width:'100%',maxWidth:420}}>
              <div style={{textAlign:'center',marginBottom:16}}>
                <div style={{width:50,height:50,borderRadius:'50%',background:'#dcfce7',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}>
                  <CheckCircle size={26} color="#16a34a"/>
                </div>
                <div style={{fontSize:18,fontWeight:800,color:'#1f1b4b'}}>¡Salario registrado!</div>
                <div style={{fontSize:13,color:'#9ca3af',marginTop:4}}>Cuotas descontadas automáticamente</div>
              </div>
              <div style={{background:'#f9f8ff',borderRadius:16,padding:'14px',marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,paddingBottom:10,borderBottom:'1px solid #f0eeff'}}>
                  <span style={{fontSize:13,color:'#9ca3af'}}>Salario ingresado</span>
                  <span style={{fontSize:14,fontWeight:800,color:'#10b981'}}>+{fmt(resumenSalario.ingreso)}</span>
                </div>
                {resumenSalario.cuotas.map((c,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:12,color:'#6b7280'}}>{c.nombre}</span>
                    <span style={{fontSize:13,fontWeight:700,color:'#ef4444'}}>-{fmt(c.monto)}</span>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',marginTop:10,paddingTop:10,borderTop:'1px solid #f0eeff'}}>
                  <span style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>Neto disponible</span>
                  <span style={{fontSize:15,fontWeight:800,color:'#7c3aed'}}>{fmt(resumenSalario.ingreso - resumenSalario.total)}</span>
                </div>
              </div>
              <button style={{...S.submitBtn}} onClick={()=>{setShowResumenSalario(false);setTab('home');}}>
                <CheckCircle size={18}/>Entendido
              </button>
            </div>
          </div>
        )}

        {/* â•â• BOTTOM NAV â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div style={S.bottomNav}>
          <button style={S.navBtn} onClick={()=>setTab('home')}><Home size={22} color={tab==='home'?'#7c3aed':'#9ca3af'}/><span style={S.navLabel(tab==='home')}>Inicio</span></button>
          <button style={S.navBtn} onClick={()=>setTab('deudas')}><CreditCard size={22} color={tab==='deudas'?'#7c3aed':'#9ca3af'}/><span style={S.navLabel(tab==='deudas')}>Deudas</span></button>
          <button style={S.fab} onClick={openAdd}><Plus size={24} color="#fff" strokeWidth={2.5}/></button>
          <button style={S.navBtn} onClick={()=>setTab('metas')}><Target size={22} color={tab==='metas'?'#7c3aed':'#9ca3af'}/><span style={S.navLabel(tab==='metas')}>Metas</span></button>
          <button style={S.navBtn} onClick={()=>setTab('stats')}><BarChart2 size={22} color={tab==='stats'?'#7c3aed':'#9ca3af'}/><span style={S.navLabel(tab==='stats')}>Stats</span></button>
        </div>

      </div>
    </div>
  );
}
