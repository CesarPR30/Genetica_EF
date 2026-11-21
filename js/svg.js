/* svg.js — constructores de diagramas SVG como strings.
   Los colores vienen de clases CSS (ver styles.css: .sv-*), así se adaptan al tema claro/oscuro. */
(function (root) {
  'use strict';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const wrap = (w, h, body, label) =>
    `<svg class="diagram" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label || 'diagrama')}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
  const T = (x, y, s, cls, anchor, size) =>
    `<text x="${x}" y="${y}" class="${cls || 'sv-text'}" text-anchor="${anchor || 'middle'}" font-size="${size || 13}">${esc(s)}</text>`;

  // ---------- Pedigrí ----------
  // spec: {width,height, people:[{id,label,sex:'M'|'F',aff,x,y,dead,proband,note}], couples:[{a,b,consang}], sibships:[{parents:[a,b], kids:[ids]}], genLabels:[{y,text}]}
  function pedigree(spec) {
    const S = 13; // medio lado
    const byId = {};
    spec.people.forEach((p) => { byId[p.id] = p; });
    let body = '';
    (spec.genLabels || []).forEach((g) => { body += T(14, g.y + 5, g.text, 'sv-muted', 'middle', 14); });
    spec.couples.forEach((c) => {
      const a = byId[c.a], b = byId[c.b];
      const y = a.y;
      if (c.consang) {
        body += `<line class="sv-stroke" x1="${a.x + S}" y1="${y - 3}" x2="${b.x - S}" y2="${y - 3}"/><line class="sv-stroke" x1="${a.x + S}" y1="${y + 3}" x2="${b.x - S}" y2="${y + 3}"/>`;
      } else {
        body += `<line class="sv-stroke" x1="${a.x + S}" y1="${y}" x2="${b.x - S}" y2="${y}"/>`;
      }
    });
    spec.sibships.forEach((sb) => {
      const a = byId[sb.parents[0]], b = byId[sb.parents[1]];
      const mx = (a.x + b.x) / 2, y0 = a.y;
      const kids = sb.kids.map((k) => byId[k]);
      const ky = kids[0].y;
      const midY = (y0 + ky) / 2 + 2;
      body += `<line class="sv-stroke" x1="${mx}" y1="${y0}" x2="${mx}" y2="${midY}"/>`;
      const xs = kids.map((k) => k.x).concat([mx]);
      body += `<line class="sv-stroke" x1="${Math.min.apply(null, xs)}" y1="${midY}" x2="${Math.max.apply(null, xs)}" y2="${midY}"/>`;
      kids.forEach((k) => { body += `<line class="sv-stroke" x1="${k.x}" y1="${midY}" x2="${k.x}" y2="${k.y - S}"/>`; });
    });
    spec.people.forEach((p) => {
      const cls = p.aff ? 'sv-aff' : (p.carrier ? 'sv-carrier' : 'sv-unaff');
      if (p.sex === 'M') body += `<rect class="${cls} sv-shape" x="${p.x - S}" y="${p.y - S}" width="${2 * S}" height="${2 * S}"/>`;
      else body += `<circle class="${cls} sv-shape" cx="${p.x}" cy="${p.y}" r="${S}"/>`;
      if (p.carrier && !p.aff) body += `<circle class="sv-dot" cx="${p.x}" cy="${p.y}" r="4"/>`;
      if (p.proband) body += `<path class="sv-stroke" d="M${p.x - 30} ${p.y + 22} L${p.x - 16} ${p.y + 9}"/><path class="sv-arrowhead" d="M${p.x - 16} ${p.y + 9} l-7 1 l5 5 z"/>`;
      if (p.label) body += T(p.x, p.y + S + 15, p.label, 'sv-muted', 'middle', 11);
      if (p.note) body += T(p.x, p.y - S - 6, p.note, 'sv-text', 'middle', 11);
    });
    if (spec.legend !== false) {
      const ly = spec.height - 12;
      body += `<rect class="sv-aff sv-shape" x="${spec.width - 175}" y="${ly - 10}" width="12" height="12"/>` + T(spec.width - 158, ly, 'afectado', 'sv-muted', 'start', 11);
      body += `<rect class="sv-unaff sv-shape" x="${spec.width - 95}" y="${ly - 10}" width="12" height="12"/>` + T(spec.width - 78, ly, 'no afectado', 'sv-muted', 'start', 11);
    }
    return wrap(spec.width, spec.height, body, spec.label || 'Pedigrí');
  }

  // ---------- Haplotipos con marcadores (análisis de ligamiento) ----------
  // fam: {father:{aff,h:[[a,b],[a,b]]}, mother:{...}, kids:[{sex,aff,h:[[..],[..]],label}]}
  function haplotypes(fam, opts) {
    opts = opts || {};
    const kids = fam.kids;
    const W = Math.max(560, 160 + kids.length * 130), H = 300;
    const S = 13;
    let body = '';
    const fx = W / 2 - 80, mx = W / 2 + 80, py = 40;
    const box = (x, y, h) => {
      let s = '';
      [0, 1].forEach((i) => {
        const bx = x - 28 + i * 30;
        s += `<rect class="sv-box" x="${bx}" y="${y}" width="24" height="48" rx="4"/>`;
        s += T(bx + 12, y + 19, h[i][0], 'sv-text', 'middle', 13) + T(bx + 12, y + 40, h[i][1], 'sv-text', 'middle', 13);
      });
      return s;
    };
    const shape = (x, y, sex, aff) => sex === 'M'
      ? `<rect class="${aff ? 'sv-aff' : 'sv-unaff'} sv-shape" x="${x - S}" y="${y - S}" width="${2 * S}" height="${2 * S}"/>`
      : `<circle class="${aff ? 'sv-aff' : 'sv-unaff'} sv-shape" cx="${x}" cy="${y}" r="${S}"/>`;
    body += `<line class="sv-stroke" x1="${fx + S}" y1="${py}" x2="${mx - S}" y2="${py}"/>`;
    body += shape(fx, py, 'M', fam.father.aff) + shape(mx, py, 'F', fam.mother.aff);
    body += T(fx - 52, py + 4, 'Padre', 'sv-muted', 'end', 11) + T(mx + 52, py + 4, 'Madre', 'sv-muted', 'start', 11);
    body += box(fx, py + 22, fam.father.h) + box(mx, py + 22, fam.mother.h);
    const ky = 185;
    const xs = kids.map((k, i) => 110 + i * ((W - 220) / Math.max(1, kids.length - 1)));
    if (kids.length === 1) xs[0] = W / 2;
    const midX = (fx + mx) / 2, midY = 150;
    body += `<line class="sv-stroke" x1="${midX}" y1="${py}" x2="${midX}" y2="${midY}"/>`;
    body += `<line class="sv-stroke" x1="${Math.min(xs[0], midX)}" y1="${midY}" x2="${Math.max(xs[xs.length - 1], midX)}" y2="${midY}"/>`;
    kids.forEach((k, i) => {
      body += `<line class="sv-stroke" x1="${xs[i]}" y1="${midY}" x2="${xs[i]}" y2="${ky - S}"/>`;
      body += shape(xs[i], ky, k.sex, k.aff) + box(xs[i], ky + 22, k.h);
      if (k.label) body += T(xs[i] + S + 6, ky + 4, k.label, 'sv-muted', 'start', 11);
    });
    body += T(16, py + 41, 'A', 'sv-muted', 'start', 11) + T(16, py + 62, 'B', 'sv-muted', 'start', 11);
    body += T(W / 2, H - 6, 'Arriba: marcador A · abajo: marcador B · cada caja = un haplotipo', 'sv-muted', 'middle', 11);
    return wrap(W, H, body, opts.label || 'Haplotipos de marcadores en la familia');
  }

  // ---------- Metilación por sitio CpG (dos pacientes) ----------
  function methylation(p1, p2, gene) {
    const W = 640, H = 240;
    let body = '';
    const panel = (x0, vals, title) => {
      let s = T(x0 + 140, 22, title, 'sv-text', 'middle', 14);
      s += `<line class="sv-stroke" x1="${x0 + 10}" y1="190" x2="${x0 + 280}" y2="190"/>`;
      vals.forEach((v, i) => {
        const bw = 30, gap = 13, x = x0 + 22 + i * (bw + gap);
        const h = Math.max(2, v * 1.4);
        s += `<rect class="sv-bar-bg" x="${x}" y="50" width="${bw}" height="140" rx="3"/>`;
        s += `<rect class="${v >= 20 ? 'sv-bar-hi' : 'sv-bar-lo'}" x="${x}" y="${190 - h}" width="${bw}" height="${h}" rx="3"/>`;
        s += T(x + bw / 2, 44, v + '%', 'sv-text', 'middle', 12);
        s += T(x + bw / 2, 206, 'CpG' + (i + 1), 'sv-muted', 'middle', 10);
      });
      return s;
    };
    body += panel(10, p1, 'Paciente 1 — ADN de sangre');
    body += panel(330, p2, 'Paciente 2 — ADN de sangre');
    body += T(W / 2, 232, '% de metilación por sitio CpG del promotor de ' + gene, 'sv-muted', 'middle', 12);
    return wrap(W, H, body, 'Metilación por sitio CpG');
  }

  // ---------- Fenotipos metabolizadores (CYP2D6) ----------
  function metabolizers() {
    const W = 660, H = 250;
    const cols = [
      { k: 'PM', n: 'Metabolizador lento (pobre)', g: '*4/*4', c: 0, dose: 'Alternativa terapéutica', cls: 'sv-c4' },
      { k: 'IM', n: 'Metabolizador intermedio', g: '*1/*4', c: 1, dose: 'Dosis reducida', cls: 'sv-c3' },
      { k: 'NM', n: 'Metabolizador normal (extenso)', g: '*1/*1', c: 2, dose: 'Dosis estándar', cls: 'sv-c2' },
      { k: 'UM', n: 'Metabolizador ultrarrápido', g: '*1/*1xN', c: 3, dose: 'Dosis incrementada', cls: 'sv-c1' }
    ];
    let body = '';
    cols.forEach((c, i) => {
      const x = 10 + i * 162;
      body += `<rect class="sv-card" x="${x}" y="8" width="152" height="232" rx="10"/>`;
      body += `<rect class="${c.cls}" x="${x}" y="8" width="152" height="34" rx="10"/><rect class="${c.cls}" x="${x}" y="30" width="152" height="12"/>`;
      body += T(x + 76, 31, c.k, 'sv-on', 'middle', 17);
      body += T(x + 76, 62, c.n.split(' (')[0], 'sv-text', 'middle', 11);
      if (c.n.includes('(')) body += T(x + 76, 76, '(' + c.n.split(' (')[1], 'sv-muted', 'middle', 10);
      body += T(x + 76, 100, 'Ej.: ' + c.g, 'sv-text', 'middle', 12);
      for (let j = 0; j < 3; j++) {
        const on = j < c.c;
        body += `<rect class="${on ? c.cls : 'sv-bar-bg'}" x="${x + 26 + j * 36}" y="114" width="28" height="44" rx="5"/>`;
      }
      body += T(x + 76, 176, c.c + (c.c === 1 ? ' copia funcional' : ' copias funcionales'), 'sv-text', 'middle', 11);
      body += `<line class="sv-stroke" x1="${x + 20}" y1="190" x2="${x + 132}" y2="190"/>`;
      body += T(x + 76, 212, c.dose, 'sv-text', 'middle', 12);
    });
    return wrap(W, H, body, 'Fenotipos metabolizadores según copias funcionales');
  }

  // ---------- Sustrato / inhibidor / inductor ----------
  function cypInteractions() {
    const W = 640, H = 230;
    let body = '';
    body += `<rect class="sv-band" x="40" y="70" width="580" height="60"/>`;
    body += T(630, 104, 'rango', 'sv-muted', 'end', 10) + T(630, 116, 'terapéutico', 'sv-muted', 'end', 10);
    body += T(36, 64, 'tóxico', 'sv-muted', 'end', 10) + T(36, 150, 'ineficaz', 'sv-muted', 'end', 10);
    const bars = [
      { x: 90, h: 100, t: 'Sustrato solo', s: 'metabolismo normal', cls: 'sv-c2' },
      { x: 290, h: 160, t: '+ Inhibidor del CYP', s: '↓metabolismo ↑nivel → toxicidad', cls: 'sv-c4' },
      { x: 490, h: 45, t: '+ Inductor del CYP', s: '↑metabolismo ↓nivel → ↓efecto', cls: 'sv-c1' }
    ];
    bars.forEach((b) => {
      body += `<rect class="${b.cls}" x="${b.x}" y="${180 - b.h}" width="70" height="${b.h}" rx="4" opacity="0.9"/>`;
      body += T(b.x + 35, 198, b.t, 'sv-text', 'middle', 12) + T(b.x + 35, 214, b.s, 'sv-muted', 'middle', 10);
    });
    body += `<line class="sv-stroke" x1="40" y1="180" x2="620" y2="180"/>`;
    body += T(320, 14, 'Nivel plasmático del fármaco', 'sv-text', 'middle', 13);
    return wrap(W, H, body, 'Efecto de inhibidores e inductores del CYP');
  }

  // ---------- Nomenclatura CYP ----------
  function cypName() {
    const W = 620, H = 190;
    let body = '';
    const parts = [
      { s: 'CYP', x: 120, l: 'Raíz: citocromo P450', cls: 'sv-c5' },
      { s: '2', x: 205, l: 'Familia (homología aa > 40 %)', cls: 'sv-c1' },
      { s: 'D', x: 255, l: 'Subfamilia (homología > 55 %)', cls: 'sv-c2' },
      { s: '6', x: 305, l: 'Enzima individual (gen)', cls: 'sv-c3' },
      { s: '*4', x: 375, l: 'Alelo (variante); *1 = normal', cls: 'sv-c4' }
    ];
    parts.forEach((p, i) => {
      body += `<text x="${p.x}" y="70" class="sv-big ${p.cls}t" text-anchor="middle" font-size="46">${esc(p.s)}</text>`;
      const ly = 110 + i * 15;
      body += `<line class="sv-thin" x1="${p.x}" y1="80" x2="${p.x}" y2="${ly - 4}"/><line class="sv-thin" x1="${p.x}" y1="${ly - 4}" x2="440" y2="${ly - 4}"/>`;
      body += T(446, ly, p.l, 'sv-text', 'start', 12);
    });
    return wrap(W, H, body, 'Nomenclatura de los CYP');
  }

  // ---------- Pirámide farmacogenómica ----------
  function pyramid() {
    const lv = ['SNPs que modifican el desenlace clínico', 'SNPs que cambian la respuesta a drogas', 'SNPs que cambian la farmacocinética (FC)', 'SNPs que cambian la actividad in vitro', 'Cambios no conservadores en aminoácidos', 'SNPs no sinónimos en exones', 'Cambios en exones', 'Todos los SNPs'];
    const W = 620, H = 300;
    let body = '';
    lv.forEach((t, i) => {
      const y = 12 + i * 34, half = 40 + i * 34;
      body += `<polygon class="${i < 2 ? 'sv-c4' : i < 4 ? 'sv-c3' : i < 6 ? 'sv-c2' : 'sv-c1'}" opacity="0.85" points="${310 - half},${y + 30} ${310 + half},${y + 30} ${310 + half - 17},${y} ${310 - half + 17},${y}"/>`;
      body += T(310, y + 20, t, 'sv-on', 'middle', i < 2 ? 9.5 : 11.5);
    });
    return wrap(W, H, body, 'Pirámide de la farmacogenómica');
  }

  // ---------- Metilación y expresión ----------
  function methylSwitch() {
    const W = 640, H = 210;
    let body = '';
    const row = (y, meth, label, out, cls) => {
      let s = T(10, y - 22, label, 'sv-text', 'start', 13);
      s += `<line class="sv-dna" x1="20" y1="${y}" x2="600" y2="${y}"/>`;
      s += `<rect class="sv-c5" x="60" y="${y - 10}" width="170" height="20" rx="4" opacity="0.35"/>` + T(145, y + 28, 'isla CpG (promotor)', 'sv-muted', 'middle', 10);
      s += `<rect class="sv-c2" x="300" y="${y - 12}" width="200" height="24" rx="4"/>` + T(400, y + 4, 'GEN', 'sv-on', 'middle', 12);
      for (let i = 0; i < 6; i++) {
        const x = 75 + i * 28;
        s += `<line class="sv-stroke" x1="${x}" y1="${y}" x2="${x}" y2="${y - 18}"/><circle class="${meth ? 'sv-meth' : 'sv-unmeth'}" cx="${x}" cy="${y - 22}" r="6"/>`;
      }
      s += T(520, y + 4, out, cls, 'start', 13);
      return s;
    };
    body += row(60, false, 'Hipometilación del promotor', '→ activación génica', 'sv-ok');
    body += row(160, true, 'Hipermetilación del promotor', '→ silenciamiento', 'sv-bad');
    body += `<circle class="sv-meth" cx="470" cy="200" r="5"/>` + T(480, 204, 'metilado', 'sv-muted', 'start', 10);
    body += `<circle class="sv-unmeth" cx="545" cy="200" r="5"/>` + T(555, 204, 'no metilado', 'sv-muted', 'start', 10);
    return wrap(W, H, body, 'Metilación del promotor y expresión génica');
  }

  // ---------- Barra apilada genérica ----------
  function stacked(items, title, unit) {
    const W = 640, H = 120 + Math.ceil(items.length / 3) * 22;
    let body = T(320, 18, title, 'sv-text', 'middle', 13);
    const tot = items.reduce((a, b) => a + b.v, 0);
    let x = 20;
    items.forEach((it, i) => {
      const w = (it.v / tot) * 600;
      body += `<rect class="sv-c${(i % 6) + 1}" x="${x}" y="32" width="${Math.max(1, w - 2)}" height="38" rx="3"/>`;
      if (w > 36) body += T(x + w / 2, 56, it.lab || (it.v + (unit || '%')), 'sv-on', 'middle', 11);
      x += w;
    });
    items.forEach((it, i) => {
      const cx = 20 + (i % 3) * 205, cy = 92 + Math.floor(i / 3) * 22;
      body += `<rect class="sv-c${(i % 6) + 1}" x="${cx}" y="${cy - 10}" width="12" height="12" rx="2"/>` + T(cx + 18, cy, it.name + ' (' + (it.lab || it.v + (unit || '%')) + ')', 'sv-text', 'start', 11);
    });
    return wrap(W, H, body, title);
  }

  // ---------- Dogma: ADN → ARNm → proteína con tipos de mutación (clase 11) ----------
  function pointMutations() {
    const W = 640, H = 230;
    const cols = [
      { dna: 'AAG', rna: 'AAG', aa: 'Lys', t: 'Original', cls: 'sv-c5' },
      { dna: 'AAA', rna: 'AAA', aa: 'Lys', t: 'Silenciosa (sinónima)', cls: 'sv-c2' },
      { dna: 'TAG', rna: 'UAG', aa: 'STOP', t: 'Sin sentido (nonsense)', cls: 'sv-c4' },
      { dna: 'AGG', rna: 'AGG', aa: 'Arg', t: 'Missense conservadora', cls: 'sv-c3' },
      { dna: 'ACG', rna: 'ACG', aa: 'Thr', t: 'Missense no conservadora', cls: 'sv-c1' }
    ];
    let body = T(14, 52, 'ADN', 'sv-muted', 'start', 12) + T(14, 102, 'ARNm', 'sv-muted', 'start', 12) + T(14, 152, 'Proteína', 'sv-muted', 'start', 12);
    cols.forEach((c, i) => {
      const x = 80 + i * 112;
      body += `<rect class="sv-card" x="${x}" y="25" width="100" height="150" rx="8"/>`;
      body += T(x + 50, 55, c.dna, 'sv-mono', 'middle', 18) + T(x + 50, 105, c.rna, 'sv-mono', 'middle', 18) + T(x + 50, 155, c.aa, 'sv-text', 'middle', 16);
      body += `<rect class="${c.cls}" x="${x}" y="185" width="100" height="36" rx="6"/>`;
      const words = c.t.split(' ');
      const l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
      body += T(x + 50, 200, l1, 'sv-on', 'middle', 10) + T(x + 50, 214, l2, 'sv-on', 'middle', 10);
    });
    return wrap(W, H, body, 'Tipos de mutación puntual');
  }

  // ---------- Generaciones de secuenciación ----------
  function seqGenerations() {
    const W = 640, H = 150;
    const g = [
      { t: '1ª generación', a: 'Sanger', b: '500–1 000 pb', c: 'electroforesis' },
      { t: '2ª generación (NGS)', a: '454, Solexa, Ion Torrent, Illumina', b: '~50–500 pb', c: 'paralelización masiva (lecturas cortas)' },
      { t: '3ª generación', a: 'PacBio, Oxford Nanopore', b: 'decenas de kb', c: 'molécula única en tiempo real (lecturas largas)' }
    ];
    let body = '';
    g.forEach((x, i) => {
      const x0 = 10 + i * 210;
      body += `<polygon class="sv-c${i + 1}" points="${x0},10 ${x0 + 185},10 ${x0 + 205},32 ${x0 + 185},54 ${x0},54 ${x0 + 18},32"/>`;
      body += T(x0 + 100, 37, x.t, 'sv-on', 'middle', 13);
      body += T(x0 + 100, 78, x.a, 'sv-text', 'middle', 11) + T(x0 + 100, 98, x.b, 'sv-text', 'middle', 12) + T(x0 + 100, 118, x.c.split(' (')[0], 'sv-muted', 'middle', 10);
      if (x.c.includes('(')) body += T(x0 + 100, 132, '(' + x.c.split(' (')[1], 'sv-muted', 'middle', 10);
    });
    return wrap(W, H, body, 'Generaciones de secuenciación');
  }

  // ---------- Punnett genérico (HTML) ----------
  function punnett(gA, gB, cellFn) {
    let h = '<table class="punnett"><tr><th></th>' + gB.map((g) => `<th>${esc(g)}</th>`).join('') + '</tr>';
    gA.forEach((a) => {
      h += `<tr><th>${esc(a)}</th>` + gB.map((b) => `<td>${esc(cellFn(a, b))}</td>`).join('') + '</tr>';
    });
    return h + '</table>';
  }

  // ---------- Cromosoma con locus (lectura de reportes) ----------
  function chromosome() {
    const W = 640, H = 120;
    let body = '';
    body += `<rect class="sv-c5" x="60" y="40" width="190" height="34" rx="17" opacity="0.5"/><rect class="sv-c1" x="262" y="40" width="320" height="34" rx="17" opacity="0.5"/>`;
    body += `<circle class="sv-stroke" cx="256" cy="57" r="9"/>`;
    body += T(155, 30, 'brazo corto (p)', 'sv-text', 'middle', 12) + T(420, 30, 'brazo largo (q)', 'sv-text', 'middle', 12) + T(256, 100, 'centrómero', 'sv-muted', 'middle', 11);
    body += `<line class="sv-stroke" x1="470" y1="40" x2="470" y2="74"/>` + T(470, 100, '22q13.2 → cromosoma 22, brazo q, región 13.2', 'sv-text', 'middle', 12);
    return wrap(W, H, body, 'Lectura del locus cromosómico');
  }

  const api = { pedigree, haplotypes, methylation, metabolizers, cypInteractions, cypName, pyramid, methylSwitch, stacked, pointMutations, seqGenerations, punnett, chromosome, esc };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SV = api;
})(typeof window !== 'undefined' ? window : globalThis);
