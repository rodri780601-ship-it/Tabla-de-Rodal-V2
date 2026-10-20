/* Exportación del libro Excel con todas las hojas de la tabla de rodal. */
(function () {
  'use strict';
  const ST = () => window.XLSXIO.ST;
  const col = (i) => window.XLSXIO.idxToCol(i);
  const r2 = (x, d = 4) => (x == null || !isFinite(x)) ? null : Math.round(x * 10 ** d) / 10 ** d;

  function hojaTablaRodal(r, campo2, titulo2, nombreHoja, tituloHoja) {
    const s = ST();
    const sps = r.porEspecie.filter(e => e.ini.n > 0);
    const cols = sps.slice(0, 3), otras = sps.slice(3);
    const bloques = cols.map(e => ({ nombre: e.nombre, keys: [e.key] }));
    while (bloques.length < 3) bloques.push({ nombre: '', keys: [] });
    bloques.push({ nombre: 'Otras', keys: otras.map(e => e.key) });
    const rows = [], merges = [];
    const nCols = 3 + 4 * (bloques.length + 1);
    rows[0] = [{ v: tituloHoja, s: s.title }];
    merges.push(`A1:${col(Math.min(nCols - 1, 14))}1`);
    rows[2] = [{ v: 'Rodal:', s: s.subtitle }, null, { v: r.id, s: s.subtitle }];
    merges.push('A3:B3', 'C3:D3');
    rows[3] = [{ v: `Tipo forestal: ${r.tipo.nombre} · Estado de desarrollo: ${r.estado.estado || '—'} · Categoría (Ley 20.283): ${r.categoria.cat} · ${r.nP} parcela(s) de ${r.area} m²`, s: s.note }];
    const h5 = [{ v: 'Especie', s: s.header }, { v: null, s: s.header }, { v: null, s: s.header }];
    const h6 = [{ v: 'Rango (cm)                 ≤  Ø  <', s: s.header }, { v: null, s: s.header }, { v: 'Mc', s: s.header }];
    const h7 = [{ v: null, s: s.header }, { v: null, s: s.header }, { v: null, s: s.header }];
    merges.push('A5:C5', 'A6:B7', 'C6:C7');
    [...bloques, { nombre: 'Total' }].forEach((b, i) => {
      const c0 = 3 + i * 4;
      h5[c0] = { v: b.nombre, s: s.header }; h5[c0 + 1] = h5[c0 + 2] = h5[c0 + 3] = { v: null, s: s.header };
      merges.push(`${col(c0)}5:${col(c0 + 3)}5`);
      h6[c0] = { v: 'N (árb./ha)', s: s.header }; h6[c0 + 1] = { v: null, s: s.header }; h6[c0 + 2] = { v: titulo2, s: s.header }; h6[c0 + 3] = { v: null, s: s.header };
      merges.push(`${col(c0)}6:${col(c0 + 1)}6`, `${col(c0 + 2)}6:${col(c0 + 3)}6`);
      ['Ini.', 'Res.', 'Ini.', 'Res.'].forEach((t, k) => { h7[c0 + k] = { v: t, s: s.header }; });
    });
    rows[4] = h5; rows[5] = h6; rows[6] = h7;
    const filas = r.tabla.filter((f, i) => r.tabla.slice(i).some(x => x.tot.ini.n > 0) && r.tabla.slice(0, i + 1).some(x => x.tot.ini.n > 0));
    const dec = campo2 === 'g' ? s.dec3 : s.dec2;
    const sumK = (f, keys, est, c) => keys.reduce((a, k) => a + ((f.sp[k] && f.sp[k][est][c]) || 0), 0);
    filas.forEach(f => {
      const row = [{ v: f.clase.li, s: s.dec1 }, { v: f.clase.ls, s: s.dec1 }, { v: f.clase.mc, s: s.dec1 }];
      bloques.forEach(b => {
        row.push({ v: r2(sumK(f, b.keys, 'ini', 'n'), 2), s: s.dec1 }, { v: r2(sumK(f, b.keys, 'res', 'n'), 2), s: s.dec1 },
          { v: r2(sumK(f, b.keys, 'ini', campo2)), s: dec }, { v: r2(sumK(f, b.keys, 'res', campo2)), s: dec });
      });
      row.push({ v: r2(f.tot.ini.n, 2), s: s.dec1 }, { v: r2(f.tot.res.n, 2), s: s.dec1 }, { v: r2(f.tot.ini[campo2]), s: dec }, { v: r2(f.tot.res[campo2]), s: dec });
      rows.push(row);
    });
    const tot = [{ v: 'Total', s: s.label }, { v: null, s: s.label }, { v: null, s: s.label }];
    const totDec = campo2 === 'g' ? s.totDec3 : s.totDec2;
    const sumE = (keys, est, c) => r.porEspecie.filter(e => keys.includes(e.key)).reduce((a, e) => a + (e[est][c] || 0), 0);
    bloques.forEach(b => { tot.push({ v: r2(sumE(b.keys, 'ini', 'n'), 2), s: s.totDec1 }, { v: r2(sumE(b.keys, 'res', 'n'), 2), s: s.totDec1 }, { v: r2(sumE(b.keys, 'ini', campo2)), s: totDec }, { v: r2(sumE(b.keys, 'res', campo2)), s: totDec }); });
    tot.push({ v: r2(r.tot.ini.n, 2), s: s.totDec1 }, { v: r2(r.tot.res.n, 2), s: s.totDec1 }, { v: r2(r.tot.ini[campo2]), s: totDec }, { v: r2(r.tot.res[campo2]), s: totDec });
    rows.push(tot);
    merges.push(`A${rows.length}:C${rows.length}`);
    const notas = [];
    if (otras.length) notas.push('Otras: ' + otras.map(e => e.nombre).join(', ') + '.');
    if (campo2 === 'v') notas.push('Volumen calculado con las funciones del Compendio de Funciones Dendrométricas del Bosque Nativo (ver hoja "Funciones de volumen") y la altura promedio por especie.' + (r.tot.ini.vCompleto ? '' : ' Hay especies sin función o sin altura: los totales son parciales.'));
    notas.push('Ini. = inicial; Res. = residual después de la intervención inmediata. Mc = marca de clase.');
    rows.push([]);
    notas.forEach(n => rows.push([{ v: n, s: s.note }]));
    return { name: nombreHoja, rows, merges, cols: [7, 7, 6, ...Array(4 * (bloques.length + 1)).fill(8.5)], freeze: [7, 3], landscape: true };
  }

  function hojaResumen(S) {
    const s = ST(); const rows = [[{ v: 'Resumen por rodal', s: s.title }], [{ v: `Región del proyecto: ${(window.NORMATIVA.REGIONES.find(x => x.id === S.config.region) || {}).nombre} · Archivo: ${S.archivo || ''} · Generado: ${new Date().toLocaleString('es-CL')}`, s: s.note }], []];
    const H = ['Rodal', 'Superficie (ha)', 'Parcelas', 'Sup. parcela (m²)', 'Tipo forestal (D.S. 259)', 'Estado de desarrollo (Bases 2.5)', 'Categoría (Ley 20.283)', 'Estructura', 'DMC inicial (cm)', 'DMC residual (cm)', 'Altura media (m)', 'N inicial (árb/ha)', 'N residual (árb/ha)', 'G inicial (m²/ha)', 'G residual (m²/ha)', 'G extraída (%)', 'V inicial (m³/ha)', 'V residual (m³/ha)', 'Actividad a postular', 'Resultado Bases 2026'];
    rows.push(H.map(h => ({ v: h, s: s.header })));
    S.rodales.forEach(id => {
      const r = S.resultados[id];
      rows.push([{ v: id, s: s.text }, { v: r.cfg.superficie === '' ? null : Number(r.cfg.superficie), s: s.dec2 }, { v: r.nP, s: s.int }, { v: r.area, s: s.int }, { v: r.tipo.nombre, s: s.text }, { v: r.estado.estado || '—', s: s.text }, { v: r.categoria.cat, s: s.text }, { v: r.estructura === 'irregular' ? 'Irregular' : 'Regular', s: s.text },
        { v: r2(r.DMCini, 2), s: s.dec1 }, { v: r2(r.DMCres, 2), s: s.dec1 }, { v: r2(r.hProm, 2), s: s.dec1 }, { v: r2(r.tot.ini.n, 1), s: s.int }, { v: r2(r.tot.res.n, 1), s: s.int }, { v: r2(r.tot.ini.g), s: s.dec2 }, { v: r2(r.tot.res.g), s: s.dec2 },
        { v: r.tot.ini.g ? r2(r.tot.ext.g / r.tot.ini.g, 4) : 0, s: s.pct }, { v: r2(r.tot.ini.v, 2), s: s.dec1 }, { v: r2(r.tot.res.v, 2), s: s.dec1 },
        { v: r.bases.actividad ? r.bases.actividad.nombre : '—', s: s.wrap }, { v: r.bases.resultado, s: r.bases.clase === 'ok' ? s.ok : r.bases.clase === 'bad' ? s.bad : s.warn }]);
    });
    rows.push([]);
    rows.push([{ v: 'Los volúmenes marcados como parciales excluyen especies sin función de volumen del compendio o sin altura promedio. Revise la hoja "Especies y conservación".', s: s.note }]);
    return { name: 'Resumen', rows, cols: [8, 10, 9, 10, 22, 18, 20, 11, 10, 10, 10, 11, 11, 10, 10, 10, 10, 10, 34, 18], freeze: [4, 1] };
  }

  function hojaInventario(S) {
    const s = ST(); const rows = [];
    const H = ['Rodal', 'Parcela', 'Especie', 'Dap', 'Especie (D.S. 68/2009)', 'Nombre científico', 'Altura medida (m)', 'Altura promedio usada (m)', 'Clase (cm)', 'g (m²)', 'Función compendio N°', 'v (m³)', 'Fracción residual', 'Extraído', 'Categoría MMA'];
    rows.push(H.map(h => ({ v: h, s: s.header })));
    S.rodales.forEach(id => {
      const r = S.resultados[id];
      r.arboles.forEach(a => {
        const info = S.especiesInfo[a.key] || {};
        rows.push([{ v: isNaN(Number(a.rodal)) ? a.rodal : Number(a.rodal) }, { v: isNaN(Number(a.parcela)) ? a.parcela : Number(a.parcela) }, { v: a.nombre }, { v: a.dap },
          { v: info.nativa ? info.nombre : 'No figura en D.S. 68' }, { v: info.sci || '' }, { v: a.h > 0 ? a.h : null }, { v: r2(r.alt[a.key], 2) },
          { v: `${r.CL.arr[a.cl].li}–${r.CL.arr[a.cl].ls}` }, { v: r2(a.g, 6) }, { v: a.fid || null }, { v: r2(a.v, 5) }, { v: r2(a.res, 4) }, { v: a.res < 1 ? (a.res === 0 ? 'Sí' : 'Parcial') : 'No' }, { v: a.cat.code }]);
      });
    });
    return { name: 'Inventario', rows, cols: [7, 8, 18, 7, 22, 26, 10, 10, 10, 10, 10, 10, 10, 9, 10], freeze: [1, 0] };
  }

  function hojaEstadisticos(S) {
    const s = ST(); const rows = [], merges = [];
    rows[0] = ['Rodal', 'Parcelas (N°)', 't student (95%)', 'Media', null, 'Varianza', null, 'Coeficiente de Variación', null, 'Error de Muestreo', null, 'Volumen (m³/ha)', null].map(v => ({ v, s: s.header }));
    rows[1] = [null, null, null, 'Densidad (arb/ha)', 'Área Basal (m2/ha)', 'Densidad (arb/ha)', 'Área Basal (m2/ha)', 'Densidad', 'Área Basal', 'Densidad', 'Área Basal', 'Media', 'Error de Muestreo'].map(v => ({ v, s: s.header }));
    merges.push('A1:A2', 'B1:B2', 'C1:C2', 'D1:E1', 'F1:G1', 'H1:I1', 'J1:K1', 'L1:M1');
    S.rodales.forEach(id => {
      const r = S.resultados[id]; const st = window.APP_recalcStats(r);
      rows.push([{ v: isNaN(Number(id)) ? id : Number(id), s: s.text }, { v: st.n, s: s.int }, { v: r2(st.t, 4), s: s.dec3 }, { v: r2(st.N.media, 2), s: s.dec1 }, { v: r2(st.G.media, 4), s: s.dec2 }, { v: r2(st.N.var, 2), s: s.dec1 }, { v: r2(st.G.var, 4), s: s.dec3 },
        { v: st.N.cv == null ? null : r2(st.N.cv / 100, 4), s: s.pct }, { v: st.G.cv == null ? null : r2(st.G.cv / 100, 4), s: s.pct }, { v: st.N.ePct == null ? null : r2(st.N.ePct / 100, 4), s: s.pct }, { v: st.G.ePct == null ? null : r2(st.G.ePct / 100, 4), s: s.pct },
        { v: st.V ? r2(st.V.media, 2) : null, s: s.dec1 }, { v: st.V && st.V.ePct != null ? r2(st.V.ePct / 100, 4) : null, s: s.pct }]);
    });
    rows.push([]);
    rows.push([{ v: 'Error de muestreo = t(0,975; n−1) × S / √n, como porcentaje de la media. Varianza calculada con los valores por hectárea de cada parcela (n − 1).', s: s.note }]);
    rows.push([]);
    rows.push(['Rodal', 'Parcela', 'Árboles', 'N (árb/ha)', 'G (m²/ha)', 'V (m³/ha)'].map(v => ({ v, s: s.header })));
    S.rodales.forEach(id => S.resultados[id].parcelas.forEach(p => rows.push([{ v: id, s: s.text }, { v: p.parcela, s: s.text }, { v: p.arboles, s: s.int }, { v: r2(p.n, 2), s: s.dec1 }, { v: r2(p.g), s: s.dec2 }, { v: r2(p.v, 2), s: s.dec1 }])));
    return { name: 'Estadísticos', rows, merges, cols: [9, 11, 11, 13, 13, 13, 13, 12, 12, 12, 12, 11, 12], freeze: [2, 1] };
  }

  function hojaEspecies(S) {
    const s = ST(); const rows = [[{ v: 'Especies por rodal, categoría de conservación y función de volumen', s: s.title }], []];
    const H = ['Rodal', 'Especie', 'Nombre científico (D.S. 68)', 'Categoría (región)', 'Texto del listado MMA', 'Fuente/decreto', 'N ini (árb/ha)', 'N res', 'G ini (m²/ha)', 'G res', 'V ini (m³/ha)', 'V res', 'Altura promedio (m)', 'Función N°', 'Variable de volumen'];
    rows.push(H.map(h => ({ v: h, s: s.header })));
    S.rodales.forEach(id => {
      const r = S.resultados[id];
      r.porEspecie.forEach(e => {
        const f = e.fid ? window.CALC.FN[e.fid] : null;
        rows.push([{ v: id, s: s.text }, { v: e.nombre, s: s.text }, { v: (S.especiesInfo[e.key] || {}).sci || 'No figura en D.S. 68', s: s.text }, { v: e.cat.code + ' · ' + ((window.NORMATIVA.CATEGORIAS[e.cat.code] || {}).nombre || ''), s: e.cat.amenazada ? s.bad : s.text },
          { v: (e.cat.raw || '').replace(/\n/g, ' '), s: s.wrap }, { v: e.cat.fuente || '', s: s.wrap }, { v: r2(e.ini.n, 1), s: s.dec1 }, { v: r2(e.res.n, 1), s: s.dec1 }, { v: r2(e.ini.g), s: s.dec3 }, { v: r2(e.res.g), s: s.dec3 },
          { v: r2(e.ini.v, 3), s: s.dec2 }, { v: r2(e.res.v, 3), s: s.dec2 }, { v: r2(e.h, 2), s: s.dec1 }, { v: f ? f.id : 'Sin función', s: s.text }, { v: f ? f.variable : '', s: s.wrap }]);
      });
    });
    return { name: 'Especies y conservación', rows, cols: [7, 20, 26, 22, 26, 26, 10, 10, 10, 10, 10, 10, 10, 10, 32], freeze: [3, 2] };
  }

  function hojaTipoForestal(S) {
    const s = ST(); const rows = [[{ v: 'Determinación del tipo forestal (D.S. 259 de 1980, art. 19) y estado de desarrollo (Bases Técnicas 2026, punto 2.5)', s: s.title }], []];
    S.rodales.forEach(id => {
      const r = S.resultados[id];
      rows.push([{ v: `Rodal ${id}: ${r.tipo.nombre}`, s: s.subtitle }]);
      rows.push([{ v: r.tipo.motivo + (r.tipo.alternativas.length ? ' También cumple: ' + r.tipo.alternativas.join(', ') + '.' : ''), s: s.note }]);
      rows.push(['Tipo forestal', 'Cumple', 'Detalle'].map(v => ({ v, s: s.header })));
      r.tipo.criterios.forEach(c => rows.push([{ v: c.nombre, s: s.text }, { v: c.cumple ? 'Sí' : 'No', s: c.cumple ? s.ok : s.text }, { v: c.detalle, s: s.wrap }]));
      rows.push([{ v: 'Estado de desarrollo', s: s.label }, { v: r.estado.estado || 'Indeterminado', s: s.label }, { v: `${r.estado.criterio}. DMC inicial ${r2(r.DMCini, 1)} cm; altura media ${r2(r.hProm, 1) ?? '—'} m. Estado residual: ${r.estadoRes.estado || '—'} (DMC ${r2(r.DMCres, 1)} cm).`, s: s.wrap }]);
      rows.push([{ v: 'Categoría de bosque', s: s.label }, { v: r.categoria.cat, s: s.label }, { v: `Ley 20.283 ${r.categoria.art}. ` + (r.categoria.motivosP.concat(r.categoria.motivosCP).join(' ') || 'No presenta condiciones de preservación ni de conservación y protección.'), s: s.wrap }]);
      rows.push([]);
    });
    return { name: 'Tipo forestal', rows, cols: [26, 14, 100] };
  }

  function hojaCumplimiento(S) {
    const s = ST(); const rows = [[{ v: 'Verificación de las Bases Técnicas del Primer Llamado a Concursos 2026 y restricciones de los métodos de corta (D.S. 259)', s: s.title }], []];
    const map = { si: ['Cumple', s.ok], no: ['No cumple', s.bad], obs: ['Observación', s.warn], pend: ['Pendiente', s.warn] };
    S.rodales.forEach(id => {
      const r = S.resultados[id], b = r.bases;
      rows.push([{ v: `Rodal ${id} · ${b.actividad ? b.actividad.nombre : 'Sin actividad'} · Resultado: ${b.resultado}`, s: s.subtitle }]);
      if (b.checks.length) {
        rows.push(['Requisito', 'Estado', 'Detalle', 'Referencia'].map(v => ({ v, s: s.header })));
        b.checks.forEach(c => rows.push([{ v: c.item, s: s.wrap }, { v: map[c.estado][0], s: map[c.estado][1] }, { v: c.detalle, s: s.wrap }, { v: c.ref, s: s.wrap }]));
      } else rows.push([{ v: 'No se seleccionó actividad a postular.', s: s.note }]);
      rows.push([]);
      rows.push([{ v: `Métodos de corta para el tipo forestal ${r.tipo.nombre}`, s: s.subtitle }]);
      if (r.metodos.especial) rows.push([{ v: r.metodos.especial, s: s.bad }]);
      rows.push(['Método (D.S. 259)', 'Aplicable', 'Requisitos de regeneración', 'Restricciones y observaciones'].map(v => ({ v, s: s.header })));
      r.metodos.metodos.forEach(m => rows.push([{ v: `${m.nombre} (art. ${m.art})`, s: s.wrap }, { v: m.aplica === false ? 'No' : m.aplica ? 'Sí' : 'Sin tipo', s: m.aplica === false ? s.bad : m.aplica ? s.ok : s.text }, { v: m.requisitos + (m.maxG ? ` Extracción máxima: ${m.maxG} % del área basal.` : ''), s: s.wrap }, { v: [m.obs.join(' '), m.nota || ''].filter(Boolean).join(' '), s: s.wrap }]));
      rows.push([]);
    });
    return { name: 'Cumplimiento Bases', rows, cols: [34, 13, 80, 30] };
  }

  function hojaFunciones(S) {
    const s = ST(); const rows = [[{ v: 'Funciones de volumen utilizadas (Compendio de Funciones Dendrométricas del Bosque Nativo, Drake, Emanuelli y Acuña, 2003)', s: s.title }], []];
    const usadas = new Map();
    S.rodales.forEach(id => S.resultados[id].porEspecie.forEach(e => { if (e.fid) { const u = usadas.get(e.fid) || new Set(); u.add(e.nombre); usadas.set(e.fid, u); } }));
    const H = ['N°', 'Página', 'Especies de la función', 'Aplicada a', 'Región', 'Estructura', 'Ecuación', 'Variable', 'DLU (cm)', 'Altura', 'Rango diamétrico', 'Rango altura', 'Fuente', 'Año', 'R²', 'Verificación con tabla del compendio', 'Nota'];
    rows.push(H.map(h => ({ v: h, s: s.header })));
    [...usadas.keys()].sort((a, b) => a - b).forEach(fid => {
      const f = window.CALC.FN[fid];
      rows.push([f.id, f.pag, f.especies.join(' - '), [...usadas.get(fid)].join(', '), f.regiones.join(' - '), f.estructura, f.eq, f.variable, f.dlu, f.usaH ? (f.alturaDesc || f.alturaTipo) : 'No usa', f.rangoD, f.rangoH, f.fuente, f.anio, f.r2, f.validacion + (f.valTot ? ` (${f.valOk}/${f.valTot})` : ''), f.nota || ''].map(v => ({ v, s: s.wrap })));
    });
    return { name: 'Funciones de volumen', rows, cols: [6, 7, 22, 22, 10, 13, 50, 30, 8, 20, 14, 12, 18, 7, 8, 16, 30], freeze: [3, 1] };
  }

  function hojaFuentes() {
    const s = ST();
    const t = [
      'Funciones de volumen: Drake, F.; Emanuelli, P.; Acuña, E. (2003). Compendio de Funciones Dendrométricas del Bosque Nativo. CONAF-GTZ.',
      'Especies nativas: D.S. N° 68 de 2009, Ministerio de Agricultura, nómina de especies arbóreas y arbustivas originarias del país.',
      'Categorías de conservación: Ministerio del Medio Ambiente, Nómina de especies según estado de conservación (' + window.CALC.getMMA().fuente + ').',
      'Tipos forestales y métodos de corta: D.S. N° 259 de 1980, Ministerio de Agricultura, arts. 18 a 24 y 30.',
      'Estados de desarrollo y actividades bonificables: CONAF, Bases Técnicas Primer Llamado a Concursos 2026, Ley 20.283; Tabla de Valores D.S. 82/2022.',
      'Categoría de bosque: Ley N° 20.283, art. 2° N° 4, 5 y 6; prohibición de corta de especies clasificadas: art. 19.',
      'Los resultados son una ayuda para el profesional patrocinante y deben revisarse antes de su presentación.'
    ];
    return { name: 'Fuentes', rows: [[{ v: 'Fuentes y criterios', s: s.title }], [], ...t.map(x => [{ v: x, s: s.wrap }])], cols: [120] };
  }

  async function libro(S) {
    const sheets = [hojaResumen(S)];
    S.rodales.forEach(id => {
      const r = S.resultados[id];
      sheets.push(hojaTablaRodal(r, 'g', 'G (m²/ha)', `Tabla rodal ${id}`, '12.3.9 Tabla de rodal inicial y residual, después de la intervención inmediata'));
      sheets.push(hojaTablaRodal(r, 'v', 'V (m³/ha)', `Volumen rodal ${id}`, 'Tabla de volumen inicial y residual, después de la intervención inmediata'));
    });
    sheets.push(hojaInventario(S), hojaEstadisticos(S), hojaEspecies(S), hojaTipoForestal(S), hojaCumplimiento(S), hojaFunciones(S), hojaFuentes());
    return window.XLSXIO.writeXlsx(sheets);
  }

  async function plantilla() {
    const s = ST();
    const inv = { name: 'Inventario', rows: [['Rodal', 'Parcela', 'Especie', 'Dap', 'Altura', 'Extraer', 'Superficie parcela (m2)'].map(v => ({ v, s: s.header })), [1, 1, 'Roble', 23.5, 18.2, 'N', 500], [1, 1, 'Raulí', 17.0, null, 'S', 500], [1, 2, 'Coigüe', 31.2, 22.0, 'N', 500]], cols: [8, 8, 22, 8, 8, 8, 14], freeze: [1, 0] };
    const ins = {
      name: 'Instrucciones', cols: [110], rows: [[{ v: 'Instrucciones para el inventario de parcelas', s: s.title }], [],
        ...['Una fila por árbol. Columnas obligatorias: Rodal, Parcela, Especie y Dap (cm).',
          'Altura (m), opcional: se usa para calcular la altura promedio de cada especie por rodal. Si no se registra, la altura promedio se ingresa en la aplicación.',
          'Extraer, opcional: S/N para los árboles marcados para corta. Si no existe, la extracción se define en la aplicación (por regla o editando la tabla).',
          'Superficie parcela (m2), opcional: si no existe, se usa la superficie indicada en la aplicación.',
          'Especie: nombre común o científico. Se reconoce exclusivamente con la nómina del D.S. N° 68/2009 (ver hoja "Especies D.S. 68").',
          'Para registrar una parcela sin árboles, ingrese una fila con Rodal y Parcela y deje Especie y Dap vacíos.',
          'Las filas de ejemplo de la hoja Inventario deben reemplazarse por los datos del inventario.'].map(t => [{ v: t, s: s.wrap }])]
    };
    const d68 = { name: 'Especies D.S. 68', cols: [32, 60], rows: [['Nombre científico', 'Nombres comunes'].map(v => ({ v, s: s.header })), ...window.DS68_ESPECIES.map(e => [e.s, e.c])], freeze: [1, 0] };
    return window.XLSXIO.writeXlsx([inv, ins, d68]);
  }

  window.EXPORTAR = { libro, plantilla };
})();
