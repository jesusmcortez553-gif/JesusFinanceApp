import { useState, useEffect } from 'react';
import {
  doc, collection, onSnapshot,
  setDoc, addDoc, updateDoc, deleteDoc, getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

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
    }));
    unsubs.push(onSnapshot(collection(db, 'users', userId, 'presupuestos'), snap => {
      setPresupuestos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));
    unsubs.push(onSnapshot(collection(db, 'users', userId, 'metas'), snap => {
      setMetas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));
    unsubs.push(onSnapshot(collection(db, 'users', userId, 'tcs'), snap => {
      setTcs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));
    unsubs.push(onSnapshot(collection(db, 'users', userId, 'prestamos'), snap => {
      setPrestamos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));
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

  const userCol  = (col) => collection(db, 'users', userId, col);
  const userDoc  = (col, id) => doc(db, 'users', userId, col, id);
  const configDoc = () => doc(db, 'users', userId, 'config', 'main');

  const actualizarStreak = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const snap = await getDoc(configDoc());
    const config = snap.exists() ? snap.data() : {};
    const streakActual = config.streak || { dias: 0, ultimoDia: null };
    let nuevoStreak;
    if (streakActual.ultimoDia === hoy) {
      nuevoStreak = streakActual;
    } else {
      const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      nuevoStreak = { dias: streakActual.ultimoDia === ayer ? streakActual.dias + 1 : 1, ultimoDia: hoy };
    }
    await setDoc(configDoc(), { ...config, streak: nuevoStreak }, { merge: true });
  };

  // ── CRUD Transacciones ──
  const addTx = async (tx) => {
    await addDoc(userCol('transacciones'), { ...tx, createdAt: tx.createdAt || Date.now() });
    await actualizarStreak();
  };
  const updateTx = async (id, tx) => { await updateDoc(userDoc('transacciones', id), tx); };
  const deleteTx = async (id)     => { await deleteDoc(userDoc('transacciones', id)); };

  // ── CRUD Presupuestos ──
  const addPres    = async (pres)      => { const ref = await addDoc(userCol('presupuestos'), pres); return ref.id; };
  const updatePres = async (id, pres)  => { await updateDoc(userDoc('presupuestos', id), pres); };
  const deletePres = async (id)        => { await deleteDoc(userDoc('presupuestos', id)); };

  // ── CRUD Metas ──
  const addMeta    = async (meta)      => { const ref = await addDoc(userCol('metas'), meta); return ref.id; };
  const updateMeta = async (id, meta)  => { await updateDoc(userDoc('metas', id), meta); };
  const deleteMeta = async (id)        => { await deleteDoc(userDoc('metas', id)); };

  // ── CRUD TCs ──
  const addTc    = async (tc)    => { const ref = await addDoc(userCol('tcs'), tc); return ref.id; };
  const updateTc = async (id, tc) => { await updateDoc(userDoc('tcs', id), tc); };
  const deleteTc = async (id)    => { await deleteDoc(userDoc('tcs', id)); };

  // ── CRUD Préstamos ──
  const addPrestamo    = async (p)     => { const ref = await addDoc(userCol('prestamos'), p); return ref.id; };
  const updatePrestamo = async (id, p) => { await updateDoc(userDoc('prestamos', id), p); };
  const deletePrestamo = async (id)    => { await deleteDoc(userDoc('prestamos', id)); };

  // ── Saldo ──
  const setSaldoCuenta = async (valor) => {
    await setDoc(configDoc(), { saldoCuenta: valor }, { merge: true });
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
