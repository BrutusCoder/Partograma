Com os **dois PDFs anexados** (seu material e o **WHO Labour Care Guide – User’s Manual (2020)**), dá para transformar o “novo partograma” em **regras de negócio** bem objetivas para uma aplicação web.

A base do LCG é um ciclo obrigatório: **Avaliar → Registrar → Checar “Alert” (limiar de referência) → Planejar**. O sistema deve “forçar” esse ciclo (sem engessar a clínica).

A seguir, item por item (Seções 1 a 7), com **campos obrigatórios**, **validações**, **limiares (Alert)** e **ações de sistema** (triggers).  
Fonte: manual oficial do LCG (OMS, 2020).

**Regras globais (aplicam a todo o LCG)**

**Escopo de uso e início do formulário**

- **RG-1 (Início do LCG):** o LCG deve ser iniciado quando a mulher entra na **fase ativa do 1º período**, definida no manual como **≥ 5 cm de dilatação**.
    - **Obrigatório capturar:** activeLabourDiagnosisDate (data; idealmente data/hora).
- **RG-2 (Eixo de tempo):** todo registro clínico nas seções 2–7 deve ter **timestamp** (recordedAt) e estar associado ao eixo de tempo do LCG.
- **RG-3 (Janela máxima do formulário):** se o trabalho de parto **exceder 12 horas** desde o início do LCG, o manual orienta **continuar em um novo LCG**.
    - Regra de sistema: ao atingir 12h, **bloquear novas colunas** e oferecer ação “Abrir novo LCG mantendo vínculo do caso”.
- **RG-4 (Alert é limiar, não diagnóstico):** qualquer observação que atinja critério de “Alert” deve ser **marcada** e deve gerar tarefa: “**Notificar profissional sênior** + registrar avaliação/ação”.
    - Regra de sistema: criar **evento de alerta** com log: quem, quando, qual item, valor, e plano.
- **RG-5 (Nomenclatura):** campos não numéricos devem usar **valores codificados** (ex.: N/Y, SP etc.) para padronizar dados e permitir auditoria.
- **RG-6 (Auditoria):** toda alteração posterior em um registro deve manter **histórico (versionamento)**: valor antigo, novo, autor, data/hora, motivo.

**Seção 1 — Identificação e características do TP na admissão**

Campos (não é série temporal; é “cabeçalho” do episódio).

**1.1 Nome (Name)**

- **Obrigatório:** patientName (ou identificador único do prontuário).
- **Validação:** não permitir vazio.

**1.2 Paridade (Parity)**

- **Obrigatório:** parity (inteiro).
- **Validação:** parity >= 0.
- **Observação de produto:** pode ser “paridade” simples; se o serviço quiser GTPAL, vira customização.

**1.3 Rotura de membranas (Ruptured membranes \[Date: Time\])**

- **Obrigatório:** membranesStatus (enum: INTACT, RUPTURED, UNKNOWN)
- **Condicional obrigatório:** se RUPTURED, exigir ruptureDate e ruptureTime (ou rupturedAt).
- **Validação:** rupturedAt <= now.

**1.4 Início do trabalho de parto (Labour onset)**

- **Obrigatório:** labourOnsetType (enum conforme manual: **espontâneo** vs **induzido**; e pode existir “aumentado/augmentado” como evento, mas onset é a origem).
- **Regra de consistência:** se INDUCED, recomenda-se campo extra: método (misoprostol/ocitocina/amniorrexe etc.) como dado local.

**1.5 Diagnóstico de fase ativa (Active labour diagnosis \[Date\])**

- **Obrigatório:** activeLabourDiagnosisDate (data) e **recomendável** activeLabourDiagnosisTime.
- **Regra:** não permitir iniciar seção 2–7 sem este campo preenchido.

**1.6 Fatores de risco (Risk factors)**

- **Obrigatório (pelo menos uma opção):** riskFactors (lista; pode ser “Nenhum”).
- **Regra de negócio:** se houver qualquer fator de risco selecionado, o sistema deve:
    - **elevar a vigilância** (ex.: encurtar intervalos sugeridos no UI)
    - **marcar o caso** como “não baixo risco” (sem impedir uso do LCG).

**Seção 2 — Cuidados de suporte (Supportive care)**

É série temporal. Cada coluna/linha é uma observação em um tempo.

O manual mostra “Alert column” com **N** para Companion/Pain relief/Oral fluid e **SP** para Posture, ou seja: o “alerta” aqui é **ausência de suporte**.

**2.1 Acompanhante (Companion)**

- **Campo:** companionPresent (enum: Y, N)
- **Obrigatório por registro:** sim (seção 2 deve ser preenchida em cada “rodada”).
- **Alert:** se N → **ALERTA**.
- **Ação sugerida (sistema):** criar plano rápido:
    - “Oferecer acompanhante escolhido, se desejado e permitido”
    - registrar motivo se não possível (campo barrierReason).

**2.2 Alívio da dor (Pain relief)**

- **Campo:** painReliefProvided (enum: Y, N)
- **Alert:** se N → **ALERTA** (não é “obrigar analgesia”; é checar oferta/necessidade).
- **Regras úteis para app:**
    - Se N, exigir mini-campo: painReliefOffered (Y/N) e womanDeclined (Y/N) para diferenciar “não ofertado” de “não desejado”.

**2.3 Líquidos via oral (Oral fluid)**

- **Campo:** oralFluidEncouragedOrTaken (enum: Y, N)
- **Alert:** se N → **ALERTA**.

**2.4 Postura/posição (Posture)**

- **Campo:** posture (enum; o manual usa **SP** como referência/alerta, mas no produto vale ter lista: SUPINE, UPRIGHT, LATERAL, SQUATTING, KNEELING, OTHER)
- **Alert (manual):** **SP** (interpretação prática: posição supina como “sinal para intervir no cuidado de suporte”).
- **Regra de consistência:** se posture=OTHER, exigir descrição curta.

**Seção 3 — Cuidados com o bebê (Baby)**

Série temporal.

**3.1 Linha de base da FCF (Baseline FHR)**

- **Campo:** fhrBaseline (inteiro, bpm)
- **Obrigatório:** sim
- **Alert (manual):** <110 ou ≥160
- **Validação:** intervalo plausível (ex.: 50–220 bpm); fora disso exigir confirmação.

**3.2 Desaceleração de FCF (FHR deceleration)**

- **Campo:** fhrDeceleration (enum padronizado; mínimo: NONE, PRESENT, UNKNOWN)
- **Regra de negócio:** se PRESENT, exigir tipo/detalhe conforme protocolo local (ex.: precoce/tardia/variável/prolongada) ou pelo menos um campo “descrição”.

**3.3 Líquido amniótico (Amniotic fluid)**

- **Campo:** amnioticFluid (enum)
- **Alert (manual):** M+++ (mecônio espesso) e B (blood).
- **Sugestão de modelagem:**
    - CLEAR
    - MECONIUM_LIGHT (M+)
    - MECONIUM_MODERATE (M++)
    - MECONIUM_THICK (M+++)
    - BLOOD (B)
    - UNKNOWN
- **Regra:** se MECONIUM_THICK ou BLOOD → **ALERTA**.

**3.4 Posição fetal (Fetal position)**

- **Campo:** fetalPosition (enum)
- **Alert (manual):** P e T (tipicamente **posterior** e **transversa** como desfavoráveis).
- **Regra:** se POSTERIOR ou TRANSVERSE → **ALERTA** + sugerir no plano: mudanças posturais, reavaliação, etc. (sem prescrever conduta).

**3.5 Bossa (Caput)**

- **Campo:** caput (escala ordinal: 0, +, ++, +++)
- **Alert (manual):** +++
- **Regra:** se +++ → **ALERTA**.

**3.6 Cavalgamento (Moulding)**

- **Campo:** moulding (escala ordinal: 0, +, ++, +++)
- **Alert (manual):** +++
- **Regra:** se +++ → **ALERTA**.

**Seção 4 — Cuidados com a mulher (Woman)**

Série temporal.

**4.1 Pulso (Pulse)**

- **Campo:** maternalPulse (bpm)
- **Alert (manual):** <60 ou ≥120
- **Regra:** ao alertar, abrir checklist: dor? febre? sangramento? ansiedade? fármacos?

**4.2 PA sistólica (Systolic BP)**

- **Campo:** sbp (mmHg)
- **Alert (manual):** <80 ou ≥140
- **Validação:** 40–250.

**4.3 PA diastólica (Diastolic BP)**

- **Campo:** dbp (mmHg)
- **Alert (manual):** ≥90

**4.4 Temperatura (Temperature °C)**

- **Campo:** temperatureC
- **Alert (manual):** <35.0 ou ≥37.5
- **Regra:** se febre/hipotermia → alerta e plano guiado (investigar infecção, medidas, etc.).

**4.5 Urina (Urine)**

- **Campo:** urineFindings (lista/enum)
- **Alert (manual):** P++ (proteinúria ≥++) e A++ (acetona/cetonúria ≥++)
- **Modelagem recomendada:**
    - protein: NEG/TRACE/+/++/+++
    - ketones: NEG/TRACE/+/++/+++
- **Regra:** se protein ≥ ++ ou ketones ≥ ++ → **ALERTA**.

**Seção 5 — Progresso do trabalho de parto (Labour progress)**

Série temporal (e a “espinha dorsal” do LCG).  
Aqui o LCG não usa “linha de alerta/ação” clássica; ele usa **limiares por dilatação**, expressos como **tempo mínimo esperado para progredir 1 cm** (coluna “Alert”).

**5.1 Contrações em 10 minutos (Contractions per 10 min)**

- **Campo:** contractionsPer10Min (inteiro)
- **Alert (manual):** ≤2 ou >5
- **Validação:** 0–10.

**5.2 Duração das contrações (Duration of contractions)**

- **Campo:** contractionDurationSec (inteiro/intervalo)
- **Alert (manual):** &lt;20 ou &gt;60 segundos
- **Regra:** se >60 e/ou >5/10min, especialmente com ocitocina, o sistema deve realçar risco de hiperestimulação (como aviso).

**5.3 Dilatação (Cervix – plot X)**

- **Campo:** cervicalDilationCm (0–10; com decimais opcionais)
- **Obrigatório:** sim nos momentos de toque.
- **Alert por “tempo sem progressão” (manual, por dilatação):**
    - **5 cm:** se demora ≥ 6h para ir a 6 cm → **ALERTA**
    - **6 cm:** ≥ 5h
    - **7 cm:** ≥ 3h
    - **8 cm:** ≥ 2.5h
    - **9 cm:** ≥ 2h
- **Regra de sistema (crítica):** ao registrar uma dilatação, o app deve:
    - localizar o **último registro de dilatação** (anterior)
    - calcular deltaCm e deltaTime
    - se deltaCm &lt; 1 e deltaTime &gt;= threshold(currentCm) → gerar **ALERTA de progressão**
    - exigir preenchimento imediato em Seção 7: **avaliação e plano** (justificativa/ação).

Isso é a “regra de negócio” que substitui o antigo “1 cm/h + linha de ação”.

**5.4 Descida (Descent – plot O)**

- **Campo:** descentStation (escala definida localmente; ou 0–5 como no formulário)
- **Obrigatório:** sempre que houver toque.
- **Regra:** se não há descida ao longo do tempo + caput/moulding aumentam → sinalizar “possível obstrução/desproporção” como **alerta clínico assistido** (não automático).

**Seção 6 — Medicação (Medication)**

Série temporal.

**6.1 Ocitocina (Oxytocin (U/L, drops/min))**

- **Campos obrigatórios quando usada:**
    - oxytocinUsed (Y/N)
    - se Y: oxytocinConcentrationUperL, dropsPerMin (ou mUI/min conforme bomba)
- **Regra de segurança:** se ocitocina = Y, o sistema deve exigir preenchimento sincronizado de:
    - contrações (5.1 e 5.2)
    - FCF (3.1 e/ou 3.2)
    - porque são os “parâmetros de vigilância” de risco.

**6.2 Outros medicamentos (Medicine)**

- **Campo:** medications\[\] (nome + dose + via + horário)
- **Obrigatório:** pelo menos “N” (nenhum) ou lista preenchida.
- **Regra:** padronizar catálogo local, mas permitir texto livre com auditoria.

**6.3 Fluidos EV (IV fluids)**

- **Campo:** ivFluids (tipo + volume + taxa + horário) ou N.
- **Regra:** quando houver PA alterada ou febre, sugerir revisão do plano (sem automatizar).

**Seção 7 — Tomada de decisão compartilhada (Shared decision-making)**

Série temporal (a cada rodada, ou pelo menos sempre que houver alerta).

**7.1 Avaliação (Assessment)**

- **Obrigatório:** texto estruturado curto (ou campos estruturados + texto).
- **Regra:** quando qualquer item em 2–6 gerar **ALERTA**, esta seção vira **obrigatória** para salvar o “ciclo”.
- Sugestão de estrutura:
    - maternalStatus: ok/concerns + descrição
    - fetalStatus: ok/concerns + descrição
    - progressStatus: adequado/lento/indeterminado + evidências

**7.2 Plano (Plan)**

- **Obrigatório:** sim (mínimo 1 ação/conduta/conduta expectante + tempo de reavaliação).
- **Regra:** exigir campo reassessmentTime (ex.: “reavaliar em 1h” ou timestamp alvo).

**7.3 Iniciais/Responsável (Initials)**

- **Obrigatório:** recordedBy (usuário autenticado) + initials (se o serviço exigir).
- **Regra:** trilha de auditoria forte.

**Regras de UI/UX e dados (para a aplicação web “funcionar na prática”)**

- **UX-1 (Entrada rápida):** suporte a “rodadas” (um botão “Nova avaliação agora”) que abre Seções 2–7 com o mesmo timestamp.
- **UX-2 (Alertas visuais):** quando um valor atingir “Alert”, o sistema:
    - destaca em vermelho
    - cria uma tarefa “notificar sênior”
    - Chamar a IA \[Configurada\] \[Gemini, Grook ou outra\], para sugerir o plano de alerta.
    - Abre modal da Seção 7 para completar avaliação/plano \[tranzendo a sugestão da IA\].
- **UX-3 (Continuar além de 12h):** wizard de “novo LCG” com:
    - copiar cabeçalho (Seção 1)
    - manter histórico encadeado.
- **DATA-1 (Padronização):** enums e escalas (caput/moulding, meconium) devem ser padronizados para permitir relatórios.
- **DATA-2 (Confiabilidade legal):** registros só podem ser “corrigidos” com **adendo**, nunca sobrescrever sem log.