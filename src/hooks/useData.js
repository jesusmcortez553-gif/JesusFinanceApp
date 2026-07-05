import { useState, useEffect } from 'react';
import {
  doc, collection, onSnapshot,
  setDoc, addDoc, updateDoc, deleteDoc, getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { hoyPeru, ayerPeru } from '../utils/fecha';

export const useData = (userId) => {
  const [txs, setTxs]                   = useState([]);
  const [presupuestos, setPresupuestos]  = useState([]);
  const [metas, setMetas]               = useState([]);
  const [tcs, setTcs]                   = useState([]);
  const [prestamos, setPrestamos]        = useState([]);
  const [saldoCuentaState, setSaldoCuentaState] = useState(null);
  const [streak, setStreak]             = useState({ dias: 0, ultimoDia: null });
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsubs = [];

    unsubs.push(onSnapshot(collection(db, 'users', userId, 'transacciones'), snap => {
      setTxs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, err => console.error('[useData] error escuchando transacciones:', err)));

    unsubs.push(onSnapshot(collection(db, 'users', userId, 'presupuestos'), snap => {
      setPresupuestos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, err => console.error('[useData] error escuchando presupuestos:', err)));

    unsubs.push(onSnapshot(collection(db, 'users', userId, 'metas'), snap => {
      setMetas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, err => console.error('[useData] error escuchando metas:', err)));

    unsubs.push(onSnapshot(collection(db, 'users', userId, 'tcs'), snap => {
      setTcs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, err => console.error('[useData] error escuchando tcs:', err)));

    unsubs.push(onSnapshot(collection(db, 'users', userId, 'prestamos'), snap => {
      setPrestamos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, err => console.error('[useData] error escuchando prestamos:', err)));

    unsubs.push(onSnapshot(doc(db, 'users', userId, 'config', 'main'), snap => {
      if (snap.exists()) {
        const data = snap.data();
        setSaldoCuentaState(data.saldoCuenta ?? null);
        setStreak(data.streak || { dias: 0, ultimoDia: null });
      }
      setLoading(false);
    }, err => console.error('[useData] error escuchando config:', err)));

    return () => unsubs.forEach(u => u());
  }, [userId]);

  const userCol  = (col) => collection(db, 'users', userId, col);
  const userDoc  = (col, id) => doc(db, 'users', userId, col, id);
  const configDoc = () => doc(db, 'users', userId, 'config', 'main');

  const actualizarStreak = async () => {
    const hoy = hoyPeru();
    const snap = await getDoc(configDoc());
    const config = snap.exists() ? snap.data() : {};
    const streakActual = config.streak || { dias: 0, ultimoDia: null };
    let nuevoStreak;
    if (streakActual.ultimoDia === hoy) {
      nuevoStreak = streakActual;
    } else {
      const ayer = ayerPeru();
      nuevoStreak = { dias: streakActual.ultimoDia === ayer ? streakActual.dias + 1 : 1, ultimoDia: hoy };
    }
    await setDoc(configDoc(), { ...config, streak: nuevoStreak }, { merge: true });
  };

  // ── CRUD Transacciones ──
  const addTx = async (tx) => {
    try {
      await addDoc(userCol('transacciones'), { ...tx, createdAt: tx.createdAt || Date.now() });
      await actualizarStreak();
    } catch (err) {
      console.error('[useData] addTx falló:', err);
      throw err;
    }
  };
  const updateTx = async (id, tx) => {
    try { await updateDoc(userDoc('transacciones', id), tx); }
    catch (err) { console.error('[useData] updateTx falló:', err); throw err; }
  };
  const deleteTx = async (id) => {
    try { await deleteDoc(userDoc('transacciones', id)); }
    catch (err) { console.error('[useData] deleteTx falló:', err); throw err; }
  };

  // ── CRUD Presupuestos ──
  const addPres = async (pres) => {
    try { const ref = await addDoc(userCol('presupuestos'), pres); return ref.id; }
    catch (err) { console.error('[useData] addPres falló:', err); throw err; }
  };
  const updatePres = async (id, pres) => {
    try { await updateDoc(userDoc('presupuestos', id), pres); }
    catch (err) { console.error('[useData] updatePres falló:', err); throw err; }
  };
  const deletePres = async (id) => {
    try { await deleteDoc(userDoc('presupuestos', id)); }
    catch (err) { console.error('[useData] deletePres falló:', err); throw err; }
  };

  // ── CRUD Metas ──
  const addMeta = async (meta) => {
    try { const ref = await addDoc(userCol('metas'), meta); return ref.id; }
    catch (err) { console.error('[useData] addMeta falló:', err); throw err; }
  };
  const updateMeta = async (id, meta) => {
    try { await updateDoc(userDoc('metas', id), meta); }
    catch (err) { console.error('[useData] updateMeta falló:', err); throw err; }
  };
  const deleteMeta = async (id) => {
    try { await deleteDoc(userDoc('metas', id)); }
    catch (err) { console.error('[useData] deleteMeta falló:', err); throw err; }
  };

  // ── CRUD TCs ──
  const addTc = async (tc) => {
    try { const ref = await addDoc(userCol('tcs'), tc); return ref.id; }
    catch (err) { console.error('[useData] addTc falló:', err); throw err; }
  };
  const updateTc = async (id, tc) => {
    try { await updateDoc(userDoc('tcs', id), tc); }
    catch (err) { console.error('[useData] updateTc falló:', err); throw err; }
  };
  const deleteTc = async (id) => {
    try { await deleteDoc(userDoc('tcs', id)); }
    catch (err) { console.error('[useData] deleteTc falló:', err); throw err; }
  };

  // ── CRUD Préstamos ──
  const addPrestamo = async (p) => {
    try { const ref = await addDoc(userCol('prestamos'), p); return ref.id; }
    catch (err) { console.error('[useData] addPrestamo falló:', err); throw err; }
  };
  const updatePrestamo = async (id, p) => {
    try { await updateDoc(userDoc('prestamos', id), p); }
    catch (err) { console.error('[useData] updatePrestamo falló:', err); throw err; }
  };
  const deletePrestamo = async (id) => {
    try { await deleteDoc(userDoc('prestamos', id)); }
    catch (err) { console.error('[useData] deletePrestamo falló:', err); throw err; }
  };

  // ── Saldo ──
  const setSaldoCuenta = async (valor) => {
    try { await setDoc(configDoc(), { saldoCuenta: valor }, { merge: true }); }
    catch (err) { console.error('[useData] setSaldoCuenta falló:', err); throw err; }
  };

  return {
    txs, presupuestos, metas, tcs, prestamos,
    saldoCuenta: saldoCuentaState, streak, loading,
    addTx, updateTx, deleteTx,
    addPres, updatePres, deletePres,
    addMeta, updateMeta, deleteMeta,
    addTc, updateTc, deleteTc,
    addPrestamo, updatePrestamo, deletePrestamo,
    setSaldoCuenta,
  };
};
