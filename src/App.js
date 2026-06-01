import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CATEGORIAS_GASTO = ['Alimentación','Transporte','Servicios','Salud','Entretenimiento','Ropa','Educación','Otros'];
const CATEGORIAS_INGRESO = ['Salario','Negocio','Freelance','Inversión','Regalo','Otros'];

const COLORES = {
  ingreso: '#10b981',
  gasto: '#f43f5e',
  ahorro: '#6366f1',
  cats: ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899','#8b5cf6','#14b8a6'],
};

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const fmt = (n) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 }).format(n);

const initialData = {
  transacciones: [
    { id: 1, tipo: 'ingreso', categoria: 'Salario', descripcion: 'Salario mayo', monto: 2500, fecha: '2026-05-05' },
    { id: 2, tipo: 'gasto', categoria: 'Alimentación', descripcion: 'Mercado semanal', monto: 320, fecha: '2026-05-08' },
    { id: 3, tipo: 'gasto', categoria: 'Transporte', descripcion: 'Pasajes semana', monto: 80, fecha: '2026-05-10' },
    { id: 4, tipo: 'ingreso', categoria: 'Freelance', descripcion: 'Proyecto web', monto: 800, fecha: '2026-05-15' },
    { id: 5, tipo: 'gasto', categoria: 'Servicios', descripcion: 'Luz y agua', monto: 150, fecha: '2026-05-18' },
    { id: 6, tipo: 'gasto', categoria: 'Entretenimiento', descripcion: 'Salida familiar', monto: 120, fecha: '2026-05-22' },
    { id: 7, tipo: 'gasto', categoria: 'Salud', descripcion: 'Consulta médica', monto: 90, fecha: '2026-05-25' },
    { id: 8, tipo: 'ingreso', categoria: 'Negocio', descripcion: 'Ventas del mes', monto: 1200, fecha: '2026-05-28' },
  ]
};

export default function App() {
  const [transacciones, setTransacciones] = useState(initialData.transacciones);
  const [tab, setTab] = useState('dashboard');
  const [form, setForm] = useState({ tipo: 'gasto', categoria: 'Alimentación', descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0] });
  const [filtroMes, setFiltroMes] = useState('');
  const [editId, setEditId] = useState(null);

  const txFiltradas = useMemo(() => {
    if (!filtroMes) return transacciones;
    return transacciones.filter(t => t.fecha.startsWith(filtroMes));
  }, [transacciones, filtroMes]);

  const stats = useMemo(() => {
    const ingresos = txFiltradas.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0);
    const gastos = txFiltradas.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0);
    return { ingresos, gastos, ahorro: ingresos - gastos };
  }, [txFiltradas]);

  const pieData = useMemo(() => {
    const map = {};
    txFiltradas.filter(t => t.tipo === 'gasto').forEach(t => {
      map[t.categoria] = (map[t.categoria] || 0) + t.monto;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [txFiltradas]);

  const barData = useMemo(() => {
    const map = {};
    transacciones.forEach(t => {
      const mes = MESES[parseInt(t.fecha.split('-')[1]) - 1];
      if (!map[mes]) map[mes] = { mes, ingresos: 0, gastos: 0 };
      if (t.tipo === 'ingreso') map[mes].ingresos += t.monto;
      else map[mes].gastos += t.monto;
    });
    return Object.values(map);
  }, [transacciones]);

  const handleSubmit = () => {
    if (!form.descripcion || !form.monto || !form.fecha) return;
    if (editId) {
      setTransacciones(prev => prev.map(t => t.id === editId ? { ...form, id: editId, monto: parseFloat(form.monto) } : t));
      setEditId(null);
    } else {
      setTransacciones(prev => [...prev, { ...form, id: Date.now(), monto: parseFloat(form.monto) }]);
    }
    setForm({ tipo: 'gasto', categoria: 'Alimentación', descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0] });
    setTab('transacciones');
  };

  const handleEdit = (t) => {
    setForm({ ...t, monto: String(t.monto) });
    setEditId(t.id);
    setTab('agregar');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta transacción?')) {
      setTransacciones(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', background: '#f8f7f4', color: '#1a1a2e' }}>
      {/* Header */}
      <header style={{ background: '#1a1a2e', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, color: '#10b981', fontWeight: 700 }}>₿</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, color: '#fff', letterSpacing: '-0.5px' }}>finanzas<span style={{ color: '#6366f1' }}>.app</span></span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['dashboard','📊 Inicio'],['transacciones','📋 Historial'],['agregar','➕ Agregar'],['metas','🎯 Metas']].map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); if (id !== 'agregar') setEditId(null); }}
              style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                background: tab === id ? '#6366f1' : 'rgba(255,255,255,0.08)', color: tab === id ? '#fff' : 'rgba(255,255,255,0.7)', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Resumen</h1>
              <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', fontFamily: 'inherit', fontSize: 13 }}>
                <option value="">Todos los meses</option>
                {['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06'].map(m => (
                  <option key={m} value={m}>{MESES[parseInt(m.split('-')[1])-1]} 2026</option>
                ))}
              </select>
            </div>

            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Ingresos', value: stats.ingresos, color: COLORES.ingreso, icon: '↑' },
                { label: 'Gastos', value: stats.gastos, color: COLORES.gasto, icon: '↓' },
                { label: 'Ahorro neto', value: stats.ahorro, color: stats.ahorro >= 0 ? COLORES.ahorro : COLORES.gasto, icon: '◆' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'Space Mono', monospace" }}>{fmt(s.value)}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#aaa' }}>
                    {s.label === 'Ahorro neto' && stats.ingresos > 0 && `${Math.round(stats.ahorro / stats.ingresos * 100)}% de los ingresos`}
                    {s.label === 'Ingresos' && `${txFiltradas.filter(t=>t.tipo==='ingreso').length} transacciones`}
                    {s.label === 'Gastos' && `${txFiltradas.filter(t=>t.tipo==='gasto').length} transacciones`}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', border: '1px solid #eee' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: 15, fontWeight: 600 }}>Ingresos vs Gastos</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Bar dataKey="ingresos" fill={COLORES.ingreso} radius={[4,4,0,0]} name="Ingresos" />
                    <Bar dataKey="gastos" fill={COLORES.gasto} radius={[4,4,0,0]} name="Gastos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', border: '1px solid #eee' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: 15, fontWeight: 600 }}>Gastos por categoría</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false} fontSize={11}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORES.cats[i % COLORES.cats.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 14 }}>Sin gastos registrados</div>}
              </div>
            </div>

            {/* Últimas transacciones */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: 15, fontWeight: 600 }}>Últimas transacciones</h3>
              {txFiltradas.slice(-5).reverse().map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: t.tipo === 'ingreso' ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {t.tipo === 'ingreso' ? '↑' : '↓'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.descripcion}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>{t.categoria} · {t.fecha}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, color: t.tipo === 'ingreso' ? COLORES.ingreso : COLORES.gasto }}>
                    {t.tipo === 'ingreso' ? '+' : '-'}{fmt(t.monto)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORIAL */}
        {tab === 'transacciones' && (
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Historial</h1>
              <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', fontFamily: 'inherit', fontSize: 13 }}>
                <option value="">Todos</option>
                {['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06'].map(m => (
                  <option key={m} value={m}>{MESES[parseInt(m.split('-')[1])-1]} 2026</option>
                ))}
              </select>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee', overflow: 'hidden' }}>
              {[...txFiltradas].reverse().map((t, i) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < txFiltradas.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: t.tipo === 'ingreso' ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {t.tipo === 'ingreso' ? '↑' : '↓'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{t.descripcion}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                        <span style={{ background: t.tipo === 'ingreso' ? '#dcfce7' : '#fee2e2', color: t.tipo === 'ingreso' ? '#16a34a' : '#dc2626', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, marginRight: 6 }}>{t.categoria}</span>
                        {t.fecha}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: t.tipo === 'ingreso' ? COLORES.ingreso : COLORES.gasto }}>
                      {t.tipo === 'ingreso' ? '+' : '-'}{fmt(t.monto)}
                    </span>
                    <button onClick={() => handleEdit(t)} style={{ background: '#f5f5f5', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>✏️</button>
                    <button onClick={() => handleDelete(t.id)} style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                  </div>
                </div>
              ))}
              {txFiltradas.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>No hay transacciones para este período</div>
              )}
            </div>
          </div>
        )}

        {/* AGREGAR */}
        {tab === 'agregar' && (
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <h1 style={{ margin: '0 0 1.5rem', fontSize: 24, fontWeight: 700 }}>{editId ? '✏️ Editar' : '➕ Nueva transacción'}</h1>
            <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', border: '1px solid #eee', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              {/* Tipo toggle */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>TIPO</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['gasto','ingreso'].map(tipo => (
                    <button key={tipo} onClick={() => setForm(f => ({ ...f, tipo, categoria: tipo === 'gasto' ? 'Alimentación' : 'Salario' }))}
                      style={{ padding: '12px', borderRadius: 12, border: `2px solid ${form.tipo === tipo ? (tipo === 'ingreso' ? COLORES.ingreso : COLORES.gasto) : '#eee'}`,
                        background: form.tipo === tipo ? (tipo === 'ingreso' ? '#dcfce7' : '#fee2e2') : '#f9f9f9',
                        color: form.tipo === tipo ? (tipo === 'ingreso' ? '#16a34a' : '#dc2626') : '#999',
                        cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                      {tipo === 'ingreso' ? '↑ Ingreso' : '↓ Gasto'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos */}
              {[
                { label: 'DESCRIPCIÓN', key: 'descripcion', type: 'text', placeholder: 'ej. Mercado del lunes' },
                { label: 'MONTO (S/.)', key: 'monto', type: 'number', placeholder: '0.00' },
                { label: 'FECHA', key: 'fecha', type: 'date' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>{field.label}</label>
                  <input type={field.type} value={form[field.key]} placeholder={field.placeholder}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '2px solid #eee', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#eee'}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>CATEGORÍA</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '2px solid #eee', fontSize: 15, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
                  {(form.tipo === 'gasto' ? CATEGORIAS_GASTO : CATEGORIAS_INGRESO).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <button onClick={handleSubmit}
                style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#6366f1', color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', transition: 'transform 0.1s, background 0.2s' }}
                onMouseEnter={e => e.target.style.background = '#4f46e5'}
                onMouseLeave={e => e.target.style.background = '#6366f1'}
              >
                {editId ? 'Guardar cambios' : 'Registrar transacción'}
              </button>
            </div>
          </div>
        )}

        {/* METAS */}
        {tab === 'metas' && (
          <div>
            <h1 style={{ margin: '0 0 1.5rem', fontSize: 24, fontWeight: 700 }}>🎯 Metas de ahorro</h1>
            <MetasPanel ahorroActual={stats.ahorro} ingresos={stats.ingresos} />
          </div>
        )}
      </main>
    </div>
  );
}

function MetasPanel({ ahorroActual, ingresos }) {
  const [metas, setMetas] = useState([
    { id: 1, nombre: 'Fondo de emergencia', objetivo: 5000, actual: 1200, color: '#6366f1' },
    { id: 2, nombre: 'Vacaciones', objetivo: 2000, actual: 650, color: '#10b981' },
    { id: 3, nombre: 'Nuevo celular', objetivo: 1500, actual: 900, color: '#f59e0b' },
  ]);
  const [nuevaMeta, setNuevaMeta] = useState({ nombre: '', objetivo: '', actual: '' });
  const [mostrarForm, setMostrarForm] = useState(false);

  const agregarMeta = () => {
    if (!nuevaMeta.nombre || !nuevaMeta.objetivo) return;
    setMetas(prev => [...prev, { id: Date.now(), nombre: nuevaMeta.nombre, objetivo: parseFloat(nuevaMeta.objetivo), actual: parseFloat(nuevaMeta.actual || 0), color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0') }]);
    setNuevaMeta({ nombre: '', objetivo: '', actual: '' });
    setMostrarForm(false);
  };

  return (
    <div>
      <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        {metas.map(meta => {
          const pct = Math.min(100, Math.round(meta.actual / meta.objetivo * 100));
          return (
            <div key={meta.id} style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{meta.nombre}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: '#666' }}>
                  <span style={{ color: meta.color, fontWeight: 700 }}>S/ {meta.actual.toLocaleString()}</span>
                  <span style={{ color: '#ccc' }}> / S/ {meta.objetivo.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ background: '#f5f5f5', borderRadius: 100, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: meta.color, borderRadius: 100, transition: 'width 1s ease' }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#999', display: 'flex', justifyContent: 'space-between' }}>
                <span>{pct}% completado</span>
                <span>Faltan S/ {(meta.objetivo - meta.actual).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {!mostrarForm ? (
        <button onClick={() => setMostrarForm(true)}
          style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px dashed #d1d5db', background: 'transparent', color: '#6b7280', fontSize: 15, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500 }}>
          + Nueva meta de ahorro
        </button>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: 16 }}>Nueva meta</h3>
          {[{l:'Nombre de la meta',k:'nombre',t:'text'},{l:'Objetivo (S/.)',k:'objetivo',t:'number'},{l:'Ya tengo (S/.)',k:'actual',t:'number'}].map(f=>(
            <input key={f.k} type={f.t} placeholder={f.l} value={nuevaMeta[f.k]} onChange={e=>setNuevaMeta(p=>({...p,[f.k]:e.target.value}))}
              style={{display:'block',width:'100%',padding:'10px 14px',borderRadius:10,border:'1px solid #eee',fontSize:14,fontFamily:'inherit',marginBottom:10,boxSizing:'border-box'}} />
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={agregarMeta} style={{ flex:1, padding:'10px',borderRadius:10,border:'none',background:'#6366f1',color:'#fff',fontFamily:'inherit',fontWeight:600,cursor:'pointer' }}>Guardar</button>
            <button onClick={()=>setMostrarForm(false)} style={{ flex:1, padding:'10px',borderRadius:10,border:'1px solid #eee',background:'#fff',fontFamily:'inherit',cursor:'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
