export const CICLOS_BCP = {
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

export const getCicloActual = () => {
  const mes = new Date().getMonth() + 1;
  return CICLOS_BCP[mes] || CICLOS_BCP[6];
};

export const parseLimitePago = (str) => {
  const [d,m,y] = str.split('/');
  return new Date(`20${y}-${m}-${d}`);
};

export const alertaTC = () => {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
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
