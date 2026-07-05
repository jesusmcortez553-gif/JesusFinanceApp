import { DICCIONARIO, CIUDADES, MENSAJES_NOCHE, MENSAJES_ALCOHOL } from '../constants/categorias';

// Quita acentos y pasa a minúsculas. Antes esto se repetía 10 veces en este archivo.
export const normalizar = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const limpiarDescripcion = (texto, monto, categoria) => {
  if (!texto) return texto;
  const norm = (s) => normalizar(s);
  let limpio = texto.trim();
  if (categoria) {
    const catNorm = norm(categoria);
    const textoNorm = norm(limpio);
    if (textoNorm.includes(catNorm)) {
      const idx = textoNorm.indexOf(catNorm);
      limpio = (limpio.slice(0, idx) + limpio.slice(idx + categoria.length)).trim();
    }
  }
  if (monto) {
    const palabras = limpio.split(' ').filter(p => p.length > 0);
    let montoEliminado = false;
    const filtradas = [];
    for (let i = palabras.length - 1; i >= 0; i--) {
      const p = palabras[i];
      const pNum = parseFloat(p.replace(/[^0-9.]/g, ''));
      if (!montoEliminado && !isNaN(pNum) && pNum > 0 && Math.abs(pNum - monto) < 0.01) {
        montoEliminado = true; continue;
      }
      filtradas.unshift(p);
    }
    limpio = filtradas.join(' ').trim();
  }
  limpio = limpio.replace(/  +/g, ' ').trim();
  if (limpio.length > 0) limpio = limpio.charAt(0).toUpperCase() + limpio.slice(1);
  return limpio || texto.trim();
};

export const extraerMonto = (texto) => {
  if (!texto) return { desc: texto, monto: null };
  const t = texto.trim();
  const patronFinal = /^(.*?)\s+(\d+(?:\.\d{1,2})?)\s*(?:soles?|s\/)?$/i;
  const matchFinal = t.match(patronFinal);
  if (matchFinal) { const monto = parseFloat(matchFinal[2]); if (monto > 0 && monto < 100000) return { desc: matchFinal[1].trim(), monto }; }
  const patronInicio = /^(\d+(?:\.\d{1,2})?)\s*(?:soles?|s\/)?\s+(.+)$/i;
  const matchInicio = t.match(patronInicio);
  if (matchInicio) { const monto = parseFloat(matchInicio[1]); if (monto > 0 && monto < 100000) return { desc: matchInicio[2].trim(), monto }; }
  return { desc: texto, monto: null };
};

export const detectarAlerta = (descripcion) => {
  const hora = new Date().getHours();
  const texto = normalizar(descripcion);
  const esNocturno = hora >= 23 || hora <= 4;
  const palabrasAlc = ['cerve','cerveza','ron','whisky','pisco','shots','trag','licor','vino','wine','hit','wild','cigarr','tabaco','discotec','bar','kara','tragos','copas','coctail','fiesta','botella','chela','chelas'];
  const esAlcohol  = palabrasAlc.some(p => texto.includes(p.toLowerCase().trim()));
  if (esNocturno && esAlcohol) return { tipo:'ambos',   msg: MENSAJES_NOCHE[Math.floor(Math.random()*MENSAJES_NOCHE.length)],    color:'#7f1d1d', bg:'#fef2f2', border:'#fecaca' };
  if (esNocturno)              return { tipo:'noche',   msg: MENSAJES_NOCHE[Math.floor(Math.random()*MENSAJES_NOCHE.length)],    color:'#92400e', bg:'#fffbeb', border:'#fde68a' };
  if (esAlcohol)               return { tipo:'alcohol', msg: MENSAJES_ALCOHOL[Math.floor(Math.random()*MENSAJES_ALCOHOL.length)],color:'#7f1d1d', bg:'#fef2f2', border:'#fecaca' };
  return null;
};

export const clasificarGasto = (descripcion, monto = 0) => {
  if (!descripcion || descripcion.length < 2) return null;
  const texto = normalizar(descripcion);
  const hora  = new Date().getHours();
  const esNocturno = hora >= 21 || hora <= 5;
  const montoNum   = parseFloat(monto) || 0;

  const categoriasValidas = Object.keys(DICCIONARIO).concat(['Vida nocturna','Salidas','Viajes','Familiar','Social','Regalo']);
  const categoriasNormalizadas = categoriasValidas.map(c => ({
    original: c,
    normalizada: normalizar(c)
  }));
  for (const { original, normalizada } of categoriasNormalizadas) {
    if (new RegExp(`\\b${normalizada}\\s*$`).test(texto) || new RegExp(`^\\s*${normalizada}\\b`).test(texto))
      return { categoria: original, confianza: 'alta', ajustado: false, forzado: true };
  }

  const palabrasAlcohol = ['cerveza','cerve','chela','chelas','ron ','whisky','pisco','vodka','shots','tequila','trag','licor','vino','wine','copa','coctail','cocktail','discotec','disco','after','boliche','pub','karaoke','hit ','wild ','cigarr','tabaco','bar '];
  if (palabrasAlcohol.some(p => texto.includes(p))) return { categoria:'Vida nocturna', confianza:'alta', ajustado:false };

  if (['rappi','pedidosya','uber eat','delivery','ifood'].some(p => texto.includes(p)))
    return { categoria:'Alimentación', confianza:'alta', ajustado:false };

  const palabrasFam = ['familia','familiar','mamá','mama','papá','papa','hermano','hermana','hijo','hija','tio','tia','abuelo','abuela'];
  if (palabrasFam.some(p => texto.includes(normalizar(p))))
    return { categoria:'Familiar', confianza:'alta', ajustado:false };
  const palabrasSoc = ['amigos','amigo','amiga','patas','pata','invité','cubrí','cumpleaños de'];
  if (palabrasSoc.some(p => texto.includes(normalizar(p))))
    return { categoria:'Social', confianza:'alta', ajustado:false };

  const palabrasRegalo = ['regalo','regalito','detalle','presente','sorpresa','cumpleaños para','dia de la madre','dia del padre','san valentin','navidad'];
  if (palabrasRegalo.some(p => texto.includes(normalizar(p))))
    return { categoria:'Regalo', confianza:'alta', ajustado:false };

  const tieneDestino = CIUDADES.some(c => texto.includes(c));
  const tienePrefijo = ['a ','para ','hacia '].some(p => texto.includes('pasaje '+p) || texto.includes('bus '+p));
  if ((texto.includes('pasaje') || texto.includes('bus') || texto.includes('vuelo')) && (tieneDestino || tienePrefijo))
    return { categoria:'Viajes', confianza:'alta', ajustado:false };
  if (texto.includes('aeropuerto') && (texto.includes('uber') || texto.includes('taxi')))
    return { categoria:'Viajes', confianza:'alta', ajustado:false };

  let mejorCat = null; let mejorScore = 0;
  for (const [cat, palabras] of Object.entries(DICCIONARIO)) {
    if (['Vida nocturna','Familiar','Social','Regalo'].includes(cat)) continue;
    for (const palabra of palabras) {
      const p = normalizar(palabra).trim();
      if (texto.includes(p) && p.length > mejorScore) { mejorScore = p.length; mejorCat = cat; }
    }
  }

  if (mejorCat === 'Alimentación' && montoNum > 15) mejorCat = 'Salidas';

  if (esNocturno && mejorCat === 'Alimentación') {
    const snacks = ['agua','chicle','gaseosa','jugo','bebida','snack'];
    if (snacks.some(p => texto.includes(p)) && montoNum >= 5)
      return { categoria:'Vida nocturna', confianza:'media', ajustado:true };
  }

  const confianza = mejorScore >= 6 ? 'alta' : mejorScore >= 4 ? 'media' : 'baja';
  return mejorCat ? { categoria:mejorCat, confianza, ajustado:false } : null;
};

const DICCIONARIO_INGRESOS = {
  'Salario':    ['salari','sueldo','quincena','planilla','remuneracion','pago mensual','deposito sueldo'],
  'Negocio':    ['venta','cobro','cliente','factura','boleta','negocio','tienda'],
  'Freelance':  ['proyecto','servicio','honorario','consultoria','freelance','trabajo extra','pago proyecto'],
  'Inversión':  ['dividendo','interes','rendimiento','inversion','ganancia','utilidad'],
  'Regalo':     ['regalo','propina','bono','gratificacion','prestamo recibido'],
  'Disposición TC': ['disposicion','disposición','avance efectivo','retiro tc'],
};

export const clasificarIngreso = (descripcion) => {
  if (!descripcion || descripcion.length < 2) return null;
  const texto = normalizar(descripcion);
  let mejorCat = null; let mejorScore = 0;
  for (const [cat, palabras] of Object.entries(DICCIONARIO_INGRESOS)) {
    for (const palabra of palabras) {
      const p = normalizar(palabra);
      if (texto.includes(p) && p.length > mejorScore) { mejorScore = p.length; mejorCat = cat; }
    }
  }
  return mejorCat ? { categoria: mejorCat, confianza: mejorScore >= 6 ? 'alta' : 'media', score: mejorScore } : null;
};

export const generarSugerencias = (txs, presupuestosActivos) => {
  const gastoPorCat = {};
  const countPorCat = {};
  txs.filter(t => t.tipo === 'gasto').forEach(t => {
    gastoPorCat[t.categoria] = (gastoPorCat[t.categoria]||0) + t.monto;
    countPorCat[t.categoria] = (countPorCat[t.categoria]||0) + 1;
  });
  if (txs.filter(t=>t.tipo==='gasto').length < 5) return [];
  return Object.entries(gastoPorCat)
    .filter(([cat]) => !presupuestosActivos.find(p => p.categoria === cat))
    .sort((a,b) => b[1]-a[1])
    .slice(0,3)
    .map(([cat, total]) => ({ categoria: cat, sugerido: Math.ceil(total * 1.1 / 10) * 10, basadoEn: countPorCat[cat] }));
};
