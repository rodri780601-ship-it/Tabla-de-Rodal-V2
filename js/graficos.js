/* Gráficos de la sección 5 (SVG generado sin librerías externas).
   Codificación fija en todos los gráficos: azul = residual, naranja = extraído (barra completa = inicial). */
(function () {
  'use strict';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : Number(x).toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });

  const CLARA = { res: '#2a78d6', ext: '#eb6834', grid: '#e1e0d9', axis: '#c3c2b7', ink: '#1d2420', ink2: '#4d5650', muted: '#6c746e', surface: '#ffffff', empty: '#f2f2ee',
    ramp: ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'] };
  let FORZAR_CLARA = false;
  function paleta() {
    if (FORZAR_CLARA) return CLARA;
    const cs = getComputedStyle(document.documentElement);
    const g = (v, def) => (cs.getPropertyValue(v) || '').trim() || def;
    return {
      res: g('--c-res', '#2a78d6'), ext: g('--c-ext', '#eb6834'), grid: g('--c-grid', '#e1e0d9'), axis: g('--c-axis', '#c3c2b7'),
      ink: g('--ink', '#1d2420'), ink2: g('--ink-2', '#4d5650'), muted: g('--c-muted', '#898781'), surface: g('--surface', '#ffffff'), empty: g('--surface-2', '#f8f7f3'),
      ramp: g('--c-ramp', '#cde2fb,#9ec5f4,#6da7ec,#3987e5,#256abf,#184f95,#0d366b').split(',').map(x => x.trim())
    };
  }

  /* ---------- rótulos de los ejes ---------- */
  // Tamaños base de letra (se multiplican por el factor fs de cada gráfico): valores de los ejes, títulos de
  // los ejes y valores del eje de intensidad. Los márgenes se calculan con el ancho real de los textos, de modo
  // que la letra crece sin que los rótulos se monten entre sí y sin cambiar el alto de los gráficos.
  const ROT = { val: 15, tit: 15.5, sup: 13.5 };
  const FUENTE = "system-ui, -apple-system, 'Segoe UI', sans-serif";
  let ctxMed = null;
  // ancho del texto en negrita (en el PDF los rótulos de los ejes van en negrita)
  function anchoTexto(t, px) {
    try { ctxMed = ctxMed || document.createElement('canvas').getContext('2d'); ctxMed.font = `bold ${px}px ${FUENTE}`; return ctxMed.measureText(String(t)).width; }
    catch (e) { return String(t).length * px * 0.62; }
  }
  const anchoMax = (arr, px) => Math.max(0, ...arr.map(t => anchoTexto(t, px)));
  // título vertical del eje Y: se reduce sólo si no cabe en el alto del área del gráfico
  const ajustaTitulo = (txt, px, largo) => { const w = anchoTexto(txt, px); return w > largo ? +(px * largo / w).toFixed(1) : px; };

  /* ---------- utilidades de escala ---------- */
  function niceMax(v) {
    if (!(v > 0)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v))); const m = v / p;
    const n = m <= 1 ? 1 : m <= 1.2 ? 1.2 : m <= 1.5 ? 1.5 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 3 ? 3 : m <= 4 ? 4 : m <= 5 ? 5 : m <= 6 ? 6 : m <= 8 ? 8 : 10;
    return n * p;
  }
  function ticks(max) {
    // elige un número de divisiones cuyo paso sea 1, 2, 2,5 o 5 × 10^k
    for (const n of [4, 5, 3, 6, 2]) {
      const st = max / n, p = Math.pow(10, Math.floor(Math.log10(st))), m = +(st / p).toFixed(6);
      if ([1, 2, 2.5, 5, 10].includes(m)) { const out = []; for (let i = 0; i <= n; i++) out.push(st * i); return out; }
    }
    return [0, max / 2, max];
  }
  const decTick = (max) => { const t = ticks(max); const st = t[1] - t[0]; return st >= 1 && Number.isInteger(+st.toFixed(6)) ? 0 : st >= 0.1 && Number.isInteger(+(st * 10).toFixed(6)) ? 1 : 2; };
  // barra con extremo superior (o derecho) redondeado de 4 px, anclada a la base
  function barPath(x, y, w, h, horizontal, r = 4) {
    if (h <= 0 || w <= 0) return '';
    if (!horizontal) { r = Math.min(r, w / 2, h); return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`; }
    r = Math.min(r, h / 2, w); return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  }

  /* ---------- barras verticales apiladas (residual + extraído) ---------- */
  // fs: factor de tamaño de letra (1 en pantalla; mayor en el PDF, donde el gráfico se imprime más pequeño).
  // intensidad: agrega un eje superior con la intensidad de extracción de cada barra (% extraído del inicial).
  // anchoBarra: fracción de cada categoría que ocupa la barra (por defecto la de pantalla).
  function barrasApiladas({ cats, res, ext, yLabel, dec = 0, xLabel, tipCat, ancho, fs = 1, intensidad = false, anchoBarra }) {
    const P = paleta();
    const f = (v) => +(v * fs).toFixed(1), conInt = intensidad && ext.some(e => e > 0);
    const tv = f(ROT.val), tt = f(ROT.tit), ts = f(ROT.sup);
    const max = niceMax(Math.max(...cats.map((_, i) => res[i] + ext[i]), 0)), tk = ticks(max), dt = decTick(max);
    const W = ancho || 680, H = 300; // mismo alto que en pantalla: los márgenes mayores se toman del área del gráfico
    const m = { l: Math.ceil(18 + tt + anchoMax(tk.map(t => fmt(t, dt)), tv)), r: 12, t: conInt ? Math.ceil(tt * 1.15 + ts + 12) : Math.ceil(Math.max(14, tv * 0.6)), b: Math.ceil(xLabel ? 14 + tv + tt : 10 + tv) };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const y = (v) => m.t + ih - v / max * ih;
    const bw = iw / cats.length, pad = anchoBarra ? bw * (1 - anchoBarra) / 2 : Math.min(10, bw * 0.18), w = Math.max(2, bw - 2 * pad);
    // rótulos de categoría (y de intensidad) cada tantas barras como haga falta para que no se toquen
    const cada = Math.max(1, Math.ceil((Math.max(anchoMax(cats, tv), conInt ? anchoTexto('100', ts) : 0) + tv * 0.6) / bw));
    const tty = ajustaTitulo(yLabel, tt, ih + m.b * 0.6);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" class="chart" xmlns="http://www.w3.org/2000/svg" font-family="${FUENTE}">`;
    tk.forEach(t => { s += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}" stroke="${t === 0 ? P.axis : P.grid}" stroke-width="1"/><text x="${m.l - 8}" y="${+(y(t) + tv * 0.35).toFixed(1)}" text-anchor="end" font-size="${tv}" fill="${P.muted}">${fmt(t, dt)}</text>`; });
    s += `<text transform="translate(${+(4 + tt * 0.8).toFixed(1)} ${m.t + ih / 2}) rotate(-90)" text-anchor="middle" font-size="${tty}" fill="${P.ink2}">${esc(yLabel)}</text>`;
    if (conInt) {
      s += `<line x1="${m.l}" x2="${W - m.r}" y1="${m.t - 4}" y2="${m.t - 4}" stroke="${P.axis}"/>`;
      s += `<text x="${m.l + iw / 2}" y="${+(2 + tt * 0.8).toFixed(1)}" text-anchor="middle" font-size="${tt}" fill="${P.ink2}">Intensidad de extracción (%)</text>`;
    }
    cats.forEach((c, i) => {
      const x = m.l + i * bw + pad, r0 = res[i], e0 = ext[i];
      const yr = y(r0), ye = y(r0 + e0), gap = r0 > 0 && e0 > 0 ? 2 : 0;
      const tip = `${tipCat ? tipCat(c) : esc(c)}|Inicial: ${fmt(r0 + e0, dec)}|Residual: ${fmt(r0, dec)}|Extraído: ${fmt(e0, dec)}`;
      if (e0 > 0) s += `<path d="${barPath(x, ye, w, (yr - ye) - gap, false)}" fill="${P.ext}"/>`;
      if (r0 > 0) s += e0 > 0 ? `<rect x="${x}" y="${yr}" width="${w}" height="${m.t + ih - yr}" fill="${P.res}"/>` : `<path d="${barPath(x, yr, w, m.t + ih - yr, false)}" fill="${P.res}"/>`;
      s += `<rect x="${m.l + i * bw}" y="${m.t}" width="${bw}" height="${ih}" fill="transparent" data-tip="${esc(tip)}"/>`;
      if (i % cada === 0) s += `<text x="${m.l + i * bw + bw / 2}" y="${+(m.t + ih + 6 + tv * 0.8).toFixed(1)}" text-anchor="middle" font-size="${tv}" fill="${P.muted}">${esc(c)}</text>`;
      if (conInt && i % cada === 0 && r0 + e0 > 0) s += `<line x1="${m.l + i * bw + bw / 2}" x2="${m.l + i * bw + bw / 2}" y1="${m.t - 4}" y2="${m.t}" stroke="${P.axis}"/><text x="${m.l + i * bw + bw / 2}" y="${m.t - 8}" text-anchor="middle" font-size="${ts}" fill="${P.ext}">${fmt(e0 / (r0 + e0) * 100, 0)}</text>`;
    });
    if (xLabel) s += `<text x="${m.l + iw / 2}" y="${+(H - 4 - tt * 0.22).toFixed(1)}" text-anchor="middle" font-size="${tt}" fill="${P.ink2}">${esc(xLabel)}</text>`;
    return s + '</svg>';
  }

  /* ---------- barras horizontales apiladas por especie ---------- */
  function barrasHorizontales({ cats, res, ext, xLabel, dec = 0 }) {
    const P = paleta();
    const rowH = 26, W = 680, m = { l: 150, r: 64, t: 8, b: 40 };
    const H = m.t + m.b + cats.length * rowH, iw = W - m.l - m.r;
    const max = niceMax(Math.max(...cats.map((_, i) => res[i] + ext[i]), 0));
    const x = (v) => m.l + v / max * iw;
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" class="chart" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif">`;
    ticks(max).forEach(t => { s += `<line y1="${m.t}" y2="${H - m.b}" x1="${x(t)}" x2="${x(t)}" stroke="${t === 0 ? P.axis : P.grid}"/><text x="${x(t)}" y="${H - m.b + 16}" text-anchor="middle" font-size="12" fill="${P.muted}">${fmt(t, decTick(max))}</text>`; });
    s += `<text x="${m.l + iw / 2}" y="${H - 6}" text-anchor="middle" font-size="12.5" fill="${P.ink2}">${esc(xLabel)}</text>`;
    cats.forEach((c, i) => {
      const yy = m.t + i * rowH + 5, h = rowH - 10, r0 = res[i], e0 = ext[i];
      const gap = r0 > 0 && e0 > 0 ? 2 : 0;
      if (r0 > 0) s += e0 > 0 ? `<rect x="${m.l}" y="${yy}" width="${x(r0) - m.l}" height="${h}" fill="${P.res}"/>` : `<path d="${barPath(m.l, yy, x(r0) - m.l, h, true)}" fill="${P.res}"/>`;
      if (e0 > 0) s += `<path d="${barPath(x(r0) + gap, yy, x(r0 + e0) - x(r0) - gap, h, true)}" fill="${P.ext}"/>`;
      const nom = c.length > 22 ? c.slice(0, 21) + '…' : c;
      s += `<text x="${m.l - 8}" y="${yy + h / 2 + 4}" text-anchor="end" font-size="12.5" fill="${P.ink}">${esc(nom)}</text>`;
      s += `<text x="${x(r0 + e0) + 6}" y="${yy + h / 2 + 4}" font-size="11" fill="${P.ink2}">${fmt(r0 + e0, dec)}</text>`;
      s += `<rect x="0" y="${m.t + i * rowH}" width="${W}" height="${rowH}" fill="transparent" data-tip="${esc(`${c}|Inicial: ${fmt(r0 + e0, dec)}|Residual: ${fmt(r0, dec)}|Extraído: ${fmt(e0, dec)}`)}"/>`;
    });
    return s + '</svg>';
  }

  /* ---------- líneas por clase diamétrica, una por especie (pauta CONAF 12.3.6) ----------
     var = 'n' (densidad, árb/ha) o 'g' (área basal, m²/ha). Línea continua = inicial; segmentada = residual
     (sólo si hay intervención). La leyenda va dentro del SVG para que se conserve en el PDF y en el PNG. */
  // serie = 'ini' o 'res' dibuja sólo esa serie, con línea continua (la escala del eje Y sigue considerando ambas,
  // para que el gráfico inicial y el residual se puedan comparar directamente).
  function lineasEspecies({ filas, especies, variable, xLabel, yLabel, ancho, fs = 1, serie }) {
    const fz = (v) => +(v * fs).toFixed(1);
    const P = paleta();
    const vk = variable || 'n', dec = vk === 'g' ? 2 : 0, unidad = vk === 'g' ? 'm²/ha' : 'árb/ha';
    const val = (f, e, c) => (f.sp[e.key] && f.sp[e.key][c]) ? f.sp[e.key][c][vk] || 0 : 0;
    const conRes = !serie && especies.some(e => filas.some(f => Math.abs(val(f, e, 'ini') - val(f, e, 'res')) > 1e-9));
    const W = ancho || 680, porFila = Math.max(1, Math.floor((W - 60) / fz(150))), filasLey = Math.ceil(especies.length / porFila) + (conRes ? 1 : 0);
    const tv = fz(ROT.val), tt = fz(ROT.tit), fmtC = (x) => fmt(x, x % 1 ? 1 : 0);
    const top = niceMax(Math.max(...especies.flatMap(e => filas.map(f => Math.max(val(f, e, 'ini'), val(f, e, 'res')))), 0)), tk = ticks(top), dt = decTick(top);
    const etq = filas.map(f => fmtC(f.clase.mc)), wC = anchoMax(etq, tv);
    const m = { l: Math.ceil(Math.max(18 + tt + anchoMax(tk.map(t => fmt(t, dt)), tv), wC / 2 + 4)), r: Math.ceil(Math.max(14 * fs + 8, wC / 2 + 4)), t: 14 + filasLey * fz(18), b: Math.ceil(14 + tv + tt) }, H = 300 + filasLey * fz(18);
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const n = filas.length, x = (i) => m.l + (n === 1 ? iw / 2 : i * iw / (n - 1)), y = (v) => m.t + ih - v / top * ih;
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" class="chart" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif">`;
    especies.forEach((e, i) => {
      const lx = 12 + (i % porFila) * fz(150), ly = 10 + Math.floor(i / porFila) * fz(18), nom = e.nombre.length > 18 ? e.nombre.slice(0, 17) + '…' : e.nombre;
      s += `<line x1="${lx}" x2="${lx + 18}" y1="${ly + 4}" y2="${ly + 4}" stroke="${colorEspecie(i)}" stroke-width="2.5"/><circle cx="${lx + 9}" cy="${ly + 4}" r="3" fill="${colorEspecie(i)}"/><text x="${lx + 24}" y="${ly + fz(8)}" font-size="${fz(11)}" fill="${P.ink}">${esc(nom)}</text>`;
    });
    if (conRes) {
      const ly = 10 + Math.ceil(especies.length / porFila) * fz(18);
      s += `<line x1="12" x2="30" y1="${ly + 4}" y2="${ly + 4}" stroke="${P.ink2}" stroke-opacity="0.38" stroke-width="1.6"/><text x="36" y="${ly + fz(8)}" font-size="${fz(11)}" fill="${P.ink2}">Inicial</text>`;
      s += `<line x1="${fz(100)}" x2="${fz(100) + 18}" y1="${ly + 4}" y2="${ly + 4}" stroke="${P.ink2}" stroke-width="2.4" stroke-dasharray="6 3"/><text x="${fz(100) + 24}" y="${ly + fz(8)}" font-size="${fz(11)}" fill="${P.ink2}">Residual</text>`;
    }
    tk.forEach(t => { s += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}" stroke="${t === 0 ? P.axis : P.grid}"/><text x="${m.l - 8}" y="${+(y(t) + tv * 0.35).toFixed(1)}" text-anchor="end" font-size="${tv}" fill="${P.muted}">${fmt(t, dt)}</text>`; });
    s += `<text transform="translate(${+(4 + tt * 0.8).toFixed(1)} ${m.t + ih / 2}) rotate(-90)" text-anchor="middle" font-size="${ajustaTitulo(yLabel, tt, ih + m.b * 0.6)}" fill="${P.ink2}">${esc(yLabel)}</text>`;
    // marcas de clase cada tantas clases como haga falta para que no se toquen
    const cada = n > 1 ? Math.max(1, Math.ceil((wC + tv * 0.6) / (iw / (n - 1)))) : 1;
    etq.forEach((c, i) => { if (i % cada === 0) s += `<text x="${x(i)}" y="${+(m.t + ih + 6 + tv * 0.8).toFixed(1)}" text-anchor="middle" font-size="${tv}" fill="${P.muted}">${c}</text>`; });
    s += `<text x="${m.l + iw / 2}" y="${+(H - 4 - tt * 0.22).toFixed(1)}" text-anchor="middle" font-size="${tt}" fill="${P.ink2}">${esc(xLabel)}</text>`;
    especies.forEach((e, i) => {
      const col = colorEspecie(i);
      (serie ? [serie] : conRes ? ['ini', 'res'] : ['ini']).forEach(c => {
        const vals = filas.map(f => val(f, e, c));
        // con intervención, la inicial va tenue y la residual destacada; sin intervención, la inicial va con color pleno
        const tenue = conRes && c === 'ini', op = tenue ? 0.38 : 1;
        s += `<polyline points="${vals.map((v, j) => `${x(j)},${y(v)}`).join(' ')}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${tenue ? 1.6 : 2.4}" ${c === 'res' && !serie ? 'stroke-dasharray="6 3"' : ''} stroke-linejoin="round" stroke-linecap="round"/>`;
        vals.forEach((v, j) => { s += `<circle cx="${x(j)}" cy="${y(v)}" r="${tenue ? 2.4 : 3.2}" fill="${col}" fill-opacity="${op}" stroke="#fff" stroke-width="1"/>`; });
      });
    });
    // franjas transparentes por clase para el tooltip con todas las especies
    filas.forEach((f, j) => {
      const w = n === 1 ? iw : iw / (n - 1), x0 = x(j) - w / 2;
      const tip = `Clase ${fmtC(f.clase.li)} – ${fmtC(f.clase.ls)} cm|` + especies.map(e => `${e.nombre}: ${fmt(val(f, e, serie || 'ini'), dec)}${conRes ? ' → ' + fmt(val(f, e, 'res'), dec) : ''} ${unidad}`).join('|');
      s += `<rect x="${x0}" y="${m.t}" width="${w}" height="${ih}" fill="transparent" data-tip="${esc(tip)}"/>`;
    });
    return s + '</svg>';
  }
  /* ---------- mapa de calor especie × parcela ----------
     Cada especie (fila) tiene su propio color; la intensidad del tono indica la densidad de esa especie en la
     parcela, en 5 tramos relativos a su máximo (para ver dónde se concentra cada especie). */
  const COLORES_ESPECIE = ['#2a78d6', '#e0611f', '#1a8f5c', '#8e44ad', '#c79100', '#c0392b', '#138d9c', '#7b5b45', '#d63384', '#546e7a'];
  const colorEspecie = (i) => COLORES_ESPECIE[i % COLORES_ESPECIE.length];
  const mezclar = (hex, t) => { const n = parseInt(hex.replace('#', ''), 16), b = [243, 245, 241]; const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x, k) => Math.round(b[k] + (x - b[k]) * t)); return '#' + c.map(x => x.toString(16).padStart(2, '0')).join(''); };
  const TRAMOS = [0.28, 0.46, 0.64, 0.82, 1];
  const nombreMapa = (n) => n.length > 22 ? n.slice(0, 21) + '…' : n;
  // geometría de la matriz: el margen izquierdo se ajusta al nombre de especie más largo
  function geoMapa(nombres, nParcelas, fs) {
    const f = (v) => +(v * fs).toFixed(1), tv = f(ROT.val), tt = f(ROT.tit);
    const cw = Math.max(f(30), Math.min(f(54), 560 / Math.max(1, nParcelas))), ch = f(26);
    const m = { l: Math.ceil(anchoMax(nombres.map(nombreMapa), tv) + f(22) + 6), t: Math.ceil(tt + tv + 14), r: 10, b: 10 };
    return { f, tv, tt, cw, ch, m, W: m.l + nParcelas * cw + m.r };
  }
  function mapaCalor({ especies, parcelas, valor, valorRes, fs = 1 }) {
    const P = paleta();
    const { f, tv, tt, cw, ch, m, W } = geoMapa(especies.map(e => e.nombre), parcelas.length, fs), H = m.t + especies.length * ch + m.b;
    const max = Math.max(...especies.flatMap(e => parcelas.map(p => valor(e, p))), 0);
    const maxSp = especies.map(e => Math.max(...parcelas.map(p => valor(e, p)), 0));
    const colorCelda = (i, v) => { if (!(v > 0)) return P.empty; const k = Math.min(TRAMOS.length - 1, Math.floor(v / maxSp[i] * TRAMOS.length - 1e-9)); return mezclar(colorEspecie(i), TRAMOS[Math.max(0, k)]); };
    const lum = (hex) => { const n = parseInt(hex.replace('#', ''), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const tinta = (i, v) => { if (!(v > 0)) return P.muted; return lum(colorCelda(i, v)) < 0.22 ? '#ffffff' : '#0b0b0b'; };
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" class="chart heat" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif">`;
    s += `<text x="${m.l}" y="${+(2 + tt * 0.8).toFixed(1)}" font-size="${tt}" fill="${P.ink2}">Parcela</text>`;
    const cadaP = Math.max(1, Math.ceil((anchoMax(parcelas, tv) + 4) / cw));
    parcelas.forEach((p, j) => { if (j % cadaP === 0) s += `<text x="${m.l + j * cw + cw / 2}" y="${m.t - 6}" text-anchor="middle" font-size="${tv}" fill="${P.muted}">${esc(p)}</text>`; });
    especies.forEach((e, i) => {
      const nom = nombreMapa(e.nombre);
      s += `<rect x="${m.l - f(16)}" y="${m.t + i * ch + ch / 2 - f(5)}" width="${f(10)}" height="${f(10)}" rx="2" fill="${colorEspecie(i)}"/>`;
      s += `<text x="${m.l - f(22)}" y="${m.t + i * ch + ch / 2 + tv * 0.35}" text-anchor="end" font-size="${tv}" fill="${P.ink}">${esc(nom)}</text>`;
      parcelas.forEach((p, j) => {
        const v = valor(e, p), vr = valorRes(e, p);
        const x = m.l + j * cw + 1, y = m.t + i * ch + 1;
        s += `<rect x="${x}" y="${y}" width="${cw - 2}" height="${ch - 2}" rx="3" fill="${colorCelda(i, v)}" data-tip="${esc(`${e.nombre} · parcela ${p}|Inicial: ${fmt(v, 0)} árb/ha|Residual: ${fmt(vr, 0)} árb/ha`)}"/>`;
        if (cw >= f(30)) s += `<text x="${x + (cw - 2) / 2}" y="${y + ch / 2 + f(3)}" text-anchor="middle" font-size="${f(10)}" fill="${tinta(i, v)}" pointer-events="none">${v > 0 ? fmt(v, 0) : '·'}</text>`;
      });
    });
    return { svg: s + '</svg>', max };
  }

  /* ---------- índices de dispersión espacial ---------- */
  function chi2q(p, df) { const z = p > 0.5 ? 1.959964 : -1.959964; const a = 2 / (9 * df); return df * Math.pow(1 - a + z * Math.sqrt(a), 3); }
  function dispersion(conteos) {
    const n = conteos.length, Nt = conteos.reduce((a, b) => a + b, 0);
    if (n < 2 || Nt < 2) return { n, Nt, patron: 'Datos insuficientes' };
    const m = Nt / n, v = conteos.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1);
    const id = v / m, chi = id * (n - 1), lo = chi2q(0.025, n - 1), hi = chi2q(0.975, n - 1);
    const mor = n * conteos.reduce((a, x) => a + x * (x - 1), 0) / (Nt * (Nt - 1));
    const patron = chi > hi ? 'Agregada' : chi < lo ? 'Regular (uniforme)' : 'Aleatoria';
    const presencia = conteos.filter(x => x > 0).length / n * 100;
    return { n, Nt, media: m, var: v, id, chi, lo, hi, mor, patron, presencia };
  }

  /* ---------- tooltip ---------- */
  let tipEl = null;
  function activarTooltips(root) {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'chart-tip'; document.body.appendChild(tipEl); }
    root.querySelectorAll('[data-tip]').forEach(el => {
      el.addEventListener('mousemove', (ev) => {
        const [t, ...l] = el.getAttribute('data-tip').split('|');
        tipEl.innerHTML = `<b>${esc(t)}</b>` + l.map(x => `<div>${esc(x)}</div>`).join('');
        tipEl.style.display = 'block';
        const r = tipEl.getBoundingClientRect();
        let x = ev.clientX + 14, y = ev.clientY + 14;
        if (x + r.width > window.innerWidth - 8) x = ev.clientX - r.width - 14;
        if (y + r.height > window.innerHeight - 8) y = ev.clientY - r.height - 14;
        tipEl.style.left = x + 'px'; tipEl.style.top = y + 'px';
        el.setAttribute('opacity', el.tagName === 'rect' && el.getAttribute('fill') === 'transparent' ? 1 : 0.85);
      });
      el.addEventListener('mouseleave', () => { tipEl.style.display = 'none'; el.removeAttribute('opacity'); });
    });
  }

  /* ---------- descarga PNG ---------- */
  // Compone título + leyenda + gráfico y lo rasteriza. Devuelve {bytes, w, h} (w, h en px lógicos).
  function svgAPng(svgSrc, titulo, conLeyenda, escala = 2) {
    let svgEl = svgSrc;
    if (typeof svgSrc === 'string') { const d = document.createElement('div'); d.innerHTML = svgSrc; svgEl = d.querySelector('svg'); }
    const P = paleta(); const NS = 'http://www.w3.org/2000/svg';
    const vb = svgEl.viewBox.baseVal; const top = titulo ? (conLeyenda ? 56 : 34) : (conLeyenda ? 26 : 0), W = vb.width, H = vb.height + top;
    const out = document.createElementNS(NS, 'svg');
    out.setAttribute('xmlns', NS); out.setAttribute('width', W); out.setAttribute('height', H); out.setAttribute('viewBox', `0 0 ${W} ${H}`);
    out.setAttribute('font-family', "Arial, 'Segoe UI', system-ui, sans-serif");
    let enc = `<rect width="100%" height="100%" fill="${P.surface}"/>`;
    if (titulo) enc += `<text x="12" y="22" font-size="15" font-weight="600" fill="${P.ink}">${esc(titulo)}</text>`;
    const yl = titulo ? 34 : 6;
    if (conLeyenda) enc += `<rect x="12" y="${yl}" width="12" height="12" rx="3" fill="${P.res}"/><text x="30" y="${yl + 10}" font-size="12" fill="${P.ink2}">Residual</text><rect x="100" y="${yl}" width="12" height="12" rx="3" fill="${P.ext}"/><text x="118" y="${yl + 10}" font-size="12" fill="${P.ink2}">Extraído</text><text x="190" y="${yl + 10}" font-size="12" fill="${P.muted}">Barra completa = inicial</text>`;
    out.innerHTML = enc;
    const g = document.createElementNS(NS, 'g'); g.setAttribute('transform', `translate(0 ${top})`);
    g.innerHTML = svgEl.innerHTML; g.querySelectorAll('[data-tip]').forEach(e => e.removeAttribute('data-tip'));
    out.appendChild(g);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = Math.round(W * escala); c.height = Math.round(H * escala);
        const ctx = c.getContext('2d'); ctx.scale(escala, escala); ctx.drawImage(img, 0, 0);
        c.toBlob(async bl => { if (!bl) return reject(new Error('No se pudo generar la imagen')); resolve({ blob: bl, bytes: new Uint8Array(await bl.arrayBuffer()), w: W, h: H }); }, 'image/png');
      };
      img.onerror = () => reject(new Error('No se pudo rasterizar el gráfico'));
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(out));
    });
  }
  async function descargarPNG(svgEl, nombre, titulo, conLeyenda) {
    const { blob } = await svgAPng(svgEl, titulo, conLeyenda);
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre + '.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  /* ---------- datos y figuras de un rodal (para informe PDF y Excel) ---------- */
  function datosRodal(r) {
    const filas = r.tabla.filter((f, i) => r.tabla.slice(i).some(x => x.tot.ini.n > 0) && r.tabla.slice(0, i + 1).some(x => x.tot.ini.n > 0));
    const ps = r.parcelas, sp = r.porEspecie.filter(e => e.ini.n > 0), parcelasId = ps.map(p => p.parcela);
    const cuentaRes = {}; r.arboles.forEach(a => { const k = a.key + '|' + a.parcela; cuentaRes[k] = (cuentaRes[k] || 0) + a.res; });
    const dmcSp = (e, w, res) => { let s2 = 0, q = 0; r.arboles.filter(t => t.key === e.key).forEach(t => { const p = w(t); const d = res ? t.dapRes : t.dap; s2 += p * d * d; q += p; }); return q > 0 ? Math.sqrt(s2 / q) : null; };
    const estructura = sp.map(e => ({ nombre: e.nombre, nIni: r.tot.ini.n ? e.ini.n / r.tot.ini.n * 100 : 0, nRes: r.tot.res.n ? e.res.n / r.tot.res.n * 100 : 0, gIni: r.tot.ini.g ? e.ini.g / r.tot.ini.g * 100 : 0, gRes: r.tot.res.g ? e.res.g / r.tot.res.g * 100 : 0, dmcIni: dmcSp(e, () => 1), dmcRes: dmcSp(e, t => t.res, true) }));
    const disp = sp.map(e => ({ nombre: e.nombre, d: dispersion(parcelasId.map(p => (ps.find(x => x.parcela === p).cuenta || {})[e.key] || 0)) }));
    return { filas, ps, sp, parcelasId, cuentaRes, estructura, disp };
  }
  // En el PDF los gráficos se imprimen a media hoja: letra de ejes mayor, barras más anchas y eje de intensidad de extracción
  // Todos los gráficos se imprimen al mismo ancho de columna: para que la letra se vea del mismo tamaño que en el
  // gráfico 1 (viewBox de 900 de ancho, factor 1,5), el factor de cada gráfico se ajusta al ancho de su viewBox.
  const PDF_FS = 1.5, PDF_FS_680 = PDF_FS * 680 / 900;
  // la matriz espacial cambia de ancho con el factor: se resuelve por iteración (ancho = nombres + parcelas·celda + 10)
  const fsMapa = (nombres, nParcelas) => { let fs = 1; for (let k = 0; k < 20; k++) fs = PDF_FS * geoMapa(nombres, nParcelas, fs).W / 900; return fs; };
  function figurasRodal(r) {
    FORZAR_CLARA = true;
    try {
      const D = datosRodal(r), fmtC = (x) => fmt(x, x % 1 ? 1 : 0);
      const figs = [
        { id: 'dd', titulo: '1. Efecto de la intervención sobre la distribución diamétrica', sub: `DMC ${fmt(r.DMCini)} → ${fmt(r.DMCres)} cm · densidad ${fmt(r.tot.ini.n, 0)} → ${fmt(r.tot.res.n, 0)} árb/ha`, leyenda: true, ancho: 'completo',
          svg: barrasApiladas({ cats: D.filas.map(f => fmtC(f.clase.mc)), res: D.filas.map(f => f.tot.res.n), ext: D.filas.map(f => f.tot.ini.n - f.tot.res.n), yLabel: 'Densidad (árb/ha)', xLabel: 'Marca de clase diamétrica (cm)', ancho: 900, fs: PDF_FS, intensidad: true, anchoBarra: 0.8 }) },
        { id: 'np', titulo: '2a. Densidad por parcela', sub: `Media ${fmt(r.tot.ini.n, 0)} → ${fmt(r.tot.res.n, 0)} árb/ha`, leyenda: true,
          svg: barrasApiladas({ cats: D.ps.map(p => p.parcela), res: D.ps.map(p => p.nRes || 0), ext: D.ps.map(p => p.n - (p.nRes || 0)), yLabel: 'Densidad (árb/ha)', xLabel: 'Parcela', fs: PDF_FS_680, intensidad: true, anchoBarra: 0.72 }) },
        { id: 'gp', titulo: '2b. Área basal por parcela', sub: `Media ${fmt(r.tot.ini.g, 2)} → ${fmt(r.tot.res.g, 2)} m²/ha`, leyenda: true,
          svg: barrasApiladas({ cats: D.ps.map(p => p.parcela), res: D.ps.map(p => p.gRes || 0), ext: D.ps.map(p => p.g - (p.gRes || 0)), yLabel: 'Área basal (m²/ha)', xLabel: 'Parcela', dec: 2, fs: PDF_FS_680, intensidad: true, anchoBarra: 0.72 }) },
        { id: 'ni', titulo: '3a. Densidad inicial por clase diamétrica y especie', sub: 'Antes de la intervención. Misma escala que el 3b.', leyenda: false,
          svg: lineasEspecies({ filas: D.filas, especies: D.sp, variable: 'n', serie: 'ini', xLabel: 'Marca de clase diamétrica (cm)', yLabel: 'Densidad (árb/ha)', fs: PDF_FS_680 }) },
        { id: 'nr', titulo: '3b. Densidad residual por clase diamétrica y especie', sub: 'Después de la intervención. Misma escala que el 3a.', leyenda: false,
          svg: lineasEspecies({ filas: D.filas, especies: D.sp, variable: 'n', serie: 'res', xLabel: 'Marca de clase diamétrica (cm)', yLabel: 'Densidad (árb/ha)', fs: PDF_FS_680 }) }
      ];
      const hm = mapaCalor({ especies: D.sp, parcelas: D.parcelasId, valor: (e, p) => ((D.ps.find(x => x.parcela === p).cuenta || {})[e.key] || 0) * r.FE, valorRes: (e, p) => (D.cuentaRes[e.key + '|' + p] || 0) * r.FE, fs: fsMapa(D.sp.map(e => e.nombre), D.parcelasId.length) });
      figs.push({ id: 'esp', titulo: '4. Distribución espacial por especie (densidad inicial, árb/ha por parcela)', sub: 'Cada fila es una especie, con su propio color; cada celda es una parcela y la intensidad del tono indica la densidad de la especie en esa parcela, relativa a su máximo.', leyenda: false, ancho: 'completo', svg: hm.svg });
      // ejes en negrita: valores y títulos de los ejes, rótulos de clase o parcela e intensidad de extracción
      // (textos en los colores de eje; no se cambian las leyendas de especies ni los números de las celdas del mapa)
      const ejes = [CLARA.muted, CLARA.ink2, CLARA.ext];
      figs.forEach(f => { f.svg = f.svg.replace(/<text ([^>]*?)fill="([^"]+)"([^>]*)>/g, (m, a, col, b) => ejes.includes(col) && !/pointer-events/.test(a + b) ? `<text ${a}fill="${col}" font-weight="bold"${b}>` : m); });
      return { figs, datos: D };
    } finally { FORZAR_CLARA = false; }
  }

  /* ---------- render de la sección ---------- */
  function leyenda() {
    const P = paleta();
    return `<div class="legend"><span><i style="background:${P.res}"></i>Residual</span><span><i style="background:${P.ext}"></i>Extraído</span><span class="muted">Barra completa = inicial</span></div>`;
  }
  function figura(id, titulo, sub, cuerpo, conLeyenda = true) {
    return `<figure class="fig" id="${id}"><div class="fig-head"><div><figcaption>${esc(titulo)}</figcaption>${sub ? `<div class="muted fig-sub">${sub}</div>` : ''}</div><button class="btn ghost small" data-png="${id}">Descargar PNG</button></div>${conLeyenda ? leyenda() : ''}<div class="fig-body">${cuerpo}</div></figure>`;
  }

  function render(contenedor, r, nombreRodal) {
    const ext = r.tot.ext.n > 1e-9;
    // 1. distribución diamétrica
    const filas = r.tabla.filter((f, i) => r.tabla.slice(i).some(x => x.tot.ini.n > 0) && r.tabla.slice(0, i + 1).some(x => x.tot.ini.n > 0));
    const fmtC = (x) => fmt(x, x % 1 ? 1 : 0);
    const g1 = barrasApiladas({
      cats: filas.map(f => fmtC(f.clase.mc)), res: filas.map(f => f.tot.res.n), ext: filas.map(f => f.tot.ini.n - f.tot.res.n),
      yLabel: 'Densidad (árb/ha)', xLabel: 'Marca de clase diamétrica (cm)', dec: 0, ancho: 900,
      tipCat: (c) => { const f = filas.find(x => fmtC(x.clase.mc) === c); return `Clase ${fmtC(f.clase.li)} – ${fmtC(f.clase.ls)} cm`; }
    });
    // 2. densidad y área basal por parcela
    const ps = r.parcelas;
    const g2a = barrasApiladas({ cats: ps.map(p => p.parcela), res: ps.map(p => p.nRes || 0), ext: ps.map(p => p.n - (p.nRes || 0)), yLabel: 'Densidad (árb/ha)', xLabel: 'Parcela', dec: 0, tipCat: c => 'Parcela ' + c });
    const g2b = barrasApiladas({ cats: ps.map(p => p.parcela), res: ps.map(p => p.gRes || 0), ext: ps.map(p => p.g - (p.gRes || 0)), yLabel: 'Área basal (m²/ha)', xLabel: 'Parcela', dec: 2, tipCat: c => 'Parcela ' + c });
    // 3. estructura por especie
    const sp = r.porEspecie.filter(e => e.ini.n > 0);
    const g3a = lineasEspecies({ filas, especies: sp, variable: 'n', xLabel: 'Marca de clase diamétrica (cm)', yLabel: 'Densidad (árb/ha)' });
    const g3b = lineasEspecies({ filas, especies: sp, variable: 'g', xLabel: 'Marca de clase diamétrica (cm)', yLabel: 'Área basal (m²/ha)' });
    const pctN = (e) => r.tot.ini.n ? e.ini.n / r.tot.ini.n * 100 : 0, pctNr = (e) => r.tot.res.n ? e.res.n / r.tot.res.n * 100 : 0;
    const pctG = (e) => r.tot.ini.g ? e.ini.g / r.tot.ini.g * 100 : 0, pctGr = (e) => r.tot.res.g ? e.res.g / r.tot.res.g * 100 : 0;
    const tablaEstr = `<div class="table-wrap" style="margin-top:10px"><table class="data"><thead><tr><th>Especie</th><th class="num">N inicial (%)</th><th class="num">N residual (%)</th><th class="num">G inicial (%)</th><th class="num">G residual (%)</th><th class="num">DMC inicial (cm)</th><th class="num">DMC residual (cm)</th></tr></thead><tbody>` +
      sp.map(e => { const a = r.arboles.filter(t => t.key === e.key); const dmc = (w, res) => { let s = 0, q = 0; a.forEach(t => { const p = w(t); const d = res ? t.dapRes : t.dap; s += p * d * d; q += p; }); return q > 0 ? Math.sqrt(s / q) : null; };
        return `<tr><td>${esc(e.nombre)}</td><td class="num">${fmt(pctN(e))}</td><td class="num">${fmt(pctNr(e))}</td><td class="num">${fmt(pctG(e))}</td><td class="num">${fmt(pctGr(e))}</td><td class="num">${fmt(dmc(() => 1))}</td><td class="num">${fmt(dmc(t => t.res, true))}</td></tr>`; }).join('') + '</tbody></table></div>';
    // 4. distribución espacial
    const FE = r.FE;
    const parcelasId = ps.map(p => p.parcela);
    const cuentaRes = {};
    r.arboles.forEach(a => { const k = a.key + '|' + a.parcela; cuentaRes[k] = (cuentaRes[k] || 0) + a.res; });
    const hm = mapaCalor({ especies: sp, parcelas: parcelasId, valor: (e, p) => ((ps.find(x => x.parcela === p).cuenta || {})[e.key] || 0) * FE, valorRes: (e, p) => (cuentaRes[e.key + '|' + p] || 0) * FE });
    const P = paleta();
    const escala = `<div class="legend"><span class="muted">Color por especie; tono más intenso = mayor densidad de la especie (relativa a su máximo):</span><span><i style="background:${P.empty};border:1px solid var(--line)"></i>0</span>${sp.map((e, i) => `<span><i style="background:${colorEspecie(i)}"></i>${esc(e.nombre)}</span>`).join('')}</div>`;
    const disp = sp.map(e => ({ e, d: dispersion(parcelasId.map(p => (ps.find(x => x.parcela === p).cuenta || {})[e.key] || 0)) }));
    const tagP = { 'Agregada': 'warn', 'Aleatoria': 'info', 'Regular (uniforme)': 'ok', 'Datos insuficientes': 'neutral' };
    const tablaDisp = `<div class="table-wrap" style="margin-top:10px"><table class="data"><thead><tr><th>Especie</th><th class="num">Árboles medidos</th><th class="num">Frecuencia (% parcelas)</th><th class="num">Media por parcela</th><th class="num">Varianza</th><th>Distribución espacial</th></tr></thead><tbody>` +
      disp.map(({ e, d }) => `<tr><td>${esc(e.nombre)}</td><td class="num">${d.Nt}</td><td class="num">${d.presencia == null ? '—' : fmt(d.presencia, 0)}</td><td class="num">${d.media == null ? '—' : fmt(d.media, 2)}</td><td class="num">${d.var == null ? '—' : fmt(d.var, 2)}</td><td><span class="tag ${tagP[d.patron]}">${esc(d.patron)}</span></td></tr>`).join('') + '</tbody></table></div>' +
      `<p class="muted" style="font-size:12px;margin:8px 0 0">Distribución de los individuos entre las parcelas del rodal (el inventario no registra coordenadas). La distribución espacial (agregada, aleatoria o regular) se clasifica comparando la varianza con la media por parcela, al 95 % de confianza.</p>`;

    contenedor.innerHTML = `
      <div class="card">
        <div class="card-head"><h2>Gráficos · rodal ${esc(nombreRodal)}</h2>${ext ? '' : '<span class="tag neutral">Sin intervención definida: residual = inicial</span>'}</div>
        <p class="muted">Intervención: ${esc(r.bases.actividad && r.bases.actividad.id !== 'NINGUNA' ? r.bases.actividad.nombre : 'no definida')} · extracción de ${fmt(r.tot.ext.n, 0)} árb/ha y ${fmt(r.tot.ext.g, 2)} m²/ha (${fmt(r.tot.ini.g ? r.tot.ext.g / r.tot.ini.g * 100 : 0)} % del área basal). Pase el cursor sobre las barras para ver los valores.</p>
        ${figura('fig-dd', '1. Efecto de la intervención sobre la distribución diamétrica', `DMC ${fmt(r.DMCini)} → ${fmt(r.DMCres)} cm · densidad ${fmt(r.tot.ini.n, 0)} → ${fmt(r.tot.res.n, 0)} árb/ha`, g1)}
      </div>
      <div class="card">
        <h2>2. Efecto sobre la densidad y el área basal por parcela</h2>
        <div class="grid2 eq">
          ${figura('fig-np', 'Densidad por parcela', `Media ${fmt(r.tot.ini.n, 0)} → ${fmt(r.tot.res.n, 0)} árb/ha`, g2a)}
          ${figura('fig-gp', 'Área basal por parcela', `Media ${fmt(r.tot.ini.g, 2)} → ${fmt(r.tot.res.g, 2)} m²/ha`, g2b)}
        </div>
      </div>
      <div class="card">
        <h2>3. Efecto sobre la estructura por especie</h2>
        <div class="grid2 eq">
          ${figura('fig-ne', 'Densidad por clase diamétrica y especie', 'Línea continua = inicial; segmentada = residual. El cursor muestra los valores de cada clase.', g3a, false)}
          ${figura('fig-ge', 'Área basal por clase diamétrica y especie', 'Línea continua = inicial; segmentada = residual. El cursor muestra los valores de cada clase.', g3b, false)}
        </div>
        ${tablaEstr}
      </div>
      <div class="card">
        <h2>4. Distribución espacial por especie</h2>
        ${figura('fig-esp', 'Densidad inicial por especie y parcela', 'Cada especie tiene su color; la intensidad del tono indica la densidad (árb/ha) de la especie en cada parcela, relativa a su máximo. El número de cada celda es la densidad; el cursor muestra también la densidad residual.', `<div class="heat-wrap">${hm.svg}</div>`, false).replace('<div class="fig-body">', escala + '<div class="fig-body">')}
        ${tablaDisp}
      </div>`;
    activarTooltips(contenedor);
    contenedor.querySelectorAll('[data-png]').forEach(b => b.addEventListener('click', () => {
      const fig = contenedor.querySelector('#' + b.dataset.png);
      descargarPNG(fig.querySelector('svg'), `rodal_${nombreRodal}_${b.dataset.png}`, `Rodal ${nombreRodal} · ${fig.querySelector('figcaption').textContent}`, !['fig-esp', 'fig-ne', 'fig-ge'].includes(b.dataset.png));
    }));
  }

  window.GRAFICOS = { render, dispersion, figurasRodal, svgAPng };
})();
