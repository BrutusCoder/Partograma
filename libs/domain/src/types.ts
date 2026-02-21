// =====================================================================
// @partograma/domain - Tipos e interfaces do LCG (WHO 2020)
// Fonte: Documento de Requisitos + Regras de Negócio
// =====================================================================

import {
  UserRole,
  LabourOnsetType,
  RuptureStatus,
  EpisodeStatus,
  LcgFormStatus,
  YesNo,
  Posture,
  FhrDeceleration,
  FhrDecelerationType,
  AmnioticFluid,
  FetalPosition,
  CaputMoulding,
  UrineLevel,
  ClinicalStatus,
  ProgressStatus,
  AlertType,
  AlertSeverity,
  AuditOperation,
} from './enums';

// --- Entidade: Unit (multi-tenant) ---
// Fonte: Plano_Implementacao §3.1 — "Unit: unidade hospitalar (multi-tenant)"
// Campos derivados da API entity (UnitEntity) e validados contra o plano.
// Campos marcados (a confirmar) poderão ser estendidos em sprints futuros.
export interface Unit {
  id: string;
  /** Nome da unidade de saúde / maternidade */
  name: string;
  /** Código externo da unidade (ex.: CNES). Único quando presente. (a confirmar) */
  externalId?: string | null;
  /** Indica se a unidade está ativa no sistema */
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Entidade: User ---
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  /** FK para Unit — escopo multi-tenant (Unit 1:N User) */
  unitId?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Entidade: Episode (Seção 1 - Cabeçalho) ---
export interface Episode {
  id: string;
  patientName: string;
  patientId?: string;
  age: number;
  parity: number;
  gestationalAgeWeeks: number;
  gestationalAgeDays: number;
  riskFactors: string[];
  labourOnsetType: LabourOnsetType;
  ruptureStatus: RuptureStatus;
  ruptureAt?: string;
  activeLabourDiagnosisAt: string;
  status: EpisodeStatus;
  completedAt?: string;
  completionReason?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lcgForms?: LcgForm[];
}

// --- Entidade: LcgForm ---
export interface LcgForm {
  id: string;
  episodeId: string;
  formNumber: number;
  isContinuedForm: boolean;
  startedAt: string;
  endedAt?: string;
  status: LcgFormStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  observations?: ObservationSet[];
}

// --- Seção 2: Cuidados de Suporte ---
export interface Section2Data {
  companionPresent: YesNo;
  painReliefProvided: YesNo;
  painReliefOffered?: YesNo;
  womanDeclined?: YesNo;
  oralFluidEncouragedOrTaken: YesNo;
  posture: Posture;
  postureDescription?: string;
}

// --- Seção 3: Cuidados com o Bebê ---
export interface Section3Data {
  fhrBaseline: number;
  fhrDeceleration: FhrDeceleration;
  fhrDecelerationType?: FhrDecelerationType;
  fhrDecelerationDetails?: string;
  amnioticFluid: AmnioticFluid;
  fetalPosition: FetalPosition;
  caput: CaputMoulding;
  moulding: CaputMoulding;
}

// --- Seção 4: Cuidados com a Mulher ---
export interface Section4Data {
  maternalPulse: number;
  sbp: number;
  dbp: number;
  temperatureC: number;
  urineProtein: UrineLevel;
  urineKetones: UrineLevel;
}

// --- Seção 5: Progresso do Trabalho de Parto ---
export interface Section5Data {
  contractionsPer10Min: number;
  contractionDurationSec: number;
  cervicalDilationCm: number;
  descentStation: number;
}

// --- Seção 6: Medicação ---
export interface Medication {
  name: string;
  dose: string;
  route: string;
  administeredAt: string;
}

export interface IvFluid {
  type: string;
  volumeMl: number;
  rateMlPerHour: number;
  startedAt: string;
  endedAt?: string;
}

export interface Section6Data {
  oxytocinUsed: boolean;
  oxytocinConcentrationUperL?: number;
  oxytocinDropsPerMin?: number;
  oxytocinMuiPerMin?: number;
  medications: Medication[];
  ivFluids: IvFluid[];
}

// --- Seção 7: Tomada de Decisão Compartilhada ---
export interface Section7Data {
  assessment: string;
  maternalStatus?: ClinicalStatus;
  maternalStatusDescription?: string;
  fetalStatus?: ClinicalStatus;
  fetalStatusDescription?: string;
  progressStatus?: ProgressStatus;
  progressEvidence?: string;
  plan: string;
  reassessmentTime: string;
}

// --- Entidade: Plan (Seção 7 como artefato persistente) ---
// Fonte: Plano_Implementacao §3.1 — "Plan: Seção 7 (avaliação e plano)"
// Regra: Plan é **obrigatório quando há alerta** (1:1 com ObservationSet).
// Imutabilidade: Plan não deve ser editado diretamente; correções via AuditLog/adendo.
export interface Plan {
  id: string;
  /** FK 1:1 para ObservationSet — unique constraint na persistência */
  observationSetId: string;
  /** Avaliação clínica global (texto livre) */
  assessment: string;
  /** Status materno — OK ou CONCERNS (a confirmar) */
  maternalStatus?: ClinicalStatus;
  /** Descrição adicional do status materno */
  maternalStatusDescription?: string;
  /** Status fetal — OK ou CONCERNS (a confirmar) */
  fetalStatus?: ClinicalStatus;
  /** Descrição adicional do status fetal */
  fetalStatusDescription?: string;
  /** Progresso do trabalho de parto */
  progressStatus?: ProgressStatus;
  /** Evidência clínica para o status de progresso */
  progressEvidence?: string;
  /** Plano de ação definido na decisão compartilhada */
  plan: string;
  /** Horário agendado para reavaliação (ISO 8601) */
  reassessmentTime: string;
  /** Quem criou o Plan (userId) */
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- Entidade: ObservationSet (Rodada de observações) ---
export interface ObservationSet {
  id: string;
  lcgFormId: string;
  recordedAt: string;
  section2: Section2Data;
  section3: Section3Data;
  section4: Section4Data;
  section5: Section5Data;
  section6: Section6Data;
  section7?: Section7Data;
  hasAlert: boolean;
  recordedBy: string;
  createdAt: string;
  /** Plan vinculado (1:1, obrigatório quando hasAlert === true) */
  plan?: Plan;
}

// --- Entidade: Alert ---
export interface Alert {
  id: string;
  observationSetId: string;
  lcgFormId: string;
  alertType: AlertType;
  alertValue: string;
  alertDescription: string;
  severity: AlertSeverity;
  alertAt: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  createdBy: string;
  createdAt: string;
}

// --- Entidade: AuditLog ---
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  operation: AuditOperation;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  reason?: string;
  performedBy: string;
  performedAt: string;
  ipAddress?: string;
}

// --- DTOs para criação ---
export interface CreateEpisodeDto {
  patientName: string;
  patientId?: string;
  age: number;
  parity: number;
  gestationalAgeWeeks: number;
  gestationalAgeDays: number;
  riskFactors: string[];
  labourOnsetType: LabourOnsetType;
  ruptureStatus: RuptureStatus;
  ruptureAt?: string;
  activeLabourDiagnosisAt: string;
}

export interface CreateLcgFormDto {
  isContinuedForm: boolean;
  startedAt: string;
}

export interface CreateObservationDto {
  recordedAt: string;
  section2: Section2Data;
  section3: Section3Data;
  section4: Section4Data;
  section5: Section5Data;
  section6: Section6Data;
  section7?: Section7Data;
}

export interface UpdateEpisodeStatusDto {
  status: EpisodeStatus;
  completedAt?: string;
  completionReason?: string;
}

// --- Constantes do LCG ---
export const LCG_MAX_DURATION_HOURS = 12;
export const LCG_MAX_DURATION_MINUTES = LCG_MAX_DURATION_HOURS * 60;

/**
 * Limiares de tempo (em minutos) para progressão cervical por dilatação.
 * Chave = dilatação atual em cm.
 * Valor = tempo máximo (minutos) sem progredir 1cm antes de gerar alerta.
 * Fonte: LCG OMS 2020, Seção 5.
 */
export const CERVICAL_PROGRESSION_THRESHOLDS: Record<number, number> = {
  5: 360, // 6 horas para 5→6cm
  6: 300, // 5 horas para 6→7cm
  7: 180, // 3 horas para 7→8cm
  8: 150, // 2.5 horas para 8→9cm
  9: 120, // 2 horas para 9→10cm
};

/**
 * Limiares de alerta por seção (mínimo/máximo).
 * Fonte: Regras de Negócio.md
 */
export const ALERT_THRESHOLDS = {
  // Seção 3
  fhrBaseline: { min: 110, max: 159 },
  // Seção 4
  maternalPulse: { min: 60, max: 119 },
  sbp: { min: 80, max: 139 },
  dbp: { max: 89 },
  temperatureC: { min: 35.0, max: 37.4 },
  // Seção 5
  contractionsPer10Min: { min: 3, max: 5 },
  contractionDurationSec: { min: 20, max: 60 },
} as const;
