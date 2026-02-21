## Documento de Requisitos para Aplicação Web de Partograma (WHO Labour Care Guide - LCG 2020)

**Versão:** 1.0  
**Data:** 23 de Maio de 2024  
**Autor:** Sistema de Geração de Documentos

### 1\. Visão Geral e Objetivos

Este documento detalha os requisitos para o desenvolvimento de uma aplicação web de Partograma, baseada nas diretrizes do **WHO Labour Care Guide (LCG) 2020**. O objetivo principal é fornecer uma ferramenta digital que auxilie profissionais de saúde (médicos e enfermeiros obstetras) no monitoramento do trabalho de parto, promovendo um cuidado centrado na mulher, baseado em evidências e com tomada de decisão compartilhada.

**Objetivos Específicos:**

- Digitalizar o registro do LCG, eliminando formulários em papel.
- Facilitar o acompanhamento longitudinal do trabalho de parto.
- Implementar as regras de negócio e os limiares de alerta do LCG 2020.
- Promover a detecção precoce de desvios da normalidade e a intervenção oportuna.
- Suportar a tomada de decisão compartilhada entre a equipe e a mulher.
- Garantir a segurança dos dados e a conformidade com a LGPD.
- Fornecer trilha de auditoria completa para todos os registros e alterações.
- Permitir a exportação de dados para relatórios e análises.

### 2\. Escopo

2.1. In-Scope (Dentro do Escopo)

- Registro e acompanhamento do LCG: Implementação completa das 7 seções do LCG 2020.
- Gerenciamento de Episódios de Parto: Criação, visualização e encerramento de episódios de trabalho de parto para cada mulher.
- Registro de Observações: Capacidade de registrar múltiplas rodadas de observações ao longo do tempo.
- Sistema de Alertas: Notificações visuais e funcionais baseadas nos limiares do LCG.
- Registro de Planos de Cuidados: Documentação das avaliações e planos de ação.
- Gerenciamento de Usuários e Permissões (RBAC): Controle de acesso baseado em perfis.
- Exportação de Dados: Geração de relatórios em PDF do LCG preenchido.
- Trilha de Auditoria: Registro de todas as ações e alterações no sistema.
- Suporte a Múltiplos LCGs: Gerenciamento de casos que excedem 12 horas e requerem um novo formulário LCG.
- Interface Responsiva: Acesso via navegadores web em diferentes dispositivos.

  2.2. Out-of-Scope (Fora do Escopo)

- Prontuário Eletrônico Completo (PEP): A aplicação não substituirá um PEP completo, focando apenas no módulo de Partograma. Integrações com PEPs existentes podem ser consideradas em fases futuras.
- Gerenciamento de Agendamentos: Não haverá funcionalidade de agendamento de consultas ou procedimentos.
- Faturamento/Cobrança: Não haverá módulo financeiro.
- Telemedicina/Monitoramento Remoto: Não será implementado monitoramento de pacientes à distância.
- Integração com Dispositivos Médicos: Não haverá integração direta com monitores fetais, bombas de infusão, etc.
- Módulo de Pesquisa Clínica Avançada: Relatórios e análises complexas além da exportação básica do LCG.

### 3\. Personas e Perfis de Usuário

A aplicação terá um sistema de controle de acesso baseado em funções (RBAC - Role-Based Access Control) com os seguintes perfis:

3.1. Enfermeiro Obstetra (EO)

- Persona: Ana, 32 anos, enfermeira com 5 anos de experiência em centro obstétrico. Responsável pelo acompanhamento direto da mulher em trabalho de parto.
- Permissões:Criar e iniciar novos Episódios de Parto.
- Criar e iniciar novos LCGs dentro de um Episódio.
- Registrar todas as observações nas Seções 1 a 7 do LCG.
- Visualizar todos os LCGs e Episódios.
- Registrar planos de cuidados e avaliações.
- Exportar LCGs para PDF.
- Não pode alterar registros de outros usuários após salvos (apenas adendos).
- Não pode gerenciar usuários.

  3.2. Médico Obstetra (MO)

- Persona: Dr. Carlos, 45 anos, médico obstetra com 15 anos de experiência. Responsável pela supervisão clínica e tomada de decisões médicas.
- Permissões:Todas as permissões do Enfermeiro Obstetra.
- Visualizar e registrar em todos os LCGs e Episódios.
- Validar e assinar digitalmente (se implementado em fase futura) planos de cuidados.
- Não pode gerenciar usuários.

  3.3. Supervisor (SUP)

- Persona: Dra. Helena, 50 anos, chefe da equipe de enfermagem obstétrica. Responsável pela gestão da equipe e qualidade do cuidado.
- Permissões:Todas as permissões do Enfermeiro Obstetra e Médico Obstetra.
- Visualizar relatórios de desempenho da equipe (se implementado em fase futura).
- Acessar trilhas de auditoria para fins de revisão.
- Não pode gerenciar usuários.

  3.4. Auditor (AUD)

- Persona: Marcos, 38 anos, profissional de auditoria hospitalar. Responsável pela conformidade e qualidade dos registros.
- Permissões:Visualizar todos os LCGs, Episódios e trilhas de auditoria.
- Não pode criar, editar ou excluir registros.
- Exportar dados para análise.

  3.5. Administrador (ADM)

- Persona: Sofia, 30 anos, analista de sistemas. Responsável pela manutenção e configuração do sistema.
- Permissões:Todas as permissões de visualização.
- Gerenciar usuários (criar, editar, desativar, atribuir perfis).
- Configurar parâmetros do sistema (ex: limiares configuráveis, se houver).
- Acessar logs do sistema.
- Não pode criar ou editar registros clínicos.

### 4\. Fluxos Principais

4.1. Admissão e Início de um Novo Episódio de Parto

1.  Usuário (EO/MO): Acessa a aplicação e seleciona "Novo Episódio de Parto".
2.  Sistema: Apresenta formulário para registro da Seção 1 (Identificação e Características do TP na Admissão).
3.  Usuário: Preenche os campos obrigatórios da Seção 1.
4.  Sistema: Valida os dados e cria um novo Episode no banco de dados.
5.  Usuário: Confirma o início do LCG ao registrar a dilatação de &gt;= 5 cm e a data/hora do diagnóstico de fase ativa.
6.  Sistema: Cria o primeiro LCG (formulário) associado ao Episode e exibe a interface de acompanhamento.

4.2. Registro de uma Rodada de Avaliação (Observações)

1.  Usuário (EO/MO): Seleciona um Episódio de Parto ativo e o LCG correspondente.
2.  Sistema: Exibe a interface do LCG com as seções 2 a 7.
3.  Usuário: Clica em "Nova Rodada de Avaliação" ou seleciona uma coluna de tempo vazia.
4.  Sistema: Abre os campos para registro das observações nas Seções 2 a 7 para o timestamp atual.
5.  Usuário: Preenche os dados relevantes para as Seções 2, 3, 4, 5 e 6.
6.  Sistema: Valida os dados contra as regras de negócio e limiares de alerta.Se houver um ALERTA, o sistema destaca o campo, exibe uma notificação visual e torna obrigatório o preenchimento da Seção 7 (Avaliação e Plano).
7.  Usuário: Preenche a Seção 7 (Avaliação e Plano) se houver alertas ou se desejar registrar um plano.
8.  Sistema: Salva as observações como um novo ObservationSet associado ao LCG, com o timestamp da rodada.

4.3. Gerenciamento de Alertas

1.  Sistema: Detecta um valor que atinge um limiar de alerta (conforme Regras de Negócio).
2.  Sistema: Visualmente, o campo correspondente é destacado (ex: cor vermelha).
3.  Sistema: Uma notificação persistente é exibida na interface do usuário, indicando o alerta.
4.  Sistema: A Seção 7 (Avaliação e Plano) é marcada como obrigatória para o registro atual.
5.  Usuário (EO/MO): Deve preencher a avaliação e o plano de ação na Seção 7, justificando a conduta frente ao alerta.
6.  Sistema: Registra o alerta no histórico do LCG, incluindo o timestamp, o item alertado, o valor, e a referência ao plano de ação.

4.4. Encerramento do LCG e do Episódio de Parto

1.  Usuário (EO/MO): Seleciona a opção "Encerrar LCG" ou "Encerrar Episódio".
2.  Sistema: Solicita a confirmação e o motivo do encerramento (ex: parto vaginal, cesariana, transferência, alta).
3.  Usuário: Confirma o encerramento.
4.  Sistema: Marca o LCG e/ou Episode como encerrado, registrando a data/hora e o motivo.
5.  Sistema: Bloqueia novas edições para o LCG/Episódio encerrado, permitindo apenas visualização e exportação.

4.5. Abertura de Novo LCG após 12 Horas

1.  Sistema: Monitora o activeLabourDiagnosisDate do LCG atual.
2.  Sistema: Se o tempo decorrido desde o activeLabourDiagnosisDate exceder 12 horas, o sistema exibe um aviso.
3.  Sistema: Ao tentar registrar uma nova observação após 12 horas, o sistema bloqueia o registro no LCG atual e sugere a criação de um "Novo LCG Continuado".
4.  Usuário (EO/MO): Seleciona "Criar Novo LCG Continuado".
5.  Sistema: Cria um novo LCG vinculado ao Episode original, copiando os dados da Seção 1 e marcando-o como "LCG Continuado".
6.  Sistema: O novo LCG é iniciado com o timestamp atual, e o acompanhamento prossegue nele.

### 5\. Modelo de Dados

5.1. Entidades Principais

- User: Gerencia os usuários do sistema.id (UUID)
- username (string, único)
- passwordHash (string)
- email (string, único)
- firstName (string)
- lastName (string)
- role (enum: ENFERMEIRO_OBSTETRA, MEDICO_OBSTETRA, SUPERVISOR, AUDITOR, ADMIN)
- isActive (boolean)
- createdAt (timestamp com fuso horário)
- updatedAt (timestamp com fuso horário)
- Episode: Representa um episódio de trabalho de parto para uma mulher.id (UUID)
- patientName (string, obrigatório)
- patientId (string, opcional, ex: CPF/RG/Prontuário)
- age (integer, obrigatório)
- parity (integer, obrigatório, &gt;= 0)
- gestationalAgeWeeks (integer, obrigatório)
- gestationalAgeDays (integer, obrigatório, 0-6)
- riskFactors (array de strings/enums, pode ser vazio)
- labourOnsetType (enum: SPONTANEOUS, INDUCED, UNKNOWN, obrigatório)
- ruptureStatus (enum: INTACT, RUPTURED, UNKNOWN, obrigatório)
- ruptureAt (timestamp com fuso horário, condicional se ruptureStatus = RUPTURED)
- activeLabourDiagnosisAt (timestamp com fuso horário, obrigatório para iniciar LCG)
- status (enum: ACTIVE, COMPLETED, ABORTED, TRANSFERRED, OTHER, obrigatório)
- completedAt (timestamp com fuso horário, condicional se status = COMPLETED)
- createdBy (UUID, FK para User.id)
- createdAt (timestamp com fuso horário)
- updatedAt (timestamp com fuso horário)
- LCGForm: Representa uma instância do formulário LCG dentro de um Episode. Um Episode pode ter múltiplos LCGForm se o trabalho de parto exceder 12 horas.id (UUID)
- episodeId (UUID, FK para Episode.id, obrigatório)
- formNumber (integer, ex: 1, 2, 3 para LCGs continuados)
- isContinuedForm (boolean, true se for um LCG subsequente ao primeiro)
- startedAt (timestamp com fuso horário, igual a activeLabourDiagnosisAt para o primeiro LCG, ou createdAt para continuados)
- endedAt (timestamp com fuso horário, condicional se encerrado)
- status (enum: ACTIVE, COMPLETED, EXPIRED_12H, obrigatório)
- createdBy (UUID, FK para User.id)
- createdAt (timestamp com fuso horário)
- updatedAt (timestamp com fuso horário)
- ObservationSet: Representa uma rodada de observações registradas em um LCGForm.id (UUID)
- lcgFormId (UUID, FK para LCGForm.id, obrigatório)
- recordedAt (timestamp com fuso horário, obrigatório, único por lcgFormId)
- section2 (JSONB, dados da Seção 2)
- section3 (JSONB, dados da Seção 3)
- section4 (JSONB, dados da Seção 4)
- section5 (JSONB, dados da Seção 5)
- section6 (JSONB, dados da Seção 6)
- section7 (JSONB, dados da Seção 7, condicional se houver alerta)
- hasAlert (boolean, true se qualquer campo desta rodada gerou alerta)
- recordedBy (UUID, FK para User.id, obrigatório)
- createdAt (timestamp com fuso horário)
- updatedAt (timestamp com fuso horário)
- Alert: Registra cada ocorrência de um limiar de alerta atingido.id (UUID)
- observationSetId (UUID, FK para ObservationSet.id, obrigatório)
- lcgFormId (UUID, FK para LCGForm.id)
- alertType (enum: FHR_BASELINE_LOW, FHR_BASELINE_HIGH, AMNIOTIC_FLUID_MECONIUM_THICK, etc.)
- alertValue (string, valor que disparou o alerta)
- alertAt (timestamp com fuso horário, igual a recordedAt do ObservationSet)
- isResolved (boolean, false por padrão, pode ser marcado como resolvido no plano)
- resolvedAt (timestamp com fuso horário, condicional)
- resolvedBy (UUID, FK para User.id, condicional)
- createdBy (UUID, FK para User.id)
- createdAt (timestamp com fuso horário)
- AuditLog: Registra todas as operações de criação, atualização e exclusão.id (UUID)
- entityType (string, ex: Episode, LCGForm, ObservationSet)
- entityId (UUID, ID da entidade afetada)
- operation (enum: CREATE, UPDATE, DELETE, VIEW, EXPORT)
- oldValue (JSONB, opcional, para UPDATE)
- newValue (JSONB, opcional, para CREATE/UPDATE)
- performedBy (UUID, FK para User.id)
- performedAt (timestamp com fuso horário)
- ipAddress (string, opcional)

  5.2. Estratégia de Versionamento e Auditoria

- Imutabilidade de Registros Clínicos: Uma vez que um ObservationSet é salvo, ele não pode ser alterado diretamente.
- Correções via Adendo: Se uma correção for necessária, um novo ObservationSet deve ser criado com o timestamp atual, referenciando o registro anterior e explicando a correção na Seção 7 (Avaliação e Plano). O sistema pode marcar o registro anterior como "corrigido" ou "obsoleto" para fins de visualização, mas o dado original permanece no banco.
- Trilha de Auditoria: Cada operação (criação, visualização, atualização de status, exportação) deve gerar um registro em AuditLog, incluindo o usuário, timestamp, tipo de operação e a entidade afetada. Para atualizações de status (ex: Episode.status), o oldValue e newValue devem ser registrados.

  5.3. Enums (Exemplos)

- Role: ENFERMEIRO_OBSTETRA, MEDICO_OBSTETRA, SUPERVISOR, AUDITOR, ADMIN
- LabourOnsetType: SPONTANEOUS, INDUCED, UNKNOWN
- RuptureStatus: INTACT, RUPTURED, UNKNOWN
- EpisodeStatus: ACTIVE, COMPLETED, ABORTED, TRANSFERRED, OTHER
- LCGFormStatus: ACTIVE, COMPLETED, EXPIRED_12H
- Posture: SUPINE, UPRIGHT, LATERAL, SQUATTING, KNEELING, OTHER
- AmnioticFluid: CLEAR, MECONIUM_LIGHT, MECONIUM_MODERATE, MECONIUM_THICK, BLOOD, UNKNOWN
- FetalPosition: OA, OP, OT, LOA, ROA, LOP, ROP, LOT, ROT, UNKNOWN (Opcional: usar termos mais simples como ANTERIOR, POSTERIOR, TRANSVERSE se o protocolo local preferir)
- CaputMoulding: 0, +, ++, +++
- UrineProtein: NEG, TRACE, +, ++, +++
- UrineKetones: NEG, TRACE, +, ++, +++

### 6\. Regras de Negócio

6.1. Regras Globais

- RG-1 (Início do LCG): Um LCGForm só pode ser iniciado quando a dilatação cervical for &gt;= 5 cm e a data/hora do diagnóstico de fase ativa (activeLabourDiagnosisAt) for registrada.
- RG-2 (Eixo de Tempo): Todo registro de observação (ObservationSet) deve ter um recordedAt (timestamp com fuso horário) que é único para aquele LCGForm. O sistema deve garantir que os registros sejam feitos em ordem cronológica.
- RG-3 (Janela Máxima do LCG): Se o tempo decorrido desde o activeLabourDiagnosisAt do LCGForm atual exceder 12 horas, o sistema deve:Bloquear novos registros no LCGForm atual.
- Sugerir a criação de um novo LCGForm (marcado como isContinuedForm = true) vinculado ao mesmo Episode.
- O novo LCGForm deve copiar os dados da Seção 1 do Episode original.
- RG-4 (Alert é Limiar, Não Diagnóstico): Qualquer observação que atinja um critério de "Alert" (conforme detalhado nas seções abaixo) deve:Ser visualmente destacada na interface.
- Gerar um registro na entidade Alert.
- Tornar obrigatório o preenchimento da Seção 7 (Avaliação e Plano) para aquela rodada de observações.
- RG-5 (Nomenclatura Padronizada): Todos os campos com valores pré-definidos (enums) devem usar os valores codificados para garantir consistência e permitir análise de dados.
- RG-6 (Trilha de Auditoria): Todas as ações de criação, atualização de status, visualização e exportação devem ser registradas na entidade AuditLog.

  6.2. Regras de Negócio por Seção

Seção 2: Cuidados de Suporte (Supportive Care)

- RG-2.1 (Acompanhante):Campo: section2.companionPresent (enum: Y, N).
- Alert: Se companionPresent = N (Ausência de acompanhante).
- RG-2.2 (Alívio da Dor):Campo: section2.painReliefProvided (enum: Y, N).
- Alert: Se painReliefProvided = N (Não foi oferecido/administrado alívio da dor, ou não foi registrado).
- RG-2.3 (Líquidos Via Oral):Campo: section2.oralFluidEncouragedOrTaken (enum: Y, N).
- Alert: Se oralFluidEncouragedOrTaken = N (Não foi encorajado/ingerido líquido oral).
- RG-2.4 (Postura/Posição):Campo: section2.posture (enum: SUPINE, UPRIGHT, LATERAL, SQUATTING, KNEELING, OTHER).
- Alert: Se posture = SUPINE (Posição supina).

Seção 3: Cuidados com o Bebê (Baby)

- RG-3.1 (FCF de Linha de Base):Campo: section3.fhrBaseline (inteiro, bpm).
- Validação: fhrBaseline deve estar entre 50 e 220 bpm.
- Alert: Se fhrBaseline &lt; 110 ou fhrBaseline &gt;= 160.
- RG-3.2 (Desaceleração de FCF):Campo: section3.fhrDeceleration (enum: NONE, PRESENT, UNKNOWN).
- Regra: Se fhrDeceleration = PRESENT, o sistema deve solicitar um campo de texto livre para detalhes ou um enum mais específico (ex: EARLY, LATE, VARIABLE, PROLONGED) se o protocolo local definir.
- RG-3.3 (Líquido Amniótico):Campo: section3.amnioticFluid (enum: CLEAR, MECONIUM_LIGHT, MECONIUM_MODERATE, MECONIUM_THICK, BLOOD, UNKNOWN).
- Alert: Se amnioticFluid = MECONIUM_THICK ou amnioticFluid = BLOOD.
- RG-3.4 (Posição Fetal):Campo: section3.fetalPosition (enum: OA, OP, OT, LOA, ROA, LOP, ROP, LOT, ROT, UNKNOWN).
- Alert: Se fetalPosition indicar posição Posterior (OP, LOP, ROP) ou Transversa (OT, LOT, ROT).
- RG-3.5 (Bossa):Campo: section3.caput (enum: 0, +, ++, +++).
- Alert: Se caput = +++.
- RG-3.6 (Cavalgamento):Campo: section3.moulding (enum: 0, +, ++, +++).
- Alert: Se moulding = +++.

Seção 4: Cuidados com a Mulher (Woman)

- RG-4.1 (Pulso Materno):Campo: section4.maternalPulse (inteiro, bpm).
- Alert: Se maternalPulse &lt; 60 ou maternalPulse &gt;= 120.
- RG-4.2 (PA Sistólica):Campo: section4.sbp (inteiro, mmHg).
- Alert: Se sbp &lt; 80 ou sbp &gt;= 140.
- RG-4.3 (PA Diastólica):Campo: section4.dbp (inteiro, mmHg).
- Alert: Se dbp &gt;= 90.
- RG-4.4 (Temperatura):Campo: section4.temperatureC (decimal, °C).
- Alert: Se temperatureC &lt; 35.0 ou temperatureC &gt;= 37.5.
- RG-4.5 (Urina - Proteína):Campo: section4.urineProtein (enum: NEG, TRACE, +, ++, +++).
- Alert: Se urineProtein = ++ ou urineProtein = +++.
- RG-4.6 (Urina - Cetona):Campo: section4.urineKetones (enum: NEG, TRACE, +, ++, +++).
- Alert: Se urineKetones = ++ ou urineKetones = +++.

Seção 5: Progresso do Trabalho de Parto (Labour Progress)

- RG-5.1 (Contrações em 10 Minutos):Campo: section5.contractionsPer10Min (inteiro).
- Alert: Se contractionsPer10Min &lt;= 2 ou contractionsPer10Min &gt; 5.
- RG-5.2 (Duração das Contrações):Campo: section5.contractionDurationSec (inteiro, segundos).
- Alert: Se contractionDurationSec &lt; 20 ou contractionDurationSec &gt; 60.
- RG-5.3 (Progresso da Dilatação Cervical - Gatilho de Alerta):Campo: section5.cervicalDilationCm (decimal, 0-10).
- Regra de Sistema: O sistema deve comparar a dilatação atual com a última dilatação registrada. Se a dilatação não progredir 1 cm dentro dos seguintes limiares de tempo, um ALERTA deve ser gerado:De 5 cm para 6 cm: deltaTime &gt;= 6 horas.
- De 6 cm para 7 cm: deltaTime &gt;= 5 horas.
- De 7 cm para 8 cm: deltaTime &gt;= 3 horas.
- De 8 cm para 9 cm: deltaTime &gt;= 2.5 horas.
- De 9 cm para 10 cm: deltaTime &gt;= 2 horas.
- Exemplo: Se a mulher estava com 6 cm às 10:00 e às 15:00 ainda está com 6 cm (5 horas sem progredir 1 cm), um alerta é gerado. Se às 15:00 ela estiver com 7 cm, não há alerta.
- RG-5.4 (Descida da Apresentação):Campo: section5.descentStation (inteiro, ex: 0 a 5, ou -3 a +3).
- Regra: A interpretação da descida deve ser feita em conjunto com outros parâmetros (dilatação, contrações, caput/moulding). O sistema pode sugerir um alerta clínico se houver falha de descida persistente com outros sinais de obstrução, mas não é um alerta automático do LCG.

Seção 6: Medicação (Medication)

- RG-6.1 (Ocitocina):Campos: section6.oxytocinUsed (boolean), section6.oxytocinConcentrationUperL (decimal), section6.oxytocinDropsPerMin (inteiro) ou section6.oxytocinMuiPerMin (decimal).
- Regra de Vigilância Obrigatória: Se oxytocinUsed = true, o sistema deve exigir e realçar a importância do registro frequente de:section5.contractionsPer10Min e section5.contractionDurationSec.
- section3.fhrBaseline e section3.fhrDeceleration.
- Alert: Se oxytocinUsed = true e section5.contractionsPer10Min &gt; 5 ou section5.contractionDurationSec &gt; 60 (hiperestimulação).
- RG-6.2 (Outros Medicamentos):Campo: section6.medications (array de objetos: {name: string, dose: string, route: string, administeredAt: timestamp}).
- Regra: Permitir registro de múltiplos medicamentos.
- RG-6.3 (Fluidos EV):Campo: section6.ivFluids (array de objetos: {type: string, volumeMl: integer, rateMlPerHour: integer, startedAt: timestamp, endedAt: timestamp}).
- Regra: Permitir registro de múltiplos fluidos.

Seção 7: Tomada de Decisão Compartilhada (Shared Decision-Making)

- RG-7.1 (Avaliação e Plano Obrigatórios):Campos: section7.assessment (texto livre), section7.plan (texto livre), section7.reassessmentTime (timestamp com fuso horário).
- Obrigatório: Esta seção é obrigatória para ser preenchida e salva em um ObservationSet sempre que qualquer item nas Seções 2 a 6 gerar um ALERTA.
- Regra: O campo section7.reassessmentTime é obrigatório para garantir que o plano inclua um prazo para reavaliação.
- RG-7.2 (Registro do Responsável):Campo: section7.recordedBy (UUID, FK para User.id).
- Obrigatório: O sistema deve registrar automaticamente o usuário logado.

### 7\. Requisitos Funcionais

7.1. Módulo de Autenticação e Autorização

- RF-AUTH-001: O sistema deve permitir que usuários se autentiquem com username e password.
- RF-AUTH-002: O sistema deve implementar controle de acesso baseado em funções (RBAC) conforme os perfis definidos na Seção 3.
- RF-AUTH-003: O sistema deve exibir menus e funcionalidades de acordo com as permissões do usuário logado.
- RF-AUTH-004: O sistema deve forçar a troca de senha no primeiro login para novos usuários.
- RF-AUTH-005: O sistema deve ter uma política de senhas fortes (mínimo 8 caracteres, maiúsculas, minúsculas, números, símbolos).

  7.2. Módulo de Gerenciamento de Usuários (Apenas para ADM)

- RF-USER-001: O Administrador deve ser capaz de criar novos usuários, atribuindo username, password inicial e role.
- RF-USER-002: O Administrador deve ser capaz de editar informações de usuários existentes (exceto senha de outros usuários), incluindo role e isActive status.
- RF-USER-003: O Administrador deve ser capaz de desativar usuários, impedindo o login.
- RF-USER-004: O Administrador deve ser capaz de visualizar uma lista de todos os usuários e seus perfis.

  7.3. Módulo de Gerenciamento de Episódios de Parto

- RF-EP-001: O usuário (EO/MO) deve ser capaz de criar um novo Episode preenchendo os dados da Seção 1.
- RF-EP-002: O sistema deve exibir uma lista de Episodes ativos, com filtros por nome da paciente, ID, status.
- RF-EP-003: O usuário deve ser capaz de visualizar os detalhes de um Episode existente.
- RF-EP-004: O usuário (EO/MO) deve ser capaz de encerrar um Episode, registrando o motivo e a data/hora.
- RF-EP-005: O sistema deve impedir a criação de novos LCGs em Episodes encerrados.

  7.4. Módulo de Partograma (LCG)

- RF-LCG-001: O usuário (EO/MO) deve ser capaz de iniciar um novo LCGForm dentro de um Episode ativo, registrando a dilatação &gt;= 5 cm e a data/hora do diagnóstico de fase ativa.
- RF-LCG-002: O sistema deve exibir a interface do LCG com as 7 seções organizadas em um formato de grade/tabela temporal.
- RF-LCG-003: O usuário (EO/MO) deve ser capaz de registrar observações em uma nova rodada (coluna de tempo) para as Seções 2 a 7.
- RF-LCG-004: O sistema deve validar os dados inseridos em cada campo conforme as regras de negócio e limiares de alerta.
- RF-LCG-005: O sistema deve destacar visualmente os campos que atingem um limiar de alerta e exibir uma notificação.
- RF-LCG-006: O sistema deve tornar obrigatório o preenchimento da Seção 7 (Avaliação e Plano) sempre que um alerta for disparado.
- RF-LCG-007: O sistema deve calcular e exibir o tempo decorrido desde o início do LCG.
- RF-LCG-008: O sistema deve bloquear novos registros em um LCGForm se 12 horas tiverem decorrido desde seu início e sugerir a criação de um novo LCGForm continuado.
- RF-LCG-009: O usuário (EO/MO) deve ser capaz de criar um LCGForm continuado, que herda os dados da Seção 1 do Episode e mantém o vínculo com o LCG anterior.
- RF-LCG-010: O sistema deve permitir a visualização de LCGs anteriores e continuados dentro de um mesmo Episode.
- RF-LCG-011: O sistema deve permitir a exportação de um LCGForm completo para PDF.
- RF-LCG-012: O sistema deve impedir a edição de ObservationSets após salvos; correções devem ser feitas via novo registro com adendo.

  7.5. Módulo de Alertas

- RF-ALERT-001: O sistema deve registrar todos os alertas disparados na entidade Alert.
- RF-ALERT-002: O sistema deve exibir uma lista de alertas ativos para um LCGForm ou Episode.
- RF-ALERT-003: O sistema deve permitir que um alerta seja marcado como "resolvido" dentro do plano de cuidados da Seção 7.

  7.6. Módulo de Auditoria (Apenas para SUP/AUD/ADM)

- RF-AUDIT-001: O sistema deve registrar todas as operações de criação, atualização de status, visualização e exportação na entidade AuditLog.
- RF-AUDIT-002: O usuário (SUP/AUD/ADM) deve ser capaz de visualizar a trilha de auditoria para qualquer Episode ou LCGForm.
- RF-AUDIT-003: A trilha de auditoria deve incluir: usuário, timestamp, tipo de operação, entidade afetada e, para atualizações, os valores antigos e novos.

### 8\. Requisitos Não Funcionais

- RNF-SEG-001 (Segurança LGPD): Todos os dados pessoais e de saúde devem ser armazenados e processados em conformidade com a Lei Geral de Proteção de Dados (LGPD).Criptografia de dados em repouso e em trânsito (HTTPS).
- Controle de acesso rigoroso (RBAC).
- Anonimização/pseudonimização para fins de análise (se aplicável).
- RNF-SEG-002 (Trilha de Auditoria): O sistema deve manter uma trilha de auditoria completa e inalterável de todas as ações dos usuários e alterações nos dados, conforme detalhado na Seção 5.2.
- RNF-DISP-001 (Disponibilidade): O sistema deve estar disponível 99.5% do tempo (excluindo janelas de manutenção programada).
- RNF-PERF-001 (Performance):O tempo de carregamento de uma página do LCG com até 24 horas de registros não deve exceder 3 segundos.
- O tempo de resposta para operações de salvar/atualizar não deve exceder 1 segundo.
- RNF-PERF-002 (Escalabilidade): A arquitetura do sistema deve ser escalável para suportar um aumento de 50% no número de usuários e episódios de parto sem degradação significativa de performance.
- RNF-LOG-001 (Logs): O sistema deve gerar logs de aplicação detalhados para monitoramento de erros, performance e segurança.
- RNF-INT-001 (Internacionalização): O sistema deve ser desenvolvido com suporte a internacionalização, inicialmente em Português (Brasil), mas preparado para outros idiomas.
- RNF-USAB-001 (Usabilidade): A interface do usuário deve ser intuitiva, responsiva e fácil de usar para profissionais de saúde, minimizando a curva de aprendizado.
- RNF-USAB-002 (Acessibilidade): A interface deve seguir as diretrizes de acessibilidade web (WCAG 2.1 AA) para garantir o uso por pessoas com deficiência.

### 9\. Especificação de API (REST)

9.1. Autenticação e Headers Padrão

- Autenticação: JWT (JSON Web Tokens) ou OAuth2. O token deve ser enviado no header Authorization.
- Headers Padrão:Authorization: Bearer &lt;token&gt;
- Content-Type: application/json (para requests com body)
- Accept: application/json
- X-Timezone: America/Sao_Paulo (ou outro fuso horário do cliente, para consistência de timestamps)

  9.2. Endpoints

  9.2.1. Autenticação

- POST /auth/loginDescrição: Autentica um usuário e retorna um token JWT.
- Request Schema:{ "username": "ana.silva",&lt;br/&gt; "password": "SenhaSegura123!" }
- Response Schema (200 OK):{ "accessToken": "eyJhbGciOiJIUzI1Ni...",&lt;br/&gt; "user": {&lt;br/&gt; "id": "uuid-do-usuario",&lt;br/&gt; "username": "ana.silva",&lt;br/&gt; "firstName": "Ana",&lt;br/&gt; "lastName": "Silva",&lt;br/&gt; "role": "ENFERMEIRO_OBSTETRA" } }
- Códigos de Erro:401 Unauthorized: Credenciais inválidas.
- 400 Bad Request: Payload inválido.

  9.2.2. Usuários (Apenas para ADM)

- GET /usersDescrição: Lista todos os usuários.
- Response Schema (200 OK): \[{id: "...", username: "...", role: "..."}, ...\]
- POST /usersDescrição: Cria um novo usuário.
- Request Schema:{ "username": "novo.user",&lt;br/&gt; "password": "SenhaInicial123",&lt;br/&gt; "firstName": "Novo",&lt;br/&gt; "lastName": "Usuario",&lt;br/&gt; "email": "novo.user@hospital.com",&lt;br/&gt; "role": "ENFERMEIRO_OBSTETRA",&lt;br/&gt; "isActive": true }
- Response Schema (201 Created): {id: "...", username: "...", role: "..."}
- Validações: username único, email válido, role válido.
- PUT /users/{id}Descrição: Atualiza um usuário existente.
- Request Schema: (campos a serem atualizados){ "firstName": "Novo Nome",&lt;br/&gt; "role": "MEDICO_OBSTETRA",&lt;br/&gt; "isActive": false }
- Response Schema (200 OK): {id: "...", username: "...", role: "..."}
- Validações: id existente, role válido.

  9.2.3. Episódios de Parto

- GET /episodesDescrição: Lista episódios de parto. Suporta filtros por status, patientName, patientId.
- Response Schema (200 OK): \[{id: "...", patientName: "...", status: "...", createdAt: "..."}, ...\]
- GET /episodes/{id}Descrição: Retorna detalhes de um episódio de parto, incluindo LCGs associados.
- Response Schema (200 OK):{ "id": "uuid-episode",&lt;br/&gt; "patientName": "Maria da Silva",&lt;br/&gt; "age": 28,&lt;br/&gt; "parity": 1,&lt;br/&gt; "gestationalAgeWeeks": 39,&lt;br/&gt; "gestationalAgeDays": 2,&lt;br/&gt; "riskFactors": \["DIABETES_GESTACIONAL"\],&lt;br/&gt; "labourOnsetType": "SPONTANEOUS",&lt;br/&gt; "ruptureStatus": "INTACT",&lt;br/&gt; "activeLabourDiagnosisAt": "2024-05-23T10:00:00-03:00",&lt;br/&gt; "status": "ACTIVE",&lt;br/&gt; "lcgForms": \[ { "id": "uuid-lcgform-1",&lt;br/&gt; "formNumber": 1,&lt;br/&gt; "startedAt": "2024-05-23T10:00:00-03:00",&lt;br/&gt; "status": "ACTIVE" } \], "createdBy": "uuid-user",&lt;br/&gt; "createdAt": "2024-05-23T09:30:00-03:00" }
- POST /episodesDescrição: Cria um novo episódio de parto (Seção 1).
- Request Schema:{ "patientName": "Maria da Silva",&lt;br/&gt; "patientId": "123.456.789-00",&lt;br/&gt; "age": 28,&lt;br/&gt; "parity": 1,&lt;br/&gt; "gestationalAgeWeeks": 39,&lt;br/&gt; "gestationalAgeDays": 2,&lt;br/&gt; "riskFactors": \["DIABETES_GESTACIONAL", "NENHUM"\],&lt;br/&gt; "labourOnsetType": "SPONTANEOUS",&lt;br/&gt; "ruptureStatus": "INTACT",&lt;br/&gt; "activeLabourDiagnosisAt": "2024-05-23T10:00:00-03:00" }
- Response Schema (201 Created): Retorna o objeto Episode criado.
- Validações: patientName, age, parity, gestationalAgeWeeks, gestationalAgeDays, labourOnsetType, ruptureStatus, activeLabourDiagnosisAt são obrigatórios. parity &gt;= 0. gestationalAgeDays entre 0 e 6. activeLabourDiagnosisAt deve ser no passado ou presente.
- PUT /episodes/{id}/statusDescrição: Atualiza o status de um episódio (ex: encerrar).
- Request Schema:{ "status": "COMPLETED",&lt;br/&gt; "completedAt": "2024-05-23T18:30:00-03:00",&lt;br/&gt; "completionReason": "PARTO_VAGINAL" }
- Response Schema (200 OK): Retorna o objeto Episode atualizado.
- Validações: status válido, completedAt obrigatório se status = COMPLETED.

  9.2.4. LCG (Formulários de Partograma)

- POST /episodes/{episodeId}/lcg-formsDescrição: Inicia um novo LCGForm para um Episode. Usado para o primeiro LCG ou para LCGs continuados após 12h.
- Request Schema:{ "isContinuedForm": false, // true se for um LCG subsequente&lt;br/&gt; "startedAt": "2024-05-23T10:00:00-03:00" // Apenas para o primeiro LCG, deve ser igual a activeLabourDiagnosisAt }
- Response Schema (201 Created): Retorna o objeto LCGForm criado.
- Validações: episodeId deve existir e estar ativo. Se isContinuedForm=false, startedAt deve ser igual a activeLabourDiagnosisAt do Episode. Se isContinuedForm=true, o sistema deve verificar se o LCG anterior excedeu 12h.
- GET /lcg-forms/{id}Descrição: Retorna um LCGForm completo com todas as ObservationSets associadas.
- Response Schema (200 OK):{ "id": "uuid-lcgform-1",&lt;br/&gt; "episodeId": "uuid-episode",&lt;br/&gt; "formNumber": 1,&lt;br/&gt; "isContinuedForm": false,&lt;br/&gt; "startedAt": "2024-05-23T10:00:00-03:00",&lt;br/&gt; "status": "ACTIVE",&lt;br/&gt; "observations": \[ { "id": "uuid-obs-1",&lt;br/&gt; "recordedAt": "2024-05-23T10:30:00-03:00",&lt;br/&gt; "section2": { "companionPresent": "Y", "painReliefProvided": "N", "oralFluidEncouragedOrTaken": "Y", "posture": "UPRIGHT" },&lt;br/&gt; "section3": { "fhrBaseline": 140, "fhrDeceleration": "NONE", "amnioticFluid": "CLEAR", "fetalPosition": "OA", "caput": "0", "moulding": "0" },&lt;br/&gt; "section4": { "maternalPulse": 80, "sbp": 120, "dbp": 70, "temperatureC": 36.8, "urineProtein": "NEG", "urineKetones": "NEG" },&lt;br/&gt; "section5": { "contractionsPer10Min": 3, "contractionDurationSec": 40, "cervicalDilationCm": 5.0, "descentStation": 0 },&lt;br/&gt; "section6": { "oxytocinUsed": false, "medications": \[\], "ivFluids": \[\] },&lt;br/&gt; "hasAlert": false,&lt;br/&gt; "recordedBy": "uuid-user-ana" }, // ... outras observações \] }

  9.2.5. Observações (Rodadas)

- POST /lcg-forms/{lcgFormId}/observationsDescrição: Registra uma nova rodada de observações para um LCGForm.
- Request Schema:{ "recordedAt": "2024-05-23T11:00:00-03:00",&lt;br/&gt; "section2": { "companionPresent": "Y", "painReliefProvided": "Y", "oralFluidEncouragedOrTaken": "Y", "posture": "UPRIGHT" },&lt;br/&gt; "section3": { "fhrBaseline": 135, "fhrDeceleration": "NONE", "amnioticFluid": "CLEAR", "fetalPosition": "OA", "caput": "0", "moulding": "0" },&lt;br/&gt; "section4": { "maternalPulse": 78, "sbp": 118, "dbp": 68, "temperatureC": 36.9, "urineProtein": "NEG", "urineKetones": "NEG" },&lt;br/&gt; "section5": { "contractionsPer10Min": 4, "contractionDurationSec": 45, "cervicalDilationCm": 6.0, "descentStation": 0 },&lt;br/&gt; "section6": { "oxytocinUsed": false, "medications": \[\], "ivFluids": \[\] },&lt;br/&gt; "section7": { // Obrigatório se houver alerta&lt;br/&gt; "assessment": "Progresso adequado, mãe e bebê bem.",&lt;br/&gt; "plan": "Manter acompanhamento, reavaliar em 1 hora.",&lt;br/&gt; "reassessmentTime": "2024-05-23T12:00:00-03:00" } }
- Response Schema (201 Created): Retorna o objeto ObservationSet criado, incluindo hasAlert e quaisquer Alerts gerados.
- Validações:lcgFormId deve existir e estar ativo.
- recordedAt deve ser único para o lcgFormId e posterior ao recordedAt anterior.
- Todos os campos das Seções 2-6 são validados contra suas regras de negócio e limiares de alerta (Seção 6).
- Se qualquer alerta for disparado, section7.assessment, section7.plan, section7.reassessmentTime são obrigatórios.
- RG-5.3 (Progresso Cervical): O sistema deve calcular o tempo desde a última dilatação e disparar alerta se não houver progresso de 1 cm dentro dos limiares definidos.
- RG-6.1 (Ocitocina): Se oxytocinUsed=true, o sistema deve verificar se contractionsPer10Min e fhrBaseline foram registrados na mesma rodada ou em uma rodada muito próxima.

  9.2.6. Exportação

- GET /lcg-forms/{id}/export/pdfDescrição: Exporta um LCGForm completo para um arquivo PDF.
- Response Schema (200 OK): Retorna o arquivo PDF como application/pdf.
- Validações: id deve existir.

  9.2.7. Auditoria (Apenas para SUP/AUD/ADM)

- GET /audit-logsDescrição: Lista registros de auditoria. Suporta filtros por entityType, entityId, performedBy, operation, dateRange.
- Response Schema (200 OK): \[{id: "...", entityType: "...", operation: "...", performedBy: "...", performedAt: "..."}, ...\]

### 10\. Testes de Aceitação (Gherkin)

Cenários de Autenticação e Autorização

- Cenário 1: Login bem-sucedidoDado que um usuário "ana.silva" com perfil "ENFERMEIRO_OBSTETRA" está registrado
- Quando "ana.silva" tenta fazer login com senha correta
- Então o sistema deve retornar um token de acesso e os dados do usuário
- E o usuário deve ter acesso às funcionalidades de Enfermeiro Obstetra
- Cenário 2: Login falho com credenciais inválidasDado que um usuário "ana.silva" está registrado
- Quando "ana.silva" tenta fazer login com senha incorreta
- Então o sistema deve retornar um erro de "Unauthorized" (401)
- Cenário 3: Acesso negado por perfilDado que um usuário "marcos.auditor" com perfil "AUDITOR" está logado
- Quando "marcos.auditor" tenta criar um novo usuário
- Então o sistema deve retornar um erro de "Forbidden" (403)

Cenários de Gerenciamento de Episódios e LCG

- Cenário 4: Criação de um novo Episódio de PartoDado que um Enfermeiro Obstetra está logado
- Quando ele preenche e submete os dados da Seção 1 para uma nova paciente
- Então um novo Episode deve ser criado com status "ACTIVE"
- E o sistema deve exibir o Episode recém-criado na lista de episódios ativos
- Cenário 5: Início de um LCG em fase ativa (RG-1)Dado que um Episode foi criado
- Quando um Enfermeiro Obstetra inicia um LCGForm com cervicalDilationCm = 5.0 e activeLabourDiagnosisAt
- Então um novo LCGForm deve ser criado e associado ao Episode
- E o sistema deve exibir a interface do LCG para registro de observações
- Cenário 6: Encerramento de um Episódio de PartoDado que um Episode está ativo com um LCGForm ativo
- Quando um Médico Obstetra encerra o Episode com motivo "PARTO_VAGINAL"
- Então o Episode e o LCGForm associado devem ter seus status alterados para "COMPLETED"
- E o sistema deve impedir novos registros de observações para este LCG/Episódio

Cenários de Registro de Observações e Alertas

- Cenário 7: Registro de observações sem alertaDado que um LCGForm está ativo
- Quando um Enfermeiro Obstetra registra uma rodada de observações com todos os valores dentro dos limites normais
- Então um novo ObservationSet deve ser criado com hasAlert = false
- E a Seção 7 não deve ser obrigatória
- Cenário 8: Alerta de FCF de linha de base baixa (RG-3.1)Dado que um LCGForm está ativo
- Quando um Enfermeiro Obstetra registra section3.fhrBaseline = 100
- Então o campo fhrBaseline deve ser destacado visualmente
- E um Alert do tipo FHR_BASELINE_LOW deve ser registrado
- E a Seção 7 (Avaliação e Plano) deve se tornar obrigatória para esta rodada
- Cenário 9: Alerta de Líquido Amniótico Meconial Espesso (RG-3.3)Dado que um LCGForm está ativo
- Quando um Enfermeiro Obstetra registra section3.amnioticFluid = MECONIUM_THICK
- Então o campo amnioticFluid deve ser destacado visualmente
- E um Alert do tipo AMNIOTIC_FLUID_MECONIUM_THICK deve ser registrado
- E a Seção 7 (Avaliação e Plano) deve se tornar obrigatória
- Cenário 10: Alerta de Progressão Cervical Lenta (RG-5.3 - 6cm para 7cm)Dado que um LCGForm está ativo
- E a última dilatação registrada foi 6.0 cm às 2024-05-23T10:00:00-03:00
- Quando um Enfermeiro Obstetra registra uma nova observação às 2024-05-23T15:30:00-03:00 com section5.cervicalDilationCm = 6.0
- Então um Alert de progressão cervical lenta deve ser gerado (5.5h sem progredir 1cm de 6cm)
- E a Seção 7 (Avaliação e Plano) deve se tornar obrigatória
- Cenário 11: Registro de Ocitocina e Vigilância (RG-6.1)Dado que um LCGForm está ativo
- Quando um Enfermeiro Obstetra registra section6.oxytocinUsed = true
- Então o sistema deve realçar a importância do registro de contractionsPer10Min, contractionDurationSec e fhrBaseline
- E se contractionsPer10Min &gt; 5 for registrado, um alerta de hiperestimulação deve ser gerado.
- Cenário 12: Preenchimento obrigatório da Seção 7 após alertaDado que um alerta foi disparado em uma rodada de observações
- Quando o Enfermeiro Obstetra tenta salvar a rodada sem preencher section7.assessment
- Então o sistema deve retornar um erro de validação e exigir o preenchimento da Seção 7
- E o recordedAt e reassessmentTime devem ser obrigatórios.

Cenários de Regra das 12 Horas e LCG Continuado

- Cenário 13: Aviso de LCG próximo de 12 horasDado que um LCGForm foi iniciado às 2024-05-23T10:00:00-03:00
- Quando o sistema detecta que o tempo atual é 2024-05-23T21:00:00-03:00 (11h após o início)
- Então o sistema deve exibir um aviso visual de que o LCG está próximo do limite de 12 horas
- Cenário 14: Bloqueio de registro e sugestão de novo LCG após 12 horas (RG-3)Dado que um LCGForm foi iniciado às 2024-05-23T10:00:00-03:00
- Quando um Enfermeiro Obstetra tenta registrar uma nova observação às 2024-05-23T22:30:00-03:00 (12.5h após o início)
- Então o sistema deve bloquear o registro no LCG atual
- E o sistema deve sugerir a criação de um "Novo LCG Continuado"
- Cenário 15: Criação de LCG ContinuadoDado que um LCGForm expirou após 12 horas
- Quando um Enfermeiro Obstetra seleciona "Criar Novo LCG Continuado"
- Então um novo LCGForm deve ser criado, vinculado ao Episode original, com isContinuedForm = true
- E o formNumber deve ser incrementado (ex: de 1 para 2)
- E o novo LCG deve copiar os dados da Seção 1 do Episode

Cenários de Imutabilidade e Auditoria

- Cenário 16: Tentativa de edição de ObservationSet salvoDado que um ObservationSet foi salvo
- Quando um Enfermeiro Obstetra tenta modificar um campo de um ObservationSet salvo
- Então o sistema deve impedir a alteração direta
- E o sistema deve sugerir a criação de um novo registro com adendo, se aplicável
- Cenário 17: Registro de auditoria para criação de EpisodeDado que um Enfermeiro Obstetra cria um novo Episode
- Então um registro em AuditLog deve ser criado com entityType = Episode, operation = CREATE, performedBy o ID do Enfermeiro Obstetra
- Cenário 18: Registro de auditoria para visualização de LCGDado que um Médico Obstetra visualiza um LCGForm
- Então um registro em AuditLog deve ser criado com entityType = LCGForm, operation = VIEW, performedBy o ID do Médico Obstetra
- Cenário 19: Registro de auditoria para atualização de status de EpisodeDado que um Episode está ativo
- Quando um Médico Obstetra altera o status do Episode para "COMPLETED"
- Então um registro em AuditLog deve ser criado com entityType = Episode, operation = UPDATE, oldValue e newValue contendo a mudança de status.

Cenários de Permissões

- Cenário 20: Enfermeiro Obstetra cria LCGDado que um Enfermeiro Obstetra está logado
- Quando ele tenta criar um LCGForm
- Então a operação deve ser bem-sucedida (201 Created)
- Cenário 21: Auditor tenta criar LCGDado que um Auditor está logado
- Quando ele tenta criar um LCGForm
- Então a operação deve ser negada (403 Forbidden)
- Cenário 22: Médico Obstetra visualiza trilha de auditoriaDado que um Médico Obstetra está logado
- Quando ele tenta acessar GET /audit-logs
- Então a operação deve ser negada (403 Forbidden)
- Cenário 23: Supervisor visualiza trilha de auditoriaDado que um Supervisor está logado
- Quando ele tenta acessar GET /audit-logs
- Então a operação deve ser bem-sucedida (200 OK)

Cenários de Validação de Dados

- Cenário 24: Tentativa de registrar FCF fora do intervalo válidoDado que um LCGForm está ativo
- Quando um Enfermeiro Obstetra tenta registrar section3.fhrBaseline = 40
- Então o sistema deve retornar um erro de validação (400 Bad Request) para o campo fhrBaseline
- Cenário 25: Tentativa de registrar dilatação inválidaDado que um LCGForm está ativo
- Quando um Enfermeiro Obstetra tenta registrar section5.cervicalDilationCm = 11.0
- Então o sistema deve retornar um erro de validação (400 Bad Request) para o campo cervicalDilationCm

### 11\. Critérios de Pronto (Definition of Done)

Um item de trabalho (história de usuário, tarefa) será considerado "Pronto" quando:

- O código foi implementado e revisado por pares.
- Todos os testes unitários e de integração relevantes foram criados e passaram.
- Todos os testes de aceitação (Gherkin) para o item foram executados e passaram.
- As regras de negócio associadas foram implementadas e validadas.
- A trilha de auditoria para as operações relevantes foi implementada e testada.
- A documentação técnica (código, API) foi atualizada.
- A funcionalidade foi testada em ambiente de homologação.
- Não há bugs críticos ou de alta prioridade conhecidos.
- A performance e segurança foram consideradas e testadas (se aplicável ao item).
- A funcionalidade atende aos requisitos de usabilidade e acessibilidade.

### 12\. Anexos

12.1. Tabela de Enums e Valores

- Role:ENFERMEIRO_OBSTETRA
- MEDICO_OBSTETRA
- SUPERVISOR
- AUDITOR
- ADMIN
- LabourOnsetType:SPONTANEOUS
- INDUCED
- UNKNOWN
- RuptureStatus:INTACT
- RUPTURED
- UNKNOWN
- EpisodeStatus:ACTIVE
- COMPLETED
- ABORTED
- TRANSFERRED
- OTHER
- LCGFormStatus:ACTIVE
- COMPLETED
- EXPIRED_12H
- Posture:SUPINE
- UPRIGHT
- LATERAL
- SQUATTING
- KNEELING
- OTHER
- AmnioticFluid:CLEAR
- MECONIUM_LIGHT
- MECONIUM_MODERATE
- MECONIUM_THICK
- BLOOD
- UNKNOWN
- FetalPosition:OA (Occipitoanterior)
- OP (Occipitoposterior)
- OT (Occipitotransversa)
- LOA (Occipitoanterior Esquerda)
- ROA (Occipitoanterior Direita)
- LOP (Occipitoposterior Esquerda)
- ROP (Occipitoposterior Direita)
- LOT (Occipitotransversa Esquerda)
- ROT (Occipitotransversa Direita)
- UNKNOWN
- CaputMoulding:0 (Ausente)
- \+ (Leve)
- ++ (Moderado)
- +++ (Grave)
- UrineProtein:NEG (Negativo)
- TRACE (Traços)
- -
- ++
- +++
- UrineKetones:NEG (Negativo)
- TRACE (Traços)
- -
- ++
- +++
- FHRDeceleration:NONE
- PRESENT
- UNKNOWN
- (Opcional: EARLY, LATE, VARIABLE, PROLONGED se o protocolo local detalhar)

  12.2. Tabela de Limiares de Alerta do LCG (OMS 2020)

- Seção 3: Cuidados com o Bebê FCF de Linha de Base: &lt;110 bpm ou ≥160 bpm
- Líquido Amniótico: MECONIUM_THICK (M+++) ou BLOOD (B)
- Posição Fetal: POSTERIOR (P) ou TRANSVERSE (T)
- Bossa: +++
- Cavalgamento: +++
- Seção 4: Cuidados com a MulherPulso Materno: &lt;60 bpm ou ≥120 bpm
- PA Sistólica: &lt;80 mmHg ou ≥140 mmHg
- PA Diastólica: ≥90 mmHg
- Temperatura: &lt;35.0 °C ou ≥37.5 °C
- Urina Proteína: ++ ou +++
- Urina Cetona: ++ ou +++
- Seção 5: Progresso do Trabalho de PartoContrações em 10 Minutos: ≤2 ou &gt;5
- Duração das Contrações: &lt;20 segundos ou &gt;60 segundos
- Progresso da Dilatação Cervical (Tempo para progredir 1 cm):De 5 cm para 6 cm: ≥ 6 horas
- De 6 cm para 7 cm: ≥ 5 horas
- De 7 cm para 8 cm: ≥ 3 horas
- De 8 cm para 9 cm: ≥ 2.5 horas
- De 9 cm para 10 cm: ≥ 2 horas
- Seção 2: Cuidados de Suporte (Alertas para ausência de suporte)Acompanhante: N (Não presente)

- Alívio da Dor: N (Não oferecido/administrado)
- Líquidos Via Oral: N (Não encorajado/ingerido)
- Postura/Posição: SUPINE (Supina)

### 12.2 Limiares de Alerta (Alert Thresholds)

O sistema deve monitorar os seguintes parâmetros e disparar um evento de alerta quando os limiares especificados forem atingidos. Estes alertas são indicadores de que uma reavaliação clínica e um plano de ação podem ser necessários.

**Seção 3 (Bebê):**

- FCF Linha de Base:fhrBaseline &lt; 110 bpm
- fhrBaseline &gt;= 160 bpm
- Líquido Amniótico (LA):amnioticFluid = MECONIUM_THICK (M+++)
- amnioticFluid = BLOOD (B)
- Posição Fetal:fetalPosition = POSTERIOR (P)
- fetalPosition = TRANSVERSE (T)
- Bossa Serossanguínea (Caput):caput = +++
- Cavalgamento de Suturas (Moulding):moulding = +++

**Seção 4 (Mulher):**

- Pulso Materno:maternalPulse &lt; 60 bpm
- maternalPulse &gt;= 120 bpm
- Pressão Arterial Sistólica (PAS):sbp &lt; 80 mmHg
- sbp &gt;= 140 mmHg
- Pressão Arterial Diastólica (PAD):dbp &gt;= 90 mmHg
- Temperatura:temperatureC &lt; 35.0 °C
- temperatureC &gt;= 37.5 °C
- Urina - Proteinúria:urineProtein = ++
- urineProtein = +++
- Urina - Cetonúria:urineKetones = ++
- urineKetones = +++

**Seção 5 (Progresso do Trabalho de Parto):**

- Contrações Uterinas:contractionsPer10Min &lt;= 2
- contractionsPer10Min &gt; 5
- Duração das Contrações:contractionDurationSec &lt; 20 segundos
- contractionDurationSec &gt; 60 segundos
- Progressão da Dilatação Cervical (tempo máximo para progredir 1 cm):De 5 cm para 6 cm: tempo decorrido &gt;= 6 horas
- De 6 cm para 7 cm: tempo decorrido &gt;= 5 horas
- De 7 cm para 8 cm: tempo decorrido &gt;= 3 horas
- De 8 cm para 9 cm: tempo decorrido &gt;= 2.5 horas
- De 9 cm para 10 cm: tempo decorrido &gt;= 2 horas

**Seção 2 (Cuidados de Suporte):**

- Acompanhante:companionPresent = N (Não presente)
- Alívio da Dor:painReliefProvided = N (Não ofertado/administrado)
- Líquidos Via Oral (VO):oralFluidEncouragedOrTaken = N (Não encorajado/tomado)
- Postura:posture = SUPINE (Supina)

### 12.3 Regras Especiais e Fluxos Avançados

12.3.1 Início do LCG e Fase Ativa

- RG-LCG-01: O LCG deve ser iniciado apenas quando a mulher estiver na fase ativa do trabalho de parto, definida como dilatação cervical de 5 cm ou mais, com contrações uterinas regulares e efetivas.
- RG-LCG-02: O sistema deve registrar a data e hora exatas do diagnóstico da fase ativa (activeLabourDiagnosisDate, activeLabourDiagnosisTime).

  12.3.2 Regra das 12 Horas (Chaining LCGs)

- RG-LCG-03: Se o trabalho de parto ativo (monitorado pelo LCG) exceder 12 horas desde o activeLabourDiagnosisTime do LCG atual, o sistema deve:Bloquear a adição de novas observações ao LCG atual.
- Notificar o usuário sobre a necessidade de iniciar um novo LCG encadeado.
- Permitir a criação de um novo LCG que será automaticamente vinculado ao anterior, mantendo o histórico do episódio de parto.
- O novo LCG deve herdar os dados de identificação da mulher e do episódio de parto.
- O activeLabourDiagnosisTime do novo LCG será a hora de sua criação.

  12.3.3 Imutabilidade e Adendos

- RG-LCG-04: Uma vez que uma observação (ObservationSet) ou um plano/avaliação (Seção 7) tenha sido registrado e salvo, ele não pode ser editado ou excluído diretamente.
- RG-LCG-05: Qualquer correção ou alteração em um registro existente deve ser feita através de um adendo. O adendo deve incluir:O campo original que está sendo corrigido.
- O valor original.
- O novo valor.
- Data e hora da correção.
- Identificação do usuário que fez a correção.
- Motivo da correção (campo de texto livre obrigatório).
- RG-LCG-06: Todos os adendos devem ser auditáveis e visíveis no histórico do LCG.

  12.3.4 Vigilância Reforçada com Ocitocina

- RG-LCG-07: Se a ocitocina estiver sendo administrada (oxytocinUsed = Y), o sistema deve exigir que os campos de contractionsPer10Min, contractionDurationSec e fhrBaseline sejam preenchidos em cada ObservationSet subsequente enquanto a ocitocina estiver ativa.
- RG-LCG-08: O sistema deve alertar o usuário se houver inconsistência entre a administração de ocitocina e a ausência de registros de vigilância fetal/uterina.

### 13\. Modelo de Dados

Este modelo conceitual pode ser adaptado para bancos de dados relacionais (SQL) ou orientados a documentos (NoSQL).

13.1 Entidades Principais

- Userid (UUID) - PK
- username (String) - Unique
- passwordHash (String)
- email (String) - Unique
- role (Enum: ADMIN, DOCTOR, NURSE, OBSERVER)
- isActive (Boolean)
- createdAt (Timestamp)
- updatedAt (Timestamp)
- Patientid (UUID) - PK
- externalId (String) - ID do prontuário externo (opcional, mas recomendado)
- name (String)
- dob (Date)
- cpf (String) - Unique, opcional
- phone (String) - Opcional
- address (String) - Opcional
- createdAt (Timestamp)
- updatedAt (Timestamp)
- createdBy (UUID) - FK para User
- LabourEpisode (Episódio de Parto - Contém um ou mais LCGs)id (UUID) - PK
- patientId (UUID) - FK para Patient
- admissionDate (Timestamp)
- gestationalAgeWeeks (Integer)
- gestationalAgeDays (Integer)
- parity (Integer)
- gravida (Integer)
- riskFactors (Array of Enum: PREVIOUS_CS, HTN, DIABETES, OTHER_MEDICAL_CONDITION, NONE)
- status (Enum: ACTIVE, COMPLETED, ABORTED)
- outcome (Enum: VAGINAL_DELIVERY, CAESAREAN_SECTION, ABORTION, OTHER) - Opcional, preenchido ao final
- outcomeDate (Timestamp) - Opcional
- createdAt (Timestamp)
- updatedAt (Timestamp)
- createdBy (UUID) - FK para User
- LcgInstance (Instância do Partograma LCG)id (UUID) - PK
- labourEpisodeId (UUID) - FK para LabourEpisode
- previousLcgId (UUID) - FK para LcgInstance (para encadeamento de LCGs) - Opcional
- activeLabourDiagnosisDate (Date)
- activeLabourDiagnosisTime (Time)
- membranesStatus (Enum: INTACT, RUPTURED, UNKNOWN)
- ruptureDate (Date) - Condicional
- ruptureTime (Time) - Condicional
- labourOnsetType (Enum: SPONTANEOUS, INDUCED)
- status (Enum: IN_PROGRESS, COMPLETED, ABORTED)
- createdAt (Timestamp)
- updatedAt (Timestamp)
- createdBy (UUID) - FK para User
- ObservationSet (Conjunto de Observações em um dado momento)id (UUID) - PK
- lcgInstanceId (UUID) - FK para LcgInstance
- recordedAt (Timestamp) - Chave para o eixo X do partograma
- recordedBy (UUID) - FK para User
- section2 (JSONB/Object) - Dados da Seção 2
- section3 (JSONB/Object) - Dados da Seção 3
- section4 (JSONB/Object) - Dados da Seção 4
- section5 (JSONB/Object) - Dados da Seção 5
- section6 (JSONB/Object) - Dados da Seção 6
- section7 (JSONB/Object) - Dados da Seção 7 (Avaliação e Plano)
- createdAt (Timestamp)
- updatedAt (Timestamp)
- AlertEventid (UUID) - PK
- lcgInstanceId (UUID) - FK para LcgInstance
- observationSetId (UUID) - FK para ObservationSet (opcional, se o alerta for de um campo específico)
- alertType (Enum: FHR_LOW, FHR_HIGH, MECONIUM_THICK, BP_HIGH, PROGRESS_SLOW, etc.)
- triggeredAt (Timestamp)
- valueObserved (String) - Valor que disparou o alerta
- status (Enum: NEW, ACKNOWLEDGED, RESOLVED)
- acknowledgedBy (UUID) - FK para User - Opcional
- acknowledgedAt (Timestamp) - Opcional
- resolutionNotes (String) - Opcional
- createdAt (Timestamp)
- updatedAt (Timestamp)
- AuditLogid (UUID) - PK
- userId (UUID) - FK para User
- action (String) - Ex: CREATE_LCG, UPDATE_OBSERVATION, ACKNOWLEDGE_ALERT, ADD_ADDENDUM
- entityType (String) - Ex: LcgInstance, ObservationSet, AlertEvent
- entityId (UUID)
- details (JSONB/Object) - Detalhes da ação (ex: oldValue, newValue, reason)
- timestamp (Timestamp)

  13.2 Estrutura Detalhada de ObservationSet (JSONB/Object)

Cada sectionX dentro de ObservationSet conterá os campos específicos daquela seção, com seus respectivos tipos.

section2 **(Cuidados de Suporte):**

- companionPresent (Enum: Y, N)
- painReliefProvided (Enum: Y, N)
- oralFluidEncouragedOrTaken (Enum: Y, N)
- posture (Enum: SUPINE, UPRIGHT, LATERAL, SQUATTING, KNEELING, OTHER)
- postureOtherDescription (String) - Condicional se posture = OTHER

section3 **(Bebê):**

- fhrBaseline (Integer)
- fhrDeceleration (Enum: NONE, PRESENT, UNKNOWN)
- fhrDecelerationType (Enum: EARLY, LATE, VARIABLE, PROLONGED, OTHER) - Condicional se fhrDeceleration = PRESENT
- amnioticFluid (Enum: CLEAR, MECONIUM_LIGHT, MECONIUM_MODERATE, MECONIUM_THICK, BLOOD, UNKNOWN)
- fetalPosition (Enum: OA, OP, OT, LOA, ROA, LOP, ROP, LOT, ROT, TRANSVERSE, OTHER)
- caput (Enum: 0, +, ++, +++)
- moulding (Enum: 0, +, ++, +++)

section4 **(Mulher):**

- maternalPulse (Integer)
- sbp (Integer)
- dbp (Integer)
- temperatureC (Decimal)
- urineProtein (Enum: NEG, TRACE, +, ++, +++)
- urineKetones (Enum: NEG, TRACE, +, ++, +++)

section5 **(Progresso do Trabalho de Parto):**

- contractionsPer10Min (Integer)
- contractionDurationSec (Integer)
- cervicalDilationCm (Integer)
- descentStation (Integer) - Escala de 0 a 5 (ou -3 a +3 De Lee)
- cervicalEffacement (Integer) - %
- cervicalConsistency (Enum: SOFT, MEDIUM, FIRM)
- cervicalPosition (Enum: ANTERIOR, MID, POSTERIOR)

section6 **(Medicação):**

- oxytocinUsed (Enum: Y, N)
- oxytocinConcentrationUperL (Decimal) - Condicional se oxytocinUsed = Y
- oxytocinDropsPerMin (Integer) - Condicional se oxytocinUsed = Y
- otherMedications (Array of Object: {name: String, dose: String, route: String, administeredAt: Timestamp})
- ivFluids (Array of Object: {type: String, volumeMl: Integer, rateMlPerHour: Integer, administeredAt: Timestamp})

section7 **(Avaliação e Plano):**

- assessmentNotes (String) - Texto livre para avaliação
- planNotes (String) - Texto livre para plano
- reassessmentTime (Timestamp) - Próxima reavaliação planejada
- isFinalAssessment (Boolean) - Indica se é a avaliação final do LCG

  13.3 Índices

- User: username, email
- Patient: externalId, cpf
- LabourEpisode: patientId, admissionDate
- LcgInstance: labourEpisodeId, previousLcgId, activeLabourDiagnosisDate
- ObservationSet: lcgInstanceId, recordedAt (índice composto para busca temporal)
- AlertEvent: lcgInstanceId, triggeredAt, status
- AuditLog: userId, timestamp, entityType, entityId

### 14\. API Endpoints (REST)

Todos os endpoints devem exigir autenticação via JWT (JSON Web Tokens) ou OAuth2. **Base URL:** /api/v1

14.1 Autenticação e Autorização

- POST /auth/loginDescrição: Autentica um usuário e retorna um token de acesso.
- Request Body:{ "username": "user.name",&lt;br/&gt; "password": "password123" }
- Response Body (200 OK):{ "accessToken": "eyJhbGciOiJIUzI1Ni...",&lt;br/&gt; "refreshToken": "eyJhbGciOiJIUzI1Ni...",&lt;br/&gt; "expiresIn": 3600,&lt;br/&gt; "user": {&lt;br/&gt; "id": "uuid-user-1",&lt;br/&gt; "username": "user.name",&lt;br/&gt; "role": "NURSE" } }
- Error (401 Unauthorized):{ "code": "AUTH_INVALID_CREDENTIALS",&lt;br/&gt; "message": "Credenciais inválidas." }
- POST /auth/refreshDescrição: Renova o token de acesso usando um refresh token.
- Request Body:{ "refreshToken": "eyJhbGciOiJIUzI1Ni..." }
- Response Body (200 OK): (Mesmo formato de /auth/login)
- Error (401 Unauthorized):{ "code": "AUTH_INVALID_REFRESH_TOKEN",&lt;br/&gt; "message": "Refresh token inválido ou expirado." }

  14.2 Gerenciamento de Pacientes

- POST /patientsDescrição: Cria um novo registro de paciente.
- Permissões: ADMIN, DOCTOR, NURSE
- Request Body:{ "name": "Maria da Silva",&lt;br/&gt; "dob": "1990-05-15",&lt;br/&gt; "cpf": "123.456.789-00",&lt;br/&gt; "externalId": "PRONT001" }
- Response Body (201 Created):{ "id": "uuid-patient-1",&lt;br/&gt; "name": "Maria da Silva",&lt;br/&gt; "dob": "1990-05-15",&lt;br/&gt; "cpf": "123.456.789-00",&lt;br/&gt; "externalId": "PRONT001",&lt;br/&gt; "createdAt": "2023-10-27T10:00:00Z" }
- Error (400 Bad Request):{ "code": "VALIDATION_ERROR",&lt;br/&gt; "message": "Dados inválidos.",&lt;br/&gt; "details": \[{"field": "cpf", "message": "CPF já cadastrado."}\] }
- GET /patients/{patientId}Descrição: Retorna detalhes de um paciente.
- Permissões: ADMIN, DOCTOR, NURSE, OBSERVER
- PUT /patients/{patientId}Descrição: Atualiza detalhes de um paciente.
- Permissões: ADMIN, DOCTOR, NURSE
- GET /patientsDescrição: Lista pacientes (com filtros e paginação).
- Permissões: ADMIN, DOCTOR, NURSE, OBSERVER

  14.3 Gerenciamento de Episódios de Parto

- POST /labour-episodesDescrição: Inicia um novo episódio de parto para um paciente.
- Permissões: ADMIN, DOCTOR, NURSE
- Request Body:{ "patientId": "uuid-patient-1",&lt;br/&gt; "admissionDate": "2023-10-27T08:30:00Z",&lt;br/&gt; "gestationalAgeWeeks": 39,&lt;br/&gt; "gestationalAgeDays": 2,&lt;br/&gt; "parity": 1,&lt;br/&gt; "gravida": 2,&lt;br/&gt; "riskFactors": \["PREVIOUS_CS"\] }
- Response Body (201 Created):{ "id": "uuid-episode-1",&lt;br/&gt; "patientId": "uuid-patient-1",&lt;br/&gt; "admissionDate": "2023-10-27T08:30:00Z",&lt;br/&gt; "status": "ACTIVE",&lt;br/&gt; "createdAt": "2023-10-27T10:05:00Z" }
- GET /labour-episodes/{episodeId}Descrição: Retorna detalhes de um episódio de parto.
- Permissões: ADMIN, DOCTOR, NURSE, OBSERVER
- PUT /labour-episodes/{episodeId}/completeDescrição: Finaliza um episódio de parto, registrando o desfecho.
- Permissões: ADMIN, DOCTOR, NURSE
- Request Body:{ "outcome": "VAGINAL_DELIVERY",&lt;br/&gt; "outcomeDate": "2023-10-27T18:45:00Z" }

  14.4 Gerenciamento de Instâncias LCG

- POST /labour-episodes/{episodeId}/lcg-instancesDescrição: Inicia um novo LCG para um episódio de parto.
- Permissões: ADMIN, DOCTOR, NURSE
- Request Body:{ "activeLabourDiagnosisDate": "2023-10-27",&lt;br/&gt; "activeLabourDiagnosisTime": "12:00:00",&lt;br/&gt; "membranesStatus": "INTACT",&lt;br/&gt; "labourOnsetType": "SPONTANEOUS" }
- Response Body (201 Created):{ "id": "uuid-lcg-1",&lt;br/&gt; "labourEpisodeId": "uuid-episode-1",&lt;br/&gt; "activeLabourDiagnosisDate": "2023-10-27",&lt;br/&gt; "activeLabourDiagnosisTime": "12:00:00",&lt;br/&gt; "status": "IN_PROGRESS",&lt;br/&gt; "createdAt": "2023-10-27T12:01:00Z" }
- Error (400 Bad Request):{ "code": "LCG_INVALID_START_CRITERIA",&lt;br/&gt; "message": "Dilatação cervical inicial não atende ao critério de fase ativa (&gt;=5cm)." }
- GET /lcg-instances/{lcgInstanceId}Descrição: Retorna detalhes de uma instância LCG, incluindo todas as observações.
- Permissões: ADMIN, DOCTOR, NURSE, OBSERVER
- POST /lcg-instances/{lcgInstanceId}/chainDescrição: Cria um novo LCG encadeado a partir de um LCG existente (acionado pela regra das 12h).
- Permissões: ADMIN, DOCTOR, NURSE
- Request Body: (Vazio, ou pode incluir um reason para o encadeamento)
- Response Body (201 Created): (Mesmo formato de POST /labour-episodes/{episodeId}/lcg-instances, mas com previousLcgId preenchido)
- Error (400 Bad Request):{ "code": "LCG_CHAINING_NOT_REQUIRED",&lt;br/&gt; "message": "O LCG atual ainda não atingiu o limite de 12 horas para encadeamento." }

  14.5 Gerenciamento de Observações (ObservationSet)

- POST /lcg-instances/{lcgInstanceId}/observationsDescrição: Registra um novo conjunto de observações para um LCG.
- Permissões: ADMIN, DOCTOR, NURSE
- Request Body:{ "recordedAt": "2023-10-27T13:00:00Z",&lt;br/&gt; "section2": {&lt;br/&gt; "companionPresent": "Y",&lt;br/&gt; "painReliefProvided": "N",&lt;br/&gt; "oralFluidEncouragedOrTaken": "Y",&lt;br/&gt; "posture": "UPRIGHT" }, "section3": {&lt;br/&gt; "fhrBaseline": 130,&lt;br/&gt; "fhrDeceleration": "NONE",&lt;br/&gt; "amnioticFluid": "CLEAR",&lt;br/&gt; "fetalPosition": "OA",&lt;br/&gt; "caput": "0",&lt;br/&gt; "moulding": "0" }, "section4": {&lt;br/&gt; "maternalPulse": 80,&lt;br/&gt; "sbp": 120,&lt;br/&gt; "dbp": 70,&lt;br/&gt; "temperatureC": 36.8,&lt;br/&gt; "urineProtein": "NEG",&lt;br/&gt; "urineKetones": "NEG" }, "section5": {&lt;br/&gt; "contractionsPer10Min": 4,&lt;br/&gt; "contractionDurationSec": 45,&lt;br/&gt; "cervicalDilationCm": 6,&lt;br/&gt; "descentStation": 2 }, "section6": {&lt;br/&gt; "oxytocinUsed": "N",&lt;br/&gt; "otherMedications": \[\],&lt;br/&gt; "ivFluids": \[\] }, "section7": {&lt;br/&gt; "assessmentNotes": "Progresso adequado, mãe e bebê bem.",&lt;br/&gt; "planNotes": "Continuar monitoramento. Reavaliar em 1 hora.",&lt;br/&gt; "reassessmentTime": "2023-10-27T14:00:00Z",&lt;br/&gt; "isFinalAssessment": false } }
- Response Body (201 Created):{ "id": "uuid-observation-1",&lt;br/&gt; "lcgInstanceId": "uuid-lcg-1",&lt;br/&gt; "recordedAt": "2023-10-27T13:00:00Z",&lt;br/&gt; "recordedBy": "uuid-user-1",&lt;br/&gt; "section5": {"cervicalDilationCm": 6},&lt;br/&gt; "alertsTriggered": \[\] }
- Error (400 Bad Request):{ "code": "LCG_OBSERVATION_INVALID_DATA",&lt;br/&gt; "message": "Dados de observação inválidos.",&lt;br/&gt; "details": \[{"field": "cervicalDilationCm", "message": "Dilatação deve ser maior ou igual à anterior."}\] }
- Error (403 Forbidden):{ "code": "LCG_INSTANCE_CLOSED",&lt;br/&gt; "message": "Não é possível adicionar observações a um LCG finalizado ou expirado (12h)." }
- POST /observations/{observationSetId}/addendumDescrição: Adiciona um adendo a um registro de observação existente.
- Permissões: ADMIN, DOCTOR, NURSE
- Request Body:{ "fieldPath": "section3.fhrBaseline",&lt;br/&gt; "oldValue": 130,&lt;br/&gt; "newValue": 140,&lt;br/&gt; "reason": "Erro de digitação corrigido após reavaliação." }
- Response Body (201 Created):{ "id": "uuid-audit-log-1",&lt;br/&gt; "userId": "uuid-user-1",&lt;br/&gt; "action": "ADD_ADDENDUM",&lt;br/&gt; "entityType": "ObservationSet",&lt;br/&gt; "entityId": "uuid-observation-1",&lt;br/&gt; "details": {&lt;br/&gt; "fieldPath": "section3.fhrBaseline",&lt;br/&gt; "oldValue": 130,&lt;br/&gt; "newValue": 140,&lt;br/&gt; "reason": "Erro de digitação corrigido após reavaliação." }, "timestamp": "2023-10-27T13:15:00Z" }

  14.6 Gerenciamento de Alertas

- GET /lcg-instances/{lcgInstanceId}/alertsDescrição: Lista todos os alertas para uma instância LCG, com filtros por status (NEW, ACKNOWLEDGED, RESOLVED).
- Permissões: ADMIN, DOCTOR, NURSE, OBSERVER
- PUT /alerts/{alertId}/acknowledgeDescrição: Reconhece um alerta, registrando quem e quando.
- Permissões: ADMIN, DOCTOR, NURSE
- Request Body:{ "resolutionNotes": "Alerta de FCF alta reconhecido, paciente e feto reavaliados, sem sinais de sofrimento. Monitoramento intensificado." }
- Response Body (200 OK):{ "id": "uuid-alert-1",&lt;br/&gt; "status": "ACKNOWLEDGED",&lt;br/&gt; "acknowledgedBy": "uuid-user-1",&lt;br/&gt; "acknowledgedAt": "2023-10-27T13:05:00Z" }

  14.7 Exportação de Dados

- GET /lcg-instances/{lcgInstanceId}/export/pdfDescrição: Exporta o LCG completo (com todas as observações, alertas e adendos) em formato PDF.
- Permissões: ADMIN, DOCTOR, NURSE, OBSERVER
- Response: application/pdf (arquivo binário)
- GET /lcg-instances/{lcgInstanceId}/export/csvDescrição: Exporta os dados brutos de observações do LCG em formato CSV.
- Permissões: ADMIN, DOCTOR, NURSE, OBSERVER
- Response: text/csv (arquivo binário)

### 15\. Matriz de Validações

15.1 Validações de Campo (Range e Formato)

- Patient:name: String, min 3, max 255.
- dob: Date (YYYY-MM-DD), no futuro.
- cpf: String, 11 dígitos numéricos, formato "XXX.XXX.XXX-XX" (opcional, se presente, validar formato e unicidade).
- externalId: String, min 1, max 50 (opcional, se presente, validar unicidade).
- LabourEpisode:patientId: UUID, obrigatório, deve existir em Patient.
- admissionDate: Timestamp, obrigatório, no passado ou presente.
- gestationalAgeWeeks: Integer, 20-42.
- gestationalAgeDays: Integer, 0-6.
- parity: Integer, &gt;= 0.
- gravida: Integer, &gt;= 0.
- riskFactors: Array de Enum, pode ser vazio ou conter NONE.
- LcgInstance:labourEpisodeId: UUID, obrigatório, deve existir em LabourEpisode.
- activeLabourDiagnosisDate: Date, obrigatório.
- activeLabourDiagnosisTime: Time, obrigatório.
- membranesStatus: Enum, obrigatório.
- ruptureDate: Date, obrigatório se membranesStatus = RUPTURED.
- ruptureTime: Time, obrigatório se membranesStatus = RUPTURED.
- labourOnsetType: Enum, obrigatório.
- ObservationSet (campos dentro das seções):recordedAt: Timestamp, obrigatório, não pode ser no futuro. Deve ser posterior ao activeLabourDiagnosisTime do LCG.
- fhrBaseline: Integer, 50-220.
- maternalPulse: Integer, 30-200.
- sbp: Integer, 40-250.
- dbp: Integer, 20-150.
- temperatureC: Decimal, 30.0-42.0.
- contractionsPer10Min: Integer, 0-10.
- contractionDurationSec: Integer, 0-90.
- cervicalDilationCm: Integer, 0-10.
- descentStation: Integer, 0-5 (ou -3 a +3).
- cervicalEffacement: Integer, 0-100.
- oxytocinConcentrationUperL: Decimal, &gt; 0.
- oxytocinDropsPerMin: Integer, &gt; 0.
- reassessmentTime: Timestamp, no futuro.

  15.2 Validações Cruzadas e Condicionais

- VC-01 (Início do LCG): A primeira cervicalDilationCm registrada para um LcgInstance deve ser &gt;= 5 cm.
- VC-02 (Progressão da Dilatação): cervicalDilationCm em um ObservationSet deve ser &gt;= à última cervicalDilationCm registrada para o mesmo LcgInstance. Não pode diminuir.
- VC-03 (Timestamp de Observação): recordedAt de um ObservationSet deve ser posterior ao recordedAt do ObservationSet anterior no mesmo LcgInstance.
- VC-04 (Ocitocina e Vigilância): Se section6.oxytocinUsed = Y, então section5.contractionsPer10Min, section5.contractionDurationSec e section3.fhrBaseline são obrigatórios no mesmo ObservationSet.
- VC-05 (Postura "Outro"): Se section2.posture = OTHER, então section2.postureOtherDescription é obrigatório.
- VC-06 (Membranas Rotas): Se lcgInstance.membranesStatus = RUPTURED, então lcgInstance.ruptureDate e lcgInstance.ruptureTime são obrigatórios.
- VC-07 (Alerta de Progressão): O sistema deve validar a progressão da dilatação conforme os limiares de tempo definidos na Seção 12.2. Se o tempo decorrido entre duas observações de dilatação for maior que o limiar para o cm atual, um alerta deve ser disparado.
- VC-08 (LCG Encerrado): Não é permitido adicionar novas observações a um LcgInstance cujo status seja COMPLETED ou ABORTED.
- VC-09 (LCG Expirado): Não é permitido adicionar novas observações a um LcgInstance que excedeu 12 horas desde seu activeLabourDiagnosisTime e não foi encadeado.

### 16\. Motor de Alertas

O motor de alertas é um componente central que processa os dados de ObservationSet e dispara AlertEvents com base nos limiares definidos na Seção 12.2.

16.1 Mecanismo de Cálculo

- Trigger: O motor de alertas deve ser acionado imediatamente após o salvamento bem-sucedido de um ObservationSet.
- Processamento: Para cada campo dentro do ObservationSet que possui um limiar de alerta definido, o motor deve comparar o valor registrado com os limiares.
- Alertas de Progressão: Para alertas de progressão da dilatação (Seção 5), o motor deve:Identificar a cervicalDilationCm atual e o recordedAt do ObservationSet recém-salvo.
- Buscar a última cervicalDilationCm registrada anteriormente e seu recordedAt para o mesmo LcgInstance.
- Calcular o tempo decorrido entre as duas observações.
- Comparar o tempo decorrido com o limiar de tempo para a dilatação anterior (ex: se a dilatação anterior era 5cm, o limiar é 6h).
- Se o tempo exceder o limiar, disparar o alerta.

  16.2 Persistência e Estado do Alerta

- Criação: Quando um limiar é atingido, um novo AlertEvent deve ser criado com status = NEW.
- Unicidade: Evitar a criação de alertas duplicados para o mesmo tipo de alerta e ObservationSet se o alerta já estiver NEW.
- Severidade: Cada alertType pode ter uma severidade associada (ex: LOW, MEDIUM, HIGH) para priorização na UI.
- Status:NEW: Alerta recém-disparado, não visualizado.
- ACKNOWLEDGED: Alerta visualizado e reconhecido por um usuário. O acknowledgedBy e acknowledgedAt são preenchidos.
- RESOLVED: Alerta que foi abordado e a situação clínica foi resolvida ou o risco mitigado. O resolutionNotes é preenchido.
- Trilha de Auditoria: Todas as mudanças de status de um AlertEvent (criação, reconhecimento, resolução) devem ser registradas em AuditLog.

  16.3 Notificação e Interface

- Notificação em Tempo Real: O sistema deve ter um mecanismo de notificação em tempo real (ex: WebSockets) para alertar os usuários logados sobre novos alertas para os LCGs que estão monitorando.
- Visualização: Alertas NEW e ACKNOWLEDGED devem ser claramente visíveis na interface do LCG.

### 17\. Segurança e Permissões (RBAC)

17.1 Autenticação

- Padrão: JWT (JSON Web Tokens) para autenticação stateless.
- Fluxo: Login com credenciais, obtenção de accessToken (curta duração) e refreshToken (longa duração). accessToken enviado em cada requisição via header Authorization: Bearer &lt;token&gt;.

  17.2 Autorização (Role-Based Access Control - RBAC)

- Roles:ADMIN: Acesso total a todas as funcionalidades (CRUD de usuários, pacientes, episódios, LCGs, etc.).
- DOCTOR: Acesso a todos os dados clínicos (pacientes, episódios, LCGs, observações, alertas), com permissão de CRUD em dados clínicos.
- NURSE: Acesso a dados clínicos, com permissão de criar/atualizar observações e reconhecer alertas. Não pode criar/excluir pacientes ou episódios.
- OBSERVER: Apenas leitura de todos os dados clínicos.
- Regras de Permissão por Endpoint (Exemplos):POST /auth/login: Público
- POST /patients: ADMIN, DOCTOR, NURSE
- GET /patients/{patientId}: ADMIN, DOCTOR, NURSE, OBSERVER
- POST /labour-episodes: ADMIN, DOCTOR, NURSE
- POST /lcg-instances/{lcgInstanceId}/observations: ADMIN, DOCTOR, NURSE
- PUT /alerts/{alertId}/acknowledge: ADMIN, DOCTOR, NURSE
- GET /users: ADMIN (listar usuários)
- Implementação: Middleware de autorização que verifica o role do usuário no token JWT contra a permissão exigida pelo endpoint.

  17.3 Auditoria

- Log de Ações: Todas as ações de criação, atualização, exclusão e reconhecimento de alertas devem ser registradas na tabela AuditLog, incluindo userId, action, entityType, entityId, details (old/new values se aplicável) e timestamp.
- Acesso ao Log: Apenas usuários com role = ADMIN devem ter acesso à visualização do AuditLog.

  17.4 Segurança de Dados

- TLS/SSL: Todas as comunicações entre cliente e servidor devem ser criptografadas via HTTPS (TLS 1.2+).
- Hashing de Senhas: Senhas de usuários devem ser armazenadas como hashes (ex: bcrypt) com salt.
- Rate Limiting: Implementar rate limiting em endpoints de autenticação e criação de recursos para prevenir ataques de força bruta e DoS.
- Validação de Entrada: Todas as entradas de usuário devem ser rigorosamente validadas para prevenir ataques de injeção (SQL Injection, XSS).

  17.5 LGPD (Lei Geral de Proteção de Dados)

- Anonimização/Pseudonimização: Considerar a possibilidade de anonimizar ou pseudonimizar dados de pacientes para fins de pesquisa ou relatórios, se aplicável.
- Consentimento: A aplicação deve ter mecanismos para registrar o consentimento do paciente para o uso de seus dados (fora do escopo deste documento, mas importante para o projeto).
- Acesso Controlado: Garantir que o acesso aos dados do paciente seja estritamente controlado por RBAC.

### 18\. Testes de Aceitação (Gherkin)

Os testes de aceitação devem ser escritos no formato Gherkin (Given-When-Then) e cobrir os principais fluxos de usuário e regras de negócio.

**Cenário 1: Início de um Novo LCG com Sucesso** gherkin Funcionalidade: Gerenciamento de LCG Como um enfermeiro obstetra Eu quero iniciar um novo LCG para um paciente Para monitorar o trabalho de parto ativo

Cenário: Iniciar LCG com dilatação &gt;= 5cm Dado que eu estou autenticado como "NURSE" E existe um "Patient" com ID "uuid-patient-1" E existe um "LabourEpisode" com ID "uuid-episode-1" para "uuid-patient-1" Quando eu envio uma requisição POST para "/api/v1/labour-episodes/uuid-episode-1/lcg-instances" com o corpo: """ { "activeLabourDiagnosisDate": "2023-10-27",  
"activeLabourDiagnosisTime": "12:00:00",  
"membranesStatus": "INTACT",  
"labourOnsetType": "SPONTANEOUS" } """ E a primeira observação registrada para este LCG tem "cervicalDilationCm": 6 Então a resposta deve ter status 201 Created E o corpo da resposta deve conter um "id" para o novo LCG E o LCG deve ter "status": "IN_PROGRESS"

\*\*Cenário 2: Falha ao Iniciar LCG com Dilatação &lt; 5cm\*\* \`\`\`gherkin Cenário: Falha ao iniciar LCG com dilatação inicial &lt; 5cm Dado que eu estou autenticado como "NURSE" E existe um "Patient" com ID "uuid-patient-2" E existe um "LabourEpisode" com ID "uuid-episode-2" para "uuid-patient-2" Quando eu envio uma requisição POST para "/api/v1/labour-episodes/uuid-episode-2/lcg-instances" com o corpo: """ { "activeLabourDiagnosisDate": "2023-10-27",&lt;br/&gt; "activeLabourDiagnosisTime": "10:00:00",&lt;br/&gt; "membranesStatus": "INTACT",&lt;br/&gt; "labourOnsetType": "SPONTANEOUS" } """ E a primeira observação registrada para este LCG tem "cervicalDilationCm": 4 Então a resposta deve ter status 400 Bad Request E o corpo da resposta deve conter "code": "LCG_INVALID_START_CRITERIA"

**Cenário 3: Registro de Observação e Disparo de Alerta (FCF Baixa)**

Cenário: Disparo de alerta para FCF baixa Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-3" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-3/observations" com o corpo: """ { "recordedAt": "2023-10-27T14:00:00Z",&lt;br/&gt; "section3": {"fhrBaseline": 100},&lt;br/&gt; "section5": {"cervicalDilationCm": 6} } """ Então a resposta deve ter status 201 Created E o corpo da resposta deve conter "alertsTriggered" com um alerta do tipo "FHR_LOW" E um "AlertEvent" deve ser criado no banco de dados com "alertType": "FHR_LOW" e "status": "NEW"

**Cenário 4: Registro de Observação e Disparo de Alerta (Progressão Lenta)**

Cenário: Disparo de alerta para progressão lenta (5cm para 6cm em &gt;6h) Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-4" em progresso E a última observação registrada para "uuid-lcg-4" foi em "2023-10-27T08:00:00Z" com "cervicalDilationCm": 5&lt;br/&gt; Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-4/observations" com o corpo: """ { "recordedAt": "2023-10-27T14:01:00Z",&lt;br/&gt; "section5": {"cervicalDilationCm": 6} } """ Então a resposta deve ter status 201 Created E o corpo da resposta deve conter "alertsTriggered" com um alerta do tipo "PROGRESS_SLOW" E um "AlertEvent" deve ser criado no banco de dados com "alertType": "PROGRESS_SLOW" e "status": "NEW"

**Cenário 5: Reconhecer um Alerta**

Cenário: Reconhecer um alerta existente Dado que eu estou autenticado como "DOCTOR" E existe um "AlertEvent" com ID "uuid-alert-5" e "status": "NEW"&lt;br/&gt; Quando eu envio uma requisição PUT para "/api/v1/alerts/uuid-alert-5/acknowledge" com o corpo: """ { "resolutionNotes": "Alerta de FCF baixa reconhecido, feto reavaliado, sem sinais de sofrimento. Monitoramento intensificado." } """ Então a resposta deve ter status 200 OK E o "AlertEvent" com ID "uuid-alert-5" deve ter "status": "ACKNOWLEDGED" E o "acknowledgedBy" deve ser o ID do "DOCTOR" autenticado

**Cenário 6: Regra das 12 Horas - LCG Bloqueado**

Cenário: LCG bloqueado após 12 horas sem encadeamento Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-6" E o "activeLabourDiagnosisTime" de "uuid-lcg-6" foi "2023-10-27T08:00:00Z"&lt;br/&gt; E a hora atual é "2023-10-27T20:01:00Z" (mais de 12 horas depois) Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-6/observations" com qualquer corpo de observação Então a resposta deve ter status 403 Forbidden E o corpo da resposta deve conter "code": "LCG_INSTANCE_CLOSED"

**Cenário 7: Regra das 12 Horas - Criar LCG Encadeado**

Cenário: Criar um novo LCG encadeado após 12 horas Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-7" E o "activeLabourDiagnosisTime" de "uuid-lcg-7" foi "2023-10-27T08:00:00Z"&lt;br/&gt; E a hora atual é "2023-10-27T20:01:00Z" Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-7/chain" Então a resposta deve ter status 201 Created E o corpo da resposta deve conter um novo "id" para o LCG encadeado E o novo LCG deve ter "previousLcgId": "uuid-lcg-7" E o LCG anterior "uuid-lcg-7" deve ter seu "status" atualizado para "COMPLETED"

**Cenário 8: Adendo a uma Observação Existente**

Cenário: Adicionar um adendo a um campo de observação Dado que eu estou autenticado como "NURSE" E existe um "ObservationSet" com ID "uuid-obs-8" com "section3.fhrBaseline": 130&lt;br/&gt; Quando eu envio uma requisição POST para "/api/v1/observations/uuid-obs-8/addendum" com o corpo: """ { "fieldPath": "section3.fhrBaseline",&lt;br/&gt; "oldValue": 130,&lt;br/&gt; "newValue": 140,&lt;br/&gt; "reason": "Erro de digitação corrigido." } """ Então a resposta deve ter status 201 Created E um "AuditLog" deve ser criado registrando a ação "ADD_ADDENDUM" E a visualização do LCG deve mostrar o valor corrigido (140) com uma indicação de adendo

**Cenário 9: Vigilância Reforçada com Ocitocina (Sucesso)**

Cenário: Registrar observação com ocitocina e vigilância completa Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-9" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-9/observations" com o corpo: """ { "recordedAt": "2023-10-27T15:00:00Z",&lt;br/&gt; "section6": {"oxytocinUsed": "Y", "oxytocinConcentrationUperL": 10, "oxytocinDropsPerMin": 30},&lt;br/&gt; "section5": {"contractionsPer10Min": 4, "contractionDurationSec": 40, "cervicalDilationCm": 7},&lt;br/&gt; "section3": {"fhrBaseline": 135} } """ Então a resposta deve ter status 201 Created E nenhuma mensagem de alerta de vigilância deve ser disparada

**Cenário 10: Vigilância Reforçada com Ocitocina (Falha - FCF Ausente)**

Cenário: Falha ao registrar observação com ocitocina e FCF ausente Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-10" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-10/observations" com o corpo: """ { "recordedAt": "2023-10-27T16:00:00Z",&lt;br/&gt; "section6": {"oxytocinUsed": "Y", "oxytocinConcentrationUperL": 10, "oxytocinDropsPerMin": 30},&lt;br/&gt; "section5": {"contractionsPer10Min": 4, "contractionDurationSec": 40, "cervicalDilationCm": 7} // FHR Baseline está ausente } """ Então a resposta deve ter status 400 Bad Request E o corpo da resposta deve conter "code": "LCG_OBSERVATION_INVALID_DATA" E a mensagem de erro deve indicar que "fhrBaseline" é obrigatório com ocitocina

**Cenário 11: Disparo de Alerta (Líquido Amniótico Meconial Espesso)**

Cenário: Disparo de alerta para LA meconial espesso Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-11" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-11/observations" com o corpo: """ { "recordedAt": "2023-10-27T17:00:00Z",&lt;br/&gt; "section3": {"amnioticFluid": "MECONIUM_THICK"},&lt;br/&gt; "section5": {"cervicalDilationCm": 8} } """ Então a resposta deve ter status 201 Created E o corpo da resposta deve conter "alertsTriggered" com um alerta do tipo "MECONIUM_THICK"

**Cenário 12: Disparo de Alerta (PA Sistólica Alta)**

Cenário: Disparo de alerta para PAS alta Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-12" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-12/observations" com o corpo: """ { "recordedAt": "2023-10-27T18:00:00Z",&lt;br/&gt; "section4": {"sbp": 150, "dbp": 80},&lt;br/&gt; "section5": {"cervicalDilationCm": 8} } """ Então a resposta deve ter status 201 Created E o corpo da resposta deve conter "alertsTriggered" com um alerta do tipo "BP_HIGH"

**Cenário 13: Disparo de Alerta (Temperatura Baixa)**

Cenário: Disparo de alerta para temperatura baixa Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-13" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-13/observations" com o corpo: """ { "recordedAt": "2023-10-27T19:00:00Z",&lt;br/&gt; "section4": {"temperatureC": 34.5},&lt;br/&gt; "section5": {"cervicalDilationCm": 9} } """ Então a resposta deve ter status 201 Created E o corpo da resposta deve conter "alertsTriggered" com um alerta do tipo "TEMPERATURE_LOW"

**Cenário 14: Disparo de Alerta (Urina Proteinúria ++ )**

Cenário: Disparo de alerta para proteinúria ++ Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-14" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-14/observations" com o corpo: """ { "recordedAt": "2023-10-27T20:00:00Z",&lt;br/&gt; "section4": {"urineProtein": "++"},&lt;br/&gt; "section5": {"cervicalDilationCm": 9} } """ Então a resposta deve ter status 201 Created E o corpo da resposta deve conter "alertsTriggered" com um alerta do tipo "URINE_PROTEIN_HIGH"

**Cenário 15: Disparo de Alerta (Contrações Insuficientes)**

Cenário: Disparo de alerta para contrações insuficientes Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-15" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-15/observations" com o corpo: """ { "recordedAt": "2023-10-27T21:00:00Z",&lt;br/&gt; "section5": {"contractionsPer10Min": 1, "contractionDurationSec": 30, "cervicalDilationCm": 9} } """ Então a resposta deve ter status 201 Created E o corpo da resposta deve conter "alertsTriggered" com um alerta do tipo "CONTRACTIONS_LOW"

**Cenário 16: Disparo de Alerta (Postura Supina)**

Cenário: Disparo de alerta para postura supina Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-16" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-16/observations" com o corpo: """ { "recordedAt": "2023-10-27T22:00:00Z",&lt;br/&gt; "section2": {"posture": "SUPINE"},&lt;br/&gt; "section5": {"cervicalDilationCm": 9} } """ Então a resposta deve ter status 201 Created E o corpo da resposta deve conter "alertsTriggered" com um alerta do tipo "POSTURE_SUPINE"

**Cenário 17: Acesso Negado por Permissão (NURSE tenta criar Usuário)**

Cenário: Acesso negado para NURSE tentando criar usuário Dado que eu estou autenticado como "NURSE" Quando eu envio uma requisição POST para "/api/v1/users" com o corpo: """ { "username": "new.user",&lt;br/&gt; "password": "password",&lt;br/&gt; "email": "new@example.com",&lt;br/&gt; "role": "DOCTOR" } """ Então a resposta deve ter status 403 Forbidden E o corpo da resposta deve conter "code": "RBAC_FORBIDDEN"

**Cenário 18: Exportação de LCG para PDF**

Cenário: Exportar LCG completo para PDF Dado que eu estou autenticado como "DOCTOR" E existe um "LcgInstance" com ID "uuid-lcg-18" com observações e alertas Quando eu envio uma requisição GET para "/api/v1/lcg-instances/uuid-lcg-18/export/pdf" Então a resposta deve ter status 200 OK E o cabeçalho "Content-Type" deve ser "application/pdf" E o corpo da resposta deve ser um arquivo PDF válido

**Cenário 19: Exportação de LCG para CSV**

Cenário: Exportar dados brutos do LCG para CSV Dado que eu estou autenticado como "OBSERVER" E existe um "LcgInstance" com ID "uuid-lcg-19" com observações Quando eu envio uma requisição GET para "/api/v1/lcg-instances/uuid-lcg-19/export/csv" Então a resposta deve ter status 200 OK E o cabeçalho "Content-Type" deve ser "text/csv" E o corpo da resposta deve ser um arquivo CSV válido com os dados das observações

**Cenário 20: Falha de Autenticação (Credenciais Inválidas)**

Cenário: Falha de login com credenciais inválidas Dado que eu não estou autenticado Quando eu envio uma requisição POST para "/api/v1/auth/login" com o corpo: """ { "username": "invalid.user",&lt;br/&gt; "password": "wrongpassword" } """ Então a resposta deve ter status 401 Unauthorized E o corpo da resposta deve conter "code": "AUTH_INVALID_CREDENTIALS"

**Cenário 21: Registro de Observação com Postura "OTHER" e Descrição**

Cenário: Registrar observação com postura "OTHER" e descrição obrigatória Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-21" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-21/observations" com o corpo: """ { "recordedAt": "2023-10-28T09:00:00Z",&lt;br/&gt; "section2": {"posture": "OTHER", "postureOtherDescription": "Em pé, apoiada na parede"},&lt;br/&gt; "section5": {"cervicalDilationCm": 7} } """ Então a resposta deve ter status 201 Created E a observação deve ser salva com a descrição da postura

**Cenário 22: Falha ao Registrar Observação com Postura "OTHER" sem Descrição**

Cenário: Falha ao registrar observação com postura "OTHER" sem descrição Dado que eu estou autenticado como "NURSE" E existe um "LcgInstance" com ID "uuid-lcg-22" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-22/observations" com o corpo: """ { "recordedAt": "2023-10-28T10:00:00Z",&lt;br/&gt; "section2": {"posture": "OTHER"},&lt;br/&gt; "section5": {"cervicalDilationCm": 7} } """ Então a resposta deve ter status 400 Bad Request E o corpo da resposta deve conter "code": "LCG_OBSERVATION_INVALID_DATA" E a mensagem de erro deve indicar que "postureOtherDescription" é obrigatório

**Cenário 23: Registro de LCG com Membranas Rotas e Timestamp**

Cenário: Iniciar LCG com membranas rotas e registrar data/hora da rotura Dado que eu estou autenticado como "NURSE" E existe um "Patient" com ID "uuid-patient-23" E existe um "LabourEpisode" com ID "uuid-episode-23" para "uuid-patient-23" Quando eu envio uma requisição POST para "/api/v1/labour-episodes/uuid-episode-23/lcg-instances" com o corpo: """ { "activeLabourDiagnosisDate": "2023-10-28",&lt;br/&gt; "activeLabourDiagnosisTime": "11:00:00",&lt;br/&gt; "membranesStatus": "RUPTURED",&lt;br/&gt; "ruptureDate": "2023-10-28",&lt;br/&gt; "ruptureTime": "09:30:00",&lt;br/&gt; "labourOnsetType": "SPONTANEOUS" } """ E a primeira observação registrada para este LCG tem "cervicalDilationCm": 6 Então a resposta deve ter status 201 Created E o LCG deve ter "membranesStatus": "RUPTURED" e os timestamps de rotura preenchidos

**Cenário 24: Falha ao Registrar LCG com Membranas Rotas sem Timestamp**

Cenário: Falha ao iniciar LCG com membranas rotas sem data/hora da rotura Dado que eu estou autenticado como "NURSE" E existe um "Patient" com ID "uuid-patient-24" E existe um "LabourEpisode" com ID "uuid-episode-24" para "uuid-patient-24" Quando eu envio uma requisição POST para "/api/v1/labour-episodes/uuid-episode-24/lcg-instances" com o corpo: """ { "activeLabourDiagnosisDate": "2023-10-28",&lt;br/&gt; "activeLabourDiagnosisTime": "12:00:00",&lt;br/&gt; "membranesStatus": "RUPTURED",&lt;br/&gt; "labourOnsetType": "SPONTANEOUS" // ruptureDate e ruptureTime estão ausentes } """ E a primeira observação registrada para este LCG tem "cervicalDilationCm": 6 Então a resposta deve ter status 400 Bad Request E o corpo da resposta deve conter "code": "LCG_INVALID_START_CRITERIA" E a mensagem de erro deve indicar que "ruptureDate" e "ruptureTime" são obrigatórios

**Cenário 25: Acesso Negado por RBAC (OBSERVER tenta criar Observação)**

Cenário: Acesso negado para OBSERVER tentando criar observação Dado que eu estou autenticado como "OBSERVER" E existe um "LcgInstance" com ID "uuid-lcg-25" em progresso Quando eu envio uma requisição POST para "/api/v1/lcg-instances/uuid-lcg-25/observations" com qualquer corpo de observação Então a resposta deve ter status 403 Forbidden E o corpo da resposta deve conter "code": "RBAC_FORBIDDEN"

### 19\. Requisitos Não Funcionais

19.1 Performance

- Tempo de Resposta:90% das requisições de leitura (GET) devem responder em menos de 500 ms.
- 90% das requisições de escrita (POST, PUT) devem responder em menos de 1000 ms.
- Exportação de PDF/CSV deve ser concluída em menos de 5 segundos para LCGs com até 100 observações.
- Concorrência: O sistema deve suportar 100 usuários simultâneos ativos sem degradação significativa de performance.

  19.2 Disponibilidade

- Uptime: 99.9% de uptime mensal (excluindo janelas de manutenção planejadas).
- Recuperação de Desastres: Capacidade de restaurar o serviço em até 4 horas em caso de falha catastrófica.

  19.3 Escalabilidade

- A arquitetura deve ser escalável horizontalmente para suportar um aumento futuro no número de usuários e dados.
- O banco de dados deve ser capaz de lidar com um volume crescente de ObservationSet e AlertEvents.

  19.4 Segurança

- Vulnerabilidades: A aplicação deve ser desenvolvida seguindo as melhores práticas de segurança (OWASP Top 10).
- Criptografia: Dados sensíveis em repouso e em trânsito devem ser criptografados.
- Testes de Segurança: Realizar testes de penetração e varreduras de segurança regularmente.

  19.5 Observabilidade

- Monitoramento: Implementar monitoramento de logs, métricas (CPU, memória, I/O, latência de requisições) e traces distribuídos.
- Alertas: Configurar alertas para anomalias de performance, erros e indisponibilidade.
- Logs: Logs detalhados (mas sem dados sensíveis) devem ser gerados para depuração e auditoria.

  19.6 Manutenibilidade

- Código: Código limpo, bem documentado e seguindo padrões de codificação.
- Testes: Alta cobertura de testes unitários, de integração e de aceitação.
- Deploy: Processo de CI/CD automatizado para deploys rápidos e confiáveis.

  19.7 Usabilidade

- Interface: Interface intuitiva e responsiva, otimizada para dispositivos desktop e tablets.
- Feedback: Feedback visual claro para ações do usuário e status do sistema (sucesso, erro, carregamento).

### 20\. Definição de Pronto (Definition of Done - DoD) e Checklist de Entrega

Para que uma funcionalidade ou história de usuário seja considerada "pronta", os seguintes critérios devem ser atendidos:

20.1 Critérios de DoD para Histórias de Usuário

- Código Implementado: A funcionalidade foi codificada.
- Testes Unitários: Testes unitários foram escritos e passam com 100% de cobertura de linha para o código novo/modificado.
- Testes de Integração: Testes de integração foram escritos e passam para a funcionalidade.
- Testes de Aceitação (Gherkin): Todos os cenários Gherkin relevantes para a história foram implementados e passam.
- Revisão de Código (Code Review): O código passou por revisão por pares e todas as sugestões foram abordadas.
- Documentação Atualizada:Documentação da API (Swagger/OpenAPI) atualizada.
- Diagramas de arquitetura (se aplicável) atualizados.
- Qualquer documentação técnica interna relevante atualizada.
- Testes de Segurança: Testes básicos de segurança (ex: validação de entrada, autenticação) foram realizados.
- Logs e Métricas: Logs apropriados foram implementados e métricas relevantes estão sendo coletadas.
- Performance: A funcionalidade atende aos requisitos de performance definidos.
- Deployable: A funcionalidade pode ser implantada no ambiente de staging/produção via CI/CD.
- LGPD/Privacidade: Conformidade com os requisitos de privacidade de dados.

  20.2 Checklist de Entrega (Release Checklist)

- Todos os itens do DoD foram cumpridos para todas as histórias incluídas na release.
- Testes de regressão completos foram executados e passaram.
- Testes de performance e carga foram executados.
- Varredura de segurança (SAST/DAST) foi executada e vulnerabilidades críticas foram corrigidas.
- Plano de rollback está documentado e testado.
- Comunicação com stakeholders sobre a release foi realizada.
- Monitoramento pós-deploy está configurado e ativo.

### 21\. Glossário e Convenções

- LCG: Labour Care Guide (Guia de Cuidados no Trabalho de Parto), o partograma da OMS.
- ObservationSet: Um conjunto de todas as observações registradas em um único ponto no tempo para um LCG. Corresponde a uma "coluna" no gráfico do partograma.
- AlertEvent: Um evento disparado pelo sistema quando um limiar clínico é atingido.
- RBAC: Role-Based Access Control (Controle de Acesso Baseado em Papéis).
- UUID: Universally Unique Identifier.
- Timestamp: Data e hora no formato ISO 8601 (ex: YYYY-MM-DDTHH:mm:ssZ).
- Enum: Tipo de dado que representa um conjunto fixo de valores permitidos.
- FK: Foreign Key (Chave Estrangeira).
- PK: Primary Key (Chave Primária).
- JSONB: Tipo de dado JSON binário em PostgreSQL, usado para armazenar objetos JSON de forma eficiente.
- Unidades:bpm: Batimentos por minuto (FCF, Pulso Materno).
- mmHg: Milímetros de mercúrio (Pressão Arterial).
- °C: Graus Celsius (Temperatura).
- cm: Centímetros (Dilatação Cervical).
- segundos: Duração das contrações.
- ml: Mililitros (Volume de fluidos EV).
- U/L: Unidades por Litro (Concentração de Ocitocina).
- drops/min: Gotas por minuto (Taxa de Ocitocina).
