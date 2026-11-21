/* data-cases.js — Casos de razonamiento (respuesta escrita + respuesta modelo + rúbrica). */
(function (root) {
  'use strict';
  const CASES = [
    {
      id: 'r01', t: 's12', title: 'Antidepresivo que "no funciona"',
      scenario: 'Mujer de 34 años con depresión. Recibió amitriptilina a dosis estándar durante 8 semanas sin mejoría, con buena adherencia. La genotipificación muestra CYP2D6 *1/*1xN.',
      ask: ['Clasifica su fenotipo metabolizador y justifica con el número de copias funcionales.', 'Explica por qué no respondió.', 'Propón una conducta.'],
      model: '<p><b>Fenotipo:</b> *1 es funcional y *1xN es una duplicación funcional → 3 copias funcionales → <b>metabolizadora ultrarrápida (UM)</b>.</p><p><b>Explicación:</b> la amitriptilina es inactivada por CYP2D6. Con más actividad enzimática, el fármaco se metaboliza y elimina muy rápido; con la dosis estándar la concentración plasmática queda por debajo del rango terapéutico → "no efectivo" (fracaso terapéutico, clase 13).</p><p><b>Conducta:</b> según la clase 13, dosis incrementada o elegir un fármaco que no dependa de CYP2D6 (alternativa terapéutica), idealmente apoyándose en las guías CPIC.</p>',
      rubric: ['Clasifica como ultrarrápida (UM)', 'Justifica con 3 copias funcionales (duplicación)', 'Relaciona metabolismo rápido → concentración plasmática baja → fracaso terapéutico', 'Propone dosis incrementada o alternativa no dependiente de CYP2D6']
    },
    {
      id: 'r02', t: 's13', title: 'Codeína sin analgesia',
      scenario: 'Varón de 50 años operado de rodilla recibe codeína y refiere que "no le hace nada". Su genotipo CYP2D6 es *4/*4.',
      ask: ['¿Qué fenotipo tiene?', 'Explica el mecanismo de la falta de efecto.', '¿Qué diferencia hay con un fármaco activo (no profármaco) metabolizado por la misma enzima?'],
      model: '<p>*4 es un alelo nulo → 0 copias funcionales → <b>metabolizador lento (PM)</b>.</p><p>La codeína es un <b>profármaco</b>: CYP2D6 la convierte en su forma activa (opioide activo). Sin actividad CYP2D6 casi no se forma el metabolito activo → la actividad analgésica se reduce o desaparece (clase 13).</p><p>Con un fármaco <b>activo</b> que CYP2D6 inactiva, el PM lo acumularía → niveles altos → reacciones adversas/toxicidad. Es decir: profármaco → falla; fármaco activo → toxicidad.</p>',
      rubric: ['Identifica PM (dos alelos nulos)', 'Explica que la codeína es profármaco activado por CYP2D6', 'Concluye menor/ausente analgesia', 'Contrasta con fármaco activo: acumulación y toxicidad']
    },
    {
      id: 'r03', t: 's13', title: 'Tamoxifeno y paroxetina',
      scenario: 'Mujer de 45 años con cáncer de mama con receptores estrogénicos positivos. Se planifica tamoxifeno adyuvante. Toma paroxetina por depresión. Su genotipo CYP2D6 es *1/*4.',
      ask: ['¿Qué fenotipo tiene y cómo se activa el tamoxifeno?', '¿Qué problema genera la paroxetina?', '¿Qué recomendarías según la clase 13?'],
      model: '<p>*1/*4 → 1 copia funcional → <b>metabolizadora intermedia (IM)</b>. El tamoxifeno se convierte por CYP2D6 en 4-hidroxitamoxifeno y, junto con CYP3A4/5, en <b>endoxifeno</b> (metabolito activo).</p><p>La paroxetina es un <b>inhibidor de CYP2D6</b>: reduce aún más la actividad (fenoconversión hacia lento) → menos endoxifeno → menor eficacia del tratamiento.</p><p>Recomendación (clase 13): para CYP2D6 PM/IM, <b>evitar tamoxifeno y considerar un inhibidor de aromatasa</b>; evitar el uso concomitante de inhibidores de CYP2D6 (paroxetina, fluoxetina, bupropión).</p>',
      rubric: ['Identifica IM', 'Explica activación a endoxifeno por CYP2D6', 'Reconoce a la paroxetina como inhibidor de CYP2D6 que reduce la activación', 'Recomienda evitar tamoxifeno/considerar inhibidor de aromatasa y evitar inhibidores de CYP2D6']
    },
    {
      id: 'r04', t: 's13', title: 'Clopidogrel tras stent',
      scenario: 'Varón de 62 años con implante de stent coronario recibe clopidogrel 300 mg de carga. Es CYP2C19 *2/*2. A los 3 meses presenta trombosis del stent.',
      ask: ['Interpreta el genotipo.', 'Explica la relación con la trombosis.', '¿Qué dato de la clase apoya tu explicación?'],
      model: '<p>*2 es un alelo no funcional → *2/*2 = <b>metabolizador lento de CYP2C19</b> (~15 % de la población según la clase).</p><p>El clopidogrel es un <b>profármaco</b> que CYP2C19 activa. El PM no lo activa de manera eficaz → no cumple su función antiagregante → mayor riesgo de trombosis del stent.</p><p>Dato: en el estudio mostrado, la trombosis del stent fue 2,6 % en portadores de variantes de función reducida frente a 0,8 % en no portadores (p = 0,02); la exposición al metabolito (AUC) cae de UM a PM.</p>',
      rubric: ['Identifica metabolizador lento de CYP2C19', 'Explica que clopidogrel es profármaco activado por CYP2C19', 'Relaciona la falta de activación con la trombosis', 'Cita el dato 2,6 % vs 0,8 % (o el AUC por fenotipo)']
    },
    {
      id: 'r05', t: 's12', title: 'Tacrolimus en trasplante renal',
      scenario: 'Dos receptores de trasplante renal reciben la misma dosis de tacrolimus. El paciente A es CYP3A5 A/A y el paciente B es G/G en el SNP c.6986A>G.',
      ask: ['Escribe sus genotipos en alelos estrella y su fenotipo.', '¿Qué paciente tendrá niveles plasmáticos más altos con la misma dosis? Justifica.', '¿Qué ajuste proponer?'],
      model: '<p>A/A = <b>*1/*1</b> → metabolizador normal. G/G = <b>*3/*3</b> → metabolizador lento (el alelo *3 produce una proteína truncada no funcional, clase 12).</p><p>Con la misma dosis, el paciente <b>B</b> metaboliza menos el tacrolimus → mayor concentración plasmática → riesgo de toxicidad.</p><p>Ajuste: en el metabolizador lento, dosis reducida (regla general de la clase 13) y monitorizar niveles; el normal recibe dosis estándar.</p>',
      rubric: ['A = *1/*1 normal y B = *3/*3 lento', 'Explica que *3 es no funcional (proteína truncada)', 'Concluye que B tendrá niveles más altos', 'Propone reducir dosis/monitorizar en B']
    },
    {
      id: 'r06', t: 's12', title: 'Abacavir y HLA-B*5701',
      scenario: 'Paciente con VIH que iniciará un esquema con abacavir. El médico pregunta si vale la pena genotipificar antes de prescribir.',
      ask: ['¿Qué variante se debe buscar y por qué?', '¿Qué cuadro clínico se busca evitar?', '¿Qué haces si sale positivo?'],
      model: '<p>Buscar <b>HLA-B*5701</b>, factor de riesgo de <b>alta penetrancia</b> para hipersensibilidad a abacavir (análogo de nucleósido inhibidor de la transcriptasa reversa).</p><p>Se busca evitar la reacción de hipersensibilidad que ocurre en 4–8 % en las primeras semanas: fiebre, rash, dolor abdominal, síntomas respiratorios.</p><p>Si es positivo: <b>no usar abacavir</b> y elegir otro antirretroviral. Es el ejemplo de "genotipificación pre-prescripción" del escenario farmacogenómico ideal.</p>',
      rubric: ['Nombra HLA-B*5701', 'Lo describe como factor de alta penetrancia de hipersensibilidad', 'Describe la reacción (fiebre, rash, dolor abdominal, respiratorios; primeras semanas)', 'Evita abacavir si es positivo']
    },
    {
      id: 'r07', t: 's11', title: 'Una familia con anemia falciforme',
      scenario: 'Una pareja sana tiene una hija con anemia falciforme. La hermana sana de la niña quiere saber si es portadora y la pareja pregunta por el riesgo en un nuevo embarazo.',
      ask: ['Modo de herencia y genotipo de los padres.', 'Riesgo de un nuevo hijo afectado.', 'Probabilidad de que la hermana sana sea portadora.', 'Qué prueba ofrecerías a la hermana y qué terapia nueva existe.'],
      model: '<p>Autosómica recesiva (gen HBB). Una hija afectada con padres sanos → ambos padres son <b>portadores (Aa)</b>.</p><p>Nuevo hijo: <b>1/4</b> afectado (cada embarazo es independiente).</p><p>Hermana sana: entre los no afectados (AA, Aa, Aa) → <b>2/3</b> de ser portadora.</p><p>Prueba de portador (diagnóstica y de portador en la adultez). Desde noviembre de 2023 existe terapia génica con CRISPR: se extraen células madre, se corrige HBB y se reintroducen.</p>',
      rubric: ['Identifica AR y padres portadores', 'Riesgo 1/4 por embarazo, independiente', 'Calcula 2/3 para la hermana sana', 'Menciona prueba de portador y/o terapia CRISPR']
    },
    {
      id: 'r08', t: 's11', title: '¿Dominante o mitocondrial?',
      scenario: 'En una familia, una mujer afectada tiene 4 hijos, todos afectados. Uno de sus hijos varones afectados tiene 3 hijos sanos con una mujer sana. Una de sus hijas afectadas tiene 2 hijos, ambos afectados.',
      ask: ['¿Qué modo de herencia es más probable?', '¿Qué observación descarta un autosómico dominante como la mejor explicación?', '¿Qué riesgo tienen los futuros hijos del varón afectado?'],
      model: '<p>Más probable: <b>herencia mitocondrial</b> (transmisión materna).</p><p>Clave: la madre afectada transmite a <b>todos</b> sus hijos, y el varón afectado no transmite a ninguno. En AD un varón afectado transmitiría a ~1/2 de sus hijos, y que los 4 hijos de la madre estén afectados sería poco probable (1/16).</p><p>Los hijos del varón afectado: riesgo <b>0</b>, porque los padres afectados no transmiten trastornos mitocondriales (las mitocondrias vienen del óvulo).</p>',
      rubric: ['Concluye herencia mitocondrial', 'Usa el dato de que el varón no transmite', 'Usa el dato de que la madre transmite a todos', 'Riesgo 0 para los hijos del varón']
    },
    {
      id: 'r09', t: 's11', title: 'Mapear el gen de una enfermedad en una familia peruana',
      scenario: 'Se identifica una familia extensa de Huánuco con una enfermedad nueva que aparece en hermanos de padres sanos. Te piden un plan para encontrar el gen.',
      ask: ['Ordena los pasos del mapeo genético.', '¿Qué marcadores usarías y por qué?', '¿Cómo confirmarías la mutación causante?'],
      model: '<ol><li>Identificar el modo probable de herencia (hermanos afectados con padres sanos → AR); hacer cariotipo para descartar anomalía cromosómica.</li><li>Mapear: análisis de ligamiento en la familia (los afectados comparten alelos de marcadores cercanos) y/o mapeo de poblaciones (segmentos IBD); luego mapeo fino con más pacientes y marcadores.</li><li>Identificar genes candidatos en la región (Ensembl, UCSC, NCBI; homología con proteínas conocidas).</li><li>Buscar mutaciones en los candidatos: PCR de la secuencia codificante + secuenciación, SSCP, heterodúplex/DHPLC; FISH/cariotipo para grandes reordenamientos.</li><li>Determinar las consecuencias funcionales (transcripción, estabilidad del ARNm, localización o función de la proteína).</li></ol><p>Marcadores: SNPs (muy comunes, baja tasa de mutación, genotipado por microarreglos) y/o SSR (muy polimórficos). Confirmar: desarrollar un ensayo específico, verificar segregación con la enfermedad y su efecto funcional.</p>',
      rubric: ['Los 5 pasos en orden', 'Infiere AR y menciona cariotipo previo', 'Elige marcadores (SNP/SSR) con justificación', 'Métodos de detección y evaluación funcional/ensayo específico']
    },
    {
      id: 'r10', t: 's14', title: 'BRCA1 metilado',
      scenario: 'Dos mujeres sin mutación en la secuencia de BRCA1. En ADN de sangre, la paciente A tiene 35–45 % de metilación en 5 de 6 sitios CpG del promotor de BRCA1; la paciente B tiene ~0 %.',
      ask: ['¿Quién tiene mayor riesgo de cáncer de mama? Justifica con el mecanismo.', '¿Por qué decimos que es un cambio epigenético?', '¿Qué opción terapéutica epigenética existe en teoría y qué limitaciones tiene?'],
      model: '<p><b>Paciente A</b>. BRCA1 es un gen supresor de tumores; la <b>hipermetilación</b> de su promotor (islas CpG) lo <b>silencia</b> → se pierde la inhibición de la progresión tumoral.</p><p>Es epigenético porque cambia la expresión sin alterar la secuencia de ADN y es potencialmente reversible.</p><p>En teoría, inhibidores de DNMT (5-azacitidina, decitabina) impiden la metilación de CpG; pero la clase señala problemas de estabilidad, selectividad/inespecificidad (toxicidad) y farmacocinética.</p>',
      rubric: ['Elige a la paciente A', 'Explica hipermetilación → silenciamiento de un supresor', 'Define epigenético (sin cambio de secuencia, reversible)', 'Menciona DNMTi y sus limitaciones']
    },
    {
      id: 'r11', t: 's14', title: 'Gemelos con destinos distintos',
      scenario: 'Gemelos idénticos de 60 años: uno fumador sedentario con obesidad y otro deportista con dieta saludable. Solo el primero desarrolla una enfermedad metabólica.',
      ask: ['¿Cómo explicas la diferencia si comparten genes?', '¿Qué mecanismos podrían estar implicados?', '¿Qué biomarcador epigenético podría reflejar su "edad biológica"?'],
      model: '<p>Comparten la secuencia (genotipo), pero el ambiente (tabaco, dieta, ejercicio, estrés) modifica la <b>epigenética</b>: activa o inactiva genes de forma reversible → fenotipos distintos.</p><p>Mecanismos: metilación del ADN (islas CpG), modificaciones de histonas y ARN no codificantes (miRNA).</p><p>El <b>reloj epigenético</b>: analiza la metilación de sitios CpG y estima la edad; la información biológica refleja el fenotipo de edad y enfermedades.</p>',
      rubric: ['Distingue genotipo igual vs epigenética diferente por ambiente', 'Nombra los tres mecanismos', 'Menciona el reloj epigenético', 'Señala reversibilidad o activación/inactivación génica']
    },
    {
      id: 'r12', t: 's13', title: 'Paciente polimedicado',
      scenario: 'Paciente estable con un fármaco sustrato de un CYP. Se le agregan dos medicamentos: uno es inhibidor y el otro inductor de ese mismo CYP (en momentos distintos).',
      ask: ['¿Qué esperas con el inhibidor?', '¿Y con el inductor?', '¿Por qué la farmacogenética es útil en polimedicados?'],
      model: '<p><b>Inhibidor:</b> metabolismo reducido → nivel plasmático incrementado → eliminación reducida → efecto y toxicidad incrementados.</p><p><b>Inductor:</b> metabolismo acelerado → nivel plasmático reducido → eliminación rápida → efecto reducido.</p><p>La clase 13 destaca la gestión más efectiva de pacientes polimedicados: el perfil genético (sumado a las interacciones fármaco-fármaco) permite anticipar quién está en riesgo de reacciones adversas o ineficacia.</p>',
      rubric: ['Inhibidor → ↑ nivel y toxicidad', 'Inductor → ↓ nivel y efecto', 'Explica la cadena metabolismo–nivel–eliminación–efecto', 'Vincula con utilidad de PGx en polimedicados']
    },
    {
      id: 'r13', t: 's10', title: 'Examen físico de un recién nacido',
      scenario: 'Un recién nacido presenta: pliegue palmar transverso, lóbulo de la oreja con surco y microtia. La madre tiene 39 años y el padre 48; son primos.',
      ask: ['Clasifica cada hallazgo (variante normal, anomalía menor o mayor) con su criterio.', '¿Qué factores de riesgo hay en los antecedentes?', '¿Qué pasos siguientes propones?'],
      model: '<p>Pliegue palmar transverso: <b>variante normal</b> (>4 % de la población, sin significado funcional/cosmético). Lóbulo con surco: <b>anomalía menor</b> (<4 %, sin significado serio). Microtia: <b>anomalía mayor</b> (daño funcional y/o cosmético importante).</p><p>Factores de riesgo: consanguinidad, edad materna (39 a) y paterna (48 a) avanzadas.</p><p>Siguiente: anamnesis detallada (genealogía, embarazo, parto), observar a los padres y la procedencia, estudios complementarios (p. ej., cariotipo), interconsulta y asesoramiento genético.</p>',
      rubric: ['Clasifica correctamente los tres hallazgos', 'Usa el criterio del 4 % y del significado funcional', 'Identifica consanguinidad y edades parentales', 'Propone abordaje (anamnesis, estudios, asesoramiento)']
    },
    {
      id: 'r14', t: 's10', title: '¿Qué medicina estamos practicando?',
      scenario: 'En 2018 un hospital daba 40 mg dos veces al día de un fármaco a todos los pacientes. En 2028 planea ajustar la dosis (20, 40 u 80 mg) o cambiar de medicamento según el genotipo.',
      ask: ['Nombra el modelo de 2018 y el de 2028.', '¿Qué ventajas se esperan del modelo de 2028?', '¿Qué limitaciones podrían retrasarlo en el Perú?'],
      model: '<p>2018: medicina curativa / tradicional basada en protocolos ("igual diagnóstico, igual prescripción"; tratamiento de la enfermedad). 2028: <b>medicina personalizada</b> con farmacogenómica (tratamiento del enfermo).</p><p>Ventajas: mejor medicamento y dosis adecuada, mayor eficacia y menor toxicidad, prevención de eventos adversos y ahorro.</p><p>Limitaciones (clase 12): formación pre-genómica de los médicos, falta de conocimiento para interpretar resultados, pocos laboratorios y costo/falta de indicación para el paciente; además, la subrepresentación de poblaciones latinoamericanas en las bases genómicas.</p>',
      rubric: ['Identifica curativa/protocolos vs personalizada', 'Menciona ventajas (dosis adecuada, menos EA, ahorro)', 'Menciona al menos dos limitaciones de la clase 12', 'Menciona la diversidad poblacional o el contexto peruano']
    },
    {
      id: 'r15', t: 's11', title: 'Elegir el método de laboratorio',
      scenario: 'Tienes tres pacientes: (1) sospecha de síndrome de Down; (2) leucemia con posible fusión BCR-ABL; (3) sospecha de un cambio de una base en un gen candidato conocido.',
      ask: ['¿Qué método elegirías en cada caso?', 'Justifica según lo que detecta cada técnica.'],
      model: '<p>(1) <b>Cariotipo</b>: detecta cambios en el número de cromosomas (trisomía/aneuploidía), visibles por citogenética.</p><p>(2) <b>FISH</b>: hibridación fluorescente in situ; detecta grandes reordenamientos como la fusión BCR-ABL.</p><p>(3) <b>PCR de la secuencia codificante + secuenciación del ADN</b> (o SSCP/heterodúplex-DHPLC como cribado): detectan cambios pequeños como sustituciones de una base.</p>',
      rubric: ['Cariotipo para (1)', 'FISH para (2)', 'PCR + secuenciación (o SSCP/DHPLC) para (3)', 'Justifica según tamaño del cambio detectable']
    },
    {
      id: 'r16', t: 's12', title: 'Diseñar un GWAS de respuesta a fármacos',
      scenario: 'Quieres saber por qué algunos pacientes con TB presentan hepatotoxicidad con el tratamiento y otros no.',
      ask: ['Describe el diseño (grupos).', '¿Qué se compara y qué se espera encontrar?', '¿Cómo se pasaría el hallazgo a la práctica clínica?'],
      model: '<p>Estrategia GWAS: comparar la secuencia del genoma de dos grupos: pacientes con mala respuesta (hepatotoxicidad = casos) y con buena respuesta (sin hepatotoxicidad = controles).</p><p>Se buscan variantes (SNPs) más frecuentes en los casos → genes asociados a la variabilidad (p. ej., enzimas como NAT2, CYP2E1, GST, estudiadas en población peruana según las clases 9 y 13).</p><p>Traslado a la clínica: validar, generar guías (tipo CPIC/PharmGKB) y genotipificar antes de prescribir para ajustar fármaco o dosis.</p>',
      rubric: ['Casos vs controles definidos por la respuesta', 'Compara genomas/SNPs entre grupos', 'Menciona genes candidatos plausibles de la clase', 'Propone traslado: validación, guías, genotipificación pre-prescripción']
    },
    {
      id: 'r17', t: 's14', title: 'Elegir una epidroga',
      scenario: 'Tres pacientes: (1) síndrome mielodisplásico; (2) linfoma cutáneo de células T; (3) sarcoma epitelioide metastásico.',
      ask: ['Propón una epidroga aprobada por la FDA para cada uno y su clase.', '¿Por qué se combinan HDACi con DNMTi?', 'Menciona dos dificultades de las epidrogas.'],
      model: '<p>(1) <b>5-azacitidina</b> o <b>decitabina</b> (inhibidores de DNMT, 1.ª generación). (2) <b>Vorinostat (SAHA)</b> o <b>romidepsina</b> (inhibidores de HDAC). (3) <b>Tazemetostat</b> (inhibidor de EZH2, una HMT).</p><p>Los HDACi se usan solos pero son más activos combinados con DNMTi (actúan sobre dos mecanismos epigenéticos: histonas y metilación del ADN).</p><p>Dificultades: inespecificidad (→ toxicidad) y farmacocinética (las de 1.ª generación también tienen problemas de estabilidad y selectividad).</p>',
      rubric: ['DNMTi correcto para (1)', 'HDACi correcto para (2)', 'Tazemetostat (EZH2) para (3)', 'Combinación y dificultades']
    },
    {
      id: 'r18', t: 's9', title: 'Tuberculosis: hospedero, patógeno y ambiente',
      scenario: 'Un paciente de Lima con TB pulmonar tiene genotipo MCP-1 2G/2G, desnutrición, vive en hacinamiento y su cepa es resistente a isoniazida.',
      ask: ['Clasifica cada factor en hospedero, patógeno o ambiente.', '¿Qué implica su genotipo según la clase 9?', '¿Qué aporta la genómica al manejo de la TB?'],
      model: '<p>Hospedero: genotipo MCP-1 2G/2G (susceptibilidad genética). Patógeno: resistencia a isoniazida (genotipo bacteriano). Ambiente: desnutrición, hacinamiento/urbanización.</p><p>MCP-1 2G/2G (con MMP-1 2G/2G) se asoció a TB más severa, 6,5 veces más lesiones permanentes y 3,8 veces más retraso en la respuesta al tratamiento de primera línea.</p><p>La genómica permite estudiar susceptibilidad y progresión (p. ej., 3q23/IRF1), genotipar la bacteria y su resistencia, y orientar una medicina personalizada (incluida la farmacogenética de los antituberculosos).</p>',
      rubric: ['Clasifica bien los tres tipos de factores', 'Cita el riesgo asociado a MCP-1 2G/2G', 'Menciona genotipado de la bacteria/resistencia', 'Vincula con medicina personalizada']
    },
    {
      id: 'r19', t: 's9', title: 'Excepciones a Mendel',
      scenario: 'En un cruce de dos heterocigotos para un carácter, un estudiante obtiene 1:2:1 en vez de 3:1; en otro cruce de heterocigotos obtiene 2:1.',
      ask: ['Explica cada resultado con una excepción del mapa conceptual de la clase 9.', '¿Qué ley se ve afectada en cada caso?'],
      model: '<p>1:2:1 → <b>codominancia</b> (A = B): el heterocigoto tiene un fenotipo propio, por lo que la proporción fenotípica es igual a la genotípica; "3/4 y 1/4 no se cumple" (excepción a la segunda ley).</p><p>2:1 → <b>gen letal</b>: un homocigoto muere antes de nacer; entre los nacidos quedan 2/3 heterocigotos y 1/3 del otro homocigoto (excepción de la segunda ley).</p>',
      rubric: ['Codominancia para 1:2:1', 'Gen letal para 2:1', 'Explica por qué cambian las proporciones', 'Relaciona con la segunda ley/mendelismo complejo']
    },
    {
      id: 'r20', t: 's13', title: 'Leer un reporte farmacogenético',
      scenario: 'Un reporte dice: CYP2C19 — INTERMEDIATE METABOLIZER (IM) — DEFICIENT ACTIVITY — rs4244285 — 0,14 (A) — c.681G>A; *2A — RESULT *1A/*2A — "Dose adjustment to be evaluated by the physician".',
      ask: ['Explica cada parte: gen, rs, 0,14 (A), c.681G>A, *1A/*2A.', '¿Qué significa clínicamente el fenotipo?', '¿Qué fármaco de la clase depende de esta enzima y qué precaución tomarías?'],
      model: '<p>CYP2C19: familia 2, subfamilia C, enzima 19. rs4244285: identificador del SNP en dbSNP. 0,14 (A): frecuencia del alelo de riesgo A en la población. c.681G>A: en la posición 681 de la secuencia codificante, G cambia a A (define el alelo *2A). *1A/*2A: un alelo normal y uno no funcional → <b>metabolizador intermedio</b>.</p><p>Actividad deficiente: los fármacos metabolizados por CYP2C19 tendrán metabolismo alterado; el médico debe evaluar un ajuste de dosis.</p><p>Clopidogrel (profármaco activado por CYP2C19): un IM forma menos metabolito activo → menor antiagregación; evaluar alternativa/seguimiento (más crítico en PM). La clase 14 menciona además antiplaquetarios, anticonvulsivos, antidepresivos e inhibidores de bomba de protones como sustratos.</p>',
      rubric: ['Descompone nomenclatura y rs', 'Interpreta frecuencia alélica y c.681G>A', 'Clasifica IM y su significado', 'Relaciona con clopidogrel u otro sustrato y precaución']
    }
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = { CASES };
  else root.CASES = CASES;
})(typeof window !== 'undefined' ? window : globalThis);
