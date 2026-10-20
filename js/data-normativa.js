/* =====================================================================
   Reglas normativas utilizadas por la aplicación.
   Fuentes (documentos entregados por el usuario):
   - D.S. N° 259 de 1980 (MINAGRI), Reglamento Técnico del D.L. 701: arts. 18 a 24 y 30.
   - Ley N° 20.283 (texto vigente al 29-09-2025): art. 2° N° 3, 4, 5, 6 y art. 19.
   - Bases Técnicas Primer Llamado a Concursos 2026 (CONAF), incluye Tabla de Valores D.S. 82/2022.
   - D.S. N° 68 de 2009 (MINAGRI): nómina oficial de especies arbóreas y arbustivas originarias.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Regiones (orden geográfico norte → sur) ---------- */
  // rom = numeración usada en el Compendio (2003) y en las fichas del MMA.
  const REGIONES = [
    { id: 'XV', nombre: 'Arica y Parinacota', compendio: 'I' },
    { id: 'I', nombre: 'Tarapacá', compendio: 'I' },
    { id: 'II', nombre: 'Antofagasta', compendio: 'II' },
    { id: 'III', nombre: 'Atacama', compendio: 'III' },
    { id: 'IV', nombre: 'Coquimbo', compendio: 'IV' },
    { id: 'V', nombre: 'Valparaíso', compendio: 'V' },
    { id: 'RM', nombre: 'Metropolitana de Santiago', compendio: 'RM' },
    { id: 'VI', nombre: "Libertador General Bernardo O'Higgins", compendio: 'VI' },
    { id: 'VII', nombre: 'Maule', compendio: 'VII' },
    { id: 'XVI', nombre: 'Ñuble', compendio: 'VIII' },
    { id: 'VIII', nombre: 'Biobío', compendio: 'VIII' },
    { id: 'IX', nombre: 'La Araucanía', compendio: 'IX' },
    { id: 'XIV', nombre: 'Los Ríos', compendio: 'X' },
    { id: 'X', nombre: 'Los Lagos', compendio: 'X' },
    { id: 'XI', nombre: 'Aysén del General Carlos Ibáñez del Campo', compendio: 'XI' },
    { id: 'XII', nombre: 'Magallanes y de la Antártica Chilena', compendio: 'XII' }
  ];

  /* ---------- Especies de los tipos forestales (D.S. 259, art. 19) ---------- */
  // Nombres científicos según grafía del D.S. 68/2009.
  const SP = {
    alerce: 'Fitzroya cupressoides',
    araucaria: 'Araucaria araucana',
    palma: 'Jubaea chilensis',
    cipresCordillera: 'Austrocedrus chilensis',
    cipresGuaitecas: 'Pilgerodendron uviferum',
    coigueMagallanes: 'Nothofagus betuloides',
    coigue: 'Nothofagus dombeyi',
    rauli: 'Nothofagus alpina',
    tepa: 'Laureliopsis philippiana',
    lenga: 'Nothofagus pumilio',
    roble: 'Nothofagus obliqua',
    hualo: 'Nothofagus glauca'
  };
  // Art. 19 j) Siempreverde
  const SIEMPREVERDE = ['Nothofagus dombeyi', 'Nothofagus nitida', 'Nothofagus betuloides', 'Eucryphia cordifolia',
    'Weinmannia trichosperma', 'Laureliopsis philippiana', 'Aextoxicon punctatum', 'Drimys winteri',
    'Podocarpus nubigena', 'Saxegothaea conspicua', 'Amomyrtus luma', 'Amomyrtus meli', 'Myrceugenia planipes'];
  // Art. 19 k) Esclerófilo (especies nombradas)
  const ESCLEROFILO = ['Quillaja saponaria', 'Lithrea caustica', 'Cryptocarya alba', 'Acacia caven', 'Maytenus boaria',
    'Prosopis chilensis', 'Beilshmiedia miersii', 'Peumus boldus', 'Kageneckia oblonga', 'Schinus latifolius'];
  // "y otras especies de distribución geográfica similar a las ya indicadas" (art. 19 k).
  // Criterio de la aplicación (editable por el profesional mediante la asignación manual del tipo forestal).
  const ESCLEROFILO_SIMILARES = ['Beilshmiedia berteroana', 'Kageneckia angustifolia', 'Crinodendron patagua',
    'Schinus polygamus', 'Porlieria chilensis', 'Colliguaja dombeyana', 'Colliguaja integerrima',
    'Citronella mucronata', 'Luma chequen', 'Escallonia pulverulenta', 'Sophora macrocarpa', 'Azara dentata',
    'Azara integrifolia', 'Azara celastrina', 'Azara petiolaris', 'Schinus montanus', 'Lomatia hirsuta',
    'Myrceugenia exsucca', 'Persea meyeniana', 'Pouteria splendens', 'Adesmia balsamica',
    'Baccharis linearis', 'Podanthus mitiqui', 'Escallonia rubra', 'Prosopis alba', 'Geoffroea decorticans'];

  const TIPOS_FORESTALES = [
    { id: 'ALE', nombre: 'Alerce', art: '19 a)', regla: 'Al menos 1 individuo de alerce (Fitzroya cupressoides) por hectárea.' },
    { id: 'ARA', nombre: 'Araucaria', art: '19 b)', regla: 'Al menos 1 individuo de araucaria (Araucaria araucana) por hectárea.' },
    { id: 'CC', nombre: 'Ciprés de la Cordillera', art: '19 c)', regla: 'Puro o asociado, al menos 40 individuos/ha de Austrocedrus chilensis, cada uno mayor de 2 m de altura.' },
    { id: 'CG', nombre: 'Ciprés de las Guaitecas', art: '19 d)', regla: 'Puro o asociado, al menos 10 individuos/ha de Pilgerodendron uviferum, cada uno mayor de 2 m de altura.' },
    { id: 'CM', nombre: 'Coigüe de Magallanes', art: '19 e)', regla: 'Puro o asociado, al menos 50 % de los individuos por hectárea son Nothofagus betuloides.' },
    { id: 'CRT', nombre: 'Coigüe-Raulí-Tepa', art: '19 f)', regla: 'Combinación de coigüe, raulí y tepa, salvo que coigüe o raulí constituyan más del 50 % de los individuos por hectárea.' },
    { id: 'LEN', nombre: 'Lenga', art: '19 g)', regla: 'Puro o asociado, al menos 50 % de los individuos por hectárea son Nothofagus pumilio.' },
    { id: 'RRC', nombre: 'Roble-Raulí-Coigüe', art: '19 h)', regla: 'Roble, raulí y/o coigüe constituyen más del 50 % de los individuos por hectárea con DAP ≥ 10 cm.' },
    { id: 'RH', nombre: 'Roble-Hualo', art: '19 i)', regla: 'Roble y/o hualo constituyen al menos el 50 % de los individuos por hectárea.' },
    { id: 'SV', nombre: 'Siempreverde', art: '19 j)', regla: 'Estrato superior o intermedio representado por la asociación de coigüe, coigüe de Chiloé, coigüe de Magallanes, ulmo, tineo, tepa, olivillo, canelo, mañíos, luma, meli y pitra.' },
    { id: 'ESC', nombre: 'Esclerófilo', art: '19 k)', regla: 'Presencia de al menos una de: quillay, litre, peumo, espino, maitén, algarrobo, belloto, boldo, bollén, molle y otras de distribución geográfica similar.' },
    { id: 'PAL', nombre: 'Palma Chilena', art: '19 l)', regla: 'Presencia de uno o más individuos de Jubaea chilensis por hectárea.' }
  ];

  /* ---------- Métodos de corta (D.S. 259, arts. 18, 21-24, 30) ---------- */
  const METODOS_CORTA = [
    {
      id: 'TR', nombre: 'Tala rasa', art: '18 a) y 21',
      definicion: 'Volteo en una temporada de todos los árboles de un área definida del rodal.',
      tipos: ['RH', 'RRC'],
      reforestacion: 'Establecer un mínimo de 3.000 plantas/ha de las mismas especies, homogéneamente distribuidas.',
      prohibidoPendienteSobre: 45
    },
    {
      id: 'AS', nombre: 'Árbol semillero', art: '18 b) y 22',
      definicion: 'Volteo de todos los árboles del rodal en una temporada, exceptuando los árboles semilleros de la especie que se desea regenerar.',
      tipos: ['RH', 'RRC', 'CRT'],
      reforestacion: 'Dejar como mínimo 10 árboles semilleros/ha, que permanecerán en pie hasta establecer al menos 3.000 plantas/ha de la misma especie, homogéneamente distribuidas.',
      minSemilleros: 10,
      prohibidoPendienteSobre: 45
    },
    {
      id: 'PR', nombre: 'Protección', art: '18 c) y 23',
      definicion: 'Explotación gradual del rodal en una serie de cortas parciales, para dar origen a un rodal coetáneo a través de regeneración natural bajo la protección del antiguo rodal.',
      tipos: ['RH', 'RRC', 'LEN', 'CC', 'ESC', 'SV', 'CM', 'CRT'],
      reforestacion: 'Establecer como mínimo 3.000 plántulas/ha de las mismas especies cortadas del tipo, homogéneamente distribuidas.'
    },
    {
      id: 'SE', nombre: 'Selectiva o entresaca', art: '18 d) y 24',
      definicion: 'Extracción individual de árboles o de pequeños grupos en una superficie no superior a 0,3 ha, manteniendo una faja boscosa de al menos 50 m alrededor de lo cortado.',
      // El art. 24 enumera "palma-coigüe-raulí-tepa"; se interpreta como Palma Chilena y Coigüe-Raulí-Tepa.
      tipos: ['PAL', 'CRT', 'CG', 'CM', 'SV', 'ESC', 'RH', 'CC', 'LEN', 'RRC'],
      reforestacion: 'Establecer como mínimo 10 plantas de la misma especie por cada individuo cortado, o 3.000 plantas/ha del tipo correspondiente, homogéneamente distribuidas.',
      maxExtraccionG: 35,
      nota: 'Una nueva corta selectiva en el mismo rodal sólo puede efectuarse transcurridos 5 años desde la corta anterior. El art. 24 enumera "palma-coigüe-raulí-tepa"; la aplicación lo interpreta como Palma Chilena y Coigüe-Raulí-Tepa.'
    }
  ];
  const RESTRICCIONES_PENDIENTE = [
    { desde: 30, hasta: 45, texto: 'Pendiente entre 30 % y 45 %: si se usa tala rasa o árbol semillero, los sectores a cortar no pueden exceder 20 ha y deben dejarse fajas boscosas de al menos 100 m entre sectores (art. 18).' },
    { desde: 45, hasta: 1000, texto: 'Pendiente mayor de 45 %: no se pueden usar los métodos de tala rasa ni de árbol semillero (art. 18).' },
    { desde: 60, hasta: 1000, texto: 'Pendiente superior a 60 %: sólo puede usarse el método de corta selectiva (art. 18).' }
  ];

  /* ---------- Estados de desarrollo (Bases Técnicas 2026, punto 2.5, Cuadro 2) ---------- */
  const ESTADOS = ['Repoblado', 'Monte Bravo Bajo', 'Monte Bravo Alto', 'Latizal Bajo', 'Latizal Alto', 'Fustal joven', 'Fustal', 'Sobremaduro'];
  function estadoDesarrollo(esEsclerofilo, dmc, hProm) {
    // dmc en cm, hProm en m. Devuelve {estado, criterio}
    if (esEsclerofilo) {
      if (dmc != null && dmc >= 8) {
        if (dmc <= 15) return { estado: 'Latizal Bajo', criterio: 'DMC ≥ 8 y ≤ 15 cm (Esclerófilo)' };
        if (dmc <= 25) return { estado: 'Latizal Alto', criterio: 'DMC > 15 y ≤ 25 cm (Esclerófilo)' };
        if (dmc <= 35) return { estado: 'Fustal joven', criterio: 'DMC > 25 y ≤ 35 cm (Esclerófilo)' };
        if (dmc <= 50) return { estado: 'Fustal', criterio: 'DMC > 35 y ≤ 50 cm (Esclerófilo)' };
        return { estado: 'Sobremaduro', criterio: 'DMC > 50 cm (Esclerófilo)' };
      }
      if (hProm == null) return { estado: null, criterio: 'DMC < 8 cm: se requiere la altura promedio para distinguir repoblado y monte bravo' };
      if (hProm <= 0.8) return { estado: 'Repoblado', criterio: 'Altura ≤ 0,8 m (Esclerófilo)' };
      if (hProm <= 1.5) return { estado: 'Monte Bravo Bajo', criterio: 'Altura > 0,8 y ≤ 1,5 m (Esclerófilo)' };
      return { estado: 'Monte Bravo Alto', criterio: 'Altura > 1,5 m y DMC < 8 cm (Esclerófilo)' };
    }
    if (dmc != null && dmc >= 10) {
      if (dmc <= 20) return { estado: 'Latizal Bajo', criterio: 'DMC ≥ 10 y ≤ 20 cm (Otros tipos)' };
      if (dmc <= 30) return { estado: 'Latizal Alto', criterio: 'DMC > 20 y ≤ 30 cm (Otros tipos)' };
      if (dmc <= 50) return { estado: 'Fustal joven', criterio: 'DMC > 30 y ≤ 50 cm (Otros tipos)' };
      if (dmc <= 70) return { estado: 'Fustal', criterio: 'DMC > 50 y ≤ 70 cm (Otros tipos)' };
      return { estado: 'Sobremaduro', criterio: 'DMC > 70 cm (Otros tipos)' };
    }
    if (hProm == null) return { estado: null, criterio: 'DMC < 10 cm: se requiere la altura promedio para distinguir repoblado y monte bravo' };
    if (hProm < 1) return { estado: 'Repoblado', criterio: 'Altura < 1 m (Otros tipos)' };
    if (hProm <= 3) return { estado: 'Monte Bravo Bajo', criterio: 'Altura ≥ 1 y ≤ 3 m (Otros tipos)' };
    return { estado: 'Monte Bravo Alto', criterio: 'Altura > 3 m y DMC < 10 cm (Otros tipos)' };
  }

  /* ---------- Tipos forestales incluidos en la Tabla de Valores (D.S. 82/2022, Anexo 1 de las Bases) ---------- */
  const TIPOS_TABLA_VALORES = {
    A: ['ESC', 'SV', 'ALE', 'CC', 'CG', 'CM', 'LEN'], // + Formación xerofítica de alto valor ecológico
    B: ['ESC', 'RH', 'CC', 'RRC', 'CRT', 'SV', 'CM', 'CG', 'LEN'],
    C: ['ESC', 'RH', 'CC', 'RRC', 'CRT', 'SV', 'CM', 'CG', 'LEN']
  };

  /* ---------- Actividades bonificables relacionadas con corta o poda (Bases Técnicas 2026) ---------- */
  // regla: identificador de verificación cuantitativa implementada en calculos.js
  // estados: estados de desarrollo permitidos (bosques regulares). null = cualquier estado.
  const ACTIVIDADES = [
    { id: 'NINGUNA', literal: '-', nombre: 'Sin intervención (sólo diagnóstico)', estados: null, regla: null, corta: false },
    // Literal A (bosque nativo de preservación)
    { id: 'A_SAN', literal: 'A', nombre: 'Corta sanitaria (literal a)', estados: null, regla: 'SANITARIA', corta: true, ref: '3.1.2 b' },
    { id: 'A_PFI', literal: 'A', nombre: 'Poda fitosanitaria (literal a)', estados: ['Latizal Bajo', 'Latizal Alto', 'Fustal joven', 'Fustal', 'Sobremaduro'], tipos: ['ESC'], regla: 'PODA_FITO', corta: false, ref: '3.1.2 g' },
    // Literal B (productos no madereros)
    { id: 'B_CMBA', literal: 'B', nombre: 'Clareo monte bravo alto con fines no madereros', estados: ['Monte Bravo Alto'], regla: 'G_EXTRAE', corta: true, ref: '3.2.2 a' },
    { id: 'B_CMBB', literal: 'B', nombre: 'Clareo monte bravo bajo con fines no madereros', estados: ['Monte Bravo Bajo'], regla: 'G_EXTRAE', corta: true, ref: '3.2.2 b' },
    { id: 'B_IRR', literal: 'B', nombre: 'Corta para bosques irregulares (literal b)', estados: null, irregular: true, regla: 'IRREGULAR', corta: true, ref: '3.2.2 d' },
    { id: 'B_SAN', literal: 'B', nombre: 'Corta sanitaria (literal b)', estados: null, regla: 'SANITARIA', corta: true, ref: '3.2.2 e' },
    { id: 'B_PFI', literal: 'B', nombre: 'Poda fitosanitaria (literal b)', estados: ['Latizal Bajo', 'Latizal Alto', 'Fustal joven', 'Fustal', 'Sobremaduro'], tipos: ['ESC'], regla: 'PODA_FITO', corta: false, ref: '3.2.2 l' },
    { id: 'B_PLAT', literal: 'B', nombre: 'Poda de latizal con fines no madereros', estados: ['Latizal Bajo', 'Latizal Alto'], regla: 'PODA_NM', corta: false, ref: '3.2.2 m' },
    { id: 'B_RLAFJ', literal: 'B', nombre: 'Raleo latizal alto y fustal joven con fines no madereros', estados: ['Latizal Alto', 'Fustal joven'], regla: 'G_EXTRAE', corta: true, ref: '3.2.2 q' },
    { id: 'B_RLB', literal: 'B', nombre: 'Raleo latizal bajo con fines no madereros', estados: ['Latizal Bajo'], regla: 'G_EXTRAE', corta: true, ref: '3.2.2 r' },
    // Literal C (producción maderera)
    { id: 'C_REG', literal: 'C', nombre: 'Corta de regeneración', estados: ['Fustal', 'Sobremaduro', 'Latizal Alto'], excepcional: ['Latizal Alto'], regla: 'REGENERACION', corta: true, ref: '3.3.2 a' },
    { id: 'C_ANI', literal: 'C', nombre: 'Anillado', estados: null, regla: 'ANILLADO', corta: true, ref: '3.3.3 a' },
    { id: 'C_CMBA', literal: 'C', nombre: 'Clareo monte bravo alto', estados: ['Monte Bravo Alto'], regla: 'G_EXTRAE', corta: true, ref: '3.3.3 b' },
    { id: 'C_CMBB', literal: 'C', nombre: 'Clareo monte bravo bajo', estados: ['Monte Bravo Bajo'], regla: 'G_EXTRAE', corta: true, ref: '3.3.3 c' },
    { id: 'C_LIB', literal: 'C', nombre: 'Corta de liberación', estados: ['Repoblado', 'Monte Bravo Bajo', 'Monte Bravo Alto'], regla: 'MIN10', corta: true, ref: '3.3.3 d' },
    { id: 'C_MEJ', literal: 'C', nombre: 'Corta de mejoramiento', estados: ['Latizal Bajo', 'Latizal Alto', 'Fustal joven'], regla: 'MEJORAMIENTO', corta: true, ref: '3.3.3 e' },
    { id: 'C_IRR', literal: 'C', nombre: 'Corta para bosques irregulares (literal c)', estados: null, irregular: true, regla: 'IRREGULAR', corta: true, ref: '3.3.3 f' },
    { id: 'C_SAN', literal: 'C', nombre: 'Corta sanitaria (literal c)', estados: null, regla: 'SANITARIA', corta: true, ref: '3.3.3 g' },
    { id: 'C_PFI', literal: 'C', nombre: 'Poda fitosanitaria (literal c)', estados: ['Latizal Bajo', 'Latizal Alto', 'Fustal joven', 'Fustal', 'Sobremaduro'], tipos: ['ESC'], regla: 'PODA_FITO', corta: false, ref: '3.3.3 h' },
    { id: 'C_PLA', literal: 'C', nombre: 'Poda latizal alto', estados: ['Latizal Alto'], regla: 'PODA_LA', corta: false, ref: '3.3.3 i' },
    { id: 'C_PLB', literal: 'C', nombre: 'Poda latizal bajo', estados: ['Latizal Bajo'], regla: 'PODA_LB', corta: false, ref: '3.3.3 j' },
    { id: 'C_RFJ', literal: 'C', nombre: 'Raleo fustal joven', estados: ['Fustal joven'], regla: 'RALEO', corta: true, ref: '3.3.3 k' },
    { id: 'C_RLA', literal: 'C', nombre: 'Raleo latizal alto', estados: ['Latizal Alto'], regla: 'RALEO', corta: true, ref: '3.3.3 l' },
    { id: 'C_RLB', literal: 'C', nombre: 'Raleo latizal bajo', estados: ['Latizal Bajo'], regla: 'RALEO', corta: true, ref: '3.3.3 m' },
    // Bosques afectados por incendios (punto 4)
    { id: 'I_REC', literal: 'Incendios', nombre: 'Corta de recuperación (bosques afectados por incendios)', estados: null, regla: 'RECUPERACION', corta: true, ref: '4 b' }
  ];

  /* ---------- Categorías de conservación (RCE) ---------- */
  const CATEGORIAS = {
    EX: { nombre: 'Extinta', orden: 9 },
    EW: { nombre: 'Extinta en estado silvestre', orden: 8 },
    CR: { nombre: 'En Peligro Crítico', orden: 7, amenazada: true },
    EN: { nombre: 'En Peligro', orden: 6, amenazada: true },
    VU: { nombre: 'Vulnerable', orden: 5, amenazada: true },
    NT: { nombre: 'Casi Amenazada', orden: 4 },
    LC: { nombre: 'Preocupación Menor', orden: 3 },
    DD: { nombre: 'Datos Insuficientes', orden: 2 },
    R: { nombre: 'Rara', orden: 1 },
    NC: { nombre: 'No clasificada en el listado MMA', orden: 0 }
  };

  window.NORMATIVA = {
    REGIONES, SP, SIEMPREVERDE, ESCLEROFILO, ESCLEROFILO_SIMILARES, TIPOS_FORESTALES, METODOS_CORTA,
    RESTRICCIONES_PENDIENTE, ESTADOS, estadoDesarrollo, TIPOS_TABLA_VALORES, ACTIVIDADES, CATEGORIAS
  };
})();
