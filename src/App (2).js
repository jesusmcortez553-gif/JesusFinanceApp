import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ShoppingCart, Car, Zap, Heart, Gamepad2, Shirt, BookOpen, Package,
  Briefcase, Store, Monitor, TrendingUp, Gift,
  Home, BarChart2, Plus, Target,
  ArrowUpCircle, ArrowDownCircle, Wallet,
  Pencil, Trash2, User, ChevronRight, Calendar,
  AlertTriangle, CheckCircle, Flag, PiggyBank, X,
  CreditCard, Landmark, Clock, TrendingDown,
  Receipt, Utensils, Plane, Moon, Users, UserCheck, Trophy
} from 'lucide-react';

// ─── DATOS INICIALES ──────────────────────────────────────────────────────────
const CAT_ICONOS = {
  'Alimentación':  { icon: ShoppingCart, color: '#f97316' },
  'Salidas':       { icon: Utensils,     color: '#f59e0b' },
  'Transporte':    { icon: Car,          color: '#3b82f6' },
  'Viajes':        { icon: Plane,        color: '#0891b2' },
  'Servicios':     { icon: Zap,          color: '#eab308' },
  'Salud':         { icon: Heart,        color: '#ef4444' },
  'Entretenimiento':{ icon: Gamepad2,    color: '#8b5cf6' },
  'Vida nocturna': { icon: Moon,         color: '#6d28d9' },
  'Educación':     { icon: BookOpen,     color: '#06b6d4' },
  'Ropa':          { icon: Shirt,        color: '#ec4899' },
  'Hogar':         { icon: Home,         color: '#84cc16' },
  'Familiar':      { icon: Users,        color: '#10b981' },
  'Social':        { icon: UserCheck,    color: '#059669' },
  'Regalo':        { icon: Gift,         color: '#7c3aed' },
  'Mascotas':      { icon: Package,      color: '#a16207' },
  'Otros':         { icon: Package,      color: '#6b7280' },
  'Salario':       { icon: Briefcase,    color: '#10b981' },
  'Negocio':       { icon: Store,        color: '#059669' },
  'Freelance':     { icon: Monitor,      color: '#0d9488' },
  'Inversión':     { icon: TrendingUp,   color: '#0891b2' },
  'Disposición TC':{ icon: CreditCard,   color: '#dc2626' },
};
const CATS_GASTO   = ['Alimentación','Salidas','Transporte','Viajes','Servicios','Salud','Deporte','Entretenimiento','Vida nocturna','Educación','Ropa','Hogar','Familiar','Social','Regalo','Mascotas','Otros'];
const CATS_INGRESO = ['Salario','Negocio','Freelance','Inversión','Disposición TC','Regalo','Otros'];
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

// ─── DICCIONARIO PERUANO — 15 CATEGORÍAS ────────────────────────────────────
const DICCIONARIO = {
  'Alimentación': [
    'bodeg','mercad','supermercad','plazavea','wong','tottus','tambo','mass','listo','oxxo',
    'caserít','minimarket','pan','panader','desayun','leche','yogur','queso','huev','arroz',
    'verdur','frut','carn','pescad','atun','sardina','gaseosa','agua mineral','aguas mineral',
    'rappi','pedidosya','uber eat','delivery','salchipap','anticuch','picard','empanada',
    'sanguch','baguett','quinua','kiwicha','avena','cereal','choclo','papa','camot',
  ],
  'Salidas': [
    // Restaurantes y lugares
    'restaur','cevicher','polleri','chifer','pizzer','hamburguer','sushit','sangucheri',
    'parrilla','asadero','buffet','cafeter','loncheri','picanter','huarique',
    // Platos peruanos
    'cevich','lomo saltado','aji de gallina','causa','chicharr','juane','tacacho',
    'pachamanca','anticucho','rocoto relleno','papa rellena','tacu tacu',
    'arroz con leche','mazamorra','picarone',
    // Platos populares
    'alitas','alas de pollo','sushi','salchipollo','salchipapa','broaster','broster',
    'caldo','caldito','caldo de gallina','caldo verde','parihuela','aguadito',
    'pollo a la brasa','pollada','pollo entero','pollo familiar',
    'chaufa','chifa','arroz chaufa','tallarín saltado','wantan',
    'pizza','hamburguesa','hot dog','shawarma','tacos','burritos',
    'pollo frito','milanesa','apanado','bistec',
    // Contexto de salida
    'almuerz','menú del dia','menu del dia','la carta','cena','brunch','lonch',
    'delivery restaurant','pedí','pedi al restaurant',
  ],
  'Transporte': [
    'uber','cabif','taxi','indriver','beat','bus','micr','comb','colectiv',
    'metropolit','corredor','tren','mototax','motocar','tuc',
    'pasaje','pasaj','combustibl','gasolin','grif','repsol','primax','pecsa',
    'estacionam','peaj','cochera','mantenimi moto','llanta','aceite moto',
  ],
  'Viajes': [
    'aeropuerto','terminal terrestre','cruz del sur','tepsa','movil','oltursa',
    'hotel','hostal','airbnb','hospedaj','alojam',
    'pasaje a ','pasaje para ','bus a ','bus para ','vuelo a ',
  ],
  'Servicios': [
    'luz','agua','gas','internet','wifi','claro','movistar','entel','bitel',
    'sedapal','enel','netflix','spotify','disney','hbo','youtube premium','prime video',
    'recarg','chip','plan celular','alquil','arriend','administr','condomin',
    'plomer','gasfiter','electricista','cerrajer',
    'claude','chatgpt','canva pro','figma','zoom','google one','icloud',
  ],
  'Salud': [
    'farmaci','botic','inkafarm','mifarm','doctor','medic','clinic','hospital',
    'consult','analis','laborator','medicament','pastill','medicin','vitamina',
    'essalud','optic','dentist','psicolog','nutricion','terapia','vacun','emergencia',
  ],
  'Deporte': [
    'gimnasi','gym','yoga','pilates','crossfit','zumba',
    'voley','futbol','fulbito','cancha','partido deport','basquet','tenis','natacion',
    'running','correr','ciclismo','biciclet deport','boxeo','artes marciales',
    'proteina','suplemento deport','pesas','implemento deport',
    'inscripcion deport','matricula deport','mensualidad gym',
  ],
  'Entretenimiento': [
    'cine','cinemark','cineplanet','concert','event','teatro','obra',
    'parque','piscin','estadio','partido','futbol','voley',
    'videojueg','jueg','playstation','xbox','steam',
    'karting','paintball','escape room','zoologico','museo',
  ],
  'Vida nocturna': [
    'cerveza','cerve','chela','chelas','ron ','whisky','pisco','vodka','shots','tequila',
    'trag','licor','vino','wine','copa','coctail','cocktail',
    'discotec','disco','after','boliche','pub','karaoke',
    'botella','tabla','mesa vip','hit ','wild ','cigarr','tabaco','bar ',
  ],
  'Educación': [
    'colegio','univers','institu','academi','preuniversit',
    'matricul','pension escolar','pension universidad',
    'curs','taller','seminari','capacit','diplomad','maestri',
    'libr','util','cuadern','lapic','fotocopi',
    'ingles','idiom','udemy','coursera','platzi','domestika',
  ],
  'Ropa': [
    'rop','polo','camis','pantalon','short','zapatill','zapato','calzad',
    'vestid','falda','blusa','chompa','casac','saga falabella','ripley',
    'oechsl','topi top','adidas','nike','puma','reebok',
    'mochil','bolso','cartera','gorr','calcet','pijam',
  ],
  'Hogar': [
    'muebl','refrigerad','lavador','microond','licuador','planch',
    'olla','sarten','vajill','foco','pila','ferreteria','sodimac','promart',
    'detergent','lejia','desinfect','escob','trapeador','papel higien',
    'jabon','jaboncillo','shampoo','acondicionador','gel ducha','crema corporal',
    'pasta dental','cepillo dientes','desodorante','toalla higien',
    'ambientador','lustramuebles','cera piso','quita grasa',
  ],
  'Familiar': [
    'familia','familiar','mamá','mama','papá','papa',
    'hermano','hermana','hijo','hija','tio','tia','abuelo','abuela',
    'cena familia','almuerzo familia','reunion familiar','pollada',
  ],
  'Social': [
    'amigos','amigo','amiga','patas','pata',
    'cena amigos','salida amigos','reunion amigos',
    'invité','pague yo','cubrí','cumpleaños de','onomastico de',
  ],
  'Regalo': [
    'regalo','regalito','detalle','presente','sorpresa',
    'cumpleaños para','onomastico para','dia de la madre','dia del padre',
    'san valentin','navidad','año nuevo','baby shower','compré para',
  ],
  'Mascotas': [
    'veterinari','petshop','pet shop','mascota',
    'perr','gato','gat','pienso','alimento mascota','croquetas',
    'vacun perr','baño mascota','correa',
  ],
};

// ─── CIUDADES PARA VIAJES ─────────────────────────────────────────────────────
const CIUDADES = ['lima','huancayo','satipo','cusco','arequipa','trujillo','iquitos',
  'tarapoto','pucallpa','piura','chiclayo','ayacucho','huaraz','cajamarca',
  'tacna','puno','juliaca','nazca','paracas'];

// ─── LIMPIAR DESCRIPCIÓN ANTES DE GUARDAR ───────────────────────────────────
// Elimina el monto y la categoría del texto para guardar datos limpios
const limpiarDescripcion = (texto, monto, categoria) => {
  if (!texto) return texto;

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  // 1. Eliminar frase de categoría completa del texto
  let limpio = texto.trim();
  if (categoria) {
    const catNorm = norm(categoria);
    const textoNorm = norm(limpio);
    if (textoNorm.includes(catNorm)) {
      const idx = textoNorm.indexOf(catNorm);
      limpio = (limpio.slice(0, idx) + limpio.slice(idx + categoria.length)).trim();
    }
  }

  // 2. Eliminar el monto — solo UNA ocurrencia (la última para respetar cantidades)
  if (monto) {
    const palabras = limpio.split(' ').filter(p => p.length > 0);
    let montoEliminado = false;
    const filtradas = [];
    for (let i = palabras.length - 1; i >= 0; i--) {
      const p = palabras[i];
      const pNum = parseFloat(p.replace(/[^0-9.]/g, ''));
      if (!montoEliminado && !isNaN(pNum) && pNum > 0 && Math.abs(pNum - monto) < 0.01) {
        montoEliminado = true;
        continue;
      }
      filtradas.unshift(p);
    }
    limpio = filtradas.join(' ').trim();
  }

  // 3. Limpiar y capitalizar
  limpio = limpio.replace(/  +/g, ' ').trim();
  if (limpio.length > 0) limpio = limpio.charAt(0).toUpperCase() + limpio.slice(1);
  return limpio || texto.trim();
};

// ─── EXTRAER MONTO DE DESCRIPCIÓN ───────────────────────────────────────────
const extraerMonto = (texto) => {
  if (!texto) return { desc: texto, monto: null };
  const t = texto.trim();
  // Número al FINAL: "ceviche 29", "chaufa 31 soles"
  const patronFinal = /^(.*?)\s+(\d+(?:\.\d{1,2})?)\s*(?:soles?|s\/)?$/i;
  const matchFinal = t.match(patronFinal);
  if (matchFinal) {
    const monto = parseFloat(matchFinal[2]);
    if (monto > 0 && monto < 100000) return { desc: matchFinal[1].trim(), monto };
  }
  // Número al INICIO: "31 chaufa", "45 uber"
  const patronInicio = /^(\d+(?:\.\d{1,2})?)\s*(?:soles?|s\/)?\s+(.+)$/i;
  const matchInicio = t.match(patronInicio);
  if (matchInicio) {
    const monto = parseFloat(matchInicio[1]);
    if (monto > 0 && monto < 100000) return { desc: matchInicio[2].trim(), monto };
  }
  return { desc: texto, monto: null };
};

// ─── PALABRAS CLAVE ESPECIALES ───────────────────────────────────────────────
const PALABRAS_SALARIO     = ['salari','sueldo','quincena','planilla','remuneracion','pago mensual','deposito sueldo','abono sueldo'];
const PALABRAS_DISPOSICION = ['disposicion','disposición','dispos efectivo','retiro tc','avance efectivo','avance tc','retiro tarjeta'];
const PALABRAS_PAGO_TC     = ['pago tc','pago tarjet','pago visa','pago credito tc','abono tarjet','cancelar tarjet'];

// ─── MENSAJES MOTIVACIONALES ──────────────────────────────────────────────────
const MENSAJES_NOCHE   = [
  "Son altas horas de la noche. Las decisiones de madrugada cuestan más de lo que parecen.",
  "Tu yo del futuro está mirando lo que haces ahora mismo.",
  "Cada sol que gastas esta noche es un paso más lejos de donde quieres estar.",
  "La libertad financiera se construye en las decisiones que nadie ve.",
];
const MENSAJES_ALCOHOL = [
  "Este gasto puede parecer pequeño ahora, pero estos momentos se acumulan.",
  "Tu meta más cercana necesita este dinero más que este momento.",
  "No te juzgo — solo te recuerdo quién quieres ser mañana.",
  "Una decisión consciente es mejor que una decisión automática. Tú eliges.",
  "Lo que gastas hoy es tiempo de libertad que te quitas mañana.",
];

// ─── DETECTAR ALERTA EMOCIONAL ────────────────────────────────────────────────
const detectarAlerta = (descripcion) => {
  const hora = new Date().getHours();
  const texto = descripcion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const esNocturno = hora >= 23 || hora <= 4;
  const palabrasAlc = ['cerve','cerveza','ron','whisky','pisco','shots','trag','licor','vino','wine','hit','wild','cigarr','tabaco','discotec','bar','kara','tragos','copas','coctail','fiesta','botella','chela','chelas'];
  const esAlcohol  = palabrasAlc.some(p => texto.includes(p.toLowerCase().trim()));
  if (esNocturno && esAlcohol) return { tipo:'ambos',   msg: MENSAJES_NOCHE[Math.floor(Math.random()*MENSAJES_NOCHE.length)],    color:'#7f1d1d', bg:'#fef2f2', border:'#fecaca' };
  if (esNocturno)              return { tipo:'noche',   msg: MENSAJES_NOCHE[Math.floor(Math.random()*MENSAJES_NOCHE.length)],    color:'#92400e', bg:'#fffbeb', border:'#fde68a' };
  if (esAlcohol)               return { tipo:'alcohol', msg: MENSAJES_ALCOHOL[Math.floor(Math.random()*MENSAJES_ALCOHOL.length)],color:'#7f1d1d', bg:'#fef2f2', border:'#fecaca' };
  return null;
};

// ─── MOTOR DE CLASIFICACIÓN — 6 CAPAS ────────────────────────────────────────
const clasificarGasto = (descripcion, monto = 0) => {
  if (!descripcion || descripcion.length < 2) return null;
  const texto = descripcion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const hora  = new Date().getHours();
  const esNocturno = hora >= 21 || hora <= 5;
  const montoNum   = parseFloat(monto) || 0;

  // CAPA 0: Categoría explícita en el texto → override total
  // "14 chaufa salidas" → Salidas
  // "uber 12 transporte" → Transporte
  // "salidas ceviche 29" → Salidas
  const categoriasValidas = Object.keys(DICCIONARIO).concat(['Vida nocturna','Salidas','Viajes','Familiar','Social','Regalo']);
  const categoriasNormalizadas = categoriasValidas.map(c => ({
    original: c,
    normalizada: c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  }));
  for (const { original, normalizada } of categoriasNormalizadas) {
    // Al final: "chaufa 29 salidas" o "chaufa salidas"
    const alFinal = new RegExp(`\\b${normalizada}\\s*$`);
    // Al inicio: "salidas chaufa 29" o "salidas chaufa"
    const alInicio = new RegExp(`^\\s*${normalizada}\\b`);
    if (alFinal.test(texto) || alInicio.test(texto)) {
      return { categoria: original, confianza: 'alta', ajustado: false, forzado: true };
    }
  }

  // CAPA 1: Alcohol → siempre Vida nocturna
  const palabrasAlcohol = ['cerveza','cerve','chela','chelas','ron ','whisky','pisco','vodka',
    'shots','tequila','trag','licor','vino','wine','copa','coctail','cocktail',
    'discotec','disco','after','boliche','pub','karaoke','hit ','wild ','cigarr','tabaco','bar '];
  if (palabrasAlcohol.some(p => texto.includes(p))) return { categoria:'Vida nocturna', confianza:'alta', ajustado:false };

  // CAPA 2: Delivery → siempre Alimentación
  if (['rappi','pedidosya','uber eat','delivery','ifood'].some(p => texto.includes(p)))
    return { categoria:'Alimentación', confianza:'alta', ajustado:false };

  // CAPA 3: Contexto familiar/social
  const palabrasFam = ['familia','familiar','mamá','mama','papá','papa','hermano','hermana','hijo','hija','tio','tia','abuelo','abuela'];
  if (palabrasFam.some(p => texto.includes(p.normalize('NFD').replace(/[\u0300-\u036f]/g,''))))
    return { categoria:'Familiar', confianza:'alta', ajustado:false };
  const palabrasSoc = ['amigos','amigo','amiga','patas','pata','invité','cubrí','cumpleaños de'];
  if (palabrasSoc.some(p => texto.includes(p.normalize('NFD').replace(/[\u0300-\u036f]/g,''))))
    return { categoria:'Social', confianza:'alta', ajustado:false };

  // CAPA 4: Regalo
  const palabrasRegalo = ['regalo','regalito','detalle','presente','sorpresa','cumpleaños para','dia de la madre','dia del padre','san valentin','navidad'];
  if (palabrasRegalo.some(p => texto.includes(p.normalize('NFD').replace(/[\u0300-\u036f]/g,''))))
    return { categoria:'Regalo', confianza:'alta', ajustado:false };

  // CAPA 5: Pasaje + ciudad/prefijo → Viajes
  const tieneDestino = CIUDADES.some(c => texto.includes(c));
  const tienePrefijo = ['a ','para ','hacia '].some(p => texto.includes('pasaje '+p) || texto.includes('bus '+p));
  if ((texto.includes('pasaje') || texto.includes('bus') || texto.includes('vuelo')) && (tieneDestino || tienePrefijo))
    return { categoria:'Viajes', confianza:'alta', ajustado:false };
  if (texto.includes('aeropuerto') && (texto.includes('uber') || texto.includes('taxi')))
    return { categoria:'Viajes', confianza:'alta', ajustado:false };

  // CAPA 6: Diccionario + monto + horario
  let mejorCat = null; let mejorScore = 0;
  for (const [cat, palabras] of Object.entries(DICCIONARIO)) {
    if (['Vida nocturna','Familiar','Social','Regalo'].includes(cat)) continue; // Deporte se clasifica normalmente
    for (const palabra of palabras) {
      const p = palabra.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
      if (texto.includes(p) && p.length > mejorScore) { mejorScore = p.length; mejorCat = cat; }
    }
  }

  // Ajuste: Alimentación + monto > S/15 → Salidas (siempre, delivery ya se filtró en capa 2)
  if (mejorCat === 'Alimentación' && montoNum > 15) {
    mejorCat = 'Salidas';
  }

  // Ajuste nocturno: snack/bebida no alcohólica de noche → Vida nocturna
  if (esNocturno && mejorCat === 'Alimentación') {
    const snacks = ['agua','chicle','gaseosa','jugo','bebida','snack'];
    if (snacks.some(p => texto.includes(p)) && montoNum >= 5)
      return { categoria:'Vida nocturna', confianza:'media', ajustado:true };
  }

  // Ajuste nocturno: Salidas de noche con monto alto → podría ser vida nocturna
  // pero si no tiene alcohol lo dejamos como Salida — cena nocturna sigue siendo Salida
  const confianza = mejorScore >= 6 ? 'alta' : mejorScore >= 4 ? 'media' : 'baja';
  return mejorCat ? { categoria:mejorCat, confianza, ajustado:false } : null;
};

const INITIAL_TX = [];
const INITIAL_PRESUPUESTOS = [];

// ─── FASE C: PRESUPUESTOS SUGERIDOS ──────────────────────────────────────────
const generarSugerencias = (txs, presupuestosActivos) => {
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
    .map(([cat, total]) => ({
      categoria: cat,
      sugerido: Math.ceil(total * 1.1 / 10) * 10,
      basadoEn: countPorCat[cat],
    }));
};
const INITIAL_METAS = [];

// ── FASE 3: Tarjetas de crédito y préstamos (datos reales BCP) ──────────────

// Ciclos de facturación reales VISA BCP ****2769
const CICLOS_BCP = {
  1:  { cierreDesde:'25/12', cierreHasta:'23/01', limitePago:'23/02/26' },
  2:  { cierreDesde:'24/01', cierreHasta:'25/02', limitePago:'23/03/26' },
  3:  { cierreDesde:'26/02', cierreHasta:'25/03', limitePago:'21/04/26' },
  4:  { cierreDesde:'26/03', cierreHasta:'25/04', limitePago:'20/05/26' },
  5:  { cierreDesde:'26/04', cierreHasta:'25/05', limitePago:'22/06/26' },
  6:  { cierreDesde:'26/05', cierreHasta:'25/06', limitePago:'22/07/26' },
  7:  { cierreDesde:'26/06', cierreHasta:'24/07', limitePago:'20/08/26' },
  8:  { cierreDesde:'25/07', cierreHasta:'25/08', limitePago:'22/09/26' },
  9:  { cierreDesde:'26/08', cierreHasta:'25/09', limitePago:'20/10/26' },
  10: { cierreDesde:'26/09', cierreHasta:'23/10', limitePago:'22/11/26' },
  11: { cierreDesde:'24/10', cierreHasta:'25/11', limitePago:'22/12/26' },
  12: { cierreDesde:'26/11', cierreHasta:'24/12', limitePago:'20/01/27' },
};

const getCicloActual = () => {
  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  return CICLOS_BCP[mes] || CICLOS_BCP[6];
};

const parseLimitePago = (str) => {
  // str = 'dd/mm/aa' e.g. '22/07/26'
  const [d,m,y] = str.split('/');
  return new Date(`20${y}-${m}-${d}`);
};

const INITIAL_TC = [];
const INITIAL_PRESTAMOS = [];

const fmt      = (n) => new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN',minimumFractionDigits:2}).format(n);
const fmtShort = (n) => n >= 1000 ? `S/${(n/1000).toFixed(1)}k` : `S/${Math.round(n)}`;
const fmtInt   = (n) => new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN',minimumFractionDigits:0}).format(n);
const fmtFecha = (fechaStr) => { if(!fechaStr) return ''; const [y,m,d] = fechaStr.split('-'); return `${d}/${m}/${y.slice(2)}`; };

// ─── DÍAS HASTA VENCIMIENTO ───────────────────────────────────────────────────
const diasHasta = (fechaStr) => {
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const fecha = new Date(fechaStr);
  return Math.ceil((fecha - hoy) / (1000*60*60*24));
};

// ─── ALERTAS TC (facturación y pago) ─────────────────────────────────────────
const alertaTC = () => {
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const ciclo = getCicloActual();
  const pagoDate = parseLimitePago(ciclo.limitePago);
  const diasPago = Math.ceil((pagoDate - hoy) / (1000*60*60*24));
  const mes = hoy.getMonth();
  const diaCierre = (mes === 6 || mes === 11) ? 24 : 25;
  const cierreDate = new Date(hoy.getFullYear(), mes, diaCierre);
  if (cierreDate < hoy) cierreDate.setMonth(cierreDate.getMonth()+1);
  const diasCierre = Math.ceil((cierreDate - hoy) / (1000*60*60*24));
  const alertas = [];
  if (diasCierre <= 3 && diasCierre >= 0)
    alertas.push({ tipo:'cierre', dias:diasCierre, msg: diasCierre===0 ? 'Tu TC cierra HOY' : `Tu TC cierra en ${diasCierre} día${diasCierre>1?'s':''}`, color:'#d97706', bg:'#fffbeb', border:'#fde68a' });
  if (diasPago <= 3 && diasPago >= 0)
    alertas.push({ tipo:'pago', dias:diasPago, msg: diasPago===0 ? 'Fecha límite de pago TC es HOY' : `Tu pago de TC vence en ${diasPago} día${diasPago>1?'s':''}`, color:'#dc2626', bg:'#fef2f2', border:'#fecaca' });
  return alertas;
};


const urgenciaColor = (dias) => {
  if (dias <= 5)  return { bg:'#fef2f2', border:'#fecaca', text:'#dc2626', badge:'#ef4444' };
  if (dias <= 15) return { bg:'#fffbeb', border:'#fde68a', text:'#d97706', badge:'#f59e0b' };
  return           { bg:'#f0fdf4', border:'#bbf7d0', text:'#16a34a', badge:'#10b981' };
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:'#1f1b4b',borderRadius:10,padding:'8px 12px'}}>
      <div style={{color:'rgba(255,255,255,0.55)',fontSize:10,marginBottom:3}}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{color:'#fff',fontSize:12,fontWeight:700}}>{fmtShort(p.value)}</div>)}
    </div>
  );
};

// ─── TARJETA VISUAL (tipo banco) ──────────────────────────────────────────────
const TarjetaVisual = ({ tc }) => {
  const disponible = tc.lineaTotal - tc.consumido;
  const pctUsado   = Math.round(tc.consumido / tc.lineaTotal * 100);
  const cicloV = getCicloActual(); const pagoDateV = parseLimitePago(cicloV.limitePago); const diasVence = Math.ceil((pagoDateV - new Date()) / (1000*60*60*24));
  const urg        = urgenciaColor(diasVence);

  return (
    <div style={{marginBottom:14}}>
      {/* Tarjeta física */}
      <div style={{background:tc.gradiente, borderRadius:20, padding:'20px 22px', marginBottom:12, boxShadow:'0 8px 32px rgba(0,0,0,0.2)', position:'relative', overflow:'hidden', minHeight:160}}>
        <div style={{position:'absolute',top:-30,right:-30,width:130,height:130,borderRadius:'50%',background:'rgba(255,255,255,0.08)'}}/>
        <div style={{position:'absolute',bottom:-20,left:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.06)'}}/>
        <div style={{position:'relative',zIndex:2}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
            <div>
              <div style={{color:'rgba(255,255,255,0.7)',fontSize:10,letterSpacing:1,textTransform:'uppercase'}}>BCP</div>
              <div style={{color:'#fff',fontSize:13,fontWeight:700,marginTop:2}}>{tc.nombre}</div>
            </div>
            <CreditCard size={28} color="rgba(255,255,255,0.6)" />
          </div>
          <div style={{color:'rgba(255,255,255,0.7)',fontSize:12,letterSpacing:3,marginBottom:12}}>{tc.numero}</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
            <div>
              <div style={{color:'rgba(255,255,255,0.6)',fontSize:10,marginBottom:2}}>Consumido</div>
              <div style={{color:'#fff',fontSize:20,fontWeight:800}}>{fmt(tc.consumido)}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{color:'rgba(255,255,255,0.6)',fontSize:10,marginBottom:2}}>Disponible</div>
              <div style={{color:'#fff',fontSize:18,fontWeight:700}}>{fmt(disponible)}</div>
            </div>
          </div>
          <div style={{marginTop:10,background:'rgba(255,255,255,0.2)',borderRadius:100,height:4,overflow:'hidden'}}>
            <div style={{width:`${pctUsado}%`,height:'100%',background:'#fff',borderRadius:100}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
            <span style={{color:'rgba(255,255,255,0.6)',fontSize:10}}>Línea: {fmtInt(tc.lineaTotal)}</span>
            <span style={{color:'rgba(255,255,255,0.6)',fontSize:10}}>{pctUsado}% usado</span>
          </div>
        </div>
      </div>

      {/* Info de pago */}
      <div style={{background:'#fff',borderRadius:16,padding:'14px 16px',boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          <div style={{background:'#f9f8ff',borderRadius:12,padding:'10px 12px'}}>
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:4}}>
              <Receipt size={12} color="#7c3aed"/>
              <span style={{fontSize:10,color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:0.3}}>Facturación</span>
            </div>
            <div style={{fontSize:14,fontWeight:800,color:'#1f1b4b'}}>{getCicloActual().cierreDesde} – {getCicloActual().cierreHasta}</div>
            <div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>Ciclo activo</div>
          </div>
          <div style={{background:urg.bg,borderRadius:12,padding:'10px 12px',border:`1px solid ${urg.border}`}}>
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:4}}>
              <Calendar size={12} color={urg.badge}/>
              <span style={{fontSize:10,color:urg.text,fontWeight:600,textTransform:'uppercase',letterSpacing:0.3}}>Límite pago</span>
            </div>
            <div style={{fontSize:14,fontWeight:800,color:urg.text}}>{getCicloActual().limitePago}</div>
            <div style={{fontSize:11,color:urg.text,marginTop:2,fontWeight:600}}>
              {diasVence > 0 ? `${diasVence} días` : 'Vencido'}
            </div>
          </div>
        </div>

        {/* Deuda y pago */}
        <div style={{borderTop:'1px solid #f5f3ff',paddingTop:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <span style={{fontSize:12,color:'#9ca3af',fontWeight:600}}>Deuda total facturada</span>
            <span style={{fontSize:16,fontWeight:800,color:'#ef4444'}}>{fmt(tc.deudaActual)}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
            <span style={{fontSize:12,color:'#9ca3af',fontWeight:600}}>Ciclo actual</span>
            <span style={{fontSize:12,fontWeight:700,color:'#1f1b4b'}}>{getCicloActual().cierreDesde} – {getCicloActual().cierreHasta}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PRÉSTAMO CARD ────────────────────────────────────────────────────────────
const PrestamoCard = ({ prestamo, onEdit, onDelete }) => {
  const pct     = Math.round(prestamo.pagado / prestamo.montoOriginal * 100);
  const diasV   = diasHasta(prestamo.proximoPago);
  const urg     = urgenciaColor(diasV);
  const restaCuotas = prestamo.totalCuotas - prestamo.cuotaActual;

  return (
    <div style={{background:'#fff',borderRadius:18,padding:'16px',marginBottom:12,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',border:`1.5px solid ${diasV<=10?urg.border:'transparent'}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:42,height:42,borderRadius:13,background:prestamo.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Landmark size={20} color={prestamo.color}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'#1f1b4b'}}>{prestamo.nombre}</div>
            <div style={{fontSize:11,color:'#9ca3af'}}>{prestamo.banco} · {prestamo.numero}</div>
          </div>
        </div>
        <div style={{display:'flex',gap:6}}>
          <button onClick={onEdit}   style={S.actionBtn('#f5f3ff')}><Pencil size={12} color="#7c3aed"/></button>
          <button onClick={onDelete} style={S.actionBtn('#fef2f2')}><Trash2 size={12} color="#ef4444"/></button>
        </div>
      </div>

      {/* Progreso pago */}
      <div style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
          <span style={{fontSize:12,color:'#9ca3af'}}>Capital pendiente</span>
          <span style={{fontSize:14,fontWeight:800,color:'#ef4444'}}>{fmt(prestamo.capitalPendiente)}</span>
        </div>
        <div style={{background:'#f5f5ff',borderRadius:100,height:8,overflow:'hidden',marginBottom:4}}>
          <div style={{width:`${pct}%`,height:'100%',background:`linear-gradient(90deg,${prestamo.color},${prestamo.color}cc)`,borderRadius:100,transition:'width 1s'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:10,color:'#9ca3af'}}>{pct}% pagado ({fmt(prestamo.pagado)})</span>
          {prestamo.cuotaActual > 0 && <span style={{fontSize:10,color:'#9ca3af'}}>Cuota {prestamo.cuotaActual}/{prestamo.totalCuotas}</span>}
        </div>
      </div>

      {/* Grid info */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        <div style={{background:'#f9f8ff',borderRadius:12,padding:'10px'}}>
          <div style={{fontSize:10,color:'#9ca3af',marginBottom:3}}>Cuota mensual</div>
          <div style={{fontSize:15,fontWeight:800,color:'#1f1b4b'}}>{fmt(prestamo.cuotaMensual)}</div>
        </div>
        <div style={{background:urg.bg,border:`1px solid ${urg.border}`,borderRadius:12,padding:'10px'}}>
          <div style={{fontSize:10,color:urg.text,marginBottom:3,fontWeight:600}}>Próximo pago</div>
          <div style={{fontSize:13,fontWeight:800,color:urg.text}}>{fmtFecha(prestamo.proximoPago)}</div>
          <div style={{fontSize:10,color:urg.text,marginTop:1}}>{diasV>0?`${diasV} días`:'Vencido'}</div>
        </div>
      </div>

      {/* Tasas y extras */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#f9f8ff',borderRadius:12,padding:'10px 12px'}}>
        <div style={{display:'flex',gap:16}}>
          <div><div style={{fontSize:10,color:'#9ca3af'}}>TEA</div><div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{prestamo.tea}%</div></div>
          <div><div style={{fontSize:10,color:'#9ca3af'}}>TCEA</div><div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{prestamo.tcea}%</div></div>
          <div><div style={{fontSize:10,color:'#9ca3af'}}>Cuotas restantes</div><div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{restaCuotas}</div></div>
        </div>
        {prestamo.automatico && (
          <div style={{background:'#dcfce7',borderRadius:8,padding:'4px 8px',display:'flex',alignItems:'center',gap:4}}>
            <CheckCircle size={11} color="#16a34a"/>
            <span style={{fontSize:10,color:'#16a34a',fontWeight:700}}>Auto</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── RESUMEN DEUDAS ───────────────────────────────────────────────────────────
const ResumenDeudas = ({ tcs, prestamos }) => {
  const totalTC       = tcs.reduce((s,t)=>s+t.deudaActual, 0);
  const totalPrestamos= prestamos.reduce((s,p)=>s+p.capitalPendiente, 0);
  const cuotasMes     = prestamos.reduce((s,p)=>s+p.cuotaMensual, 0);
  const total         = totalTC + totalPrestamos;

  return (
    <div style={{background:'linear-gradient(135deg,#1e1b4b,#312e81)',borderRadius:20,padding:'18px',marginBottom:16,boxShadow:'0 8px 32px rgba(30,27,75,0.3)'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
        <TrendingDown size={16} color="rgba(255,255,255,0.7)"/>
        <span style={{color:'rgba(255,255,255,0.7)',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:0.5}}>Total deudas</span>
      </div>
      <div style={{color:'#fff',fontSize:32,fontWeight:800,letterSpacing:-1,marginBottom:14}}>{fmt(total)}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        {[
          {label:'TC',       val:totalTC,        color:'#fbbf24'},
          {label:'Créditos', val:totalPrestamos,  color:'#60a5fa'},
          {label:'Cuotas/mes',val:cuotasMes,      color:'#34d399'},
        ].map(s=>(
          <div key={s.label} style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 8px',textAlign:'center'}}>
            <div style={{color:'rgba(255,255,255,0.6)',fontSize:9,textTransform:'uppercase',letterSpacing:0.3,marginBottom:4}}>{s.label}</div>
            <div style={{color:s.color,fontSize:13,fontWeight:800}}>{fmtShort(s.val)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── COMPONENTES REUTILIZABLES (Fase 2) ──────────────────────────────────────
const PresupuestoCard = ({ presupuesto, gastado, onEdit, onDelete }) => {
  const info  = CAT_ICONOS[presupuesto.categoria]||{icon:Package,color:'#6b7280'};
  const Icon  = info.icon;
  const pct   = Math.min(100,Math.round(gastado/presupuesto.limite*100));
  const libre = presupuesto.limite - gastado;
  const sobre = pct>=100; const alerta=pct>=80&&pct<100;
  const barColor = sobre?'#ef4444':alerta?'#f59e0b':info.color;
  return (
    <div style={{background:'#fff',borderRadius:18,padding:'14px 16px',marginBottom:10,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',border:`1.5px solid ${sobre?'#fecaca':alerta?'#fde68a':'transparent'}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:38,height:38,borderRadius:12,background:info.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={18} color={info.color}/></div>
          <div><div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{presupuesto.categoria}</div><div style={{fontSize:11,color:'#9ca3af'}}>Límite: {fmtInt(presupuesto.limite)}</div></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          {sobre?<AlertTriangle size={16} color="#ef4444"/>:alerta?<AlertTriangle size={16} color="#f59e0b"/>:<CheckCircle size={16} color="#10b981"/>}
          <button onClick={onEdit}   style={S.actionBtn('#f5f3ff')}><Pencil size={12} color="#7c3aed"/></button>
          <button onClick={onDelete} style={S.actionBtn('#fef2f2')}><Trash2 size={12} color="#ef4444"/></button>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
        <span style={{fontSize:12,fontWeight:700,color:barColor}}>{fmtInt(gastado)} gastado</span>
        <span style={{fontSize:12,fontWeight:700,color:libre>=0?'#10b981':'#ef4444'}}>{libre>=0?`${fmtInt(libre)} libre`:`${fmtInt(Math.abs(libre))} excedido`}</span>
      </div>
      <div style={S.progBg}><div style={{...S.progFill(barColor,pct)}}/></div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:5}}>
        <span style={{fontSize:10,color:'#9ca3af'}}>{pct}% usado</span>
        {sobre&&<span style={{fontSize:10,color:'#ef4444',fontWeight:700}}>Límite superado</span>}
        {alerta&&<span style={{fontSize:10,color:'#f59e0b',fontWeight:700}}>Casi en el límite</span>}
      </div>
    </div>
  );
};

const MetaCard = ({ meta, onAbonar, onEdit, onDelete }) => {
  const pct=Math.min(100,Math.round(meta.actual/meta.objetivo*100));
  const resta=meta.objetivo-meta.actual; const done=pct>=100;
  return (
    <div style={{background:'#fff',borderRadius:18,padding:'14px 16px',marginBottom:10,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',border:done?'1.5px solid #bbf7d0':'1.5px solid transparent'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:38,height:38,borderRadius:12,background:meta.color+'20',display:'flex',alignItems:'center',justifyContent:'center'}}><Flag size={18} color={meta.color}/></div>
          <div><div style={{fontSize:13,fontWeight:700,color:'#1f1b4b'}}>{meta.nombre}</div><div style={{fontSize:11,color:'#9ca3af'}}>Objetivo: {fmtInt(meta.objetivo)}</div></div>
        </div>
        <div style={{display:'flex',gap:6}}>
          <button onClick={onEdit}   style={S.actionBtn('#f5f3ff')}><Pencil size={12} color="#7c3aed"/></button>
          <button onClick={onDelete} style={S.actionBtn('#fef2f2')}><Trash2 size={12} color="#ef4444"/></button>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
        <span style={{fontSize:13,fontWeight:800,color:meta.color}}>{fmtInt(meta.actual)}</span>
        {!done&&<span style={{fontSize:12,color:'#9ca3af'}}>Faltan {fmtInt(resta)}</span>}
        {done&&<span style={{fontSize:12,color:'#10b981',fontWeight:700,display:'flex',alignItems:'center',gap:4}}><CheckCircle size={13}/>Completado</span>}
      </div>
      <div style={{background:'#f5f5ff',borderRadius:100,height:10,overflow:'hidden',marginBottom:8}}>
        <div style={{width:`${pct}%`,height:'100%',background:`linear-gradient(90deg,${meta.color},${meta.color}bb)`,borderRadius:100,transition:'width 1s'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:11,color:'#9ca3af'}}>{pct}% completado</span>
        {!done&&<button onClick={onAbonar} style={{background:`linear-gradient(135deg,${meta.color},${meta.color}cc)`,color:'#fff',border:'none',borderRadius:20,padding:'5px 14px',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}><Plus size={12}/>Abonar</button>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function App({ user, data, onLogout }) {
  const [tab, setTab]         = useState('home');
  // ── FIREBASE DATA ──
  const {
    txs: fbTxs, presupuestos: fbPres, metas: fbMetas,
    streak, addTx,
  } = data || {};

  const [txs, setTxs]               = useState(INITIAL_TX);
  const [presupuestos, setPresupuestos] = useState(INITIAL_PRESUPUESTOS);
  const [metas, setMetas]           = useState(INITIAL_METAS);
  const [tcs, setTcs]               = useState(INITIAL_TC);
  const [prestamos, setPrestamos]   = useState(INITIAL_PRESTAMOS);

  // Sync Firebase data to local state
  React.useEffect(() => { if (fbTxs && fbTxs.length > 0) setTxs(fbTxs); }, [fbTxs]);
  React.useEffect(() => { if (fbPres && fbPres.length > 0) setPresupuestos(fbPres); }, [fbPres]);
  React.useEffect(() => { if (fbMetas && fbMetas.length > 0) setMetas(fbMetas); }, [fbMetas]);
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

  // FASE E — Saldo de cuenta
  const [saldoCuenta, setSaldoCuenta] = useState(null); // null = no configurado
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

  const areaData = useMemo(()=>{ const d={}; txs.filter(t=>t.tipo==='gasto'&&t.fecha.startsWith('2026-05')).forEach(t=>{const n=parseInt(t.fecha.split('-')[2]);d[n]=(d[n]||0)+t.monto;}); return Array.from({length:28},(_,i)=>({dia:`${i+1}`,monto:d[i+1]||0})); },[txs]);
  const barData  = useMemo(()=>{ const m={}; txs.forEach(t=>{const mes=MESES[parseInt(t.fecha.split('-')[1])-1]; if(!m[mes])m[mes]={mes,ingresos:0,gastos:0}; m[mes][t.tipo==='ingreso'?'ingresos':'gastos']+=t.monto;}); return Object.values(m); },[txs]);
  const catData  = useMemo(()=>Object.entries(gastoPorCat).sort((a,b)=>b[1]-a[1]).slice(0,8),[gastoPorCat]);
  const maxGasto = Math.max(...catData.map(c=>c[1]),1);
  const recentTxs= useMemo(()=>[...txs].reverse().slice(0,showAll?50:5),[txs,showAll]);
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

  const DICCIONARIO_INGRESOS = {
    'Salario':    ['salari','sueldo','quincena','planilla','remuneracion','pago mensual','deposito sueldo'],
    'Negocio':    ['venta','cobro','cliente','factura','boleta','negocio','tienda'],
    'Freelance':  ['proyecto','servicio','honorario','consultoria','freelance','trabajo extra','pago proyecto'],
    'Inversión':  ['dividendo','interes','rendimiento','inversion','ganancia','utilidad'],
    'Regalo':     ['regalo','propina','bono','gratificacion','prestamo recibido'],
    'Disposición TC': ['disposicion','disposición','avance efectivo','retiro tc'],
  };

  const clasificarIngreso = (descripcion) => {
    if (!descripcion || descripcion.length < 2) return null;
    const texto = descripcion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    let mejorCat = null; let mejorScore = 0;
    for (const [cat, palabras] of Object.entries(DICCIONARIO_INGRESOS)) {
      for (const palabra of palabras) {
        const p = palabra.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        if (texto.includes(p) && p.length > mejorScore) { mejorScore = p.length; mejorCat = cat; }
      }
    }
    return mejorCat ? { categoria: mejorCat, confianza: mejorScore >= 6 ? 'alta' : 'media', score: mejorScore } : null;
  };

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
    const nuevasTx = [];

    // ── FLUJO SALARIO: descuenta cuotas automáticamente ──
    if (tipoEspecial === 'salario' && txForm.tipo === 'ingreso') {
      // 1. Registra el ingreso del salario
      nuevasTx.push({ ...txForm, id:Date.now(), monto, categoria:'Salario' });
      // 2. Descuenta cuotas de préstamos activos
      const cuotasDescontadas = [];
      setPrestamos(prev => prev.map(p => {
        if (p.capitalPendiente > 0) {
          cuotasDescontadas.push({ nombre: p.nombre+' '+p.numero, monto: p.cuotaMensual });
          nuevasTx.push({ id:Date.now()+p.id, tipo:'gasto', categoria:'Servicios', descripcion:`Cuota ${p.nombre} ${p.numero}`, monto:p.cuotaMensual, fecha });
          return { ...p, capitalPendiente: Math.max(0, p.capitalPendiente - p.cuotaMensual), pagado: p.pagado + p.cuotaMensual, cuotaActual: p.cuotaActual + 1 };
        }
        return p;
      }));
      const totalDesc = cuotasDescontadas.reduce((s,c)=>s+c.monto,0);
      setResumenSalario({ ingreso:monto, cuotas:cuotasDescontadas, total:totalDesc });
      setShowResumenSalario(true);
      setTxs(p=>[...p,...nuevasTx]);
      setTxForm({tipo:'ingreso',categoria:'Salario',descripcion:'',monto:'',fecha:new Date().toISOString().split('T')[0]});
      setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
      return;
    }

    // ── FLUJO DISPOSICIÓN TC: registra ingreso + sube deuda TC ──
    if (tipoEspecial === 'disposicion') {
      nuevasTx.push({ ...txForm, id:Date.now(), tipo:'ingreso', monto, categoria:'Disposición TC' });
      nuevasTx.push({ id:Date.now()+1, tipo:'gasto', categoria:'Servicios', descripcion:'Interés disposición TC', monto:0, fecha });
      setTcs(prev => prev.map((tc,i) => i===0 ? { ...tc, consumido: tc.consumido + monto, deudaActual: tc.deudaActual + monto } : tc));
      setTxs(p=>[...p,...nuevasTx]);
      setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:new Date().toISOString().split('T')[0]});
      setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
      setTab('home');
      return;
    }

    // ── FLUJO PAGO TC: descuenta consumido de la TC ──
    if (tipoEspecial === 'pagoTC') {
      setTcs(prev => prev.map((tc,i) => i===0 ? { ...tc, consumido: Math.max(0, tc.consumido - monto), deudaActual: Math.max(0, tc.deudaActual - monto) } : tc));
      nuevasTx.push({ ...txForm, id:Date.now(), monto, categoria:'Servicios', descripcion:'Pago tarjeta de crédito' });
      setTxs(p=>[...p,...nuevasTx]);
      setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:new Date().toISOString().split('T')[0]});
      setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
      setTab('home');
      return;
    }

    // ── FLUJO NORMAL ──
    let categoriaFinal = txForm.categoria;
    if (txForm.tipo === 'gasto' && autoClasif && !autoClasif.elegida) {
      const reclasif = clasificarGasto(txForm.descripcion, monto);
      categoriaFinal = reclasif ? reclasif.categoria : autoClasif.categoria;
    }
    // Limpiar descripción antes de guardar — elimina monto y categoría del texto
    const descLimpia = limpiarDescripcion(txForm.descripcion, monto, categoriaFinal);
    // FASE E: Si paga con efectivo → descuenta del saldo
    if (txForm.tipo === 'gasto' && medioPago === 'efectivo' && saldoCuenta !== null) {
      setSaldoCuenta(prev => Math.max(0, prev - monto));
    }
    // Si paga con TC → sube consumido, NO resta saldo
    if (txForm.tipo === 'gasto' && medioPago === 'tc') {
      setTcs(prev => prev.map((tc,i) => i===0 ? { ...tc, consumido: tc.consumido + monto, deudaActual: tc.deudaActual + monto } : tc));
    }
    // Si es ingreso → suma al saldo
    if (txForm.tipo === 'ingreso' && saldoCuenta !== null && tipoEspecial !== 'disposicion') {
      setSaldoCuenta(prev => prev + monto);
    }
    const txFinal = {...txForm, descripcion:descLimpia, categoria:categoriaFinal, monto, medioPago};
    if(txEditId){
      setTxs(p=>p.map(t=>t.id===txEditId?{...txFinal,id:txEditId}:t));
      if(data?.updateTx) data.updateTx(txEditId, txFinal).catch(()=>{});
      setTxEditId(null);
    }
    else { if(addTx) addTx({...txFinal}).catch(()=>{}); setTxs(p=>[...p,{...txFinal,id:Date.now()}]); }
    setLastMedioPago(medioPago);
    setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:new Date().toISOString().split('T')[0]});
    setTipoEspecial(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
    setShowDatePicker(false);
    setTab('home');
  };
  const openAdd = () => {
    setTxEditId(null); setAutoClasif(null); setAlertaEmoc(null); setAlertaAceptada(false);
    setMedioPago(lastMedioPago); setShowDatePicker(false);
    setTxForm({tipo:'gasto',categoria:'Alimentación',descripcion:'',monto:'',fecha:new Date().toISOString().split('T')[0]});
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
      setTxs(p=>p.filter(t=>t.id!==id));
      if(data?.deleteTx) data.deleteTx(id).catch(()=>{});
    }
  };

  const handlePresSubmit = () => {
    if(!presForm.categoria||!presForm.limite) return;
    const obj = {...presForm, limite:parseFloat(presForm.limite)};
    if(presEditId){
      setPresupuestos(p=>p.map(x=>x.id===presEditId?{...obj,id:presEditId}:x));
      if(data?.updatePres) data.updatePres(presEditId, obj).catch(()=>{});
      setPresEditId(null);
    } else {
      const newId = Date.now();
      setPresupuestos(p=>[...p,{...obj,id:newId}]);
      if(data?.addPres) data.addPres(obj).catch(()=>{});
    }
    setPresForm({categoria:'Alimentación',limite:''}); setShowPresForm(false);
  };
  const handlePresDel = (id) => {
    if(window.confirm('¿Eliminar?')) {
      setPresupuestos(p=>p.filter(x=>x.id!==id));
      if(data?.deletePres) data.deletePres(id).catch(()=>{});
    }
  };

  const handleMetaSubmit = () => {
    if(!metaForm.nombre||!metaForm.objetivo) return;
    const obj = {...metaForm, objetivo:parseFloat(metaForm.objetivo), actual:parseFloat(metaForm.actual||0)};
    if(metaEditId){
      setMetas(p=>p.map(m=>m.id===metaEditId?{...obj,id:metaEditId}:m));
      if(data?.updateMeta) data.updateMeta(metaEditId, obj).catch(()=>{});
      setMetaEditId(null);
    } else {
      setMetas(p=>[...p,{...obj,id:Date.now()}]);
      if(data?.addMeta) data.addMeta(obj).catch(()=>{});
    }
    setMetaForm({nombre:'',objetivo:'',actual:'',color:'#6366f1'}); setShowMetaForm(false);
  };
  const handleMetaDel = (id) => {
    if(window.confirm('¿Eliminar?')) {
      setMetas(p=>p.filter(m=>m.id!==id));
      if(data?.deleteMeta) data.deleteMeta(id).catch(()=>{});
    }
  };
  const handleAbonar = () => {
    if(!abonarMonto) return;
    const meta = metas.find(m=>m.id===abonarMetaId);
    if(!meta) return;
    const nuevoActual = Math.min(meta.objetivo, meta.actual + parseFloat(abonarMonto));
    setMetas(p=>p.map(m=>m.id===abonarMetaId?{...m,actual:nuevoActual}:m));
    if(data?.updateMeta) data.updateMeta(abonarMetaId, {...meta,actual:nuevoActual}).catch(()=>{});
    setAbonarMetaId(null); setAbonarMonto('');
  };

  const handlePres2Submit = () => {
    if(!presForm2.nombre||!presForm2.cuotaMensual) return;
    const obj = {...presForm2, id:presEditId2||Date.now(), montoOriginal:parseFloat(presForm2.montoOriginal||0), capitalPendiente:parseFloat(presForm2.capitalPendiente||0), pagado:parseFloat(presForm2.montoOriginal||0)-parseFloat(presForm2.capitalPendiente||0), cuotaMensual:parseFloat(presForm2.cuotaMensual), tea:parseFloat(presForm2.tea||0), tcea:parseFloat(presForm2.tcea||0), totalCuotas:parseInt(presForm2.totalCuotas||0), cuotaActual:parseInt(presForm2.cuotaActual||0) };
    if(presEditId2){setPrestamos(p=>p.map(x=>x.id===presEditId2?obj:x));setPresEditId2(null);}
    else setPrestamos(p=>[...p,obj]);
    setPresForm2({nombre:'',banco:'',numero:'',montoOriginal:'',capitalPendiente:'',cuotaMensual:'',proximoPago:'',tea:'',tcea:'',totalCuotas:'',cuotaActual:'0',color:'#1d4ed8',automatico:false});
    setShowPresForm2(false);
  };
  const handlePres2Edit = (p) => { setPresForm2({...p,montoOriginal:String(p.montoOriginal),capitalPendiente:String(p.capitalPendiente),cuotaMensual:String(p.cuotaMensual),tea:String(p.tea),tcea:String(p.tcea),totalCuotas:String(p.totalCuotas),cuotaActual:String(p.cuotaActual)}); setPresEditId2(p.id); setShowPresForm2(true); };
  const handlePres2Del  = (id) => { if(window.confirm('¿Eliminar?')) setPrestamos(p=>p.filter(x=>x.id!==id)); };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"/>
      <div style={S.phone}>

        {/* ══ HOME ══════════════════════════════════════════════════════════ */}
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
                      <span style={{fontSize:14}}>🔥</span>
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
              <div style={S.balAmount}>{fmtInt(stats.balance)}</div>
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

          <div style={(alertas.length>0 || alertaTC().length>0) ? S.statsRowWithAlerts : S.statsRow}>
            {[{label:'Ingresos',val:stats.ingresos,color:'#10b981',Icon:ArrowUpCircle},{label:'Gastos',val:stats.gastos,color:'#ef4444',Icon:ArrowDownCircle},{label:'Ahorro',val:stats.balance,color:'#7c3aed',Icon:Wallet}].map(s=>(
              <div key={s.label} style={S.statCard}><div style={S.statIconWrap(s.color)}><s.Icon size={16} color={s.color}/></div><div style={S.statLabel}>{s.label}</div><div style={S.statVal(s.color)}>{fmtShort(s.val)}</div></div>
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
                  <div style={S.txAmt(t.tipo)}>{t.tipo==='ingreso'?'+':'-'}{fmtInt(t.monto)}</div>
                  <button onClick={()=>handleTxEdit(t)} style={S.actionBtn('#f5f3ff')}><Pencil size={13} color="#7c3aed"/></button>
                  <button onClick={()=>handleTxDel(t.id)} style={S.actionBtn('#fef2f2')}><Trash2 size={13} color="#ef4444"/></button>
                </div>
              );})}
            </div>
          </div>
        </>}

        {/* ══ AGREGAR TX ════════════════════════════════════════════════════ */}
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
                Monto (S/.) {extraerMonto(txForm.descripcion).monto ? <span style={{color:'#10b981',fontSize:10,fontWeight:600}}>✓ detectado</span> : <span style={{color:'#9ca3af',fontSize:10}}>o escríbelo aquí</span>}
              </label>
              <input style={S.input} type="number" placeholder="0.00" value={txForm.monto}
                onChange={e=>setTxForm(p=>({...p,monto:e.target.value}))} onFocus={if_} onBlur={ib_}/>

              {/* Fecha — hoy por defecto, botón ayer, picker opcional */}
              <label style={S.label}>¿Cuándo fue?</label>
              <div style={{display:'flex',gap:8,marginBottom:showDatePicker?8:12}}>
                {[{label:'Hoy',val:new Date().toISOString().split('T')[0]},{label:'Ayer',val:new Date(Date.now()-86400000).toISOString().split('T')[0]}].map(op=>(
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
                    {[{id:'efectivo',label:'Efectivo / Cuenta',sub:'Resta tu balance'},{id:'tc',label:'VISA ****2769',sub:'Sube deuda TC'}].map(mp=>(
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

        {/* ══ DEUDAS (TC + PRÉSTAMOS) ═══════════════════════════════════════ */}
        {tab==='deudas' && (
          <div>
            <div style={S.pageHeader('linear-gradient(135deg,#1e1b4b,#4338ca)')}>
              <div style={S.bubble(-40,'-40px',undefined,undefined,140,140,0.07)}/>
              <div style={S.pageTitle}>Deudas y Créditos</div>
              <div style={S.pageSub}>BCP — Jesús Cortez</div>
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
                  {tcs.map(tc=><TarjetaVisual key={tc.id} tc={tc}/>)}
                  <div style={{background:'#f0f0f7',borderRadius:14,padding:'12px 14px',textAlign:'center',border:'2px dashed #c7d2fe',cursor:'pointer'}} onClick={()=>{}}>
                    <Plus size={18} color="#6366f1" style={{margin:'0 auto 4px'}}/>
                    <div style={{fontSize:12,color:'#6366f1',fontWeight:700}}>Agregar tarjeta</div>
                  </div>
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

        {/* ══ METAS / PRESUPUESTOS ══════════════════════════════════════════ */}
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

              {/* ── FASE C: Sugerencias automáticas ── */}
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
                      <button onClick={()=>{sugs.forEach(s=>setPresupuestos(prev=>[...prev,{id:Date.now()+Math.random(),categoria:s.categoria,limite:s.sugerido}]));setSugerenciasDescartadas(true);}}
                        style={{padding:'10px',borderRadius:12,border:'none',background:'#fff',color:'#0f766e',fontWeight:800,fontSize:13,fontFamily:'inherit',cursor:'pointer'}}>
                        ✓ Activar todos
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

        {/* ══ STATS FASE D — ANÁLISIS CON CONCLUSIONES ════════════════════ */}
        {tab==='stats' && (
          <div>
            <div style={S.pageHeader('linear-gradient(135deg,#0f172a,#1e3a5f)')}>
              <div style={S.bubble(-40,'-40px',undefined,undefined,140,140,0.07)}/>
              <div style={S.pageTitle}>Análisis Inteligente</div>
              <div style={S.pageSub}>Lo que tus números te dicen</div>
            </div>
            <div style={{padding:'16px'}}>

              {/* ── FASE E: Saldo en stats ── */}
              {saldoCuenta !== null && (
                <div style={{background:'linear-gradient(135deg,#1d4ed8,#0891b2)',borderRadius:20,padding:'16px',marginBottom:14,boxShadow:'0 4px 20px rgba(29,78,216,0.2)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{color:'rgba(255,255,255,0.6)',fontSize:11,textTransform:'uppercase',letterSpacing:0.5,marginBottom:4}}>Saldo disponible en cuenta</div>
                      <div style={{color:'#fff',fontSize:32,fontWeight:800}}>{fmt(saldoCuenta)}</div>
                      <div style={{color:'rgba(255,255,255,0.6)',fontSize:11,marginTop:4}}>
                        {saldoCuenta < 200 ? '⚠️ Saldo bajo — considera reducir gastos' :
                         saldoCuenta < 500 ? 'Saldo moderado' : '✓ Saldo saludable'}
                      </div>
                    </div>
                    <button onClick={()=>setShowSaldoSetup(true)} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:12,padding:'8px 12px',color:'#fff',fontSize:12,fontFamily:'inherit',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
                      <Pencil size={13} color="#fff"/>Editar
                    </button>
                  </div>
                </div>
              )}

              {/* ── Score financiero ── */}
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

              {/* ── Día con más gastos ── */}
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

              {/* ── Categoría que más crece ── */}
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

              {/* ── Pie por categoría ── */}
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

              {/* ── Mes a mes ── */}
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

              {/* ── FASE D: Conclusiones inteligentes ── */}
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

                if (tasaAhorro >= 20) insights.push({ color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', emoji:'🎯', titulo:`Ahorras el ${tasaAhorro.toFixed(1)}% de tus ingresos`, texto:`Estás por encima del 20% recomendado. Cada mes guardas ${fmt(stats.balance)} que trabajan para ti.` });
                else if (tasaAhorro > 0) insights.push({ color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', emoji:'📊', titulo:`Ahorro al ${tasaAhorro.toFixed(1)}%`, texto:`Para llegar al 20% recomendado necesitas ahorrar ${fmt(stats.ingresos*0.2)} al mes. Te faltan ${fmt(stats.ingresos*0.2-stats.balance)}.` });

                if (topCat && topCat[0] !== 'Deporte') insights.push({ color:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe', emoji:'🔍', titulo:`${topCat[0]} es tu mayor gasto`, texto:`Represents el ${Math.round(topCat[1]/stats.gastos*100)}% de tus gastos totales — equivale a ${fmt(topCat[1])} este mes.` });

                if (diaMasGasto && porDia[diaMasGasto[0]] > 0) insights.push({ color:'#0891b2', bg:'#eff6ff', border:'#bfdbfe', emoji:'📅', titulo:`Los ${diasSemana[diaMasGasto[0]]} gastas más`, texto:`${fmt(diaMasGasto[1])} en total. Estar consciente de este patrón es el primer paso para cambiarlo.` });

                if (pctTC > 50) insights.push({ color:'#ef4444', bg:'#fef2f2', border:'#fecaca', emoji:'💳', titulo:`${pctTC}% de tus gastos van a TC`, texto:`Más de la mitad de tus gastos acumulan deuda. Cuando puedas, prioriza pagar con efectivo para no inflar el consumido.` });
                else if (pctTC > 0) insights.push({ color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', emoji:'💳', titulo:`Solo el ${pctTC}% va a TC`, texto:`Buen balance. Usas la tarjeta con moderación. Sigue así y tu deuda TC será manejable.` });

                // Insight positivo si gasta en deporte
                const gastoDeporte = txs.filter(t=>t.tipo==='gasto'&&t.categoria==='Deporte').reduce((s,t)=>s+t.monto,0);
                if (gastoDeporte > 0) insights.push({ color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', emoji:'🏆', titulo:'Inviertes en tu salud física', texto:`Has gastado ${fmt(gastoDeporte)} en deporte. Eso no es un gasto — es una inversión en tu energía y rendimiento.` });

                if (cuotasMes > 0 && stats.ingresos > 0) {
                  const ratio = Math.round(cuotasMes/stats.ingresos*100);
                  const diasTrabajo = Math.round(cuotasMes/(stats.ingresos/30));
                  insights.push({ color: ratio>30?'#f97316':'#6366f1', bg: ratio>30?'#fff7ed':'#f5f3ff', border: ratio>30?'#fed7aa':'#ddd6fe', emoji:'⏱️', titulo:`Tus cuotas = ${diasTrabajo} días de trabajo`, texto:`Pagas ${fmt(cuotasMes)}/mes en créditos — el ${ratio}% de tus ingresos. Al terminar el crédito ****6347 recuperas ${fmt(272.28)}/mes.` });
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
                          <span style={{fontSize:16}}>{ins.emoji}</span>
                          <span style={{fontSize:13,fontWeight:700,color:ins.color}}>{ins.titulo}</span>
                        </div>
                        <div style={{fontSize:12,color:'#374151',lineHeight:1.6,paddingLeft:24}}>{ins.texto}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* ── Fechas importantes ── */}
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

              {/* ── Solo si casi termina un crédito ── */}
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

        {/* ══ MODAL SALDO DE CUENTA (FASE E) ═══════════════════════════════ */}
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
                  setSaldoCuenta(parseFloat(saldoInput));
                  setSaldoInput(''); setShowSaldoSetup(false);
                }}><Wallet size={18}/>Guardar saldo</button>
              </div>
              {saldoCuenta !== null && (
                <button onClick={()=>{setSaldoCuenta(null);setShowSaldoSetup(false);}}
                  style={{width:'100%',marginTop:10,padding:'10px',background:'none',border:'none',color:'#9ca3af',fontSize:12,fontFamily:'inherit',cursor:'pointer'}}>
                  Eliminar saldo de cuenta
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══ MODAL RESUMEN SALARIO ══════════════════════════════════════════ */}
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

        {/* ══ BOTTOM NAV ════════════════════════════════════════════════════ */}
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
