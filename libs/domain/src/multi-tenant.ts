// =====================================================================
// @partograma/domain — Contrato de multi-tenancy
//
// Toda entidade cujo escopo é restrito a uma unidade hospitalar (tenant)
// deve implementar esta interface. Isso garante:
//   1. Tipagem consistente entre domínio e persistência
//   2. Guards e interceptors genéricos de filtragem por tenant
//   3. Auditoria de acesso cross-tenant
//
// Ref.: Plano_Implementacao §1.1 "RBAC por unidade",
//       §1.4 "multi-unidade hospitalar",
//       §3.2 "Unit 1:N User"
// =====================================================================

/**
 * Branded type para o identificador de Unit (UUID v4).
 * Permite distinguir `UnitId` de `string` genérica em tempo de compilação.
 *
 * Uso:
 *   const id: UnitId = 'some-uuid' as UnitId;
 */
export type UnitId = string & { readonly __brand: 'UnitId' };

/**
 * Contrato que toda entidade com escopo de tenant deve satisfazer.
 *
 * Exemplos de entidades que devem implementar:
 *   - User     (Unit 1:N User)
 *   - Episode  (scoping de dados conforme Sprint 5: guards de role + unidade)
 *
 * Uso na persistence layer (TypeORM):
 *   @Column({ name: 'unit_id', type: 'uuid', nullable: true })
 *   unitId!: UnitId | null;
 */
export interface MultiTenantEntity {
  /** FK lógica para Unit.id — identifica o tenant proprietário */
  unitId?: UnitId | null;
}

/**
 * Utility: asserta que um valor é um UnitId válido (non-null, non-empty).
 * Útil em guards e interceptors onde o unitId é obrigatório.
 */
export function assertUnitId(value: unknown): asserts value is UnitId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('UnitId inválido: deve ser uma string UUID não-vazia');
  }
}
