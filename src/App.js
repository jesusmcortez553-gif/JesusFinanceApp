import React, { useState, useMemo } from 'react';
import { Home, CreditCard, Plus, Target, BarChart2, Wallet, X } from 'lucide-react';
import { fmt } from './utils/format';
import { getCicloActual } from './utils/bcp';
import { limpiarDescripcion, extraerMonto, detectarAlerta, clasificarGasto, clasificarIngreso } from './utils/clasificar';
import { hoyPeru, mesActualPeru } from './utils/fecha';
import { MESES, PALABRAS_SALARIO, PALABRAS_DISPOSICION, PALABRAS_PAGO_TC } from './constants/categorias';
import { S } from './estilos';
import PaginaInicio from './pages/PaginaInicio';
import PaginaAgregar from './pages/PaginaAgregar';
import PaginaDeudas from './pages/PaginaDeudas';
import PaginaMetas from './pages/PaginaMetas';
import PaginaStats from './pages/PaginaStats';

// Fecha de hoy en formato YYYY-MM-DD (helper local, reemplaza al inline
// repetido varias veces en el App.js original).
const fechaHoyLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

// ═══════════════════════════════════════════════════════════════════
// APP PRINCIPAL — solo estado, cálculos derivados, handlers y ruteo.
// Todo el JSX por pestaña vive en src/pages/. Ver .ponytail.md para el
// detalle del motor de clasificación y los ciclos de facturación.
// ═══════════════════════════════════════════════════════════════════
export default function App({ user, data, onLogout }) {
  const [tab, setTab] = useState('home');
  // ── FIREBASE DATA ──
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

  const [txs, setTxs]                   = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [metas, setMetas]               = useState([]);
  const [showTcForm, setShowTcForm]     = useState(false);
  const [tcEditId, setTcEditId]         = useState(null);
  const [tcForm, setTcForm]             = useState({
    nombre:'', banco:'', numero:'', lineaTotal:'',
    consumido:'', deudaActual:'', tea:'', diaCorte:'', diaPago:'',
    color:'#b45309',
  });

  // Sync Firebase data to local state
  React.useEffect(() => { if (fbTxs !== undefined) setTxs(fbTxs); }, [fbTxs]);
  React.useEffect(() => { if (fbPres !== undefined) setPresupuestos(fbPres); }, [fbPres]);
  React.useEffect(() => { if (fbMetas !== undefined) setMetas(fbMetas); }, [fbMetas]);
  const [chartPeriod, setChartPeriod]   = useState('día');
  const [showAll, setShowAll]           = useState(false);
  const [subTabDeudas, setSubTabDeudas] = useState('tc');

  // Formulario TX
  const hoy = hoyPeru();
  const [txForm, setTxForm]         = useState({ tipo:'gasto', categoria:'Alimentación', descripcion:'', monto:'', fecha:hoy });
  const [txEditId, setTxEditId]     = useState(null);
  const [autoClasif, setAutoClasif] = useState(null);
  const [alertaEmoc, setAlertaEmoc] = useState(null);
  const [alertaAceptada, setAlertaAceptada] = useState(false);
  const [tipoEspecial, setTipoEspecial] = useState(null);
  const [medioPago, setMedioPago]       = useState('efectivo'); // 'efectivo' | 'tc'
  const [lastMedioPago, setLastMedioPago] = useState('efectivo');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Formulario presupuestos
  const [presForm, setPresForm]         = useState({ categoria:'Alimentación', limite:'' });
  const [presEditId, setPresEditId]     = useState(null);
  const [showPresForm, setShowPresForm] = useState(false);
  const [sugerenciasDescartadas, setSugerenciasDescartadas] = useState(false);

  // Formulario metas
  const [metaForm, setMetaForm]         = useState({ nombre:'', objetivo:'', actual:'', color:'#6366f1' });
  const [metaEditId, setMetaEditId]     = useState(null);
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [abonarMetaId, setAbonarMetaId] = useState(null);
  const [abonarMonto, setAbonarMonto]   = useState('');

  // Saldo de cuenta
  const [showSaldoSetup, setShowSaldoSetup] = useState(false);
  const [saldoInput, setSaldoInput]         = useState('');

  // Formulario préstamo
  const [showPresForm2, setShowPresForm2] = useState(false);
  const [presForm2, setPresForm2] = useState({ nombre:'', banco:'', numero:'', montoOriginal:'', capitalPendiente:'', cuotaMensual:'', proximoPago:'', tea:'', tcea:'', totalCuotas:'', cuotaActual:'0', color:'#1d4ed8' });
  const [presEditId2, setPresEditId2] = useState(null);

  const stats = useMemo(()=>{
    const ing=txs.filter(t=>t.tipo==='ingreso').reduce((s,t)=>s+t.monto,0);
    const gas=txs.filter(t=>t.tipo==='gasto').reduce((s,t)=>s+t.monto,0);
    return {ingresos:ing,gastos:gas,balance:ing-gas};
  },[txs]);

  const gastoPorCat = useMemo(()=>{ const m={}; txs.filter(t=>t.tipo==='gasto').forEach(t=>{m[t.categoria]=(m[t.categoria]||0)+t.monto;}); return m; },[txs]);
  const alertas     = useMemo(()=>presupuestos.filter(p=>(gastoPorCat[p.categoria]||0)/p.limite*100>=80),[presupuestos,gastoPorCat]);

  const areaData = useMemo(()=>{ const mesActual=mesActualPeru(); const d={}; txs.filter(t=>t.tipo==='gasto'&&t.fecha.startsWith(mesActual)).forEach(t=>{const n=parseInt(t.fecha.split('-')[2]);d[n]=(d[n]||0)+t.monto;}); const diasMes=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate(); return Array.from({length:diasMes},(_,i)=>({dia:`${i+1}`,monto:d[i+1]||0})); },[txs]);
  const barData  = useMemo(()=>{ const m={}; txs.forEach(t=>{const mes=MESES[parseInt(t.fecha.split('-')[1])-1]; if(!m[mes])m[mes]={mes,ingresos:0,gastos:0}; m[mes][t.tipo==='ingreso'?'ingresos':'gastos']+=t.monto;}); return Object.values(m); },[txs]);
  const catData  = useMemo(()=>Object.entries(gastoPorCat).sort((a,b)=>b[1]-a[1]).slice(0,8),[gastoPorCat]);
  const maxGasto = Math.max(...catData.map(c=>c[1]),1);
  const recentTxs= useMemo(()=>[...txs]
    .sort((a,b)=>{
      // Primero por fecha descendente
      const fechaDiff = new Date(b.fecha) - new Date(a.fecha);
      if (fechaDiff !== 0) return fechaDiff;
      // Mismo día → orden de ingreso (createdAt o id numérico)
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
      if(addTx) addTx(salarioTx).catch(err=>console.error('[App] addTx salario falló:', err));
      setTxs(p=>[...p, {...salarioTx, id:'temp_'+Date.now()}]);
      setTxForm({tipo:'ingreso',categoria:'Salario',descripcion:'',monto:'',fecha:hoyPeru()});
      setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
      setTab('home');
      return;
    }

    if (tipoEspecial === 'disposicion') {
      const ingTx = { ...txForm, tipo:'ingreso', monto, categoria:'Disposición TC' };
      const intTx = { tipo:'gasto', categoria:'Servicios', descripcion:'Interés disposición TC', monto:0, fecha };
      if(addTx) addTx(ingTx).catch(err=>console.error('[App] addTx disposición (ingreso) falló:', err));
      if(addTx) addTx(intTx).catch(err=>console.error('[App] addTx disposición (interés) falló:', err));
      setTxs(p=>[...p, {...ingTx, id:'temp_'+Date.now()}, {...intTx, id:'temp_'+(Date.now()+1)}]);
      if(tcs && tcs[0] && updateTc) {
        const tc0 = tcs[0];
        updateTc(tc0.id, { ...tc0, consumido: tc0.consumido+monto, deudaActual: tc0.deudaActual+monto }).catch(err=>console.error('[App] updateTc disposición falló:', err));
      }
      setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:fechaHoyLocal()});
      setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
      setTab('home');
      return;
    }

    if (tipoEspecial === 'pagoTC') {
      if(tcs && tcs[0] && updateTc) {
        const tc0 = tcs[0];
        updateTc(tc0.id, { ...tc0, consumido: Math.max(0,tc0.consumido-monto), deudaActual: Math.max(0,tc0.deudaActual-monto) }).catch(err=>console.error('[App] updateTc pago TC falló:', err));
      }
      const pagoTx = { ...txForm, monto, categoria:'Servicios', descripcion:'Pago tarjeta de crédito' };
      if(addTx) addTx(pagoTx).catch(err=>console.error('[App] addTx pago TC falló:', err));
      setTxs(p=>[...p, {...pagoTx, id:'temp_'+Date.now()}]);
      setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:fechaHoyLocal()});
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
        if(tc) updateTc(tc.id, { ...tc, consumido: tc.consumido+monto, deudaActual: tc.deudaActual+monto }).catch(err=>console.error('[App] updateTc consumo falló:', err));
      }
    }
    if (txForm.tipo === 'ingreso' && saldoCuenta !== null && tipoEspecial !== 'disposicion') {
      if(setSaldoCuenta) setSaldoCuenta(saldoCuenta + monto);
    }
    if(txEditId){
      const txEditada = { tipo:txForm.tipo, descripcion:descLimpia, categoria:categoriaFinal, monto, fecha:txForm.fecha, medioPago };
      setTxs(p=>p.map(t=>String(t.id)===String(txEditId)?{...t,...txEditada}:t));
      if(updateTx) updateTx(String(txEditId), txEditada).catch(e=>console.error('[App] updateTx falló:',e));
      setTxEditId(null);
    } else {
      const newId = Date.now();
      const txFinal = {...txForm, descripcion:descLimpia, categoria:categoriaFinal, monto, medioPago, createdAt:newId};
      if(addTx) {
        addTx({...txFinal}).catch(e=>console.error('[App] addTx falló:',e));
        setTxs(p=>[...p, {...txFinal, id:'temp_'+newId}]);
      } else {
        setTxs(p=>[...p, {...txFinal, id:newId}]);
      }
    }
    setLastMedioPago(medioPago);
    setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:fechaHoyLocal()});
    setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
    setShowDatePicker(false);
    setTab('home');
  };
  const openAdd = () => {
    setTxEditId(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
    setMedioPago(lastMedioPago); setShowDatePicker(false);
    setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:fechaHoyLocal()});
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
      if(deleteTx) deleteTx(String(id)).catch(err=>console.error('[App] deleteTx falló:', err));
    }
  };

  const handlePresSubmit = () => {
    if(!presForm.categoria||!presForm.limite) return;
    const obj = {...presForm, limite:parseFloat(presForm.limite)};
    if(presEditId){
      setPresupuestos(p=>p.map(x=>x.id===presEditId?{...obj,id:presEditId}:x));
      if(updatePres) updatePres(presEditId, obj).catch(err=>console.error('[App] updatePres falló:', err));
      setPresEditId(null);
    } else {
      const newId = 'temp_'+Date.now();
      setPresupuestos(p=>[...p,{...obj,id:newId}]);
      if(addPres) addPres(obj).catch(err=>console.error('[App] addPres falló:', err));
    }
    setPresForm({categoria:'Alimentación',limite:''}); setShowPresForm(false);
  };
  const handlePresDel = (id) => {
    if(String(id).startsWith('temp_')) return; // aún no confirma Firestore, espera un segundo
    if(window.confirm('¿Eliminar?')) {
      setPresupuestos(p=>p.filter(x=>x.id!==id));
      if(deletePres) deletePres(id).catch(err=>console.error('[App] deletePres falló:', err));
    }
  };

  const handleMetaSubmit = () => {
    if(!metaForm.nombre||!metaForm.objetivo) return;
    const obj = {...metaForm, objetivo:parseFloat(metaForm.objetivo), actual:parseFloat(metaForm.actual||0)};
    if(metaEditId){
      setMetas(p=>p.map(m=>m.id===metaEditId?{...obj,id:metaEditId}:m));
      if(updateMeta) updateMeta(metaEditId, obj).catch(err=>console.error('[App] updateMeta falló:', err));
      setMetaEditId(null);
    } else {
      setMetas(p=>[...p,{...obj,id:'temp_'+Date.now()}]);
      if(addMeta) addMeta(obj).catch(err=>console.error('[App] addMeta falló:', err));
    }
    setMetaForm({nombre:'',objetivo:'',actual:'',color:'#6366f1'}); setShowMetaForm(false);
  };
  const handleMetaDel = (id) => {
    if(String(id).startsWith('temp_')) return; // aún no confirma Firestore, espera un segundo
    if(window.confirm('¿Eliminar?')) {
      setMetas(p=>p.filter(m=>m.id!==id));
      if(deleteMeta) deleteMeta(id).catch(err=>console.error('[App] deleteMeta falló:', err));
    }
  };
  const handleAbonar = () => {
    if(!abonarMonto) return;
    const meta = metas.find(m=>m.id===abonarMetaId);
    if(!meta) return;
    const nuevoActual = Math.min(meta.objetivo, meta.actual + parseFloat(abonarMonto));
    setMetas(p=>p.map(m=>m.id===abonarMetaId?{...m,actual:nuevoActual}:m));
    if(String(abonarMetaId).startsWith('temp_')) {
      console.error('[App] abonar en meta aún no confirmada por Firestore, espera un segundo');
    } else if(updateMeta) {
      updateMeta(abonarMetaId, {...meta,actual:nuevoActual}).catch(err=>console.error('[App] abonar falló:', err));
    }
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
      if(updateTc) updateTc(tcEditId, tc).catch(err=>console.error('[App] updateTc falló:', err));
      setTcEditId(null);
    } else {
      if(addTc) addTc(tc).catch(err=>console.error('[App] addTc falló:', err));
    }
    setTcForm({nombre:'',banco:'',numero:'',lineaTotal:'',consumido:'',deudaActual:'',tea:'',diaCorte:'',diaPago:'',color:'#b45309'});
    setShowTcForm(false);
  };

  const handleTcDel = (id) => {
    if (window.confirm('¿Eliminar tarjeta?')) if(deleteTc) deleteTc(id).catch(err=>console.error('[App] deleteTc falló:', err));
  };

  const handlePres2Submit = () => {
    if(!presForm2.nombre||!presForm2.cuotaMensual) return;
    const obj = {...presForm2, montoOriginal:parseFloat(presForm2.montoOriginal||0), capitalPendiente:parseFloat(presForm2.capitalPendiente||0), pagado:parseFloat(presForm2.montoOriginal||0)-parseFloat(presForm2.capitalPendiente||0), cuotaMensual:parseFloat(presForm2.cuotaMensual), tea:parseFloat(presForm2.tea||0), tcea:parseFloat(presForm2.tcea||0), totalCuotas:parseInt(presForm2.totalCuotas||0), cuotaActual:parseInt(presForm2.cuotaActual||0) };
    if(presEditId2){
      if(updatePrestamo) updatePrestamo(presEditId2, obj).catch(err=>console.error('[App] updatePrestamo falló:', err));
      setPresEditId2(null);
    } else {
      if(addPrestamo) addPrestamo(obj).catch(err=>console.error('[App] addPrestamo falló:', err));
    }
    setPresForm2({nombre:'',banco:'',numero:'',montoOriginal:'',capitalPendiente:'',cuotaMensual:'',proximoPago:'',tea:'',tcea:'',totalCuotas:'',cuotaActual:'0',color:'#1d4ed8'});
    setShowPresForm2(false);
  };
  const handlePres2Edit = (p) => { setPresForm2({...p,montoOriginal:String(p.montoOriginal),capitalPendiente:String(p.capitalPendiente),cuotaMensual:String(p.cuotaMensual),tea:String(p.tea),tcea:String(p.tcea),totalCuotas:String(p.totalCuotas),cuotaActual:String(p.cuotaActual)}); setPresEditId2(p.id); setShowPresForm2(true); };
  const handlePres2Del  = (id) => { if(window.confirm('¿Eliminar?')) if(deletePrestamo) deletePrestamo(id).catch(err=>console.error('[App] deletePrestamo falló:', err)); };

  // Pago manual de cuota. Reemplaza el descuento automático que se
  // llevaba la cuota completa de cada crédito sin ver si el sueldo alcanzaba.
  // Ahora el usuario decide cuándo pagar, y esa acción SIEMPRE queda
  // registrada como movimiento en transacciones.
  const handlePagarCuota = (p) => {
    if(!window.confirm(`¿Registrar pago de ${fmt(p.cuotaMensual)} para ${p.nombre} ${p.numero}?`)) return;
    const fecha = hoyPeru();
    const cuotaTx = { tipo:'gasto', categoria:'Servicios', descripcion:`Cuota ${p.nombre} ${p.numero}`, monto:p.cuotaMensual, fecha };
    setTxs(prev=>[...prev, {...cuotaTx, id:'temp_'+Date.now()}]);
    if(addTx) addTx(cuotaTx).catch(err=>console.error('[App] addTx pago cuota falló:', err));
    const updP = {
      ...p,
      capitalPendiente: Math.max(0, p.capitalPendiente - p.cuotaMensual),
      pagado: (p.pagado||0) + p.cuotaMensual,
      cuotaActual: (p.cuotaActual||0) + 1,
    };
    if(updatePrestamo) updatePrestamo(p.id, updP).catch(err=>console.error('[App] updatePrestamo (pago cuota) falló:', err));
  };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"/>
      <div style={S.phone}>

        {tab==='home' && (
          <PaginaInicio
            user={user} onLogout={onLogout} streak={streak}
            saldoCuenta={saldoCuenta} setShowSaldoSetup={setShowSaldoSetup}
            stats={stats} alertas={alertas} gastoPorCat={gastoPorCat} proximosVenc={proximosVenc}
            chartPeriod={chartPeriod} setChartPeriod={setChartPeriod} areaData={areaData} barData={barData}
            catData={catData} maxGasto={maxGasto} showAll={showAll} setShowAll={setShowAll} recentTxs={recentTxs}
            handleTxEdit={handleTxEdit} handleTxDel={handleTxDel}
          />
        )}

        {tab==='agregar' && (
          <PaginaAgregar
            txForm={txForm} setTxForm={setTxForm} txEditId={txEditId}
            autoClasif={autoClasif} setAutoClasif={setAutoClasif}
            alertaEmoc={alertaEmoc} setAlertaEmoc={setAlertaEmoc} alertaAceptada={alertaAceptada} tipoEspecial={tipoEspecial}
            medioPago={medioPago} setMedioPago={setMedioPago}
            showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker}
            handleDescChange={handleDescChange} elegirCategoria={elegirCategoria} handleTxSubmit={handleTxSubmit} tcs={tcs}
          />
        )}

        {tab==='deudas' && (
          <PaginaDeudas
            user={user} tcs={tcs} prestamos={prestamos} proximosVenc={proximosVenc}
            subTabDeudas={subTabDeudas} setSubTabDeudas={setSubTabDeudas}
            showTcForm={showTcForm} setShowTcForm={setShowTcForm} tcEditId={tcEditId} setTcEditId={setTcEditId}
            tcForm={tcForm} setTcForm={setTcForm} handleTcSubmit={handleTcSubmit} handleTcDel={handleTcDel}
            showPresForm2={showPresForm2} setShowPresForm2={setShowPresForm2}
            presForm2={presForm2} setPresForm2={setPresForm2} presEditId2={presEditId2} setPresEditId2={setPresEditId2}
            handlePres2Submit={handlePres2Submit} handlePres2Edit={handlePres2Edit} handlePres2Del={handlePres2Del}
            handlePagarCuota={handlePagarCuota}
          />
        )}

        {tab==='metas' && (
          <PaginaMetas
            presupuestos={presupuestos} gastoPorCat={gastoPorCat}
            showPresForm={showPresForm} setShowPresForm={setShowPresForm}
            presForm={presForm} setPresForm={setPresForm} presEditId={presEditId} setPresEditId={setPresEditId}
            handlePresSubmit={handlePresSubmit} handlePresDel={handlePresDel}
            txs={txs} sugerenciasDescartadas={sugerenciasDescartadas} setSugerenciasDescartadas={setSugerenciasDescartadas}
            addPres={addPres} setPresupuestos={setPresupuestos}
            metas={metas} showMetaForm={showMetaForm} setShowMetaForm={setShowMetaForm}
            metaForm={metaForm} setMetaForm={setMetaForm} metaEditId={metaEditId} setMetaEditId={setMetaEditId}
            handleMetaSubmit={handleMetaSubmit} handleMetaDel={handleMetaDel}
            abonarMetaId={abonarMetaId} setAbonarMetaId={setAbonarMetaId}
            abonarMonto={abonarMonto} setAbonarMonto={setAbonarMonto} handleAbonar={handleAbonar}
          />
        )}

        {tab==='stats' && (
          <PaginaStats
            saldoCuenta={saldoCuenta} setShowSaldoSetup={setShowSaldoSetup}
            stats={stats} prestamos={prestamos} topDay={topDay} txs={txs} catData={catData} barData={barData}
          />
        )}

        {/* ══ MODAL SALDO DE CUENTA — se abre desde Inicio y Stats ══ */}
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

        {/* ══ BOTTOM NAV ══ */}
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
