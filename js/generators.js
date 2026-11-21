/* generators.js — generadores de casos con cálculo (datos aleatorios con semilla).
   Cada generador: {id, topic, title, short, howto:{steps,traps}, gen(rng) → caso}
   caso: {statement, figure, fields:[{id,label,kind,answer,display,...}], solution, convention} */
(function (root) {
  'use strict';
  const GU = root.GU || (typeof require !== 'undefined' ? require('./util.js') : null);
  const SV = root.SV || (typeof require !== 'undefined' ? require('./svg.js') : null);
  const { frac, F, fmtNum, fmtPct, fmtProb, binom } = GU;
  const esc = SV.esc;

  const probField = (id, label, fr, extra) => Object.assign({ id, label, kind: 'num', prob: true, answer: F.val(fr), display: fmtProb(fr), tol: 0.0006 }, extra || {});
  const pctOf = (x) => fmtNum(x * 100, 2) + ' %';

  // ===================================================================
  // 1. Leyes de Mendel: mono-, di- y trihíbridos (clase 9)
  // ===================================================================
  const TRAITS = [
    { g: 'A', dom: 'semilla amarilla', rec: 'semilla verde' },
    { g: 'R', dom: 'semilla lisa', rec: 'semilla rugosa' },
    { g: 'P', dom: 'flor púrpura', rec: 'flor blanca' },
    { g: 'L', dom: 'tallo largo', rec: 'tallo corto' },
    { g: 'V', dom: 'vaina verde', rec: 'vaina amarilla' },
    { g: 'H', dom: 'vaina llena', rec: 'vaina constreñida' }
  ];
  function geneDist(p1, p2) { // p1, p2: strings como 'Aa'
    const out = { DD: frac(0), Dd: frac(0), dd: frac(0) };
    for (const a of p1) for (const b of p2) {
      const k = (a === a.toUpperCase() ? 1 : 0) + (b === b.toUpperCase() ? 1 : 0);
      const key = k === 2 ? 'DD' : k === 1 ? 'Dd' : 'dd';
      out[key] = F.add(out[key], frac(1, 4));
    }
    return out;
  }
  const gname = (L, key) => key === 'DD' ? L + L : key === 'Dd' ? L + L.toLowerCase() : L.toLowerCase() + L.toLowerCase();

  const mendel = {
    id: 'mendel', topic: 's9', title: 'Leyes de Mendel: mono-, di- y trihíbridos', short: 'Mendel',
    howto: {
      steps: [
        'Escribe el genotipo de cada progenitor gen por gen (p. ej., AaRr × Aarr → gen A: Aa × Aa; gen R: Rr × rr).',
        'Para cada gen por separado haz un cuadro de Punnett 2×2 (segunda ley: los alelos se segregan en los gametos).',
        'Anota la probabilidad de cada genotipo y fenotipo de ese gen (p. ej., Aa × Aa → 1/4 AA, 1/2 Aa, 1/4 aa; fenotipo dominante 3/4).',
        'Tercera ley (combinación independiente): multiplica las probabilidades de cada gen (regla del producto).',
        'Para la proporción fenotípica, lista las clases en el orden pedido, calcula cada una como producto y simplifica (9:3:3:1, 3:1:3:1, etc.).'
      ],
      traps: [
        'Confundir genotipo con fenotipo: "fenotipo dominante" incluye AA y Aa (3/4), no solo AA.',
        'Sumar en lugar de multiplicar: para que ocurran dos cosas a la vez (gen A Y gen R) se multiplica.',
        'Olvidar que un progenitor homocigoto (AA o aa) solo forma un tipo de gameto para ese gen.',
        'En un trihíbrido no hagas un Punnett de 8×8: trabaja gen por gen y multiplica.'
      ]
    },
    gen(rng) {
      const n = rng.pick([1, 1, 2, 2, 2, 3, 3]);
      const traits = rng.sample(TRAITS, n);
      const classic = rng.chance(0.4);
      let p1, p2;
      for (let tries = 0; tries < 50; tries++) {
        p1 = []; p2 = [];
        traits.forEach((t) => {
          const L = t.g, l = L.toLowerCase();
          const opts = [L + L, L + l, l + l];
          if (classic) { p1.push(L + l); p2.push(L + l); }
          else { p1.push(rng.pick([L + l, L + l, L + L, l + l])); p2.push(rng.pick([L + l, L + l, l + l, L + L])); }
          void opts;
        });
        const segregating = traits.filter((t, i) => !(p1[i][0] === p1[i][1] && p2[i][0] === p2[i][1]));
        if (segregating.length >= 1) break;
      }
      const dists = traits.map((t, i) => geneDist(p1[i], p2[i]));
      // genotipo objetivo
      const tgtG = dists.map((d) => rng.pick(Object.keys(d).filter((k) => d[k].n > 0)));
      let pG = frac(1);
      tgtG.forEach((k, i) => { pG = F.mul(pG, dists[i][k]); });
      const tgtGstr = tgtG.map((k, i) => gname(traits[i].g, k)).join('');
      // fenotipo objetivo
      const tgtF = dists.map((d) => {
        const dom = F.add(d.DD, d.Dd);
        const opts = [];
        if (dom.n > 0) opts.push('D');
        if (d.dd.n > 0) opts.push('r');
        return rng.pick(opts);
      });
      let pF = frac(1);
      tgtF.forEach((k, i) => { pF = F.mul(pF, k === 'D' ? F.add(dists[i].DD, dists[i].Dd) : dists[i].dd); });
      const tgtFstr = tgtF.map((k, i) => (k === 'D' ? traits[i].dom : traits[i].rec)).join(', ');
      const P1 = p1.join(''), P2 = p2.join('');
      const kind = n === 1 ? 'monohíbrido' : n === 2 ? 'dihíbrido' : 'trihíbrido';

      const fields = [
        probField('pg', `P(descendiente con genotipo ${tgtGstr})`, pG),
        probField('pf', `P(descendiente con fenotipo: ${tgtFstr})`, pF)
      ];
      // proporción fenotípica (solo mono y di)
      let ratioTxt = '', ratioSol = '';
      if (n <= 2) {
        const classes = [];
        const combos = n === 1 ? [['D'], ['r']] : [['D', 'D'], ['D', 'r'], ['r', 'D'], ['r', 'r']];
        combos.forEach((c) => {
          let p = frac(1);
          c.forEach((k, i) => { p = F.mul(p, k === 'D' ? F.add(dists[i].DD, dists[i].Dd) : dists[i].dd); });
          if (p.n > 0) classes.push({ name: c.map((k, i) => (k === 'D' ? traits[i].dom : traits[i].rec)).join(' + '), p });
        });
        if (classes.length >= 2) {
          const den = Math.pow(4, n);
          let ints = classes.map((c) => F.val(c.p) * den).map(Math.round);
          const g = ints.reduce((a, b) => GU.gcd(a, b));
          ints = ints.map((x) => x / g);
          const order = classes.map((c) => c.name).join(' : ');
          fields.push({ id: 'ratio', label: `Proporción fenotípica en este orden → ${order}`, kind: 'ratio', answer: ints, display: ints.join(':') });
          ratioTxt = order;
          ratioSol = '<p><b>Proporción fenotípica:</b> ' + classes.map((c) => `${esc(c.name)} = ${F.str(c.p)}`).join('; ') + ` → <b>${ints.join(':')}</b>.</p>`;
        }
      }
      void ratioTxt;

      // solución
      let sol = '<ol>';
      traits.forEach((t, i) => {
        const d = dists[i];
        const L = t.g;
        const gam1 = [...new Set(p1[i].split(''))], gam2 = [...new Set(p2[i].split(''))];
        const table = SV.punnett(p1[i].split(''), p2[i].split(''), (a, b) => (a === a.toUpperCase() || b !== b.toUpperCase() ? a + b : b + a));
        sol += `<li><b>Gen ${L}</b> (${esc(t.dom)} &gt; ${esc(t.rec)}): ${p1[i]} × ${p2[i]}. Gametos: ${gam1.join(', ')} y ${gam2.join(', ')}.${table}` +
          `Genotipos: ${gname(L, 'DD')} ${F.str(d.DD)}, ${gname(L, 'Dd')} ${F.str(d.Dd)}, ${gname(L, 'dd')} ${F.str(d.dd)}. ` +
          `Fenotipo dominante = ${F.str(F.add(d.DD, d.Dd))}; recesivo = ${F.str(d.dd)}.</li>`;
      });
      sol += `<li><b>Genotipo ${tgtGstr}</b> (regla del producto): ` + tgtG.map((k, i) => F.str(dists[i][k])).join(' × ') + ` = <b>${fmtProb(pG)}</b>.</li>`;
      sol += `<li><b>Fenotipo (${esc(tgtFstr)})</b>: ` + tgtF.map((k, i) => F.str(k === 'D' ? F.add(dists[i].DD, dists[i].Dd) : dists[i].dd)).join(' × ') + ` = <b>${fmtProb(pF)}</b>.</li>`;
      sol += '</ol>' + ratioSol;
      if (n === 2 && p1.every((g) => g[0] !== g[1]) && p2.every((g) => g[0] !== g[1])) {
        const gam = (p) => { const a = [...new Set(p[0].split(''))], b = [...new Set(p[1].split(''))]; const r = []; a.forEach((x) => b.forEach((y) => r.push(x + y))); return r; };
        const tb = SV.punnett(gam(p1), gam(p2), (x, y) => GU.normGenotype(x + y).split('').join(''));
        sol += '<p>Comprobación con el cuadro 4×4 (16 combinaciones, como en la tercera ley de la clase 9):</p>' + tb;
      }

      const statement = `<p>En la arveja de Mendel, ${traits.map((t) => `<b>${t.g}</b> (${esc(t.dom)}) domina sobre <b>${t.g.toLowerCase()}</b> (${esc(t.rec)})`).join('; ')}. ` +
        `Los genes se transmiten de forma independiente (tercera ley).</p><p>Se cruza <b>${P1} × ${P2}</b> (cruce ${kind}).</p>`;
      return {
        statement, figure: '', fields, solution: sol,
        convention: 'Dominancia completa; genes independientes. Responde con fracción (3/16), decimal (0,1875) o porcentaje (18,75 %). Tolerancia ±0,0006.'
      };
    }
  };

  // ===================================================================
  // 2. Mendelismo complejo: codominancia y genes letales (clase 9)
  // ===================================================================
  const complejo = {
    id: 'complejo', topic: 's9', title: 'Mendelismo complejo: codominancia y alelos letales', short: 'Codominancia/letales',
    howto: {
      steps: [
        'Identifica la excepción: codominancia (A = B, el heterocigoto muestra ambos fenotipos) o alelo letal (un genotipo no nace).',
        'Haz el Punnett normal del cruce (1/4, 1/2, 1/4).',
        'Codominancia: cada genotipo es un fenotipo distinto → la proporción fenotípica es igual a la genotípica (1:2:1), "no se cumple 3/4 y 1/4".',
        'Letal: elimina el genotipo que muere y vuelve a calcular las proporciones solo entre los que nacen (divide entre la fracción que sobrevive).',
        'Para número esperado: multiplica la probabilidad por el total de descendientes nacidos.'
      ],
      traps: [
        'En letales, no dividir entre los sobrevivientes: entre los nacidos, Yy es 2/3 (no 1/2).',
        'Escribir 3:1 en codominancia: el heterocigoto es un fenotipo propio.',
        'Confundir el orden de las clases pedido en la proporción.'
      ]
    },
    gen(rng) {
      const type = rng.pick(['codo', 'codo', 'letal', 'letal']);
      if (type === 'codo') {
        const crosses = [['AB', 'AB'], ['AB', 'AA'], ['AB', 'BB'], ['AA', 'BB']];
        const [p1, p2] = rng.pick(crosses);
        const cnt = { AA: 0, AB: 0, BB: 0 };
        for (const a of p1) for (const b of p2) { const g = [a, b].sort().join(''); cnt[g]++; }
        const present = ['AA', 'AB', 'BB'].filter((g) => cnt[g] > 0);
        const N = rng.pick([80, 120, 160, 200]);
        const tg = rng.pick(present);
        const pr = frac(cnt[tg], 4);
        let ints = present.map((g) => cnt[g]);
        const g0 = ints.reduce((a, b) => GU.gcd(a, b)); ints = ints.map((x) => x / g0);
        const fields = [];
        if (present.length >= 2) fields.push({ id: 'ratio', label: `Proporción fenotípica en el orden ${present.map((g) => 'fenotipo ' + g).join(' : ')}`, kind: 'ratio', answer: ints, display: ints.join(':') });
        fields.push(probField('p', `P(descendiente con fenotipo ${tg})`, pr));
        fields.push({ id: 'n', label: `De ${N} descendientes, ¿cuántos se esperan con fenotipo ${tg}?`, kind: 'num', answer: N * F.val(pr), display: fmtNum(N * F.val(pr), 1), tol: 0.6 });
        const sol = `<p>Codominancia (A = B): el heterocigoto AB expresa ambos alelos, así que hay tantos fenotipos como genotipos.</p>` +
          SV.punnett(p1.split(''), p2.split(''), (a, b) => [a, b].sort().join('')) +
          `<p>Genotipos = fenotipos: ${present.map((g) => `${g} ${cnt[g]}/4`).join(', ')} → proporción <b>${ints.join(':')}</b> (no se cumple 3/4 : 1/4).</p>` +
          `<p>P(${tg}) = ${fmtProb(pr)}. Esperados: ${N} × ${F.str(pr)} = <b>${fmtNum(N * F.val(pr), 1)}</b>.</p>`;
        return {
          statement: `<p>Un carácter muestra <b>codominancia</b> entre los alelos <b>A</b> y <b>B</b> (A = B): AA, AB y BB tienen fenotipos distintos.</p><p>Se cruza <b>${p1} × ${p2}</b> y nacen ${N} descendientes.</p>`,
          figure: '', fields, solution: sol, convention: 'Fenotipo nombrado por el genotipo (AA, AB, BB). Probabilidad en fracción, decimal o %. Número esperado con tolerancia ±0,6.'
        };
      }
      // letal recesivo del homocigoto dominante
      const cross = rng.pick(['Yy×Yy', 'Yy×Yy', 'Yy×yy']);
      const N = rng.pick([60, 90, 120, 150, 180]);
      let fields, sol;
      if (cross === 'Yy×Yy') {
        fields = [
          { id: 'ratio', label: 'Proporción entre los nacidos: amarillo : no amarillo', kind: 'ratio', answer: [2, 1], display: '2:1' },
          probField('p', 'P(un descendiente nacido sea heterocigoto Yy)', frac(2, 3), { tol: 0.005 }),
          { id: 'n', label: `De ${N} descendientes nacidos, ¿cuántos amarillos se esperan?`, kind: 'num', answer: N * 2 / 3, display: fmtNum(N * 2 / 3, 1), tol: 0.6 }
        ];
        sol = SV.punnett(['Y', 'y'], ['Y', 'y'], (a, b) => (a === 'Y' || b === 'y' ? a + b : b + a)) +
          `<p>Al concebir: 1/4 YY (muere), 1/2 Yy (amarillo), 1/4 yy (no amarillo).</p><p>Entre los que <b>nacen</b> (3/4 del total): Yy = (1/2)/(3/4) = <b>2/3</b>; yy = (1/4)/(3/4) = 1/3 → proporción <b>2:1</b> (el gen letal altera la segunda ley).</p><p>Esperados: ${N} × 2/3 = <b>${fmtNum(N * 2 / 3, 1)}</b> amarillos.</p>`;
      } else {
        fields = [
          { id: 'ratio', label: 'Proporción entre los nacidos: amarillo : no amarillo', kind: 'ratio', answer: [1, 1], display: '1:1' },
          probField('p', 'P(un descendiente nacido sea heterocigoto Yy)', frac(1, 2), { tol: 0.005 }),
          { id: 'n', label: `De ${N} descendientes nacidos, ¿cuántos amarillos se esperan?`, kind: 'num', answer: N / 2, display: fmtNum(N / 2, 1), tol: 0.6 }
        ];
        sol = SV.punnett(['Y', 'y'], ['y', 'y'], (a, b) => a + b) + `<p>Yy × yy no puede formar YY, así que no muere ningún descendiente: 1/2 Yy (amarillo) y 1/2 yy → <b>1:1</b>. Esperados: ${N}/2 = <b>${N / 2}</b>.</p>`;
      }
      return {
        statement: `<p>El alelo <b>Y</b> produce color amarillo y es dominante sobre <b>y</b>, pero es <b>letal en homocigosis</b>: los embriones YY mueren antes de nacer.</p><p>Se cruza <b>${cross.replace('×', ' × ')}</b>. Nacen ${N} descendientes.</p>`,
        figure: '', fields, solution: sol, convention: 'Las proporciones se calculan solo entre los nacidos. Tolerancia ±0,005 en probabilidades.'
      };
    }
  };

  // ===================================================================
  // 3. Probabilidad en familias / consejería genética (clases 9, 10, 11)
  // ===================================================================
  const PENS = [frac(1), frac(9, 10), frac(4, 5), frac(7, 10)];
  const familia = {
    id: 'familia', topic: 's11', title: 'Consejería genética: probabilidad de transmitir (AR, AD, mitocondrial)', short: 'Riesgo familiar',
    howto: {
      steps: [
        'Decide el modo de herencia (AR, AD o mitocondrial) y escribe los genotipos de los padres.',
        'AR: portador × portador → 1/4 afectado, 1/2 portador, 1/4 sano no portador. AD (heterocigoto × sano) → 1/2. Mitocondrial: madre afectada → transmite a todos sus hijos; padre afectado → no transmite.',
        'Si hay penetrancia incompleta: P(afectado) = P(genotipo) × penetrancia.',
        'Varios hijos son independientes: "todos" = producto; "al menos uno" = 1 − P(ninguno).',
        '"Exactamente k de n": C(n,k)·p^k·(1−p)^(n−k) (combina regla del producto y de la suma).',
        'Si ya sabes que la persona NO está afectada, elimina esa fila: en AR un hermano sano de un afectado es portador con probabilidad 2/3.'
      ],
      traps: [
        'Usar 1/2 en vez de 2/3 para "hermano sano portador": ya sabemos que no es aa.',
        'Creer que el riesgo "se gasta": cada embarazo es independiente (1/4 cada vez).',
        'En herencia mitocondrial, el padre afectado no transmite (las mitocondrias vienen del óvulo).',
        'Olvidar multiplicar por la penetrancia cuando el enunciado la da.'
      ]
    },
    gen(rng) {
      const v = rng.pick(['ARcc', 'ARcc', 'ARac', 'AD', 'AD', 'MT']);
      const n = rng.int(2, 4);
      let statement, fields, sol;
      if (v === 'ARcc') {
        const k = rng.int(1, Math.min(2, n));
        const pk = F.mul(frac(binom(n, k)), F.mul(F.pow(frac(1, 4), k), F.pow(frac(3, 4), n - k)));
        const pAtLeast = F.sub(frac(1), F.pow(frac(3, 4), n));
        const pool = [
          probField('a', 'P(que un hijo esté afectado)', frac(1, 4), { tol: 0.005 }),
          probField('b', 'P(que un hijo sano —no afectado— sea portador)', frac(2, 3), { tol: 0.005 }),
          probField('c', 'P(que un hijo sea portador sano), antes de nacer', frac(1, 2), { tol: 0.005 }),
          probField('d', `P(al menos un afectado entre ${n} hijos)`, pAtLeast, { tol: 0.005 }),
          probField('e', `P(exactamente ${k} afectado(s) entre ${n} hijos)`, pk, { tol: 0.005 })
        ];
        fields = rng.sample(pool, 3).sort((x, y) => (x.id < y.id ? -1 : 1));
        statement = `<p>La <b>anemia falciforme</b> es autosómica recesiva (gen <i>HBB</i>). Una pareja sana tiene un primer hijo con la enfermedad. Planean tener ${n} hijos más.</p>`;
        sol = `<p>Un hijo afectado (aa) con padres sanos → <b>ambos padres son portadores (Aa)</b>.</p>` + SV.punnett(['A', 'a'], ['A', 'a'], (a, b) => (a === 'A' || b === 'a' ? a + b : b + a)) +
          `<ul><li>P(afectado) = 1/4; P(portador) = 1/2; P(sano no portador) = 1/4.</li>` +
          `<li>Hijo <b>sano</b> portador: entre los no afectados (3/4), Aa es 2/4 → (1/2)/(3/4) = <b>2/3</b>.</li>` +
          `<li>Al menos 1 afectado en ${n}: 1 − (3/4)^${n} = ${fmtProb(pAtLeast)}.</li>` +
          `<li>Exactamente ${k} de ${n}: C(${n},${k}) × (1/4)^${k} × (3/4)^${n - k} = ${binom(n, k)} × ${F.str(F.pow(frac(1, 4), k))} × ${F.str(F.pow(frac(3, 4), n - k))} = ${fmtProb(pk)}.</li></ul>`;
      } else if (v === 'ARac') {
        fields = [
          probField('a', 'P(que un hijo esté afectado)', frac(1, 2), { tol: 0.005 }),
          probField('b', `P(que los ${n} hijos estén afectados)`, F.pow(frac(1, 2), n), { tol: 0.005 }),
          probField('c', 'P(que un hijo no afectado sea portador)', frac(1), { tol: 0.005 })
        ];
        statement = `<p>Una mujer con anemia falciforme (autosómica recesiva) tiene hijos con un hombre sano que es <b>portador</b> confirmado. Planean ${n} hijos.</p>`;
        sol = SV.punnett(['a', 'a'], ['A', 'a'], (a, b) => (b === 'A' ? b + a : a + b)) +
          `<p>aa × Aa → 1/2 Aa (portador sano) y 1/2 aa (afectado).</p><ul><li>P(afectado) = <b>1/2</b>.</li><li>Todos los ${n}: (1/2)^${n} = ${fmtProb(F.pow(frac(1, 2), n))}.</li><li>Todo hijo no afectado es Aa (recibe una "a" de la madre) → <b>1</b>.</li></ul>`;
      } else if (v === 'AD') {
        const pen = rng.pick(PENS);
        const pAff = F.mul(frac(1, 2), pen);
        const pNone = F.pow(F.sub(frac(1), pAff), n);
        const penTxt = pen.n === pen.d ? 'penetrancia completa' : `penetrancia de ${fmtNum(F.val(pen) * 100, 0)} %`;
        fields = [
          probField('a', 'P(que un hijo herede el alelo mutado)', frac(1, 2), { tol: 0.005 }),
          probField('b', 'P(que un hijo esté afectado)', pAff, { tol: 0.005 }),
          probField('c', `P(que ninguno de ${n} hijos esté afectado)`, pNone, { tol: 0.005 })
        ];
        statement = `<p>Un hombre heterocigoto para una enfermedad <b>autosómica dominante</b> (${penTxt}) tiene hijos con una mujer no portadora. Planean ${n} hijos.</p>`;
        sol = SV.punnett(['A', 'a'], ['a', 'a'], (a, b) => a + b) +
          `<p>Aa × aa → 1/2 Aa (heredan el alelo), 1/2 aa.</p><ul><li>P(heredar) = <b>1/2</b>.</li><li>P(afectado) = P(heredar) × penetrancia = 1/2 × ${F.str(pen)} = <b>${fmtProb(pAff)}</b>.</li>` +
          `<li>Ninguno afectado: (1 − ${F.str(pAff)})^${n} = ${fmtProb(pNone)}.</li></ul>`;
      } else {
        const who = rng.pick(['madre', 'padre']);
        const pChild = who === 'madre' ? frac(1) : frac(0);
        const pGrand = frac(0); // nieto vía un hijo varón
        fields = [
          probField('a', `P(que un hijo herede la mutación mitocondrial del ${who === 'madre' ? 'lado materno' : 'padre'})`, pChild, { tol: 0.005 }),
          probField('b', who === 'madre' ? 'P(que un nieto, hijo de un HIJO VARÓN de esta mujer, herede la mutación)' : 'P(que un nieto, hijo de una HIJA de este hombre, herede la mutación)', pGrand, { tol: 0.005 })
        ];
        statement = who === 'madre'
          ? `<p>Una mujer tiene una enfermedad por mutación del <b>ADN mitocondrial</b> (todas sus mitocondrias portan la mutación). Su pareja es sana.</p>`
          : `<p>Un hombre tiene una enfermedad por mutación del <b>ADN mitocondrial</b>. Su pareja es sana (sin la mutación).</p>`;
        sol = `<p>El ADN mitocondrial (~16 kb, 37 genes) se transmite <b>por vía materna</b>: las mitocondrias del embrión provienen del óvulo.</p><ul>` +
          (who === 'madre'
            ? '<li>Madre afectada → todos sus hijos (varones y mujeres) heredan la mutación: <b>1</b> (100 %).</li><li>Un hijo varón no transmite sus mitocondrias → sus hijos: <b>0</b>.</li>'
            : '<li>"Los padres afectados no transmiten trastornos mitocondriales a sus hijos" (clase 11): <b>0</b>.</li><li>Sus hijas no recibieron la mutación, así que tampoco la pasan: <b>0</b>.</li>') + '</ul>';
      }
      return { statement, figure: '', fields, solution: sol, convention: 'AD: el afectado es heterocigoto. Penetrancia completa salvo que se indique. Mitocondrial: se asume que la madre afectada transmite a toda su descendencia (como en la clase 11). Tolerancia ±0,005.' };
    }
  };

  // ===================================================================
  // 4. Pedigríes: modo de herencia y probabilidad (clases 10 y 11)
  // ===================================================================
  const MODE = {
    AD: { name: 'Autosómico dominante', accept: ['AD', 'autosomico dominante', 'dominante autosomico', 'herencia autosomica dominante', 'dominante'] },
    AR: { name: 'Autosómico recesivo', accept: ['AR', 'autosomico recesivo', 'recesivo autosomico', 'herencia autosomica recesiva', 'recesivo'] },
    MT: { name: 'Mitocondrial', accept: ['mitocondrial', 'herencia mitocondrial', 'materna', 'herencia materna', 'adn mitocondrial', 'mtdna', 'adnmt', 'mt'] }
  };
  function buildPedigree(rng, mode) {
    for (let tries = 0; tries < 400; tries++) {
      const nII = rng.pick([3, 4, 4]);
      const kidsA = rng.int(2, 3), kidsB = rng.int(2, 3);
      const P = {}; const order = [];
      const add = (id, o) => { P[id] = Object.assign({ id, aff: false }, o); order.push(id); };
      add('I1', { sex: 'M', gen: 1 }); add('I2', { sex: 'F', gen: 1 });
      const childIds = [];
      for (let i = 0; i < nII; i++) { const id = 'c' + i; add(id, { sex: rng.pick(['M', 'F']), gen: 2 }); childIds.push(id); }
      // cónyuges de c0 y c2
      add('s0', { sex: P.c0.sex === 'M' ? 'F' : 'M', gen: 2, spouse: true });
      add('s2', { sex: P.c2.sex === 'M' ? 'F' : 'M', gen: 2, spouse: true });
      const gA = [], gB = [];
      for (let i = 0; i < kidsA; i++) { const id = 'a' + i; add(id, { sex: rng.pick(['M', 'F']), gen: 3 }); gA.push(id); }
      for (let i = 0; i < kidsB; i++) { const id = 'b' + i; add(id, { sex: rng.pick(['M', 'F']), gen: 3 }); gB.push(id); }
      const setKids = (parent, kids, p) => kids.forEach((k) => { P[k].aff = rng.chance(p); });
      if (mode === 'AD') {
        const g = rng.pick(['I1', 'I2']); P[g].aff = true;
        childIds.forEach((c) => { P[c].aff = rng.chance(0.5); });
        P.c0.aff = true;
        setKids('c0', gA, 0.5); setKids('c2', gB, P.c2.aff ? 0.5 : 0);
        const affKidsA = gA.filter((k) => P[k].aff).length;
        if (affKidsA === 0 || affKidsA === gA.length) continue;
        if (childIds.every((c) => P[c].aff)) continue;
        // transmisión varón → varón
        const m2m = (P.I1.aff && childIds.some((c) => P[c].aff && P[c].sex === 'M')) ||
          (P.c0.sex === 'M' && gA.some((k) => P[k].aff && P[k].sex === 'M')) ||
          (P.c2.aff && P.c2.sex === 'M' && gB.some((k) => P[k].aff && P[k].sex === 'M'));
        if (!m2m) continue;
        if (!order.some((id) => P[id].aff && P[id].sex === 'F')) continue;
      } else if (mode === 'AR') {
        childIds.forEach((c) => { P[c].aff = rng.chance(0.3); });
        const aff = childIds.filter((c) => P[c].aff);
        if (aff.length < 1 || childIds.length - aff.length < 2) continue;
        if (!aff.some((c) => P[c].sex === 'F')) continue;
        if (P.c0.aff && P.c2.aff) continue;
      } else { // MT
        P.I2.aff = true;
        childIds.forEach((c) => { P[c].aff = true; });
        if (P.c0.sex !== 'M' || P.c2.sex !== 'F') continue;
        gB.forEach((k) => { P[k].aff = true; });
      }
      return { P, order, childIds, gA, gB };
    }
    return null;
  }
  function layoutPedigree(ped) {
    const { P, childIds, gA, gB } = ped;
    const W = 640, H = 330;
    P.I1.x = 285; P.I1.y = 50; P.I2.x = 365; P.I2.y = 50;
    const slots = [];
    childIds.forEach((c, i) => { slots.push(c); if (i === 0) slots.push('s0'); if (i === 2) slots.push('s2'); });
    const step = (W - 100) / (slots.length - 1);
    slots.forEach((id, i) => { P[id].x = 60 + i * step; P[id].y = 155; });
    const place = (kids, cx) => { const w = 62; kids.forEach((k, i) => { P[k].x = cx + (i - (kids.length - 1) / 2) * w; P[k].y = 260; }); };
    place(gA, (P.c0.x + P.s0.x) / 2);
    place(gB, (P.c2.x + P.s2.x) / 2);
    // separar si se superponen
    const lastA = Math.max.apply(null, gA.map((k) => P[k].x)), firstB = Math.min.apply(null, gB.map((k) => P[k].x));
    if (firstB - lastA < 55) { const d = (55 - (firstB - lastA)) / 2; gA.forEach((k) => { P[k].x -= d; }); gB.forEach((k) => { P[k].x += d; }); }
    // etiquetas romanas
    const lab = (ids, g) => ids.slice().sort((a, b) => P[a].x - P[b].x).forEach((id, i) => { P[id].label = g + '-' + (i + 1); });
    lab(['I1', 'I2'], 'I'); lab(slots, 'II'); lab(gA.concat(gB), 'III');
    const spec = {
      width: W, height: H,
      people: Object.values(P),
      couples: [{ a: 'I1', b: 'I2' }, P.c0.x < P.s0.x ? { a: 'c0', b: 's0' } : { a: 's0', b: 'c0' }, P.c2.x < P.s2.x ? { a: 'c2', b: 's2' } : { a: 's2', b: 'c2' }],
      sibships: [{ parents: ['I1', 'I2'], kids: childIds }, { parents: ['c0', 's0'], kids: gA }, { parents: ['c2', 's2'], kids: gB }],
      genLabels: [{ y: 50, text: 'I' }, { y: 155, text: 'II' }, { y: 260, text: 'III' }],
      label: 'Pedigrí familiar'
    };
    return spec;
  }
  const pedigri = {
    id: 'pedigri', topic: 's11', title: 'Pedigríes: identificar el modo de herencia', short: 'Pedigrí',
    howto: {
      steps: [
        'Busca hijos afectados de padres sanos: si existen, el rasgo es recesivo (AR) — los padres son portadores.',
        'Si cada afectado tiene al menos un progenitor afectado y aparece en todas las generaciones (no se salta generaciones), piensa en dominante (AD).',
        'Busca transmisión varón → hijo varón: la descarta como mitocondrial (el padre no transmite mitocondrias).',
        'Mitocondrial: madre afectada → todos sus hijos afectados; padre afectado → ningún hijo afectado.',
        'Compara la proporción de varones y mujeres afectados (~1:1 en AR y AD autosómicos).',
        'Con el modo decidido, calcula la probabilidad pedida (AR hermano sano: 2/3 portador; AD hijo de heterocigoto: 1/2; mitocondrial: 1 por la madre, 0 por el padre).'
      ],
      traps: [
        'Concluir AD solo porque hay muchos afectados: lo decisivo es si hay afectados con padres sanos.',
        'Olvidar que en AR los afectados suelen aparecer en una sola generación (hermanos).',
        'Confundir mitocondrial con AD cuando una madre afectada tiene todos los hijos afectados: mira qué pasa con los hijos de un varón afectado.'
      ]
    },
    gen(rng) {
      const mode = rng.pick(['AD', 'AR', 'MT']);
      const ped = buildPedigree(rng, mode);
      const spec = layoutPedigree(ped);
      const P = ped.P;
      let qLabel, qAns, qSol;
      if (mode === 'AR') {
        const unaff = ped.childIds.filter((c) => !P[c].aff);
        const t = rng.pick(unaff);
        qLabel = `P(que ${P[t].label}, no afectado/a, sea portador/a)`; qAns = frac(2, 3);
        qSol = `${P[t].label} es hijo/a de dos portadores y sabemos que no está afectado/a: (1/2)/(3/4) = <b>2/3</b>.`;
      } else if (mode === 'AD') {
        const t = 'c0';
        qLabel = `P(que el próximo hijo de ${P[t].label} (afectado/a) y su pareja sana esté afectado)`; qAns = frac(1, 2);
        qSol = `${P[t].label} es heterocigoto/a (Aa) y su pareja aa → 1/2 de cada hijo: <b>1/2</b>.`;
      } else {
        if (rng.chance(0.5)) { qLabel = `P(que el próximo hijo de ${P.c0.label} (varón afectado) esté afectado)`; qAns = frac(0); qSol = 'Un varón no transmite su ADN mitocondrial: <b>0</b>.'; }
        else { qLabel = `P(que el próximo hijo de ${P.c2.label} (mujer afectada) esté afectado)`; qAns = frac(1); qSol = 'La madre transmite sus mitocondrias a todos sus hijos: <b>1</b>.'; }
      }
      const aff = ped.order.filter((id) => P[id].aff);
      const evid = [];
      if (mode === 'AR') {
        const a = ped.childIds.filter((c) => P[c].aff).map((c) => P[c].label);
        evid.push(`${a.join(', ')} están afectados y sus padres (I-1, I-2) son sanos → el alelo es <b>recesivo</b>; los padres son portadores.`);
        evid.push('Hay mujeres y varones afectados y el rasgo no se ve en cada generación → <b>autosómico recesivo</b>.');
      } else if (mode === 'AD') {
        evid.push('Todos los afectados tienen un progenitor afectado y el rasgo aparece en las tres generaciones (no se salta).');
        evid.push('Hay transmisión de varón afectado a hijo varón → no es mitocondrial; varones y mujeres afectados por igual → <b>autosómico dominante</b>.');
        evid.push('Los cónyuges que entran a la familia son sanos y aproximadamente la mitad de los hijos de un afectado lo están.');
      } else {
        evid.push('La mujer afectada I-2 tiene <b>todos</b> sus hijos afectados; su hija afectada también transmite a todos sus hijos.');
        evid.push(`El varón afectado ${P.c0.label} no tiene ningún hijo afectado → los varones no transmiten → <b>mitocondrial</b> (vía materna).`);
      }
      void aff;
      const fields = [
        { id: 'modo', label: 'Modo de herencia más probable', kind: 'text', answer: MODE[mode].name, accept: MODE[mode].accept, display: MODE[mode].name, suggestions: ['Autosómico dominante', 'Autosómico recesivo', 'Mitocondrial'] },
        probField('p', qLabel, qAns, { tol: 0.005 })
      ];
      return {
        statement: '<p>Analiza el pedigrí (cuadrado = varón, círculo = mujer, relleno = afectado). Los individuos que se casan con la familia no tienen antecedentes. Se trata de una enfermedad rara.</p>',
        figure: SV.pedigree(spec), fields,
        solution: '<ol>' + evid.map((e) => `<li>${e}</li>`).join('') + `<li>${qSol}</li></ol>`,
        convention: 'Opciones: autosómico dominante, autosómico recesivo o mitocondrial (los modos de la clase 11). Afectados AD = heterocigotos; penetrancia completa.'
      };
    }
  };

  // ===================================================================
  // 5. Fenotipo metabolizador (CYP2D6, CYP3A5, CYP2C19) — clases 12 y 13
  // ===================================================================
  const PHEN = {
    PM: { name: 'Metabolizador lento (PM)', accept: ['PM', 'metabolizador lento', 'lento', 'metabolizador pobre', 'pobre', 'poor metabolizer', 'metabolizador lento pm', 'metabolizador pobre pm', 'lento pm'] },
    IM: { name: 'Metabolizador intermedio (IM)', accept: ['IM', 'metabolizador intermedio', 'intermedio', 'metabolizador intermedio im', 'intermedio im'] },
    NM: { name: 'Metabolizador normal (NM/EM)', accept: ['NM', 'EM', 'metabolizador normal', 'normal', 'metabolizador extenso', 'extenso', 'metabolizador rapido', 'metabolizador rapido o extenso', 'metabolizador normal nm', 'normal nm'] },
    UM: { name: 'Metabolizador ultrarrápido (UM)', accept: ['UM', 'metabolizador ultrarrapido', 'ultrarrapido', 'ultra rapido', 'metabolizador ultra rapido', 'metabolizador ultrarrapido um', 'ultrarrapido um'] }
  };
  const REC = { PM: 'Alternativa terapéutica', IM: 'Dosis reducida', NM: 'Dosis estándar', UM: 'Dosis incrementada' };
  const REC_OPTS = ['Alternativa terapéutica', 'Dosis reducida', 'Dosis estándar', 'Dosis incrementada'];
  const copies = (a) => (a === '*1xN' ? 2 : a === '*1' ? 1 : 0);
  const phenOf = (c) => (c === 0 ? 'PM' : c === 1 ? 'IM' : c === 2 ? 'NM' : 'UM');
  const NULLS = ['*3', '*4', '*5', '*6'];
  const EFFECT_OPTS = ['Menor conversión a metabolito activo: menor eficacia', 'Mayor conversión a metabolito activo: mayor eficacia', 'No cambia la respuesta', 'Menor eliminación del fármaco activo: toxicidad'];
  const metabolizador = {
    id: 'metabolizador', topic: 's13', title: 'Genotipo → fenotipo metabolizador → ajuste de dosis', short: 'Metabolizador CYP',
    howto: {
      steps: [
        'Clasifica cada alelo: *1 = funcional; *3, *4, *5 (deleción), *6 = nulos (sin actividad); *1xN = duplicación (cuenta 2 copias funcionales, como en la clase 13: *1/*1xN = 3 genes funcionales).',
        'Suma las copias funcionales: 0 → PM (lento), 1 → IM (intermedio), 2 → NM/EM (normal), ≥3 → UM (ultrarrápido).',
        'Recomendación (clase 13): PM → alternativa terapéutica; IM → dosis reducida; NM → dosis estándar; UM → dosis incrementada.',
        'CYP3A5 (tacrolimus): A/A = *1/*1 normal; A/G = *1/*3 intermedio; G/G = *3/*3 lento (SNP c.6986A>G).',
        'Profármacos (codeína y tamoxifeno por CYP2D6; clopidogrel por CYP2C19): el CYP los ACTIVA. Un PM/IM forma menos metabolito activo → menor eficacia (p. ej., trombosis del stent con clopidogrel).',
        'Para hijos: combina un alelo de cada progenitor (Punnett) y clasifica cada combinación por sus copias funcionales.'
      ],
      traps: [
        'Pensar que un PM siempre necesita "más" fármaco: con un fármaco activo, el PM lo elimina lento → se acumula → toxicidad; por eso dosis baja o alternativa.',
        'Con un profármaco ocurre lo contrario: el PM no lo activa → falla terapéutica.',
        'Contar *1xN como una sola copia.',
        'La clase 12 lista "bajas dosis" para el PM, la clase 13 "alternativa terapéutica": aquí se usa la de la clase 13.'
      ]
    },
    gen(rng) {
      const v = rng.pick(['2d6', '2d6', '3a5', 'hijos', 'prodroga']);
      if (v === '2d6') {
        const ph = rng.pick(['PM', 'IM', 'NM', 'UM']);
        let a1, a2;
        if (ph === 'PM') { a1 = rng.pick(NULLS); a2 = rng.pick(NULLS); }
        else if (ph === 'IM') { a1 = '*1'; a2 = rng.pick(NULLS); }
        else if (ph === 'NM') { a1 = '*1'; a2 = '*1'; }
        else { a1 = '*1'; a2 = '*1xN'; }
        if (rng.chance(0.5)) [a1, a2] = [a2, a1];
        const drug = rng.pick(['amitriptilina', 'imipramina', 'nortriptilina', 'venlafaxina', 'paroxetina', 'fluoxetina']);
        const c = copies(a1) + copies(a2);
        return {
          statement: `<p>Un paciente con depresión iniciará <b>${drug}</b> (metabolizada por CYP2D6, que la inactiva). Su genotipo CYP2D6 es <b>${a1}/${a2}</b>.</p>`,
          figure: '',
          fields: [
            { id: 'c', label: 'Número de copias funcionales del gen', kind: 'num', answer: c, display: String(c), tol: 0 },
            { id: 'f', label: 'Fenotipo metabolizador', kind: 'text', answer: PHEN[ph].name, accept: PHEN[ph].accept, display: PHEN[ph].name, suggestions: Object.values(PHEN).map((p) => p.name) },
            { id: 'r', label: 'Recomendación según la clase 13', kind: 'choice', options: REC_OPTS, answer: REC[ph], display: REC[ph] }
          ],
          solution: `<ol><li>${a1}: ${copies(a1) === 2 ? 'duplicación funcional (2 copias)' : copies(a1) === 1 ? 'funcional (1 copia)' : 'alelo nulo (0)'}; ${a2}: ${copies(a2) === 2 ? 'duplicación funcional (2 copias)' : copies(a2) === 1 ? 'funcional (1 copia)' : 'alelo nulo (0)'}.</li>` +
            `<li>Copias funcionales = ${copies(a1)} + ${copies(a2)} = <b>${c}</b> → <b>${PHEN[ph].name}</b>.</li>` +
            `<li>Recomendación: <b>${REC[ph]}</b>. ${ph === 'PM' ? 'Sin enzima activa el fármaco se acumula → riesgo de reacciones adversas.' : ph === 'IM' ? 'Menor actividad → con dosis estándar los niveles suben.' : ph === 'UM' ? 'Elimina muy rápido el fármaco → con dosis estándar sería "no efectivo".' : 'Rango terapéutico con dosis estándar.'}</li></ol>`,
          convention: 'Alelos funcionales: *1. Nulos: *3, *4, *5, *6. *1xN = 2 copias funcionales. 0 = PM, 1 = IM, 2 = NM, ≥3 = UM. Recomendación tomada de la clase 13.'
        };
      }
      if (v === '3a5') {
        const g = rng.pick(['A/A', 'A/G', 'G/G']);
        const star = { 'A/A': '*1/*1', 'A/G': '*1/*3', 'G/G': '*3/*3' }[g];
        const ph = { 'A/A': 'NM', 'A/G': 'IM', 'G/G': 'PM' }[g];
        return {
          statement: `<p>Un receptor de trasplante renal recibirá <b>tacrolimus</b>. La genotipificación del SNP <b>c.6986A&gt;G</b> de <i>CYP3A5</i> muestra <b>${g}</b>. (El alelo *3 lleva la G y produce una proteína truncada no funcional.)</p>`,
          figure: '',
          fields: [
            { id: 's', label: 'Genotipo en nomenclatura de alelos estrella (ej. *1/*3)', kind: 'geno', answer: star, display: star },
            { id: 'f', label: 'Fenotipo metabolizador', kind: 'text', answer: PHEN[ph].name, accept: PHEN[ph].accept, display: PHEN[ph].name, suggestions: Object.values(PHEN).map((p) => p.name) }
          ],
          solution: `<p>Clase 12: alelo *1 = proteína normal (A); alelo *3 = c.6986A&gt;G, proteína truncada (G).</p><ul><li>A/A = *1/*1 → metabolizador normal.</li><li>A/G = *1/*3 → intermedio.</li><li>G/G = *3/*3 → lento.</li></ul><p>${g} → <b>${star}</b> → <b>${PHEN[ph].name}</b>.</p>`,
          convention: 'Alelo A = *1 (funcional); G = *3 (no funcional).'
        };
      }
      if (v === 'hijos') {
        const pairs = [['*1', '*4'], ['*1', '*4'], ['*4', '*4'], ['*1', '*1xN'], ['*1', '*1'], ['*1', '*5'], ['*3', '*4']];
        let pa, pb;
        do { pa = rng.pick(pairs); pb = rng.pick(pairs); } while (pa.join() === '*1,*1' && pb.join() === '*1,*1');
        const cnt = { PM: 0, IM: 0, NM: 0, UM: 0 };
        const cells = [];
        pa.forEach((x) => pb.forEach((y) => { const ph = phenOf(copies(x) + copies(y)); cnt[ph]++; cells.push(ph); }));
        const phs = rng.sample(['PM', 'IM', 'NM', 'UM'], 2);
        const fields = phs.map((ph, i) => probField('p' + i, `P(hijo ${PHEN[ph].name})`, frac(cnt[ph], 4), { tol: 0.005 }));
        const tb = SV.punnett(pa, pb, (x, y) => `${x}/${y} (${phenOf(copies(x) + copies(y))})`);
        return {
          statement: `<p>Una pareja quiere saber cómo metabolizarán sus hijos los fármacos que dependen de CYP2D6. Madre: <b>${pa.join('/')}</b>. Padre: <b>${pb.join('/')}</b>.</p>`,
          figure: '', fields,
          solution: `<p>Cada hijo recibe un alelo de cada progenitor (segunda ley de Mendel):</p>${tb}<p>Recuento: PM ${cnt.PM}/4, IM ${cnt.IM}/4, NM ${cnt.NM}/4, UM ${cnt.UM}/4.</p><p>${phs.map((ph) => `P(${ph}) = <b>${fmtProb(frac(cnt[ph], 4))}</b>`).join('; ')}.</p>`,
          convention: 'Mismas reglas de copias funcionales (*1xN = 2). Una probabilidad puede ser 0.'
        };
      }
      // prodroga
      const drug = rng.pick([
        { d: 'codeína', g: 'CYP2D6', act: 'morfina (analgésico activo)', nulls: NULLS },
        { d: 'tamoxifeno', g: 'CYP2D6', act: 'endoxifeno (4-hidroxi-N-desmetiltamoxifeno)', nulls: NULLS },
        { d: 'clopidogrel', g: 'CYP2C19', act: 'su metabolito antiagregante activo', nulls: ['*2'] }
      ]);
      const ph = rng.pick(['PM', 'IM']);
      let a1, a2;
      if (ph === 'PM') { a1 = rng.pick(drug.nulls); a2 = rng.pick(drug.nulls); } else { a1 = '*1'; a2 = rng.pick(drug.nulls); }
      const consq = drug.d === 'codeína' ? 'la actividad analgésica se reduce o desaparece' : drug.d === 'tamoxifeno' ? 'se recomienda evitar tamoxifeno y considerar un inhibidor de aromatasa (y no usar inhibidores de CYP2D6 como paroxetina, fluoxetina o bupropión)' : 'no se activa de manera eficaz y aumenta el riesgo de trombosis tras implante de stent (portadores 2,6 % vs no portadores 0,8 %)';
      return {
        statement: `<p>La <b>${drug.d}</b> es un <b>profármaco</b>: ${drug.g} la convierte en ${drug.act}. Un paciente tiene genotipo <b>${drug.g} ${a1}/${a2}</b>${drug.g === 'CYP2C19' ? ' (*2 = alelo no funcional)' : ''}.</p>`,
        figure: '',
        fields: [
          { id: 'f', label: 'Fenotipo metabolizador', kind: 'text', answer: PHEN[ph].name, accept: PHEN[ph].accept, display: PHEN[ph].name, suggestions: Object.values(PHEN).map((p) => p.name) },
          { id: 'e', label: 'Efecto esperado sobre el tratamiento', kind: 'choice', options: EFFECT_OPTS, answer: EFFECT_OPTS[0], display: EFFECT_OPTS[0] }
        ],
        solution: `<ol><li>${a1}/${a2} → ${copies(a1) + copies(a2)} copia(s) funcional(es) → <b>${PHEN[ph].name}</b>.</li><li>Como es profármaco, menos actividad enzimática = <b>menos metabolito activo → menor eficacia</b>.</li><li>Clases 13: ${consq}.</li></ol>`,
        convention: 'Profármaco = necesita el CYP para activarse.'
      };
    }
  };

  // ===================================================================
  // 6. Frecuencia genotípica del reporte farmacogenético (p², 2pq, q²) — clase 13
  // ===================================================================
  const HWROWS = [
    { gene: 'CYP1A1', rs: 'rs1378942', poly: 'c.-66+2306C>A', risk: 'C', other: 'A', q: 0.39 },
    { gene: 'CYP1B1', rs: 'rs1056836', poly: 'c.1294C>G', risk: 'G', other: 'C', q: 0.49 },
    { gene: 'CYP2B6', rs: 'rs3745274', poly: 'c.516G>T', risk: 'T', other: 'G', q: 0.24 },
    { gene: 'COMT', rs: 'rs4680', poly: 'c.472G>A', risk: 'A', other: 'G', q: 0.50 },
    { gene: 'AGT', rs: 'rs699', poly: 'c.803T>C', risk: 'T', other: 'C', q: 0.30 },
    { gene: 'MTHFR', rs: 'rs1801133', poly: 'c.665C>T', risk: 'T', other: 'C', q: 0.25 },
    { gene: 'VKORC1', rs: 'rs9923231', poly: 'c.-1639G>A', risk: 'A', other: 'G', q: 0.39 },
    { gene: 'ADRA2A', rs: 'rs1800544', poly: 'c.-1252G>C', risk: 'G', other: 'C', q: 0.26 },
    { gene: 'ABCB1', rs: 'rs1045642', poly: 'c.3435T>C', risk: 'C', other: 'T', q: 0.48 },
    { gene: 'SLCO1B1', rs: 'rs4149056', poly: 'c.521T>C', risk: 'C', other: 'T', q: 0.16 },
    { gene: 'SLC6A2', rs: 'rs5569', poly: 'c.1287G>A', risk: 'A', other: 'G', q: 0.36 },
    { gene: 'FABP2', rs: 'rs1799883', poly: 'c.163G>A', risk: 'A', other: 'G', q: 0.33 },
    { gene: 'PTGS2', rs: 'rs5275', poly: 'c.*427T>C', risk: 'C', other: 'T', q: 0.40 }
  ];
  const hw = {
    id: 'hw', topic: 's13', title: 'Frecuencia del genotipo en el reporte (p², 2pq, q²)', short: 'Frecuencia genotípica',
    howto: {
      steps: [
        'En el reporte, la columna RISK da la frecuencia del alelo de riesgo (q). El otro alelo tiene p = 1 − q.',
        'Frecuencias esperadas de los genotipos: homocigoto de riesgo = q²; heterocigoto = 2pq; homocigoto del otro alelo = p². (Así se obtiene la columna FREQUENCY de los reportes de la clase 13: CYP1A1 0,39² = 15,21 %.)',
        'Expresa en % con 2 decimales.',
        'Número esperado en N personas = N × frecuencia.',
        'Si te dan la frecuencia del homocigoto de riesgo, q = √(q²) y luego p = 1 − q.'
      ],
      traps: [
        'Olvidar el 2 del heterocigoto (2pq, no pq).',
        'Elevar al cuadrado el alelo equivocado: el genotipo "CC" con riesgo C es q²; "AA" (el otro alelo) es p².',
        'Confundir frecuencia alélica (0,39) con frecuencia genotípica (15,21 %).'
      ]
    },
    gen(rng) {
      const v = rng.pick(['real', 'real', 'real', 'inv']);
      if (v === 'real') {
        const r = rng.pick(HWROWS);
        const q = r.q, p = +(1 - q).toFixed(2);
        const gt = rng.pick(['RR', 'RO', 'OO']);
        const label = gt === 'RR' ? r.risk + r.risk : gt === 'RO' ? r.risk + r.other : r.other + r.other;
        const f = gt === 'RR' ? q * q : gt === 'RO' ? 2 * p * q : p * p;
        const formula = gt === 'RR' ? `q² = ${fmtNum(q, 2)}²` : gt === 'RO' ? `2pq = 2 × ${fmtNum(p, 2)} × ${fmtNum(q, 2)}` : `p² = ${fmtNum(p, 2)}²`;
        const N = rng.pick([200, 300, 500, 1000]);
        return {
          statement: `<p>En un reporte farmacogenético (clase 13) aparece:</p><table class="report"><tr><th>Gen</th><th>dbSNP</th><th>RISK</th><th>Polimorfismo</th><th>RESULT</th></tr><tr><td>${r.gene}</td><td>${r.rs}</td><td>${fmtNum(q, 2)} (${r.risk})</td><td>${esc(r.poly)}</td><td>${label}</td></tr></table><p>Calcula la columna FREQUENCY para el resultado del paciente y el número esperado en una cohorte de ${N} personas.</p>`,
          figure: '',
          fields: [
            { id: 'p', label: `Frecuencia del alelo ${r.other} (p)`, kind: 'num', prob: true, answer: p, display: fmtNum(p, 2), tol: 0.0011 },
            { id: 'f', label: `Frecuencia esperada del genotipo ${label} (en %)`, kind: 'num', prob: true, answer: f, display: pctOf(f), tol: 0.0006 },
            { id: 'n', label: `Personas ${label} esperadas en ${N}`, kind: 'num', answer: N * f, display: fmtNum(N * f, 1), tol: 0.6 }
          ],
          solution: `<ol><li>Alelo de riesgo ${r.risk}: q = ${fmtNum(q, 2)} → alelo ${r.other}: p = 1 − ${fmtNum(q, 2)} = <b>${fmtNum(p, 2)}</b>.</li>` +
            `<li>${label} es ${gt === 'RR' ? 'homocigoto de riesgo' : gt === 'RO' ? 'heterocigoto' : 'homocigoto del alelo no de riesgo'}: ${formula} = ${fmtNum(f, 4)} = <b>${pctOf(f)}</b>.</li>` +
            `<li>Esperados: ${N} × ${fmtNum(f, 4)} = <b>${fmtNum(N * f, 1)}</b> personas.</li></ol>` +
            `<p class="muted">Las tres frecuencias suman 1: q² = ${pctOf(q * q)}, 2pq = ${pctOf(2 * p * q)}, p² = ${pctOf(p * p)}.</p>`,
          convention: 'Frecuencias genotípicas esperadas p², 2pq, q² (reproduce la columna FREQUENCY de la clase 13). % con 2 decimales; tolerancia ±0,06 puntos.'
        };
      }
      const q = rng.int(5, 60) / 100, p = +(1 - q).toFixed(2);
      const f = +(q * q).toFixed(4);
      return {
        statement: `<p>Para un SNP hipotético, el reporte indica que el <b>${fmtNum(f * 100, 2)} %</b> de la población es homocigota para el alelo de riesgo (T/T).</p>`,
        figure: '',
        fields: [
          { id: 'q', label: 'Frecuencia del alelo de riesgo T (q)', kind: 'num', prob: true, answer: q, display: fmtNum(q, 2), tol: 0.0011 },
          { id: 'het', label: 'Frecuencia esperada de heterocigotos (en %)', kind: 'num', prob: true, answer: 2 * p * q, display: pctOf(2 * p * q), tol: 0.0006 },
          { id: 'hom', label: 'Frecuencia esperada del homocigoto sin riesgo (en %)', kind: 'num', prob: true, answer: p * p, display: pctOf(p * p), tol: 0.0006 }
        ],
        solution: `<ol><li>q² = ${fmtNum(f, 4)} → q = √${fmtNum(f, 4)} = <b>${fmtNum(q, 2)}</b>; p = 1 − q = ${fmtNum(p, 2)}.</li><li>Heterocigotos: 2pq = 2 × ${fmtNum(p, 2)} × ${fmtNum(q, 2)} = <b>${pctOf(2 * p * q)}</b>.</li><li>Homocigoto sin riesgo: p² = ${fmtNum(p, 2)}² = <b>${pctOf(p * p)}</b>.</li></ol>`,
        convention: 'Mismo supuesto p², 2pq, q². q con 2 decimales.'
      };
    }
  };

  // ===================================================================
  // 7. Transcripción, traducción y tipos de mutación (clase 11)
  // ===================================================================
  const BASES = ['U', 'C', 'A', 'G'];
  const AAORDER = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const CODE = {};
  let ci = 0;
  BASES.forEach((a) => BASES.forEach((b) => BASES.forEach((c) => { const one = AAORDER[ci++]; CODE[a + b + c] = one === '*' ? 'STOP' : GU.AA1[one]; })));
  const GROUP = {};
  ['Gly', 'Ala', 'Val', 'Leu', 'Ile', 'Met', 'Phe', 'Trp', 'Pro'].forEach((a) => { GROUP[a] = 'no polar'; });
  ['Ser', 'Thr', 'Cys', 'Tyr', 'Asn', 'Gln'].forEach((a) => { GROUP[a] = 'polar sin carga'; });
  ['Asp', 'Glu'].forEach((a) => { GROUP[a] = 'ácido'; });
  ['Lys', 'Arg', 'His'].forEach((a) => { GROUP[a] = 'básico'; });
  const SENSE = Object.keys(CODE).filter((c) => CODE[c] !== 'STOP' && c !== 'AUG');
  const STOPS = ['UAA', 'UAG', 'UGA'];
  const toDNA = (r) => r.replace(/U/g, 'T');
  const comp = { A: 'T', T: 'A', G: 'C', C: 'G' };
  const translate = (rna) => {
    const out = [];
    for (let i = 0; i + 3 <= rna.length; i += 3) { const aa = CODE[rna.slice(i, i + 3)]; if (aa === 'STOP') break; out.push(aa); }
    return out;
  };
  const MUT_OPTS = ['Silenciosa (sinónima)', 'Missense (cambio de sentido)', 'Nonsense (sin sentido)', 'Corrimiento del marco (frameshift)', 'Deleción/inserción en marco (in-frame)'];
  const spaced = (s) => s.match(/.{1,3}/g).join(' ');
  const mutacion = {
    id: 'mutacion', topic: 's11', title: 'Transcripción, traducción y tipo de mutación', short: 'Codones y mutaciones',
    howto: {
      steps: [
        'Si te dan la hebra codificante (5′→3′), el ARNm es la misma secuencia cambiando T por U. Si te dan la hebra molde (3′→5′), el ARNm es su complementaria (A→U, T→A, G→C, C→G).',
        'Divide el ARNm en codones desde el AUG (inicio, Met).',
        'Traduce con la tabla del código genético hasta el primer codón stop (UAA, UAG, UGA), que no se incluye en la proteína.',
        'Compara la proteína original con la mutada: igual aminoácido → silenciosa (sinónima); otro aminoácido → missense; aparece un stop → nonsense.',
        'Si se insertan o eliminan 1 o 2 nucleótidos → corrimiento del marco (frameshift, cambia todo lo que sigue); si son 3 (un codón) → in-frame.',
        'Missense conservadora: el aminoácido nuevo es del mismo grupo químico (p. ej., Lys → Arg, ambos básicos); no conservadora: de otro grupo (Lys → Thr).'
      ],
      traps: [
        'Usar T en el ARNm (debe ser U).',
        'Leer la hebra molde como si fuera la codificante.',
        'Incluir el codón stop como aminoácido.',
        'Llamar "missense" a una deleción de 1 nt: cambia el marco de lectura.',
        'La clase 11 clasifica missense, nonsense, splicing y regulatorias como cambios de un par de bases; frameshift e in-frame como deleciones/inserciones.'
      ]
    },
    gen(rng) {
      for (let tries = 0; tries < 300; tries++) {
        const k = rng.int(4, 5);
        const cods = ['AUG'];
        for (let i = 0; i < k; i++) cods.push(rng.pick(SENSE));
        cods.push(rng.pick(STOPS));
        const rna = cods.join('');
        const type = rng.pick(['silent', 'missense', 'missense', 'nonsense', 'frameshift', 'inframe']);
        let mrna = null, detail = '';
        if (['silent', 'missense', 'nonsense'].includes(type)) {
          const opts = [];
          for (let ci2 = 1; ci2 <= k; ci2++) for (let pos = 0; pos < 3; pos++) for (const b of BASES) {
            const old = cods[ci2];
            if (old[pos] === b) continue;
            const nc = old.slice(0, pos) + b + old.slice(pos + 1);
            const a0 = CODE[old], a1 = CODE[nc];
            const t = a1 === 'STOP' ? 'nonsense' : a1 === a0 ? 'silent' : 'missense';
            if (t === type) opts.push({ ci2, pos, b, nc, a0, a1 });
          }
          if (!opts.length) continue;
          const o = rng.pick(opts);
          const nc = cods.slice(); nc[o.ci2] = o.nc;
          mrna = nc.join('');
          detail = { codon: o.ci2 + 1, old: cods[o.ci2], neu: o.nc, a0: o.a0, a1: o.a1, pos: o.ci2 * 3 + o.pos + 1 };
        } else if (type === 'frameshift') {
          const pos = rng.int(4, k * 3 + 2); // dentro de la región codificante, después del AUG
          if (rng.chance(0.5)) { mrna = rna.slice(0, pos - 1) + rna.slice(pos); detail = { kind: 'deleción', n: 1, pos }; }
          else { const b = rng.pick(BASES); mrna = rna.slice(0, pos) + b + rna.slice(pos); detail = { kind: 'inserción', n: 1, pos, b }; }
        } else {
          const c = rng.int(1, k);
          if (rng.chance(0.6)) { mrna = cods.filter((_, i) => i !== c).join(''); detail = { kind: 'deleción', n: 3, codon: c + 1 }; }
          else { const extra = rng.pick(SENSE); const nc = cods.slice(); nc.splice(c, 0, extra); mrna = nc.join(''); detail = { kind: 'inserción', n: 3, codon: c + 1, extra }; }
        }
        const prot0 = translate(rna), prot1 = translate(mrna);
        if (type === 'frameshift' && prot1.join() === prot0.join()) continue;
        const ansType = { silent: MUT_OPTS[0], missense: MUT_OPTS[1], nonsense: MUT_OPTS[2], frameshift: MUT_OPTS[3], inframe: MUT_OPTS[4] }[type];
        const template = rng.chance(0.35);
        const showSeq = (r) => template ? toDNA(r).split('').map((x) => comp[x]).join('') : toDNA(r);
        const fields = [
          { id: 'm', label: 'ARNm original (5′→3′)', kind: 'seq', answer: rna, display: spaced(rna) },
          { id: 'p0', label: 'Proteína original (ej. Met-Lys-Arg)', kind: 'protein', answer: prot0.join('-'), display: prot0.join('-') },
          { id: 'p1', label: 'Proteína mutada', kind: 'protein', answer: prot1.join('-'), display: prot1.join('-') },
          { id: 't', label: 'Tipo de mutación', kind: 'choice', options: MUT_OPTS, answer: ansType, display: ansType }
        ];
        let consSol = '';
        if (type === 'missense') {
          const cons = GROUP[detail.a0] === GROUP[detail.a1];
          fields.push({ id: 'c', label: `¿La sustitución ${detail.a0} → ${detail.a1} es conservadora?`, kind: 'choice', options: ['Sí, conservadora', 'No, no conservadora'], answer: cons ? 'Sí, conservadora' : 'No, no conservadora', display: cons ? 'Sí, conservadora' : 'No, no conservadora' });
          consSol = `<li>${detail.a0} es ${GROUP[detail.a0]} y ${detail.a1} es ${GROUP[detail.a1]} → <b>${cons ? 'conservadora' : 'no conservadora'}</b>.</li>`;
        }
        const mutDesc = ['silent', 'missense', 'nonsense'].includes(type)
          ? `sustitución en el codón ${detail.codon}: ${toDNA(detail.old)} → ${toDNA(detail.neu)}`
          : detail.n === 1 ? `${detail.kind} de 1 nucleótido` : `${detail.kind} de 3 nucleótidos (un codón)`;
        const strandTxt = template
          ? '<b>hebra molde</b> (escrita 3′→5′, de izquierda a derecha)'
          : '<b>hebra codificante</b> (5′→3′; igual al ARNm con T en lugar de U)';
        const sol = `<ol>` +
          (template ? `<li>La hebra molde es complementaria al ARNm: ${spaced(showSeq(rna))} → ARNm 5′-<b>${spaced(rna)}</b>-3′.</li>` : `<li>ARNm = hebra codificante con U: <b>${spaced(rna)}</b>.</li>`) +
          `<li>Codones: ${spaced(rna).split(' ').map((c) => `${c}(${CODE[c] === 'STOP' ? 'stop' : CODE[c]})`).join(' ')} → proteína <b>${prot0.join('-')}</b>.</li>` +
          `<li>ARNm mutado: ${spaced(mrna)} → proteína <b>${prot1.join('-') || '(ninguna)'}</b>.</li>` +
          `<li>Cambio: ${mutDesc} → <b>${ansType}</b>.${type === 'frameshift' ? ' Cambia el marco de lectura desde ese punto.' : type === 'nonsense' ? ' Terminación prematura de la traducción (clase 11: afecta la estabilidad/traducción del ARNm).' : type === 'silent' ? ' El código genético es redundante.' : ''}</li>` +
          consSol + `</ol>`;
        return {
          statement: `<p>Se muestra la ${strandTxt} de un gen corto, original y con una mutación:</p>` +
            `<p class="mono">Original: ${template ? "3′-" : "5′-"}${spaced(showSeq(rna))}${template ? "-5′" : "-3′"}<br>Mutada:&nbsp;&nbsp; ${template ? "3′-" : "5′-"}${spaced(showSeq(mrna))}${template ? "-5′" : "-3′"}</p>` +
            `<p>Usa la tabla del código genético. Traduce desde AUG hasta el primer codón stop (sin incluirlo) o hasta el último codón completo.</p>`,
          figure: '', fields, solution: sol,
          convention: 'Proteína en código de 3 letras separada por guiones (también se acepta 1 letra). Grupos: no polares (Gly, Ala, Val, Leu, Ile, Met, Phe, Trp, Pro); polares sin carga (Ser, Thr, Cys, Tyr, Asn, Gln); ácidos (Asp, Glu); básicos (Lys, Arg, His).'
        };
      }
      throw new Error('mutacion: no se pudo generar');
    }
  };

  // ===================================================================
  // 8. Análisis de ligamiento con marcadores (clase 11)
  // ===================================================================
  const ligamiento = {
    id: 'ligamiento', topic: 's11', title: 'Análisis de ligamiento con haplotipos de marcadores', short: 'Ligamiento',
    howto: {
      steps: [
        'Cada caja es un haplotipo (alelos de los marcadores A y B en el mismo cromosoma). En los hijos, la caja izquierda vino del padre y la derecha de la madre.',
        'Identifica qué haplotipo paterno y cuál materno recibió cada hijo afectado.',
        'Ligamiento con una enfermedad AR: los hermanos afectados deben haber recibido el MISMO haplotipo paterno y el MISMO materno (comparten 2 haplotipos), porque ambos recibieron las dos copias mutadas.',
        'Un hermano sano no debería tener esa misma combinación de haplotipos (con penetrancia completa).',
        'Si comparten 0 o 1 haplotipo parental, la región de los marcadores es inconsistente con ligamiento AR.'
      ],
      traps: [
        'Comparar alelos sueltos en vez de haplotipos completos.',
        'Olvidar revisar al hermano no afectado.',
        'Confundir "consistente con ligamiento" con "demostrado": el análisis de ligamiento se basa en la familia y se refina con más pacientes/marcadores (mapeo fino).'
      ]
    },
    gen(rng) {
      for (let tries = 0; tries < 200; tries++) {
        const H = [];
        while (H.length < 4) {
          const h = [rng.int(1, 6), rng.int(1, 6)];
          if (H.some((x) => x[0] === h[0] && x[1] === h[1])) continue;
          H.push(h);
        }
        const [P1, P2, M1, M2] = H;
        if (P1[0] === P2[0] && P1[1] === P2[1]) continue;
        const ps = [P1, P2], ms = [M1, M2];
        const scenario = rng.pick(['cons', 'cons', 'inc1', 'inc2', 'unaff']);
        const i = rng.int(0, 1), j = rng.int(0, 1);
        const k1 = [ps[i], ms[j]];
        let k2, share;
        if (scenario === 'cons' || scenario === 'unaff') { k2 = [ps[i], ms[j]]; share = 2; }
        else if (scenario === 'inc1') { if (rng.chance(0.5)) k2 = [ps[1 - i], ms[j]]; else k2 = [ps[i], ms[1 - j]]; share = 1; }
        else { k2 = [ps[1 - i], ms[1 - j]]; share = 0; }
        const kids = [
          { sex: rng.pick(['M', 'F']), aff: true, h: k1, label: 'II-1' },
          { sex: rng.pick(['M', 'F']), aff: true, h: k2, label: 'II-2' }
        ];
        let consistent = share === 2;
        if (scenario === 'unaff') { kids.push({ sex: rng.pick(['M', 'F']), aff: false, h: [ps[i], ms[j]], label: 'II-3' }); consistent = false; }
        else if (rng.chance(0.5)) { kids.push({ sex: rng.pick(['M', 'F']), aff: false, h: [ps[1 - i], ms[rng.int(0, 1)]], label: 'II-3' }); }
        const hs = (h) => h[0] + '-' + h[1];
        const fields = [
          { id: 's', label: 'Número de haplotipos parentales que comparten los dos hermanos afectados (0, 1 o 2)', kind: 'num', answer: share, display: String(share), tol: 0 },
          { id: 'c', label: '¿La región es consistente con ligamiento a una enfermedad AR?', kind: 'choice', options: ['Sí, consistente', 'No, inconsistente'], answer: consistent ? 'Sí, consistente' : 'No, inconsistente', display: consistent ? 'Sí, consistente' : 'No, inconsistente' }
        ];
        if (consistent) fields.push({ id: 'h', label: 'Haplotipo paterno que segrega con la enfermedad (A-B, ej. 3-1)', kind: 'text', answer: hs(ps[i]), accept: [ps[i].join(' '), ps[i].join('')], display: hs(ps[i]) });
        let sol = `<ol><li>Padre: ${hs(P1)} y ${hs(P2)}; madre: ${hs(M1)} y ${hs(M2)}.</li>` +
          `<li>II-1 recibió ${hs(k1[0])} (paterno) y ${hs(k1[1])} (materno); II-2 recibió ${hs(k2[0])} y ${hs(k2[1])}.</li>` +
          `<li>Comparten <b>${share}</b> haplotipo(s) parental(es).</li>`;
        if (scenario === 'unaff') sol += `<li>Pero el hermano <b>sano</b> II-3 tiene la misma combinación (${hs(ps[i])} + ${hs(ms[j])}) que los afectados: si el gen estuviera aquí, también estaría afectado → <b>inconsistente</b>.</li>`;
        else if (consistent) sol += `<li>En una enfermedad AR ambos afectados heredaron las dos copias mutadas: comparten el haplotipo paterno ${hs(ps[i])} y el materno ${hs(ms[j])} → <b>consistente</b> con ligamiento.${kids.length === 3 ? ' El hermano sano tiene otra combinación, lo cual también es consistente.' : ''}</li>`;
        else sol += `<li>Para AR deberían compartir ambos haplotipos; comparten ${share} → <b>inconsistente</b> con ligamiento en esta región.</li>`;
        sol += '</ol>';
        return {
          statement: '<p>En una familia con una enfermedad autosómica recesiva se genotipificaron dos marcadores cercanos (A arriba, B abajo). En los hijos, la caja izquierda es el haplotipo heredado del padre y la derecha el heredado de la madre.</p>',
          figure: SV.haplotypes({ father: { aff: false, h: [P1, P2] }, mother: { aff: false, h: [M1, M2] }, kids }),
          fields, solution: sol,
          convention: 'Fase conocida (haplotipos en cajas). Penetrancia completa. Sin recombinación entre los marcadores.'
        };
      }
      throw new Error('ligamiento');
    }
  };

  // ===================================================================
  // 9. Metilación del ADN y riesgo (clase 14)
  // ===================================================================
  const metilacion = {
    id: 'metilacion', topic: 's14', title: 'Metilación del promotor: interpretar el riesgo', short: 'Metilación',
    howto: {
      steps: [
        'Calcula el promedio de metilación de los sitios CpG de cada paciente (suma ÷ número de sitios).',
        'Hipermetilación del promotor → silenciamiento génico. Hipometilación → activación (expresión).',
        'Gen supresor de tumores (p. ej., BRCA1): si se silencia por hipermetilación se pierde la protección → mayor riesgo.',
        'Oncogén: la hipometilación aumenta su expresión → progresión tumoral → mayor riesgo.',
        'Concluye quién tiene mayor riesgo y qué le pasa a la expresión del gen.'
      ],
      traps: [
        'Pensar que "más metilación = siempre más riesgo": depende de si el gen es supresor u oncogén.',
        'Confundir metilación (epigenética, reversible) con mutación (cambia la secuencia).',
        'Promediar incluyendo sitios inventados: usa solo los sitios mostrados.'
      ]
    },
    gen(rng) {
      const type = rng.pick(['sup', 'sup', 'onc']);
      const gene = type === 'sup' ? 'BRCA1' : rng.pick(['un oncogén (gen X)', 'un oncogén (gen Y)']);
      const geneShort = type === 'sup' ? 'BRCA1' : 'el oncogén';
      const hi = () => Array.from({ length: 6 }, () => (rng.chance(0.15) ? 0 : rng.int(30, 55)));
      const lo = () => Array.from({ length: 6 }, () => (rng.chance(0.7) ? 0 : rng.int(1, 8)));
      let p1, p2;
      do { p1 = hi(); } while (p1.filter((x) => x > 0).length < 4);
      p2 = lo();
      const swap = rng.chance(0.5);
      if (swap) [p1, p2] = [p2, p1];
      const m1 = p1.reduce((a, b) => a + b, 0) / 6, m2 = p2.reduce((a, b) => a + b, 0) / 6;
      const hiPat = m1 > m2 ? 1 : 2;
      const riskPat = type === 'sup' ? hiPat : 3 - hiPat;
      const effect = type === 'sup' ? 'Silenciamiento génico' : 'Activación génica (mayor expresión)';
      return {
        statement: `<p>Se midió la metilación de 6 sitios CpG del promotor de <b>${esc(gene)}</b>${type === 'sup' ? ' (gen supresor de tumores)' : ''} en ADN de sangre de dos pacientes (como en el ejercicio práctico de la clase 14).</p>`,
        figure: SV.methylation(p1, p2, type === 'sup' ? 'BRCA1' : 'un oncogén'),
        fields: [
          { id: 'm1', label: 'Metilación promedio del paciente 1 (%)', kind: 'num', answer: m1, display: fmtNum(m1, 1) + ' %', tol: 0.06, pctUnits: true },
          { id: 'm2', label: 'Metilación promedio del paciente 2 (%)', kind: 'num', answer: m2, display: fmtNum(m2, 1) + ' %', tol: 0.06, pctUnits: true },
          { id: 'r', label: '¿Qué paciente tiene mayor riesgo?', kind: 'choice', options: ['Paciente 1', 'Paciente 2'], answer: 'Paciente ' + riskPat, display: 'Paciente ' + riskPat },
          { id: 'e', label: `Efecto sobre ${geneShort} en el paciente de mayor riesgo`, kind: 'choice', options: ['Silenciamiento génico', 'Activación génica (mayor expresión)'], answer: effect, display: effect }
        ],
        solution: `<ol><li>Paciente 1: (${p1.join(' + ')}) / 6 = <b>${fmtNum(m1, 1)} %</b>. Paciente 2: (${p2.join(' + ')}) / 6 = <b>${fmtNum(m2, 1)} %</b>.</li>` +
          `<li>El paciente ${hiPat} tiene el promotor <b>hipermetilado</b>; el otro, hipometilado.</li>` +
          (type === 'sup'
            ? `<li>Hipermetilación → silenciamiento de BRCA1 (supresor) → se pierde la inhibición de la progresión tumoral → <b>paciente ${riskPat}</b> tiene mayor riesgo (o podría tener ya cáncer de mama).</li>`
            : `<li>En un oncogén, la <b>hipometilación</b> → expresión del oncogén → progresión tumoral → <b>paciente ${riskPat}</b> tiene mayor riesgo.</li>`) + '</ol>',
        convention: 'Promedio aritmético de los 6 sitios, en % con 1 decimal (tolerancia ±0,06).'
      };
    }
  };

  // ===================================================================
  // 10. Nomenclatura CYP y variantes del reporte (clases 12 y 13)
  // ===================================================================
  const NOMROWS = [
    ['CYP2C9', 'rs1799853', 'c.430C>T', '*2A'], ['CYP2C9', 'rs1057910', 'c.1075A>C', '*3A'],
    ['CYP2C19', 'rs4244285', 'c.681G>A', '*2A'], ['CYP2C19', 'rs12248560', 'g.-806C>T', '*17'],
    ['CYP2D6', 'rs3892097', 'g.1846G>A', '*4A'], ['CYP2D6', 'rs28371725', 'g.2988G>A', '*41'],
    ['CYP3A5', 'rs776746', 'g.6986A>G', '*3A'], ['CYP3A4', 'rs35599367', 'g.20493C>T', '*22'],
    ['CYP2B6', 'rs3745274', 'c.516G>T', '*6'], ['CYP1A2', 'rs762551', 'g.-163C>A', '*1F'],
    ['CYP2E1', 'rs6413420', 'g.-71G>T', '*7'], ['CYP2E1', 'rs3813867', 'g.-1293G>C', '*5'],
    ['CYP1A2', 'rs2069514', 'g.-3860G>A', '*1C']
  ];
  const nomenclatura = {
    id: 'nomenclatura', topic: 's12', title: 'Nomenclatura CYP y lectura de variantes del reporte', short: 'Nomenclatura CYP',
    howto: {
      steps: [
        'Separa el nombre: CYP (raíz) + número (familia, homología de aminoácidos > 40 %) + letra (subfamilia, > 55 %) + número (enzima individual).',
        'Lo que va después del asterisco es el alelo (*1 = alelo normal o de referencia).',
        'En la variante "c.430C>T": el número es la posición, la primera letra es la base de referencia y la segunda la base variante (C cambia a T). "c." = posición en la secuencia codificante; "g." = en la secuencia genómica.',
        'El "rs…" es el identificador del SNP en la base de datos dbSNP.'
      ],
      traps: [
        'Leer "2C19" como familia 2, subfamilia C, enzima 1 y 9: la enzima es la 19.',
        'Invertir referencia y variante en "C>T".',
        'Confundir el alelo (*2A) con la enzima.'
      ]
    },
    gen(rng) {
      const [gene, rs, poly, star] = rng.pick(NOMROWS);
      const m = gene.match(/^CYP(\d+)([A-Z])(\d+)$/);
      const pm = poly.match(/([ACGT])>([ACGT])$/);
      const fam = +m[1], sub = m[2], enz = +m[3];
      return {
        statement: `<p>Una fila de un reporte farmacogenético indica: <b>${gene}</b> · ${rs} · <b>${esc(poly)}</b> · alelo <b>${star}</b>. Descompón la información.</p>`,
        figure: '',
        fields: [
          { id: 'f', label: 'Familia (número)', kind: 'num', answer: fam, display: String(fam), tol: 0 },
          { id: 's', label: 'Subfamilia (letra)', kind: 'text', answer: sub, display: sub },
          { id: 'e', label: 'Enzima individual (número)', kind: 'num', answer: enz, display: String(enz), tol: 0 },
          { id: 'a', label: 'Alelo (con asterisco)', kind: 'text', answer: star, accept: [star.replace('*', '')], display: star },
          { id: 'r', label: 'Base de referencia', kind: 'text', answer: pm[1], display: pm[1] },
          { id: 'v', label: 'Base variante', kind: 'text', answer: pm[2], display: pm[2] }
        ],
        solution: `<p>${gene} = CYP + <b>${fam}</b> (familia) + <b>${sub}</b> (subfamilia) + <b>${enz}</b> (enzima individual). Alelo <b>${star}</b>.</p><p>${esc(poly)}: en la posición ${esc(poly.slice(2, poly.length - 3))} de la secuencia ${poly[0] === 'c' ? 'codificante (c.)' : 'genómica (g.)'}, la base de referencia <b>${pm[1]}</b> cambia a <b>${pm[2]}</b>. ${rs} es su identificador en dbSNP.</p>`,
        convention: 'Nomenclatura estándar de 1987 (clase 12).'
      };
    }
  };

  // ===================================================================
  // 11. Comparar riesgos de estudios ("veces más") — clases 9, 12, 13
  // ===================================================================
  const RISKDATA = [
    { ctx: 'trombosis del stent en pacientes con clopidogrel', a: 'portadores de alelo CYP2C19 de función reducida', b: 'no portadores', pa: 2.6, pb: 0.8, p: 0.02, src: 'clase 13' },
    { ctx: 'discontinuación de tenofovir a 360 días', a: 'pacientes con riesgo genético', b: 'pacientes sin riesgo genético', pa: 28.6, pb: 13.6, p: 0.286, src: 'clase 12' },
    { ctx: 'discontinuación de efavirenz a 360 días', a: 'pacientes con riesgo genético', b: 'pacientes sin riesgo genético', pa: 71.2, pb: 28.1, p: 0.004, src: 'clase 12' },
    { ctx: 'discontinuación de lopinavir/r a 360 días', a: 'pacientes con riesgo genético', b: 'pacientes sin riesgo genético', pa: 46.5, pb: 33.1, p: 0.587, src: 'clase 12' },
    { ctx: 'discontinuación de atazanavir/r a 360 días', a: 'pacientes con riesgo genético', b: 'pacientes sin riesgo genético', pa: 62.5, pb: 18.9, p: 0.000006, src: 'clase 12' }
  ];
  const riesgo = {
    id: 'riesgo', topic: 's12', title: 'Leer resultados de estudios: cuántas veces más riesgo', short: 'Comparar riesgos',
    howto: {
      steps: [
        '"Cuántas veces más" = proporción del grupo expuesto ÷ proporción del grupo de referencia (ej. 2,6 % ÷ 0,8 % = 3,25 veces).',
        'Diferencia absoluta = resta de porcentajes, en puntos porcentuales (2,6 − 0,8 = 1,8 puntos).',
        'Significancia: con α = 0,05, si p < 0,05 la diferencia es estadísticamente significativa; si p ≥ 0,05 no lo es (aunque los porcentajes se vean distintos).',
        'Redacta: "el grupo X tiene N veces más riesgo de … (p = …)".'
      ],
      traps: [
        'Dividir al revés (referencia ÷ expuesto).',
        'Decir "1,8 % más" cuando son 1,8 puntos porcentuales (en relativo es 225 % más).',
        'Concluir que hay efecto con p = 0,587 (lopinavir/r): no es significativo.'
      ]
    },
    gen(rng) {
      let d;
      if (rng.chance(0.65)) d = rng.pick(RISKDATA);
      else {
        const pb = rng.int(5, 40) / 2, mult = rng.pick([1.5, 2, 2.5, 3, 4]);
        d = { ctx: 'reacciones adversas a un fármaco', a: 'portadores de una variante', b: 'no portadores', pa: Math.min(95, +(pb * mult).toFixed(1)), pb, p: rng.pick([0.001, 0.01, 0.03, 0.049, 0.06, 0.12, 0.4]), src: 'hipotético' };
      }
      const ratio = d.pa / d.pb, diff = d.pa - d.pb;
      const sig = d.p < 0.05;
      const pTxt = d.p < 0.001 ? d.p.toExponential(1).replace('.', ',') : fmtNum(d.p, 3);
      return {
        statement: `<p>Estudio (${d.src}): la frecuencia de ${esc(d.ctx)} fue <b>${fmtNum(d.pa, 1)} %</b> en ${esc(d.a)} y <b>${fmtNum(d.pb, 1)} %</b> en ${esc(d.b)} (p = ${pTxt}).</p>`,
        figure: '',
        fields: [
          { id: 'r', label: `¿Cuántas veces más frecuente es en ${d.a}? (2 decimales)`, kind: 'num', answer: ratio, display: fmtNum(ratio, 2), tol: 0.006 },
          { id: 'd', label: 'Diferencia absoluta (puntos porcentuales)', kind: 'num', answer: diff, display: fmtNum(diff, 1), tol: 0.06, pctUnits: true },
          { id: 's', label: '¿Es estadísticamente significativa (α = 0,05)?', kind: 'choice', options: ['Sí', 'No'], answer: sig ? 'Sí' : 'No', display: sig ? 'Sí' : 'No' }
        ],
        solution: `<ol><li>Veces: ${fmtNum(d.pa, 1)} ÷ ${fmtNum(d.pb, 1)} = <b>${fmtNum(ratio, 2)}</b>.</li><li>Diferencia: ${fmtNum(d.pa, 1)} − ${fmtNum(d.pb, 1)} = <b>${fmtNum(diff, 1)} puntos porcentuales</b>.</li><li>p = ${pTxt} ${sig ? '&lt;' : '≥'} 0,05 → <b>${sig ? 'significativa' : 'no significativa'}</b>.</li></ol>`,
        convention: 'Nivel de significancia α = 0,05. Razón con 2 decimales (±0,006).'
      };
    }
  };

  const GENERATORS = [mendel, complejo, familia, pedigri, mutacion, ligamiento, nomenclatura, riesgo, metabolizador, hw, metilacion];
  const api = { GENERATORS, byId: Object.fromEntries(GENERATORS.map((g) => [g.id, g])), CODE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GEN = api;
})(typeof window !== 'undefined' ? window : globalThis);
