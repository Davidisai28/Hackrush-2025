// Motor SQL simulado para el juego ECO
import { gameDatabase, DatabaseRecord } from '../data/gameData';

export interface QueryResult {
  success: boolean;
  data?: DatabaseRecord[];
  error?: string;
  message?: string;
}

// Funciones auxiliares para procesamiento de SQL
function parseSelectQuery(query: string): {
  columns: string[];
  table: string;
  whereClause?: string;
  orderBy?: string;
  groupBy?: string;
  having?: string;
} {
  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Extraer columnas
  const selectMatch = normalizedQuery.match(/select\s+(.*?)\s+from/);
  const columns = selectMatch ? selectMatch[1].split(',').map(col => col.trim()) : ['*'];
  
  // Extraer tabla
  const tableMatch = normalizedQuery.match(/from\s+(\w+)/);
  const table = tableMatch ? tableMatch[1] : '';
  
  // Extraer WHERE
  const whereMatch = normalizedQuery.match(/where\s+(.*?)(?:\s+order\s+by|\s+group\s+by|\s*$)/);
  const whereClause = whereMatch ? whereMatch[1].trim() : undefined;
  
  // Extraer ORDER BY
  const orderMatch = normalizedQuery.match(/order\s+by\s+(.*?)(?:\s+group\s+by|\s+having|\s*$)/);
  const orderBy = orderMatch ? orderMatch[1].trim() : undefined;
  
  // Extraer GROUP BY
  const groupMatch = normalizedQuery.match(/group\s+by\s+(.*?)(?:\s+having|\s*$)/);
  const groupBy = groupMatch ? groupMatch[1].trim() : undefined;
  
  // Extraer HAVING
  const havingMatch = normalizedQuery.match(/having\s+(.*?)\s*$/);
  const having = havingMatch ? havingMatch[1].trim() : undefined;
  
  return { columns, table, whereClause, orderBy, groupBy, having };
}

function applyWhereClause(data: DatabaseRecord[], whereClause: string): DatabaseRecord[] {
  if (!whereClause) return data;
  
  return data.filter(record => {
    // Evaluación simple de WHERE - solo casos básicos para el juego
    if (whereClause.includes('verdadero = true')) {
      return record.verdadero === true;
    }
    if (whereClause.includes('verdadero = false')) {
      return record.verdadero === false;
    }
    if (whereClause.includes("energia = 'protectora'")) {
      return record.energia === 'protectora';
    }
    if (whereClause.includes("energia = 'oscura'")) {
      return record.energia === 'oscura';
    }
    if (whereClause.includes("energia = 'neutral'")) {
      return record.energia === 'neutral';
    }
    
    // Evaluación BETWEEN
    const betweenMatch = whereClause.match(/(\w+)\s+between\s+(\d+)\s+and\s+(\d+)/);
    if (betweenMatch) {
      const [, column, min, max] = betweenMatch;
      const value = record[column];
      return value >= parseInt(min) && value <= parseInt(max);
    }
    
    return true;
  });
}

function applyOrderBy(data: DatabaseRecord[], orderBy: string): DatabaseRecord[] {
  if (!orderBy) return data;
  
  const [column, direction = 'asc'] = orderBy.split(' ');
  
  return [...data].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const comparison = aVal.localeCompare(bVal);
      return direction.toLowerCase() === 'desc' ? -comparison : comparison;
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      const comparison = aVal - bVal;
      return direction.toLowerCase() === 'desc' ? -comparison : comparison;
    }
    
    return 0;
  });
}

function applyGroupBy(data: DatabaseRecord[], groupBy: string): DatabaseRecord[] {
  if (!groupBy) return data;
  
  const groups: { [key: string]: DatabaseRecord[] } = {};
  
  data.forEach(record => {
    const groupValue = record[groupBy];
    const key = String(groupValue);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(record);
  });
  
  return Object.entries(groups).map(([key, records]) => ({
    [groupBy]: key === 'true' ? true : key === 'false' ? false : key,
    'count(*)': records.length,
    total: records.length
  }));
}

function applyHaving(data: DatabaseRecord[], having: string): DatabaseRecord[] {
  if (!having) return data;
  
  // Evaluación simple de HAVING para el juego
  if (having.includes('count(*) > 1') || having.includes('count(*)>1')) {
    return data.filter(record => (record['count(*)'] || record.total || 0) > 1);
  }
  
  return data;
}

function selectColumns(data: DatabaseRecord[], columns: string[]): DatabaseRecord[] {
  if (columns.length === 1 && columns[0] === '*') {
    return data;
  }
  
  return data.map(record => {
    const selectedRecord: DatabaseRecord = {};
    columns.forEach(col => {
      const cleanCol = col.trim();
      if (cleanCol.includes(' as ')) {
        const [originalCol, alias] = cleanCol.split(' as ').map(c => c.trim());
        if (originalCol === 'count(*)') {
          selectedRecord[alias] = record['count(*)'] || record.total || 0;
        } else {
          selectedRecord[alias] = record[originalCol];
        }
      } else if (cleanCol === 'count(*)') {
        selectedRecord['count(*)'] = record['count(*)'] || record.total || 0;
      } else {
        selectedRecord[cleanCol] = record[cleanCol];
      }
    });
    return selectedRecord;
  });
}

export function executeQuery(query: string): QueryResult {
  try {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      return { success: false, error: "La consulta no puede estar vacía" };
    }
    
    // Solo soportamos SELECT para el juego
    if (!trimmedQuery.toLowerCase().startsWith('select')) {
      return { success: false, error: "Solo se permiten consultas SELECT en este juego" };
    }
    
    const parsed = parseSelectQuery(trimmedQuery);
    
    if (!parsed.table || !gameDatabase[parsed.table]) {
      return { 
        success: false, 
        error: `La tabla '${parsed.table}' no existe. Tablas disponibles: ${Object.keys(gameDatabase).join(', ')}` 
      };
    }
    
    let data = [...gameDatabase[parsed.table]];
    
    // Aplicar WHERE
    if (parsed.whereClause) {
      data = applyWhereClause(data, parsed.whereClause);
    }
    
    // Aplicar GROUP BY
    if (parsed.groupBy) {
      data = applyGroupBy(data, parsed.groupBy);
    }
    
    // Aplicar HAVING
    if (parsed.having) {
      data = applyHaving(data, parsed.having);
    }
    
    // Aplicar ORDER BY
    if (parsed.orderBy) {
      data = applyOrderBy(data, parsed.orderBy);
    }
    
    // Manejar JOINs simples (solo para el último reto)
    if (trimmedQuery.toLowerCase().includes('inner join')) {
      // Para el reto final, simplificar y devolver la muñeca protectora
      if (parsed.table === 'munecas_isla' && trimmedQuery.toLowerCase().includes('protectora')) {
        data = gameDatabase.munecas_isla.filter(record => record.energia === 'protectora');
      }
    }
    
    // Seleccionar columnas
    data = selectColumns(data, parsed.columns);
    
    return {
      success: true,
      data,
      message: `Consulta ejecutada exitosamente. ${data.length} registro(s) encontrado(s).`
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Error al ejecutar la consulta: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
}

// Función para validar si una consulta coincide con la esperada
export function validateQuery(userQuery: string, expectedQuery: string): boolean {
  const normalizeQuery = (query: string) => 
    query.toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/;$/, ''); // Remover punto y coma final
  
  const userNormalized = normalizeQuery(userQuery);
  const expectedNormalized = normalizeQuery(expectedQuery);
  
  // Permitir algunas variaciones en la sintaxis
  const variations = [
    expectedNormalized,
    expectedNormalized.replace('count(*)', 'count(*)'),
    expectedNormalized.replace(' as total', ''),
    expectedNormalized.replace(' as cantidad', ''),
  ];
  
  return variations.some(variation => userNormalized === variation);
}