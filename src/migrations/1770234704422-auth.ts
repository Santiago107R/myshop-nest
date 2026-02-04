import { MigrationInterface, QueryRunner } from "typeorm";

export class Auth1770234704422 implements MigrationInterface {
    name = 'Auth1770234704422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" text NOT NULL, "password" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "roles" text array NOT NULL DEFAULT '{user}', CONSTRAINT "UQ_035190f70c9aff0ef331258d28b" UNIQUE ("fullName"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
