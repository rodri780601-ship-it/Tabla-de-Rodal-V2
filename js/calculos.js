/* Motor de cálculo: catálogo de especies (D.S. 68/2009), categorías MMA, funciones de volumen del compendio,
   tabla de rodal inicial/residual, estadísticos, tipo forestal, estado de desarrollo, categoría de bosque
   (Ley 20.283) y verificación de las Bases Técnicas 2026. */
(function () {
  'use strict';
  const N = window.NORMATIVA;

  /* ======================= Utilidades ======================= */
  const norm = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9ñ\s\.\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const binom = (s) => { const m = String(s || '').match(/([A-Z][a-zë]+)\s+(?:x\s+)?([a-z][a-z\-]+)/); return m ? (m[1] + ' ' + m[2]) : null; };
  const sum = (a) => a.reduce((x, y) => x + y, 0);

  /* ---- Distribución t de Student (cuantil) ---- */
  function lgamma(x) {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x, tmp = x + 5.5; tmp -= (x + 0.5) * Math.log(tmp); let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) ser += c[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  function betacf(a, b, x) {
    const MAXIT = 200, EPS = 3e-14, FPMIN = 1e-300;
    let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; let h = d;
    for (let m = 1; m <= MAXIT; m++) {
      const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function tCdf(t, df) { const x = df / (df + t * t); const p = 0.5 * ibeta(x, df / 2, 0.5); return t > 0 ? 1 - p : p; }
  function tQuantil(p, df) {
    if (!(df > 0)) return NaN;
    let lo = 0, hi = 1000;
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (tCdf(mid, df) < p) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }

  /* ======================= Catálogo de especies (D.S. 68/2009) ======================= */
  // Alias adicionales de uso frecuente en inventarios (sólo apuntan a especies del D.S. 68).
  const ALIAS = {
    'coigue': 'Nothofagus dombeyi', 'coihue': 'Nothofagus dombeyi', 'coigue comun': 'Nothofagus dombeyi', 'coihue comun': 'Nothofagus dombeyi',
    'coigue de chiloe': 'Nothofagus nitida', 'coigue de magallanes': 'Nothofagus betuloides', 'guindo': 'Nothofagus betuloides',
    'manio macho': 'Podocarpus nubigena', 'manio de hojas punzantes': 'Podocarpus nubigena', 'manio hembra': 'Saxegothaea conspicua',
    'manio de hojas cortas': 'Saxegothaea conspicua', 'manio de hojas largas': 'Podocarpus saligna', 'tepa': 'Laureliopsis philippiana',
    'laurel': 'Laurelia sempervirens', 'arrayan': 'Luma apiculata', 'nirre': 'Nothofagus antarctica', 'nire': 'Nothofagus antarctica',
    'patagua': 'Crinodendron patagua', 'luma': 'Amomyrtus luma', 'meli': 'Amomyrtus meli', 'pitra': 'Myrceugenia exsucca',
    'espino': 'Acacia caven', 'litre': 'Lithrea caustica', 'belloto': 'Beilshmiedia miersii', 'belloto del norte': 'Beilshmiedia miersii',
    'avellano': 'Gevuina avellana', 'pellin': 'Nothofagus obliqua', 'hualle': 'Nothofagus obliqua', 'ciprés de la cordillera': 'Austrocedrus chilensis',
    'cipres de la cordillera': 'Austrocedrus chilensis', 'cipres': 'Austrocedrus chilensis', 'cipres de las guaitecas': 'Pilgerodendron uviferum',
    'palma': 'Jubaea chilensis', 'palma chilena': 'Jubaea chilensis', 'peumo': 'Cryptocarya alba', 'boldo': 'Peumus boldus', 'quillay': 'Quillaja saponaria',
    'maiten': 'Maytenus boaria', 'bollen': 'Kageneckia oblonga', 'molle': 'Schinus latifolius', 'algarrobo': 'Prosopis chilensis', 'trevo': 'Dasyphyllum diacanthoides',
    'tiaca': 'Caldcluvia paniculata', 'radal': 'Lomatia hirsuta', 'notro': 'Embothrium coccineum', 'ciruelillo': 'Embothrium coccineum',
    'lleuque': 'Prumnopitys andina', 'olivillo': 'Aextoxicon punctatum', 'canelo': 'Drimys winteri', 'ulmo': 'Eucryphia cordifolia', 'tineo': 'Weinmannia trichosperma',
    'tenio': 'Weinmannia trichosperma', 'teniu': 'Weinmannia trichosperma', 'lingue': 'Persea lingue', 'queule': 'Gomortega keule', 'pitao': 'Pitavia punctata',
    'ruil': 'Nothofagus alessandrii', 'roble de santiago': 'Nothofagus macrocarpa', 'huala': 'Nothofagus leonii', 'lenga': 'Nothofagus pumilio',
    'rauli': 'Nothofagus alpina', 'roble': 'Nothofagus obliqua', 'hualo': 'Nothofagus glauca', 'alerce': 'Fitzroya cupressoides', 'araucaria': 'Araucaria araucana',
    'pehuen': 'Araucaria araucana', 'maqui': 'Aristotelia chilensis', 'chequen': 'Luma chequen', 'temu': 'Blepharocalyx cruckshanksii', 'tepu': 'Tepualia stipularis',
    'huillipatagua': 'Citronella mucronata', 'naranjillo': 'Citronella mucronata', 'guayacan': 'Porlieria chilensis', 'frangel': 'Kageneckia angustifolia',
    'franjel': 'Kageneckia angustifolia', 'huingan': 'Schinus polygamus', 'colliguay': 'Colliguaja integerrima', 'avellanillo': 'Lomatia dentata', 'tamarugo': 'Prosopis tamarugo',
    'sauce chileno': 'Salix humboldtiana', 'chilco': 'Fuchsia magellanica', 'matico': 'Buddleja globosa', 'nalca': null
  };
  // Sinonimias para cruzar con el listado MMA cuando el binomio del D.S. 68 no coincide
  const SINONIMOS_MMA = {
    'Acacia caven': ['Vachellia caven'], 'Beilshmiedia berteroana': ['Beilschmiedia berteroana'], 'Beilshmiedia miersii': ['Beilschmiedia miersii'],
    'Podocarpus saligna': ['Podocarpus salignus'], 'Podocarpus nubigena': ['Podocarpus nubigenus'], 'Lepidothamnus fonckii': ['Lepidothamnus fonkii'],
    'Drymis andina': ['Drimys andina'], 'Lithrea caustica': ['Lithraea caustica'], 'Fagara mayu': ['Zanthoxylum mayu'],
    'Myrceugenia fernadeziana': ['Myrceugenia fernandeziana', 'Nothomyrcia fernandeziana'], 'Dendroseris litorales': ['Dendroseris litoralis'],
    'Dasyphyllum excelsum': ['Archidasyphyllum excelsum'], 'Pilgerodendron uviferum': ['Pilgerodendron uvifera'],
    'Laureliopsis philippiana': ['Laurelia philippiana'], 'Nothofagus alpina': ['Nothofagus nervosa'], 'Echinopsis chiloensis': ['Trichocereus chiloensis', 'Leucostele chiloensis'],
    'Satureja multiflora': ['Clinopodium multiflorum']
  };
  // Nombres de especie usados en el compendio -> binomio del D.S. 68
  const COMPENDIO_SP = {
    'Alerce': 'Fitzroya cupressoides', 'Araucaria': 'Araucaria araucana', 'Arrayán': 'Luma apiculata', 'Avellano': 'Gevuina avellana',
    'Canelo': 'Drimys winteri', 'Ciprés de las Guaitecas': 'Pilgerodendron uviferum', 'Coigüe': 'Nothofagus dombeyi', 'Coigüe de Chiloé': 'Nothofagus nitida',
    'Coigüe de Magallanes': 'Nothofagus betuloides', 'Hualo': 'Nothofagus glauca', 'Laurel': 'Laurelia sempervirens', 'Lenga': 'Nothofagus pumilio',
    'Lingue': 'Persea lingue', 'Luma': 'Amomyrtus luma', 'Mañío de hojas cortas': 'Saxegothaea conspicua', 'Mañío de hojas punzantes': 'Podocarpus nubigena',
    'Maqui': 'Aristotelia chilensis', 'Melí': 'Amomyrtus meli', 'Ñirre': 'Nothofagus antarctica', 'Olivillo': 'Aextoxicon punctatum', 'Peumo': 'Cryptocarya alba',
    'Radal': 'Lomatia hirsuta', 'Raulí': 'Nothofagus alpina', 'Roble': 'Nothofagus obliqua', 'Tamarugo': 'Prosopis tamarugo', 'Tepa': 'Laureliopsis philippiana',
    'Tiaca': 'Caldcluvia paniculata', 'Tineo': 'Weinmannia trichosperma', 'Trevo': 'Dasyphyllum diacanthoides', 'Ulmo': 'Eucryphia cordifolia'
  };
  // Preferencias para nombres comunes que el D.S. 68 asigna a más de una especie
  const PREF_COMUN = {
    'arrayan': 'Luma apiculata', 'nirre': 'Nothofagus antarctica', 'patagua': 'Crinodendron patagua', 'luma': 'Amomyrtus luma', 'palo santo': 'Dasyphyllum diacanthoides',
    'corcolen': 'Azara integrifolia', 'aromo': 'Azara integrifolia', 'michay': 'Berberis darwinii', 'pimiento': 'Schinus molle', 'pircun': 'Anisomeria coriacea',
    'mayu': 'Sophora macrocarpa', 'lilen': 'Azara celastrina', 'quenoa': 'Polylepis rugulosa', 'fosforito': 'Embothrium coccineum', 'siete camisas': 'Escallonia rubra',
    'chagualillo': 'Puya coerulea', 'cardoncillo': 'Ochagavia carnea', 'quisquito': 'Eriosyce subgibbosa', 'ventosilla': 'Argythamnia berteroana', 'tupa': 'Lobelia tupa',
    'adesmia': 'Adesmia confusa', 'dendroseris': 'Dendroseris macrantha', 'paramela': 'Adesmia emarginata', 'petrillo': 'Myrceugenia correifolia',
    'chequen de hoja fina': 'Myrceugenia pinifolia', 'romerillo': 'Baccharis linearis', 'arrayancillo': 'Myrceugenia obtusa', 'naranjillo': 'Citronella mucronata',
    'tabaco del diablo': 'Lobelia tupa', 'chagual': 'Puya chilensis'
  };

  const CAT = { especies: {}, porNombre: {}, ambiguos: {} };
  function construirCatalogo() {
    const D = window.DS68_ESPECIES || [];
    const cuenta = {};
    D.forEach(e => {
      CAT.especies[e.s] = { s: e.s, comun: e.c, autor: e.a, nombreComun: (e.c || '').split(',')[0].trim() || e.s };
      const add = (k) => { k = norm(k); if (!k) return; (cuenta[k] = cuenta[k] || new Set()).add(e.s); };
      add(e.s); const [g, ep] = e.s.split(' '); add(g[0] + '. ' + ep); add(g[0] + ' ' + ep);
      (e.c || '').split(/,|\s\/\s/).forEach(c => add(c));
    });
    Object.entries(cuenta).forEach(([k, set]) => {
      if (set.size === 1) CAT.porNombre[k] = [...set][0];
      else { CAT.ambiguos[k] = [...set]; CAT.porNombre[k] = PREF_COMUN[k] && set.has(PREF_COMUN[k]) ? PREF_COMUN[k] : [...set][0]; }
    });
    Object.entries(ALIAS).forEach(([k, v]) => { if (v && CAT.especies[v]) { CAT.porNombre[norm(k)] = v; delete CAT.ambiguos[norm(k)]; } });
    // nombre común preferido para mostrar
    const visible = {
      'Nothofagus dombeyi': 'Coigüe', 'Nothofagus nitida': 'Coigüe de Chiloé', 'Nothofagus betuloides': 'Coigüe de Magallanes', 'Laureliopsis philippiana': 'Tepa',
      'Fitzroya cupressoides': 'Alerce', 'Araucaria araucana': 'Araucaria', 'Gevuina avellana': 'Avellano', 'Lithrea caustica': 'Litre', 'Acacia caven': 'Espino',
      'Podocarpus nubigena': 'Mañío de hojas punzantes', 'Saxegothaea conspicua': 'Mañío de hojas cortas', 'Myrceugenia exsucca': 'Pitra', 'Nothofagus obliqua': 'Roble',
      'Nothofagus glauca': 'Hualo', 'Jubaea chilensis': 'Palma Chilena', 'Pilgerodendron uviferum': 'Ciprés de las Guaitecas', 'Austrocedrus chilensis': 'Ciprés de la Cordillera',
      'Amomyrtus meli': 'Meli', 'Weinmannia trichosperma': 'Tineo', 'Aextoxicon punctatum': 'Olivillo', 'Kageneckia angustifolia': 'Frangel', 'Embothrium coccineum': 'Notro',
      'Beilshmiedia miersii': 'Belloto del Norte', 'Beilshmiedia berteroana': 'Belloto del Sur', 'Peumus boldus': 'Boldo', 'Eucryphia cordifolia': 'Ulmo', 'Dasyphyllum diacanthoides': 'Trevo'
    };
    Object.entries(visible).forEach(([s, n]) => { if (CAT.especies[s]) CAT.especies[s].nombreComun = n; });
  }

  // Reconoce un nombre del inventario. Devuelve {key, ambiguo:[...]} (key = binomio D.S. 68) o {key:null}
  function reconocerEspecie(texto) {
    const t = norm(texto);
    if (!t) return { key: null };
    if (CAT.porNombre[t]) return { key: CAT.porNombre[t], ambiguo: CAT.ambiguos[t] || null };
    const par = String(texto).match(/\(([^)]+)\)/);
    if (par) {
      const bp = binom(par[1].trim().replace(/^./, c => c.toUpperCase()));
      if (bp && CAT.porNombre[norm(bp)]) return { key: CAT.porNombre[norm(bp)] };
      const antes = norm(String(texto).replace(/\(.*$/, ''));
      if (CAT.porNombre[antes]) return { key: CAT.porNombre[antes], ambiguo: CAT.ambiguos[antes] || null };
    }
    const b = binom(String(texto).trim().replace(/^./, c => c.toUpperCase()));
    if (b && CAT.porNombre[norm(b)]) return { key: CAT.porNombre[norm(b)] };
    // sin tildes / variantes menores: comparar quitando espacios
    const t2 = t.replace(/\s/g, '');
    for (const k of Object.keys(CAT.porNombre)) if (k.replace(/\s/g, '') === t2) return { key: CAT.porNombre[k], ambiguo: CAT.ambiguos[k] || null };
    return { key: null };
  }

  /* ======================= Listado MMA ======================= */
  const ORDEN_REG = ['XV', 'I', 'II', 'III', 'IV', 'V', 'RM', 'VI', 'VII', 'XVI', 'VIII', 'IX', 'XIV', 'X', 'XI', 'XII'];
  let MMA = { fuente: '', fecha: '', idxPrim: {}, idxSin: {}, especies: [] };
  function cargarMMA(listado) {
    MMA = { fuente: listado.fuente, fecha: listado.fecha, especies: listado.especies, idxPrim: {}, idxSin: {} };
    listado.especies.forEach((e, i) => {
      const prim = (String(e.s).match(/[A-Z][a-zë]+ [a-z\-]+/g) || []);
      if (prim.length) (MMA.idxPrim[norm(prim[0])] = MMA.idxPrim[norm(prim[0])] || []).push(i);
      // "anteriormente llamada X"
      prim.slice(1).forEach(p => (MMA.idxSin[norm(p)] = MMA.idxSin[norm(p)] || []).push(i));
      String(e.y || '').split(/[;,]/).forEach(sn => { const b = binom(sn); if (b) (MMA.idxSin[norm(b)] = MMA.idxSin[norm(b)] || []).push(i); });
    });
  }
  // Interpreta una zona (texto entre paréntesis) y devuelve un Set de regiones, o null si no es interpretable.
  function zonaRegiones(z) {
    z = String(z).replace(/\s+/g, ' ').trim();
    if (/chile continental/i.test(z)) return new Set(ORDEN_REG);
    if (/^(JF|IP|DV|SG|ANT)$/i.test(z)) return new Set();
    const set = new Set(); let ok = false;
    z.split(/[;,&]| y /).forEach(tok => {
      const parts = tok.trim().split(/\s*-\s*/).filter(Boolean);
      if (!parts.length || !parts.every(p => ORDEN_REG.includes(p.toUpperCase()))) return;
      ok = true;
      if (parts.length === 1) { const p = parts[0].toUpperCase(); set.add(p); if (p === 'VIII') set.add('XVI'); if (p === 'X') set.add('XIV'); return; }
      for (let i = 0; i < parts.length - 1; i++) {
        let a = ORDEN_REG.indexOf(parts[i].toUpperCase()), b = ORDEN_REG.indexOf(parts[i + 1].toUpperCase());
        if (a > b) [a, b] = [b, a];
        for (let k = a; k <= b; k++) set.add(ORDEN_REG[k]);
      }
    });
    return ok ? set : null;
  }
  // Determina la categoría aplicable a la región del proyecto a partir del texto de "CATEGORÍA VIGENTE".
  function categoriaRegional(raw, region) {
    const txt = String(raw || '').trim();
    if (!txt) return { code: 'NC', regional: false, nota: '' };
    const segs = txt.split(/;|\n/).map(s => s.trim()).filter(Boolean);
    const aplicables = [], dudosas = [];
    let hayZonas = false;
    segs.forEach(sg => {
      const m = sg.match(/^(EX|EW|CR|EN|VU|NT|LC|DD|R)(-R)?\b/i);
      if (!m) return;
      const code = m[1].toUpperCase();
      const z = sg.match(/\(([^)]*)\)\s*$/) || sg.match(/\(([^)]*)\)/);
      if (!z) { aplicables.push(code); return; }
      hayZonas = true;
      const set = zonaRegiones(z[1]);
      if (set === null) dudosas.push({ code, zona: z[1] });
      else if (set.has(region)) aplicables.push(code);
    });
    const peor = (arr) => arr.sort((a, b) => N.CATEGORIAS[b].orden - N.CATEGORIAS[a].orden)[0];
    if (aplicables.length) return { code: peor(aplicables), regional: hayZonas, nota: hayZonas ? 'Categoría diferenciada por zona; se aplica la correspondiente a la región del proyecto.' : '' };
    if (dudosas.length) return { code: peor(dudosas.map(d => d.code)), regional: true, nota: 'Categoría diferenciada por zona (' + dudosas.map(d => d.code + ': ' + d.zona).join('; ') + '). Se adopta la más restrictiva; verifique la zona del predio.' };
    if (hayZonas) return { code: 'NC', regional: true, nota: 'La especie no tiene categoría asignada para la región del proyecto.' };
    return { code: 'NC', regional: false, nota: 'Texto de categoría no interpretado: ' + txt };
  }
  function buscarMMA(key) {
    if (!key) return null;
    const cands = [key, ...(SINONIMOS_MMA[key] || [])];
    for (const c of cands) { const r = MMA.idxPrim[norm(c)]; if (r) return MMA.especies[r[0]]; }
    for (const c of cands) { const r = MMA.idxSin[norm(c)]; if (r && r.length === 1) return MMA.especies[r[0]]; }
    return null;
  }
  function categoriaEspecie(key, region, override) {
    if (override && override.code) return { code: override.code, fuente: 'Asignada manualmente', raw: override.code, nota: override.nota || '', amenazada: !!N.CATEGORIAS[override.code].amenazada };
    if (!key || !CAT.especies[key]) return { code: 'NC', fuente: 'No figura en el D.S. 68/2009', raw: '', amenazada: false, nota: '' };
    const e = buscarMMA(key);
    if (!e) return { code: 'NC', fuente: MMA.fuente, raw: '', amenazada: false, nota: 'No figura en el listado MMA' };
    const c = categoriaRegional(e.k, region);
    return { code: c.code, raw: e.k, fuente: 'MMA ' + (e.d || '') + (e.p !== '' ? ' (' + e.p + '° proceso RCE)' : ''), nota: c.nota, amenazada: !!(N.CATEGORIAS[c.code] || {}).amenazada, mma: e };
  }

  /* ======================= Funciones de volumen ======================= */
  const FN = {};
  function construirFunciones() {
    (window.FUNCIONES_COMPENDIO || []).forEach(f => {
      f.keys = f.especies.map(s => COMPENDIO_SP[s]).filter(Boolean);
      try { f.fn = new Function('D', 'H', 'return ' + f.expr + ';'); } catch (e) { f.fn = null; }
      FN[f.id] = f;
    });
  }
  function puntajeFuncion(f, key, regionComp, preferRenoval) {
    let p = 0;
    if (f.unidad !== 'm3' || !f.fn) return -999;
    p += f.keys.length === 1 ? 30 : (f.keys.length <= 3 ? 12 : 4);
    if (f.regiones.includes(regionComp)) p += 40;
    p += { 'total': 20, 'sin información': 6, 'no aplica': 2, 'copa': -60, 'comercial': -60, 'dominante': -60 }[f.alturaTipo] || 0;
    p += { 'verificada': 25, 'sin tabla': 0, 'discrepancia': -50 }[f.validacion] || 0;
    if (/total/i.test(f.variable)) p += 5;
    if (preferRenoval != null) p += (preferRenoval ? f.estructura === 'Renoval' : f.estructura === 'Bosque Adulto') ? 5 : 0;
    return p;
  }
  function funcionesDeEspecie(key) { return Object.values(FN).filter(f => !f.usuario && f.keys.includes(key)); }

  /* ---- Funciones de volumen definidas por el usuario (especies sin función en el compendio) ----
     La ecuación se analiza con un intérprete propio que sólo admite números, las variables D y H,
     operadores + - * / ^, paréntesis y las funciones ln, log (base 10), exp, sqrt, abs; nunca se evalúa texto arbitrario. */
  const FUNC_PERMITIDAS = { ln: 'Math.log', log: 'Math.log10', log10: 'Math.log10', exp: 'Math.exp', sqrt: 'Math.sqrt', raiz: 'Math.sqrt', abs: 'Math.abs' };
  function compilarEcuacion(txt) {
    let s = String(txt || '').trim();
    if (!s) return { ok: false, error: 'Escriba la ecuación.' };
    s = s.replace(/^\s*v\w*\s*=/i, '')                 // admite "V = ..."
      .replace(/(\d),(\d)/g, '$1.$2')                 // coma decimal
      .replace(/[×·•]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/π/g, 'pi').replace(/√/g, 'sqrt');
    const tk = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      let m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(s.slice(i));
      if (m) { tk.push({ t: 'num', v: m[0] }); i += m[0].length; continue; }
      m = /^[A-Za-zÁÉÍÓÚáéíóúñÑ_][A-Za-z0-9ÁÉÍÓÚáéíóúñÑ_]*/.exec(s.slice(i));
      if (m) {
        const w = m[0].toLowerCase(); i += m[0].length;
        if (w === 'd' || w === 'dap') tk.push({ t: 'var', v: 'D' });
        else if (w === 'h' || w === 'ht' || w === 'altura') tk.push({ t: 'var', v: 'H' });
        else if (w === 'pi') tk.push({ t: 'num', v: String(Math.PI) });
        else if (FUNC_PERMITIDAS[w]) tk.push({ t: 'fn', v: FUNC_PERMITIDAS[w] });
        else return { ok: false, error: `"${m[0]}" no es una variable ni función reconocida. Use D (DAP, cm), H (altura, m), ln, log, exp, sqrt, abs, pi.` };
        continue;
      }
      if ('+-*/^()'.includes(c)) { tk.push({ t: c }); i++; continue; }
      if (c === '[' || c === '{') { tk.push({ t: '(' }); i++; continue; }
      if (c === ']' || c === '}') { tk.push({ t: ')' }); i++; continue; }
      return { ok: false, error: `Carácter no permitido: "${c}".` };
    }
    let p = 0; let usaH = false;
    const ver = () => tk[p] || { t: 'fin' };
    const inicioAtomo = (x) => x.t === 'num' || x.t === 'var' || x.t === 'fn' || x.t === '(';
    function expr() { let a = term(); while (ver().t === '+' || ver().t === '-') { const o = tk[p++].t; a = `(${a}${o}${term()})`; } return a; }
    function term() {
      let a = unario();
      for (;;) {
        const x = ver();
        if (x.t === '*' || x.t === '/') { p++; a = `(${a}${x.t}${unario()})`; }
        else if (inicioAtomo(x)) a = `(${a}*${unario()})`;         // multiplicación implícita: 0.00005 D^2 H
        else return a;
      }
    }
    function unario() { const x = ver(); if (x.t === '-') { p++; return `(-${unario()})`; } if (x.t === '+') { p++; return unario(); } return potencia(); }
    function potencia() { const b = atomo(); if (ver().t === '^') { p++; return `Math.pow(${b},${unario()})`; } return b; }
    function atomo() {
      const x = tk[p++] || { t: 'fin' };
      if (x.t === 'num') return `(${Number(x.v)})`;
      if (x.t === 'var') { if (x.v === 'H') usaH = true; return x.v; }
      if (x.t === 'fn') { if (ver().t !== '(') throw new Error('Después de una función debe ir un paréntesis, por ejemplo ln(D).'); p++; const a = expr(); if (ver().t !== ')') throw new Error('Falta cerrar un paréntesis.'); p++; return `${x.v}(${a})`; }
      if (x.t === '(') { const a = expr(); if (ver().t !== ')') throw new Error('Falta cerrar un paréntesis.'); p++; return a; }
      throw new Error(x.t === 'fin' ? 'La ecuación termina de forma incompleta.' : `Símbolo inesperado "${x.t}".`);
    }
    let js;
    try { js = expr(); if (p < tk.length) throw new Error(tk[p].t === ')' ? 'Sobra un paréntesis de cierre.' : 'Hay símbolos que no se pudieron interpretar.'); }
    catch (e) { return { ok: false, error: e.message }; }
    if (!/D/.test(js)) return { ok: false, error: 'La ecuación debe usar al menos el DAP (D).' };
    let fn; try { fn = new Function('D', 'H', '"use strict"; return ' + js + ';'); } catch (e) { return { ok: false, error: 'Ecuación no válida.' }; }
    return { ok: true, js, fn, usaH };
  }
  function idUsuario(key) { return 'U:' + key; }
  function registrarFuncionUsuario(key, def) {
    const c = compilarEcuacion(def.ecuacion);
    if (!c.ok) { delete FN[idUsuario(key)]; return c; }
    FN[idUsuario(key)] = {
      id: idUsuario(key), usuario: true, especies: [def.especie || key.replace(/^X:/, '')], keys: [key], regiones: ['—'],
      usaH: c.usaH, alturaTipo: c.usaH ? 'total' : 'no aplica', alturaDesc: c.usaH ? 'Altura promedio de la especie (sección 2)' : '', unidad: 'm3',
      validacion: 'definida por el usuario', eq: def.ecuacion, expr: c.js, fn: c.fn, pag: '—', estructura: '—', localidad: '—',
      variable: def.variable || 'Volumen por árbol (m³)', dlu: '', rangoD: def.rangoD || '', rangoH: '', fuente: def.fuente || 'Definida por el usuario', anio: def.anio || '', r2: '', muestra: '',
      nota: 'Función ingresada por el usuario porque la especie no tiene función en el Compendio de Funciones Dendrométricas del Bosque Nativo. Su validez es responsabilidad del profesional.'
    };
    return { ok: true, fid: idUsuario(key), usaH: c.usaH };
  }
  function eliminarFuncionUsuario(key) { delete FN[idUsuario(key)]; }
  function etiquetaFid(fid) { const f = FN[fid]; return !f ? 'Sin función' : f.usuario ? 'Definida por el usuario' : 'N° ' + f.id; }
  function ordenFid(a, b) { const ua = typeof a === 'string', ub = typeof b === 'string'; return ua !== ub ? (ua ? 1 : -1) : ua ? a.localeCompare(b) : a - b; }
  function funcionPorDefecto(key, regionComp, preferRenoval) {
    const c = funcionesDeEspecie(key).map(f => ({ f, p: puntajeFuncion(f, key, regionComp, preferRenoval) })).filter(x => x.p > -100).sort((a, b) => b.p - a.p);
    return c.length ? c[0].f.id : null;
  }
  function volumenArbol(fid, d, h) {
    const f = FN[fid]; if (!f || !f.fn) return null;
    if (f.usaH && !(h > 0)) return null;
    const v = f.fn(d, f.usaH ? h : 0);
    return isFinite(v) ? v : null;
  }

  /* ======================= Clases diamétricas ======================= */
  function clases(minD, maxD, ancho, inicio) {
    const L0 = (inicio != null && inicio !== '' && !isNaN(inicio)) ? Number(inicio) : Math.floor(minD / ancho) * ancho;
    const n = Math.max(1, Math.floor((maxD - L0) / ancho) + 1);
    const arr = []; for (let i = 0; i < n; i++) arr.push({ i, li: L0 + i * ancho, ls: L0 + (i + 1) * ancho, mc: L0 + (i + 0.5) * ancho });
    return { L0, ancho, arr, idx: (d) => Math.min(n - 1, Math.max(0, Math.floor((d - L0) / ancho))) };
  }

  /* ======================= Cálculo por rodal ======================= */
  // datos: árboles {rodal, parcela, key, nombre, dap, h, extArchivo, fila}
  // ctx: {region, areaParcela (superficie de parcela definida en los parámetros generales), anchoClase, inicioClase, funciones:{key:fid}, cfgRodal:{id:cfg}, alturas:{key:h} (altura promedio por especie), catOverride:{key:{code}}, especiesInfo:{key:{nombre, nativa}}}
  function calcularRodal(rid, arboles, ctx) {
    const cfg = ctx.cfgRodal[rid] || {};
    const area = Number(ctx.areaParcela) || 500;
    const FE = 10000 / area;
    const parcelas = [...new Set(arboles.map(a => String(a.parcela)).concat((ctx.parcelasExtra && ctx.parcelasExtra[rid]) || []))];
    const nP = parcelas.length || 1;
    const fe = FE / nP; // árboles/ha que representa cada árbol en la estimación del rodal
    const regionComp = (N.REGIONES.find(r => r.id === ctx.region) || {}).compendio;
    // ---- Forma de crecimiento: monopódico (cada registro es un individuo) o simpódico (los vástagos de
    //      una misma cepa, identificados por la columna "Árbol", forman un solo individuo) ----
    const simpodico = (cfg.crecimiento || ctx.crecimiento) === 'simpodico';
    const tallos = arboles.filter(a => a.dap > 0);
    const spKeys = [...new Set(tallos.map(a => a.key))];
    // altura promedio por especie, ingresada por el usuario en la sección 2 (común a todos los rodales)
    const alt = {};
    spKeys.forEach(k => { const u = ctx.alturas[k]; alt[k] = (u != null && u !== '' && Number(u) > 0) ? Number(u) : null; });
    const dmcTallos = tallos.length ? Math.sqrt(sum(tallos.map(a => a.dap * a.dap)) / tallos.length) : null;
    const preferRenoval = dmcTallos != null ? dmcTallos < 30 : null;

    // Agrupación en individuos
    const grupos = new Map();
    tallos.forEach((t, i) => {
      const id = simpodico && t.arbol != null && t.arbol !== '' ? `${t.parcela}|${t.arbol}` : `${t.parcela}|#${i}`;
      if (!grupos.has(id)) grupos.set(id, []);
      grupos.get(id).push(t);
    });
    const vivos = [];
    grupos.forEach((st, id) => {
      const p0 = st[0];
      const key = p0.key;
      const fid = ctx.funciones[key] !== undefined ? ctx.funciones[key] : (key && !key.startsWith('X:') ? funcionPorDefecto(key, regionComp, preferRenoval) : null);
      let vNull = false, vNeg = false;
      st.forEach(t => {
        t.g = Math.PI / 40000 * t.dap * t.dap;
        const vraw = fid ? volumenArbol(fid, t.dap, alt[key]) : null;
        if (vraw == null) vNull = true; else if (vraw < 0) vNeg = true;
        t.v = vraw == null ? null : Math.max(0, vraw);
        t.individuo = id;
      });
      const d2 = sum(st.map(t => t.dap * t.dap));
      vivos.push({ id, parcela: p0.parcela, arbol: p0.arbol, key, nombre: p0.nombre, tallos: st, nTallos: st.length,
        dap: Math.sqrt(d2), g: sum(st.map(t => t.g)), v: vNull ? null : sum(st.map(t => t.v)), vNeg, fid,
        cat: categoriaEspecie(key, ctx.region, ctx.catOverride[key]), mezcla: new Set(st.map(t => t.key)).size > 1 });
    });
    const dmin = vivos.length ? Math.min(...vivos.map(a => a.dap)) : 0, dmax = vivos.length ? Math.max(...vivos.map(a => a.dap)) : 0;
    const CL = clases(dmin, dmax, Number(ctx.anchoClase) || 5, ctx.inicioClase);
    // estado residual por defecto (sin corta)
    const setRes = (a, f) => { a.res = f; a.gRes = f * a.g; a.vRes = a.v == null ? null : f * a.v; a.dapRes = a.dap; a.clRes = a.cl; a.tallosRes = f * a.nTallos; a.tallos.forEach(t => { t.extraido = f === 0; }); };
    vivos.forEach(a => { a.cl = CL.idx(a.dap); setRes(a, 1); });

    // ---- Extracción ----
    const ex = cfg.ext || { modo: 'ninguna' };
    const Gtot = sum(vivos.map(a => a.g));
    if (ex.modo === 'archivo') {
      // En simpódico se pueden extraer vástagos de una cepa: el individuo permanece si queda al menos un vástago.
      vivos.forEach(a => {
        const quedan = a.tallos.filter(t => !t.extArchivo);
        a.tallos.forEach(t => { t.extraido = !!t.extArchivo; });
        a.res = quedan.length ? 1 : 0;
        a.gRes = sum(quedan.map(t => t.g));
        a.vRes = a.v == null ? null : sum(quedan.map(t => t.v));
        a.dapRes = quedan.length ? Math.sqrt(sum(quedan.map(t => t.dap * t.dap))) : 0;
        a.clRes = quedan.length ? CL.idx(a.dapRes) : a.cl;
        a.tallosRes = quedan.length;
      });
    } else if (ex.modo === 'regla') {
      const elig = vivos.filter(a => (!ex.protegerAmenazadas || !a.cat.amenazada)
        && (!ex.especies || !ex.especies.length || ex.especies.includes(a.key))
        && (ex.dapMin == null || ex.dapMin === '' || a.dap >= Number(ex.dapMin))
        && (ex.dapMax == null || ex.dapMax === '' || a.dap < Number(ex.dapMax)));
      const objetivo = Gtot * (Number(ex.pctG) || 0) / 100;
      const Gel = sum(elig.map(a => a.g));
      if (ex.criterio === 'proporcional') { const f = Gel > 0 ? Math.min(1, objetivo / Gel) : 0; elig.forEach(a => setRes(a, 1 - f)); }
      else {
        const ord = elig.slice().sort((a, b) => ex.criterio === 'arriba' ? b.dap - a.dap : a.dap - b.dap);
        let acc = 0;
        for (const a of ord) {
          if (acc >= objetivo - 1e-12) break;
          const falta = objetivo - acc;
          if (a.g <= falta) { setRes(a, 0); acc += a.g; } else { setRes(a, 1 - falta / a.g); acc = objetivo; }
        }
      }
    }

    // ---- Agregados (N = individuos; G y V = todos los vástagos) ----
    const aggIni = (filtro) => {
      let n = 0, g = 0, v = 0, t = 0, vOk = true;
      vivos.forEach(a => { if (!filtro(a)) return; n += fe; t += a.nTallos * fe; g += a.g * fe; if (a.v == null) vOk = false; else v += a.v * fe; });
      return { n, g, v: vOk ? v : (v || null), vCompleto: vOk, tallos: t };
    };
    const aggRes = (filtro) => {
      let n = 0, g = 0, v = 0, t = 0, vOk = true;
      vivos.forEach(a => { if (!filtro(a)) return; n += a.res * fe; t += a.tallosRes * fe; g += a.gRes * fe; if (a.vRes == null) { if (a.res > 0) vOk = false; } else v += a.vRes * fe; });
      return { n, g, v: vOk ? v : (v || null), vCompleto: vOk, tallos: t };
    };
    const dif = (i, r) => ({ n: i.n - r.n, g: i.g - r.g, v: i.v == null || r.v == null ? null : i.v - r.v, vCompleto: i.vCompleto && r.vCompleto, tallos: i.tallos - r.tallos });
    const porEspecie = spKeys.map(k => {
      const i = aggIni(a => a.key === k), r = aggRes(a => a.key === k);
      const nombre = (ctx.especiesInfo[k] || {}).nombre || k;
      return { key: k, nombre, ini: i, res: r, ext: dif(i, r), h: alt[k], fid: (vivos.find(a => a.key === k) || {}).fid, cat: categoriaEspecie(k, ctx.region, ctx.catOverride[k]), nativa: !!CAT.especies[k] };
    }).filter(e => e.ini.n > 0).sort((a, b) => b.ini.g - a.ini.g);
    const totIni = aggIni(() => true), totRes = aggRes(() => true);
    const tot = { ini: totIni, res: totRes, ext: dif(totIni, totRes) };
    const tabla = CL.arr.map(c => ({
      clase: c,
      sp: Object.fromEntries(spKeys.map(k => [k, { ini: aggIni(a => a.key === k && a.cl === c.i), res: aggRes(a => a.key === k && a.clRes === c.i) }])),
      tot: { ini: aggIni(a => a.cl === c.i), res: aggRes(a => a.clRes === c.i) }
    }));
    const dmcPorVastago = simpodico && ctx.dmcSimp === 'vastago';
    const DMCini = dmcPorVastago ? (tallos.length ? Math.sqrt(sum(tallos.map(t => t.dap * t.dap)) / tallos.length) : null)
      : (() => { const w = vivos.length; return w ? Math.sqrt(sum(vivos.map(a => a.dap * a.dap)) / w) : null; })();
    const DMCres = (() => {
      let s2 = 0, w = 0;
      if (dmcPorVastago) vivos.forEach(a => a.tallos.forEach(t => { const p = ex.modo === 'archivo' ? (t.extraido ? 0 : 1) : a.res; s2 += p * t.dap * t.dap; w += p; }));
      else vivos.forEach(a => { s2 += a.res * a.dapRes * a.dapRes; w += a.res; });
      return w > 0 ? Math.sqrt(s2 / w) : null;
    })();
    const hProm = (() => { let s2 = 0, w = 0; porEspecie.forEach(e => { if (e.h > 0) { s2 += e.h * e.ini.n; w += e.ini.n; } }); return w > 0 ? s2 / w : null; })();
    const hPromRes = (() => { let s2 = 0, w = 0; porEspecie.forEach(e => { if (e.h > 0) { s2 += e.h * e.res.n; w += e.res.n; } }); return w > 0 ? s2 / w : null; })();

    // ---- Estadísticos por parcela ----
    const porParcela = parcelas.map(p => {
      const ab = vivos.filter(a => String(a.parcela) === p);
      const vOk = ab.every(a => a.v != null);
      const cuenta = {}; ab.forEach(a => { cuenta[a.key] = (cuenta[a.key] || 0) + 1; });
      return { parcela: p, n: ab.length * FE, g: sum(ab.map(a => a.g)) * FE, v: vOk ? sum(ab.map(a => a.v)) * FE : null, arboles: ab.length, tallos: sum(ab.map(a => a.nTallos)),
        nRes: sum(ab.map(a => a.res)) * FE, gRes: sum(ab.map(a => a.gRes)) * FE, cuenta };
    });
    const est = (arr) => {
      const n = arr.length; if (!n) return null;
      const m = sum(arr) / n;
      if (n < 2) return { n, media: m, var: null, s: null, cv: null, t: null, eAbs: null, ePct: null };
      const v = sum(arr.map(x => (x - m) ** 2)) / (n - 1);
      const t = tQuantil(0.975, n - 1);
      const s2 = Math.sqrt(v);
      const eAbs = t * s2 / Math.sqrt(n);
      return { n, media: m, var: v, s: s2, cv: m ? s2 / m * 100 : null, t, eAbs, ePct: m ? eAbs / m * 100 : null };
    };
    const stats = { nParcelas: nP, t: nP > 1 ? tQuantil(0.975, nP - 1) : null, N: est(porParcela.map(p => p.n)), G: est(porParcela.map(p => p.g)), V: porParcela.every(p => p.v != null) ? est(porParcela.map(p => p.v)) : null };

    const r = { id: rid, cfg, area, FE, nP, parcelas: porParcela, arboles: vivos, tallos, simpodico, CL, tabla, porEspecie, tot, DMCini, DMCres, hProm, hPromRes, stats, alt,
      dmcPorVastago, mezclas: vivos.filter(a => a.mezcla).length, multiTallo: vivos.filter(a => a.nTallos > 1).length };
    r.tipo = tipoForestal(r, cfg.tipoManual);
    const esc = r.tipo.id === 'ESC';
    r.estado = N.estadoDesarrollo(esc, DMCini, hProm);
    r.estadoRes = N.estadoDesarrollo(esc, DMCres, hPromRes);
    if (cfg.estadoManual) r.estado = { estado: cfg.estadoManual, criterio: 'Asignado manualmente por el profesional' };
    r.estructura = cfg.estructura && cfg.estructura !== 'auto' ? cfg.estructura : sugerirEstructura(r);
    r.categoria = categoriaBosque(r, cfg);
    r.exoticas = (() => { const g = sum(porEspecie.filter(e => !e.nativa).map(e => e.ini.g)); return { g, pct: tot.ini.g ? g / tot.ini.g * 100 : 0, especies: porEspecie.filter(e => !e.nativa).map(e => e.nombre) }; })();
    r.metodos = restriccionesMetodos(r, cfg);
    r.bases = evaluarBases(r, cfg, ctx);
    return r;
  }

  function sugerirEstructura(r) {
    // Heurística: distribución en "J invertida" con al menos 4 clases ocupadas sugiere estructura irregular.
    const ns = r.tabla.map(f => f.tot.ini.n);
    const ocup = ns.filter(n => n > 0).length;
    if (ocup < 4) return 'regular';
    const imax = ns.indexOf(Math.max(...ns));
    let dec = 0, pares = 0;
    for (let i = imax; i < ns.length - 1; i++) { if (ns[i] > 0 || ns[i + 1] > 0) { pares++; if (ns[i + 1] <= ns[i]) dec++; } }
    return imax <= 1 && pares >= 3 && dec / pares >= 0.75 ? 'irregular' : 'regular';
  }

  /* ---------- Tipo forestal (D.S. 259, art. 19) ---------- */
  function tipoForestal(r, manual) {
    const S = N.SP;
    const nTot = r.tot.ini.n || 1;
    const nSp = (k) => { const e = r.porEspecie.find(x => x.key === k); return e ? e.ini.n : 0; };
    const hSp = (k) => r.alt[k];
    const pct = (ks) => sum(ks.map(nSp)) / nTot * 100;
    const n10 = (() => { let t = 0; const by = {}; r.arboles.forEach(a => { if (a.dap >= 10) { t += 1; by[a.key] = (by[a.key] || 0) + 1; } }); return { t, by }; })();
    const pct10 = (ks) => n10.t ? sum(ks.map(k => n10.by[k] || 0)) / n10.t * 100 : 0;
    const crit = [];
    const add = (id, cumple, detalle) => crit.push({ id, nombre: N.TIPOS_FORESTALES.find(t => t.id === id).nombre, cumple, detalle });
    const f1 = (x) => x.toLocaleString('es-CL', { maximumFractionDigits: 1 });
    add('ALE', nSp(S.alerce) >= 1, `Alerce: ${f1(nSp(S.alerce))} árb/ha (umbral ≥ 1)`);
    add('ARA', nSp(S.araucaria) >= 1, `Araucaria: ${f1(nSp(S.araucaria))} árb/ha (umbral ≥ 1)`);
    add('PAL', nSp(S.palma) >= 1, `Palma chilena: ${f1(nSp(S.palma))} árb/ha (umbral ≥ 1)`);
    const hcc = hSp(S.cipresCordillera), hcg = hSp(S.cipresGuaitecas);
    add('CC', nSp(S.cipresCordillera) >= 40 && (hcc == null || hcc > 2), `Ciprés de la Cordillera: ${f1(nSp(S.cipresCordillera))} árb/ha (umbral ≥ 40, altura > 2 m; altura promedio ${hcc != null ? f1(hcc) + ' m' : 'no definida'})`);
    add('CG', nSp(S.cipresGuaitecas) >= 10 && (hcg == null || hcg > 2), `Ciprés de las Guaitecas: ${f1(nSp(S.cipresGuaitecas))} árb/ha (umbral ≥ 10, altura > 2 m; altura promedio ${hcg != null ? f1(hcg) + ' m' : 'no definida'})`);
    add('LEN', pct([S.lenga]) >= 50, `Lenga: ${f1(pct([S.lenga]))} % de los individuos (umbral ≥ 50 %)`);
    add('CM', pct([S.coigueMagallanes]) >= 50, `Coigüe de Magallanes: ${f1(pct([S.coigueMagallanes]))} % de los individuos (umbral ≥ 50 %)`);
    const pHualo = pct([S.hualo]), pRH = pct([S.roble, S.hualo]);
    add('RH', pRH >= 50, `Roble + hualo: ${f1(pRH)} % de los individuos (umbral ≥ 50 %); hualo ${f1(pHualo)} %`);
    const pRRC = pct10([S.roble, S.rauli, S.coigue]);
    add('RRC', pRRC > 50, `Roble + raulí + coigüe: ${f1(pRRC)} % de los individuos con DAP ≥ 10 cm (umbral > 50 %)`);
    const pC = pct([S.coigue]), pR = pct([S.rauli]), pT = pct([S.tepa]), pCRT = pct([S.coigue, S.rauli, S.tepa]);
    add('CRT', pT > 0 && pCRT >= 50 && pC <= 50 && pR <= 50, `Coigüe + raulí + tepa: ${f1(pCRT)} % (tepa ${f1(pT)} %, coigüe ${f1(pC)} %, raulí ${f1(pR)} %); excluido si coigüe o raulí > 50 %`);
    const pSV = pct(N.SIEMPREVERDE);
    add('SV', pSV >= 50, `Especies de la asociación siempreverde: ${f1(pSV)} % de los individuos (criterio de la aplicación: ≥ 50 %)`);
    const escNom = N.ESCLEROFILO.filter(k => nSp(k) > 0), escSim = N.ESCLEROFILO_SIMILARES.filter(k => nSp(k) > 0);
    const pEsc = pct(N.ESCLEROFILO.concat(N.ESCLEROFILO_SIMILARES));
    add('ESC', escNom.length > 0 || escSim.length > 0, `Especies esclerófilas presentes: ${escNom.length + escSim.length} (${f1(pEsc)} % de los individuos)`);

    const cumple = (id) => crit.find(c => c.id === id).cumple;
    let id = null, motivo = '';
    // Orden de decisión: tipos de presencia/umbral absoluto, luego dominancia.
    for (const t of ['ALE', 'ARA', 'PAL', 'CG', 'CC']) if (cumple(t)) { id = t; motivo = 'Cumple el umbral de presencia del art. 19.'; break; }
    if (!id && cumple('LEN')) { id = 'LEN'; motivo = 'Lenga ≥ 50 % de los individuos.'; }
    if (!id && cumple('CM')) { id = 'CM'; motivo = 'Coigüe de Magallanes ≥ 50 % de los individuos.'; }
    if (!id && cumple('RH') && pHualo > 0) { id = 'RH'; motivo = 'Roble y/o hualo ≥ 50 % de los individuos, con presencia de hualo.'; }
    if (!id && cumple('CRT') && pT >= pct([S.roble])) { id = 'CRT'; motivo = 'Asociación coigüe-raulí-tepa, sin que coigüe o raulí superen el 50 %.'; }
    if (!id && cumple('RRC')) { id = 'RRC'; motivo = 'Roble, raulí y/o coigüe > 50 % de los individuos con DAP ≥ 10 cm.'; }
    if (!id && cumple('RH')) { id = 'RH'; motivo = 'Roble ≥ 50 % de los individuos.'; }
    if (!id && cumple('SV') && pSV >= pEsc) { id = 'SV'; motivo = 'Predominio de especies de la asociación siempreverde.'; }
    if (!id && cumple('ESC') && pEsc >= pSV) { id = 'ESC'; motivo = 'Presencia y predominio de especies esclerófilas.'; }
    if (!id && cumple('SV')) { id = 'SV'; motivo = 'Predominio de especies de la asociación siempreverde.'; }
    if (!id && cumple('ESC')) { id = 'ESC'; motivo = 'Presencia de especies esclerófilas.'; }
    const alternativas = crit.filter(c => c.cumple && c.id !== id).map(c => c.nombre);
    let res = id ? { id, nombre: N.TIPOS_FORESTALES.find(t => t.id === id).nombre, motivo, alternativas, criterios: crit, manual: false }
      : { id: null, nombre: 'No determinado', motivo: 'El rodal no responde a las definiciones del art. 19 del D.S. 259; el profesional debe justificar técnicamente el tipo forestal al que se asimila (Bases 2.5).', alternativas, criterios: crit, manual: false };
    if (manual) {
      const t = N.TIPOS_FORESTALES.find(x => x.id === manual);
      if (t) res = Object.assign({}, res, { id: t.id, nombre: t.nombre, motivo: 'Asignado manualmente por el profesional (determinación automática: ' + res.nombre + ').', manual: true });
    }
    return res;
  }

  /* ---------- Categoría de bosque (Ley 20.283, art. 2° N° 4, 5 y 6) ---------- */
  function categoriaBosque(r, cfg) {
    const amen = r.porEspecie.filter(e => e.cat.amenazada);
    const motivosP = [], motivosCP = [];
    if (amen.length) motivosP.push('Presencia de especies clasificadas (art. 37 Ley 19.300) en categoría ' + amen.map(e => `${e.nombre} (${e.cat.code})`).join(', ') + ': el rodal constituye hábitat de dichas especies.');
    if (cfg.snap) motivosP.push('El bosque se encuentra en un área del Sistema Nacional de Áreas Protegidas.');
    if (cfg.ambienteUnico) motivosP.push('Corresponde a un ambiente único o representativo de la diversidad biológica natural del país.');
    const pend = Number(cfg.pendiente);
    if (cfg.pendiente !== '' && cfg.pendiente != null && pend >= 45) motivosCP.push(`Pendiente ${pend} % (≥ 45 %).`);
    if (cfg.suelosFragiles) motivosCP.push('Ubicado en suelos frágiles.');
    if (cfg.cercaAgua) motivosCP.push('A menos de 200 m de manantiales, cuerpos o cursos de agua naturales.');
    let cat, art;
    if (cfg.categoriaManual) { cat = cfg.categoriaManual; art = 'Asignada manualmente por el profesional'; }
    else if (motivosP.length) { cat = 'Preservación'; art = 'Art. 2° N° 4'; }
    else if (motivosCP.length) { cat = 'Conservación y protección'; art = 'Art. 2° N° 5'; }
    else { cat = 'Uso múltiple'; art = 'Art. 2° N° 6'; }
    return { cat, art, motivosP, motivosCP, amenazadas: amen };
  }

  /* ---------- Restricciones de los métodos de corta (D.S. 259) ---------- */
  function restriccionesMetodos(r, cfg) {
    const pend = cfg.pendiente === '' || cfg.pendiente == null ? null : Number(cfg.pendiente);
    const tipo = r.tipo.id;
    const out = N.METODOS_CORTA.map(m => {
      const obs = [];
      let aplica = tipo ? m.tipos.includes(tipo) : null;
      if (aplica === false) obs.push(`No aplicable al tipo forestal ${r.tipo.nombre} (art. ${m.art.split(' y ').pop()}).`);
      if (pend != null) {
        if (pend > 60 && m.id !== 'SE') { aplica = false; obs.push('Pendiente > 60 %: sólo se permite corta selectiva.'); }
        else if (pend > 45 && (m.id === 'TR' || m.id === 'AS')) { aplica = false; obs.push('Pendiente > 45 %: prohibido este método.'); }
        else if (pend >= 30 && pend <= 45 && (m.id === 'TR' || m.id === 'AS')) {
          obs.push('Pendiente entre 30 % y 45 %: sectores de corta ≤ 20 ha con fajas boscosas de ≥ 100 m entre sectores.');
          if (Number(cfg.superficie) > 20) obs.push(`El rodal tiene ${cfg.superficie} ha: debe dividirse en sectores de corta de hasta 20 ha.`);
        }
      } else if (m.id !== 'SE') obs.push('Ingrese la pendiente del rodal para evaluar las restricciones del art. 18.');
      return { id: m.id, nombre: m.nombre, art: m.art, aplica, requisitos: m.reforestacion, definicion: m.definicion, obs, maxG: m.maxExtraccionG, minSemilleros: m.minSemilleros, nota: m.nota };
    });
    const especial = (tipo === 'ALE' || tipo === 'ARA') ? 'Los tipos forestales Alerce y Araucaria se rigen por los decretos N° 29 y N° 490 de 1976 del Ministerio de Agricultura (art. 30 del D.S. 259); además, ambas especies están clasificadas como amenazadas, por lo que rige la prohibición del art. 19 de la Ley 20.283.' : null;
    return { metodos: out, especial };
  }

  /* ---------- Verificación de las Bases Técnicas 2026 ---------- */
  function evaluarBases(r, cfg, ctx) {
    const act = N.ACTIVIDADES.find(a => a.id === (cfg.actividad || 'NINGUNA'));
    const checks = [];
    const add = (item, estado, detalle, ref) => checks.push({ item, estado, detalle, ref: ref || '' });
    const f1 = (x, d = 1) => x == null ? '—' : x.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
    if (!act || act.id === 'NINGUNA') return { actividad: act, checks, resultado: 'Sin actividad seleccionada', clase: 'neutral' };
    const inp = cfg.inputs || {};

    // 1. Bosque nativo (presencia accidental de exóticas)
    if (r.exoticas.pct > 50) add('Bosque nativo', 'no', `Las especies no reconocidas en el D.S. 68/2009 representan ${f1(r.exoticas.pct)} % del área basal (> 50 %): no se cumple la definición de bosque nativo.`, 'Bases 3.3.1 b; Ley art. 2° N° 3');
    else add('Bosque nativo', 'si', `Especies no reconocidas en el D.S. 68/2009: ${f1(r.exoticas.pct)} % del área basal (≤ 50 %, presencia accidental).`, 'Bases 3.3.1 b; Ley art. 2° N° 3');

    // 2. Literal según categoría de bosque
    const cat = r.categoria.cat;
    if (act.literal === 'A') {
      if (cat === 'Preservación') add('Categoría de bosque', 'si', 'Literal a) corresponde a bosque nativo de preservación.', 'Bases 3.1');
      else add('Categoría de bosque', 'no', `Literal a) es exclusivo de bosques nativos de preservación o formaciones xerofíticas de alto valor ecológico; el rodal es de ${cat.toLowerCase()}.`, 'Bases 3.1');
    } else if (act.literal === 'B' || act.literal === 'C') {
      if (cat === 'Preservación') add('Categoría de bosque', 'no', `El rodal califica como bosque nativo de preservación: sólo puede postular a actividades del literal a).`, 'Bases 2.1 y 2.2');
      else if (cat === 'Conservación y protección') add('Categoría de bosque', 'obs', 'Bosque nativo de conservación y protección: el plan de manejo requiere fundada justificación técnica de los métodos de corta y de las medidas de protección de suelos, aguas, biodiversidad e incendios (art. 16 Ley 20.283).', 'Bases 2.2');
      else add('Categoría de bosque', 'si', 'Bosque nativo de uso múltiple.', 'Bases 2.2');
    } else add('Categoría de bosque', 'si', `Actividad aplicable a bosques de uso múltiple, conservación y protección, y preservación (${cat}).`, 'Bases 4');

    // 3. Tipo forestal en Tabla de Valores
    const lit = act.literal === 'Incendios' ? 'C' : act.literal;
    const lista = N.TIPOS_TABLA_VALORES[lit];
    if (!r.tipo.id) add('Tipo forestal', 'obs', 'Tipo forestal no determinado: debe justificarse técnicamente el tipo al que se asimila el rodal.', 'Bases 2.5');
    else if (lista && !lista.includes(r.tipo.id)) add('Tipo forestal', 'no', `El tipo forestal ${r.tipo.nombre} no figura en la Tabla de Valores del literal ${lit.toLowerCase()}).`, 'Anexo 1 (D.S. 82/2022)');
    else add('Tipo forestal', 'si', `${r.tipo.nombre} figura en la Tabla de Valores del literal ${lit.toLowerCase()}).`, 'Anexo 1 (D.S. 82/2022)');
    if (act.tipos && r.tipo.id && !act.tipos.includes(r.tipo.id)) add('Tipo forestal de la actividad', 'no', `${act.nombre} es aplicable sólo al tipo forestal Esclerófilo.`, 'Bases ' + act.ref);

    // 4. Estructura y estado de desarrollo
    if (act.irregular) {
      if (r.estructura === 'irregular') add('Estructura', 'si', 'Rodal de estructura irregular o indefinida.', 'Bases ' + act.ref);
      else add('Estructura', 'obs', 'La actividad aplica a bosques que se desean manejar con estructura irregular, siendo actualmente irregulares o no estructurados. Verifique la estructura del rodal.', 'Bases ' + act.ref);
    } else if (act.estados) {
      const e = r.estado.estado;
      if (!e) add('Estado de desarrollo', 'pend', r.estado.criterio, 'Bases 2.5');
      else if (act.estados.includes(e)) {
        if (act.excepcional && act.excepcional.includes(e)) add('Estado de desarrollo', 'obs', `${e}: aplicable sólo excepcionalmente; debe justificarse.`, 'Bases ' + act.ref);
        else add('Estado de desarrollo', 'si', `${e} (${r.estado.criterio}).`, 'Bases 2.5 y ' + act.ref);
      } else add('Estado de desarrollo', 'no', `El rodal está en estado ${e} (${r.estado.criterio}); la actividad requiere: ${act.estados.join(', ')}.`, 'Bases 2.5 y ' + act.ref);
      if (r.estructura === 'irregular') add('Estructura', 'obs', 'Los estados de desarrollo del Cuadro 2 se definen para bosques regulares; el rodal parece de estructura irregular.', 'Bases 2.5');
    }

    // 5. Art. 19 Ley 20.283: corta de especies clasificadas
    if (act.corta) {
      const extAm = r.porEspecie.filter(e => e.cat.amenazada && e.ext.n > 0.0001);
      if (extAm.length) add('Especies en categoría de conservación', 'no', 'Se proyecta cortar individuos de especies clasificadas en peligro crítico, en peligro o vulnerable: ' + extAm.map(e => `${e.nombre} (${e.cat.code}, ${f1(e.ext.n)} árb/ha)`).join(', ') + '. Prohibido por el art. 19 de la Ley 20.283; no es bonificable.', 'Bases 1; Ley art. 19');
      else add('Especies en categoría de conservación', 'si', 'No se cortan individuos de especies clasificadas en peligro crítico, en peligro o vulnerable.', 'Bases 1; Ley art. 19');
    }

    // 6. Reglas cuantitativas
    const Gi = r.tot.ini.g, Ge = r.tot.ext.g, Ne = r.tot.ext.n;
    const pctG = Gi ? Ge / Gi * 100 : 0;
    switch (act.regla) {
      case 'SANITARIA': {
        const n5 = r.arboles.filter(a => a.dap >= 5).length * (r.FE / r.nP);
        const min = 0.03 * n5;
        add('Intensidad de corta sanitaria', Ne >= min && Ne > 0 ? 'si' : 'no', `Árboles a cortar: ${f1(Ne)} árb/ha; mínimo 3 % de ${f1(n5)} árb/ha con DAP ≥ 5 cm = ${f1(min)} árb/ha.`, 'Bases ' + act.ref);
        add('Antecedentes del plan de manejo', 'obs', 'Debe consignarse el agente de daño, la cuantificación de árboles dañados o susceptibles, el criterio sanitario y la marcación previa de los árboles.', 'Bases ' + act.ref + ' y 2.4');
        break;
      }
      case 'G_EXTRAE':
        add('Área basal a extraer', Ge > 0 ? 'si' : 'no', `Área basal extraída: ${f1(Ge, 2)} m²/ha (${f1(pctG)} %). Debe permitir el correcto desarrollo de los árboles residuales.`, 'Bases ' + act.ref);
        break;
      case 'IRREGULAR':
        add('Área basal a extraer (10 % – 35 %)', pctG >= 10 && pctG <= 35 ? 'si' : 'no', `Se extrae ${f1(pctG)} % del área basal (${f1(Ge, 2)} de ${f1(Gi, 2)} m²/ha).`, 'Bases ' + act.ref);
        break;
      case 'MIN10':
        add('Árboles a voltear (≥ 10 árb/ha)', Ne >= 10 ? 'si' : 'no', `Árboles a voltear: ${f1(Ne)} árb/ha.`, 'Bases ' + act.ref);
        break;
      case 'MEJORAMIENTO': {
        add('Árboles a voltear (≥ 10 árb/ha)', Ne >= 10 ? 'si' : 'no', `Árboles a voltear: ${f1(Ne)} árb/ha.`, 'Bases ' + act.ref);
        const interes = (cfg.especiesInteres || []);
        if (interes.length) {
          const extI = r.porEspecie.filter(e => interes.includes(e.key) && e.ext.n > 0.0001);
          add('Especies cortadas distintas a las de interés', extI.length ? 'no' : 'si', extI.length ? 'Se cortan individuos de especies de interés: ' + extI.map(e => e.nombre).join(', ') : 'Sólo se cortan especies distintas a las de interés.', 'Bases ' + act.ref);
        } else add('Especies de interés', 'pend', 'Indique las especies de interés para verificar que la corta recae sobre especies distintas.', 'Bases ' + act.ref);
        break;
      }
      case 'RALEO':
        add('Área basal a extraer', Ge > 0 ? 'si' : 'no', `Área basal extraída: ${f1(Ge, 2)} m²/ha (${f1(pctG)} %).`, 'Bases ' + act.ref);
        add('DMC residual ≥ DMC inicial', r.DMCres != null && r.DMCini != null && r.DMCres >= r.DMCini - 1e-9 ? 'si' : 'no', `DMC inicial ${f1(r.DMCini)} cm; DMC residual ${f1(r.DMCres)} cm.`, 'Bases ' + act.ref);
        break;
      case 'ANILLADO':
        add('Árboles a anillar (≥ 5 árb/ha)', Ne >= 5 ? 'si' : 'no', `Árboles a anillar (registrados como extraídos): ${f1(Ne)} árb/ha.`, 'Bases ' + act.ref);
        break;
      case 'PODA_FITO': {
        const nd = Number(inp.nDanados), np = Number(inp.nPodar);
        if (!(np > 0) || !(nd >= 0) || inp.nDanados === '' || inp.nDanados == null) add('Árboles a podar', 'pend', 'Ingrese los árboles dañados/ha y los árboles a podar/ha.', 'Bases ' + act.ref);
        else add('Árboles a podar', np >= 0.5 * nd && np >= 50 ? 'si' : 'no', `A podar: ${f1(np)} árb/ha; mínimo 50 % de ${f1(nd)} dañados/ha y no menos de 50 árb/ha.`, 'Bases ' + act.ref);
        break;
      }
      case 'PODA_NM': {
        const ni = inp.nInteres === '' || inp.nInteres == null ? r.tot.ini.n : Number(inp.nInteres), np = Number(inp.nPodar);
        if (!(np > 0)) add('Árboles a podar', 'pend', 'Ingrese los árboles a podar/ha.', 'Bases ' + act.ref);
        else add('Árboles a podar', np >= 0.5 * ni && np >= 50 ? 'si' : 'no', `A podar: ${f1(np)} árb/ha; mínimo 50 % de ${f1(ni)} individuos de interés/ha y no menos de 50 árb/ha.`, 'Bases ' + act.ref);
        break;
      }
      case 'PODA_LA': case 'PODA_LB': {
        const min = act.regla === 'PODA_LA' ? 200 : 400, np = Number(inp.nPodar);
        if (!(np > 0)) add('Árboles a podar', 'pend', `Ingrese los árboles a podar/ha (mínimo ${min}).`, 'Bases ' + act.ref);
        else add(`Árboles a podar (≥ ${min} árb/ha)`, np >= min && np <= r.tot.ini.n + 1e-6 ? 'si' : 'no', `A podar: ${f1(np)} árb/ha; existencia: ${f1(r.tot.ini.n)} árb/ha.`, 'Bases ' + act.ref);
        break;
      }
      case 'RECUPERACION': {
        const pd = Number(inp.pctDanados);
        if (inp.pctDanados === '' || inp.pctDanados == null) add('Individuos dañados por incendio', 'pend', 'Ingrese el porcentaje de individuos arbóreos dañados (mínimo 40 %).', 'Bases ' + act.ref);
        else add('Individuos dañados por incendio (≥ 40 %)', pd >= 40 ? 'si' : 'no', `Individuos dañados: ${f1(pd)} %.`, 'Bases ' + act.ref);
        break;
      }
      case 'REGENERACION': {
        const m = r.metodos.metodos.find(x => x.id === cfg.metodoRegen);
        if (!m) add('Método de corta (D.S. 259)', 'pend', 'Seleccione el método de corta de regeneración (tala rasa, árbol semillero, protección o selectiva).', 'Bases 3.3.2 a; D.S. 259 art. 18');
        else {
          add('Método de corta (D.S. 259)', m.aplica === false ? 'no' : (m.aplica == null ? 'pend' : 'si'), `${m.nombre}: ${m.aplica === false ? m.obs.join(' ') : 'aplicable al tipo forestal ' + r.tipo.nombre + '.'}`, 'D.S. 259 art. ' + m.art);
          if (m.aplica !== false && m.obs.length) add('Restricción por pendiente', 'obs', m.obs.join(' '), 'D.S. 259 art. 18');
          if (m.id === 'SE') add('Extracción máxima corta selectiva (35 % G)', pctG <= 35 ? 'si' : 'no', `Se extrae ${f1(pctG)} % del área basal.`, 'D.S. 259 art. 24');
          if (m.id === 'AS') add('Árboles semilleros (≥ 10 árb/ha)', r.tot.res.n >= 10 ? 'si' : 'no', `Árboles residuales: ${f1(r.tot.res.n)} árb/ha.`, 'D.S. 259 art. 22');
          if (m.id === 'TR' && r.tot.res.n > 0.5) add('Tala rasa', 'obs', `Quedan ${f1(r.tot.res.n)} árb/ha residuales; la tala rasa supone el volteo de todos los árboles del área.`, 'D.S. 259 art. 18 a)');
          add('Obligación de regeneración', 'obs', m.requisitos, 'D.S. 259 art. ' + m.art);
        }
        add('Cortas intermedias simultáneas', 'obs', 'La corta de regeneración no puede realizarse simultáneamente con cortas intermedias en el mismo rodal.', 'Bases 3.3.2 a');
        break;
      }
    }
    if (act.corta && (act.regla !== 'SANITARIA')) add('Marcación', 'obs', 'Revise la obligación de marcación de individuos cuando la definición de la actividad lo exige.', 'Bases 2.4');
    if (r.metodos.especial) add('Tipos Alerce y Araucaria', 'no', r.metodos.especial, 'D.S. 259 art. 30');

    const hayNo = checks.some(c => c.estado === 'no'), hayPend = checks.some(c => c.estado === 'pend'), hayObs = checks.some(c => c.estado === 'obs');
    const resultado = hayNo ? 'No cumple' : hayPend ? 'Información pendiente' : hayObs ? 'Cumple, con observaciones' : 'Cumple';
    return { actividad: act, checks, resultado, clase: hayNo ? 'bad' : hayPend ? 'warn' : 'ok' };
  }

  /* Densidad en árboles enteros por especie y clase (método del resto mayor): para cada especie, los
     valores por clase se redondean de modo que su suma sea igual al total de la especie redondeado. */
  function densidadEntera(r) {
    const out = {};
    const reparto = (vals) => {
      const objetivo = Math.round(vals.reduce((a, b) => a + b, 0));
      const base = vals.map(v => Math.floor(v + 1e-9)); let falta = objetivo - base.reduce((a, b) => a + b, 0);
      const orden = vals.map((v, i) => ({ i, f: v - base[i] })).sort((a, b) => b.f - a.f);
      for (let k = 0; k < orden.length && falta > 0; k++, falta--) base[orden[k].i]++;
      return base;
    };
    r.porEspecie.forEach(e => {
      out[e.key] = { ini: reparto(r.tabla.map(f => f.sp[e.key].ini.n)), res: reparto(r.tabla.map(f => f.sp[e.key].res.n)) };
    });
    return out;
  }

  window.CALC = { densidadEntera,
    norm, construirCatalogo, reconocerEspecie, CAT, cargarMMA, categoriaEspecie, categoriaRegional, buscarMMA, getMMA: () => MMA,
    construirFunciones, FN, funcionesDeEspecie, compilarEcuacion, registrarFuncionUsuario, eliminarFuncionUsuario, idUsuario, etiquetaFid, ordenFid, funcionPorDefecto, puntajeFuncion, volumenArbol, calcularRodal, tQuantil, COMPENDIO_SP
  };
})();
