import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1771715200285 implements MigrationInterface {
    name = 'InitialSchema1771715200285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "external_id" character varying(100), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_8b2b1e08348d454fcff2d580ec9" UNIQUE ("external_id"), CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "lcg"."users_role_enum" AS ENUM('ENFERMEIRO_OBSTETRA', 'MEDICO_OBSTETRA', 'SUPERVISOR', 'AUDITOR', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "username" character varying(150) NOT NULL, "email" character varying(255) NOT NULL, "first_name" character varying(150) NOT NULL, "last_name" character varying(150) NOT NULL, "role" "lcg"."users_role_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "unit_id" uuid, "keycloak_sub" character varying(255), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_d783dacd8d870efb39bbdae4236" UNIQUE ("keycloak_sub"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_keycloak_sub" ON "users" ("keycloak_sub") `);
        await queryRunner.query(`CREATE TYPE "lcg"."episodes_labour_onset_type_enum" AS ENUM('SPONTANEOUS', 'INDUCED', 'UNKNOWN')`);
        await queryRunner.query(`CREATE TYPE "lcg"."episodes_rupture_status_enum" AS ENUM('INTACT', 'RUPTURED', 'UNKNOWN')`);
        await queryRunner.query(`CREATE TYPE "lcg"."episodes_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'ABORTED', 'TRANSFERRED', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "episodes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "patient_name" character varying(255) NOT NULL, "patient_id" character varying(100), "age" smallint NOT NULL, "parity" smallint NOT NULL, "gestational_age_weeks" smallint NOT NULL, "gestational_age_days" smallint NOT NULL, "risk_factors" text array NOT NULL DEFAULT '{}', "labour_onset_type" "lcg"."episodes_labour_onset_type_enum" NOT NULL, "rupture_status" "lcg"."episodes_rupture_status_enum" NOT NULL, "rupture_at" TIMESTAMP WITH TIME ZONE, "active_labour_diagnosis_at" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "lcg"."episodes_status_enum" NOT NULL DEFAULT 'ACTIVE', "completed_at" TIMESTAMP WITH TIME ZONE, "completion_reason" text, "created_by" uuid NOT NULL, CONSTRAINT "PK_6a003fda8b0473fffc39cb831c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_episodes_status" ON "episodes" ("status") `);
        await queryRunner.query(`CREATE TYPE "lcg"."lcg_forms_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'EXPIRED_12H')`);
        await queryRunner.query(`CREATE TABLE "lcg_forms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "episode_id" uuid NOT NULL, "form_number" smallint NOT NULL DEFAULT '1', "is_continued_form" boolean NOT NULL DEFAULT false, "started_at" TIMESTAMP WITH TIME ZONE NOT NULL, "ended_at" TIMESTAMP WITH TIME ZONE, "status" "lcg"."lcg_forms_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_by" uuid NOT NULL, CONSTRAINT "PK_f947e4ebe2afd4d2736c23b4b1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_lcg_forms_episode_id" ON "lcg_forms" ("episode_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_lcg_forms_status" ON "lcg_forms" ("status") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b94ecc6be926a5d23aa7791ec8a" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "episodes" ADD CONSTRAINT "FK_8cb9ff812751cf1bc59886b3b71" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lcg_forms" ADD CONSTRAINT "FK_ac25781e4ec8b0f244bf0cf7e77" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lcg_forms" ADD CONSTRAINT "FK_d4df8df3027263363582d6c3384" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lcg_forms" DROP CONSTRAINT "FK_d4df8df3027263363582d6c3384"`);
        await queryRunner.query(`ALTER TABLE "lcg_forms" DROP CONSTRAINT "FK_ac25781e4ec8b0f244bf0cf7e77"`);
        await queryRunner.query(`ALTER TABLE "episodes" DROP CONSTRAINT "FK_8cb9ff812751cf1bc59886b3b71"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b94ecc6be926a5d23aa7791ec8a"`);
        await queryRunner.query(`DROP INDEX "lcg"."IDX_lcg_forms_status"`);
        await queryRunner.query(`DROP INDEX "lcg"."IDX_lcg_forms_episode_id"`);
        await queryRunner.query(`DROP TABLE "lcg_forms"`);
        await queryRunner.query(`DROP TYPE "lcg"."lcg_forms_status_enum"`);
        await queryRunner.query(`DROP INDEX "lcg"."IDX_episodes_status"`);
        await queryRunner.query(`DROP TABLE "episodes"`);
        await queryRunner.query(`DROP TYPE "lcg"."episodes_status_enum"`);
        await queryRunner.query(`DROP TYPE "lcg"."episodes_rupture_status_enum"`);
        await queryRunner.query(`DROP TYPE "lcg"."episodes_labour_onset_type_enum"`);
        await queryRunner.query(`DROP INDEX "lcg"."IDX_users_keycloak_sub"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "lcg"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "units"`);
    }

}
