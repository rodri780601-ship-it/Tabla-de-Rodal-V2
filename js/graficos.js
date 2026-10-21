/* Gráficos de la sección 5 (SVG generado sin librerías externas).
   Codificación fija en todos los gráficos: azul = residual, naranja = extraído (barra completa = inicial). */
(function () {
  'use strict';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : Number(x).toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });

  function paleta() {
    const cs = getComputedStyle(document.documentElement);
    const g = (v, def) => (cs.getPropertyValue(v) || '').trim() || def;
    return {
      res: g('--c-res', '#2a78d6'), ext: g('--c-ext', '#eb6834'), grid: g('--c-grid', '#e1e0d9'), axis: g('--c-axis', '#c3c2b7'),
      ink: g('--ink', '#1d2420'), ink2: g('--ink-2', '#4d5650'), muted: g('--c-muted', '#898781'), surface: g('--surface', '#ffffff'), empty: g('--surface-2', '#f8f7f3'),
      ramp: g('--c-ramp', '#cde2fb,#9ec5f4,#6da7ec,#3987e5,#256abf,#184f95,#0d366b').split(',').map(x => x.trim())
    };
  }

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
  function barrasApiladas({ cats, res, ext, yLabel, dec = 0, xLabel, tipCat, ancho }) {
    const P = paleta();
    const W = ancho || 680, H = 300, m = { l: 58, r: 12, t: 14, b: xLabel ? 54 : 40 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const max = niceMax(Math.max(...cats.map((_, i) => res[i] + ext[i]), 0));
    const y = (v) => m.t + ih - v / max * ih;
    const bw = iw / cats.length, pad = Math.min(10, bw * 0.18), w = Math.max(2, bw - 2 * pad);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" class="chart" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif">`;
    ticks(max).forEach(t => { s += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}" stroke="${t === 0 ? P.axis : P.grid}" stroke-width="1"/><text x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${P.muted}">${fmt(t, decTick(max))}</text>`; });
    s += `<text transform="translate(14 ${m.t + ih / 2}) rotate(-90)" text-anchor="middle" font-size="11.5" fill="${P.ink2}">${esc(yLabel)}</text>`;
    const cada = Math.ceil(cats.length / 18);
    cats.forEach((c, i) => {
      const x = m.l + i * bw + pad, r0 = res[i], e0 = ext[i];
      const yr = y(r0), ye = y(r0 + e0), gap = r0 > 0 && e0 > 0 ? 2 : 0;
      const tip = `${tipCat ? tipCat(c) : esc(c)}|Inicial: ${fmt(r0 + e0, dec)}|Residual: ${fmt(r0, dec)}|Extraído: ${fmt(e0, dec)}`;
      if (e0 > 0) s += `<path d="${barPath(x, ye, w, (yr - ye) - gap, false)}" fill="${P.ext}"/>`;
      if (r0 > 0) s += e0 > 0 ? `<rect x="${x}" y="${yr}" width="${w}" height="${m.t + ih - yr}" fill="${P.res}"/>` : `<path d="${barPath(x, yr, w, m.t + ih - yr, false)}" fill="${P.res}"/>`;
      s += `<rect x="${m.l + i * bw}" y="${m.t}" width="${bw}" height="${ih}" fill="transparent" data-tip="${esc(tip)}"/>`;
      if (i % cada === 0) s += `<text x="${m.l + i * bw + bw / 2}" y="${m.t + ih + 16}" text-anchor="middle" font-size="11" fill="${P.muted}">${esc(c)}</text>`;
    });
    if (xLabel) s += `<text x="${m.l + iw / 2}" y="${H - 8}" text-anchor="middle" font-size="11.5" fill="${P.ink2}">${esc(xLabel)}</text>`;
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
    ticks(max).forEach(t => { s += `<line y1="${m.t}" y2="${H - m.b}" x1="${x(t)}" x2="${x(t)}" stroke="${t === 0 ? P.axis : P.grid}"/><text x="${x(t)}" y="${H - m.b + 16}" text-anchor="middle" font-size="11" fill="${P.muted}">${fmt(t, decTick(max))}</text>`; });
    s += `<text x="${m.l + iw / 2}" y="${H - 6}" text-anchor="middle" font-size="11.5" fill="${P.ink2}">${esc(xLabel)}</text>`;
    cats.forEach((c, i) => {
      const yy = m.t + i * rowH + 5, h = rowH - 10, r0 = res[i], e0 = ext[i];
      const gap = r0 > 0 && e0 > 0 ? 2 : 0;
      if (r0 > 0) s += e0 > 0 ? `<rect x="${m.l}" y="${yy}" width="${x(r0) - m.l}" height="${h}" fill="${P.res}"/>` : `<path d="${barPath(m.l, yy, x(r0) - m.l, h, true)}" fill="${P.res}"/>`;
      if (e0 > 0) s += `<path d="${barPath(x(r0) + gap, yy, x(r0 + e0) - x(r0) - gap, h, true)}" fill="${P.ext}"/>`;
      const nom = c.length > 22 ? c.slice(0, 21) + '…' : c;
      s += `<text x="${m.l - 8}" y="${yy + h / 2 + 4}" text-anchor="end" font-size="11.5" fill="${P.ink}">${esc(nom)}</text>`;
      s += `<text x="${x(r0 + e0) + 6}" y="${yy + h / 2 + 4}" font-size="11" fill="${P.ink2}">${fmt(r0 + e0, dec)}</text>`;
      s += `<rect x="0" y="${m.t + i * rowH}" width="${W}" height="${rowH}" fill="transparent" data-tip="${esc(`${c}|Inicial: ${fmt(r0 + e0, dec)}|Residual: ${fmt(r0, dec)}|Extraído: ${fmt(e0, dec)}`)}"/>`;
    });
    return s + '</svg>';
  }

  /* ---------- mapa de calor especie × parcela ---------- */
  function mapaCalor({ especies, parcelas, valor, valorRes }) {
    const P = paleta();
    const cw = Math.max(30, Math.min(54, 560 / Math.max(1, parcelas.length))), ch = 26, m = { l: 150, t: 34, r: 10, b: 10 };
    const W = m.l + parcelas.length * cw + m.r, H = m.t + especies.length * ch + m.b;
    const max = Math.max(...especies.flatMap(e => parcelas.map(p => valor(e, p))), 0);
    const color = (v) => { if (!(v > 0)) return P.empty; const k = Math.min(P.ramp.length - 1, Math.floor(v / max * P.ramp.length - 1e-9)); return P.ramp[Math.max(0, k)]; };
    const lum = (hex) => { const n = parseInt(hex.replace('#', ''), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const tinta = (v) => { if (!(v > 0)) return P.muted; return lum(color(v)) < 0.25 ? '#ffffff' : '#0b0b0b'; };
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" class="chart heat" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif">`;
    s += `<text x="${m.l}" y="12" font-size="11" fill="${P.ink2}">Parcela</text>`;
    parcelas.forEach((p, j) => { s += `<text x="${m.l + j * cw + cw / 2}" y="${m.t - 8}" text-anchor="middle" font-size="11" fill="${P.muted}">${esc(p)}</text>`; });
    especies.forEach((e, i) => {
      const nom = e.nombre.length > 22 ? e.nombre.slice(0, 21) + '…' : e.nombre;
      s += `<text x="${m.l - 8}" y="${m.t + i * ch + ch / 2 + 4}" text-anchor="end" font-size="11.5" fill="${P.ink}">${esc(nom)}</text>`;
      parcelas.forEach((p, j) => {
        const v = valor(e, p), vr = valorRes(e, p);
        const x = m.l + j * cw + 1, y = m.t + i * ch + 1;
        s += `<rect x="${x}" y="${y}" width="${cw - 2}" height="${ch - 2}" rx="3" fill="${color(v)}" data-tip="${esc(`${e.nombre} · parcela ${p}|Inicial: ${fmt(v, 0)} árb/ha|Residual: ${fmt(vr, 0)} árb/ha`)}"/>`;
        if (cw >= 30) s += `<text x="${x + (cw - 2) / 2}" y="${y + ch / 2 + 2}" text-anchor="middle" font-size="10" fill="${tinta(v)}" pointer-events="none">${v > 0 ? fmt(v, 0) : '·'}</text>`;
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
  function descargarPNG(svgEl, nombre, titulo, conLeyenda) {
    const P = paleta(); const NS = 'http://www.w3.org/2000/svg';
    const vb = svgEl.viewBox.baseVal; const top = conLeyenda ? 56 : 34, W = vb.width, H = vb.height + top;
    const out = document.createElementNS(NS, 'svg');
    out.setAttribute('xmlns', NS); out.setAttribute('width', W); out.setAttribute('height', H); out.setAttribute('viewBox', `0 0 ${W} ${H}`);
    out.setAttribute('font-family', "system-ui, -apple-system, 'Segoe UI', sans-serif");
    let enc = `<rect width="100%" height="100%" fill="${P.surface}"/><text x="12" y="22" font-size="15" font-weight="600" fill="${P.ink}">${esc(titulo)}</text>`;
    if (conLeyenda) enc += `<rect x="12" y="34" width="12" height="12" rx="3" fill="${P.res}"/><text x="30" y="44" font-size="12" fill="${P.ink2}">Residual</text><rect x="100" y="34" width="12" height="12" rx="3" fill="${P.ext}"/><text x="118" y="44" font-size="12" fill="${P.ink2}">Extraído</text><text x="190" y="44" font-size="12" fill="${P.muted}">Barra completa = inicial</text>`;
    out.innerHTML = enc;
    const g = document.createElementNS(NS, 'g'); g.setAttribute('transform', `translate(0 ${top})`);
    g.innerHTML = svgEl.innerHTML; g.querySelectorAll('[data-tip]').forEach(e => e.removeAttribute('data-tip'));
    out.appendChild(g);
    const k = 2, img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = W * k; c.height = H * k;
      const ctx = c.getContext('2d'); ctx.scale(k, k); ctx.drawImage(img, 0, 0);
      c.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = nombre + '.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); });
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(out));
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
    const g3a = barrasHorizontales({ cats: sp.map(e => e.nombre), res: sp.map(e => e.res.n), ext: sp.map(e => e.ext.n), xLabel: 'Densidad (árb/ha)', dec: 0 });
    const g3b = barrasHorizontales({ cats: sp.map(e => e.nombre), res: sp.map(e => e.res.g), ext: sp.map(e => e.ext.g), xLabel: 'Área basal (m²/ha)', dec: 2 });
    const pctN = (e) => r.tot.ini.n ? e.ini.n / r.tot.ini.n * 100 : 0, pctNr = (e) => r.tot.res.n ? e.res.n / r.tot.res.n * 100 : 0;
    const pctG = (e) => r.tot.ini.g ? e.ini.g / r.tot.ini.g * 100 : 0, pctGr = (e) => r.tot.res.g ? e.res.g / r.tot.res.g * 100 : 0;
    const tablaEstr = `<div class="table-wrap" style="margin-top:10px"><table class="data"><thead><tr><th>Especie</th><th class="num">N inicial (%)</th><th class="num">N residual (%)</th><th class="num">G inicial (%)</th><th class="num">G residual (%)</th><th class="num">DMC inicial (cm)</th><th class="num">DMC residual (cm)</th></tr></thead><tbody>` +
      sp.map(e => { const a = r.arboles.filter(t => t.key === e.key); const dmc = (w) => { let s = 0, q = 0; a.forEach(t => { const p = w(t); s += p * t.dap * t.dap; q += p; }); return q > 0 ? Math.sqrt(s / q) : null; };
        return `<tr><td>${esc(e.nombre)}</td><td class="num">${fmt(pctN(e))}</td><td class="num">${fmt(pctNr(e))}</td><td class="num">${fmt(pctG(e))}</td><td class="num">${fmt(pctGr(e))}</td><td class="num">${fmt(dmc(() => 1))}</td><td class="num">${fmt(dmc(t => t.res))}</td></tr>`; }).join('') + '</tbody></table></div>';
    // 4. distribución espacial
    const FE = r.FE;
    const parcelasId = ps.map(p => p.parcela);
    const cuentaRes = {};
    r.arboles.forEach(a => { const k = a.key + '|' + a.parcela; cuentaRes[k] = (cuentaRes[k] || 0) + a.res; });
    const hm = mapaCalor({ especies: sp, parcelas: parcelasId, valor: (e, p) => ((ps.find(x => x.parcela === p).cuenta || {})[e.key] || 0) * FE, valorRes: (e, p) => (cuentaRes[e.key + '|' + p] || 0) * FE });
    const P = paleta();
    const escala = `<div class="legend"><span class="muted">Árb/ha por parcela:</span><span><i style="background:${P.empty};border:1px solid var(--line)"></i>0</span>${P.ramp.map((c, k) => `<span><i style="background:${c}"></i>${k === 0 ? '> 0' : k === P.ramp.length - 1 ? '≤ ' + fmt(hm.max, 0) : ''}</span>`).join('')}</div>`;
    const disp = sp.map(e => ({ e, d: dispersion(parcelasId.map(p => (ps.find(x => x.parcela === p).cuenta || {})[e.key] || 0)) }));
    const tagP = { 'Agregada': 'warn', 'Aleatoria': 'info', 'Regular (uniforme)': 'ok', 'Datos insuficientes': 'neutral' };
    const tablaDisp = `<div class="table-wrap" style="margin-top:10px"><table class="data"><thead><tr><th>Especie</th><th class="num">Árboles medidos</th><th class="num">Frecuencia (% parcelas)</th><th class="num">Media por parcela</th><th class="num">Varianza</th><th class="num">Índice de dispersión (S²/x̄)</th><th class="num">Morisita (Iδ)</th><th class="num">χ² (gl = n−1)</th><th>Distribución espacial</th></tr></thead><tbody>` +
      disp.map(({ e, d }) => `<tr><td>${esc(e.nombre)}</td><td class="num">${d.Nt}</td><td class="num">${d.presencia == null ? '—' : fmt(d.presencia, 0)}</td><td class="num">${d.media == null ? '—' : fmt(d.media, 2)}</td><td class="num">${d.var == null ? '—' : fmt(d.var, 2)}</td><td class="num">${d.id == null ? '—' : fmt(d.id, 2)}</td><td class="num">${d.mor == null ? '—' : fmt(d.mor, 2)}</td><td class="num">${d.chi == null ? '—' : fmt(d.chi, 2) + ` <span class="muted">(${fmt(d.lo, 1)}–${fmt(d.hi, 1)})</span>`}</td><td><span class="tag ${tagP[d.patron]}">${esc(d.patron)}</span></td></tr>`).join('') + '</tbody></table></div>' +
      `<p class="muted" style="font-size:12px;margin:8px 0 0">Distribución de los individuos entre las parcelas del rodal (el inventario no registra coordenadas). Prueba χ² del índice de dispersión al 95 %: sobre el límite superior la especie se distribuye en forma agregada, bajo el límite inferior en forma regular y entre ambos en forma aleatoria. Morisita: Iδ ≈ 1 aleatoria, &gt; 1 agregada, &lt; 1 regular.</p>`;

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
          ${figura('fig-ne', 'Densidad por especie', '', g3a)}
          ${figura('fig-ge', 'Área basal por especie', '', g3b)}
        </div>
        ${tablaEstr}
      </div>
      <div class="card">
        <h2>4. Distribución espacial por especie</h2>
        ${figura('fig-esp', 'Densidad inicial por especie y parcela', 'Cada celda es una parcela; el tono indica la densidad (árb/ha). El cursor muestra también la densidad residual.', `<div class="heat-wrap">${hm.svg}</div>`, false).replace('<div class="fig-body">', escala + '<div class="fig-body">')}
        ${tablaDisp}
      </div>`;
    activarTooltips(contenedor);
    contenedor.querySelectorAll('[data-png]').forEach(b => b.addEventListener('click', () => {
      const fig = contenedor.querySelector('#' + b.dataset.png);
      descargarPNG(fig.querySelector('svg'), `rodal_${nombreRodal}_${b.dataset.png}`, `Rodal ${nombreRodal} · ${fig.querySelector('figcaption').textContent}`, b.dataset.png !== 'fig-esp');
    }));
  }

  window.GRAFICOS = { render, dispersion };
})();
