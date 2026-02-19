// =====================================================================
// @partograma/validators - Motor de validação e alertas do LCG
// Implementa regras clínicas do WHO Labour Care Guide 2020
// =====================================================================

import {
  AlertType,
  AlertSeverity,
  YesNo,
  Posture,
  AmnioticFluid,
  FetalPosition,
  CaputMoulding,
  UrineLevel,
  FhrDeceleration,
  ALERT_THRESHOLDS,
  CERVICAL_PROGRESSION_THRESHOLDS,
  LCG_MAX_DURATION_MINUTES,
} from '@partograma/domain';
import type {
  Section2Data,
  Section3Data,
  Section4Data,
  Section5Data,
  Section6Data,
  CreateObservationDto,
} from '@partograma/domain';

export interface AlertResult {
  type: AlertType;
  severity: AlertSeverity;
  value: string;
  description: string;
}

// --- Seção 2: Cuidados de Suporte (RG-2.1 a RG-2.4) ---
export function checkSection2Alerts(data: Section2Data): AlertResult[] {
  const alerts: AlertResult[] = [];

  if (data.companionPresent === YesNo.N) {
    alerts.push({
      type: AlertType.COMPANION_ABSENT,
      severity: AlertSeverity.MEDIUM,
      value: 'N',
      description: 'Acompanhante ausente - oferecer acompanhante escolhido',
    });
  }

  if (data.painReliefProvided === YesNo.N) {
    alerts.push({
      type: AlertType.PAIN_RELIEF_NOT_PROVIDED,
      severity: AlertSeverity.MEDIUM,
      value: 'N',
      description: 'Alívio da dor não fornecido - verificar oferta e necessidade',
    });
  }

  if (data.oralFluidEncouragedOrTaken === YesNo.N) {
    alerts.push({
      type: AlertType.ORAL_FLUID_NOT_TAKEN,
      severity: AlertSeverity.MEDIUM,
      value: 'N',
      description: 'Líquidos orais não encorajados/ingeridos',
    });
  }

  if (data.posture === Posture.SUPINE) {
    alerts.push({
      type: AlertType.POSTURE_SUPINE,
      severity: AlertSeverity.MEDIUM,
      value: 'SUPINE',
      description: 'Posição supina - encorajar posição verticalizada',
    });
  }

  return alerts;
}

// --- Seção 3: Cuidados com o Bebê (RG-3.1 a RG-3.6) ---
export function checkSection3Alerts(data: Section3Data): AlertResult[] {
  const alerts: AlertResult[] = [];
  const th = ALERT_THRESHOLDS;

  // RG-3.1: FCF Baseline
  if (data.fhrBaseline < th.fhrBaseline.min) {
    alerts.push({
      type: AlertType.FHR_BASELINE_LOW,
      severity: AlertSeverity.HIGH,
      value: `${data.fhrBaseline} bpm`,
      description: `FCF bradicardia: ${data.fhrBaseline} bpm (limiar: ≥${th.fhrBaseline.min})`,
    });
  }
  if (data.fhrBaseline >= th.fhrBaseline.max + 1) {
    alerts.push({
      type: AlertType.FHR_BASELINE_HIGH,
      severity: AlertSeverity.HIGH,
      value: `${data.fhrBaseline} bpm`,
      description: `FCF taquicardia: ${data.fhrBaseline} bpm (limiar: <${th.fhrBaseline.max + 1})`,
    });
  }

  // RG-3.2: Desaceleração
  if (data.fhrDeceleration === FhrDeceleration.PRESENT) {
    alerts.push({
      type: AlertType.FHR_DECELERATION_PRESENT,
      severity: AlertSeverity.HIGH,
      value: 'PRESENT',
      description: 'Desaceleração da FCF detectada - avaliar tipo e gravidade',
    });
  }

  // RG-3.3: Líquido amniótico
  if (data.amnioticFluid === AmnioticFluid.MECONIUM_THICK) {
    alerts.push({
      type: AlertType.AMNIOTIC_FLUID_MECONIUM_THICK,
      severity: AlertSeverity.HIGH,
      value: 'M+++',
      description: 'Mecônio espesso (M+++) - avaliar conduta obstétrica',
    });
  }
  if (data.amnioticFluid === AmnioticFluid.BLOOD) {
    alerts.push({
      type: AlertType.AMNIOTIC_FLUID_BLOOD,
      severity: AlertSeverity.CRITICAL,
      value: 'BLOOD',
      description: 'Sangue no líquido amniótico - avaliação urgente',
    });
  }

  // RG-3.4: Posição fetal
  const posteriorPositions: FetalPosition[] = [
    FetalPosition.OP,
    FetalPosition.LOP,
    FetalPosition.ROP,
  ];
  const transversePositions: FetalPosition[] = [
    FetalPosition.OT,
    FetalPosition.LOT,
    FetalPosition.ROT,
  ];

  if (posteriorPositions.includes(data.fetalPosition)) {
    alerts.push({
      type: AlertType.FETAL_POSITION_POSTERIOR,
      severity: AlertSeverity.MEDIUM,
      value: data.fetalPosition,
      description: 'Posição fetal posterior - considerar mudanças posturais',
    });
  }
  if (transversePositions.includes(data.fetalPosition)) {
    alerts.push({
      type: AlertType.FETAL_POSITION_TRANSVERSE,
      severity: AlertSeverity.MEDIUM,
      value: data.fetalPosition,
      description: 'Posição fetal transversa - reavaliação necessária',
    });
  }

  // RG-3.5 e RG-3.6: Bossa e Cavalgamento
  if (data.caput === CaputMoulding.PLUS_THREE) {
    alerts.push({
      type: AlertType.CAPUT_SEVERE,
      severity: AlertSeverity.HIGH,
      value: '+++',
      description: 'Bossa significativa (+++) - avaliar progressão e obstrução',
    });
  }
  if (data.moulding === CaputMoulding.PLUS_THREE) {
    alerts.push({
      type: AlertType.MOULDING_SEVERE,
      severity: AlertSeverity.HIGH,
      value: '+++',
      description: 'Cavalgamento significativo (+++) - avaliar desproporção',
    });
  }

  return alerts;
}

// --- Seção 4: Cuidados com a Mulher (RG-4.1 a RG-4.6) ---
export function checkSection4Alerts(data: Section4Data): AlertResult[] {
  const alerts: AlertResult[] = [];
  const th = ALERT_THRESHOLDS;

  // RG-4.1: Pulso
  if (data.maternalPulse < th.maternalPulse.min) {
    alerts.push({
      type: AlertType.MATERNAL_PULSE_LOW,
      severity: AlertSeverity.HIGH,
      value: `${data.maternalPulse} bpm`,
      description: `Pulso materno baixo: ${data.maternalPulse} bpm (limiar: ≥${th.maternalPulse.min})`,
    });
  }
  if (data.maternalPulse >= th.maternalPulse.max + 1) {
    alerts.push({
      type: AlertType.MATERNAL_PULSE_HIGH,
      severity: AlertSeverity.HIGH,
      value: `${data.maternalPulse} bpm`,
      description: `Pulso materno elevado: ${data.maternalPulse} bpm (limiar: <${th.maternalPulse.max + 1})`,
    });
  }

  // RG-4.2: PA Sistólica
  if (data.sbp < th.sbp.min) {
    alerts.push({
      type: AlertType.SBP_LOW,
      severity: AlertSeverity.HIGH,
      value: `${data.sbp} mmHg`,
      description: `PA sistólica baixa: ${data.sbp} mmHg (limiar: ≥${th.sbp.min})`,
    });
  }
  if (data.sbp >= th.sbp.max + 1) {
    alerts.push({
      type: AlertType.SBP_HIGH,
      severity: AlertSeverity.CRITICAL,
      value: `${data.sbp} mmHg`,
      description: `PA sistólica elevada: ${data.sbp} mmHg (limiar: <${th.sbp.max + 1})`,
    });
  }

  // RG-4.3: PA Diastólica
  if (data.dbp >= th.dbp.max + 1) {
    alerts.push({
      type: AlertType.DBP_HIGH,
      severity: AlertSeverity.HIGH,
      value: `${data.dbp} mmHg`,
      description: `PA diastólica elevada: ${data.dbp} mmHg (limiar: <${th.dbp.max + 1})`,
    });
  }

  // RG-4.4: Temperatura
  if (data.temperatureC < th.temperatureC.min) {
    alerts.push({
      type: AlertType.TEMPERATURE_LOW,
      severity: AlertSeverity.HIGH,
      value: `${data.temperatureC}°C`,
      description: `Hipotermia: ${data.temperatureC}°C (limiar: ≥${th.temperatureC.min})`,
    });
  }
  if (data.temperatureC >= th.temperatureC.max + 0.1) {
    alerts.push({
      type: AlertType.TEMPERATURE_HIGH,
      severity: AlertSeverity.HIGH,
      value: `${data.temperatureC}°C`,
      description: `Febre: ${data.temperatureC}°C (limiar: <${th.temperatureC.max + 0.1})`,
    });
  }

  // RG-4.5: Urina - Proteína
  const highLevels: UrineLevel[] = [UrineLevel.PLUS_TWO, UrineLevel.PLUS_THREE];
  if (highLevels.includes(data.urineProtein)) {
    alerts.push({
      type: AlertType.URINE_PROTEIN_HIGH,
      severity: AlertSeverity.HIGH,
      value: data.urineProtein,
      description: `Proteinúria elevada: ${data.urineProtein} (limiar: <++)`,
    });
  }

  // RG-4.6: Urina - Cetonas
  if (highLevels.includes(data.urineKetones)) {
    alerts.push({
      type: AlertType.URINE_KETONES_HIGH,
      severity: AlertSeverity.HIGH,
      value: data.urineKetones,
      description: `Cetonúria elevada: ${data.urineKetones} (limiar: <++)`,
    });
  }

  return alerts;
}

// --- Seção 5: Progresso do TP (RG-5.1 a RG-5.3) ---
export function checkSection5Alerts(data: Section5Data): AlertResult[] {
  const alerts: AlertResult[] = [];
  const th = ALERT_THRESHOLDS;

  // RG-5.1: Contrações
  if (data.contractionsPer10Min <= th.contractionsPer10Min.min - 1) {
    alerts.push({
      type: AlertType.CONTRACTIONS_LOW,
      severity: AlertSeverity.MEDIUM,
      value: `${data.contractionsPer10Min}/10min`,
      description: `Contrações insuficientes: ${data.contractionsPer10Min}/10min (limiar: ≥${th.contractionsPer10Min.min})`,
    });
  }
  if (data.contractionsPer10Min > th.contractionsPer10Min.max) {
    alerts.push({
      type: AlertType.CONTRACTIONS_HIGH,
      severity: AlertSeverity.HIGH,
      value: `${data.contractionsPer10Min}/10min`,
      description: `Contrações excessivas: ${data.contractionsPer10Min}/10min (limiar: ≤${th.contractionsPer10Min.max})`,
    });
  }

  // RG-5.2: Duração das contrações
  if (data.contractionDurationSec < th.contractionDurationSec.min) {
    alerts.push({
      type: AlertType.CONTRACTION_DURATION_LOW,
      severity: AlertSeverity.MEDIUM,
      value: `${data.contractionDurationSec}s`,
      description: `Contrações curtas: ${data.contractionDurationSec}s (limiar: ≥${th.contractionDurationSec.min}s)`,
    });
  }
  if (data.contractionDurationSec > th.contractionDurationSec.max) {
    alerts.push({
      type: AlertType.CONTRACTION_DURATION_HIGH,
      severity: AlertSeverity.HIGH,
      value: `${data.contractionDurationSec}s`,
      description: `Contrações longas: ${data.contractionDurationSec}s (limiar: ≤${th.contractionDurationSec.max}s)`,
    });
  }

  return alerts;
}

// --- RG-5.3: Progressão cervical (chamado com dados temporais) ---
export interface CervicalProgressionInput {
  currentDilationCm: number;
  currentTimestamp: string;
  previousDilationCm: number;
  previousTimestamp: string;
}

export function checkCervicalProgression(input: CervicalProgressionInput): AlertResult | null {
  const currentCm = Math.floor(input.currentDilationCm);
  const previousCm = Math.floor(input.previousDilationCm);

  if (currentCm < 5 || currentCm > 9) return null;

  const threshold = CERVICAL_PROGRESSION_THRESHOLDS[previousCm];
  if (!threshold) return null;

  const deltaCm = input.currentDilationCm - input.previousDilationCm;
  const deltaMinutes =
    (new Date(input.currentTimestamp).getTime() - new Date(input.previousTimestamp).getTime()) /
    (1000 * 60);

  if (deltaCm < 1 && deltaMinutes >= threshold) {
    return {
      type: AlertType.CERVICAL_PROGRESSION_SLOW,
      severity: AlertSeverity.HIGH,
      value: `${input.currentDilationCm}cm após ${Math.round(deltaMinutes)}min`,
      description: `Progressão cervical lenta: ${previousCm}→${currentCm}cm em ${Math.round(deltaMinutes)}min (limiar: ${threshold}min)`,
    };
  }

  return null;
}

// --- RG-6.1: Ocitocina + Hiperestimulação ---
export function checkOxytocinAlerts(
  section5: Section5Data,
  section6: Section6Data,
): AlertResult[] {
  const alerts: AlertResult[] = [];

  if (
    section6.oxytocinUsed &&
    (section5.contractionsPer10Min > 5 || section5.contractionDurationSec > 60)
  ) {
    alerts.push({
      type: AlertType.OXYTOCIN_HYPERSTIMULATION,
      severity: AlertSeverity.CRITICAL,
      value: `Ocitocina + ${section5.contractionsPer10Min}/10min, ${section5.contractionDurationSec}s`,
      description: 'Risco de hiperestimulação uterina com ocitocina - avaliar redução/suspensão',
    });
  }

  return alerts;
}

// --- RG-3: Regra das 12 horas ---
export function checkLcg12HourLimit(
  startedAt: string,
  currentTimestamp: string,
): AlertResult | null {
  const elapsed =
    (new Date(currentTimestamp).getTime() - new Date(startedAt).getTime()) / (1000 * 60);

  if (elapsed >= LCG_MAX_DURATION_MINUTES) {
    return {
      type: AlertType.LCG_12H_LIMIT,
      severity: AlertSeverity.CRITICAL,
      value: `${Math.round(elapsed)}min`,
      description: `LCG excedeu 12h (${Math.round(elapsed)}min) - bloquear e criar novo LCG encadeado`,
    };
  }

  return null;
}

// --- Função principal: valida observação completa ---
export function validateObservation(
  dto: CreateObservationDto,
  lcgStartedAt: string,
  previousDilation?: { cm: number; timestamp: string },
): AlertResult[] {
  const alerts: AlertResult[] = [
    ...checkSection2Alerts(dto.section2),
    ...checkSection3Alerts(dto.section3),
    ...checkSection4Alerts(dto.section4),
    ...checkSection5Alerts(dto.section5),
    ...checkOxytocinAlerts(dto.section5, dto.section6),
  ];

  // Progressão cervical
  if (previousDilation) {
    const progressionAlert = checkCervicalProgression({
      currentDilationCm: dto.section5.cervicalDilationCm,
      currentTimestamp: dto.recordedAt,
      previousDilationCm: previousDilation.cm,
      previousTimestamp: previousDilation.timestamp,
    });
    if (progressionAlert) alerts.push(progressionAlert);
  }

  // Regra 12h
  const limit12h = checkLcg12HourLimit(lcgStartedAt, dto.recordedAt);
  if (limit12h) alerts.push(limit12h);

  return alerts;
}
