/* Exportación del libro Excel con todas las hojas de la tabla de rodal. */
(function () {
  'use strict';
  const ST = () => window.XLSXIO.ST;
  const col = (i) => window.XLSXIO.idxToCol(i);
  const MUESTREO = { aleatorio: 'Aleatorio simple', sistematico: 'Sistemático', estratificado: 'Estratificado (cada rodal es un estrato)', conglomerados: 'Por conglomerados', dirigido: 'Dirigido o selectivo (no probabilístico)' };
  const fa = (x) => Number(x).toLocaleString('es-CL', { maximumFractionDigits: 2 });
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
    rows[3] = [{ v: `${r.simpodico ? 'Bosque simpódico · ' : ''}Tipo forestal: ${r.tipo.nombre} · Estado de desarrollo: ${r.estado.estado || '—'} · Categoría (Ley 20.283): ${r.categoria.cat} · ${r.nP} parcela(s) de ${fa(r.area)} m²`, s: s.note }];
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
    // Densidad en árboles enteros por especie y clase; Otras y Total suman los valores redondeados.
    const todas = sps.map(e => e.key);
    const grupos = [...bloques.map(b => b.keys), todas];
    const NE = window.CALC.densidadEntera(r);
    const val = (f, keys, est, c) => keys.reduce((a, k) => a + (f.sp[k] ? (c === 'n' ? NE[k][est][f.clase.i] : (f.sp[k][est][c] || 0)) : 0), 0);
    const totales = grupos.map(() => [0, 0, 0, 0]);
    filas.forEach(f => {
      const row = [{ v: f.clase.li, s: s.dec1 }, { v: f.clase.ls, s: s.dec1 }, { v: f.clase.mc, s: s.dec1 }];
      grupos.forEach((keys, gi) => {
        const v = [val(f, keys, 'ini', 'n'), val(f, keys, 'res', 'n'), val(f, keys, 'ini', campo2), val(f, keys, 'res', campo2)];
        v.forEach((x, k) => { totales[gi][k] += x; });
        row.push({ v: v[0], s: s.int }, { v: v[1], s: s.int }, { v: r2(v[2]), s: dec }, { v: r2(v[3]), s: dec });
      });
      rows.push(row);
    });
    const tot = [{ v: 'Total', s: s.label }, { v: null, s: s.label }, { v: null, s: s.label }];
    const totDec = campo2 === 'g' ? s.totDec3 : s.totDec2;
    totales.forEach(t => { tot.push({ v: t[0], s: s.totInt }, { v: t[1], s: s.totInt }, { v: r2(t[2]), s: totDec }, { v: r2(t[3]), s: totDec }); });
    rows.push(tot);
    merges.push(`A${rows.length}:C${rows.length}`);
    const notas = [];
    if (otras.length) notas.push('Otras: ' + otras.map(e => e.nombre).join(', ') + '.');
    if (campo2 === 'v') notas.push('Volumen calculado con las funciones del Compendio de Funciones Dendrométricas del Bosque Nativo (ver hoja "Funciones de volumen") y la altura promedio por especie.' + (r.tot.ini.vCompleto ? '' : ' Hay especies sin función o sin altura: los totales son parciales.'));
    if (r.simpodico) notas.push('Bosque simpódico: N = individuos (cepas) por hectárea; G y V incluyen todos los vástagos (ramas), cada uno con su DAP; cada individuo se clasifica por su diámetro equivalente √(Σ d²). Vástagos: ' + Math.round(r.tot.ini.tallos) + ' /ha inicial, ' + Math.round(r.tot.res.tallos) + ' /ha residual. DMC calculado ' + (r.dmcPorVastago ? 'por vástago.' : 'por individuo (diámetro equivalente).'));
    notas.push('Ini. = inicial; Res. = residual después de la intervención inmediata. Mc = marca de clase. Densidad en árboles enteros por hectárea: en cada especie los valores por clase se redondean de modo que sumen el total de la especie redondeado; Otras y Total suman esos enteros.');
    rows.push([]);
    notas.forEach(n => rows.push([{ v: n, s: s.note }]));
    return { name: nombreHoja, rows, merges, cols: [7, 7, 6, ...Array(4 * (bloques.length + 1)).fill(8.5)], freeze: [7, 3], landscape: true };
  }

  function hojaResumen(S) {
    const s = ST(); const rows = [[{ v: 'Resumen por rodal', s: s.title }], [{ v: `Región del proyecto: ${(window.NORMATIVA.REGIONES.find(x => x.id === S.config.region) || {}).nombre} · Muestreo: ${MUESTREO[S.config.muestreo] || ''} · Parcela ${S.config.forma} de ${fa(S.config.area)} m² (${window.APP_descDims()}) · Archivo: ${S.archivo || ''} · Generado: ${new Date().toLocaleString('es-CL')}`, s: s.note }], []];
    const H = ['Rodal', 'Superficie (ha)', 'Parcelas', 'Sup. parcela (m²)', 'Forma de crecimiento', 'Vástagos inicial (/ha)', 'Tipo forestal (D.S. 259)', 'Estado de desarrollo (Bases 2.5)', 'Categoría (Ley 20.283)', 'Estructura', 'DMC inicial (cm)', 'DMC residual (cm)', 'Altura media (m)', 'N inicial (árb/ha)', 'N residual (árb/ha)', 'G inicial (m²/ha)', 'G residual (m²/ha)', 'G extraída (%)', 'V inicial (m³/ha)', 'V residual (m³/ha)', 'Actividad a postular', 'Resultado Bases 2026'];
    rows.push(H.map(h => ({ v: h, s: s.header })));
    S.rodales.forEach(id => {
      const r = S.resultados[id];
      rows.push([{ v: id, s: s.text }, { v: r.cfg.superficie === '' ? null : Number(r.cfg.superficie), s: s.dec2 }, { v: r.nP, s: s.int }, { v: r2(r.area, 2), s: s.dec2 }, { v: r.simpodico ? 'Simpódico' : 'Monopódico', s: s.text }, { v: Math.round(r.tot.ini.tallos), s: s.int }, { v: r.tipo.nombre, s: s.text }, { v: r.estado.estado || '—', s: s.text }, { v: r.categoria.cat, s: s.text }, { v: r.estructura === 'irregular' ? 'Irregular' : 'Regular', s: s.text },
        { v: r2(r.DMCini, 2), s: s.dec1 }, { v: r2(r.DMCres, 2), s: s.dec1 }, { v: r2(r.hProm, 2), s: s.dec1 }, { v: Math.round(r.tot.ini.n), s: s.int }, { v: Math.round(r.tot.res.n), s: s.int }, { v: r2(r.tot.ini.g), s: s.dec2 }, { v: r2(r.tot.res.g), s: s.dec2 },
        { v: r.tot.ini.g ? r2(r.tot.ext.g / r.tot.ini.g, 4) : 0, s: s.pct }, { v: r2(r.tot.ini.v, 2), s: s.dec1 }, { v: r2(r.tot.res.v, 2), s: s.dec1 },
        { v: r.bases.actividad ? r.bases.actividad.nombre : '—', s: s.wrap }, { v: r.bases.resultado, s: r.bases.clase === 'ok' ? s.ok : r.bases.clase === 'bad' ? s.bad : s.warn }]);
    });
    rows.push([]);
    rows.push([{ v: 'Los volúmenes marcados como parciales excluyen especies sin función de volumen del compendio o sin altura promedio. Revise la hoja "Especies y conservación".', s: s.note }]);
    return { name: 'Resumen', landscape: true, rows, cols: [8, 10, 9, 10, 13, 11, 22, 18, 20, 11, 10, 10, 10, 11, 11, 10, 10, 10, 10, 10, 34, 18], freeze: [4, 1] };
  }

  function hojaInventario(S) {
    const s = ST(); const rows = [];
    const H = ['Rodal', 'Parcela', 'Árbol', 'Tipo', 'Especie', 'Dap', 'Especie (D.S. 68/2009)', 'Nombre científico', 'Altura promedio usada (m)', 'g vástago (m²)', 'Función compendio N°', 'v vástago (m³)', 'Vástagos del individuo', 'DAP equivalente individuo (cm)', 'Clase del individuo (cm)', 'Extraído', 'Categoría MMA'];
    rows.push(H.map(h => ({ v: h, s: s.header })));
    const numOtxt = (x) => x == null ? null : (isNaN(Number(x)) ? x : Number(x));
    S.rodales.forEach(id => {
      const r = S.resultados[id];
      r.arboles.forEach(a => {
        const info = S.especiesInfo[a.key] || {};
        a.tallos.forEach(t => {
          const extr = t.extraido ? 'Sí' : (a.res === 0 ? 'Sí' : a.res < 1 ? 'Parcial (regla de área basal)' : 'No');
          rows.push([{ v: numOtxt(id) }, { v: numOtxt(a.parcela) }, { v: t.arbolAuto ? null : numOtxt(t.arbol) }, { v: t.tipo || (a.nTallos > 1 ? null : null) }, { v: t.nombre }, { v: t.dap },
            { v: info.nativa ? info.nombre : 'No figura en D.S. 68' }, { v: info.sci || '' }, { v: r2(r.alt[a.key], 2) },
            { v: r2(t.g, 6) }, { v: a.fid || null }, { v: r2(t.v, 5) }, { v: a.nTallos }, { v: r2(a.dap, 2) },
            { v: `${r.CL.arr[a.cl].li}–${r.CL.arr[a.cl].ls}` }, { v: extr }, { v: a.cat.code }]);
        });
      });
    });
    return { name: 'Inventario', rows, cols: [7, 8, 7, 9, 18, 7, 22, 26, 10, 10, 10, 10, 10, 12, 10, 12, 10], freeze: [1, 0] };
  }

  function hojaEstadisticos(S) {
    const s = ST(); const rows = [], merges = [];
    rows[0] = ['Rodal', 'Parcelas (N°)', 't student (95%)', 'Media', null, 'Varianza', null, 'Coeficiente de Variación', null, 'Error de Muestreo', null, 'Volumen (m³/ha)', null, 'Intensidad de muestreo'].map(v => ({ v, s: s.header }));
    rows[1] = [null, null, null, 'Densidad (arb/ha)', 'Área Basal (m2/ha)', 'Densidad (arb/ha)', 'Área Basal (m2/ha)', 'Densidad', 'Área Basal', 'Densidad', 'Área Basal', 'Media', 'Error de Muestreo', null].map(v => ({ v, s: s.header }));
    merges.push('A1:A2', 'B1:B2', 'C1:C2', 'D1:E1', 'F1:G1', 'H1:I1', 'J1:K1', 'L1:M1', 'N1:N2');
    const pc = (x) => x == null ? null : r2(x / 100, 6);
    S.rodales.forEach(id => {
      const r = S.resultados[id]; const st = window.APP_recalcStats(r);
      rows.push([{ v: isNaN(Number(id)) ? id : Number(id), s: s.text }, { v: st.n, s: s.int }, { v: r2(st.t, 4), s: s.dec3 }, { v: r2(st.N.media, 2), s: s.dec1 }, { v: r2(st.G.media, 4), s: s.dec2 }, { v: r2(st.N.var, 2), s: s.dec1 }, { v: r2(st.G.var, 4), s: s.dec3 },
        { v: pc(st.N.cv), s: s.pct }, { v: pc(st.G.cv), s: s.pct }, { v: pc(st.N.ePct), s: s.pct }, { v: pc(st.G.ePct), s: s.pct },
        { v: st.V ? r2(st.V.media, 2) : null, s: s.dec1 }, { v: st.V ? pc(st.V.ePct) : null, s: s.pct }, { v: pc(st.intensidad), s: s.pct }]);
    });
    const est = window.APP_estratificado();
    if (est) rows.push([{ v: 'Conjunto (estratificado)', s: s.label }, { v: est.n, s: s.totInt }, { v: r2(est.t, 4), s: s.totDec3 }, { v: r2(est.N.media, 2), s: s.totDec1 }, { v: r2(est.G.media, 4), s: s.totDec2 }, { v: r2(est.N.var, 4), s: s.totDec2 }, { v: r2(est.G.var, 6), s: s.totDec3 }, { v: null, s: s.label }, { v: null, s: s.label }, { v: pc(est.N.ePct), s: s.pct }, { v: pc(est.G.ePct), s: s.pct }, { v: est.V ? r2(est.V.media, 2) : null, s: s.totDec1 }, { v: est.V ? pc(est.V.ePct) : null, s: s.pct }, { v: pc(est.intensidad), s: s.pct }]);
    rows.push([]);
    rows.push([{ v: `Tipo de muestreo: ${MUESTREO[S.config.muestreo] || ''}. Parcela ${S.config.forma} de ${fa(S.config.area)} m² (${window.APP_descDims()}); factor de expansión ${fa(10000 / S.config.area)}.`, s: s.note }]);
    rows.push([{ v: 'Error de muestreo = t(0,975; n−1) × S / √n, como porcentaje de la media. Varianza calculada con los valores por hectárea de cada parcela (n − 1). Intensidad de muestreo = superficie muestreada / superficie del rodal.', s: s.note }]);
    if (S.config.muestreo === 'sistematico') rows.push([{ v: 'Muestreo sistemático: se aplican los estimadores del muestreo aleatorio simple.', s: s.note }]);
    if (S.config.muestreo === 'dirigido') rows.push([{ v: 'Muestreo dirigido (no probabilístico): los estadísticos son sólo referenciales.', s: s.note }]);
    if (est) rows.push([{ v: 'Conjunto estratificado: media ponderada por la superficie de cada rodal; en "Varianza" se informa la varianza de la media estratificada; t con Σ(nh − 1) grados de libertad.', s: s.note }]);
    rows.push([]);
    rows.push(['Rodal', 'Parcela', 'Árboles', 'N (árb/ha)', 'G (m²/ha)', 'V (m³/ha)'].map(v => ({ v, s: s.header })));
    S.rodales.forEach(id => S.resultados[id].parcelas.forEach(p => rows.push([{ v: id, s: s.text }, { v: p.parcela, s: s.text }, { v: p.arboles, s: s.int }, { v: r2(p.n, 2), s: s.dec1 }, { v: r2(p.g), s: s.dec2 }, { v: r2(p.v, 2), s: s.dec1 }])));
    return { name: 'Estadísticos', landscape: true, rows, merges, cols: [22, 11, 11, 13, 13, 13, 13, 12, 12, 12, 12, 11, 12, 12], freeze: [2, 1] };
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
          { v: (e.cat.raw || '').replace(/\n/g, ' '), s: s.wrap }, { v: e.cat.fuente || '', s: s.wrap }, { v: Math.round(e.ini.n), s: s.int }, { v: Math.round(e.res.n), s: s.int }, { v: r2(e.ini.g), s: s.dec3 }, { v: r2(e.res.g), s: s.dec3 },
          { v: r2(e.ini.v, 3), s: s.dec2 }, { v: r2(e.res.v, 3), s: s.dec2 }, { v: r2(e.h, 2), s: s.dec1 }, { v: f ? f.id : 'Sin función', s: s.text }, { v: f ? f.variable : '', s: s.wrap }]);
      });
    });
    return { name: 'Especies y conservación', landscape: true, rows, cols: [7, 20, 26, 22, 26, 26, 10, 10, 10, 10, 10, 10, 10, 10, 32], freeze: [3, 2] };
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
    return { name: 'Cumplimiento Bases', landscape: true, rows, cols: [34, 13, 80, 30] };
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
    return { name: 'Funciones de volumen', landscape: true, rows, cols: [6, 7, 22, 22, 10, 13, 50, 30, 8, 20, 14, 12, 18, 7, 8, 16, 30], freeze: [3, 1] };
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

  /* Hoja con todos los gráficos de cada rodal (imágenes PNG), paginada para papel oficio vertical. */
  async function hojaGraficos(S) {
    const s = ST();
    const rows = [], images = [], breaks = [], merges = [], heights = {};
    const ROW_PX = 20, ANCHO = 690, ALTO_PAG = 1220; // filas fijas de 15 pt (20 px); columnas ≤ 720 px → escala de impresión 1 // alto útil aproximado de una hoja oficio en px (96 ppp)
    let fila = 0, usado = 0;
    const nuevaPagina = () => { if (fila > 0) { breaks.push(fila); usado = 0; } };
    const texto = (v, st) => { rows[fila] = [null, { v, s: st }]; fila++; usado += ROW_PX; };
    for (let k = 0; k < S.rodales.length; k++) {
      const id = S.rodales[k], r = S.resultados[id];
      nuevaPagina();
      texto(`Gráficos · Rodal ${id}`, s.title);
      texto(`${r.tipo.nombre} · ${r.estado.estado || '—'} · Intervención: ${r.bases.actividad && r.bases.actividad.id !== 'NINGUNA' ? r.bases.actividad.nombre : 'no definida'} · Extracción ${Math.round(r.tot.ext.n)} árb/ha y ${r2(r.tot.ext.g, 2)} m²/ha`, s.normal);
      fila++; usado += ROW_PX;
      const { figs, datos } = window.GRAFICOS.figurasRodal(r);
      for (const f of figs) {
        const png = await window.GRAFICOS.svgAPng(f.svg, f.titulo, f.leyenda);
        const esc = Math.min(1, ANCHO / png.w), w = png.w * esc, h = png.h * esc;
        const filasImg = Math.ceil(h / ROW_PX) + 1;
        if (usado + (filasImg + 2) * ROW_PX > ALTO_PAG && usado > 3 * ROW_PX) { breaks.push(fila); usado = 0; }
        if (f.sub) texto(f.sub, s.normal);
        images.push({ data: png.bytes, row: fila, col: 1, w, h, nombre: `Rodal ${id} - ${f.titulo}` });
        fila += filasImg; usado += filasImg * ROW_PX;
        if (f.id === 'esp') {
          // tabla de dispersión bajo el mapa de calor
          const H = ['Especie', 'Árboles', 'Frec. (%)', 'Media/ parcela', 'Varianza', 'S²/x̄', 'Morisita', 'χ²', 'Límites χ² 95 %', 'Distribución'];
          const need = (datos.disp.length + 3) * ROW_PX;
          if (usado + need > ALTO_PAG) { breaks.push(fila); usado = 0; }
          rows[fila] = [null, { v: 'Índices de dispersión espacial por especie', s: s.subtitle }]; fila++;
          rows[fila] = [null, ...H.map(v => ({ v, s: s.header }))]; fila++;
          datos.disp.forEach(x => {
            const d = x.d;
            rows[fila] = [null, { v: x.nombre, s: s.text }, { v: d.Nt, s: s.int }, { v: d.presencia == null ? null : Math.round(d.presencia), s: s.int }, { v: d.media == null ? null : r2(d.media, 2), s: s.dec2 }, { v: d.var == null ? null : r2(d.var, 2), s: s.dec2 }, { v: d.id == null ? null : r2(d.id, 2), s: s.dec2 }, { v: d.mor == null ? null : r2(d.mor, 2), s: s.dec2 }, { v: d.chi == null ? null : r2(d.chi, 2), s: s.dec2 }, { v: d.lo == null ? '—' : `${r2(d.lo, 1)} – ${r2(d.hi, 1)}`, s: s.text }, { v: d.patron, s: s.text }]; fila++;
          });
          heights[fila - datos.disp.length - 1] = 30; usado += 10;
          usado += need;
        }
        fila++; usado += ROW_PX;
      }
    }
    for (let i = 0; i <= fila + 2; i++) if (!heights[i]) heights[i] = 15;
    return { name: 'Gráficos', rows, merges, images, breaks, heights, cols: [2, 14, 7, 9, 8, 8, 8, 8, 8, 10, 12] };
  }

  async function libro(S) {
    const sheets = [hojaResumen(S)];
    S.rodales.forEach(id => {
      const r = S.resultados[id];
      sheets.push(hojaTablaRodal(r, 'g', 'G (m²/ha)', `Tabla rodal ${id}`, '12.3.9 Tabla de rodal inicial y residual, después de la intervención inmediata'));
      sheets.push(hojaTablaRodal(r, 'v', 'V (m³/ha)', `Volumen rodal ${id}`, 'Tabla de volumen inicial y residual, después de la intervención inmediata'));
    });
    sheets.push(await hojaGraficos(S));
    sheets.push(hojaInventario(S), hojaEstadisticos(S), hojaEspecies(S), hojaTipoForestal(S), hojaCumplimiento(S), hojaFunciones(S), hojaFuentes());
    return window.XLSXIO.writeXlsx(sheets);
  }

  async function plantilla() {
    const s = ST();
    const inv = { name: 'Inventario', rows: [['Rodal', 'Parcela', 'Especie', 'Dap', 'Extraer'].map(v => ({ v, s: s.header }))], cols: [8, 8, 34, 8, 8], freeze: [1, 0] };
    const ins = {
      name: 'Instrucciones', cols: [110], rows: [[{ v: 'Instrucciones para el inventario de parcelas', s: s.title }], [],
        ...['Una fila por árbol. Columnas obligatorias: Rodal, Parcela, Especie y Dap (cm).',
          'La altura promedio de cada especie se ingresa en la aplicación (sección 2 · Especies y volumen).',
          'Extraer, opcional: S/N para los árboles marcados para corta. Si no existe, la extracción se define en la aplicación (por regla o editando la tabla).',
          'La superficie y forma de la parcela y el tipo de muestreo se definen en los parámetros generales de la aplicación.',
          'Especie: nombre común o científico. Se reconoce exclusivamente con la nómina del D.S. N° 68/2009 (ver hoja "Especies D.S. 68").',
          'Para registrar una parcela sin árboles, ingrese una fila con Rodal y Parcela y deje Especie y Dap vacíos.',
          'Ejemplo de fila: 1 | 1 | Roble (Nothofagus obliqua) | 23,5 | N'].map(t => [{ v: t, s: s.wrap }])]
    };
    const d68 = { name: 'Especies D.S. 68', cols: [32, 60], rows: [['Nombre para el inventario', 'Nombres comunes (D.S. 68/2009)'].map(v => ({ v, s: s.header })), ...window.DS68_ESPECIES.map(e => [(window.CALC.CAT.especies[e.s] || {}).nombreComun + ' (' + e.s + ')', e.c])], freeze: [1, 0] };
    return window.XLSXIO.writeXlsx([inv, ins, d68]);
  }

  window.EXPORTAR = { libro, plantilla };
})();
