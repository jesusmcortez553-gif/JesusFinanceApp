// Utilidades de fecha en hora local de Perú.
// NUNCA usar toISOString() aquí: usa UTC y desfasa el día en Perú (UTC-5),
// sobre todo entre 7pm y 12am. Ver bug conocido #4 en .ponytail.md

export const hoyPeru = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const fechaAPeru = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Reemplaza `new Date(Date.now() - 86400000).toISOString()...` para calcular "ayer"
export const ayerPeru = () => fechaAPeru(Date.now() - 86400000);

// Reemplaza `new Date().toISOString().slice(0,7)` para "año-mes actual"
export const mesActualPeru = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
