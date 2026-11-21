/* util.js — RNG con semilla, fracciones y autograder.
   Funciona en navegador (window.GU) y en Node (module.exports). */
(function (root) {
  'use strict';

  // ---------- RNG (mulberry32) ----------
  function makeRng(seed) {
    let a = (seed >>> 0) || 1;
    const rnd = function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    rnd.int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
    rnd.pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    rnd.chance = (p) => rnd() < p;
    rnd.shuffle = (arr) => {
      const a2 = arr.slice();
      for (let i = a2.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [a2[i], a2[j]] = [a2[j], a2[i]];
      }
      return a2;
    };
    rnd.sample = (arr, k) => rnd.shuffle(arr).slice(0, k);
    return rnd;
  }
  function newSeed() { return (Math.floor(Math.random() * 2147483646) + 1); }

  // ---------- Fracciones ----------
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
  function frac(n, d) {
    if (d === undefined) d = 1;
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
  }
  const F = {
    mul: (a, b) => frac(a.n * b.n, a.d * b.d),
    add: (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d),
    sub: (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d),
    pow: (a, k) => { let r = frac(1, 1); for (let i = 0; i < k; i++) r = F.mul(r, a); return r; },
    val: (a) => a.n / a.d,
    str: (a) => (a.d === 1 ? String(a.n) : a.n + '/' + a.d),
    eq: (a, b) => a.n === b.n && a.d === b.d
  };
  function binom(n, k) { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }

  // ---------- Formato ----------
  function fmtNum(x, dec) {
    if (dec === undefined) dec = 4;
    let s = Number(x).toFixed(dec);
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (s === '-0') s = '0';
    return s.replace('.', ',');
  }
  function fmtPct(x, dec) { if (dec === undefined) dec = 2; return fmtNum(x * 100, dec) + ' %'; }
  function fmtProb(fr) { // "1/4 = 0,25 = 25 %"
    const v = F.val(fr);
    if (fr.d === 1) return fr.n + ' = ' + fmtPct(v);
    return fr.n + '/' + fr.d + ' = ' + fmtNum(v, 4) + ' = ' + fmtPct(v);
  }

  // ---------- Normalización ----------
  function stripAccents(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function normText(s) {
    return stripAccents(String(s || '')).toLowerCase().replace(/[\s\-_.,;:'"()¿?¡!]+/g, ' ').trim();
  }
  function normTight(s) { return normText(s).replace(/\s+/g, ''); }

  // Número: acepta 0,25 · 0.25 · 1/4 · 25% · 25 %  · 3,5e-2
  function parseNumber(raw) {
    if (raw === null || raw === undefined) return null;
    let s = String(raw).trim().replace(/\s+/g, '');
    if (!s) return null;
    let pct = false;
    if (s.endsWith('%')) { pct = true; s = s.slice(0, -1); }
    s = s.replace(/×10\^?/i, 'e').replace(/x10\^?/i, 'e');
    // coma decimal → punto (si no hay punto); si hay ambos, la coma es de miles
    if (s.includes(',') && s.includes('.')) s = s.replace(/,/g, '');
    else s = s.replace(',', '.');
    let v;
    const m = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (m) { const d = parseFloat(m[2]); if (d === 0) return null; v = parseFloat(m[1]) / d; }
    else if (/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(s)) v = parseFloat(s);
    else return null;
    if (!isFinite(v)) return null;
    return { v: pct ? v / 100 : v, pct: pct };
  }

  // Proporción "9:3:3:1" (acepta 9/16:3/16..., 1 : 2 : 1, 75%:25%)
  function parseRatio(raw) {
    const s = String(raw || '').trim();
    if (!s) return null;
    const parts = s.split(/\s*[:;]\s*|\s+a\s+|\s*-\s*(?=\d)/).filter(Boolean);
    if (parts.length < 2) return null;
    const vals = parts.map((p) => parseNumber(p));
    if (vals.some((x) => x === null || x.v < 0)) return null;
    return vals.map((x) => x.v);
  }
  function ratioEqual(a, b, tol) {
    if (!a || !b || a.length !== b.length) return false;
    const sa = a.reduce((x, y) => x + y, 0), sb = b.reduce((x, y) => x + y, 0);
    if (sa <= 0 || sb <= 0) return false;
    return a.every((x, i) => Math.abs(x / sa - b[i] / sb) <= (tol || 0.004));
  }

  // Genotipo: "Aa" == "aA"; "*1/*4" == "*4/*1"; "A/G" == "G/A"; "AaBb" por gen
  function normGenotype(s) {
    let t = String(s || '').replace(/\s+/g, '');
    if (t.includes('/')) {
      return t.split('/').map((x) => x.toUpperCase()).sort().join('/');
    }
    // letras: agrupar por gen (misma letra sin importar mayúscula)
    const letters = t.split('');
    const groups = {};
    letters.forEach((c) => { const k = c.toLowerCase(); (groups[k] = groups[k] || []).push(c); });
    return Object.keys(groups).sort().map((k) => groups[k].sort().join('')).join('');
  }

  // Secuencia de nucleótidos
  function normSeq(s) {
    return String(s || '').toUpperCase().replace(/5'|3'|5´|3´|5’|3’/g, '').replace(/[^ACGTU]/g, '');
  }

  // Aminoácidos
  const AA3 = ['Ala', 'Arg', 'Asn', 'Asp', 'Cys', 'Gln', 'Glu', 'Gly', 'His', 'Ile', 'Leu', 'Lys', 'Met', 'Phe', 'Pro', 'Ser', 'Thr', 'Trp', 'Tyr', 'Val'];
  const AA1 = { A: 'Ala', R: 'Arg', N: 'Asn', D: 'Asp', C: 'Cys', Q: 'Gln', E: 'Glu', G: 'Gly', H: 'His', I: 'Ile', L: 'Leu', K: 'Lys', M: 'Met', F: 'Phe', P: 'Pro', S: 'Ser', T: 'Thr', W: 'Trp', Y: 'Tyr', V: 'Val' };
  const STOPWORDS = ['stop', 'ter', 'alto', 'fin', 'paro', 'xxx'];
  function normProtein(s) {
    let t = stripAccents(String(s || '')).trim();
    if (!t) return '';
    let toks;
    if (/[\s\-,.;·]/.test(t)) toks = t.split(/[\s\-,.;·]+/).filter(Boolean);
    else if (t.length % 3 === 0 && t.match(/.{3}/g).every((x) => AA3.some((a) => a.toLowerCase() === x.toLowerCase()) || STOPWORDS.includes(x.toLowerCase()))) toks = t.match(/.{3}/g);
    else toks = t.split('');
    const out = [];
    for (const k of toks) {
      const kl = k.toLowerCase();
      if (kl === '*' || STOPWORDS.includes(kl)) { out.push('STOP'); continue; }
      const a3 = AA3.find((a) => a.toLowerCase() === kl);
      if (a3) { out.push(a3); continue; }
      if (k.length === 1 && AA1[k.toUpperCase()]) { out.push(AA1[k.toUpperCase()]); continue; }
      out.push('?' + k);
    }
    while (out.length && out[out.length - 1] === 'STOP') out.pop();
    return out.join('-');
  }

  // ---------- Autograder ----------
  // field: {kind, answer, tol, accept[], options[]}
  function grade(field, raw) {
    const r = String(raw === undefined || raw === null ? '' : raw).trim();
    if (!r) return false;
    switch (field.kind) {
      case 'num': {
        const p = parseNumber(r);
        if (!p) return false;
        const exp = field.answer;
        const tol = field.tol !== undefined ? field.tol : 0.005;
        let v = p.v;
        if (field.pctUnits && p.pct) v = p.v * 100; // respuesta esperada en "puntos %": 34,8 o 34,8 %
        if (Math.abs(v - exp) <= tol + 1e-12) return true;
        // si la respuesta esperada es una probabilidad y escribieron "25" sin %, interpretar como %
        if (field.prob && !p.pct && v > 1 && v <= 100 && Math.abs(v / 100 - exp) <= tol + 1e-12) return true;
        return false;
      }
      case 'ratio': return ratioEqual(parseRatio(r), field.answer, field.tol);
      case 'geno': {
        const n = normGenotype(r);
        return [field.answer].concat(field.accept || []).some((a) => normGenotype(a) === n);
      }
      case 'seq': return normSeq(r) === normSeq(field.answer);
      case 'protein': return normProtein(r) === normProtein(field.answer);
      case 'choice': return normText(r) === normText(field.answer);
      case 'text':
      default: {
        const n = normTight(r);
        return [field.answer].concat(field.accept || []).some((a) => normTight(a) === n);
      }
    }
  }

  const api = { makeRng, newSeed, gcd, frac, F, binom, fmtNum, fmtPct, fmtProb, stripAccents, normText, normTight, parseNumber, parseRatio, ratioEqual, normGenotype, normSeq, normProtein, grade, AA3, AA1 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GU = api;
})(typeof window !== 'undefined' ? window : globalThis);
