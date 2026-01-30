import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAll1769781644161 implements MigrationInterface {
    name = 'AddAll1769781644161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "slug" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "slug"`);
    }

}
