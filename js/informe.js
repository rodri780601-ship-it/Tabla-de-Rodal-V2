/* Informe imprimible / PDF en papel oficio (216 × 330 mm).
   Usa la impresión del navegador ("Guardar como PDF"): @page define tamaño y márgenes,
   y la clase .pg-h define las hojas horizontales. No se fuerzan saltos de página entre secciones:
   sólo se cambia de hoja cuando el contenido siguiente no cabe o cambia la orientación. */
(function () {
  'use strict';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : Number(x).toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
  const MUESTREO = { aleatorio: 'Aleatorio simple', sistematico: 'Sistemático', estratificado: 'Estratificado (cada rodal es un estrato)', conglomerados: 'Por conglomerados', dirigido: 'Dirigido o selectivo (no probabilístico)' };
  const EST = { si: 'Cumple', no: 'No cumple', obs: 'Observación', pend: 'Pendiente' };

  // Tabla de rodal con la estructura de la plantilla (3 especies + Otras + Total), densidad entera
  function tablaRodal(r, c2, titulo2, d2) {
    const sps = r.porEspecie.filter(e => e.ini.n > 0);
    const cols = sps.slice(0, 3), otras = sps.slice(3);
    const bloques = cols.map(e => ({ nombre: e.nombre, keys: [e.key] }));
    while (bloques.length < 3) bloques.push({ nombre: '—', keys: [] });
    bloques.push({ nombre: 'Otras', keys: otras.map(e => e.key) });
    const grupos = [...bloques.map(b => b.keys), sps.map(e => e.key)];
    const NE = window.CALC.densidadEntera(r);
    const filas = r.tabla.filter((f, i) => r.tabla.slice(i).some(x => x.tot.ini.n > 0) && r.tabla.slice(0, i + 1).some(x => x.tot.ini.n > 0));
    const val = (f, keys, est, c) => keys.reduce((a, k) => a + (c === 'n' ? NE[k][est][f.clase.i] : (f.sp[k][est][c] || 0)), 0);
    const tot = grupos.map(() => [0, 0, 0, 0]);
    const fc = (x) => fmt(x, x % 1 ? 1 : 0);
    let h = `<table class="tr"><thead><tr><th colspan="3">Especie</th>${[...bloques, { nombre: 'Total' }].map(b => `<th colspan="4">${esc(b.nombre)}</th>`).join('')}</tr>
      <tr><th colspan="2" rowspan="2">Rango (cm)<br>≤ Ø &lt;</th><th rowspan="2">Mc</th>${grupos.map(() => `<th colspan="2">N (árb./ha)</th><th colspan="2">${titulo2}</th>`).join('')}</tr>
      <tr>${grupos.map(() => '<th>Ini.</th><th>Res.</th><th>Ini.</th><th>Res.</th>').join('')}</tr></thead><tbody>`;
    filas.forEach(f => {
      h += `<tr><td>${fc(f.clase.li)}</td><td>${fc(f.clase.ls)}</td><td>${fc(f.clase.mc)}</td>` + grupos.map((keys, gi) => {
        const v = [val(f, keys, 'ini', 'n'), val(f, keys, 'res', 'n'), val(f, keys, 'ini', c2), val(f, keys, 'res', c2)];
        v.forEach((x, k) => { tot[gi][k] += x; });
        return `<td>${fmt(v[0], 0)}</td><td class="res">${fmt(v[1], 0)}</td><td>${fmt(v[2], d2)}</td><td class="res">${fmt(v[3], d2)}</td>`;
      }).join('') + '</tr>';
    });
    h += `<tr class="tot"><td colspan="3">Total</td>${tot.map(t => `<td>${fmt(t[0], 0)}</td><td>${fmt(t[1], 0)}</td><td>${fmt(t[2], d2)}</td><td>${fmt(t[3], d2)}</td>`).join('')}</tr></tbody></table>`;
    if (otras.length) h += `<p class="nota">Otras: ${otras.map(e => esc(e.nombre)).join(', ')}.</p>`;
    return h;
  }

  function figura(f, mitad) {
    return `<figure class="if ${mitad ? 'mitad' : ''}"><figcaption>${esc(f.titulo)}</figcaption>${f.sub ? `<div class="nota">${esc(f.sub)}</div>` : ''}
      ${f.leyenda ? '<div class="ley"><span><i style="background:#2a78d6"></i>Residual</span><span><i style="background:#eb6834"></i>Extraído</span><span>Barra completa = inicial</span></div>' : ''}
      <div class="svgbox" ${(() => { const m = f.svg.match(/^<svg[^>]*\swidth="(\d+(?:\.\d+)?)"/); return m ? `style="max-width:${Math.round(m[1] * 0.75)}pt"` : ''; })()}>${f.svg}</div></figure>`;
  }

  function construir(S) {
    const reg = (window.NORMATIVA.REGIONES.find(x => x.id === S.config.region) || {}).nombre || '';
    const rs = S.rodales.map(id => S.resultados[id]);
    let h = '';
    // ---------- Portada y resumen (oficio vertical) ----------
    h += `<section class="pg">
      <header class="ihead"><h1>Tabla de rodal y diagnóstico del bosque</h1>
      <p>Inventario: predio <b>${esc((S.antecedentes || {}).predio || '—')}</b>, comuna de <b>${esc((S.antecedentes || {}).comuna || '—')}</b>, región de <b>${esc(reg || '—')}</b> · ${S.rodales.length} rodal(es) · ${S.arboles.length.toLocaleString('es-CL')} árboles</p>
      <p>Tipo de muestreo: <b>${esc(MUESTREO[S.config.muestreo] || '')}</b>${S.config.fecha ? ` · Fecha de muestreo: <b>${esc(S.config.fecha.split('-').reverse().join('-'))}</b>` : ''} · Parcela ${esc(S.config.forma)} de ${fmt(S.config.area, 2)} m² (${esc(window.APP_descDims())}) · Factor de expansión ${fmt(10000 / S.config.area, 2)}</p></header>
      <h2>1. Resumen por rodal</h2>
      <table class="it resumen"><thead><tr><th rowspan="2">Rodal</th><th rowspan="2">Sup. (ha)</th><th rowspan="2">Tipo forestal</th><th rowspan="2">Estado de desa­rrollo</th><th rowspan="2">Categoría de bosque</th><th colspan="2">DMC (cm)</th><th colspan="3">N (árb/ha)</th><th colspan="3">G (m²/ha)</th><th colspan="3">V (m³/ha)</th><th rowspan="2">Actividad inmediata</th></tr><tr><th>Ini.</th><th>Res.</th><th>Ini.</th><th>Ext.</th><th>Res.</th><th>Ini.</th><th>Ext.</th><th>Res.</th><th>Ini.</th><th>Ext.</th><th>Res.</th></tr></thead><tbody>
      ${rs.map(r => { const aj = window.APP_ajustesRodal ? window.APP_ajustesRodal(r) : {}; const c = (v, calc) => calc == null ? `<td>${esc(v)}</td>` : `<td class="ajuste">${esc(v)}<div class="calc">Calculado: ${esc(calc)}</div></td>`;
        return `<tr><td>${esc(r.id)}</td><td class="n">${r.cfg.superficie === '' ? '—' : fmt(Number(r.cfg.superficie), 2)}</td>${c(r.tipo.nombre, aj.tipo)}${c(r.estado.estado || '—', aj.estado)}${c(r.categoria.cat, aj.categoria)}<td class="n">${fmt(r.DMCini)}</td><td class="n">${fmt(r.DMCres)}</td><td class="n">${fmt(r.tot.ini.n, 0)}</td><td class="n">${fmt(r.tot.ext.n, 0)}</td><td class="n">${fmt(r.tot.res.n, 0)}</td><td class="n">${fmt(r.tot.ini.g, 2)}</td><td class="n">${fmt(r.tot.ext.g, 2)}</td><td class="n">${fmt(r.tot.res.g, 2)}</td><td class="n">${r.tot.ini.v == null ? '—' : fmt(r.tot.ini.v, 1)}</td><td class="n">${r.tot.ext.v == null ? '—' : fmt(r.tot.ext.v, 1)}</td><td class="n">${r.tot.res.v == null ? '—' : fmt(r.tot.res.v, 1)}</td><td>${esc(r.bases.actividad ? r.bases.actividad.nombre : '—')}</td></tr>`; }).join('')}
      </tbody></table>
      <p class="nota">Ini. = inicial · Ext. = extracción · Res. = residual.</p>
      ${window.APP_ajustesRodal && rs.some(r => Object.values(window.APP_ajustesRodal(r)).some(Boolean)) ? '<p class="nota"><span class="marca-ajuste"></span> Valor ajustado manualmente por el profesional (difiere del calculado a partir del inventario); debe justificarse en el estudio técnico.</p>' : ''}
      <h2>2. Estadísticos del muestreo</h2>
      <table class="it"><thead><tr><th rowspan="2">Rodal</th><th rowspan="2">Parcelas</th><th rowspan="2">t de Student (95 %)</th><th colspan="2">Media</th><th colspan="2">Desviación estándar</th><th colspan="2">Varianza</th><th colspan="2">Coeficiente de variación</th><th colspan="2">Error de muestreo</th></tr>
      <tr><th>N (árb/ha)</th><th>G (m²/ha)</th><th>N (árb/ha)</th><th>G (m²/ha)</th><th>N (árb/ha)²</th><th>G (m²/ha)²</th><th>N (%)</th><th>G (%)</th><th>N (%)</th><th>G (%)</th></tr></thead><tbody>
      ${rs.map(r => { const s = window.APP_recalcStats(r); return `<tr><td>${esc(r.id)}</td><td class="n">${s.n}</td><td class="n">${fmt(s.t, 3)}</td><td class="n">${fmt(s.N.media, 0)}</td><td class="n">${fmt(s.G.media, 2)}</td><td class="n">${fmt(s.N.s, 1)}</td><td class="n">${fmt(s.G.s, 2)}</td><td class="n">${fmt(s.N.var, 1)}</td><td class="n">${fmt(s.G.var, 3)}</td><td class="n">${fmt(s.N.cv, 1)}</td><td class="n">${fmt(s.G.cv, 1)}</td><td class="n">${fmt(s.N.ePct, 1)}</td><td class="n">${fmt(s.G.ePct, 1)}</td></tr>`; }).join('')}
      ${(() => { const e = window.APP_estratificado(); return e ? `<tr class="tot"><td>Conjunto (estratificado)</td><td class="n">${e.n}</td><td class="n">${fmt(e.t, 3)}</td><td class="n">${fmt(e.N.media, 0)}</td><td class="n">${fmt(e.G.media, 2)}</td><td>—</td><td>—</td><td class="n">${fmt(e.N.var, 2)}</td><td class="n">${fmt(e.G.var, 4)}</td><td>—</td><td>—</td><td class="n">${fmt(e.N.ePct, 1)}</td><td class="n">${fmt(e.G.ePct, 1)}</td></tr>` : ''; })()}
      </tbody></table>
    </section>`;
    const U = S.utm || { huso: '', parcelas: {} };

    rs.forEach((r, ri) => {
      const cap = ri + 3; // capítulos 1 y 2: resumen y estadísticos; un capítulo por rodal
      const { figs } = window.GRAFICOS.figurasRodal(r);
      const F = Object.fromEntries(figs.map(f => [f.id, f]));
      // ---------- Diagnóstico (vertical) ----------
      h += `<section class="pg">
        <h2 class="rodal">${cap}.1 Rodal ${esc(r.id)} · Diagnóstico</h2>
        <table class="kv"><tbody>${(() => { const aj = window.APP_ajustesRodal ? window.APP_ajustesRodal(r) : {}; const m = (x) => x != null ? ' <span class="aj-manual">(ajuste manual del consultor)</span>' : ''; const estAj = r.cfg.estructura && r.cfg.estructura !== 'auto'; return `
          <tr><th>Tipo forestal (D.S. 259)</th><td><b>${esc(r.tipo.nombre)}</b>${m(aj.tipo)}</td></tr>
          <tr><th>Estado de desarrollo</th><td><b>${esc(r.estado.estado || 'Indeterminado')}</b>${m(aj.estado)} · Estado residual: ${esc(r.estadoRes.estado || '—')}</td></tr>
          <tr><th>Categoría de bosque (Ley 20.283)</th><td><b>${esc(r.categoria.cat)}</b>${m(aj.categoria)}</td></tr>
          <tr><th>Estructura / forma de crecimiento</th><td>${r.estructura === 'irregular' ? 'Irregular' : 'Regular'}${m(estAj ? true : null)} · ${r.simpodico ? 'Simpódico' : 'Monopódico'}</td></tr>
          <tr><th>Superficie / pendiente</th><td>${r.cfg.superficie === '' ? '—' : fmt(Number(r.cfg.superficie), 2) + ' ha'} · ${window.CALC.rangoPendiente(r.cfg.pendiente) ? 'pendiente predominante ' + window.CALC.PENDIENTES[window.CALC.rangoPendiente(r.cfg.pendiente)] : 'pendiente predominante no informada'}</td></tr>
          <tr><th>Existencias inicial → residual</th><td>N ${fmt(r.tot.ini.n, 0)} → ${fmt(r.tot.res.n, 0)} árb/ha · G ${fmt(r.tot.ini.g, 2)} → ${fmt(r.tot.res.g, 2)} m²/ha · V ${r.tot.ini.v == null ? '—' : fmt(r.tot.ini.v, 1) + ' → ' + fmt(r.tot.res.v, 1) + ' m³/ha'} · DMC ${fmt(r.DMCini)} → ${fmt(r.DMCres)} cm</td></tr>`; })()}
        </tbody></table>
        <h3>${cap}.1.1 Parámetros por especie</h3>
        ${(() => { const dmc = (e, res) => { let s = 0, q = 0; r.arboles.filter(a => a.key === e.key).forEach(a => { const w = res ? a.res : 1, d = res ? a.dapRes : a.dap; s += w * d * d; q += w; }); return q > 0 ? Math.sqrt(s / q) : null; };
          // como en la tabla de rodal: una columna inicial y una residual (sombreada) por cada parámetro
          const par = (ini, res) => `<td class="n">${ini}</td><td class="n res">${res}</td>`;
          return `<table class="it resumen"><thead><tr><th rowspan="2">Especie</th><th rowspan="2">Nombre científico</th><th colspan="2">DMC (cm)</th><th colspan="2">N (árb/ha)</th><th colspan="2">G (m²/ha)</th><th colspan="2">V (m³/ha)</th><th rowspan="2">Altura (m)</th></tr>
            <tr><th>Ini.</th><th class="res">Res.</th><th>Ini.</th><th class="res">Res.</th><th>Ini.</th><th class="res">Res.</th><th>Ini.</th><th class="res">Res.</th></tr></thead><tbody>${r.porEspecie.map(e => `<tr><td>${esc(e.nombre)}</td><td><i>${esc((S.especiesInfo[e.key] || {}).sci || 'No figura en D.S. 68')}</i></td>${par(fmt(dmc(e)), fmt(dmc(e, true)))}${par(fmt(e.ini.n, 0), fmt(e.res.n, 0))}${par(fmt(e.ini.g, 2), fmt(e.res.g, 2))}${par(e.ini.v == null ? '—' : fmt(e.ini.v, 1), e.res.v == null ? '—' : fmt(e.res.v, 1))}<td class="n">${fmt(e.h, 1)}</td></tr>`).join('')}</tbody></table>
            <p class="nota">Ini. = inicial · Res. = residual (columnas sombreadas).</p>`; })()}
      </section>`;
      // ---------- Tablas de rodal (oficio horizontal) ----------
      // (hoja vertical, igual que el resto: las tablas caben a lo ancho y se evita el salto por cambio de orientación)
      h += `<section class="pg">
        <h2 class="rodal">${cap}.2 Rodal ${esc(r.id)} · 12.3.9 Tabla de rodal inicial y residual, después de la intervención inmediata</h2>
        <div class="bloque">${tablaRodal(r, 'g', 'G (m²/ha)', 2)}</div>
        <h3>${cap}.2.1 Volumen inicial y residual por clase diamétrica (funciones del compendio${r.porEspecie.some(e => (window.CALC.FN[e.fid] || {}).usuario) ? ' y definidas por el usuario' : ''})</h3>
        <div class="bloque">${tablaRodal(r, 'v', 'V (m³/ha)', 2)}</div>
        <p class="nota">${r.simpodico ? 'Bosque simpódico: N = individuos (cepas)/ha; G y V incluyen todos los vástagos; clase según diámetro equivalente √(Σ d²). ' : ''}Densidad en árboles enteros por hectárea: en cada especie los valores por clase se redondean de modo que sumen el total de la especie redondeado. Columnas Res. = residual.${r.tot.ini.vCompleto ? '' : ' Hay especies sin función de volumen o sin altura: volumen parcial.'}</p>
      </section>`;
      // ---------- Gráficos (vertical) ----------
      // Gráficos en una sola grilla de dos columnas, por pares: 1 y 2 (distribución diamétrica y composición por
      // especie), 3a y 3b (por parcela) y 4a y 4b (densidad inicial y residual por clase y especie).
      h += `<section class="pg">
        <h2 class="rodal">${cap}.3 Rodal ${esc(r.id)} · Efectos de la intervención y sobre la estructura por especie</h2>
        <div class="cols2">${figura(F.dd, true)}${figura(F.tc, true)}${figura(F.np, true)}${figura(F.gp, true)}${figura(F.ni, true)}${figura(F.nr, true)}
        </div>
      </section>
      <section class="pg">
        <h2 class="rodal">${cap}.4 Rodal ${esc(r.id)} · Distribución espacial por especie y estado de desarrollo por parcela</h2>
        <div class="cols2">${figura(F.esp, true)}${figura(F.ep, true)}</div>
      </section>`;
    });
    // ---------- Anexo (al final del documento): coordenadas UTM por rodal y funciones de volumen de todas las especies ----------
    const usadas = new Map(); rs.forEach(r => r.porEspecie.forEach(e => { if (e.fid) { const u = usadas.get(e.fid) || new Set(); u.add(e.nombre); usadas.set(e.fid, u); } }));
    const co = (v) => v === '' || v == null ? '—' : fmt(Number(v), 0);
    h += `<section class="pg">
      <h2>Anexo</h2>
      <h3>A.1 Coordenadas UTM de las parcelas de muestreo</h3>
      <p>Datum WGS 84 · Huso ${U.huso ? esc(U.huso) + ' S' : 'no informado'}</p>
      ${rs.map(r => `<div class="bloque"><h3>Rodal ${esc(r.id)}</h3>
      <table class="it"><thead><tr><th>Parcela</th><th>Árboles</th><th>N (árb/ha)</th><th>G (m²/ha)</th><th>Este (m)</th><th>Norte (m)</th></tr></thead><tbody>
      ${r.parcelas.map(p => { const c = U.parcelas[r.id + '|' + p.parcela] || {}; return `<tr><td>${esc(p.parcela)}</td><td class="n">${p.arboles}</td><td class="n">${fmt(p.n, 0)}</td><td class="n">${fmt(p.g, 2)}</td><td class="n">${co(c.e)}</td><td class="n">${co(c.n)}</td></tr>`; }).join('')}
      </tbody></table></div>`).join('')}
      <p class="nota">Densidad y área basal por parcela, de carácter referencial, para apoyar el análisis de la homogeneidad del rodal.</p>
      <h3>A.2 Funciones de volumen utilizadas</h3>
      <table class="it"><thead><tr><th>N°</th><th>Especie</th><th>Región</th><th>Ecuación</th><th>Variable</th><th>Fuente</th></tr></thead><tbody>
      ${[...usadas.keys()].sort(window.CALC.ordenFid).map(id => { const f = window.CALC.FN[id]; return `<tr><td>${f.usuario ? 'Usuario' : f.id}</td><td>${esc([...usadas.get(id)].join(', '))}</td><td>${esc(f.regiones.join(' - '))}</td><td class="eq">${esc(f.eq)}</td><td>${esc(f.variable)}</td><td>${esc(f.fuente)} (${esc(f.anio)})</td></tr>`; }).join('')}
      </tbody></table>
    </section>`;
    return h;
  }

  /* ======================= PDF directo (sin diálogo de impresión) =======================
     El informe se compagina en hojas oficio (216 × 330 mm; las tablas de rodal en oficio horizontal),
     cada hoja se rasteriza a 2× y se arma el PDF con pdf-lib, todo dentro del navegador y sin conexión. */
  const CSS_INFORME = `#informe { font: 9pt/1.35 Arial, "Segoe UI", sans-serif; color: #111; background: #fff; }
#informe .pg { page: auto; }
#informe .pg-h { page: horizontal; }
#informe .salto { break-before: page; }
#informe h1 { font-size: 14pt; margin: 0 0 4pt; color: #1f3d27; }
/* Un solo tamaño (10 pt, negrita) para títulos de secciones, de tablas y de gráficos */
#informe h2, #informe h3, #informe figure.if figcaption { font-size: 10pt; font-weight: bold; color: #1f3d27; letter-spacing: 0; }
#informe h2 { margin: 14pt 0 6pt; break-after: avoid; }
#informe h2.rodal { margin-top: 0; border-bottom: 1.2pt solid #2f5d3a; padding-bottom: 3pt; margin-bottom: 8pt; }
#informe h3 { margin: 12pt 0 5pt; break-after: avoid; }
#informe .ihead { border-bottom: 2pt solid #2f5d3a; padding-bottom: 6pt; margin-bottom: 8pt; }
#informe .ihead p { margin: 2pt 0; }#informe table { border-collapse: collapse; width: 100%; }
#informe thead { display: table-header-group; }
#informe tr, #informe figure, #informe .bloque, #informe .par { break-inside: avoid; }
#informe table.it th, #informe table.it td, #informe table.kv th, #informe table.kv td { border: 0.5pt solid #9a9a9a; padding: 2.5pt 4pt; vertical-align: top; text-align: left; }
#informe table.it th, #informe table.kv th { background: #dde8dc; font-weight: bold; }
#informe table.kv th { width: 30%; }
#informe td.n { text-align: right; white-space: nowrap; }
#informe td.eq { font-size: 7.5pt; }
#informe tr.tot td { font-weight: bold; background: #f0f0ea; }
#informe table.tr { font-size: 7.6pt; }
#informe table.tr th, #informe table.tr td { border: 0.5pt solid #9a9a9a; padding: 1.5pt 3pt; text-align: right; }
#informe table.tr th { background: #dde8dc; text-align: center; }
#informe table.tr td.res { background: #eef3ec; }
#informe table.tr tr.tot td { text-align: right; }
#informe table.tr tr.tot td:first-child { text-align: center; }
#informe .nota { font-size: 7.8pt; color: #444; margin: 3pt 0; }
#informe .aj-manual { font-style: italic; color: #7a5200; }
#informe table.it.resumen { font-size: 7pt; table-layout: auto; }
#informe table.it.resumen th, #informe table.it.resumen td { padding: 1.5pt 2pt; }
#informe table.it.resumen th { text-align: center; vertical-align: middle; }
#informe table.it.resumen td { overflow-wrap: anywhere; }
#informe table.it.resumen td.res, #informe table.it.resumen th.res { background: #eef3ec; }
#informe td.ajuste { background: #fbf0d6; box-shadow: inset 2.5pt 0 0 #9a6700; font-weight: bold; }
#informe td.ajuste .calc { font-weight: normal; font-size: 7pt; color: #555; }
#informe .marca-ajuste { display: inline-block; width: 8pt; height: 8pt; background: #fbf0d6; box-shadow: inset 2pt 0 0 #9a6700; border: 0.5pt solid #9a9a9a; vertical-align: -1pt; margin-right: 3pt; }
#informe figure.if { margin: 6pt 0 10pt; }
#informe figure.if figcaption { margin-bottom: 2pt; }
#informe .svgbox svg { width: 100%; height: auto; display: block; }
#informe .par { display: flex; gap: 8mm; }
#informe .par figure.mitad { flex: 1 1 0; min-width: 0; }
#informe .cols2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 6mm; align-items: start; }
#informe .cols2 figure.if { margin: 0; min-width: 0; }
#informe .cols2 .ley { font-size: 7pt; gap: 6pt; flex-wrap: wrap; }
#informe .cols2 + table, #informe .cols2 + .bloque { margin-top: 10pt; }
#informe table.it.compacta { font-size: 7.5pt; }
#informe table.it.compacta th, #informe table.it.compacta td { padding: 1.2pt 3pt; }
#informe .cols2 figure table.it { font-size: 7pt; margin-top: 4pt; }
#informe .cols2 figure table.it th { white-space: normal; text-align: center; }
#informe .ley { display: flex; gap: 10pt; font-size: 8pt; color: #444; margin: 2pt 0; }
#informe .ley i { display: inline-block; width: 8pt; height: 8pt; border-radius: 2pt; margin-right: 3pt; vertical-align: -1pt; }
#informe .st-no, #informe .res-bad { color: #b42318; font-weight: bold; }
#informe .st-si, #informe .res-ok { color: #1e6b35; font-weight: bold; }
#informe .st-obs, #informe .st-pend, #informe .res-warn { color: #9a6700; font-weight: bold; }
#informe ul.fuentes { padding-left: 14pt; }
#informe .hoja { background: #fff; overflow: hidden; position: relative; box-sizing: border-box; }
#informe .hoja > section { margin: 0; }
#informe .hoja > section > :first-child { margin-top: 0; }
#informe .hoja > section + section { margin-top: 20pt; }`;
  // Las mismas reglas deben regir al medir las hojas (compaginar, en el documento) y al dibujarlas (rasterizar):
  // si no, la compaginación se calcula con otro diseño (p. ej. gráficos apilados en vez de dos columnas) y quedan huecos.
  // También rigen la impresión con el diálogo del navegador.
  (function () { const st = document.createElement('style'); st.id = 'css-informe'; st.textContent = CSS_INFORME; document.head.appendChild(st); })();
  const MM = 96 / 25.4, PT = 72 / 25.4;
  const FORMATOS = {
    v: { pagW: 216, pagH: 330, mT: 16, mR: 14, mB: 16, mL: 14 },
    h: { pagW: 330, pagH: 216, mT: 14, mR: 16, mB: 14, mL: 16 }
  };
  const anchoPx = f => Math.floor((f.pagW - f.mL - f.mR) * MM);
  const altoPx = f => Math.floor((f.pagH - f.mT - f.mB) * MM);

  function compaginar(raiz, secciones) {
    const hojas = [];
    // La hoja en curso se comparte entre secciones: una sección sigue en la misma hoja que la anterior
    // (sin salto de página) mientras quepa y tenga la misma orientación.
    let hoja, cont, colocados, fmtPrev = null;
    secciones.forEach(sec => {
      const fmtKey = sec.classList.contains('pg-h') ? 'h' : 'v';
      const F = FORMATOS[fmtKey], W = anchoPx(F), H = altoPx(F);
      const nueva = (ruta) => {
        hoja = document.createElement('div'); hoja.className = 'hoja';
        hoja.style.width = W + 'px'; hoja.style.height = H + 'px';
        raiz.appendChild(hoja); hojas.push({ el: hoja, fmt: fmtKey });
        cont = hoja; colocados = 0;
        ruta.forEach(anc => { const c = anc.cloneNode(false); cont.appendChild(c); cont = c; });
      };
      const desborda = () => hoja.scrollHeight > H + 1;
      const rutaDe = (c) => { const r = []; let x = c; while (x && x !== hoja) { r.unshift(x); x = x.parentNode; } return r; };
      const esTitulo = (e) => e && e.nodeType === 1 && /^H[1-4]$/.test(e.tagName);
      // pasa a una hoja nueva sin dejar un título solo al pie de la hoja anterior
      function saltar() {
        const prev = cont.lastElementChild, ruta = rutaDe(cont);
        if (esTitulo(prev) && cont.children.length > 1) { cont.removeChild(prev); nueva(ruta); cont.appendChild(prev); }
        else if (esTitulo(prev) && cont.children.length === 1 && cont.parentNode === hoja && hoja.children.length > 1) {
          // la sección recién empezada sólo tiene su título: se lleva completa a la hoja nueva
          const s = cont; hoja.removeChild(s); nueva([]); hoja.appendChild(s); cont = s;
        }
        else nueva(ruta);
      }
      function colocar(nodo) {
        cont.appendChild(nodo);
        if (!desborda()) { if (nodo.nodeType === 1 || nodo.textContent.trim()) colocados++; return; }
        cont.removeChild(nodo);
        // tabla: se divide por filas repitiendo el encabezado
        // (sólo si no cabe ni en una hoja nueva: si cabe, pasa entera a la hoja siguiente)
        if (nodo.tagName === 'TABLE' && nodo.tBodies.length && nodo.tBodies[0].rows.length > 1 && !(colocados > 0 && cabe(nodo))) return dividirTabla(nodo);
        // contenedor con varios hijos: se reparte su contenido
        if (nodo.nodeType === 1 && !/^(FIGURE|SVG|svg|TR|IMG)$/.test(nodo.tagName) && !nodo.classList.contains('par') && nodo.childNodes.length > 1 && !(colocados > 0 && cabe(nodo))) {
          const shell = nodo.cloneNode(false); cont.appendChild(shell); cont = shell;
          [...nodo.childNodes].forEach(colocar);
          cont = cont.parentNode; return;
        }
        if (colocados > 0) {
          // mantener los títulos junto al contenido siguiente
          saltar();
          cont.appendChild(nodo);
          if (!desborda()) { colocados++; return; }
          cont.removeChild(nodo);
          if (nodo.tagName === 'TABLE' && nodo.tBodies.length && nodo.tBodies[0].rows.length > 1) return dividirTabla(nodo);
        }
        // elemento indivisible más alto que la hoja: se reduce para que quepa
        cont.appendChild(nodo);
        const h = nodo.getBoundingClientRect().height, libre = H - (nodo.getBoundingClientRect().top - hoja.getBoundingClientRect().top);
        if (h > 0 && libre > 0) nodo.style.zoom = Math.max(0.3, Math.min(1, libre / h - 0.01));
        colocados++;
      }
      function cabe(nodo) {
        // ¿cabría completo en una hoja nueva?
        const prueba = document.createElement('div'); prueba.className = 'hoja'; prueba.style.width = W + 'px';
        raiz.appendChild(prueba); prueba.appendChild(nodo.cloneNode(true));
        const ok = prueba.scrollHeight <= H; raiz.removeChild(prueba); return ok;
      }
      function dividirTabla(tbl) {
        const filas = [...tbl.tBodies[0].rows];
        const nuevaCasco = () => { const t = tbl.cloneNode(false); [...tbl.children].forEach(ch => { if (ch.tagName !== 'TBODY') t.appendChild(ch.cloneNode(true)); }); t.appendChild(document.createElement('tbody')); cont.appendChild(t); return t; };
        let t = nuevaCasco();
        filas.forEach(fila => {
          t.tBodies[0].appendChild(fila);
          if (!desborda()) return;
          t.tBodies[0].removeChild(fila);
          if (!t.tBodies[0].rows.length) { cont.removeChild(t); saltar(); }
          else nueva(rutaDe(cont));
          t = nuevaCasco(); t.tBodies[0].appendChild(fila);
        });
        colocados++;
      }
      // salto de página sólo al cambiar de orientación (o en la primera sección)
      // tampoco se empieza una sección al pie de una hoja (con menos de 12 % de hoja libre): se pasa a la siguiente
      const usado = () => { const u = hoja && hoja.lastElementChild; return u ? u.getBoundingClientRect().bottom - hoja.getBoundingClientRect().top : 0; };
      const seguir = hoja && fmtPrev === fmtKey && H - usado() >= H * 0.12;
      fmtPrev = fmtKey;
      if (!seguir) nueva([]);
      const casco = sec.cloneNode(false); hoja.appendChild(casco); cont = casco;
      [...sec.childNodes].forEach(n => casco.appendChild(n));
      // tablas o figuras más anchas que la hoja: se reducen para respetar los márgenes
      casco.querySelectorAll('table, .par, figure').forEach(el => {
        if (el.parentElement.closest('table')) return;
        const w = Math.max(el.scrollWidth, el.getBoundingClientRect().width);
        if (w > W + 1) el.style.zoom = (W / w - 0.002).toFixed(4);
      });
      const alto = hoja.scrollHeight;
      if (alto <= H + 1) return;
      // si la sección, sola en su hoja, la excede en poco (≤ 18 %), se reduce levemente para no dejar una hoja casi vacía
      if (!seguir && alto <= H * 1.18) { casco.style.zoom = (H / alto - 0.005).toFixed(4); if (hoja.scrollHeight <= H + 1) return; casco.style.zoom = ''; }
      // si la sección continúa en una hoja compartida y no cabe en el espacio restante, se intenta que quepa completa:
      // primero se compactan sus tablas y, si aún falta poco, se reduce la sección hasta un 85 %
      if (seguir) {
        const tablas = [...casco.children].filter(el => el.tagName === 'TABLE');
        tablas.forEach(t => t.classList.add('compacta'));
        if (hoja.scrollHeight <= H + 1) return;
        const libre = H - (casco.getBoundingClientRect().top - hoja.getBoundingClientRect().top), hS = casco.getBoundingClientRect().height;
        const z = hS > 0 ? libre / hS - 0.005 : 0;
        if (z >= 0.85) { casco.style.zoom = z.toFixed(4); if (hoja.scrollHeight <= H + 1) return; casco.style.zoom = ''; }
        tablas.forEach(t => t.classList.remove('compacta'));
      }
      const hijos = [...casco.childNodes]; hijos.forEach(n => casco.removeChild(n));
      hijos.forEach(colocar);
      // si la sección no alcanzó a poner nada en la hoja compartida, se quita su casco vacío
      if (casco.parentNode && !casco.childNodes.length) casco.remove();
    });
    // quitar hojas vacías
    return hojas.filter(h => h.el.textContent.trim() || h.el.querySelector('svg,img'));
  }

  function rasterizar(hoja, escala) {
    return new Promise((ok, mal) => {
      const W = hoja.offsetWidth, H = hoja.offsetHeight;
      const xml = new XMLSerializer().serializeToString(hoja);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject x="0" y="0" width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" id="informe" style="display:block;width:${W}px;height:${H}px;background:#fff"><style>${CSS_INFORME.replace(/</g, '&lt;')}</style>${xml}</div></foreignObject></svg>`;
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement('canvas'); c.width = Math.round(W * escala); c.height = Math.round(H * escala);
          const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
          c.toBlob(b => b ? b.arrayBuffer().then(ok, mal) : mal(new Error('El navegador no permitió convertir la hoja en imagen.')), 'image/jpeg', 0.9);
        } catch (e) { mal(e); }
      };
      img.onerror = () => mal(new Error('No se pudo dibujar una hoja del informe.'));
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  async function generarPDF(S, progreso) {
    if (!window.PDFLib) throw new Error('No se encontró la librería pdf-lib (lib/pdf-lib.min.js).');
    const raiz = document.createElement('div');
    raiz.id = 'informe-pdf';
    // el CSS del informe usa el selector #informe: se compagina dentro de un contenedor con ese id, fuera de pantalla
    const viejo = document.getElementById('informe'); if (viejo) viejo.id = 'informe-print';
    raiz.id = 'informe';
    raiz.style.cssText = 'display:block;position:fixed;left:-30000px;top:0;width:auto;background:#fff;z-index:-1';
    document.body.appendChild(raiz);
    try {
      const fuente = document.createElement('div'); fuente.innerHTML = construir(S);
      const secciones = [...fuente.children];
      const hojas = compaginar(raiz, secciones);
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdf = await PDFDocument.create();
      pdf.setTitle('Tabla de rodal y diagnóstico del bosque'); pdf.setCreator('Tabla de Rodal · Bosque Nativo'); pdf.setProducer('pdf-lib'); pdf.setCreationDate(new Date());
      const helv = await pdf.embedFont(StandardFonts.Helvetica);
      for (let i = 0; i < hojas.length; i++) {
        if (progreso) progreso(i + 1, hojas.length);
        const F = FORMATOS[hojas[i].fmt];
        const bytes = await rasterizar(hojas[i].el, 2);
        const jpg = await pdf.embedJpg(bytes);
        const pw = F.pagW * PT, ph = F.pagH * PT;
        const page = pdf.addPage([pw, ph]);
        const w = (F.pagW - F.mL - F.mR) * PT, h = (F.pagH - F.mT - F.mB) * PT;
        page.drawImage(jpg, { x: F.mL * PT, y: F.mB * PT, width: w, height: h });
        const pie = 'Página ' + (i + 1) + ' de ' + hojas.length, gris = rgb(0.4, 0.4, 0.4), yPie = F.mB * PT / 2 - 3;
        page.drawText('Tabla de rodal · Bosque nativo', { x: F.mL * PT, y: yPie, size: 8, font: helv, color: gris });
        page.drawText(pie, { x: pw - F.mR * PT - helv.widthOfTextAtSize(pie, 8), y: yPie, size: 8, font: helv, color: gris });
        // encabezado de cada página, a la derecha: versión de la aplicación
        const v = window.APP_VERSION;
        if (v) {
          const enc = 'Tabla de Rodal · Bosque Nativo · Versión ' + v.numero + (v.fecha ? ' (' + v.fecha.split('-').reverse().join('-') + ')' : '');
          page.drawText(enc, { x: pw - F.mR * PT - helv.widthOfTextAtSize(enc, 8), y: ph - F.mT * PT / 2, size: 8, font: helv, color: gris });
        }
      }
      return new Blob([await pdf.save()], { type: 'application/pdf' });
    } finally {
      raiz.remove();
      const v = document.getElementById('informe-print'); if (v) v.id = 'informe';
    }
  }

  function imprimir(S) {
    let el = document.getElementById('informe');
    if (!el) { el = document.createElement('div'); el.id = 'informe'; document.body.appendChild(el); }
    el.innerHTML = construir(S);
    document.body.classList.add('modo-informe');
    const fin = () => { document.body.classList.remove('modo-informe'); window.removeEventListener('afterprint', fin); };
    window.addEventListener('afterprint', fin);
    setTimeout(() => window.print(), 80);
  }

  window.INFORME = { construir, imprimir, generarPDF };
})();
