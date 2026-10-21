/* Lectura y escritura mínima de archivos .xlsx (Office Open XML) usando JSZip, y lectura de CSV.
   No requiere conexión a internet. */
(function () {
  'use strict';

  /* ======================= LECTURA ======================= */
  function colToIdx(col) { let n = 0; for (const ch of col) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; }
  function idxToCol(i) { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }

  function textOf(node) {
    // concatena todos los <t> (soporta texto enriquecido)
    const ts = node.getElementsByTagName('t');
    if (!ts.length) return node.textContent || '';
    let s = ''; for (const t of ts) s += t.textContent; return s;
  }

  async function readXlsx(arrayBuffer) {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const parser = new DOMParser();
    const getXml = async (path) => { const f = zip.file(path); if (!f) return null; return parser.parseFromString(await f.async('string'), 'application/xml'); };
    const wb = await getXml('xl/workbook.xml');
    if (!wb) throw new Error('El archivo no parece ser un libro de Excel (.xlsx) válido.');
    const rels = await getXml('xl/_rels/workbook.xml.rels');
    const relMap = {};
    if (rels) for (const r of rels.getElementsByTagName('Relationship')) relMap[r.getAttribute('Id')] = r.getAttribute('Target');
    const ss = await getXml('xl/sharedStrings.xml');
    const shared = [];
    if (ss) for (const si of ss.getElementsByTagName('si')) shared.push(textOf(si));
    const sheets = [];
    for (const sh of wb.getElementsByTagName('sheet')) {
      const name = sh.getAttribute('name');
      const rid = sh.getAttribute('r:id') || sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
      let target = relMap[rid] || '';
      target = target.replace(/^\/?xl\//, '').replace(/^\//, '');
      const doc = await getXml('xl/' + target);
      const rows = [];
      if (doc) {
        for (const row of doc.getElementsByTagName('row')) {
          const rIdx = parseInt(row.getAttribute('r'), 10) - 1;
          const arr = [];
          let auto = 0;
          for (const c of row.getElementsByTagName('c')) {
            const ref = c.getAttribute('r');
            const ci = ref ? colToIdx(ref.replace(/\d+/g, '')) : auto;
            auto = ci + 1;
            const t = c.getAttribute('t');
            const vNode = c.getElementsByTagName('v')[0];
            let val = null;
            if (t === 's') val = vNode ? shared[parseInt(vNode.textContent, 10)] : null;
            else if (t === 'inlineStr') { const is = c.getElementsByTagName('is')[0]; val = is ? textOf(is) : null; }
            else if (t === 'b') val = vNode ? vNode.textContent === '1' : null;
            else if (t === 'str' || t === 'e') val = vNode ? vNode.textContent : null;
            else if (vNode) { const n = parseFloat(vNode.textContent); val = isNaN(n) ? vNode.textContent : n; }
            arr[ci] = val;
          }
          rows[isNaN(rIdx) ? rows.length : rIdx] = arr;
        }
      }
      for (let i = 0; i < rows.length; i++) if (!rows[i]) rows[i] = [];
      sheets.push({ name, rows });
    }
    return sheets;
  }

  function readCsv(text) {
    text = text.replace(/^﻿/, '');
    const firstLine = text.split(/\r?\n/)[0] || '';
    const cand = [';', '\t', ','];
    let delim = ',', best = -1;
    for (const d of cand) { const n = firstLine.split(d).length; if (n > best) { best = n; delim = d; } }
    const rows = []; let row = []; let field = ''; let q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += ch;
      } else if (ch === '"') q = true;
      else if (ch === delim) { row.push(field); field = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(field); rows.push(row); row = []; field = '';
      } else field += ch;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return [{ name: 'CSV', rows: rows.map(r => r.map(v => v === '' ? null : v)) }];
  }

  async function readFile(file) {
    const name = (file.name || '').toLowerCase();
    if (name.endsWith('.csv') || name.endsWith('.txt')) return readCsv(await file.text());
    if (name.endsWith('.xls')) throw new Error('El formato .xls (Excel 97-2003) no es compatible. Guarde el archivo como .xlsx o .csv.');
    return readXlsx(await file.arrayBuffer());
  }

  /* ======================= ESCRITURA ======================= */
  // Estilos disponibles (índice en cellXfs)
  const ST = {
    normal: 0, header: 1, int: 2, dec2: 3, dec3: 4, text: 5, title: 6, totInt: 7, totDec2: 8, wrap: 9,
    ok: 10, bad: 11, warn: 12, subtitle: 13, dec1: 14, totDec1: 15, pct: 16, totDec3: 17, label: 18, note: 19
  };
  function stylesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="4"><numFmt numFmtId="164" formatCode="#,##0"/><numFmt numFmtId="165" formatCode="#,##0.00"/><numFmt numFmtId="166" formatCode="#,##0.000"/><numFmt numFmtId="167" formatCode="#,##0.0"/></numFmts>
<fonts count="7">
<font><sz val="10"/><name val="Arial"/></font>
<font><b/><sz val="10"/><name val="Arial"/></font>
<font><b/><sz val="12"/><name val="Arial"/></font>
<font><b/><sz val="10"/><color rgb="FF1E6B35"/><name val="Arial"/></font>
<font><b/><sz val="10"/><color rgb="FFB42318"/><name val="Arial"/></font>
<font><b/><sz val="10"/><color rgb="FF9A6700"/><name val="Arial"/></font>
<font><i/><sz val="9"/><color rgb="FF555555"/><name val="Arial"/></font>
</fonts>
<fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFDDE8DC"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF2F2EE"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FF8A8A8A"/></left><right style="thin"><color rgb="FF8A8A8A"/></right><top style="thin"><color rgb="FF8A8A8A"/></top><bottom style="thin"><color rgb="FF8A8A8A"/></bottom><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="20">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="164" fontId="1" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="165" fontId="1" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="167" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="167" fontId="1" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="10" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="166" fontId="1" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="6" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  }
  function sheetXml(sh) {
    let x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">';
    // Ajustar al ancho de una página (oficio)
    x += '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>';
    if (sh.freeze) {
      const [r, c] = sh.freeze; // filas y columnas fijas
      const tl = idxToCol(c) + (r + 1);
      x += `<sheetViews><sheetView workbookViewId="0"><pane ${c ? `xSplit="${c}" ` : ''}${r ? `ySplit="${r}" ` : ''}topLeftCell="${tl}" activePane="bottomRight" state="frozen"/></sheetView></sheetViews>`;
    }
    if (sh.cols && sh.cols.length) {
      x += '<cols>' + sh.cols.map((w, i) => w ? `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>` : '').join('') + '</cols>';
    }
    x += '<sheetData>';
    sh.rows.forEach((row, ri) => {
      if (!row) return;
      let rx = '';
      row.forEach((cell, ci) => {
        if (cell === undefined) return;
        let v = cell, s = 0;
        if (cell !== null && typeof cell === 'object' && !(cell instanceof Date)) { v = cell.v; s = cell.s || 0; }
        const ref = idxToCol(ci) + (ri + 1);
        if (v === null || v === undefined || v === '' || (typeof v === 'number' && !isFinite(v))) {
          if (s) rx += `<c r="${ref}" s="${s}"/>`;
        } else if (typeof v === 'number') rx += `<c r="${ref}" s="${s}"><v>${v}</v></c>`;
        else if (typeof v === 'boolean') rx += `<c r="${ref}" s="${s}" t="b"><v>${v ? 1 : 0}</v></c>`;
        else rx += `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
      });
      const ht = sh.heights && sh.heights[ri] ? ` ht="${sh.heights[ri]}" customHeight="1"` : '';
      x += `<row r="${ri + 1}"${ht}>${rx}</row>`;
    });
    x += '</sheetData>';
    if (sh.merges && sh.merges.length) x += `<mergeCells count="${sh.merges.length}">` + sh.merges.map(m => `<mergeCell ref="${m}"/>`).join('') + '</mergeCells>';
    x += '<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>';
    // paperSize 14 = Folio / oficio (8,5 × 13 pulgadas; 216 × 330 mm)
    x += `<pageSetup paperSize="14" orientation="${sh.landscape ? 'landscape' : 'portrait'}" fitToWidth="1" fitToHeight="0"/>`;
    x += '<headerFooter><oddFooter>&amp;L&amp;8&amp;A&amp;R&amp;8Página &amp;P de &amp;N</oddFooter></headerFooter>';
    if (sh.breaks && sh.breaks.length) x += `<rowBreaks count="${sh.breaks.length}" manualBreakCount="${sh.breaks.length}">` + sh.breaks.map(b => `<brk id="${b}" max="16383" man="1"/>`).join('') + '</rowBreaks>';
    if (sh.images && sh.images.length) x += '<drawing r:id="rIdDr1"/>';
    x += '</worksheet>';
    return x;
  }
  function drawingXml(imgs, base) {
    const EMU = 9525;
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      imgs.map((im, i) => `<xdr:oneCellAnchor><xdr:from><xdr:col>${im.col}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${im.row}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:ext cx="${Math.round(im.w * EMU)}" cy="${Math.round(im.h * EMU)}"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${i + 2}" name="${esc(im.nombre || 'Gráfico ' + (i + 1))}"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="rIdImg${i + 1}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${Math.round(im.w * EMU)}" cy="${Math.round(im.h * EMU)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`).join('') + '</xdr:wsDr>';
  }
  function safeName(n, used) {
    let s = String(n).replace(/[\[\]:*?\/\\]/g, '-').slice(0, 31) || 'Hoja';
    let base = s, k = 2;
    while (used.has(s.toLowerCase())) { const suf = ' (' + k++ + ')'; s = base.slice(0, 31 - suf.length) + suf; }
    used.add(s.toLowerCase());
    return s;
  }
  async function writeXlsx(sheets) {
    const zip = new JSZip();
    const used = new Set();
    sheets.forEach(s => { s._name = safeName(s.name, used); });
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/><Default Extension="png" ContentType="image/png"/>${sheets.map((s, i) => s.images && s.images.length ? `<Override PartName="/xl/drawings/drawing${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>` : '').join('')}${sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`);
    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
    const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    zip.file('docProps/core.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Tabla de rodal</dc:title><dc:creator>Generador de Tabla de Rodal</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`);
    zip.file('docProps/app.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Generador de Tabla de Rodal</Application></Properties>`);
    zip.file('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>${sheets.map((s, i) => `<sheet name="${esc(s._name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`);
    zip.file('xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
    zip.file('xl/styles.xml', stylesXml());
    let nImg = 0;
    sheets.forEach((s, i) => {
      zip.file(`xl/worksheets/sheet${i + 1}.xml`, sheetXml(s));
      if (s.images && s.images.length) {
        zip.file(`xl/worksheets/_rels/sheet${i + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdDr1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${i + 1}.xml"/></Relationships>`);
        zip.file(`xl/drawings/drawing${i + 1}.xml`, drawingXml(s.images));
        zip.file(`xl/drawings/_rels/drawing${i + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
          s.images.map((im, k) => { nImg++; zip.file(`xl/media/image${nImg}.png`, im.data); return `<Relationship Id="rIdImg${k + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${nImg}.png"/>`; }).join('') + '</Relationships>');
      }
    });
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', compression: 'DEFLATE' });
  }

  window.XLSXIO = { readFile, readXlsx, readCsv, writeXlsx, ST, idxToCol, colToIdx };
})();
