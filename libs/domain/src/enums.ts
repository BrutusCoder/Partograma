// =====================================================================
// @partograma/domain - Enums do LCG (WHO Labour Care Guide 2020)
// Fonte: Regras de Negócio.md + Documento de Requisitos
// =====================================================================

// --- Roles (RBAC) ---
export enum UserRole {
  ENFERMEIRO_OBSTETRA = 'ENFERMEIRO_OBSTETRA',
  MEDICO_OBSTETRA = 'MEDICO_OBSTETRA',
  SUPERVISOR = 'SUPERVISOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

// --- Seção 1: Identificação ---
export enum LabourOnsetType {
  SPONTANEOUS = 'SPONTANEOUS',
  INDUCED = 'INDUCED',
  UNKNOWN = 'UNKNOWN',
}

export enum RuptureStatus {
  INTACT = 'INTACT',
  RUPTURED = 'RUPTURED',
  UNKNOWN = 'UNKNOWN',
}

export enum EpisodeStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ABORTED = 'ABORTED',
  TRANSFERRED = 'TRANSFERRED',
  OTHER = 'OTHER',
}

export enum LcgFormStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED_12H = 'EXPIRED_12H',
}

// --- Seção 2: Cuidados de Suporte ---
export enum YesNo {
  Y = 'Y',
  N = 'N',
}

export enum Posture {
  SUPINE = 'SUPINE',
  UPRIGHT = 'UPRIGHT',
  LATERAL = 'LATERAL',
  SQUATTING = 'SQUATTING',
  KNEELING = 'KNEELING',
  OTHER = 'OTHER',
}

// --- Seção 3: Cuidados com o Bebê ---
export enum FhrDeceleration {
  NONE = 'NONE',
  PRESENT = 'PRESENT',
  UNKNOWN = 'UNKNOWN',
}

export enum FhrDecelerationType {
  EARLY = 'EARLY',
  LATE = 'LATE',
  VARIABLE = 'VARIABLE',
  PROLONGED = 'PROLONGED',
}

export enum AmnioticFluid {
  CLEAR = 'CLEAR',
  MECONIUM_LIGHT = 'MECONIUM_LIGHT',
  MECONIUM_MODERATE = 'MECONIUM_MODERATE',
  MECONIUM_THICK = 'MECONIUM_THICK',
  BLOOD = 'BLOOD',
  UNKNOWN = 'UNKNOWN',
}

export enum FetalPosition {
  OA = 'OA',
  OP = 'OP',
  OT = 'OT',
  LOA = 'LOA',
  ROA = 'ROA',
  LOP = 'LOP',
  ROP = 'ROP',
  LOT = 'LOT',
  ROT = 'ROT',
  UNKNOWN = 'UNKNOWN',
}

export enum CaputMoulding {
  ZERO = '0',
  PLUS_ONE = '+',
  PLUS_TWO = '++',
  PLUS_THREE = '+++',
}

// --- Seção 4: Cuidados com a Mulher ---
export enum UrineLevel {
  NEG = 'NEG',
  TRACE = 'TRACE',
  PLUS_ONE = '+',
  PLUS_TWO = '++',
  PLUS_THREE = '+++',
}

// --- Seção 7: Decisão Compartilhada ---
export enum ClinicalStatus {
  OK = 'OK',
  CONCERNS = 'CONCERNS',
}

export enum ProgressStatus {
  ADEQUATE = 'ADEQUATE',
  SLOW = 'SLOW',
  INDETERMINATE = 'INDETERMINATE',
}

// --- Alertas ---
export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertType {
  // Seção 2
  COMPANION_ABSENT = 'COMPANION_ABSENT',
  PAIN_RELIEF_NOT_PROVIDED = 'PAIN_RELIEF_NOT_PROVIDED',
  ORAL_FLUID_NOT_TAKEN = 'ORAL_FLUID_NOT_TAKEN',
  POSTURE_SUPINE = 'POSTURE_SUPINE',
  // Seção 3
  FHR_BASELINE_LOW = 'FHR_BASELINE_LOW',
  FHR_BASELINE_HIGH = 'FHR_BASELINE_HIGH',
  FHR_DECELERATION_PRESENT = 'FHR_DECELERATION_PRESENT',
  AMNIOTIC_FLUID_MECONIUM_THICK = 'AMNIOTIC_FLUID_MECONIUM_THICK',
  AMNIOTIC_FLUID_BLOOD = 'AMNIOTIC_FLUID_BLOOD',
  FETAL_POSITION_POSTERIOR = 'FETAL_POSITION_POSTERIOR',
  FETAL_POSITION_TRANSVERSE = 'FETAL_POSITION_TRANSVERSE',
  CAPUT_SEVERE = 'CAPUT_SEVERE',
  MOULDING_SEVERE = 'MOULDING_SEVERE',
  // Seção 4
  MATERNAL_PULSE_LOW = 'MATERNAL_PULSE_LOW',
  MATERNAL_PULSE_HIGH = 'MATERNAL_PULSE_HIGH',
  SBP_LOW = 'SBP_LOW',
  SBP_HIGH = 'SBP_HIGH',
  DBP_HIGH = 'DBP_HIGH',
  TEMPERATURE_LOW = 'TEMPERATURE_LOW',
  TEMPERATURE_HIGH = 'TEMPERATURE_HIGH',
  URINE_PROTEIN_HIGH = 'URINE_PROTEIN_HIGH',
  URINE_KETONES_HIGH = 'URINE_KETONES_HIGH',
  // Seção 5
  CONTRACTIONS_LOW = 'CONTRACTIONS_LOW',
  CONTRACTIONS_HIGH = 'CONTRACTIONS_HIGH',
  CONTRACTION_DURATION_LOW = 'CONTRACTION_DURATION_LOW',
  CONTRACTION_DURATION_HIGH = 'CONTRACTION_DURATION_HIGH',
  CERVICAL_PROGRESSION_SLOW = 'CERVICAL_PROGRESSION_SLOW',
  // Seção 6
  OXYTOCIN_HYPERSTIMULATION = 'OXYTOCIN_HYPERSTIMULATION',
  // Regra global
  LCG_12H_LIMIT = 'LCG_12H_LIMIT',
}

// --- Auditoria ---
export enum AuditOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
}
