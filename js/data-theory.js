/* data-theory.js — Teoría por tema (resumen fiel a las clases 9–14).
   {{svg:nombre}} se reemplaza por el diagrama correspondiente de svg.js. */
(function (root) {
  'use strict';
  const THEORY = {
    s9: `
<p class="lead">Clase 9 (07/10): qué es genética y genómica, leyes de Mendel y sus excepciones, consejería genética, epigenómica, historia, aplicaciones en tuberculosis, medicina de precisión y tecnologías de secuenciación.</p>
<h3>Definiciones clave</h3>
<dl class="defs">
<dt>Genética</dt><dd>Rama de la biología que estudia la <b>herencia</b>. Usualmente engloba enfermedades cromosómicas o monogénicas.</dd>
<dt>Herencia</dt><dd>Transmisión de características de padres a hijos.</dd>
<dt>Característica hereditaria</dt><dd>La que un ser vivo puede transmitir a su progenie (color de ojos, pelo, rasgos de la cara).</dd>
<dt>Genómica</dt><dd>Estudio de la información <b>total o parcial</b> de la secuencia genética o epigenética (y derivados) de los organismos. Cascada: genoma → epigenoma → transcriptoma → proteoma → metaboloma.</dd>
<dt>Epigenómica</dt><dd>Cambios en la activación/desactivación de genes por medio ambiente/ambiente laboral, contaminación, alimentación, carcinógenos, infecciones, ejercicio y fumar.</dd>
</dl>
<h3>Leyes de Mendel (1822–1884)</h3>
<table class="tbl"><tr><th>Ley</th><th>Enunciado</th><th>Resultado típico</th></tr>
<tr><td>1.ª Uniformidad</td><td>Al cruzar dos razas puras para un carácter, todos los híbridos F1 son iguales.</td><td>AA × aa → 100 % Aa</td></tr>
<tr><td>2.ª Segregación</td><td>Al cruzar los F1 entre sí, los alelos se separan en los gametos.</td><td>Aa × Aa → 3:1 fenotípico (75 % amarillas, 25 % verdes); 1:2:1 genotípico</td></tr>
<tr><td>3.ª Combinación independiente</td><td>Dos caracteres (dihíbridos) se combinan de todas las formas posibles.</td><td>AaBb × AaBb → 16 combinaciones; 9:3:3:1</td></tr></table>
<div class="formula">Regla del producto: P(A y B) = P(A) × P(B) (eventos independientes) · Regla de la suma: P(A o B) = P(A) + P(B) (eventos excluyentes)</div>
<div class="table-wrap" data-punnett="dihibrido"></div>
<h3>Mendelismo complejo (excepciones del mapa conceptual)</h3>
<table class="tbl"><tr><th>Excepción</th><th>Qué pasa</th><th>Ley afectada</th></tr>
<tr><td>Codominancia (A = B)</td><td>El heterocigoto expresa ambos alelos; 3/4 : 1/4 no se cumple → 1:2:1</td><td>1.ª y 2.ª</td></tr>
<tr><td>Genes letales</td><td>Un genotipo muere; entre los nacidos cambia la proporción (p. ej., 2:1)</td><td>2.ª</td></tr>
<tr><td>Interacción entre genes</td><td>Unos genes enmascaran a otros: 9/16, 3/16, 3/16, 1/16 no se cumple</td><td>3.ª</td></tr>
<tr><td>Alelismo múltiple</td><td>Hay más de 2 alelos para un gen</td><td>3.ª</td></tr>
<tr><td>Poligenia</td><td>Un carácter depende de varios genes ("1 gen, 1 carácter" no se cumple)</td><td>3.ª</td></tr></table>
<h3>Consejería (asesoramiento) genética</h3>
<ul><li>Informar cómo influye la herencia en la enfermedad; determinar la posibilidad de desarrollar una patología; <b>calcular la probabilidad de transmitirla</b>; ayudar a entender opciones terapéuticas; explicar resultados; definir un programa de seguimiento.</li>
<li>El <b>médico de atención primaria</b> determina la probabilidad de un componente genético y solicita la intervención del genetista.</li></ul>
<h3>Contexto peruano y epidemiología</h3>
<table class="tbl"><tr><th></th><th>Costa (52,6 %)</th><th>Sierra (38 %)</th><th>Selva (9,4 %)</th></tr>
<tr><td>Población</td><td>Mestizos y afros</td><td>Mestizos y nativos andinos</td><td>Mestizos y nativos de selva</td></tr>
<tr><td>Dieta</td><td>Pescado, arroz, preservantes</td><td>Papas, camote, trigo</td><td>Productos silvestres y de río, plátano</td></tr>
<tr><td>Salud</td><td>Vías respiratorias, TB; contaminación del aire</td><td>Vías respiratorias, zoonosis; contaminación de ríos; exposición UV</td><td>60 % parásitos, malaria, arbovirus; TH2 > TH1; contaminación de ríos</td></tr></table>
<h3>Historia (línea de tiempo de la clase)</h3>
<table class="tbl"><tr><th>Año</th><th>Hito</th></tr>
<tr><td>1400</td><td>Maras Moray: centro de adaptación de semillas</td></tr><tr><td>1866</td><td>Leyes de la herencia (Mendel)</td></tr><tr><td>1953</td><td>Doble hélice del ADN (Watson y Crick)</td></tr><tr><td>2001 / 2002</td><td>Genoma humano / HapMap</td></tr><tr><td>2005</td><td>OMS: promover la diversidad genética</td></tr><tr><td>2009 / 2010</td><td>Genoma de poblaciones mexicanas / 1000 Genomas</td></tr><tr><td>2011</td><td>Inicio del genoma de poblaciones peruanas</td></tr><tr><td>2014</td><td>Edición genómica CRISPR-Cas9</td></tr><tr><td>2017</td><td>Primer estudio de ADN antiguo (Caral, 5000 a. C.)</td></tr><tr><td>2019</td><td>Proyecto 1000 Genomas Peruanos</td></tr></table>
<p>OMS: Programa de Genética Humana + Iniciativa en Genómica y Salud Pública → <b>Genómica Humana en la Salud Global</b>. En 1000 Genomas, la población peruana de referencia es <b>PEL (Peruanos de Lima)</b>. Latinoamérica está <b>subrepresentada</b> en los estudios genómicos.</p>
<h3>Aplicaciones: tuberculosis</h3>
<ul><li>Genotipo MCP-1 (–2518) 2G/2G con MMP-1 (–1607) 2G/2G: TB más severa (&gt;13 veces), <b>6,5 veces</b> más lesiones permanentes y <b>3,8 veces</b> más retraso en la respuesta al tratamiento de primera línea.</li>
<li>Región 3q23: 11 variantes (activación del macrófago, IRF1). La <b>progresión</b> fue más heredable que la susceptibilidad (21,2 % vs 15,5 %).</li>
<li>RNA-seq en nativos de altura (Huánuco): 2 927 genes con expresión diferencial por altitud (1 419 a la baja, 1 508 al alza), 34 del sistema inmune.</li></ul>
<h3>Medicina tradicional vs medicina de precisión</h3>
<table class="tbl"><tr><th>Tradicional</th><th>Precisión</th></tr><tr><td>Ensayo y error, experiencia, efectos adversos, podrían no ser efectivos (A → B → C → D)</td><td>Farmacogenómica: reduce efectos adversos, selecciona los mejores medicamentos a las mejores dosis (D desde el inicio)</td></tr></table>
<h3>Tecnologías de secuenciación</h3>
{{svg:seqGenerations}}
<p>El costo por genoma humano cayó más rápido que la ley de Moore con la secuenciación de nueva generación. ~25 000 genes; también se usan microarreglos.</p>`,

    s10: `
<p class="lead">Clase 10 (14/10): medicina curativa, preventiva, predictiva y personalizada; consideraciones evolutivas y ambientales; no todas las variantes causan efecto; ómicas; herramientas de la genómica médica y abordaje clínico.</p>
<h3>Modelos de medicina</h3>
<table class="tbl"><tr><th>Modelo</th><th>Idea central</th></tr>
<tr><td>Curativa</td><td>Terapia estándar (observación, cirugía, radio/quimio/inmuno/terapia hormonal). <b>Igual diagnóstico, igual prescripción</b> → eficacia y efectos adversos variables.</td></tr>
<tr><td>Preventiva</td><td>Prevención poblacional (p. ej., vacunación).</td></tr>
<tr><td>Predictiva</td><td>Antecedentes familiares + hábitos (tabaco, obesidad, estrés, sedentarismo, dieta) + información genómica → programa de ayuda en decisión clínica → asesoría sobre riesgos.</td></tr>
<tr><td>Personalizada</td><td>Mejor medicamento, dosis adecuada, menos efectos adversos (Perú 2018: 40 mg 2 v/d para todos; Perú 2028/UK-EE. UU. 2018: 20, 40, 80 mg u otro medicamento según genotipo).</td></tr></table>
<h3>Consideraciones evolutivas y ambientales</h3>
<ul><li>Diferencia en el genotipo entre personas: <b>0,1 %</b> (Homo sapiens); ~1 % frente a otros homínidos.</li>
<li>Migración (150 mil años): en teoría somos más resistentes a cambios ambientales e infecciones, pero menos tolerantes a la altura; la información está almacenada en el ADN/cromatina. El <b>mestizaje y la globalización</b> podrían disminuir la resistencia ganada.</li>
<li>Epigenómica: el ambiente activa/desactiva genes (poblaciones Matsés, Jaqarus, Asháninka, Shipibo-Conibo, afrodescendientes, mestizos…). "Somos producto de lo que comemos y tomamos".</li>
<li>Triada TB: <b>hospedero</b> (susceptibilidad genética, inmunología), <b>patógeno</b> (genotipos bacterianos, resistencia), <b>ambiente</b> (comorbilidades, nutrición, urbanización, socioeconomía).</li></ul>
<h3>No todas las variantes causan efecto</h3>
<p>Un SNP puede estar en región <b>codificante</b> o <b>no codificante</b>; según su ubicación puede o no modificar el ARN, la proteína y el fenotipo.</p>
<h3>Ómicas como "posible explicación"</h3>
<table class="tbl"><tr><th>Ómica</th><th>Puntos clave</th></tr>
<tr><td>Transcriptómica / miRNA</td><td>miRNA: ARN pequeños no codificantes (~18–24 nt) que regulan la expresión génica; 1–5 % del genoma; regulan ≥30 % de los genes codificantes; &gt;17 000 miRNA en 142 especies, &gt;1 900 humanos; ~60 % expresados independientemente, ~15 % en clusters, ~25 % en intrones.</td></tr>
<tr><td>Metabolómica</td><td>Estudia los metabolitos (pequeñas moléculas orgánicas). Relaciona genotipo y fenotipo con ambiente y estilo de vida. Sirve para entender la patogénesis, diagnóstico temprano, decidir y monitorizar la terapia.</td></tr></table>
<p>Datos TB: incidencia 100/100 000; 60 % de los casos en Lima; 80 % de TB MDR en Lima; "en toda enfermedad crónica con tos debería considerarse TB". Cáncer de pulmón: células pequeñas 20 %, no pequeñas 80 %, ~15 % de sobrevida a 5 años.</p>
<h3>¿Cuándo consultar a un genetista?</h3>
<ol><li>Antecedentes familiares de enfermedades hereditarias o genéticas.</li><li>Parejas con niños con malformaciones o condiciones genéticas.</li><li>Sospecha de cáncer familiar o hereditario.</li><li>Retraso del desarrollo, discapacidad intelectual, trastorno del espectro autista.</li><li>Antecedentes de abortos o muerte fetal.</li><li>Dudas sobre el riesgo de que los hijos sufran enfermedades genéticas.</li></ol>
<p>Un test genético puede comprobar <b>predisposición</b> (Alzheimer, ataxia de Friedreich, Marfan, cáncer de mama, epilepsia, autismo, diabetes, celiaquía). El reporte del exoma es un <b>procedimiento dinámico</b>: SNPs/indels + bases de datos → variante patogénica, no patogénica o no significativa. Biopsia líquida en sepsis: secuenciación <b>30 h</b> vs cultivo <b>4 semanas</b>.</p>
<h3>Abordaje clínico</h3>
<p>Anamnesis detallada (genealogía, embarazo, parto y evolución) → examen físico minucioso → estudios complementarios → interdisciplina y búsqueda en bases de datos → integración diagnóstica → asesoramiento genético → seguimiento, tratamiento, prevención secundaria.</p>
<p><b>Factores de riesgo de anomalías congénitas</b>: marco socioeconómico, alfabetización y escolaridad, edad y salud de los padres, consanguinidad, dificultad para concebir, fallas reproductivas, mortinatos, trastorno genético conocido en la familia o familiares cercanos con sospecha.</p>
<h3>Examen físico</h3>
<table class="tbl"><tr><th>Categoría</th><th>Criterio</th><th>Ejemplos de la clase</th></tr>
<tr><td>Variante normal</td><td>&gt;4 % de la población; sin significado cosmético ni funcional</td><td>Mancha "mongólica", sindactilia cutánea 2.º-3.er dedo, pliegue palmar transverso</td></tr>
<tr><td>Anomalía menor</td><td>&lt;4 %; sin significado funcional ni cosmético serio</td><td>Oreja simple, lóbulo con surco, orejas protruidas</td></tr>
<tr><td>Anomalía mayor</td><td>Daño funcional significativo y/o importancia cosmética</td><td>Hidrocefalia, anoftalmía, microtia, hipertelorismo, punta nasal bífida</td></tr></table>
{{svg:etiology}}
<p>Ejemplos: Down (cromosómica), células falciformes (génica), fisura de labio/paladar y DCTN (multifactorial), focomelia por talidomida (teratógeno).</p>
<h3>Momento de las pruebas genéticas</h3>
<p>Preimplantacional (embrión antes de implantarse) → prenatal → tamizaje neonatal → diagnóstico y de portador (adultez).</p>
<p><b>Anemia falciforme</b>: autosómica recesiva, gen <i>HBB</i> (β-globina); 1–5 por 10 000; primera terapia génica con CRISPR aprobada (noviembre 2023): se editan células madre del paciente y se reintroducen.</p>`,

    s11: `
<p class="lead">Clase 11 (21/10): el genoma humano y los 5 pasos del mapeo genético (modo de herencia, marcadores y ligamiento, genes candidatos, mutaciones y consecuencias funcionales).</p>
<h3>Lo básico</h3>
<table class="tbl"><tr><th>Componente</th><th>Datos</th></tr>
<tr><td>Cromosomas</td><td>46: dos copias de 22 autosomas + XX (mujer) o XY (varón). Tjio y Levan, 1956.</td></tr>
<tr><td>Genoma nuclear</td><td>~3,2 Gb (una copia de 1–22, X e Y); ~30 000–35 000 genes codificantes = ~1,5 % del ADN.</td></tr>
<tr><td>ADN mitocondrial</td><td>~16 kb, 37 genes; herencia materna.</td></tr>
<tr><td>ADN no codificante</td><td>tRNA, rRNA, sRNA, miRNA; mantenimiento de extremos cromosómicos, segregación cromosómica, inicio y regulación de la expresión. Mucho sin función conocida (pseudogenes, elementos repetitivos: SINE 13,1 %, LINE 20,4 %, intrones 25,9 %).</td></tr></table>
{{svg:genome}}
<h3>Los 5 pasos del mapeo genético</h3>
<ol class="steps"><li>Identificar el modo probable de herencia.</li><li>Mapear inicialmente el gen y refinar su ubicación (marcadores, ligamiento, mapeo de poblaciones, mapeo fino).</li><li>Identificar genes candidatos.</li><li>Seleccionar genes candidatos para buscar mutaciones.</li><li>Determinar las consecuencias funcionales de la mutación.</li></ol>
<h3>Paso 1 · Modos de herencia</h3>
<table class="tbl"><tr><th>Modo</th><th>Rasgos para reconocerlo</th></tr>
<tr><td>Autosómico recesivo (AR)</td><td>Enfermo solo si ambas copias están mutadas; portadores heterocigotos suelen ser normales; varones:mujeres ~1:1; 1/4 de los hijos de dos portadores afectados.</td></tr>
<tr><td>Autosómico dominante (AD)</td><td>Una copia basta; varias generaciones afectadas (no se salta); igual probabilidad en ambos sexos; homocigotos más graves.</td></tr>
<tr><td>ADN mitocondrial</td><td>Transmisión materna; los padres afectados no transmiten; muchas proteínas mitocondriales son codificadas por el núcleo.</td></tr>
<tr><td>Anomalías cromosómicas</td><td>Visibles por citogenética: número (poliploidía, aneuploidía) o estructura (translocaciones, deleciones, inversiones, duplicaciones). Hacer cariotipo antes del mapeo.</td></tr></table>
<div class="grid3" data-modes="1"></div>
<ul><li><b>Influenciado/limitado por el sexo</b>: genes autosómicos con distinta frecuencia o síntomas según el sexo.</li>
<li><b>Penetrancia</b>: proporción de personas con el genotipo que desarrollan la enfermedad (completa o incompleta; puede depender de la edad).</li>
<li><b>Expresividad variable</b>: distinta gravedad entre pacientes, incluso con la misma mutación.</li></ul>
<p><b>Cariotipo</b>: 5 mL de sangre venosa → fitohemaglutinina y medio de cultivo → 37 °C por 3 días → colchicina y solución hipotónica → fijación → extendido en lámina → tripsina y Giemsa → análisis de metafases.</p>
<h3>Paso 2 · Marcadores y mapeo</h3>
<table class="tbl"><tr><th>Marcador</th><th>Características</th></tr>
<tr><td>SSR (repeticiones de secuencias simples, STR)</td><td>Repeticiones en tándem cortas (di y tetranucleótidos), ampliamente distribuidas; primera opción en análisis forense.</td></tr>
<tr><td>SNP</td><td>Extremadamente comunes; menor tasa de mutación que los SSR; se genotipan por electroforesis, microarreglos, espectrometría de masas, citometría de flujo.</td></tr></table>
<ul><li><b>Análisis de ligamiento</b> (familia): copias de la región con el gen se heredan junto con la enfermedad; los afectados comparten alelos de marcadores cercanos.</li>
<li><b>Mapeo de poblaciones</b>: segmentos compartidos por descendencia idéntica (IBD) en pacientes de una sola población (todos son parientes lejanos).</li>
<li><b>Mapeo fino</b>: más pacientes y/o marcadores para refinar la ubicación.</li></ul>
<div data-haplo-example="1"></div>
<h3>Pasos 3–4 · Genes candidatos y mutaciones</h3>
<p>Buscar genes de la región en Ensembl, UCSC, NCBI; predecir genes con programas; evaluar por homología con proteínas de función conocida.</p>
<table class="tbl"><tr><th>Categoría</th><th>Tipo</th></tr>
<tr><td>Cambio de un par de bases</td><td>Missense (aminoácido alterado), nonsense (codón stop), splicing, regulatoria</td></tr>
<tr><td>Deleción</td><td>Frameshift, in-frame (elimina aminoácidos), splicing, regulatoria, deleción génica, microdeleción (genes contiguos)</td></tr>
<tr><td>Inserción (duplicación, expansión)</td><td>Frameshift, in-frame (añade aminoácidos), regulatoria, splicing</td></tr>
<tr><td>Inversión</td><td>Disrupción de la estructura del gen</td></tr>
<tr><td>Cromosómicas</td><td>Cambios de número o estructura</td></tr></table>
<p>Mutaciones <b>deletéreas</b> vs <b>neutras</b>.</p>
{{svg:pointMutations}}
<p><b>Métodos</b>: PCR de la secuencia codificante (ADNg/ADNc) → secuenciación, SSCP, heterodúplex (DHPLC); cariotipo y FISH para cambios de número y grandes reordenamientos (p. ej., fusión BCR-ABL). Hallada la mutación → desarrollar un ensayo específico.</p>
<h3>Paso 5 · Consecuencias funcionales</h3>
<ol><li><b>Transcripción</b>: mutación en promotor/potenciador → altera niveles, tiempo o distribución tisular.</li><li><b>Estabilidad y traducción del ARNm</b>: terminación prematura.</li><li><b>Estabilidad o localización de la proteína</b>: señales de localización, modificación postraduccional.</li><li><b>Función de la proteína</b>: cambio de aminoácidos → función parcial o totalmente destruida.</li></ol>
<p class="muted">Notación de cariotipo vista en clase: 46,XY,t(4;9;19;22) = 46 cromosomas, varón, translocación compleja (leucemia mieloide crónica).</p>`,

    s12: `
<p class="lead">Clase 12 (28/10): variabilidad del genoma, farmacogenética vs farmacogenómica, cómo llevarlo a la clínica (CPIC, PharmGKB, CYP450) y aplicaciones en psiquiatría, trasplante y antirretrovirales.</p>
<h3>Variabilidad del genoma</h3>
<p>Proyecto Genoma Humano: 1.er borrador 2003, completo 2022. Polimorfismos: <b>SNPs</b>, inserciones, deleciones, repeticiones (VNTR, STR), translocaciones. Son comunes, originan variabilidad normal; algunos modifican la estructura o el nivel de expresión de una proteína → consecuencias biológicas → importancia médica.</p>
<p>Causas genéticas de la variabilidad en la respuesta: heterogeneidad genética de la enfermedad + del paciente. "El mismo fármaco + genes diferentes = efectos diferentes". Los factores genéticos <b>permanecen estables toda la vida y son heredables</b>.</p>
<h3>Definiciones</h3>
<table class="tbl"><tr><th>Farmacogenética</th><th>Farmacogenómica</th></tr>
<tr><td>Término de <b>Friedrich Vogel (1959)</b>: papel de la variación genética en la respuesta individual (anestésicos, opiáceos, quimioterápicos). <b>1 gen / 1 variable / 1 paciente</b>.</td><td>Asociación entre las variantes genéticas de los individuos y la respuesta a un tratamiento; genes de enzimas/proteínas que metabolizan, transportan o son receptores de drogas. <b>Muchos genes / muchas variables</b>.</td></tr></table>
<table class="tbl"><tr><th>Modelo tradicional</th><th>Modelo farmacogenómico</th></tr><tr><td>Fármaco elegido por el diagnóstico, a dosis estándar</td><td>Se selecciona al paciente según su perfil genético para una droga y dosis</td></tr></table>
<p><b>Escenario ideal</b>: genotipificación pre-prescripción → droga correcta + dosis correcta → eficacia máxima, toxicidad mínima.</p>
<p><b>GWAS</b>: comparar el genoma de dos poblaciones: mala respuesta (casos) vs buena respuesta (controles) → genes asociados a la variabilidad.</p>
{{svg:pyramid}}
<p><b>CPIC</b>: consorcio internacional que publica pautas de consenso (libres, revisadas por pares, basadas en evidencia, actualizables); comenzó en 2009 entre PharmGKB y PGRN; indexadas en PubMed, respaldadas por ASHP y ASCPT. <b>PharmGKB</b>: recurso que cura el conocimiento sobre el impacto de las variaciones genéticas en la respuesta a medicamentos.</p>
<h3>De la dosis al efecto</h3>
<div class="formula">Dosis → concentración plasmática → efecto terapéutico · reacción adversa · fracaso terapéutico</div>
<h3>Citocromo P450</h3>
<p>Superfamilia responsable del metabolismo oxidativo (fase 1) de compuestos endógenos y xenobióticos. Su expresión hepática varía por factores genéticos, fisiológicos y ambientales; algunos CYP son polimórficos (actividad catalítica alterada). &gt;1 000 genes; 12 importantes en drogas; 6 isoenzimas más representativas (3A4, 2D6, 2C9, 2C19, 1A2, 2E1).</p>
{{svg:cypName}}
<h3>Aplicaciones</h3>
<table class="tbl"><tr><th>Área</th><th>Gen / variante</th><th>Punto clave</th></tr>
<tr><td>Psiquiatría (depresión)</td><td>CYP2D6 (&gt;100 alelos, deleciones y duplicaciones)</td><td>Imipramina, amitriptilina, nortriptilina, venlafaxina, fluoxetina, paroxetina. PM (2 alelos nulos) y IM (1 normal + 1 nulo): bajas dosis; EM (2 funcionales): dosis normales; UM (duplicaciones): altas dosis.</td></tr>
<tr><td>Trasplante</td><td>CYP3A5 (*1 normal; *3 = c.6986A&gt;G, proteína truncada)</td><td>*1/*1 (A/A) normal; *1/*3 (A/G) intermedio; *3/*3 (G/G) lento — tacrolimus.</td></tr>
<tr><td>Antirretrovirales</td><td>Varios marcadores</td><td>Efavirenz → ↑concentración → toxicidad SNC; atazanavir → ↑bilirrubina → síndrome de Gilbert; lopinavir → ↑lípidos → enfermedad cardiovascular; tenofovir → Fanconi incompleto → tubulopatía proximal; abacavir → hipersensibilidad.</td></tr>
<tr><td>Abacavir</td><td>HLA-B*5701</td><td>Factor de riesgo de alta penetrancia; 4–8 % hipersensibilidad en las primeras semanas (fiebre, rash, dolor abdominal, síntomas respiratorios).</td></tr>
<tr><td>Huésped y VIH</td><td>CCR5 Δ32 homocigoto</td><td>Resistencia a la adquisición del VIH-1.</td></tr>
<tr><td>Inhibidores de proteasa</td><td>ABCB1 (transportador)</td><td>Polimorfismos modifican absorción, excreción y toxicidad.</td></tr></table>
<p>Adherencia: con riesgo genético la discontinuación fue mayor (efavirenz 71,2 % vs 28,1 %, p = 0,004; atazanavir/r 62,5 % vs 18,9 %); lopinavir/r 46,5 % vs 33,1 % no fue significativo (p = 0,587).</p>
<table class="tbl"><tr><th>Ventajas</th><th>Limitaciones</th></tr><tr><td>Decisiones informadas y adaptadas; mejores resultados; &gt;eficacia &lt;toxicidad; prevención de EA y ahorro; ensayos de fases III y IV más eficientes</td><td>Médicos con formación pre-genómica; falta de conocimiento para interpretar; pocos laboratorios; acceso limitado del paciente ($, falta de indicación)</td></tr></table>`,

    s13: `
<p class="lead">Clase 13 (04/11): genotipo y fenotipo, variabilidad, medicina personalizada y genotipos farmacogenéticos (fenotipos metabolizadores, ADME, interacciones y lectura de reportes).</p>
<h3>Genotipo, fenotipo y polimorfismo</h3>
<dl class="defs"><dt>Genotipo</dt><dd>Características genéticas definidas por el ADN; no modificables por factores externos.</dd><dt>Fenotipo</dt><dd>Propiedades observables (morfología, fisiología, conducta). Fenotipo = genotipo + medio ambiente.</dd>
<dt>Polimorfismo (Ford, 1966)</dt><dd>Carácter mendeliano monogénico con ≥2 formas en una población, cuyo mantenimiento no depende de la recurrencia de la mutación. De <b>longitud</b> (inserciones/deleciones) o de <b>secuencia</b> (mutación puntual).</dd></dl>
<table class="tbl"><tr><th>Variabilidad</th><th>Distribución</th><th>Características</th></tr>
<tr><td>Somatológica (rasgo morfológico)</td><td>Continua</td><td>Interacciones génicas y ambientales complejas</td></tr>
<tr><td>Proteica</td><td>Discreta</td><td>Solo regiones codificantes; sometida a selección; limitada por la redundancia del código</td></tr>
<tr><td>ADN (polimorfismos)</td><td>Discreta</td><td>Heterocigosidad elevada; caracterización poblacional e individual (forense, clínica)</td></tr></table>
<table class="tbl"><tr><th>Farmacogenética</th><th>Farmacogenómica</th></tr><tr><td>Variaciones hereditarias que afectan la respuesta individual → <b>personalización</b> de tratamientos</td><td>Bases genéticas de la enfermedad para definir nuevas dianas → <b>fármacos más efectivos</b></td></tr></table>
<h3>¿Por qué importa?</h3>
<ul><li>Dosis estándar para la media → <b>20–60 %</b> de tratamientos inadecuados.</li><li>Reacciones adversas (EE. UU.): ~100 000 muertes y ~2 000 000 hospitalizaciones/año; 5 % de ingresos a emergencias; 1 % de muertes en hospitalizados.</li><li>Responden a la dosis recomendada 70–75 %; no responden bien 20–25 % (Alzheimer 30–60 %, asma 40–75 %, depresión 20–40 %, HTA 10–70 %, esquizofrenia 25–75 %); admisiones por reacciones adversas 5–10 %.</li>
<li>Un único análisis genético sirve toda la vida (recién nacido → vejez). Medicina basada en protocolos = tratamiento de la enfermedad; personalizada = tratamiento del enfermo.</li></ul>
<h3>Fenotipos metabolizadores</h3>
{{svg:metabolizers}}
<table class="tbl"><tr><th>Fenotipo</th><th>Genotipo (ejemplo de la clase)</th><th>Genes funcionales</th><th>Con dosis estándar</th><th>Conducta</th></tr>
<tr><td>Normal (NM/EM)</td><td>*1/*1</td><td>2</td><td>Rango terapéutico</td><td>Dosis estándar</td></tr>
<tr><td>Intermedio (IM)</td><td>*1/*2</td><td>1</td><td>Riesgo de niveles altos</td><td>Dosis reducida</td></tr>
<tr><td>Lento (PM)</td><td>*2/*2</td><td>0</td><td>Reacciones adversas</td><td>Alternativa terapéutica</td></tr>
<tr><td>Ultrarrápido (UM)</td><td>*1/*1xN</td><td>3</td><td>No efectivo</td><td>Dosis incrementada</td></tr></table>
<p class="muted">En el esquema de la clase 13, "*2" representa un alelo sin función. En los reportes reales de CYP2D6 los alelos nulos son *3, *4, *5 (deleción) y *6; *1xN es duplicación.</p>
<h3>ADME e interacciones</h3>
<p>Fármaco → <b>A</b>bsorción, <b>D</b>istribución, <b>M</b>etabolismo (fase I y II), <b>E</b>liminación. Fase I (CYP, p. ej. CYP2D6, CYP1A1); fase II (GSTM1, NAT2, UGT1A1, TPMT…); además transportadores (ABCB1, SLC…), receptores (OPRM1, ADRA2A…) y genes "patogénicos" (APOE, AGT…).</p>
{{svg:cypInteractions}}
<p>Factores de riesgo de respuesta variable: enfermedades hepáticas/renales, interacciones farmacológicas, edad, tabaco y alcohol, y factores genéticos (transportadores SLC, ABC, SLCO; enzimas UGT, CYP, NAT; receptores ESR, GPCR, AR).</p>
<h3>Panel y reportes</h3>
<p>Panel de <b>60 genes, 113 SNPs y 3 CNVs</b>: fase I [15], fase II [11], receptores [11], transportadores [13], patogénicos [10].</p>
<table class="tbl"><tr><th>Columna del reporte</th><th>Cómo leerla</th></tr>
<tr><td>GENE SYMBOL / NAME</td><td>CYP2D6 = citocromo P450, familia 2, subfamilia D, miembro 6</td></tr>
<tr><td>LOCUS</td><td>Ubicación cromosómica (p. ej., 22q13.2)</td></tr>
<tr><td>dbSNP</td><td>Identificador del SNP (rs…)</td></tr>
<tr><td>RISK</td><td>Frecuencia del alelo de riesgo, p. ej. 0,39 (C)</td></tr>
<tr><td>POLYMORPHISM</td><td>c.430C&gt;T = posición 430 de la secuencia codificante, C cambia a T; g. = genómica; *2A = alelo</td></tr>
<tr><td>FREQUENCY</td><td>Frecuencia esperada del genotipo del paciente: q², 2pq o p²</td></tr>
<tr><td>RESULT</td><td>Genotipo del paciente y color (verde normal, amarillo/naranja ajuste, rojo cambio)</td></tr></table>
{{svg:chromosome}}
<div class="formula">Con q = frecuencia del alelo de riesgo y p = 1 − q: homocigoto de riesgo = q² · heterocigoto = 2pq · homocigoto sin riesgo = p²<br>Ej. de la clase: CYP1A1 0,39 (C), resultado CC → 0,39² = 15,21 % · AGT 0,30 (T), resultado TC → 2(0,30)(0,70) = 42 %</div>
<h3>Ejemplos destacados</h3>
<table class="tbl"><tr><th>Gen</th><th>Dato de la clase</th></tr>
<tr><td>CYP2D6</td><td>Metaboliza ~25 % de los fármacos prescritos; 7–14 % metabolizadores lentos; ~7 % ultrarrápidos; 35 % portadores de una variante no funcional. Activa profármacos como la codeína (en PM la analgesia se reduce o desaparece).</td></tr>
<tr><td>Tamoxifeno</td><td>CYP2D6 lo activa a endoxifeno. CYP2D6 PM o IM: evitar tamoxifeno, considerar inhibidor de aromatasa; evitar inhibidores de CYP2D6 (paroxetina, fluoxetina, bupropión).</td></tr>
<tr><td>Clopidogrel</td><td>CYP2C19 PM (~15 %) no activa el profármaco → mayor riesgo de trombosis tras stent (2,6 % vs 0,8 %).</td></tr>
<tr><td>CYP1A1</td><td>Inducido por hidrocarburos aromáticos policíclicos del humo de cigarro; riesgo de cáncer de pulmón.</td></tr>
<tr><td>GSTM1/GSTT1</td><td>Detoxificación por conjugación con glutatión; deleciones (*0) reducen la actividad y alteran el riesgo ante tóxicos.</td></tr>
<tr><td>ABCB1</td><td>Glicoproteína P: resistencia a múltiples fármacos en quimioterapia.</td></tr>
<tr><td>APOE</td><td>*4 asociado a Alzheimer; hiperlipoproteinemia tipo III.</td></tr>
<tr><td>VKORC1</td><td>c.-1639G&gt;A: baja actividad del promotor → alta sensibilidad.</td></tr></table>`,

    s14: `
<p class="lead">Clase 14 (11/11): epigenética, metilación del ADN y expresión, terapia farmacoepigenética (epidrogas), respuesta a tratamientos y biomarcadores epigenéticos.</p>
<h3>¿Qué es la epigenética?</h3>
<p>Del griego <i>epi</i> (encima): estudia los <b>cambios heredables que no afectan la secuencia del ADN</b>. El ambiente (carcinógenos, ejercicio, estrés, dieta, tabaco, infecciones, inflamación, medicamentos) activa o inactiva genes; esta activación/inactivación es <b>reversible</b>. Ejemplos: gemelos idénticos con enfermedades distintas; neurona y célula muscular con los mismos genes pero distinta expresión. Relacionada con cáncer, enfermedades neurodegenerativas, obesidad, infecciones.</p>
<p><b>Mecanismos</b>: metilación del ADN · modificaciones de histonas (acetilación, metilación, fosforilación) · ARN no codificantes (miRNA).</p>
<h3>Metilación del ADN</h3>
<ul><li>Sitio CpG: citosina seguida de guanina. Islas CpG: regiones ricas en CpG que forman ~40 % de los promotores de mamíferos.</li>
<li><b>Hipometilación</b> → reactivación génica e inestabilidad cromosómica. <b>Hipermetilación</b> → represión génica e inestabilidad cromosómica.</li></ul>
{{svg:methylSwitch}}
<table class="tbl"><tr><th>Situación</th><th>Consecuencia</th></tr>
<tr><td>Hipometilación de un oncogén</td><td>↑ expresión del oncogén → progresión tumoral</td></tr>
<tr><td>Hipometilación de un supresor tumoral</td><td>↑ expresión del supresor → inhibición de la progresión</td></tr>
<tr><td>Hipermetilación de un supresor (p. ej., BRCA1)</td><td>Silenciamiento → mayor riesgo de cáncer</td></tr></table>
<p><b>Ejercicio práctico</b>: BRCA1 en sangre: paciente con 41/0/43/41/40/43 % de metilación (promedio ≈ 34,7 %) frente a 0/0/5/0/0/0 % (≈ 0,8 %) → la primera tiene mayor riesgo (o podría tener ya cáncer de mama).</p>
<h3>Farmacoepigenética</h3>
<p>Tres áreas → medicina personalizada: <b>terapia farmacoepigenética (epidrogas)</b>, <b>respuesta a tratamientos</b> y <b>biomarcadores epigenéticos</b>. Epidroga: molécula pequeña inhibidora que modifica el epigenoma o actúa sobre enzimas con actividad epigenética.</p>
<table class="tbl"><tr><th>Generación</th><th>Características</th></tr><tr><td>1</td><td>Pobre sensibilidad, mala farmacocinética, poca especificidad</td></tr><tr><td>2</td><td>Fuerte investigación; menos efectos secundarios, mayor efecto, mejor farmacocinética</td></tr><tr><td>3</td><td>Alta especificidad</td></tr></table>
<table class="tbl"><tr><th>Clase</th><th>Fármacos</th><th>Indicación / estado</th></tr>
<tr><td>Inhibidores de DNMT (metilación del ADN): se intercalan en el ADN e impiden la metilación de CpG; problemas de estabilidad y selectividad</td><td>5-azacitidina, 5-aza-2′-desoxicitidina (1.ª gen., FDA); guadecitabina (2.ª gen.)</td><td>Síndrome mielodisplásico; guadecitabina: fase II en leucemia mieloide aguda</td></tr>
<tr><td>Inhibidores de HDAC (histonas)</td><td>Vorinostat (SAHA, pan), romidepsina (clase I), belinostat (pan), panobinostat (pan), tucidinostat (1/2/3/10)</td><td>Linfoma cutáneo de células T (vorinostat, romidepsina); linfoma periférico de células T (belinostat, tucidinostat); mieloma múltiple (panobinostat). Más activos combinados con DNMTi</td></tr>
<tr><td>Inhibidores de HMT (histonas)</td><td>Tazemetostat (EZH2, FDA); valemetostat (EZH1/2); EPZ-5676 (DOT1L)</td><td>Sarcoma epitelioide; los otros en ensayos (leucemias, linfomas, próstata, pulmón)</td></tr></table>
<p><b>Terapia combinada</b>: DNMTi/HDACi + quimio/radioterapia (vorinostat + capecitabina + cisplatino en cáncer gástrico no operable; vorinostat + radioterapia pélvica; panobinostat + bicalutamida en cáncer de próstata resistente a la castración) o + inmunoterapia. Ensayos en enfermedades cardiovasculares y neurodegenerativas (HDAC clase I: ácido valproico, SAHA, butirato de sodio; SIRT1: resveratrol; SIRT1-7: nicotinamida; p300/CBP: curcumina; HMTs: S-adenosilmetionina; miRNAs: memantina).</p>
<p><b>Dificultades</b>: inespecificidad (→ toxicidad) y farmacocinética.</p>
<h3>Respuesta a tratamientos</h3>
<p>La epigenética modula absorción, distribución, metabolismo y excreción → efectos secundarios o resistencia/baja respuesta.</p>
<table class="tbl"><tr><th>Enzima</th><th>Regulación epigenética (clase 14)</th></tr>
<tr><td>Fase I (forma, modifica o elimina un grupo funcional: oxidación, reducción, hidrólisis)</td><td>Los CYP dependen de polimorfismos genéticos y de cambios epigenéticos</td></tr>
<tr><td>CYP1 (activa hidrocarburos aromáticos policíclicos)</td><td>miRNA-18b y miRNA-20b regulan CYP1A; CYP1A2 metaboliza estrógenos, glucocorticoides e interferón</td></tr>
<tr><td>CYP1B1</td><td>miRNA-27b; convierte estradiol en 4-hidroxiestradiol</td></tr>
<tr><td>CYP2D6 y CYP2C19</td><td>Su grado de metilación varía mucho entre individuos con hígado normal → podría explicar la variación en la actividad metabolizadora</td></tr>
<tr><td>Fase II (conjugación con ácido glucurónico, glutatión)</td><td>GSTP1 regulada por miRNA-194; NAT1 asociada a resistencia al tamoxifeno</td></tr></table>
<h3>Biomarcadores epigenéticos</h3>
<ul><li>Metilación del ADN, miRNA e histonas como biomarcadores (miles de publicaciones).</li>
<li><b>Reloj epigenético</b>: metilación de una serie de sitios CpG → edad. Información cronológica (edad forense) y biológica (fenotipo de edad, enfermedades).</li>
<li><b>Metilación global</b>: aumenta con el riesgo cardiovascular; disminuye en enfermedades neurodegenerativas y en distintos cánceres (cabeza y cuello, pulmón).</li>
<li>Bases web: HEDDS (experimentos epigenéticos, diana-enfermedad), HIstome2 (histonas y 127 epidrogas), dbEM (54 drogas contra proteínas epigenéticas).</li></ul>`
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = { THEORY };
  else root.THEORY = THEORY;
})(typeof window !== 'undefined' ? window : globalThis);
