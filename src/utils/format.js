export const fmt = (n) => new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN',minimumFractionDigits:2}).format(n);
export const fmtShort = (n) => n >= 1000 ? `S/${(n/1000).toFixed(1)}k` : `S/${Math.round(n)}`;
export const fmtInt   = (n) => new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN',minimumFractionDigits:0}).format(n);
export const fmtFecha = (fechaStr) => { if(!fechaStr) return ''; const [y,m,d] = fechaStr.split('-'); return `${d}/${m}/${y.slice(2)}`; };
export const diasHasta = (fechaStr) => { const hoy = new Date(); hoy.setHours(0,0,0,0); return Math.ceil((new Date(fechaStr) - hoy) / (1000*60*60*24)); };
export const urgenciaColor = (dias) => {
  if (dias <= 5)  return { bg:'#fef2f2', border:'#fecaca', text:'#dc2626', badge:'#ef4444' };
  if (dias <= 15) return { bg:'#fffbeb', border:'#fde68a', text:'#d97706', badge:'#f59e0b' };
  return              { bg:'#f0fdf4', border:'#bbf7d0', text:'#16a34a', badge:'#10b981' };
};
