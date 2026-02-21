import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddObservationSetAndPlan1771716288398 implements MigrationInterface {
  name = 'AddObservationSetAndPlan1771716288398';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "observation_sets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lcg_form_id" uuid NOT NULL, "recorded_at" TIMESTAMP WITH TIME ZONE NOT NULL, "section2" jsonb NOT NULL, "section3" jsonb NOT NULL, "section4" jsonb NOT NULL, "section5" jsonb NOT NULL, "section6" jsonb NOT NULL, "section7" jsonb, "has_alert" boolean NOT NULL DEFAULT false, "recorded_by" uuid NOT NULL, CONSTRAINT "PK_e12eee414e7130bbd081459ef61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_observation_sets_lcg_form_id" ON "observation_sets" ("lcg_form_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "lcg"."plans_maternal_status_enum" AS ENUM('OK', 'CONCERNS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "lcg"."plans_fetal_status_enum" AS ENUM('OK', 'CONCERNS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "lcg"."plans_progress_status_enum" AS ENUM('ADEQUATE', 'SLOW', 'INDETERMINATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "observation_set_id" uuid NOT NULL, "assessment" text NOT NULL, "maternal_status" "lcg"."plans_maternal_status_enum", "maternal_status_description" text, "fetal_status" "lcg"."plans_fetal_status_enum", "fetal_status_description" text, "progress_status" "lcg"."plans_progress_status_enum", "progress_evidence" text, "plan" text NOT NULL, "reassessment_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_by" uuid NOT NULL, CONSTRAINT "UQ_0bb3beceb634c0f6a17400eb602" UNIQUE ("observation_set_id"), CONSTRAINT "REL_0bb3beceb634c0f6a17400eb60" UNIQUE ("observation_set_id"), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_plans_observation_set_id" ON "plans" ("observation_set_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "observation_sets" ADD CONSTRAINT "FK_74c431fff22c85280cee43aece2" FOREIGN KEY ("lcg_form_id") REFERENCES "lcg_forms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "observation_sets" ADD CONSTRAINT "FK_0a7cae8e99f1d16e4d5e21a43c3" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD CONSTRAINT "FK_0bb3beceb634c0f6a17400eb602" FOREIGN KEY ("observation_set_id") REFERENCES "observation_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD CONSTRAINT "FK_7c5f6f43e87905766afe5590b56" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plans" DROP CONSTRAINT "FK_7c5f6f43e87905766afe5590b56"`);
    await queryRunner.query(`ALTER TABLE "plans" DROP CONSTRAINT "FK_0bb3beceb634c0f6a17400eb602"`);
    await queryRunner.query(
      `ALTER TABLE "observation_sets" DROP CONSTRAINT "FK_0a7cae8e99f1d16e4d5e21a43c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "observation_sets" DROP CONSTRAINT "FK_74c431fff22c85280cee43aece2"`,
    );
    await queryRunner.query(`DROP INDEX "lcg"."IDX_plans_observation_set_id"`);
    await queryRunner.query(`DROP TABLE "plans"`);
    await queryRunner.query(`DROP TYPE "lcg"."plans_progress_status_enum"`);
    await queryRunner.query(`DROP TYPE "lcg"."plans_fetal_status_enum"`);
    await queryRunner.query(`DROP TYPE "lcg"."plans_maternal_status_enum"`);
    await queryRunner.query(`DROP INDEX "lcg"."IDX_observation_sets_lcg_form_id"`);
    await queryRunner.query(`DROP TABLE "observation_sets"`);
  }
}
