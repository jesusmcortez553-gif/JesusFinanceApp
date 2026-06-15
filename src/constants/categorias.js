import {
  ShoppingCart, Car, Zap, Heart, Gamepad2, Shirt, BookOpen, Package,
  Briefcase, Store, Monitor, TrendingUp, Gift,
  Home, Utensils, Plane, Moon, Users, UserCheck, CreditCard,
} from 'lucide-react';

export const CAT_ICONOS = {
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

export const CATS_GASTO   = ['Alimentación','Salidas','Transporte','Viajes','Servicios','Salud','Deporte','Entretenimiento','Vida nocturna','Educación','Ropa','Hogar','Familiar','Social','Regalo','Mascotas','Otros'];
export const CATS_INGRESO = ['Salario','Negocio','Freelance','Inversión','Disposición TC','Regalo','Otros'];
export const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export const DICCIONARIO = {
  'Alimentación': [
    'bodeg','mercad','supermercad','plazavea','wong','tottus','tambo','mass','listo','oxxo',
    'caserít','minimarket','pan','panader','desayun','leche','yogur','queso','huev','arroz',
    'verdur','frut','carn','pescad','atun','sardina','gaseosa','agua mineral','aguas mineral',
    'rappi','pedidosya','uber eat','delivery','salchipap','anticuch','picard','empanada',
    'sanguch','baguett','quinua','kiwicha','avena','cereal','choclo','papa','camot',
  ],
  'Salidas': [
    'restaur','cevicher','polleri','chifer','pizzer','hamburguer','sushit','sangucheri',
    'parrilla','asadero','buffet','cafeter','loncheri','picanter','huarique',
    'cevich','lomo saltado','aji de gallina','causa','chicharr','juane','tacacho',
    'pachamanca','anticucho','rocoto relleno','papa rellena','tacu tacu',
    'arroz con leche','mazamorra','picarone',
    'alitas','alas de pollo','sushi','salchipollo','salchipapa','broaster','broster',
    'caldo','caldito','caldo de gallina','caldo verde','parihuela','aguadito',
    'pollo a la brasa','pollada','pollo entero','pollo familiar',
    'chaufa','chifa','arroz chaufa','tallarín saltado','wantan',
    'pizza','hamburguesa','hot dog','shawarma','tacos','burritos',
    'pollo frito','milanesa','apanado','bistec',
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

export const CIUDADES = ['lima','huancayo','satipo','cusco','arequipa','trujillo','iquitos',
  'tarapoto','pucallpa','piura','chiclayo','ayacucho','huaraz','cajamarca',
  'tacna','puno','juliaca','nazca','paracas'];

export const PALABRAS_SALARIO     = ['salari','sueldo','quincena','planilla','remuneracion','pago mensual','deposito sueldo','abono sueldo'];
export const PALABRAS_DISPOSICION = ['disposicion','disposición','dispos efectivo','retiro tc','avance efectivo','avance tc','retiro tarjeta'];
export const PALABRAS_PAGO_TC     = ['pago tc','pago tarjet','pago visa','pago credito tc','abono tarjet','cancelar tarjet'];

export const MENSAJES_NOCHE = [
  "Son altas horas de la noche. Las decisiones de madrugada cuestan más de lo que parecen.",
  "Tu yo del futuro está mirando lo que haces ahora mismo.",
  "Cada sol que gastas esta noche es un paso más lejos de donde quieres estar.",
  "La libertad financiera se construye en las decisiones que nadie ve.",
];
export const MENSAJES_ALCOHOL = [
  "Este gasto puede parecer pequeño ahora, pero estos momentos se acumulan.",
  "Tu meta más cercana necesita este dinero más que este momento.",
  "No te juzgo — solo te recuerdo quién quieres ser mañana.",
  "Una decisión consciente es mejor que una decisión automática. Tú eliges.",
  "Lo que gastas hoy es tiempo de libertad que te quitas mañana.",
];
