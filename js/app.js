/* Interfaz de la aplicación Tabla de Rodal · Bosque Nativo */
(function () {
  'use strict';
  const N = window.NORMATIVA, C = window.CALC;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : Number(x).toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
  const toast = (m) => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 3200); };

  /* ======================= Estado ======================= */
  const S = window.APP_STATE = {
    config: { region: 'IX', area: 500, ancho: 5, inicio: '' },
    hojas: null, hojaSel: 0, filaEnc: 0, mapeo: {}, archivo: '',
    arboles: [], nombres: {}, funciones: {}, catOverride: {}, cfgRodal: {}, alturas: {},
    rodales: [], resultados: {}, especiesInfo: {}, tieneExtraer: false, avisos: []
  };

  C.construirCatalogo();
  C.construirFunciones();
  C.cargarMMA(window.MMA_LISTADO);

  /* ======================= Pestañas ======================= */
  function irA(tab) {
    $$('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    $$('.panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
    if (tab === 'tabla') renderTabla();
    if (tab === 'estadisticos') renderEstadisticos();
    if (tab === 'cumplimiento') renderCumplimiento();
    if (tab === 'rodales') renderRodalCfg();
    if (tab === 'especies') renderEspecies();
    window.scrollTo({ top: 0 });
  }
  $$('#tabs button').forEach(b => b.addEventListener('click', () => { if (!b.disabled) irA(b.dataset.tab); }));
  function habilitar(on) {
    $$('#tabs button').forEach(b => { if (b.dataset.tab !== 'datos' && b.dataset.tab !== 'fuentes') b.disabled = !on; });
    $('#btnExportar').disabled = !on; $('#btnGuardarProyecto').disabled = !on;
  }

  /* ======================= Parámetros generales ======================= */
  const selReg = $('#cfgRegion');
  selReg.innerHTML = N.REGIONES.map(r => `<option value="${r.id}">${esc(r.id + ' · ' + r.nombre)}</option>`).join('');
  selReg.value = S.config.region;
  selReg.addEventListener('change', () => { S.config.region = selReg.value; recalcular(); });
  $('#cfgArea').addEventListener('change', e => { S.config.area = Number(e.target.value) || 500; recalcular(); });
  $('#cfgAncho').addEventListener('change', e => { S.config.ancho = Math.max(0.5, Number(e.target.value) || 5); limpiarManuales(); recalcular(); });
  $('#cfgInicio').addEventListener('change', e => { S.config.inicio = e.target.value; limpiarManuales(); recalcular(); });
  function limpiarManuales() { Object.values(S.cfgRodal).forEach(c => { c.manual = {}; }); }
  $('#txtFuenteMMA').textContent = window.MMA_LISTADO.fuente;

  /* ======================= Carga de archivo ======================= */
  const drop = $('#drop');
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove('over')));
  $('#inpArchivo').addEventListener('change', async (e) => { const f = e.target.files[0]; if (f) await cargarArchivo(f); e.target.value = ''; });

  const PATRONES = {
    rodal: /^(n[°ºo.]?\s*)?rodal|^stand|^unidad/i,
    parcela: /parcela|^plot|^n[°ºo.]?\s*parc|^unidad muestral|^um$/i,
    especie: /especie|^sp\.?$|species|^nombre/i,
    dap: /^d\.?a\.?p|^diam|^dap|^d130|^d1[.,]3|^dat/i,
    altura: /^altura|^h(t|\s*\(m\))?$|^ht|^height|^alt\.?/i,
    extraer: /extra|^corta|marca|cosech|^ralea|^elimin|^intervenci/i,
    superficie: /^sup|superficie|^area|^área|m2|m²/i
  };
  const CAMPOS = [
    { id: 'rodal', nombre: 'Rodal', req: true }, { id: 'parcela', nombre: 'Parcela', req: true }, { id: 'especie', nombre: 'Especie', req: true },
    { id: 'dap', nombre: 'Dap (cm)', req: true }, { id: 'altura', nombre: 'Altura (m)', req: false }, { id: 'extraer', nombre: 'Extraer (S/N)', req: false },
    { id: 'superficie', nombre: 'Superficie parcela (m²)', req: false }
  ];
  function detectarEncabezado(rows) {
    let best = { score: -1, fila: 0, map: {} };
    for (let i = 0; i < Math.min(rows.length, 30); i++) {
      const r = rows[i] || []; const map = {}; let score = 0;
      r.forEach((v, ci) => {
        if (v == null) return; const t = String(v).trim();
        for (const [k, rx] of Object.entries(PATRONES)) if (map[k] == null && rx.test(t)) { map[k] = ci; score += (['rodal', 'parcela', 'especie', 'dap'].includes(k) ? 3 : 1); break; }
      });
      if (score > best.score) best = { score, fila: i, map };
    }
    return best;
  }
  async function cargarArchivo(file) {
    try {
      const hojas = await XLSXIO.readFile(file);
      S.hojas = hojas; S.archivo = file.name;
      // elegir la hoja con mejor encabezado
      let mejor = 0, mejorScore = -1;
      hojas.forEach((h, i) => { const d = detectarEncabezado(h.rows); if (d.score > mejorScore) { mejorScore = d.score; mejor = i; } });
      S.hojaSel = mejor;
      mostrarMapeo();
    } catch (err) {
      $('#msgArchivo').innerHTML = `<div class="aviso bad">${esc(err.message || err)}</div>`;
    }
  }
  function mostrarMapeo() {
    const h = S.hojas[S.hojaSel];
    const d = detectarEncabezado(h.rows);
    S.filaEnc = d.fila; S.mapeo = d.map;
    const enc = h.rows[d.fila] || [];
    const ncol = Math.max(...h.rows.slice(0, 50).map(r => r.length), enc.length);
    const opts = (sel) => `<option value="">— no usar —</option>` + Array.from({ length: ncol }, (_, i) => `<option value="${i}" ${sel === i ? 'selected' : ''}>${esc(XLSXIO.idxToCol(i) + ': ' + (enc[i] != null ? enc[i] : '(sin título)'))}</option>`).join('');
    $('#cardMapeo').hidden = false;
    $('#txtHoja').innerHTML = `Archivo <b>${esc(S.archivo)}</b>${S.hojas.length > 1 ? ` · hoja <select id="selHoja" style="display:inline-block;width:auto">${S.hojas.map((x, i) => `<option value="${i}" ${i === S.hojaSel ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>` : ''} · encabezado en la fila ${d.fila + 1}. Revise la asignación de columnas.`;
    $('#mapeo').innerHTML = CAMPOS.map(c => `<label>${c.nombre}${c.req ? ' *' : ''}<select data-campo="${c.id}">${opts(S.mapeo[c.id])}</select></label>`).join('');
    const sh = $('#selHoja'); if (sh) sh.addEventListener('change', () => { S.hojaSel = Number(sh.value); mostrarMapeo(); });
    $$('#mapeo select').forEach(s => s.addEventListener('change', () => { S.mapeo[s.dataset.campo] = s.value === '' ? undefined : Number(s.value); }));
    $('#msgArchivo').innerHTML = '';
  }
  $('#btnProcesar').addEventListener('click', () => procesar());

  const num = (v) => { if (v == null || v === '') return null; if (typeof v === 'number') return v; const s = String(v).trim().replace(/\s/g, ''); const t = /,\d{1,3}$/.test(s) && !/\.\d{3},/.test(s) ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, ''); const n = parseFloat(t); return isNaN(n) ? null : n; };
  const esSi = (v) => v === true || v === 1 || /^(s|si|sí|x|1|c|corta|e|ext|extraer|extraído|extraido|true|verdadero|y|yes)$/i.test(String(v == null ? '' : v).trim());

  function procesar() {
    const m = S.mapeo; const faltan = CAMPOS.filter(c => c.req && m[c.id] == null);
    if (faltan.length) { $('#msgArchivo').innerHTML = `<div class="aviso bad">Falta asignar: ${faltan.map(c => c.nombre).join(', ')}.</div>`; return; }
    const rows = S.hojas[S.hojaSel].rows.slice(S.filaEnc + 1);
    const arboles = []; const avisos = []; let sinDap = 0, filasVacias = 0;
    const parcelasVistas = new Set();
    rows.forEach((r, i) => {
      if (!r || r.every(v => v == null || v === '')) { filasVacias++; return; }
      const rodal = r[m.rodal], parcela = r[m.parcela];
      if (rodal == null || rodal === '' || parcela == null || parcela === '') return;
      const rid = String(typeof rodal === 'number' ? rodal : String(rodal).trim());
      const pid = String(typeof parcela === 'number' ? parcela : String(parcela).trim());
      parcelasVistas.add(rid + '|' + pid);
      const dap = num(r[m.dap]); const nombre = r[m.especie] == null ? '' : String(r[m.especie]).trim();
      if (!nombre && dap == null) return; // parcela sin árboles: se registra la parcela
      if (!(dap > 0)) { sinDap++; return; }
      arboles.push({ fila: S.filaEnc + 2 + i, rodal: rid, parcela: pid, nombre, dap, h: m.altura != null ? num(r[m.altura]) : null, extArchivo: m.extraer != null ? esSi(r[m.extraer]) : false, sup: m.superficie != null ? num(r[m.superficie]) : null });
    });
    if (!arboles.length) { $('#msgArchivo').innerHTML = `<div class="aviso bad">No se encontraron árboles con DAP válido.</div>`; return; }
    // parcelas sin árboles (filas con rodal y parcela pero sin especie/DAP)
    S.parcelasVacias = [...parcelasVistas].filter(k => !arboles.some(a => a.rodal + '|' + a.parcela === k)).map(k => { const [r, p] = k.split('|'); return { rodal: r, parcela: p }; });
    if (sinDap) avisos.push({ t: 'warn', m: `${sinDap} fila(s) sin DAP válido fueron omitidas.` });
    S.tieneExtraer = m.extraer != null; S.tieneAltura = m.altura != null && arboles.some(a => a.h > 0);
    cargarArboles(arboles, avisos);
  }

  function cargarArboles(arboles, avisos) {
    S.arboles = arboles; S.avisos = avisos || [];
    // reconocimiento de especies (D.S. 68)
    const nombres = {};
    arboles.forEach(a => { (nombres[a.nombre] = nombres[a.nombre] || { n: 0 }).n++; });
    Object.keys(nombres).forEach(nm => {
      const prev = S.nombres[nm];
      if (prev && prev.manual) { nombres[nm] = Object.assign(prev, { n: nombres[nm].n }); return; }
      const r = C.reconocerEspecie(nm);
      nombres[nm] = { n: nombres[nm].n, key: r.key, ambiguo: r.ambiguo, auto: true };
    });
    S.nombres = nombres;
    aplicarNombres();
    // rodales (orden natural)
    const ids = [...new Set(arboles.map(a => a.rodal))];
    ids.sort((a, b) => { const na = parseFloat(a), nb = parseFloat(b); return (!isNaN(na) && !isNaN(nb) && na !== nb) ? na - nb : String(a).localeCompare(String(b), 'es', { numeric: true }); });
    S.rodales = ids;
    ids.forEach(id => {
      if (!S.cfgRodal[id]) S.cfgRodal[id] = { superficie: '', pendiente: '', suelosFragiles: false, cercaAgua: false, snap: false, ambienteUnico: false, estructura: 'auto', actividad: 'NINGUNA', metodoRegen: '', ext: { modo: S.tieneExtraer ? 'archivo' : 'ninguna', pctG: 30, criterio: 'abajo', especies: [], dapMin: '', dapMax: '', protegerAmenazadas: true }, manual: {}, inputs: {}, especiesInteres: [] };
      const sups = arboles.filter(a => a.rodal === id && a.sup > 0).map(a => a.sup);
      if (sups.length) S.cfgRodal[id].areaParcela = sups.sort((a, b) => sups.filter(v => v === a).length - sups.filter(v => v === b).length).pop();
      S.alturas[id] = S.alturas[id] || {};
    });
    recalcular();
    renderResumenCarga();
    habilitar(true);
  }
  function aplicarNombres() {
    S.especiesInfo = {};
    S.arboles.forEach(a => {
      const info = S.nombres[a.nombre] || {};
      a.key = info.key || ('X:' + C.norm(a.nombre));
      if (!S.especiesInfo[a.key]) {
        const e = C.CAT.especies[a.key];
        S.especiesInfo[a.key] = { nombre: e ? e.nombreComun : (a.nombre || '(sin nombre)'), sci: e ? e.s : '', nativa: !!e };
      }
    });
  }

  function renderResumenCarga() {
    $('#cardResumenCarga').hidden = false;
    const nP = new Set(S.arboles.map(a => a.rodal + '|' + a.parcela)).size + (S.parcelasVacias || []).length;
    const sp = Object.keys(S.especiesInfo).length;
    const noRec = Object.entries(S.nombres).filter(([k, v]) => !v.key);
    const amb = Object.entries(S.nombres).filter(([k, v]) => v.ambiguo && v.auto);
    $('#kpisCarga').innerHTML = [
      ['Rodales detectados', S.rodales.length], ['Parcelas', nP], ['Árboles', S.arboles.length], ['Especies', sp],
      ['Con altura medida', S.arboles.filter(a => a.h > 0).length], ['Marcados para extraer', S.arboles.filter(a => a.extArchivo).length]
    ].map(([l, v]) => `<div class="kpi"><div class="v">${v.toLocaleString('es-CL')}</div><div class="l">${l}</div></div>`).join('');
    const av = S.avisos.slice();
    av.unshift({ t: 'ok', m: `Se detectaron automáticamente ${S.rodales.length} rodal(es): ${S.rodales.map(esc).join(', ')}.` });
    if ((S.parcelasVacias || []).length) av.push({ t: 'info', m: `${S.parcelasVacias.length} parcela(s) sin árboles se consideran en los estadísticos con valor cero.` });
    if (noRec.length) av.push({ t: 'warn', m: `Nombres no reconocidos en la nómina del D.S. 68/2009 (se tratarán como no nativos hasta que los asigne en la pestaña 2): ${noRec.map(([k]) => esc(k || '(vacío)')).join(', ')}.` });
    if (amb.length) av.push({ t: 'info', m: `Nombres comunes asignados a más de una especie en el D.S. 68; revise la asignación en la pestaña 2: ${amb.map(([k]) => esc(k)).join(', ')}.` });
    $('#avisosCarga').innerHTML = av.map(a => `<div class="aviso ${a.t}">${a.m}</div>`).join('') + `<div class="row-btns"><button class="btn primary" id="btnIrEspecies">Continuar: especies y volumen →</button></div>`;
    $('#btnIrEspecies').addEventListener('click', () => irA('especies'));
  }

  /* ======================= Recalcular ======================= */
  function ctx() {
    return { parcelasExtra: (S.parcelasVacias || []).reduce((o, p) => { (o[p.rodal] = o[p.rodal] || []).push(String(p.parcela)); return o; }, {}), region: S.config.region, areaParcela: S.config.area, anchoClase: S.config.ancho, inicioClase: S.config.inicio, funciones: S.funciones, cfgRodal: S.cfgRodal, alturas: S.alturas, catOverride: S.catOverride, especiesInfo: S.especiesInfo };
  }
  function recalcular() {
    if (!S.arboles.length) return;
    const cx = ctx();
    S.resultados = {};
    S.rodales.forEach(id => {
      const arb = S.arboles.filter(a => a.rodal === id);
      const r = C.calcularRodal(id, arb, cx);
      S.resultados[id] = r;
    });
    // refrescar vistas visibles
    const act = ($('#tabs button.active') || {}).dataset;
    if (act && act.tab === 'rodales') refrescarResultadosRodal();
    if (act && act.tab === 'tabla') renderTabla();
    if (act && act.tab === 'estadisticos') renderEstadisticos();
    if (act && act.tab === 'cumplimiento') renderCumplimiento();
  }

  /* ======================= 2. Especies ======================= */
  const opcionesD68 = (() => {
    const arr = Object.values(C.CAT.especies).map(e => ({ s: e.s, label: `${e.nombreComun} (${e.s})` })).sort((a, b) => a.label.localeCompare(b.label, 'es'));
    return arr;
  })();
  function etiquetaFuncion(f) {
    return `N° ${f.id} · ${f.especies.join('-')} · Reg. ${f.regiones.join('-')} · ${f.usaH ? 'DAP y H ' + f.alturaTipo : 'sólo DAP'} · ${f.estructura} · ${f.validacion}${f.unidad !== 'm3' ? ' · ' + f.unidad : ''}`;
  }
  function regionComp() { return (N.REGIONES.find(r => r.id === S.config.region) || {}).compendio; }
  function renderEspecies() {
    const tbl = $('#tblEspecies');
    const filas = Object.entries(S.nombres).sort((a, b) => b[1].n - a[1].n);
    const todasF = Object.values(C.FN);
    tbl.innerHTML = `<thead><tr><th>Nombre en el inventario</th><th class="num">Árboles</th><th>Especie según D.S. 68/2009</th><th>Categoría MMA (región ${esc(S.config.region)})</th><th>Función de volumen (compendio)</th></tr></thead><tbody>` +
      filas.map(([nm, info]) => {
        const key = info.key || ('X:' + C.norm(nm));
        const cat = C.categoriaEspecie(key, S.config.region, S.catOverride[key]);
        const propias = info.key ? C.funcionesDeEspecie(info.key) : [];
        const auto = info.key ? C.funcionPorDefecto(info.key, regionComp(), null) : null;
        const sel = S.funciones[key];
        const fOpts = `<option value="auto" ${sel === undefined ? 'selected' : ''}>Automática${auto ? ' (N° ' + auto + ')' : ' — sin función para la especie'}</option>` +
          (propias.length ? `<optgroup label="Funciones de la especie">${propias.map(f => `<option value="${f.id}" ${sel === f.id ? 'selected' : ''}>${esc(etiquetaFuncion(f))}</option>`).join('')}</optgroup>` : '') +
          `<optgroup label="Otras funciones del compendio (aplicación por similitud)">${todasF.filter(f => !propias.includes(f) && f.unidad === 'm3').map(f => `<option value="${f.id}" ${sel === f.id ? 'selected' : ''}>${esc(etiquetaFuncion(f))}</option>`).join('')}</optgroup>` +
          `<option value="none" ${sel === null ? 'selected' : ''}>Sin función (no calcular volumen)</option>`;
        const fidUsada = sel === undefined ? auto : sel;
        const fUsada = fidUsada ? C.FN[fidUsada] : null;
        let avisoF = '';
        if (!fUsada) avisoF = `<div class="tag warn" style="margin-top:4px">Sin función: volumen no calculado</div>`;
        else {
          if (fUsada.validacion !== 'verificada') avisoF += `<div class="tag warn" style="margin-top:4px">Ecuación ${esc(fUsada.validacion)}</div> `;
          if (!fUsada.keys.includes(info.key)) avisoF += `<div class="tag info" style="margin-top:4px">Función de otra especie</div> `;
          if (!fUsada.regiones.includes(regionComp())) avisoF += `<div class="tag neutral" style="margin-top:4px">Región ${esc(fUsada.regiones.join('-'))}</div>`;
        }
        const catSel = `<select data-cat="${esc(key)}"><option value="">Según listado MMA</option>${Object.entries(N.CATEGORIAS).map(([k, v]) => `<option value="${k}" ${S.catOverride[key] && S.catOverride[key].code === k ? 'selected' : ''}>${k} · ${v.nombre}</option>`).join('')}</select>`;
        return `<tr>
          <td><b>${esc(nm || '(vacío)')}</b>${info.ambiguo && info.auto ? `<div class="tag info" style="margin-top:4px">Nombre ambiguo en D.S. 68</div>` : ''}</td>
          <td class="num">${info.n.toLocaleString('es-CL')}</td>
          <td><select data-nombre="${esc(nm)}"><option value="">— No figura en el D.S. 68 (no nativa) —</option>${opcionesD68.map(o => `<option value="${esc(o.s)}" ${info.key === o.s ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>
            ${info.key ? '' : '<div class="tag warn" style="margin-top:4px">No reconocida</div>'}</td>
          <td><span class="tag cat-${cat.code}">${cat.code} · ${esc((N.CATEGORIAS[cat.code] || {}).nombre || '')}</span>
            <div class="muted" style="font-size:12px;margin-top:3px">${cat.raw ? esc('Listado: ' + cat.raw.replace(/\n/g, ' ') + ' · ' + (cat.fuente || '')) : (cat.code === 'NC' && info.key ? 'No figura en el listado MMA' : esc(cat.fuente || ''))}</div>
            ${cat.nota && cat.raw ? `<div style="font-size:12px;color:var(--warn)">${esc(cat.nota)}</div>` : ''}
            <details style="margin-top:4px"><summary class="muted" style="font-size:12px;cursor:pointer">Modificar</summary>${catSel}</details></td>
          <td><select data-fun="${esc(key)}">${fOpts}</select>${avisoF}
            ${fUsada ? `<div><button class="btn ghost small" data-verf="${fUsada.id}" style="margin-top:4px">Ver función N° ${fUsada.id}</button></div>` : ''}</td>
        </tr>`;
      }).join('') + '</tbody>';
    $$('select[data-nombre]', tbl).forEach(s => s.addEventListener('change', () => {
      const nm = s.dataset.nombre; S.nombres[nm].key = s.value || null; S.nombres[nm].manual = true; S.nombres[nm].auto = false;
      aplicarNombres(); recalcular(); renderEspecies(); renderResumenCarga();
    }));
    $$('select[data-fun]', tbl).forEach(s => s.addEventListener('change', () => {
      const k = s.dataset.fun;
      if (s.value === 'auto') delete S.funciones[k]; else if (s.value === 'none') S.funciones[k] = null; else S.funciones[k] = Number(s.value);
      recalcular(); renderEspecies();
    }));
    $$('select[data-cat]', tbl).forEach(s => s.addEventListener('change', () => {
      const k = s.dataset.cat; if (!s.value) delete S.catOverride[k]; else S.catOverride[k] = { code: s.value, nota: 'Asignada manualmente' };
      recalcular(); renderEspecies();
    }));
    $$('button[data-verf]', tbl).forEach(b => b.addEventListener('click', () => verFuncion(Number(b.dataset.verf))));
  }
  function verFuncion(id) {
    const f = C.FN[id]; const c = $('#cardFuncionDetalle'); c.hidden = false;
    c.innerHTML = `<div class="card-head"><h2>Función N° ${f.id} · ${esc(f.especies.join(' - '))}</h2><button class="btn ghost small" id="cerrarF">Cerrar</button></div>
      <p><b>Ecuación (compendio):</b> <code>${esc(f.eq)}</code><br><b>Expresión usada:</b> <code>${esc(f.expr)}</code></p>
      <div class="res-grid">
        ${[['Región', f.regiones.join(' - ')], ['Página del compendio', f.pag], ['Localidad', f.localidad], ['Estructura', f.estructura], ['Variable', f.variable + (f.dlu && f.dlu !== '0' ? ' (DLU ' + f.dlu + ' cm)' : '')], ['Altura', f.usaH ? (f.alturaDesc || f.alturaTipo) : 'No usa altura'], ['Rango diamétrico', f.rangoD], ['Rango de altura', f.rangoH], ['Fuente', f.fuente + ' (' + f.anio + ')'], ['Muestra', f.muestra], ['R²', f.r2], ['Verificación con tabla del compendio', f.validacion + (f.valTot ? ` (${f.valOk}/${f.valTot} valores)` : '')]]
        .map(([l, v]) => `<div class="res-item"><div class="l">${l}</div><div class="d" style="font-size:13px;color:var(--ink)">${esc(v || 'Sin información')}</div></div>`).join('')}
      </div>${f.nota ? `<div class="aviso warn">${esc(f.nota)}</div>` : ''}`;
    $('#cerrarF').addEventListener('click', () => { c.hidden = true; });
    c.scrollIntoView({ behavior: 'smooth' });
  }
  $('#inpMMA').addEventListener('change', async (e) => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    try {
      const hojas = await XLSXIO.readFile(f);
      const h = hojas.find(x => /especies/i.test(x.name)) || hojas[0];
      const enc = h.rows.findIndex(r => r.some(v => /nombre cient/i.test(String(v || ''))));
      if (enc < 0) throw new Error('No se encontró la columna "NOMBRE CIENTÍFICO".');
      const H = h.rows[enc].map(v => String(v || ''));
      const col = (rx) => H.findIndex(v => rx.test(v));
      const cS = col(/nombre cient/i), cC = col(/nombre com/i), cY = col(/sinon/i), cR = col(/^reino/i), cK = col(/^categor.a vigente/i), cF = col(/^fuente de categor.a vigente/i), cP = col(/n.mero proceso/i), cD = col(/referencia o decreto/i), cH = col(/^arbusto/i);
      if (cK < 0) throw new Error('No se encontró la columna "CATEGORÍA VIGENTE".');
      const especies = h.rows.slice(enc + 1).filter(r => r && r[cS] && (cR < 0 || /plantae/i.test(String(r[cR] || ''))))
        .map(r => ({ s: String(r[cS]).trim(), c: cC >= 0 ? String(r[cC] || '').trim() : '', y: cY >= 0 ? String(r[cY] || '') : '', h: cH >= 0 ? String(r[cH] || '') : '', k: String(r[cK] == null ? '' : r[cK]).trim(), f: cF >= 0 ? String(r[cF] || '') : '', p: cP >= 0 && r[cP] != null ? r[cP] : '', d: cD >= 0 ? String(r[cD] || '') : '' }));
      if (!especies.length) throw new Error('El archivo no contiene especies del reino Plantae.');
      window.MMA_LISTADO = { fuente: f.name, fecha: new Date().toLocaleDateString('es-CL'), especies };
      C.cargarMMA(window.MMA_LISTADO);
      $('#txtFuenteMMA').textContent = f.name;
      recalcular(); renderEspecies();
      toast(`Listado MMA actualizado: ${especies.length} especies de flora.`);
    } catch (err) { toast('No se pudo leer el listado: ' + (err.message || err)); }
  });

  /* ======================= 3. Rodales ======================= */
  function opcionesRodal(sel) { return S.rodales.map(r => `<option value="${esc(r)}" ${r === sel ? 'selected' : ''}>Rodal ${esc(r)}</option>`).join(''); }
  let rodalActual = null;
  function renderRodalCfg() {
    if (!S.rodales.length) return;
    if (!rodalActual || !S.rodales.includes(rodalActual)) rodalActual = S.rodales[0];
    const sel = $('#selRodalCfg'); sel.innerHTML = opcionesRodal(rodalActual);
    sel.onchange = () => { rodalActual = sel.value; renderRodalCfg(); };
    $('#txtRodalesDetectados').textContent = `${S.rodales.length} rodal(es) detectado(s) en el inventario`;
    const id = rodalActual, cfg = S.cfgRodal[id], r = S.resultados[id];
    const actOpts = ['-', 'A', 'B', 'C', 'Incendios'].map(l => {
      const acts = N.ACTIVIDADES.filter(a => a.literal === l);
      const lab = { '-': 'General', A: 'Literal a) · Bosque nativo de preservación', B: 'Literal b) · Productos no madereros', C: 'Literal c) · Producción maderera', Incendios: 'Bosques afectados por incendios' }[l];
      return `<optgroup label="${lab}">${acts.map(a => `<option value="${a.id}" ${cfg.actividad === a.id ? 'selected' : ''}>${esc(a.nombre)}</option>`).join('')}</optgroup>`;
    }).join('');
    const sps = r.porEspecie;
    const chkSp = (name, arr) => sps.map(e => `<label class="chk"><input type="checkbox" data-${name}="${esc(e.key)}" ${arr.includes(e.key) ? 'checked' : ''}> ${esc(e.nombre)}</label>`).join('<br>');
    $('#rodalCfg').innerHTML = `
      <div class="card" id="resRodal"></div>
      <div class="grid2">
        <div class="card">
          <h2>Antecedentes del rodal ${esc(id)}</h2>
          <div class="form">
            <div class="two">
              <label>Superficie del rodal (ha)<input type="number" step="any" min="0" data-f="superficie" value="${esc(cfg.superficie)}"></label>
              <label>Superficie de parcela (m²)<input type="number" step="any" min="1" data-f="areaParcela" value="${esc(cfg.areaParcela || '')}" placeholder="${S.config.area} (general)"></label>
            </div>
            <label>Pendiente media (%)<input type="number" step="any" min="0" data-f="pendiente" value="${esc(cfg.pendiente)}"><small>Se usa para la categoría de conservación y protección (≥ 45 %) y las restricciones del art. 18 del D.S. 259.</small></label>
            <div class="fl">Condiciones para la Ley 20.283</div>
            <label class="chk"><input type="checkbox" data-b="suelosFragiles" ${cfg.suelosFragiles ? 'checked' : ''}> Ubicado en suelos frágiles</label>
            <label class="chk"><input type="checkbox" data-b="cercaAgua" ${cfg.cercaAgua ? 'checked' : ''}> A menos de 200 m de manantiales, cuerpos o cursos de agua naturales</label>
            <label class="chk"><input type="checkbox" data-b="snap" ${cfg.snap ? 'checked' : ''}> Dentro de un área del Sistema Nacional de Áreas Protegidas</label>
            <label class="chk"><input type="checkbox" data-b="ambienteUnico" ${cfg.ambienteUnico ? 'checked' : ''}> Ambiente único o representativo de la diversidad biológica</label>
            <div class="two">
              <label>Estructura<select data-f="estructura"><option value="auto" ${cfg.estructura === 'auto' ? 'selected' : ''}>Automática</option><option value="regular" ${cfg.estructura === 'regular' ? 'selected' : ''}>Regular</option><option value="irregular" ${cfg.estructura === 'irregular' ? 'selected' : ''}>Irregular / no estructurado</option></select></label>
              <label>Categoría de bosque<select data-f="categoriaManual"><option value="">Automática (Ley 20.283)</option>${['Preservación', 'Conservación y protección', 'Uso múltiple'].map(c => `<option ${cfg.categoriaManual === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
            </div>
            <div class="two">
              <label>Tipo forestal<select data-f="tipoManual"><option value="">Automático (D.S. 259)</option>${N.TIPOS_FORESTALES.map(t => `<option value="${t.id}" ${cfg.tipoManual === t.id ? 'selected' : ''}>${esc(t.nombre)}</option>`).join('')}</select></label>
              <label>Estado de desarrollo<select data-f="estadoManual"><option value="">Automático (Bases 2.5)</option>${N.ESTADOS.map(e => `<option ${cfg.estadoManual === e ? 'selected' : ''}>${e}</option>`).join('')}</select></label>
            </div>
          </div>
        </div>
        <div class="card">
          <h2>Intervención propuesta</h2>
          <div class="form">
            <label>Actividad a postular<select data-f="actividad">${actOpts}</select></label>
            <div id="boxMetodo" ${cfg.actividad === 'C_REG' ? '' : 'hidden'}><label>Método de corta de regeneración (D.S. 259)<select data-f="metodoRegen"><option value="">— seleccione —</option>${N.METODOS_CORTA.map(m => `<option value="${m.id}" ${cfg.metodoRegen === m.id ? 'selected' : ''}>${esc(m.nombre)}</option>`).join('')}</select></label></div>
            <div id="boxInputs"></div>
            <div class="fl">Árboles a extraer (define la tabla residual)</div>
            <label class="chk"><input type="radio" name="modoExt" value="ninguna" ${cfg.ext.modo === 'ninguna' ? 'checked' : ''}> Sin corta (residual = inicial)</label>
            <label class="chk"><input type="radio" name="modoExt" value="archivo" ${cfg.ext.modo === 'archivo' ? 'checked' : ''} ${S.tieneExtraer ? '' : 'disabled'}> Según la columna "Extraer" del inventario${S.tieneExtraer ? '' : ' (no disponible)'}</label>
            <label class="chk"><input type="radio" name="modoExt" value="regla" ${cfg.ext.modo === 'regla' ? 'checked' : ''}> Por regla de área basal</label>
            <div id="boxRegla" ${cfg.ext.modo === 'regla' ? '' : 'hidden'}>
              <div class="two">
                <label>Área basal a extraer (%)<input type="number" step="any" min="0" max="100" data-e="pctG" value="${esc(cfg.ext.pctG)}"></label>
                <label>Criterio<select data-e="criterio"><option value="abajo" ${cfg.ext.criterio === 'abajo' ? 'selected' : ''}>Desde abajo (menores DAP)</option><option value="arriba" ${cfg.ext.criterio === 'arriba' ? 'selected' : ''}>Desde arriba (mayores DAP)</option><option value="proporcional" ${cfg.ext.criterio === 'proporcional' ? 'selected' : ''}>Proporcional en todas las clases</option></select></label>
              </div>
              <div class="two">
                <label>DAP mínimo a cortar (cm)<input type="number" step="any" data-e="dapMin" value="${esc(cfg.ext.dapMin)}"></label>
                <label>DAP máximo (excluido, cm)<input type="number" step="any" data-e="dapMax" value="${esc(cfg.ext.dapMax)}"></label>
              </div>
              <label class="chk"><input type="checkbox" data-eb="protegerAmenazadas" ${cfg.ext.protegerAmenazadas ? 'checked' : ''}> No cortar especies en categoría CR, EN o VU (art. 19 Ley 20.283)</label>
              <details class="crit"><summary>Especies a intervenir (${cfg.ext.especies.length ? cfg.ext.especies.length + ' seleccionadas' : 'todas'})</summary><div style="margin-top:6px">${chkSp('extsp', cfg.ext.especies)}</div></details>
            </div>
            <small>Los valores residuales también pueden editarse celda a celda en la pestaña 4. ${Object.keys(cfg.manual || {}).length ? `<button class="btn ghost small" id="btnBorrarManual">Borrar ${Object.keys(cfg.manual).length} ajuste(s) manual(es)</button>` : ''}</small>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Altura promedio por especie</h2><button class="btn ghost small" id="btnAlturasTodos">Aplicar estas alturas a todos los rodales</button></div>
        <p class="muted">La altura promedio de cada especie se usa en la función de volumen de todos sus árboles${S.tieneAltura ? '. Por defecto es la media de las alturas medidas en el inventario' : ''}. También define la altura media del rodal para distinguir repoblado y monte bravo.</p>
        <div class="table-wrap"><table class="data" id="tblAlturas"></table></div>
      </div>`;
    // eventos
    const root = $('#rodalCfg');
    $$('[data-f]', root).forEach(el => el.addEventListener('change', () => {
      cfg[el.dataset.f] = el.type === 'number' ? (el.value === '' ? '' : Number(el.value)) : el.value;
      if (el.dataset.f === 'actividad') { $('#boxMetodo').hidden = el.value !== 'C_REG'; renderInputsActividad(); }
      recalcular();
    }));
    $$('[data-b]', root).forEach(el => el.addEventListener('change', () => { cfg[el.dataset.b] = el.checked; recalcular(); }));
    $$('input[name=modoExt]', root).forEach(el => el.addEventListener('change', () => { cfg.ext.modo = el.value; $('#boxRegla').hidden = el.value !== 'regla'; recalcular(); }));
    $$('[data-e]', root).forEach(el => el.addEventListener('change', () => { cfg.ext[el.dataset.e] = el.type === 'number' ? (el.value === '' ? '' : Number(el.value)) : el.value; recalcular(); }));
    $$('[data-eb]', root).forEach(el => el.addEventListener('change', () => { cfg.ext[el.dataset.eb] = el.checked; recalcular(); }));
    $$('[data-extsp]', root).forEach(el => el.addEventListener('change', () => { cfg.ext.especies = $$('[data-extsp]', root).filter(x => x.checked).map(x => x.dataset.extsp); recalcular(); }));
    const bbm = $('#btnBorrarManual'); if (bbm) bbm.addEventListener('click', () => { cfg.manual = {}; recalcular(); renderRodalCfg(); });
    $('#btnAlturasTodos').addEventListener('click', () => {
      const src = S.resultados[id].alt;
      S.rodales.forEach(o => { if (o === id) return; S.alturas[o] = S.alturas[o] || {}; Object.entries(src).forEach(([k, h]) => { if (h != null) S.alturas[o][k] = h; }); });
      recalcular(); toast('Alturas copiadas a todos los rodales que tienen esas especies.');
    });
    renderInputsActividad();
    refrescarResultadosRodal();
  }
  function renderInputsActividad() {
    const id = rodalActual, cfg = S.cfgRodal[id]; const act = N.ACTIVIDADES.find(a => a.id === cfg.actividad) || {};
    cfg.inputs = cfg.inputs || {};
    const campo = (k, l, ph) => `<label>${l}<input type="number" step="any" min="0" data-in="${k}" value="${esc(cfg.inputs[k] == null ? '' : cfg.inputs[k])}" placeholder="${ph || ''}"></label>`;
    let h = '';
    if (act.regla === 'PODA_FITO') h = `<div class="two">${campo('nDanados', 'Árboles dañados (árb/ha)')}${campo('nPodar', 'Árboles a podar (árb/ha)')}</div>`;
    else if (act.regla === 'PODA_NM') h = `<div class="two">${campo('nInteres', 'Individuos de interés (árb/ha)', 'total del rodal')}${campo('nPodar', 'Árboles a podar (árb/ha)')}</div>`;
    else if (act.regla === 'PODA_LA' || act.regla === 'PODA_LB') h = campo('nPodar', 'Árboles a podar (árb/ha)');
    else if (act.regla === 'RECUPERACION') h = campo('pctDanados', 'Individuos arbóreos dañados por el incendio (%)');
    else if (act.regla === 'MEJORAMIENTO') { const sps = S.resultados[id].porEspecie; h = `<details class="crit" open><summary>Especies de interés</summary><div style="margin-top:6px">${sps.map(e => `<label class="chk"><input type="checkbox" data-int="${esc(e.key)}" ${(cfg.especiesInteres || []).includes(e.key) ? 'checked' : ''}> ${esc(e.nombre)}</label>`).join('<br>')}</div></details>`; }
    const box = $('#boxInputs'); box.innerHTML = h;
    $$('[data-in]', box).forEach(el => el.addEventListener('change', () => { cfg.inputs[el.dataset.in] = el.value === '' ? '' : Number(el.value); recalcular(); }));
    $$('[data-int]', box).forEach(el => el.addEventListener('change', () => { cfg.especiesInteres = $$('[data-int]', box).filter(x => x.checked).map(x => x.dataset.int); recalcular(); }));
  }
  function refrescarResultadosRodal() {
    const id = rodalActual; if (!id || !$('#resRodal')) return;
    const r = S.resultados[id];
    const b = r.bases;
    const volTxt = (o) => o.v == null ? '—' : fmt(o.v, 1) + (o.vCompleto ? '' : ' *');
    $('#resRodal').innerHTML = `
      <div class="card-head"><h2>Rodal ${esc(id)} · diagnóstico</h2>${b.actividad && b.actividad.id !== 'NINGUNA' ? `<span class="tag ${b.clase}">${esc(b.resultado)}</span>` : ''}</div>
      <div class="res-grid">
        <div class="res-item"><div class="l">Tipo forestal (D.S. 259)</div><div class="v">${esc(r.tipo.nombre)}</div><div class="d">${esc(r.tipo.motivo)}${r.tipo.alternativas.length ? ' También cumple: ' + esc(r.tipo.alternativas.join(', ')) + '.' : ''}</div></div>
        <div class="res-item"><div class="l">Estado de desarrollo (Bases 2.5)</div><div class="v">${esc(r.estado.estado || 'Indeterminado')}</div><div class="d">${esc(r.estado.criterio)}</div></div>
        <div class="res-item"><div class="l">Categoría de bosque (Ley 20.283)</div><div class="v">${esc(r.categoria.cat)}</div><div class="d">${esc(r.categoria.art)}. ${esc(r.categoria.motivosP.concat(r.categoria.motivosCP).join(' ') || 'No cumple condiciones de preservación ni de conservación y protección.')}</div></div>
        <div class="res-item"><div class="l">Estructura</div><div class="v">${r.estructura === 'irregular' ? 'Irregular' : 'Regular'}</div><div class="d">${r.cfg.estructura === 'auto' || !r.cfg.estructura ? 'Sugerida por la distribución diamétrica' : 'Definida por el usuario'}</div></div>
        <div class="res-item"><div class="l">DMC inicial → residual</div><div class="v">${fmt(r.DMCini)} → ${fmt(r.DMCres)} cm</div><div class="d">Altura media ${fmt(r.hProm)} m · ${r.nP} parcela(s) de ${fmt(r.area, 0)} m²</div></div>
        <div class="res-item"><div class="l">Densidad inicial → residual</div><div class="v">${fmt(r.tot.ini.n, 0)} → ${fmt(r.tot.res.n, 0)} árb/ha</div><div class="d">Extracción ${fmt(r.tot.ext.n, 0)} árb/ha</div></div>
        <div class="res-item"><div class="l">Área basal inicial → residual</div><div class="v">${fmt(r.tot.ini.g, 2)} → ${fmt(r.tot.res.g, 2)} m²/ha</div><div class="d">Extracción ${fmt(r.tot.ext.g, 2)} m²/ha (${fmt(r.tot.ini.g ? r.tot.ext.g / r.tot.ini.g * 100 : 0)} %)</div></div>
        <div class="res-item"><div class="l">Volumen inicial → residual</div><div class="v">${volTxt(r.tot.ini)} → ${volTxt(r.tot.res)} m³/ha</div><div class="d">${r.tot.ini.vCompleto ? 'Funciones del compendio' : '* Hay especies sin función o sin altura: volumen parcial'}</div></div>
      </div>
      <details class="crit"><summary>Criterios del tipo forestal (art. 19 D.S. 259)</summary><ul class="checks">${r.tipo.criterios.map(c => `<li><span class="tag ${c.cumple ? 'ok' : 'neutral'}">${c.cumple ? 'Cumple' : 'No cumple'}</span><div><b>${esc(c.nombre)}</b> · ${esc(c.detalle)}</div></li>`).join('')}</ul></details>`;
    // alturas
    const t = $('#tblAlturas');
    t.innerHTML = `<thead><tr><th>Especie</th><th class="num">N (árb/ha)</th><th class="num">Árboles en parcelas</th><th class="num">Altura medida (media)</th><th>Altura promedio a usar (m)</th><th>Función de volumen</th></tr></thead><tbody>` +
      r.porEspecie.map(e => {
        const f = e.fid ? C.FN[e.fid] : null; const nArb = r.arboles.filter(a => a.key === e.key).length;
        const u = S.alturas[id][e.key];
        const falta = f && f.usaH && !(e.h > 0);
        return `<tr><td><b>${esc(e.nombre)}</b> <span class="muted">${esc(S.especiesInfo[e.key] && S.especiesInfo[e.key].sci || '')}</span></td><td class="num">${fmt(e.ini.n, 0)}</td><td class="num">${nArb}</td>
          <td class="num">${e.hMedida ? fmt(e.hMedida.media, 1) + ' m (n=' + e.hMedida.n + ')' : '—'}</td>
          <td><input type="number" step="any" min="0" data-alt="${esc(e.key)}" value="${u != null && u !== '' ? esc(u) : ''}" placeholder="${e.hMedida ? fmt(e.hMedida.media, 1) : 'ingresar'}">${falta ? ' <span class="tag warn">Requerida</span>' : ''}</td>
          <td>${f ? 'N° ' + f.id + ' · ' + esc(f.especies.join('-')) + (f.usaH ? '' : ' (sólo DAP)') : '<span class="tag warn">Sin función</span>'}</td></tr>`;
      }).join('') + '</tbody>';
    $$('[data-alt]', t).forEach(el => el.addEventListener('change', () => { const k = el.dataset.alt; if (el.value === '') delete S.alturas[id][k]; else S.alturas[id][k] = Number(el.value); recalcular(); }));
  }

  /* ======================= 4. Tabla de rodal ======================= */
  function columnasEspecies(r, todas) {
    const sps = r.porEspecie.filter(e => e.ini.n > 0);
    if (todas || sps.length <= 4) return { cols: sps, otras: null };
    return { cols: sps.slice(0, 3), otras: sps.slice(3) };
  }
  let rodalTabla = null;
  function renderTabla() {
    if (!S.rodales.length) return;
    if (!rodalTabla || !S.rodales.includes(rodalTabla)) rodalTabla = S.rodales[0];
    const sel = $('#selRodalTabla'); sel.innerHTML = opcionesRodal(rodalTabla);
    sel.onchange = () => { rodalTabla = sel.value; renderTabla(); };
    const todas = $('#chkTodas').checked;
    const r = S.resultados[rodalTabla]; const { cols, otras } = columnasEspecies(r, todas);
    const filas = r.tabla.filter((f, i) => r.tabla.slice(i).some(x => x.tot.ini.n > 0) && r.tabla.slice(0, i + 1).some(x => x.tot.ini.n > 0));
    const sumOtras = (f, est, campo) => otras.reduce((s, e) => s + f.sp[e.key][est][campo], 0);
    const tot = (e, est, campo) => e[est][campo];
    const enc = (titulo) => `<thead><tr><th colspan="3" rowspan="1">Especie</th>${cols.map(e => `<th colspan="4">${esc(e.nombre)}</th>`).join('')}${otras ? '<th colspan="4">Otras</th>' : ''}<th colspan="4">Total</th></tr>
      <tr><th colspan="2" rowspan="2">Rango (cm)<br>≤ Ø &lt;</th><th rowspan="2">Mc</th>${[...cols, ...(otras ? [0] : []), 0].map(() => `<th colspan="2">${titulo[0]}</th><th colspan="2">${titulo[1]}</th>`).join('')}</tr>
      <tr>${[...cols, ...(otras ? [0] : []), 0].map(() => '<th>Ini.</th><th>Res.</th><th>Ini.</th><th>Res.</th>').join('')}</tr></thead>`;
    const man = r.cfg.manual || {};
    const cuerpo = (c1, c2, d1, d2, editable) => filas.map(f => {
      const c = f.clase;
      const celdas = cols.map(e => {
        const x = f.sp[e.key];
        const resCell = editable && x.ini.n > 0 ? `<td class="res edit"><input type="number" step="any" min="0" data-cell="${esc(e.key)}|${c.i}" value="${+x.res.n.toFixed(1)}" class="${man[e.key + '|' + c.i] != null ? 'mod' : ''}" title="N residual (árb/ha). Inicial: ${fmt(x.ini.n, 1)}"></td>` : `<td class="res">${fmt(x.res[c1], d1)}</td>`;
        return `<td>${fmt(x.ini[c1], d1)}</td>${resCell}<td>${fmt(x.ini[c2], d2)}</td><td class="res">${fmt(x.res[c2], d2)}</td>`;
      }).join('');
      const o = otras ? `<td>${fmt(sumOtras(f, 'ini', c1), d1)}</td><td class="res">${fmt(sumOtras(f, 'res', c1), d1)}</td><td>${fmt(sumOtras(f, 'ini', c2), d2)}</td><td class="res">${fmt(sumOtras(f, 'res', c2), d2)}</td>` : '';
      return `<tr><td class="rng">${fmt(c.li, c.li % 1 ? 1 : 0)}</td><td class="rng">${fmt(c.ls, c.ls % 1 ? 1 : 0)}</td><td class="rng">${fmt(c.mc, c.mc % 1 ? 1 : 0)}</td>${celdas}${o}<td>${fmt(f.tot.ini[c1], d1)}</td><td class="res">${fmt(f.tot.res[c1], d1)}</td><td>${fmt(f.tot.ini[c2], d2)}</td><td class="res">${fmt(f.tot.res[c2], d2)}</td></tr>`;
    }).join('') + `<tr class="tot"><td colspan="3" style="text-align:center">Total</td>${cols.map(e => `<td>${fmt(e.ini[c1], d1)}</td><td>${fmt(e.res[c1], d1)}</td><td>${fmt(e.ini[c2], d2)}</td><td>${fmt(e.res[c2], d2)}</td>`).join('')}${otras ? `<td>${fmt(otras.reduce((s, e) => s + e.ini[c1], 0), d1)}</td><td>${fmt(otras.reduce((s, e) => s + e.res[c1], 0), d1)}</td><td>${fmt(otras.reduce((s, e) => s + (e.ini[c2] || 0), 0), d2)}</td><td>${fmt(otras.reduce((s, e) => s + (e.res[c2] || 0), 0), d2)}</td>` : ''}<td>${fmt(r.tot.ini[c1], d1)}</td><td>${fmt(r.tot.res[c1], d1)}</td><td>${fmt(r.tot.ini[c2], d2)}</td><td>${fmt(r.tot.res[c2], d2)}</td></tr>`;
    // volumen: tabla con N y V
    $('#tablaRodal').innerHTML = `
      <div class="card">
        <div class="titulo-plantilla">12.3.9 Tabla de rodal inicial y residual, después de la intervención inmediata</div>
        <p class="muted" style="margin-top:0">Rodal: <b>${esc(rodalTabla)}</b> · ${esc(r.tipo.nombre)} · ${esc(r.estado.estado || '')} · ${r.nP} parcela(s) · Las celdas sombreadas son residuales; el N residual por especie y clase es editable.</p>
        <div class="table-wrap"><table class="rodal">${enc(['N (árb./ha)', 'G (m²/ha)'])}<tbody>${cuerpo('n', 'g', 1, 2, true)}</tbody></table></div>
        ${otras ? `<p class="muted" style="font-size:12px">Otras: ${otras.map(e => esc(e.nombre)).join(', ')}.</p>` : ''}
      </div>
      <div class="card">
        <div class="titulo-plantilla">Volumen inicial y residual por clase diamétrica (funciones del compendio)</div>
        <p class="muted" style="margin-top:0">${r.tot.ini.vCompleto ? '' : 'Hay especies sin función de volumen o sin altura promedio: los totales son parciales. '}Volumen según la variable de cada función (ver pestaña 2).</p>
        <div class="table-wrap"><table class="rodal">${enc(['N (árb./ha)', 'V (m³/ha)'])}<tbody>${cuerpo('n', 'v', 1, 2, false)}</tbody></table></div>
      </div>`;
    $$('[data-cell]', $('#tablaRodal')).forEach(inp => inp.addEventListener('change', () => {
      const cfg = S.cfgRodal[rodalTabla]; cfg.manual = cfg.manual || {};
      if (inp.value === '') delete cfg.manual[inp.dataset.cell]; else cfg.manual[inp.dataset.cell] = Math.max(0, Number(inp.value));
      recalcular();
    }));
  }
  $('#chkTodas').addEventListener('change', renderTabla);

  /* ======================= 5. Estadísticos ======================= */
  function renderEstadisticos() {
    const rs = S.rodales.map(id => S.resultados[id]);
    const st = (r) => recalcStats(r);
    $('#tblEstadisticos').innerHTML = `<table class="data"><thead><tr><th rowspan="2">Rodal</th><th rowspan="2" class="num">Parcelas (N°)</th><th rowspan="2" class="num">t student (95%)</th><th colspan="2" style="text-align:center">Media</th><th colspan="2" style="text-align:center">Varianza</th><th colspan="2" style="text-align:center">Coeficiente de variación (%)</th><th colspan="2" style="text-align:center">Error de muestreo (%)</th><th colspan="2" style="text-align:center">Volumen (m³/ha)</th></tr>
      <tr><th class="num">Densidad (arb/ha)</th><th class="num">Área basal (m²/ha)</th><th class="num">Densidad</th><th class="num">Área basal</th><th class="num">Densidad</th><th class="num">Área basal</th><th class="num">Densidad</th><th class="num">Área basal</th><th class="num">Media</th><th class="num">E (%)</th></tr></thead><tbody>` +
      rs.map(r => { const s = st(r); return `<tr><td><b>${esc(r.id)}</b></td><td class="num">${s.n}</td><td class="num">${fmt(s.t, 3)}</td><td class="num">${fmt(s.N.media, 1)}</td><td class="num">${fmt(s.G.media, 2)}</td><td class="num">${fmt(s.N.var, 1)}</td><td class="num">${fmt(s.G.var, 3)}</td><td class="num">${fmt(s.N.cv, 1)}</td><td class="num">${fmt(s.G.cv, 1)}</td><td class="num">${fmt(s.N.ePct, 1)}</td><td class="num">${fmt(s.G.ePct, 1)}</td><td class="num">${s.V ? fmt(s.V.media, 1) : '—'}</td><td class="num">${s.V ? fmt(s.V.ePct, 1) : '—'}</td></tr>`; }).join('') + '</tbody></table>';
    $('#tblParcelas').innerHTML = `<table class="data"><thead><tr><th>Rodal</th><th>Parcela</th><th class="num">Árboles</th><th class="num">N (árb/ha)</th><th class="num">G (m²/ha)</th><th class="num">V (m³/ha)</th></tr></thead><tbody>` +
      rs.map(r => r.parcelas.map(p => `<tr><td>${esc(r.id)}</td><td>${esc(p.parcela)}</td><td class="num">${p.arboles}</td><td class="num">${fmt(p.n, 1)}</td><td class="num">${fmt(p.g, 2)}</td><td class="num">${p.v == null ? '—' : fmt(p.v, 1)}</td></tr>`).join('')).join('') + '</tbody></table>';
  }
  // Estadísticos incluyendo parcelas vacías
  function recalcStats(r) {
    const n = r.parcelas.length;
    const est = (arr) => {
      const m = arr.reduce((a, b) => a + b, 0) / n;
      if (n < 2) return { media: m, var: null, cv: null, ePct: null };
      const v = arr.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1); const s = Math.sqrt(v); const t = C.tQuantil(0.975, n - 1);
      return { media: m, var: v, s, cv: m ? s / m * 100 : null, eAbs: t * s / Math.sqrt(n), ePct: m ? t * s / Math.sqrt(n) / m * 100 : null };
    };
    return { n, t: n > 1 ? C.tQuantil(0.975, n - 1) : null, N: est(r.parcelas.map(p => p.n)), G: est(r.parcelas.map(p => p.g)), V: r.parcelas.every(p => p.v != null) ? est(r.parcelas.map(p => p.v)) : null };
  }
  window.APP_recalcStats = recalcStats;

  /* ======================= 6. Cumplimiento ======================= */
  const lblEstado = { si: ['ok', 'Cumple'], no: ['bad', 'No cumple'], obs: ['warn', 'Observación'], pend: ['info', 'Pendiente'] };
  function renderCumplimiento() {
    const rs = S.rodales.map(id => S.resultados[id]);
    $('#tblResumen').innerHTML = `<table class="data"><thead><tr><th>Rodal</th><th>Tipo forestal</th><th>Estado de desarrollo</th><th>Categoría (Ley 20.283)</th><th class="num">DMC ini/res (cm)</th><th class="num">N ini/res</th><th class="num">G ini/res</th><th class="num">V ini/res</th><th>Actividad</th><th>Bases 2026</th></tr></thead><tbody>` +
      rs.map(r => `<tr><td><b>${esc(r.id)}</b></td><td>${esc(r.tipo.nombre)}</td><td>${esc(r.estado.estado || '—')}</td><td>${esc(r.categoria.cat)}</td><td class="num">${fmt(r.DMCini)} / ${fmt(r.DMCres)}</td><td class="num">${fmt(r.tot.ini.n, 0)} / ${fmt(r.tot.res.n, 0)}</td><td class="num">${fmt(r.tot.ini.g, 2)} / ${fmt(r.tot.res.g, 2)}</td><td class="num">${r.tot.ini.v == null ? '—' : fmt(r.tot.ini.v, 1) + ' / ' + fmt(r.tot.res.v, 1)}</td><td>${esc(r.bases.actividad ? r.bases.actividad.nombre : '—')}</td><td><span class="tag ${r.bases.clase}">${esc(r.bases.resultado)}</span></td></tr>`).join('') + '</tbody></table>';
    $('#detalleCumplimiento').innerHTML = rs.map(r => `
      <div class="card">
        <div class="card-head"><h2>Rodal ${esc(r.id)} · ${esc(r.bases.actividad ? r.bases.actividad.nombre : 'Sin actividad')}</h2><span class="tag ${r.bases.clase}">${esc(r.bases.resultado)}</span></div>
        ${r.bases.checks.length ? `<ul class="checks">${r.bases.checks.map(c => `<li><span class="tag ${lblEstado[c.estado][0]}">${lblEstado[c.estado][1]}</span><div><b>${esc(c.item)}</b> · ${esc(c.detalle)} <span class="ref">${esc(c.ref)}</span></div></li>`).join('')}</ul>` : `<p class="muted">Seleccione la actividad a postular en la pestaña 3 para verificar las Bases Técnicas.</p>`}
        <h3>Restricciones de los métodos de corta para el tipo ${esc(r.tipo.nombre)} (D.S. 259)</h3>
        ${r.metodos.especial ? `<div class="aviso bad">${esc(r.metodos.especial)}</div>` : ''}
        <div class="table-wrap"><table class="data"><thead><tr><th>Método</th><th>Aplicable</th><th>Requisitos de regeneración</th><th>Restricciones y observaciones</th></tr></thead><tbody>
        ${r.metodos.metodos.map(m => `<tr><td><b>${esc(m.nombre)}</b><div class="muted" style="font-size:12px">Art. ${esc(m.art)}</div></td><td><span class="tag ${m.aplica === false ? 'bad' : m.aplica ? 'ok' : 'neutral'}">${m.aplica === false ? 'No' : m.aplica ? 'Sí' : 'Sin tipo'}</span></td><td>${esc(m.requisitos)}${m.maxG ? ' Extracción máxima: ' + m.maxG + ' % del área basal.' : ''}</td><td>${esc(m.obs.join(' '))}${m.nota ? `<div class="muted" style="font-size:12px">${esc(m.nota)}</div>` : ''}</td></tr>`).join('')}
        </tbody></table></div>
      </div>`).join('');
  }

  /* ======================= Exportar ======================= */
  $('#btnExportar').addEventListener('click', async () => {
    try {
      const blob = await window.EXPORTAR.libro(S);
      descargar(blob, `Tabla_de_rodal_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast('Archivo Excel generado.');
    } catch (err) { console.error(err); toast('Error al exportar: ' + (err.message || err)); }
  });
  function descargar(blob, nombre) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
  $('#btnPlantilla').addEventListener('click', async () => { descargar(await window.EXPORTAR.plantilla(), 'Plantilla_inventario_parcelas.xlsx'); });

  /* ======================= Proyecto (JSON) ======================= */
  $('#btnGuardarProyecto').addEventListener('click', () => {
    const p = { version: 1, config: S.config, arboles: S.arboles.map(a => ({ rodal: a.rodal, parcela: a.parcela, nombre: a.nombre, dap: a.dap, h: a.h, extArchivo: a.extArchivo, sup: a.sup, fila: a.fila })), parcelasVacias: S.parcelasVacias || [], nombres: S.nombres, funciones: S.funciones, catOverride: S.catOverride, cfgRodal: S.cfgRodal, alturas: S.alturas, tieneExtraer: S.tieneExtraer, tieneAltura: S.tieneAltura, archivo: S.archivo };
    descargar(new Blob([JSON.stringify(p)], { type: 'application/json' }), 'proyecto_tabla_rodal.json');
  });
  $('#inpProyecto').addEventListener('change', async (e) => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    try {
      const p = JSON.parse(await f.text());
      Object.assign(S, { config: p.config, nombres: p.nombres || {}, funciones: p.funciones || {}, catOverride: p.catOverride || {}, cfgRodal: p.cfgRodal || {}, alturas: p.alturas || {}, tieneExtraer: p.tieneExtraer, tieneAltura: p.tieneAltura, archivo: p.archivo, parcelasVacias: p.parcelasVacias || [] });
      Object.keys(S.funciones).forEach(k => { if (S.funciones[k] === undefined) delete S.funciones[k]; });
      $('#cfgRegion').value = S.config.region; $('#cfgArea').value = S.config.area; $('#cfgAncho').value = S.config.ancho; $('#cfgInicio').value = S.config.inicio;
      cargarArboles(p.arboles, [{ t: 'info', m: 'Proyecto abierto: ' + esc(f.name) }]);
      toast('Proyecto abierto.');
    } catch (err) { toast('No se pudo abrir el proyecto: ' + (err.message || err)); }
  });

  /* ======================= Datos de ejemplo ======================= */
  $('#btnEjemplo').addEventListener('click', () => {
    let seed = 20283; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const normal = (m, s) => m + s * Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
    const pick = (pares) => { const x = rnd() * pares.reduce((a, p) => a + p[1], 0); let acc = 0; for (const p of pares) { acc += p[1]; if (x <= acc) return p[0]; } return pares[0][0]; };
    const arboles = [];
    const rodales = [
      { id: '1', parcelas: 8, n: [24, 34], sp: [['Roble', 45], ['Raulí', 25], ['Coigüe', 15], ['Laurel', 8], ['Lingue', 7]], dap: () => Math.max(5, normal(24, 8)) },
      { id: '2', parcelas: 6, n: [30, 45], sp: [['Quillay', 30], ['Litre', 25], ['Peumo', 25], ['Boldo', 12], ['Espino', 8]], dap: () => Math.max(4, normal(13, 5)) },
      { id: '3', parcelas: 7, n: [20, 32], sp: [['Coigüe', 25], ['Ulmo', 20], ['Tepa', 20], ['Tineo', 15], ['Canelo', 12], ['Olivillo', 8]], dap: () => 5 - 14 * Math.log(1 - rnd() * 0.985) }
    ];
    rodales.forEach(R => {
      for (let p = 1; p <= R.parcelas; p++) {
        const n = Math.round(R.n[0] + rnd() * (R.n[1] - R.n[0]));
        for (let i = 0; i < n; i++) {
          const sp = pick(R.sp); const d = Math.round(R.dap() * 10) / 10;
          const hMed = rnd() < 0.25 ? Math.round((1.3 + (R.id === '2' ? 9 : 27) * (1 - Math.exp(-0.06 * d)) + normal(0, 1)) * 10) / 10 : null;
          arboles.push({ rodal: R.id, parcela: String(p), nombre: sp, dap: d, h: hMed, extArchivo: false, sup: 500, fila: arboles.length + 2 });
        }
      }
    });
    S.archivo = 'Datos de ejemplo'; S.tieneExtraer = false; S.tieneAltura = true; S.parcelasVacias = [];
    S.nombres = {}; S.funciones = {}; S.catOverride = {}; S.cfgRodal = {}; S.alturas = {};
    $('#cardMapeo').hidden = true;
    cargarArboles(arboles, [{ t: 'info', m: 'Datos de ejemplo generados aleatoriamente (no corresponden a un predio real).' }]);
    // actividad de ejemplo
    const c1 = S.cfgRodal['1']; c1.actividad = 'C_RLA'; c1.ext = Object.assign(c1.ext, { modo: 'regla', pctG: 30, criterio: 'abajo' }); c1.superficie = 12.5; c1.pendiente = 20;
    const c3 = S.cfgRodal['3']; c3.actividad = 'C_IRR'; c3.ext = Object.assign(c3.ext, { modo: 'regla', pctG: 25, criterio: 'proporcional' }); c3.superficie = 8; c3.pendiente = 35;
    S.cfgRodal['2'].superficie = 4.2; S.cfgRodal['2'].pendiente = 15;
    recalcular();
    toast('Datos de ejemplo cargados: 3 rodales.');
  });
})();
