// Base de datos simulada para el juego ECO
export interface DatabaseRecord {
  [key: string]: any;
}

export interface GameDatabase {
  [tableName: string]: DatabaseRecord[];
}

// Datos del Nivel 1: La Casa de las Brujas
export const memoriasCasa: DatabaseRecord[] = [
  { id: 1, nombre_persona: "Don Alfredo", tipo_registro: "diario", detalle: "Maltrato físico a la niña" },
  { id: 2, nombre_persona: "Doña Carmen", tipo_registro: "testimonio", detalle: "Escuchó llantos en la noche" },
  { id: 3, nombre_persona: "María Elena", tipo_registro: "diario", detalle: "La niña tenía marcas extrañas" },
  { id: 4, nombre_persona: "Padre José", tipo_registro: "confesión", detalle: "Don Alfredo confesó sus pecados" },
  { id: 5, nombre_persona: "Dr. Morales", tipo_registro: "reporte", detalle: "Lesiones compatibles con abuso" },
  { id: 6, nombre_persona: "Vecina Ana", tipo_registro: "testimonio", detalle: "Vio la casa embrujada después" },
];

// Datos del Nivel 2: La Xtabay
export const ilusionesXtabay: DatabaseRecord[] = [
  { id: 1, testimonio: "Juan Pérez", verdadero: false, detalle: "Fue seducido por la Xtabay" },
  { id: 2, testimonio: "Carlos López", verdadero: true, detalle: "Logró resistir sus encantos" },
  { id: 3, testimonio: "Miguel Torres", verdadero: false, detalle: "Perdió la razón por una noche" },
  { id: 4, testimonio: "Antonio Ruiz", verdadero: true, detalle: "Reconoció las señales de peligro" },
  { id: 5, testimonio: "Rafael Santos", verdadero: false, detalle: "Siguió la luz engañosa" },
  { id: 6, testimonio: "David Moreno", verdadero: true, detalle: "Escapó antes del amanecer" },
];

// Datos del Nivel 3: Isla de las Muñecas
export const munecasIsla: DatabaseRecord[] = [
  { id: 1, nombre_muneca: "Rosalinda", energia: "oscura", descripcion: "Cabeza rota, mirada fija" },
  { id: 2, nombre_muneca: "Esperanza", energia: "neutral", descripcion: "Vestido blanco, ojos cerrados" },
  { id: 3, nombre_muneca: "Dolores", energia: "oscura", descripcion: "Brazos amputados, sonrisa siniestra" },
  { id: 4, nombre_muneca: "Luz María", energia: "neutral", descripcion: "Cabello dorado, poses normal" },
  { id: 5, nombre_muneca: "Carmen", energia: "oscura", descripcion: "Ojos rojos, vestido rasgado" },
  { id: 6, nombre_muneca: "Ana Isabel", energia: "neutral", descripcion: "Muñeca de porcelana intacta" },
  { id: 7, nombre_muneca: "Guadalupe", energia: "protectora", descripcion: "Aureola dorada, manos juntas" },
];

// Base de datos completa del juego
export const gameDatabase: GameDatabase = {
  memorias_casa: memoriasCasa,
  ilusiones_xtabay: ilusionesXtabay,
  munecas_isla: munecasIsla,
};

// Definición de niveles y retos
export interface Challenge {
  id: number;
  title: string;
  description: string;
  expectedQuery: string;
  hints: string[];
  table: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Level {
  id: number;
  name: string;
  scenario: string;
  description: string;
  challenges: Challenge[];
  videoPath?: string;
  imagePath?: string;
}

export const gameLevels: Level[] = [
  {
    id: 1,
    name: "La Casa de las Brujas",
    scenario: "Una vieja casa colonial donde ocurrieron eventos traumáticos...",
    description: "Investiga los registros de la casa para descubrir la verdad sobre lo que pasó con la niña.",
    videoPath: "/videos/casa_brujas.mp4",
    imagePath: "/images/casa_brujas.jpg",
    challenges: [
      {
        id: 1,
        title: "Primeras Pistas",
        description: "Muestra todos los registros de la tabla memorias_casa para comenzar la investigación.",
        expectedQuery: "SELECT * FROM memorias_casa",
        hints: [
          "Usa SELECT para obtener datos de una tabla",
          "El asterisco (*) significa 'todas las columnas'"
        ],
        table: "memorias_casa",
        difficulty: 'easy'
      },
      {
        id: 2,
        title: "Organizando las Evidencias",
        description: "Ordena los registros por nombre de persona alfabéticamente para organizar las evidencias.",
        expectedQuery: "SELECT * FROM memorias_casa ORDER BY nombre_persona",
        hints: [
          "Usa ORDER BY para ordenar los resultados",
          "Especifica la columna por la cual quieres ordenar"
        ],
        table: "memorias_casa",
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 2,
    name: "La Xtabay",
    scenario: "En los bosques de Yucatán, una entidad seduce a los viajeros...",
    description: "Analiza los testimonios para distinguir entre víctimas y sobrevivientes de la Xtabay.",
    videoPath: "/videos/xtabay.mp4",
    imagePath: "/images/xtabay.jpg",
    challenges: [
      {
        id: 3,
        title: "Testimonios Verdaderos",
        description: "Encuentra solo los testimonios verdaderos de quienes resistieron a la Xtabay.",
        expectedQuery: "SELECT * FROM ilusiones_xtabay WHERE verdadero = true",
        hints: [
          "Usa WHERE para filtrar registros",
          "El valor booleano 'true' indica testimonios verdaderos"
        ],
        table: "ilusiones_xtabay",
        difficulty: 'medium'
      },
      {
        id: 4,
        title: "Contando Víctimas",
        description: "Agrupa los testimonios por su veracidad y cuenta cuántos hay de cada tipo.",
        expectedQuery: "SELECT verdadero, COUNT(*) as total FROM ilusiones_xtabay GROUP BY verdadero",
        hints: [
          "Usa GROUP BY para agrupar registros",
          "COUNT(*) cuenta el número de registros en cada grupo"
        ],
        table: "ilusiones_xtabay",
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 3,
    name: "Isla de las Muñecas",
    scenario: "Una isla misteriosa llena de muñecas colgadas de los árboles...",
    description: "Investiga las energías de las muñecas para encontrar la protección contra las fuerzas oscuras.",
    videoPath: "/videos/isla_munecas.mp4",
    imagePath: "/images/isla_munecas.jpg",
    challenges: [
      {
        id: 5,
        title: "Energías Malignas",
        description: "Encuentra grupos de muñecas por tipo de energía que tengan más de 1 muñeca.",
        expectedQuery: "SELECT energia, COUNT(*) as cantidad FROM munecas_isla GROUP BY energia HAVING COUNT(*) > 1",
        hints: [
          "Usa HAVING para filtrar grupos después de GROUP BY",
          "HAVING funciona con funciones agregadas como COUNT()"
        ],
        table: "munecas_isla",
        difficulty: 'hard'
      },
      {
        id: 6,
        title: "La Protectora",
        description: "Encuentra la muñeca protectora y combínala con sus características usando una consulta compleja.",
        expectedQuery: "SELECT m1.nombre_muneca, m1.energia, m1.descripcion FROM munecas_isla m1 INNER JOIN (SELECT energia FROM munecas_isla WHERE energia = 'protectora') m2 ON m1.energia = m2.energia",
        hints: [
          "Usa INNER JOIN para combinar tablas",
          "Puedes hacer un JOIN de una tabla consigo misma usando alias"
        ],
        table: "munecas_isla",
        difficulty: 'hard'
      }
    ]
  }
];

// Configuración de dificultades
export const difficultySettings = {
  easy: { timeLimit: 600000, name: "Fácil" }, // 10 minutos
  medium: { timeLimit: 300000, name: "Medio" }, // 5 minutos
  hard: { timeLimit: 180000, name: "Difícil" } // 3 minutos
};