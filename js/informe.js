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
        <h3>Criterios del tipo forestal (art. 19 D.S. 259)</h3>
        <table class="it"><thead><tr><th>Tipo</th><th>Cumple</th><th>Detalle</th></tr></thead><tbody>${r.tipo.criterios.map(c => `<tr><td>${esc(c.nombre)}</td><td>${c.cumple ? 'Sí' : 'No'}</td><td>${esc(c.detalle)}</td></tr>`).join('')}</tbody></table>
        <h3>Bases Técnicas 2026 · ${esc(r.bases.actividad ? r.bases.actividad.nombre : 'sin actividad')} · <span class="res-${r.bases.clase}">${esc(r.bases.resultado)}</span></h3>
        ${r.bases.checks.length ? `<table class="it"><thead><tr><th>Requisito</th><th>Estado</th><th>Detalle</th><th>Referencia</th></tr></thead><tbody>${r.bases.checks.map(c => `<tr><td>${esc(c.item)}</td><td class="st-${c.estado}">${EST[c.estado]}</td><td>${esc(c.detalle)}</td><td>${esc(c.ref)}</td></tr>`).join('')}</tbody></table>` : '<p class="nota">No se seleccionó actividad a postular.</p>'}
        <h3>Métodos de corta (D.S. 259) para el tipo ${esc(r.tipo.nombre)}</h3>
        ${r.metodos.especial ? `<p class="nota"><b>${esc(r.metodos.especial)}</b></p>` : ''}
        <table class="it"><thead><tr><th>Método</th><th>Aplicable</th><th>Requisitos de regeneración</th><th>Restricciones</th></tr></thead><tbody>${r.metodos.metodos.map(m => `<tr><td>${esc(m.nombre)} (art. ${esc(m.art)})</td><td>${m.aplica === false ? 'No' : m.aplica ? 'Sí' : '—'}</td><td>${esc(m.requisitos)}${m.maxG ? ` Extracción máxima ${m.maxG} % G.` : ''}</td><td>${esc(m.obs.join(' '))}</td></tr>`).join('')}</tbody></table>
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

  function imprimir(S) {
    let el = document.getElementById('informe');
    if (!el) { el = document.createElement('div'); el.id = 'informe'; document.body.appendChild(el); }
    el.innerHTML = construir(S);
    document.body.classList.add('modo-informe');
    const fin = () => { document.body.classList.remove('modo-informe'); window.removeEventListener('afterprint', fin); };
    window.addEventListener('afterprint', fin);
    setTimeout(() => window.print(), 80);
  }

  window.INFORME = { construir, imprimir };
})();
