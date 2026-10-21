/* Informe imprimible / PDF en papel oficio (216 × 330 mm).
   Usa la impresión del navegador ("Guardar como PDF"): @page define tamaño y márgenes,
   y las clases .salto / .pg-h controlan los saltos de página y la orientación. */
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
    const hoy = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
    let h = '';
    // ---------- Portada y resumen (oficio vertical) ----------
    h += `<section class="pg">
      <header class="ihead"><h1>Tabla de rodal y diagnóstico del bosque</h1>
      <p>Región: <b>${esc(reg)}</b> · Tipo de muestreo: <b>${esc(MUESTREO[S.config.muestreo] || '')}</b> · Parcela ${esc(S.config.forma)} de ${fmt(S.config.area, 2)} m² (${esc(window.APP_descDims())}) · Factor de expansión ${fmt(10000 / S.config.area, 2)}</p>
      <p>Inventario: ${esc(S.archivo || '')} · ${S.rodales.length} rodal(es) · ${S.arboles.length.toLocaleString('es-CL')} árboles · Emitido el ${esc(hoy)}</p></header>
      <h2>Resumen por rodal</h2>
      <table class="it"><thead><tr><th>Rodal</th><th>Sup. (ha)</th><th>Tipo forestal</th><th>Estado de desarrollo</th><th>Categoría (Ley 20.283)</th><th>DMC ini/res (cm)</th><th>N ini/res (árb/ha)</th><th>G ini/res (m²/ha)</th><th>V ini/res (m³/ha)</th><th>Actividad</th><th>Bases 2026</th></tr></thead><tbody>
      ${rs.map(r => `<tr><td>${esc(r.id)}</td><td class="n">${r.cfg.superficie === '' ? '—' : fmt(Number(r.cfg.superficie), 2)}</td><td>${esc(r.tipo.nombre)}</td><td>${esc(r.estado.estado || '—')}</td><td>${esc(r.categoria.cat)}</td><td class="n">${fmt(r.DMCini)} / ${fmt(r.DMCres)}</td><td class="n">${fmt(r.tot.ini.n, 0)} / ${fmt(r.tot.res.n, 0)}</td><td class="n">${fmt(r.tot.ini.g, 2)} / ${fmt(r.tot.res.g, 2)}</td><td class="n">${r.tot.ini.v == null ? '—' : fmt(r.tot.ini.v, 1) + ' / ' + fmt(r.tot.res.v, 1)}</td><td>${esc(r.bases.actividad ? r.bases.actividad.nombre : '—')}</td><td><b>${esc(r.bases.resultado)}</b></td></tr>`).join('')}
      </tbody></table>
      <h2>Estadísticos del muestreo</h2>
      <table class="it"><thead><tr><th rowspan="2">Rodal</th><th rowspan="2">Parcelas</th><th rowspan="2">Intensidad (%)</th><th rowspan="2">t (95 %)</th><th colspan="2">Media</th><th colspan="2">Varianza</th><th colspan="2">CV (%)</th><th colspan="2">Error de muestreo (%)</th><th colspan="2">Volumen</th></tr>
      <tr><th>N (árb/ha)</th><th>G (m²/ha)</th><th>N</th><th>G</th><th>N</th><th>G</th><th>N</th><th>G</th><th>Media</th><th>E (%)</th></tr></thead><tbody>
      ${rs.map(r => { const s = window.APP_recalcStats(r); return `<tr><td>${esc(r.id)}</td><td class="n">${s.n}</td><td class="n">${s.intensidad == null ? '—' : fmt(s.intensidad, 2)}</td><td class="n">${fmt(s.t, 3)}</td><td class="n">${fmt(s.N.media, 0)}</td><td class="n">${fmt(s.G.media, 2)}</td><td class="n">${fmt(s.N.var, 1)}</td><td class="n">${fmt(s.G.var, 3)}</td><td class="n">${fmt(s.N.cv, 1)}</td><td class="n">${fmt(s.G.cv, 1)}</td><td class="n">${fmt(s.N.ePct, 1)}</td><td class="n">${fmt(s.G.ePct, 1)}</td><td class="n">${s.V ? fmt(s.V.media, 1) : '—'}</td><td class="n">${s.V ? fmt(s.V.ePct, 1) : '—'}</td></tr>`; }).join('')}
      ${(() => { const e = window.APP_estratificado(); return e ? `<tr class="tot"><td>Conjunto (estratificado)</td><td class="n">${e.n}</td><td class="n">${fmt(e.intensidad, 2)}</td><td class="n">${fmt(e.t, 3)}</td><td class="n">${fmt(e.N.media, 0)}</td><td class="n">${fmt(e.G.media, 2)}</td><td class="n">${fmt(e.N.var, 2)}</td><td class="n">${fmt(e.G.var, 4)}</td><td>—</td><td>—</td><td class="n">${fmt(e.N.ePct, 1)}</td><td class="n">${fmt(e.G.ePct, 1)}</td><td class="n">${e.V ? fmt(e.V.media, 1) : '—'}</td><td class="n">${e.V ? fmt(e.V.ePct, 1) : '—'}</td></tr>` : ''; })()}
      </tbody></table>
      <p class="nota">Error de muestreo = t(0,975; n−1) × S / √n, en porcentaje de la media. Intensidad de muestreo = superficie muestreada / superficie del rodal.</p>
    </section>`;

    rs.forEach(r => {
      const { figs, datos } = window.GRAFICOS.figurasRodal(r);
      const F = Object.fromEntries(figs.map(f => [f.id, f]));
      // ---------- Diagnóstico (vertical) ----------
      h += `<section class="pg salto">
        <h2 class="rodal">Rodal ${esc(r.id)} · Diagnóstico</h2>
        <table class="kv"><tbody>
          <tr><th>Tipo forestal (D.S. 259)</th><td><b>${esc(r.tipo.nombre)}</b> — ${esc(r.tipo.motivo)}${r.tipo.alternativas.length ? ' También cumple: ' + esc(r.tipo.alternativas.join(', ')) + '.' : ''}</td></tr>
          <tr><th>Estado de desarrollo (Bases 2.5)</th><td><b>${esc(r.estado.estado || 'Indeterminado')}</b> — ${esc(r.estado.criterio)}. Estado residual: ${esc(r.estadoRes.estado || '—')}.</td></tr>
          <tr><th>Categoría de bosque (Ley 20.283)</th><td><b>${esc(r.categoria.cat)}</b> — ${esc(r.categoria.art)}. ${esc(r.categoria.motivosP.concat(r.categoria.motivosCP).join(' ') || 'No presenta condiciones de preservación ni de conservación y protección.')}</td></tr>
          <tr><th>Estructura / forma de crecimiento</th><td>${r.estructura === 'irregular' ? 'Irregular' : 'Regular'} · ${r.simpodico ? `Simpódico: densidad en individuos (cepas); área basal con todos los vástagos (${fmt(r.tot.ini.tallos, 0)} vástagos/ha, ${fmt(r.tot.ini.n ? r.tot.ini.tallos / r.tot.ini.n : 0, 1)} por individuo)` : 'Monopódico'}</td></tr>
          <tr><th>Superficie / pendiente</th><td>${r.cfg.superficie === '' ? '—' : fmt(Number(r.cfg.superficie), 2) + ' ha'} · ${r.cfg.pendiente === '' ? 'pendiente no informada' : 'pendiente ' + fmt(Number(r.cfg.pendiente), 0) + ' %'}</td></tr>
          <tr><th>Existencias inicial → residual</th><td>N ${fmt(r.tot.ini.n, 0)} → ${fmt(r.tot.res.n, 0)} árb/ha · G ${fmt(r.tot.ini.g, 2)} → ${fmt(r.tot.res.g, 2)} m²/ha · V ${r.tot.ini.v == null ? '—' : fmt(r.tot.ini.v, 1) + ' → ' + fmt(r.tot.res.v, 1) + ' m³/ha'} · DMC ${fmt(r.DMCini)} → ${fmt(r.DMCres)} cm${r.simpodico ? (r.dmcPorVastago ? ' (calculado por vástago)' : ' (calculado por individuo, diámetro equivalente)') : ''}</td></tr>
        </tbody></table>
        <h3>Especies, categoría de conservación y volumen</h3>
        <table class="it"><thead><tr><th>Especie</th><th>Nombre científico</th><th>Categoría</th><th>N ini/res</th><th>G ini/res</th><th>V ini/res</th><th>Altura (m)</th><th>Función</th></tr></thead><tbody>${r.porEspecie.map(e => `<tr><td>${esc(e.nombre)}</td><td><i>${esc((S.especiesInfo[e.key] || {}).sci || 'No figura en D.S. 68')}</i></td><td>${esc(e.cat.code)}</td><td class="n">${fmt(e.ini.n, 0)} / ${fmt(e.res.n, 0)}</td><td class="n">${fmt(e.ini.g, 2)} / ${fmt(e.res.g, 2)}</td><td class="n">${e.ini.v == null ? '—' : fmt(e.ini.v, 1) + ' / ' + fmt(e.res.v, 1)}</td><td class="n">${fmt(e.h, 1)}</td><td>${esc(window.CALC.etiquetaFid(e.fid))}</td></tr>`).join('')}</tbody></table>
      </section>`;
      // ---------- Tablas de rodal (oficio horizontal) ----------
      h += `<section class="pg-h salto">
        <h2 class="rodal">Rodal ${esc(r.id)} · 12.3.9 Tabla de rodal inicial y residual, después de la intervención inmediata</h2>
        <div class="bloque">${tablaRodal(r, 'g', 'G (m²/ha)', 2)}</div>
        <h3>Volumen inicial y residual por clase diamétrica (funciones del compendio${r.porEspecie.some(e => (window.CALC.FN[e.fid] || {}).usuario) ? ' y definidas por el usuario' : ''})</h3>
        <div class="bloque">${tablaRodal(r, 'v', 'V (m³/ha)', 2)}</div>
        <p class="nota">${r.simpodico ? 'Bosque simpódico: N = individuos (cepas)/ha; G y V incluyen todos los vástagos; clase según diámetro equivalente √(Σ d²). ' : ''}Densidad en árboles enteros por hectárea: en cada especie los valores por clase se redondean de modo que sumen el total de la especie redondeado. Columnas Res. = residual.${r.tot.ini.vCompleto ? '' : ' Hay especies sin función de volumen o sin altura: volumen parcial.'}</p>
      </section>`;
      // ---------- Gráficos (vertical) ----------
      h += `<section class="pg salto">
        <h2 class="rodal">Rodal ${esc(r.id)} · Efectos de la intervención</h2>
        ${figura(F.dd)}
        ${figura(F.np)}
        ${figura(F.gp)}
      </section>
      <section class="pg salto">
        <h2 class="rodal">Rodal ${esc(r.id)} · Efectos sobre la estructura por especie</h2>
        ${figura(F.ne)}
        ${figura(F.ge)}
        <table class="it bloque"><thead><tr><th>Especie</th><th>N ini (%)</th><th>N res (%)</th><th>G ini (%)</th><th>G res (%)</th><th>DMC ini (cm)</th><th>DMC res (cm)</th></tr></thead><tbody>${datos.estructura.map(e => `<tr><td>${esc(e.nombre)}</td><td class="n">${fmt(e.nIni)}</td><td class="n">${fmt(e.nRes)}</td><td class="n">${fmt(e.gIni)}</td><td class="n">${fmt(e.gRes)}</td><td class="n">${fmt(e.dmcIni)}</td><td class="n">${fmt(e.dmcRes)}</td></tr>`).join('')}</tbody></table>
      </section>
      <section class="pg salto">
        <h2 class="rodal">Rodal ${esc(r.id)} · Distribución espacial por especie</h2>
        ${figura(F.esp)}
        <table class="it bloque"><thead><tr><th>Especie</th><th>Árboles</th><th>Frecuencia (%)</th><th>Media/parcela</th><th>Varianza</th><th>S²/x̄</th><th>Morisita</th><th>χ² (límites 95 %)</th><th>Distribución</th></tr></thead><tbody>${datos.disp.map(({ nombre, d }) => `<tr><td>${esc(nombre)}</td><td class="n">${d.Nt}</td><td class="n">${d.presencia == null ? '—' : fmt(d.presencia, 0)}</td><td class="n">${d.media == null ? '—' : fmt(d.media, 2)}</td><td class="n">${d.var == null ? '—' : fmt(d.var, 2)}</td><td class="n">${d.id == null ? '—' : fmt(d.id, 2)}</td><td class="n">${d.mor == null ? '—' : fmt(d.mor, 2)}</td><td class="n">${d.chi == null ? '—' : fmt(d.chi, 2) + ' (' + fmt(d.lo, 1) + '–' + fmt(d.hi, 1) + ')'}</td><td>${esc(d.patron)}</td></tr>`).join('')}</tbody></table>
        <p class="nota">Distribución de los individuos entre las parcelas del rodal (el inventario no registra coordenadas). Prueba χ² del índice de dispersión al 95 %: sobre el límite superior, agregada; bajo el inferior, regular; entre ambos, aleatoria.</p>
      </section>`;
    });
    // ---------- Fuentes ----------
    const usadas = new Map(); rs.forEach(r => r.porEspecie.forEach(e => { if (e.fid) { const u = usadas.get(e.fid) || new Set(); u.add(e.nombre); usadas.set(e.fid, u); } }));
    h += `<section class="pg salto"><h2>Funciones de volumen utilizadas</h2>
      <table class="it"><thead><tr><th>N°</th><th>Especies de la función</th><th>Aplicada a</th><th>Región</th><th>Ecuación</th><th>Variable</th><th>Fuente</th></tr></thead><tbody>
      ${[...usadas.keys()].sort(window.CALC.ordenFid).map(id => { const f = window.CALC.FN[id]; return `<tr><td>${f.usuario ? 'Usuario' : f.id}</td><td>${esc(f.especies.join(' - '))}</td><td>${esc([...usadas.get(id)].join(', '))}</td><td>${esc(f.regiones.join(' - '))}</td><td class="eq">${esc(f.eq)}</td><td>${esc(f.variable)}</td><td>${esc(f.fuente)} (${esc(f.anio)})</td></tr>`; }).join('')}
      </tbody></table>
      <h2>Fuentes</h2><ul class="fuentes">
        <li>Funciones de volumen: Drake, F.; Emanuelli, P.; Acuña, E. (2003). Compendio de Funciones Dendrométricas del Bosque Nativo. CONAF-GTZ.</li>
        <li>Especies nativas: D.S. N° 68 de 2009, Ministerio de Agricultura.</li>
        <li>Categorías de conservación: Ministerio del Medio Ambiente, ${esc(window.CALC.getMMA().fuente)}.</li>
        <li>Tipos forestales y métodos de corta: D.S. N° 259 de 1980, Ministerio de Agricultura.</li>
        <li>Estados de desarrollo y actividades: CONAF, Bases Técnicas Primer Llamado a Concursos 2026; Tabla de Valores D.S. 82/2022.</li>
        <li>Categoría de bosque y protección de especies clasificadas: Ley N° 20.283, art. 2° y art. 19.</li>
      </ul><p class="nota">Los resultados son una ayuda para el profesional y deben revisarse antes de su presentación.</p></section>`;
    return h;
  }

  /* ======================= PDF directo (sin diálogo de impresión) =======================
     El informe se compagina en hojas oficio (216 × 330 mm; las tablas de rodal en oficio horizontal),
     cada hoja se rasteriza a 2× y se arma el PDF con pdf-lib, todo dentro del navegador y sin conexión. */
  const CSS_INFORME = `#informe { font: 9pt/1.35 Arial, "Segoe UI", sans-serif; color: #111; background: #fff; }
#informe .pg { page: auto; }
#informe .pg-h { page: horizontal; }
#informe .salto { break-before: page; }
#informe h1 { font-size: 16pt; margin: 0 0 4pt; color: #1f3d27; }
#informe h2 { font-size: 12pt; margin: 12pt 0 5pt; color: #1f3d27; break-after: avoid; }
#informe h2.rodal { margin-top: 0; border-bottom: 1.5pt solid #2f5d3a; padding-bottom: 3pt; }
#informe h3 { font-size: 10pt; margin: 10pt 0 4pt; break-after: avoid; }
#informe .ihead { border-bottom: 2pt solid #2f5d3a; padding-bottom: 6pt; margin-bottom: 8pt; }
#informe .ihead p { margin: 2pt 0; }
#informe table { border-collapse: collapse; width: 100%; }
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
#informe figure.if { margin: 6pt 0 10pt; }
#informe figure.if figcaption { font-weight: bold; font-size: 9.5pt; }
#informe .svgbox svg { width: 100%; height: auto; display: block; }
#informe .par { display: flex; gap: 8mm; }
#informe .par figure.mitad { flex: 1 1 0; min-width: 0; }
#informe .ley { display: flex; gap: 10pt; font-size: 8pt; color: #444; margin: 2pt 0; }
#informe .ley i { display: inline-block; width: 8pt; height: 8pt; border-radius: 2pt; margin-right: 3pt; vertical-align: -1pt; }
#informe .st-no, #informe .res-bad { color: #b42318; font-weight: bold; }
#informe .st-si, #informe .res-ok { color: #1e6b35; font-weight: bold; }
#informe .st-obs, #informe .st-pend, #informe .res-warn { color: #9a6700; font-weight: bold; }
#informe ul.fuentes { padding-left: 14pt; }
#informe .hoja { background: #fff; overflow: hidden; position: relative; box-sizing: border-box; }
#informe .hoja > section { margin: 0; }
#informe .hoja > section > :first-child { margin-top: 0; }`;
  const MM = 96 / 25.4, PT = 72 / 25.4;
  const FORMATOS = {
    v: { pagW: 216, pagH: 330, mT: 16, mR: 14, mB: 16, mL: 14 },
    h: { pagW: 330, pagH: 216, mT: 14, mR: 16, mB: 14, mL: 16 }
  };
  const anchoPx = f => Math.floor((f.pagW - f.mL - f.mR) * MM);
  const altoPx = f => Math.floor((f.pagH - f.mT - f.mB) * MM);

  function compaginar(raiz, secciones) {
    const hojas = [];
    secciones.forEach(sec => {
      const fmtKey = sec.classList.contains('pg-h') ? 'h' : 'v';
      const F = FORMATOS[fmtKey], W = anchoPx(F), H = altoPx(F);
      let hoja, cont, colocados;
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
      function colocar(nodo) {
        cont.appendChild(nodo);
        if (!desborda()) { if (nodo.nodeType === 1 || nodo.textContent.trim()) colocados++; return; }
        cont.removeChild(nodo);
        // tabla: se divide por filas repitiendo el encabezado
        if (nodo.tagName === 'TABLE' && nodo.tBodies.length && nodo.tBodies[0].rows.length > 1) return dividirTabla(nodo);
        // contenedor con varios hijos: se reparte su contenido
        if (nodo.nodeType === 1 && !/^(FIGURE|SVG|svg|TR|IMG)$/.test(nodo.tagName) && !nodo.classList.contains('par') && nodo.childNodes.length > 1 && !(colocados > 0 && cabe(nodo))) {
          const shell = nodo.cloneNode(false); cont.appendChild(shell); cont = shell;
          [...nodo.childNodes].forEach(colocar);
          cont = cont.parentNode; return;
        }
        if (colocados > 0) {
          // mantener los títulos junto al contenido siguiente
          const prev = cont.lastElementChild; const ruta = rutaDe(cont);
          if (esTitulo(prev) && cont.children.length > 1) { cont.removeChild(prev); nueva(ruta); cont.appendChild(prev); }
          else nueva(ruta);
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
          if (!t.tBodies[0].rows.length) { cont.removeChild(t); const prev = cont.lastElementChild; const ruta = rutaDe(cont); if (esTitulo(prev) && cont.children.length > 1) { cont.removeChild(prev); nueva(ruta); cont.appendChild(prev); } else nueva(ruta); }
          else nueva(rutaDe(cont));
          t = nuevaCasco(); t.tBodies[0].appendChild(fila);
        });
        colocados++;
      }
      nueva([]);
      const casco = sec.cloneNode(false); hoja.appendChild(casco); cont = casco;
      // si la sección excede la hoja en poco (≤ 18 %), se reduce levemente para no dejar una hoja casi vacía
      [...sec.childNodes].forEach(n => casco.appendChild(n));
      // tablas o figuras más anchas que la hoja: se reducen para respetar los márgenes
      casco.querySelectorAll('table, .par, figure').forEach(el => {
        if (el.parentElement.closest('table')) return;
        const w = Math.max(el.scrollWidth, el.getBoundingClientRect().width);
        if (w > W + 1) el.style.zoom = (W / w - 0.002).toFixed(4);
      });
      const alto = hoja.scrollHeight;
      if (alto <= H + 1) return;
      if (alto <= H * 1.18) { casco.style.zoom = (H / alto - 0.005).toFixed(4); if (hoja.scrollHeight <= H + 1) return; casco.style.zoom = ''; }
      const hijos = [...casco.childNodes]; hijos.forEach(n => casco.removeChild(n));
      hijos.forEach(colocar);
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
