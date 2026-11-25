/* app.js — interfaz: pestañas, teoría, cómo resolver, práctica, simulacro y notas. */
(function () {
  'use strict';
  const { GENERATORS, byId: GENBY } = window.GEN;
  const MCQ = window.MCQ, TOPICS = window.TOPICS, CASES = window.CASES, THEORY = window.THEORY;
  const TOPIC = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
  const MCQBY = Object.fromEntries(MCQ.map((q) => [q.id, q]));
  const CASEBY = Object.fromEntries(CASES.map((c) => [c.id, c]));
  const esc = SV.esc;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
  const LET = 'ABCD';
  function wrapTables(root) {
    if (!root || !root.querySelectorAll) return;
    $$('table', root).forEach((t) => {
      if (t.parentElement && t.parentElement.classList.contains('tbl-wrap')) return;
      const w = document.createElement('div'); w.className = 'tbl-wrap';
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }
  new MutationObserver((muts) => { muts.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) wrapTables(n.tagName === 'TABLE' ? n.parentNode : n); })); })
    .observe(document.querySelector('main'), { childList: true, subtree: true });

  // ---------- Almacenamiento seguro ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('gef:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('gef:' + k, JSON.stringify(v)); } catch (e) { /* almacenamiento no disponible */ } },
    del(k) { try { localStorage.removeItem('gef:' + k); } catch (e) { /* nada */ } }
  };
  const progress = store.get('progress', { mcq: {}, calc: {} });
  const saveProgress = () => store.set('progress', progress);
  const fmt2 = (x) => GU.fmtNum(x, 2);

  // ---------- Tema ----------
  $('#themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    store.set('theme', cur);
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', cur === 'dark' ? '#171e2c' : '#2f63d6');
  });

  // ---------- Pestañas ----------
  const rendered = {};
  function showTab(name) {
    $$('.tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
    $$('section.view').forEach((s) => s.classList.toggle('active', s.id === 'view-' + name));
    if (!rendered[name]) { RENDER[name](); rendered[name] = true; }
    store.set('tab', name);
    window.scrollTo(0, 0);
  }
  $$('.tab').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));

  // ---------- Diagramas de teoría ----------
  function modesHTML() {
    const mk = (title, people, couples, sibs, note) => `<div class="mini-ped"><h4>${title}</h4>${SV.pedigree({ width: 300, height: 205, legend: false, people, couples, sibships: sibs })}<p class="muted" style="text-align:center">${note}</p></div>`;
    const base = (aff) => [
      { id: 'f', sex: 'M', aff: aff[0], x: 110, y: 40 }, { id: 'm', sex: 'F', aff: aff[1], x: 190, y: 40 },
      { id: 'k1', sex: 'M', aff: aff[2], x: 60, y: 140 }, { id: 'k2', sex: 'F', aff: aff[3], x: 120, y: 140 },
      { id: 'k3', sex: 'M', aff: aff[4], x: 180, y: 140 }, { id: 'k4', sex: 'F', aff: aff[5], x: 240, y: 140 }
    ];
    const cp = [{ a: 'f', b: 'm' }], sb = [{ parents: ['f', 'm'], kids: ['k1', 'k2', 'k3', 'k4'] }];
    return mk('Autosómico dominante', base([true, false, true, false, false, true]), cp, sb, 'Un progenitor afectado; ~1/2 de los hijos; no se salta generaciones') +
      mk('Autosómico recesivo', base([false, false, false, true, false, false]), cp, sb, 'Padres sanos portadores; 1/4 afectados') +
      mk('Mitocondrial', base([false, true, true, true, true, true]), cp, sb, 'Madre afectada → todos los hijos; padre afectado → ninguno');
  }
  function theoryFill(html) {
    const map = {
      seqGenerations: SV.seqGenerations, pyramid: SV.pyramid, cypName: SV.cypName, metabolizers: SV.metabolizers,
      cypInteractions: SV.cypInteractions, chromosome: SV.chromosome, methylSwitch: SV.methylSwitch, pointMutations: SV.pointMutations,
      etiology: () => SV.stacked([{ name: 'Desconocido', v: 50, lab: '50 %' }, { name: 'Multifactorial', v: 25, lab: '20–30 %' }, { name: 'Génicas', v: 7.5, lab: '7,5 %' }, { name: 'Teratógenos', v: 7.5, lab: '5–10 %' }, { name: 'Cromosómicas', v: 6, lab: '6 %' }], 'Causas de anomalías congénitas (clase 10)'),
      genome: () => SV.stacked([{ name: 'Intrones', v: 25.9 }, { name: 'LINEs', v: 20.4 }, { name: 'SINEs', v: 13.1 }, { name: 'Secuencias únicas varias', v: 11.6 }, { name: 'LTR retrotransposones', v: 8.3 }, { name: 'Heterocromatina', v: 8 }, { name: 'Duplicaciones segmentarias', v: 5 }, { name: 'Repeticiones simples', v: 3 }, { name: 'Transposones de ADN', v: 2.9 }, { name: 'Codificante de proteínas', v: 1.5 }], 'Composición del genoma humano (clase 11)')
    };
    return html.replace(/\{\{svg:(\w+)\}\}/g, (m, k) => `<div class="fig">${map[k] ? map[k]() : ''}</div>`);
  }
  function theoryExtras(root) {
    $$('[data-punnett="dihibrido"]', root).forEach((el) => {
      const g = ['AB', 'Ab', 'aB', 'ab'];
      el.innerHTML = '<p class="muted">Cuadro 4×4 del dihíbrido AaBb × AaBb (A amarilla, B lisa):</p>' + SV.punnett(g, g, (x, y) => GU.normGenotype(x + y)) +
        '<p class="muted">9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb</p>';
    });
    $$('[data-modes]', root).forEach((el) => { el.innerHTML = modesHTML(); });
    $$('[data-haplo-example]', root).forEach((el) => {
      el.innerHTML = '<p class="muted">Ejemplo de la clase 11 (consistente con ligamiento AR): ambos afectados heredaron 3-1 del padre y 1-2 de la madre.</p><div class="fig">' +
        SV.haplotypes({ father: { aff: false, h: [[3, 1], [2, 3]] }, mother: { aff: false, h: [[1, 2], [4, 3]] }, kids: [{ sex: 'M', aff: true, h: [[3, 1], [1, 2]] }, { sex: 'F', aff: true, h: [[3, 1], [1, 2]] }] }) + '</div>';
    });
  }

  // ---------- Pregunta de opción múltiple (componente) ----------
  function shuffledOrder(n, rng) { const idx = [...Array(n).keys()]; return rng ? rng.shuffle(idx) : idx.sort(() => Math.random() - 0.5); }
  function mcqCard(q, opts) {
    opts = opts || {};
    const order = opts.order || shuffledOrder(q.o.length);
    const el = h(`<div class="card mcq" data-id="${q.id}">
      <div class="q-head"><span class="badge">${esc(TOPIC[q.t].short)} · Sem ${TOPIC[q.t].n}</span>${opts.num ? `<span class="badge">${opts.num}</span>` : ''}</div>
      <div class="q-text">${esc(q.q)}</div>
      <div class="opts">${order.map((oi, k) => `<button class="opt" data-oi="${oi}"><span class="let">${LET[k]}</span><span>${esc(q.o[oi])}</span></button>`).join('')}</div>
    </div>`);
    const reveal = (chosen) => {
      $$('.opt', el).forEach((b) => {
        const oi = +b.dataset.oi;
        b.disabled = true;
        if (oi === q.a) b.classList.add('ok');
        else if (oi === chosen) b.classList.add('bad');
        b.insertAdjacentHTML('beforeend', `<span class="why">${oi === q.a ? '✓ ' : '✗ '}${esc(q.e[oi])}</span>`);
      });
    };
    el.reveal = reveal;
    $$('.opt', el).forEach((b) => b.addEventListener('click', () => {
      const oi = +b.dataset.oi;
      if (opts.exam) { // simulacro: solo marcar, sin corregir
        $$('.opt', el).forEach((x) => x.classList.toggle('sel', x === b));
        opts.onPick && opts.onPick(oi);
        return;
      }
      reveal(oi);
      const ok = oi === q.a;
      const p = progress.mcq[q.id] || { n: 0, ok: 0, last: false };
      p.n++; if (ok) p.ok++; p.last = ok; progress.mcq[q.id] = p; saveProgress();
      opts.onAnswer && opts.onAnswer(ok);
    }));
    if (opts.selected !== undefined && opts.selected !== null) { const b = $(`.opt[data-oi="${opts.selected}"]`, el); if (b) b.classList.add('sel'); }
    return el;
  }

  // ---------- Caso con cálculo (componente) ----------
  function caseCard(genId, seed, opts) {
    opts = opts || {};
    const g = GENBY[genId];
    const c = g.gen(GU.makeRng(seed));
    const values = opts.values || {};
    const el = h(`<div class="card case">
      <div class="q-head"><span class="badge">${esc(TOPIC[g.topic].short)} · ${esc(g.short)}</span>${opts.num ? `<span class="badge">${opts.num}</span>` : ''}</div>
      <h3 style="margin-top:4px">${esc(g.title)}</h3>
      <div class="case-statement">${c.statement}</div>
      ${c.figure ? `<div class="fig">${c.figure}</div>` : ''}
      <div class="convention"><b>Convención:</b> ${esc(c.convention)}</div>
      <div class="fields"></div>
      <div class="row" style="margin-top:12px">${opts.exam ? '' : '<button class="btn primary" data-act="check">Corregir</button><button class="btn" data-act="sol">Ver solución</button>'}${opts.newBtn ? '<button class="btn ghost" data-act="new">Nuevo caso</button>' : ''}</div>
      <div class="result"></div>
      <div class="solution hidden"></div>
    </div>`);
    const fieldsEl = $('.fields', el);
    c.fields.forEach((f, i) => {
      const id = 'f' + Math.random().toString(36).slice(2, 8) + i;
      let input;
      if (f.kind === 'choice') {
        input = `<select id="${id}" data-f="${f.id}"><option value="">— elige —</option>${f.options.map((o) => `<option>${esc(o)}</option>`).join('')}</select>`;
      } else {
        const dl = f.suggestions ? `<datalist id="${id}-dl">${f.suggestions.map((s) => `<option value="${esc(s)}">`).join('')}</datalist>` : '';
        input = `<input type="text" id="${id}" data-f="${f.id}" autocomplete="off" autocapitalize="off" spellcheck="false" ${f.suggestions ? `list="${id}-dl"` : ''} placeholder="${f.kind === 'num' ? (f.prob ? 'ej. 3/16, 0,1875 o 18,75 %' : f.tol === 0 ? 'número entero' : 'número (coma o punto)') : f.kind === 'ratio' ? 'ej. 9:3:3:1' : f.kind === 'protein' ? 'ej. Met-Lys-Arg' : f.kind === 'seq' ? 'ej. AUG GCU …' : ''}">${dl}`;
      }
      fieldsEl.appendChild(h(`<div class="field"><label class="lab" for="${id}">${i + 1}. ${esc(f.label)}</label><div class="inrow">${input}<span class="mark empty" aria-live="polite"></span></div><div class="expected hidden"></div></div>`));
    });
    const inputs = $$('[data-f]', el);
    inputs.forEach((inp) => {
      if (values[inp.dataset.f] !== undefined) inp.value = values[inp.dataset.f];
      inp.addEventListener('input', () => { opts.onChange && opts.onChange(inp.dataset.f, inp.value); });
      inp.addEventListener('change', () => { opts.onChange && opts.onChange(inp.dataset.f, inp.value); });
    });
    const grade = (showExpected) => {
      let ok = 0;
      c.fields.forEach((f) => {
        const inp = $(`[data-f="${f.id}"]`, el);
        const good = GU.grade(f, inp.value);
        if (good) ok++;
        const mk = inp.parentElement.querySelector('.mark');
        mk.className = 'mark ' + (good ? 'ok' : 'bad'); mk.textContent = good ? '✓' : '✗';
        const exp = inp.closest('.field').querySelector('.expected');
        if (showExpected) { exp.innerHTML = 'Respuesta esperada: <b>' + esc(f.display) + '</b>'; exp.classList.remove('hidden'); }
      });
      return { ok, total: c.fields.length };
    };
    const showSol = () => {
      const s = $('.solution', el);
      s.innerHTML = '<h4>Solución paso a paso</h4>' + c.solution;
      s.classList.remove('hidden');
      grade(true);
    };
    el.grade = grade; el.showSol = showSol; el.caseData = c;
    const act = (a) => $(`[data-act="${a}"]`, el);
    if (act('check')) act('check').addEventListener('click', () => {
      const r = grade(false);
      $('.result', el).innerHTML = `<div class="note ${r.ok === r.total ? 'ok' : r.ok ? 'warn' : 'bad'}">${r.ok} de ${r.total} campos correctos. ${r.ok === r.total ? '¡Excelente!' : 'Revisa los campos marcados con ✗ o pide la solución.'}</div>`;
      const p = progress.calc[genId] || { n: 0, ok: 0 };
      p.n++; if (r.ok === r.total) p.ok++; progress.calc[genId] = p; saveProgress();
    });
    if (act('sol')) act('sol').addEventListener('click', showSol);
    if (act('new')) act('new').addEventListener('click', () => opts.onNew && opts.onNew());
    return el;
  }

  // =====================================================================
  // TEORÍA
  // =====================================================================
  function renderTeoria() {
    const v = $('#view-teoria');
    const cur = store.get('theoryTopic', 's9');
    v.innerHTML = `<h2>Teoría por tema</h2>
      <div class="note">Material del Examen Final: clases de las semanas 9 a 14 (no hay archivo de la semana 15). Cada tema termina con un quiz para marcar.</div>
      <div class="topic-pick" role="toolbar" aria-label="Temas">${TOPICS.map((t) => `<button class="chip" data-t="${t.id}" aria-pressed="${t.id === cur}">S${t.n} · ${esc(t.short)}</button>`).join('')}</div>
      <div id="theoryBody"></div>`;
    $$('.chip', v).forEach((b) => b.addEventListener('click', () => {
      $$('.chip', v).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      store.set('theoryTopic', b.dataset.t); drawTopic(b.dataset.t);
    }));
    drawTopic(cur);
  }
  function drawTopic(t) {
    const body = $('#theoryBody');
    const T = TOPIC[t];
    body.innerHTML = `<div class="card theory"><h2 style="margin-top:0">Semana ${T.n} · ${esc(T.name)}</h2>${theoryFill(THEORY[t])}</div>
      <div class="card"><div class="row between"><h3 style="margin:0">Quiz del tema</h3><button class="btn small" id="newQuiz">Otro quiz</button></div><p class="muted">6 preguntas al azar del banco de este tema. Al marcar verás por qué cada opción es correcta o incorrecta.</p><div id="quizBox"></div><div id="quizScore"></div></div>`;
    theoryExtras(body);
    const drawQuiz = () => {
      const box = $('#quizBox'); box.innerHTML = '';
      const qs = MCQ.filter((q) => q.t === t).sort(() => Math.random() - 0.5).slice(0, 6);
      let answered = 0, good = 0;
      qs.forEach((q, i) => box.appendChild(mcqCard(q, { num: (i + 1) + '/6', onAnswer: (ok) => { answered++; if (ok) good++; $('#quizScore').innerHTML = `<div class="note ${good === answered ? 'ok' : 'warn'}">Llevas ${good} de ${answered} correctas.</div>`; } })));
      $('#quizScore').innerHTML = '';
    };
    $('#newQuiz').addEventListener('click', drawQuiz);
    drawQuiz();
  }

  // =====================================================================
  // CÓMO RESOLVER
  // =====================================================================
  const GUIDE_CASES = `<ol class="steps">
    <li><b>Lee y subraya los datos</b>: genotipos, fenotipos, frecuencias, porcentajes, fármaco y enzima. Identifica qué piden (probabilidad, fenotipo, conducta, mecanismo).</li>
    <li><b>Nombra el concepto</b> que aplica: "es autosómico recesivo porque…", "es metabolizador lento porque tiene 0 copias funcionales…", "es un profármaco…".</li>
    <li><b>Escribe la regla o fórmula</b> antes de reemplazar: regla del producto, 1 − P(ninguno), q², 2pq, promedio de metilación, razón de riesgos.</li>
    <li><b>Muestra el cálculo</b> con fracciones; da el resultado como fracción y decimal o porcentaje.</li>
    <li><b>Interpreta</b>: qué significa para el paciente (dosis, riesgo, fármaco alternativo, asesoramiento).</li>
    <li><b>Justifica con datos de la clase</b>: un número o un ejemplo concreto (p. ej., 2,6 % vs 0,8 % en clopidogrel; HLA-B*5701 en abacavir; *1/*1xN = 3 genes funcionales).</li></ol>
    <p><b>Qué suele pedir la rúbrica</b>: el modo/fenotipo correcto, el mecanismo (por qué), el cálculo con su regla y una conducta clínica coherente. Si no sabes un número, razona con el mecanismo: suele dar puntaje parcial.</p>`;
  const GUIDE_MCQ = `<ol class="steps">
    <li><b>Lee el enunciado completo y busca la palabra clave</b>: "NO", "excepto", "más probable", "primer paso", "según la clase".</li>
    <li><b>Responde mentalmente antes de mirar las opciones</b>; luego busca la que coincide.</li>
    <li><b>Descarta distractores típicos</b>: opciones invertidas (inhibidor ↔ inductor; hipo ↔ hipermetilación; casos ↔ controles), datos de otro tema (37 genes es mtDNA, no genoma nuclear), absolutos ("siempre", "nunca", "todos").</li>
    <li><b>Cuidado con los pares que se confunden</b>: penetrancia vs expresividad; farmacogenética vs farmacogenómica; profármaco vs fármaco activo; variante normal (&gt;4 %) vs anomalía menor (&lt;4 %); SSR (forense) vs SNP (muy comunes, baja mutación).</li>
    <li><b>En preguntas de cálculo</b>, estima el orden de magnitud: si te da 1/16 y la opción dice 9/16, estás mirando la clase opuesta.</li>
    <li><b>Si dudas entre dos</b>, elige la que esté redactada como en las diapositivas y con el mecanismo correcto.</li></ol>`;
  function renderResolver() {
    const v = $('#view-resolver');
    v.innerHTML = `<h2>Cómo resolver</h2>
      <p class="lead">Una receta por tipo de caso, con trampas frecuentes y un ejemplo resuelto. "Otro ejemplo" genera datos nuevos.</p>
      <details class="acc" open><summary>Guía para responder casos (desarrollo)</summary><div class="acc-body">${GUIDE_CASES}</div></details>
      <details class="acc"><summary>Estrategia para preguntas de marcar</summary><div class="acc-body">${GUIDE_MCQ}</div></details>
      <h3>Tipos de ejercicio de las clases</h3>
      <div id="howtoList"></div>`;
    const list = $('#howtoList');
    GENERATORS.forEach((g, i) => {
      const d = h(`<details class="acc"><summary><span>${esc(g.title)} <span class="badge">S${TOPIC[g.topic].n}</span></span></summary><div class="acc-body">
        <h4>Receta paso a paso</h4><ol class="steps">${g.howto.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        <h4>Trampas frecuentes</h4><ul class="traps">${g.howto.traps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="row between"><h4>Ejemplo resuelto</h4><button class="btn small" data-act="other">Otro ejemplo</button></div>
        <div class="example"></div></div></details>`);
      const ex = $('.example', d);
      const draw = (seed) => {
        const c = g.gen(GU.makeRng(seed));
        ex.innerHTML = `<div class="case-statement">${c.statement}</div>${c.figure ? `<div class="fig">${c.figure}</div>` : ''}
          <p><b>Se pide:</b></p><ol>${c.fields.map((f) => `<li>${esc(f.label)} → <b>${esc(f.display)}</b></li>`).join('')}</ol>
          <div class="solution"><h4>Solución completa</h4>${c.solution}</div><div class="convention"><b>Convención:</b> ${esc(c.convention)}</div>`;
      };
      let drawn = false;
      d.addEventListener('toggle', () => { if (d.open && !drawn) { draw(1000 + i * 17); drawn = true; } });
      $('[data-act="other"]', d).addEventListener('click', (e) => { e.preventDefault(); draw(GU.newSeed()); drawn = true; });
      list.appendChild(d);
    });
  }

  // =====================================================================
  // PRÁCTICA
  // =====================================================================
  function renderPractica() {
    const v = $('#view-practica');
    const mode = store.get('practiceMode', 'mcq');
    v.innerHTML = `<h2>Práctica</h2>
      <div class="seg" role="group" aria-label="Modo de práctica">
        <button data-m="mcq" aria-pressed="${mode === 'mcq'}">Para marcar</button>
        <button data-m="calc" aria-pressed="${mode === 'calc'}">Casos con cálculo</button>
        <button data-m="reason" aria-pressed="${mode === 'reason'}">Casos de razonamiento</button>
      </div><div id="practiceBody"></div>`;
    $$('.seg button', v).forEach((b) => b.addEventListener('click', () => {
      $$('.seg button', v).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      store.set('practiceMode', b.dataset.m); drawPractice(b.dataset.m);
    }));
    drawPractice(mode);
  }
  function drawPractice(m) { ({ mcq: drawMcqPractice, calc: drawCalcPractice, reason: drawReasonPractice })[m](); }

  function mcqStatsHTML() {
    return `<div class="stat-grid">${TOPICS.map((t) => {
      const qs = MCQ.filter((q) => q.t === t.id);
      const seen = qs.filter((q) => progress.mcq[q.id]);
      const last = seen.filter((q) => progress.mcq[q.id].last).length;
      const pct = seen.length ? Math.round(100 * last / seen.length) : 0;
      return `<div class="stat"><div class="k">S${t.n} · ${esc(t.short)}</div><div class="v">${seen.length}/${qs.length}</div><div class="k">${seen.length ? pct + ' % correctas (último intento)' : 'sin responder'}</div><div class="bar ${pct >= 70 ? 'ok' : pct >= 50 ? 'warn' : 'bad'}"><i style="width:${seen.length ? pct : 0}%"></i></div></div>`;
    }).join('')}</div>`;
  }
  function drawMcqPractice() {
    const body = $('#practiceBody');
    const f = store.get('mcqFilter', { t: 'all', mode: 'all' });
    body.innerHTML = `<div class="card"><div class="row between"><h3 style="margin:0">Banco de preguntas para marcar</h3><span class="badge">${MCQ.length} preguntas</span></div>
      <p class="muted">Corrección inmediata con explicación de cada opción. Estilo examen: aplicación y análisis.</p>
      <label>Tema</label><div class="chips" id="mcqTopics" style="margin:6px 0 10px"><button class="chip" data-t="all" aria-pressed="${f.t === 'all'}">Todos</button>${TOPICS.map((t) => `<button class="chip" data-t="${t.id}" aria-pressed="${f.t === t.id}">S${t.n} · ${esc(t.short)} (${MCQ.filter((q) => q.t === t.id).length})</button>`).join('')}</div>
      <label>Mostrar</label><div class="chips" id="mcqMode" style="margin-top:6px"><button class="chip" data-m="all" aria-pressed="${f.mode === 'all'}">Todas (al azar)</button><button class="chip" data-m="new" aria-pressed="${f.mode === 'new'}">No respondidas</button><button class="chip" data-m="wrong" aria-pressed="${f.mode === 'wrong'}">Falladas</button></div>
      </div>
      <div id="mcqOne"></div>
      <details class="acc"><summary>Mi progreso por tema</summary><div class="acc-body" id="mcqStats">${mcqStatsHTML()}</div></details>
      <div class="row"><button class="btn ghost small" id="mcqReset">Borrar progreso de preguntas</button></div>`;
    let pool = [], idx = 0;
    const build = () => {
      pool = MCQ.filter((q) => (f.t === 'all' || q.t === f.t) && (f.mode === 'all' || (f.mode === 'new' ? !progress.mcq[q.id] : progress.mcq[q.id] && !progress.mcq[q.id].last)));
      pool.sort(() => Math.random() - 0.5); idx = 0; show();
    };
    const show = () => {
      const box = $('#mcqOne'); box.innerHTML = '';
      if (!pool.length) { box.innerHTML = `<div class="note">No hay preguntas con este filtro. ${f.mode === 'wrong' ? '¡No tienes preguntas falladas!' : ''}</div>`; return; }
      const q = pool[idx % pool.length];
      const card = mcqCard(q, { num: `${(idx % pool.length) + 1} de ${pool.length}`, onAnswer: () => { $('#mcqStats').innerHTML = mcqStatsHTML(); nextBtn.classList.remove('hidden'); } });
      const nextBtn = h('<button class="btn primary hidden" style="margin-top:12px">Siguiente pregunta →</button>');
      nextBtn.addEventListener('click', () => { idx++; show(); card.scrollIntoView ? box.scrollIntoView({ behavior: 'smooth', block: 'start' }) : 0; });
      card.appendChild(nextBtn);
      const skip = h('<button class="btn ghost small" style="margin:12px 0 0 8px">Saltar</button>');
      skip.addEventListener('click', () => { idx++; show(); });
      card.appendChild(skip);
      box.appendChild(card);
    };
    $$('#mcqTopics .chip').forEach((b) => b.addEventListener('click', () => { $$('#mcqTopics .chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); f.t = b.dataset.t; store.set('mcqFilter', f); build(); }));
    $$('#mcqMode .chip').forEach((b) => b.addEventListener('click', () => { $$('#mcqMode .chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); f.mode = b.dataset.m; store.set('mcqFilter', f); build(); }));
    $('#mcqReset').addEventListener('click', () => { if (confirm('¿Borrar el progreso de las preguntas para marcar?')) { progress.mcq = {}; saveProgress(); $('#mcqStats').innerHTML = mcqStatsHTML(); build(); } });
    build();
  }

  function drawCalcPractice() {
    const body = $('#practiceBody');
    const cur = store.get('calcGen', GENERATORS[0].id);
    body.innerHTML = `<div class="card"><h3 style="margin-top:0">Casos con autograder</h3>
      <p class="muted">Datos aleatorios en cada caso. Acepta decimales con punto o coma, fracciones (9/16), porcentajes y texto (genotipos, secuencias, fenotipos) sin importar mayúsculas, espacios u orden.</p>
      <label for="genSel">Tipo de cálculo</label>
      <select id="genSel">${TOPICS.map((t) => `<optgroup label="Semana ${t.n} · ${esc(t.short)}">${GENERATORS.filter((g) => g.topic === t.id).map((g) => { const p = progress.calc[g.id]; return `<option value="${g.id}" ${g.id === cur ? 'selected' : ''}>${esc(g.title)}${p ? ` (${p.ok}/${p.n})` : ''}</option>`; }).join('')}</optgroup>`).join('')}</select>
      </div><div id="calcBox"></div>`;
    const draw = () => {
      const id = $('#genSel').value; store.set('calcGen', id);
      const box = $('#calcBox'); box.innerHTML = '';
      box.appendChild(caseCard(id, GU.newSeed(), { newBtn: true, onNew: draw }));
    };
    $('#genSel').addEventListener('change', draw);
    draw();
  }

  function reasonCard(cs, opts) {
    opts = opts || {};
    const drafts = store.get('drafts', {});
    const el = h(`<div class="card reason">
      <div class="q-head"><span class="badge">${esc(TOPIC[cs.t].short)} · Sem ${TOPIC[cs.t].n}</span>${opts.num ? `<span class="badge">${opts.num}</span>` : ''}</div>
      <h3 style="margin-top:4px">${esc(cs.title)}</h3>
      <p>${esc(cs.scenario)}</p>
      <ol class="ask">${cs.ask.map((a) => `<li>${esc(a)}</li>`).join('')}</ol>
      <label for="ta-${cs.id}">Tu respuesta</label>
      <textarea id="ta-${cs.id}" placeholder="Escribe tu respuesta: concepto, justificación, cálculo si aplica y conducta."></textarea>
      <div class="row" style="margin-top:10px">${opts.exam ? '' : '<button class="btn primary" data-act="model">Ver respuesta modelo y rúbrica</button>'}</div>
      <div class="modelbox hidden"></div>
    </div>`);
    const ta = $('textarea', el);
    ta.value = opts.exam ? (opts.value || '') : (drafts[cs.id] || '');
    ta.addEventListener('input', () => {
      if (opts.exam) { opts.onChange && opts.onChange(ta.value); return; }
      const d = store.get('drafts', {}); d[cs.id] = ta.value; store.set('drafts', d);
    });
    const showModel = (checked, onRubric) => {
      const mb = $('.modelbox', el);
      mb.innerHTML = `<h4>Respuesta modelo</h4><div class="model">${cs.model}</div>
        <h4>Rúbrica de autocorrección</h4><p class="muted">Marca lo que tu respuesta incluye de forma correcta.</p>
        <div class="rubric">${cs.rubric.map((r, i) => `<label><input type="checkbox" data-r="${i}" ${checked && checked[i] ? 'checked' : ''}> <span>${esc(r)}</span></label>`).join('')}</div>
        <div class="rscore note" style="margin-top:10px"></div>`;
      mb.classList.remove('hidden');
      const upd = () => {
        const ch = $$('[data-r]', mb).map((x) => x.checked);
        const n = ch.filter(Boolean).length;
        $('.rscore', mb).textContent = `Puntaje de rúbrica: ${n} de ${cs.rubric.length} criterios (${Math.round(100 * n / cs.rubric.length)} %).`;
        onRubric && onRubric(ch);
      };
      $$('[data-r]', mb).forEach((x) => x.addEventListener('change', upd));
      upd();
    };
    el.showModel = showModel;
    const b = $('[data-act="model"]', el);
    if (b) b.addEventListener('click', () => showModel(store.get('rubric:' + cs.id, null), (ch) => store.set('rubric:' + cs.id, ch)));
    return el;
  }
  function drawReasonPractice() {
    const body = $('#practiceBody');
    const cur = store.get('reasonCase', CASES[0].id);
    body.innerHTML = `<div class="card"><h3 style="margin-top:0">Casos de razonamiento (${CASES.length})</h3>
      <p class="muted">Escribe tu respuesta (se guarda como borrador), luego compara con la respuesta modelo y autocorrígete con la rúbrica.</p>
      <label for="caseSel">Caso</label>
      <select id="caseSel">${TOPICS.map((t) => `<optgroup label="Semana ${t.n} · ${esc(t.short)}">${CASES.filter((c) => c.t === t.id).map((c) => `<option value="${c.id}" ${c.id === cur ? 'selected' : ''}>${esc(c.title)}</option>`).join('')}</optgroup>`).join('')}</select>
      <div class="row" style="margin-top:10px"><button class="btn small" id="caseRand">Caso al azar</button></div></div><div id="reasonBox"></div>`;
    const draw = () => {
      const id = $('#caseSel').value; store.set('reasonCase', id);
      const box = $('#reasonBox'); box.innerHTML = ''; box.appendChild(reasonCard(CASEBY[id]));
    };
    $('#caseSel').addEventListener('change', draw);
    $('#caseRand').addEventListener('click', () => { $('#caseSel').value = CASES[Math.floor(Math.random() * CASES.length)].id; draw(); });
    draw();
  }

  // =====================================================================
  // SIMULACRO
  // =====================================================================
  let simTimer = null;
  const N_MCQ = 14, N_CALC = 2, PTS_MCQ = 1, PTS_CASE = 2; // 14 + 3×2 = 20
  function newSim(minutes) {
    const rng = GU.makeRng(GU.newSeed());
    // 14 preguntas: al menos 2 por tema, el resto al azar
    const byT = {}; TOPICS.forEach((t) => { byT[t.id] = rng.shuffle(MCQ.filter((q) => q.t === t.id)); });
    const picked = [];
    TOPICS.forEach((t) => picked.push(byT[t.id].pop(), byT[t.id].pop()));
    const rest = rng.shuffle([].concat(...TOPICS.map((t) => byT[t.id])));
    while (picked.length < N_MCQ) picked.push(rest.pop());
    const mcq = rng.shuffle(picked).map((q) => ({ id: q.id, order: shuffledOrder(q.o.length, rng) }));
    // 2 casos con cálculo de temas distintos + 1 de razonamiento
    const gens = rng.shuffle(GENERATORS.slice());
    const calc = [gens[0]];
    for (const g of gens.slice(1)) { if (calc.length >= N_CALC) break; if (g.topic !== calc[0].topic) calc.push(g); }
    const reason = rng.pick(CASES);
    return {
      started: Date.now(), minutes, submitted: false,
      mcq, calc: calc.map((g) => ({ gen: g.id, seed: GU.newSeed() })), reason: reason.id,
      ans: { mcq: {}, calc: [{}, {}], reason: '' }, rubric: null
    };
  }
  function renderSimulacro() {
    const v = $('#view-simulacro');
    const sim = store.get('sim', null);
    if (sim && !sim.submitted) return drawSimExam(sim);
    if (sim && sim.submitted) return drawSimResult(sim);
    drawSimSetup();
  }
  function drawSimSetup() {
    if (simTimer) { clearInterval(simTimer); simTimer = null; }
    const v = $('#view-simulacro');
    const last = store.get('lastSim', null);
    const hist = store.get('simHistory', []);
    v.innerHTML = `<h2>Simulacro de examen</h2>
      <div class="card"><p>Formato del parcial: <b>14 preguntas para marcar</b> (1 punto c/u) y <b>3 casos de desarrollo</b> (2 puntos c/u): 2 con cálculo y 1 de razonamiento. Total: <b>20 puntos</b>.</p>
      <ul><li>Preguntas y casos elegidos al azar de los bancos, con datos nuevos en cada intento (al menos 2 preguntas por tema).</li><li>Las respuestas quedan ocultas hasta entregar. Tu avance se guarda si cierras la página.</li><li>Al entregar: las preguntas y los cálculos se corrigen solos; el caso de razonamiento lo autocorriges con la rúbrica.</li></ul>
      <label for="simMin">Tiempo (minutos)</label>
      <div class="row"><input type="number" id="simMin" min="10" max="300" step="5" value="${store.get('simMinutes', 120)}" inputmode="numeric" style="max-width:140px"><button class="btn primary" id="simStart">Empezar simulacro</button></div></div>
      ${last ? `<div class="card"><h3 style="margin-top:0">Último simulacro</h3><p><b>${fmt2(last.score)}</b> / 20 · ${new Date(last.date).toLocaleString('es-PE')}</p>${hist.length > 1 ? `<p class="muted">Historial: ${hist.slice(-8).map((x) => fmt2(x.score)).join(' · ')}</p>` : ''}</div>` : ''}`;
    $('#simStart').addEventListener('click', () => {
      const m = Math.max(10, Math.min(300, parseInt($('#simMin').value, 10) || 120));
      store.set('simMinutes', m);
      const sim = newSim(m); store.set('sim', sim); drawSimExam(sim);
    });
  }
  function drawSimExam(sim) {
    const v = $('#view-simulacro');
    v.innerHTML = `<h2>Simulacro en curso</h2>
      <div class="timer" id="simTimerBox"><span>Tiempo restante</span><span class="t" id="simT">--:--</span><button class="btn primary small" id="simSubmitTop">Entregar</button></div>
      <h3 class="part-title">Parte I · Preguntas para marcar (${N_MCQ} × ${PTS_MCQ} pt)</h3><div id="simMcq"></div>
      <h3 class="part-title">Parte II · Casos (3 × ${PTS_CASE} pts)</h3><div id="simCases"></div>
      <div class="row" style="margin-top:16px"><button class="btn primary" id="simSubmit">Entregar examen</button><button class="btn ghost" id="simAbort">Abandonar</button></div>`;
    const save = () => store.set('sim', sim);
    sim.mcq.forEach((m, i) => $('#simMcq').appendChild(mcqCard(MCQBY[m.id], { exam: true, order: m.order, num: `Pregunta ${i + 1}`, selected: sim.ans.mcq[m.id], onPick: (oi) => { sim.ans.mcq[m.id] = oi; save(); } })));
    sim.calc.forEach((c, i) => $('#simCases').appendChild(caseCard(c.gen, c.seed, { exam: true, num: `Caso ${i + 1}`, values: sim.ans.calc[i], onChange: (f, val) => { sim.ans.calc[i][f] = val; save(); } })));
    $('#simCases').appendChild(reasonCard(CASEBY[sim.reason], { exam: true, num: 'Caso 3', value: sim.ans.reason, onChange: (val) => { sim.ans.reason = val; save(); } }));
    const submit = (auto) => {
      if (!auto) {
        const unanswered = sim.mcq.filter((m) => sim.ans.mcq[m.id] === undefined).length;
        if (!confirm(`¿Entregar el examen?${unanswered ? ` Tienes ${unanswered} pregunta(s) sin marcar.` : ''}`)) return;
      }
      sim.submitted = true; sim.submittedAt = Date.now(); sim.rubric = CASEBY[sim.reason].rubric.map(() => false); save();
      if (simTimer) { clearInterval(simTimer); simTimer = null; }
      drawSimResult(sim);
      window.scrollTo(0, 0);
    };
    $('#simSubmit').addEventListener('click', () => submit(false));
    $('#simSubmitTop').addEventListener('click', () => submit(false));
    $('#simAbort').addEventListener('click', () => { if (confirm('¿Abandonar este simulacro? Se perderán las respuestas.')) { store.del('sim'); drawSimSetup(); } });
    const tick = () => {
      const left = sim.started + sim.minutes * 60000 - Date.now();
      const el = $('#simT'); if (!el) { clearInterval(simTimer); return; }
      if (left <= 0) { el.textContent = '00:00'; alert('Se acabó el tiempo. El examen se entregará automáticamente.'); submit(true); return; }
      const s = Math.floor(left / 1000), hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
      el.textContent = (hh ? hh + ':' : '') + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
      $('#simTimerBox').classList.toggle('low', left < 5 * 60000);
    };
    if (simTimer) clearInterval(simTimer);
    simTimer = setInterval(tick, 1000); tick();
  }
  function scoreSim(sim) {
    const per = {}; TOPICS.forEach((t) => { per[t.id] = { got: 0, max: 0 }; });
    let mcqGot = 0;
    sim.mcq.forEach((m) => { const q = MCQBY[m.id]; const ok = sim.ans.mcq[m.id] === q.a; if (ok) mcqGot += PTS_MCQ; per[q.t].max += PTS_MCQ; if (ok) per[q.t].got += PTS_MCQ; });
    const calcRes = sim.calc.map((c, i) => {
      const g = GENBY[c.gen]; const cs = g.gen(GU.makeRng(c.seed));
      const ok = cs.fields.filter((f) => GU.grade(f, (sim.ans.calc[i] || {})[f.id] || '')).length;
      const pts = PTS_CASE * ok / cs.fields.length;
      per[g.topic].max += PTS_CASE; per[g.topic].got += pts;
      return { ok, total: cs.fields.length, pts };
    });
    const cs = CASEBY[sim.reason];
    const rOk = (sim.rubric || []).filter(Boolean).length;
    const rPts = PTS_CASE * rOk / cs.rubric.length;
    per[cs.t].max += PTS_CASE; per[cs.t].got += rPts;
    const total = mcqGot + calcRes.reduce((a, b) => a + b.pts, 0) + rPts;
    return { total, mcqGot, calcRes, rPts, rOk, per };
  }
  function drawSimResult(sim) {
    const v = $('#view-simulacro');
    v.innerHTML = `<h2>Resultado del simulacro</h2>
      <div class="card" id="simScore"></div>
      <div class="card"><h3 style="margin-top:0">Desglose por tema</h3><div id="simPer"></div></div>
      <h3 class="part-title">Caso de razonamiento: autocorrígelo con la rúbrica</h3><div id="simReason"></div>
      <h3 class="part-title">Revisión de los casos con cálculo</h3><div id="simCalc"></div>
      <h3 class="part-title">Revisión de las preguntas para marcar</h3><div id="simMcqRev"></div>
      <div class="row" style="margin-top:16px"><button class="btn primary" id="simNew">Nuevo simulacro</button><button class="btn" id="simToEF">Usar esta nota como EF en Notas</button></div>`;
    const update = () => {
      const r = scoreSim(sim);
      const last = { score: Math.round(r.total * 100) / 100, date: sim.submittedAt || Date.now() };
      store.set('lastSim', last);
      const hist = store.get('simHistory', []);
      if (!hist.length || hist[hist.length - 1].date !== last.date) hist.push(last); else hist[hist.length - 1] = last;
      store.set('simHistory', hist.slice(-30));
      $('#simScore').innerHTML = `<div class="row between"><div><div class="muted">Nota</div><div class="score-big">${fmt2(r.total)}<span class="muted" style="font-size:1rem"> / 20</span></div></div>
        <div class="stat-grid" style="flex:1;min-width:240px"><div class="stat"><div class="k">Preguntas para marcar</div><div class="v">${fmt2(r.mcqGot)} / ${N_MCQ}</div></div>
        <div class="stat"><div class="k">Casos con cálculo</div><div class="v">${fmt2(r.calcRes.reduce((a, b) => a + b.pts, 0))} / ${N_CALC * PTS_CASE}</div></div>
        <div class="stat"><div class="k">Razonamiento (rúbrica)</div><div class="v">${fmt2(r.rPts)} / ${PTS_CASE}</div></div></div></div>
        <div class="note ${r.total >= 11 ? 'ok' : 'warn'}">${r.total >= 11 ? 'Aprobado (≥ 11).' : 'Por debajo de 11: revisa los temas con menor porcentaje.'} La nota se actualiza al marcar la rúbrica del caso de razonamiento.</div>`;
      $('#simPer').innerHTML = TOPICS.filter((t) => r.per[t.id].max > 0).map((t) => {
        const p = r.per[t.id]; const pct = Math.round(100 * p.got / p.max);
        return `<div style="margin:10px 0"><div class="row between"><span><b>S${t.n}</b> · ${esc(t.name)}</span><span>${fmt2(p.got)} / ${fmt2(p.max)} (${pct} %)</span></div><div class="bar ${pct >= 70 ? 'ok' : pct >= 50 ? 'warn' : 'bad'}"><i style="width:${pct}%"></i></div></div>`;
      }).join('') + '<p class="muted">Repasa primero los temas en rojo o amarillo (pestaña Teoría y Práctica filtrada por tema).</p>';
    };
    const rc = reasonCard(CASEBY[sim.reason], { exam: true, num: 'Caso 3', value: sim.ans.reason });
    $('textarea', rc).readOnly = true;
    $('#simReason').appendChild(rc);
    rc.showModel(sim.rubric, (ch) => { sim.rubric = ch; store.set('sim', sim); update(); });
    sim.calc.forEach((c, i) => {
      const card = caseCard(c.gen, c.seed, { exam: true, num: `Caso ${i + 1}`, values: sim.ans.calc[i] });
      $$('[data-f]', card).forEach((x) => { x.disabled = true; });
      $('#simCalc').appendChild(card); card.showSol();
    });
    sim.mcq.forEach((m, i) => {
      const q = MCQBY[m.id];
      const card = mcqCard(q, { exam: true, order: m.order, num: `Pregunta ${i + 1}` });
      const chosen = sim.ans.mcq[m.id];
      card.reveal(chosen === undefined ? -1 : chosen);
      if (chosen === undefined) card.appendChild(h('<div class="note warn">Sin responder.</div>'));
      $('#simMcqRev').appendChild(card);
    });
    update();
    $('#simNew').addEventListener('click', () => { store.del('sim'); drawSimSetup(); });
    $('#simToEF').addEventListener('click', () => { const g = store.get('grades', {}); g.EF = store.get('lastSim', { score: 0 }).score; store.set('grades', g); rendered.notas = false; showTab('notas'); });
  }

  // =====================================================================
  // NOTAS
  // =====================================================================
  const WEIGHTS = [
    { k: 'EP', name: 'Examen Parcial', w: 0.20, when: 'semana 8' },
    { k: 'EC1', name: 'Evaluación Continua 1', w: 0.30, when: 'semanas 4–15' },
    { k: 'EC2', name: 'Evaluación Continua 2', w: 0.20, when: 'semanas 4–15' },
    { k: 'EF', name: 'Examen Final', w: 0.30, when: 'semana 16' }
  ];
  function renderNotas() {
    const v = $('#view-notas');
    const g = store.get('grades', {});
    const meta = store.get('meta', 11);
    const round = store.get('roundRule', false);
    v.innerHTML = `<h2>Simulador de notas</h2>
      <div class="card"><p class="muted">Teoría 100 %, escala 0–20. Deja vacío lo que aún no rindes (cuenta como pendiente).</p>
      <div id="gradeRows">${WEIGHTS.map((x) => `<div class="grade-row" data-k="${x.k}">
        <div><div class="name">${x.k} · ${esc(x.name)}</div><div class="w">${Math.round(x.w * 100)} % · ${x.when}</div></div>
        <input type="text" inputmode="decimal" aria-label="Nota ${x.k}" placeholder="pendiente" value="${g[x.k] !== undefined && g[x.k] !== null ? GU.fmtNum(g[x.k], 2) : ''}">
        <button class="btn icon small" aria-label="Vaciar ${x.k}" title="Marcar como pendiente">×</button>
        <input type="range" min="0" max="20" step="0.5" value="${g[x.k] !== undefined && g[x.k] !== null ? g[x.k] : 0}" aria-label="Deslizador ${x.k}">
      </div>`).join('')}</div>
      <div class="row" style="margin-top:12px"><label for="metaIn" style="margin-right:4px">Meta</label><input type="text" inputmode="decimal" id="metaIn" value="${GU.fmtNum(meta, 2)}" style="max-width:100px">
      <label class="row" style="font-weight:500;gap:8px"><input type="checkbox" id="roundIn" ${round ? 'checked' : ''} style="width:22px;height:22px;accent-color:var(--accent)"> Contar x,5 como redondeo hacia arriba</label></div>
      <div class="row" style="margin-top:10px"><button class="btn" id="useSim">Usar nota del último simulacro como EF</button><button class="btn ghost small" id="clearGrades">Vaciar todo</button></div>
      <p class="muted" id="simInfo"></p></div>
      <div class="card"><h3 style="margin-top:0">Resultados</h3><div id="gradeOut"></div></div>`;
    const read = () => {
      const out = {};
      $$('.grade-row').forEach((row) => {
        const p = GU.parseNumber($('input[type="text"]', row).value);
        out[row.dataset.k] = p && !p.pct && p.v >= 0 && p.v <= 20 ? p.v : null;
      });
      return out;
    };
    const compute = () => {
      const vals = read();
      const gg = {}; WEIGHTS.forEach((x) => { if (vals[x.k] !== null) gg[x.k] = vals[x.k]; });
      store.set('grades', gg);
      $$('.grade-row').forEach((row) => {
        const val = vals[row.dataset.k];
        row.classList.toggle('pending', val === null);
        const inTxt = $('input[type="text"]', row);
        const p = GU.parseNumber(inTxt.value);
        inTxt.style.borderColor = inTxt.value.trim() && (val === null) ? 'var(--bad)' : '';
        if (val !== null) $('input[type="range"]', row).value = val;
        void p;
      });
      const mp = GU.parseNumber($('#metaIn').value);
      const metaV = mp && mp.v >= 0 && mp.v <= 20 ? mp.v : 11;
      store.set('meta', metaV);
      const roundV = $('#roundIn').checked; store.set('roundRule', roundV);
      const target = roundV ? Math.max(0, metaV - 0.5) : metaV;
      let secured = 0, wDone = 0;
      WEIGHTS.forEach((x) => { if (vals[x.k] !== null) { secured += x.w * vals[x.k]; wDone += x.w; } });
      wDone = Math.round(wDone * 100) / 100;
      const wPend = Math.round((1 - wDone) * 100) / 100;
      const avgDone = wDone > 0 ? secured / wDone : null;
      const maxPossible = secured + 20 * wPend;
      let html = '<div class="result-grid">';
      html += `<div class="stat"><div class="k">${wPend === 0 ? 'Nota final' : 'Puntos asegurados'}</div><div class="v">${fmt2(secured)}</div><div class="k">${wPend === 0 ? 'todas las notas ingresadas' : 'de 20 (si lo pendiente fuera 0)'}</div></div>`;
      html += `<div class="stat"><div class="k">Promedio de lo rendido</div><div class="v">${avgDone === null ? '—' : fmt2(avgDone)}</div><div class="k">${Math.round(wDone * 100)} % del curso rendido</div></div>`;
      html += `<div class="stat"><div class="k">Nota máxima posible</div><div class="v">${fmt2(maxPossible)}</div><div class="k">con 20 en lo pendiente</div></div>`;
      let needAvg = null;
      if (wPend > 0) { needAvg = (target - secured) / wPend; html += `<div class="stat"><div class="k">Promedio necesario en lo pendiente</div><div class="v">${needAvg <= 0 ? '0' : fmt2(needAvg)}</div><div class="k">para la meta de ${fmt2(metaV)}${roundV ? ' (≥ ' + fmt2(target) + ')' : ''}</div></div>`; }
      html += '</div>';
      if (wPend === 0) {
        const fin = roundV ? Math.floor(secured + 0.5) : secured;
        html += `<div class="note ${secured >= target ? 'ok' : 'bad'}">Nota final: <b>${fmt2(secured)}</b>${roundV ? ` → redondeada <b>${fin}</b>` : ''}. ${secured >= target ? 'Alcanzas la meta.' : 'No alcanzas la meta de ' + fmt2(metaV) + '.'}</div>`;
      } else {
        if (vals.EF === null) {
          const others = WEIGHTS.filter((x) => x.k !== 'EF' && vals[x.k] === null);
          const wOthers = others.reduce((a, x) => a + x.w, 0);
          if (!others.length) {
            const needEF = (target - secured) / 0.3;
            html += `<div class="note ${needEF > 20 ? 'bad' : needEF <= 0 ? 'ok' : ''}">En el <b>Examen Final</b> necesitas <b>${needEF <= 0 ? '0 (meta asegurada)' : fmt2(needEF)}</b>${needEF > 20 ? ' — imposible (máximo 20).' : '.'}</div>`;
          } else {
            const assume = avgDone === null ? needAvg : avgDone;
            const needEF = (target - secured - wOthers * assume) / 0.3;
            html += `<div class="note">Si en ${others.map((x) => x.k).join(' y ')} sacas <b>${fmt2(assume)}</b> (${avgDone === null ? 'el promedio necesario' : 'tu promedio actual'}), en el <b>EF</b> necesitas <b>${needEF <= 0 ? '0' : fmt2(needEF)}</b>${needEF > 20 ? ' (más de 20: necesitarás subir en lo demás)' : ''}.</div>`;
          }
        }
        if (needAvg > 20) html += `<div class="note bad">La meta de ${fmt2(metaV)} ya no se puede alcanzar: la nota máxima posible es <b>${fmt2(maxPossible)}</b>.</div>`;
        else if (needAvg <= 0) html += `<div class="note ok">¡Meta asegurada! Aunque saques 0 en lo pendiente llegas a ${fmt2(secured)}.</div>`;
      }
      $('#gradeOut').innerHTML = html;
      const last = store.get('lastSim', null);
      $('#simInfo').textContent = last ? `Último simulacro: ${fmt2(last.score)} / 20 (${new Date(last.date).toLocaleDateString('es-PE')}).` : 'Aún no has hecho un simulacro.';
      $('#useSim').disabled = !last;
    };
    $$('.grade-row').forEach((row) => {
      const txt = $('input[type="text"]', row), rng = $('input[type="range"]', row);
      txt.addEventListener('input', compute);
      rng.addEventListener('input', () => { txt.value = GU.fmtNum(+rng.value, 2); compute(); });
      $('button', row).addEventListener('click', () => { txt.value = ''; compute(); });
    });
    $('#metaIn').addEventListener('input', compute);
    $('#roundIn').addEventListener('change', compute);
    $('#useSim').addEventListener('click', () => { const last = store.get('lastSim', null); if (last) { $('.grade-row[data-k="EF"] input[type="text"]').value = GU.fmtNum(last.score, 2); compute(); } });
    $('#clearGrades').addEventListener('click', () => { $$('.grade-row input[type="text"]').forEach((x) => { x.value = ''; }); compute(); });
    compute();
  }

  // ---------- Videos y audio ----------
  function fmtTime(s) {
    s = Math.max(0, Math.floor(s || 0));
    const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
    return (hh ? hh + ':' + String(mm).padStart(2, '0') : mm) + ':' + String(ss).padStart(2, '0');
  }
  function renderVideos() {
    const v = $('#view-videos');
    const M = window.MEDIA;
    if (!M || !M.full) { v.innerHTML = '<div class="card"><p>Los videos todavía no están disponibles.</p></div>'; return; }
    const items = [M.full].concat(M.topics);
    const ITEM = Object.fromEntries(items.map((x) => [x.id, x]));
    const st = store.get('media', { mode: 'audio', id: 'completo', rate: 1, auto: true, pos: {} });
    if (!ITEM[st.id]) st.id = 'completo';
    st.pos = st.pos || {};
    const save = () => store.set('media', st);
    const label = (x) => x.id === 'completo' ? 'Repaso completo' : `S${x.n} · ${x.name}`;
    v.innerHTML = `
      <h2>Videos y audio de repaso</h2>
      <p class="lead">Un repaso consolidado de las clases 9 a 14 y uno por clase, narrados a partir de la teoría de esta web. Usa <b>Solo audio</b> para seguir escuchando con el celular bloqueado o con otra app abierta.</p>
      <div class="card player-card">
        <div class="row between">
          <div class="seg" role="group" aria-label="Formato">
            <button data-mode="video" aria-pressed="${st.mode === 'video'}">Video</button>
            <button data-mode="audio" aria-pressed="${st.mode === 'audio'}">Solo audio</button>
          </div>
          <label class="row" style="gap:6px">Velocidad
            <select id="mRate" style="width:auto">${[0.75, 1, 1.25, 1.5, 1.75, 2].map((r) => `<option value="${r}" ${+st.rate === r ? 'selected' : ''}>${String(r).replace('.', ',')}×</option>`).join('')}</select>
          </label>
        </div>
        <div class="row between" style="margin-top:12px"><h3 id="mTitle" style="margin:0"></h3><span class="muted" id="mInfo"></span></div>
        <div id="mStage" class="media-stage"></div>
        <div class="row" style="margin-top:10px">
          <button class="btn" id="mBack" aria-label="Retroceder 15 segundos">−15 s</button>
          <button class="btn" id="mFwd" aria-label="Adelantar 15 segundos">+15 s</button>
          <label class="row" style="gap:6px;margin-left:auto"><input type="checkbox" id="mAuto" ${st.auto ? 'checked' : ''}> Seguir con la siguiente clase</label>
        </div>
        <p class="muted" id="mDl" style="margin-bottom:0"></p>
      </div>
      <div class="card">
        <h3>Elige un repaso</h3>
        <div class="media-list" role="list" aria-label="Repasos">${items.map((x) => `
          <button class="media-item" role="listitem" data-id="${x.id}" aria-pressed="${x.id === st.id}">
            <span class="mi-t">${esc(label(x))}</span><span class="mi-d">${Math.round(x.dur / 60)} min</span>
          </button>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3>Capítulos</h3>
        <ol class="chapters" id="mChap"></ol>
      </div>
      <div class="card">
        <h3>Escuchar con el celular bloqueado</h3>
        <ul>
          <li>Elige <b>Solo audio</b> y dale play. En iPhone y iPad, el video se pausa al bloquear la pantalla; el audio sigue sonando y se controla desde la pantalla de bloqueo.</li>
          <li>Se recuerda dónde te quedaste en cada repaso.</li>
          <li>Los videos y audios necesitan conexión: no se guardan para usar sin internet. Para escuchar sin datos, descarga el MP3 con el enlace de abajo del reproductor.</li>
          <li>La narración usa una voz sintética. Si algo no coincide con tus apuntes, manda lo que dicen las clases.</li>
        </ul>
      </div>`;
    let media = null, lastSave = 0;
    const cur = () => ITEM[st.id];
    const chapIdx = (t) => { const ch = cur().chapters; let i = 0; ch.forEach((c, k) => { if (t >= c.s) i = k; }); return i; };
    function setSession() {
      if (!('mediaSession' in navigator)) return;
      const x = cur();
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: label(x), artist: 'Genética · Examen Final', album: 'Repaso de las clases 9–14',
          artwork: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }] });
        const H = {
          play: () => media && media.play(), pause: () => media && media.pause(),
          seekbackward: (d) => { if (media) media.currentTime = Math.max(0, media.currentTime - ((d && d.seekOffset) || 15)); },
          seekforward: (d) => { if (media) media.currentTime = Math.min(media.duration || 1e9, media.currentTime + ((d && d.seekOffset) || 15)); },
          seekto: (d) => { if (media && d && typeof d.seekTime === 'number') media.currentTime = d.seekTime; },
          previoustrack: () => { if (!media) return; const ch = cur().chapters, i = chapIdx(media.currentTime - 3); media.currentTime = ch[Math.max(0, i)].s; },
          nexttrack: () => { if (!media) return; const ch = cur().chapters, i = chapIdx(media.currentTime); if (ch[i + 1]) media.currentTime = ch[i + 1].s; }
        };
        Object.keys(H).forEach((k) => { try { navigator.mediaSession.setActionHandler(k, H[k]); } catch (e) { /* acción no soportada */ } });
      } catch (e) { /* sin Media Session */ }
    }
    function markChapter() {
      if (!media) return;
      const i = chapIdx(media.currentTime);
      $$('#mChap li', v).forEach((li, k) => li.classList.toggle('now', k === i));
    }
    function load(autoplay) {
      const x = cur();
      const wasPlaying = autoplay;
      if (media) { media.pause(); media.removeAttribute('src'); media.load(); }
      const tag = st.mode === 'video' ? 'video' : 'audio';
      $('#mStage', v).innerHTML = tag === 'video'
        ? `<video controls playsinline preload="metadata" poster="" src="${x.video}"></video>`
        : `<div class="audio-art"><img src="icons/icon-192.png" alt="" width="64" height="64"><div><b>${esc(label(x))}</b><div class="muted">Solo audio · ${Math.round(x.dur / 60)} min</div></div></div><audio controls preload="metadata" src="${x.audio}"></audio>`;
      media = $(tag, v);
      media.playbackRate = +st.rate || 1;
      $('#mTitle', v).textContent = label(x);
      $('#mInfo', v).textContent = fmtTime(x.dur);
      $('#mChap', v).innerHTML = x.chapters.map((c, k) => `<li><button class="chap" data-k="${k}"><span>${esc(c.t)}</span><span class="muted">${fmtTime(c.s)}</span></button></li>`).join('');
      $$('#mChap .chap', v).forEach((b) => b.addEventListener('click', () => { media.currentTime = x.chapters[+b.dataset.k].s; media.play().catch(() => {}); }));
      $('#mDl', v).innerHTML = `Descargar: <a href="${x.audio}" download>MP3 (${String(x.audioMB).replace('.', ',')} MB)</a> · <a href="${x.video}" download>MP4 (${String(x.videoMB).replace('.', ',')} MB)</a>`;
      const resume = st.pos[x.id] || 0;
      media.addEventListener('loadedmetadata', () => {
        media.playbackRate = +st.rate || 1;
        if (resume > 5 && resume < (media.duration || x.dur) - 5) media.currentTime = resume;
        markChapter();
      }, { once: true });
      media.addEventListener('timeupdate', () => {
        markChapter();
        const now = Date.now();
        if (now - lastSave > 4000) { lastSave = now; st.pos[x.id] = media.currentTime; save(); }
      });
      media.addEventListener('pause', () => { st.pos[x.id] = media.currentTime; save(); });
      media.addEventListener('ratechange', () => { if (media.playbackRate !== +st.rate) { st.rate = media.playbackRate; save(); $('#mRate', v).value = String(st.rate); } });
      media.addEventListener('ended', () => {
        st.pos[x.id] = 0; save();
        const i = items.findIndex((y) => y.id === x.id);
        if (st.auto && x.id !== 'completo' && items[i + 1]) select(items[i + 1].id, true);
      });
      setSession();
      if (wasPlaying) media.play().catch(() => {});
    }
    function select(id, autoplay) {
      if (media && !media.paused) { st.pos[st.id] = media.currentTime; }
      st.id = id; save();
      $$('.media-item', v).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
      load(autoplay);
    }
    $$('.media-item', v).forEach((b) => b.addEventListener('click', () => select(b.dataset.id, !!(media && !media.paused))));
    $$('[data-mode]', v).forEach((b) => b.addEventListener('click', () => {
      if (st.mode === b.dataset.mode) return;
      const playing = media && !media.paused;
      if (media) st.pos[st.id] = media.currentTime;
      st.mode = b.dataset.mode; save();
      $$('[data-mode]', v).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      load(playing);
    }));
    $('#mRate', v).addEventListener('change', (e) => { st.rate = +e.target.value; save(); if (media) media.playbackRate = st.rate; });
    $('#mAuto', v).addEventListener('change', (e) => { st.auto = e.target.checked; save(); });
    $('#mBack', v).addEventListener('click', () => { if (media) media.currentTime = Math.max(0, media.currentTime - 15); });
    $('#mFwd', v).addEventListener('click', () => { if (media) media.currentTime = Math.min(media.duration || 1e9, media.currentTime + 15); });
    load(false);
  }

  const RENDER = { teoria: renderTeoria, resolver: renderResolver, practica: renderPractica, simulacro: renderSimulacro, videos: renderVideos, notas: renderNotas };
  const startTab = (location.hash || '').replace('#', '') || store.get('tab', 'teoria');
  showTab(RENDER[startTab] ? startTab : 'teoria');

  // ---------- Service worker (modo sin conexión) ----------
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* sin SW */ }); });
  }
})();
