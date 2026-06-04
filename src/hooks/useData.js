import { useState, useEffect } from 'react';
import {
  doc, collection, onSnapshot,
  setDoc, addDoc, updateDoc, deleteDoc, getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

const INITIAL_PRESUPUESTOS = [
  { id:'p1', categoria:'Alimentación', limite:500 },
  { id:'p2', categoria:'Transporte',   limite:150 },
  { id:'p3', categoria:'Entretenimiento', limite:100 },
  { id:'p4', categoria:'Servicios',    limite:200 },
];
const INITIAL_METAS = [
  { id:'m1', nombre:'Fondo de emergencia', objetivo:5000, actual:1200, color:'#6366f1' },
  { id:'m2', nombre:'Vacaciones',          objetivo:2000, actual:650,  color:'#10b981' },
  { id:'m3', nombre:'Nuevo celular',       objetivo:1500, actual:900,  color:'#f59e0b' },
];

export const useData = (userId) => {
  const [txs, setTxs]                 = useState([]);
  const [presupuestos, setPresupuestos] = useState(INITIAL_PRESUPUESTOS);
  const [metas, setMetas]             = useState(INITIAL_METAS);
  const [saldoCuenta, setSaldoCuentaState] = useState(null);
  const [streak, setStreak]           = useState({ dias: 0, ultimoDia: null });
  const [loading, setLoading]         = useState(true);

  // ── Escuchar datos en tiempo real ──
  useEffect(() => {
    if (!userId) return;
    const unsubs = [];

    // Transacciones
    unsubs.push(onSnapshot(collection(db, 'users', userId, 'transacciones'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
      setTxs(data);
    }));

    // Presupuestos
    unsubs.push(onSnapshot(collection(db, 'users', userId, 'presupuestos'), snap => {
      if (!snap.empty) setPresupuestos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));

    // Metas
    unsubs.push(onSnapshot(collection(db, 'users', userId, 'metas'), snap => {
      if (!snap.empty) setMetas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));

    // Config (saldo + streak)
    unsubs.push(onSnapshot(doc(db, 'users', userId, 'config', 'main'), snap => {
      if (snap.exists()) {
        const data = snap.data();
        setSaldoCuentaState(data.saldoCuenta ?? null);
        setStreak(data.streak || { dias: 0, ultimoDia: null });
      }
      setLoading(false);
    }));

    return () => unsubs.forEach(u => u());
  }, [userId]);

  // ── Helpers Firestore ──
  const userCol = (col) => collection(db, 'users', userId, col);
  const userDoc = (col, id) => doc(db, 'users', userId, col, id);
  const configDoc = () => doc(db, 'users', userId, 'config', 'main');

  // ── Actualizar streak al registrar transacción ──
  const actualizarStreak = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const snap = await getDoc(configDoc());
    const config = snap.exists() ? snap.data() : {};
    const streakActual = config.streak || { dias: 0, ultimoDia: null };
    let nuevoStreak;
    if (streakActual.ultimoDia === hoy) {
      nuevoStreak = streakActual; // ya registró hoy
    } else {
      const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      nuevoStreak = {
        dias: streakActual.ultimoDia === ayer ? streakActual.dias + 1 : 1,
        ultimoDia: hoy,
      };
    }
    await setDoc(configDoc(), { ...config, streak: nuevoStreak }, { merge: true });
  };

  // ── CRUD Transacciones ──
  const addTx = async (tx) => {
    await addDoc(userCol('transacciones'), tx);
    await actualizarStreak();
  };
  const updateTx = async (id, tx) => {
    await updateDoc(userDoc('transacciones', id), tx);
  };
  const deleteTx = async (id) => {
    await deleteDoc(userDoc('transacciones', id));
  };

  // ── CRUD Presupuestos ──
  const addPres = async (pres) => {
    const ref = await addDoc(userCol('presupuestos'), pres);
    return ref.id;
  };
  const updatePres = async (id, pres) => {
    await updateDoc(userDoc('presupuestos', id), pres);
  };
  const deletePres = async (id) => {
    await deleteDoc(userDoc('presupuestos', id));
  };

  // ── CRUD Metas ──
  const addMeta = async (meta) => {
    const ref = await addDoc(userCol('metas'), meta);
    return ref.id;
  };
  const updateMeta = async (id, meta) => {
    await updateDoc(userDoc('metas', id), meta);
  };
  const deleteMeta = async (id) => {
    await deleteDoc(userDoc('metas', id));
  };

  // ── Saldo ──
  const setSaldoCuenta = async (valor) => {
    await setDoc(configDoc(), { saldoCuenta: valor }, { merge: true });
  };

  return {
    txs, presupuestos, metas, saldoCuenta, streak, loading,
    addTx, updateTx, deleteTx,
    addPres, updatePres, deletePres,
    addMeta, updateMeta, deleteMeta,
    setSaldoCuenta,
  };
};
