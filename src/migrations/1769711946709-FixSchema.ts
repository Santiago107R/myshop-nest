import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSchema1769711946709 implements MigrationInterface {
    name = 'FixSchema1769711946709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_image" ("id" SERIAL NOT NULL, "url" text NOT NULL, "productId" uuid, CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."product_state_enum" AS ENUM('new', 'sold')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "description" text, "price" double precision NOT NULL, "state" "public"."product_state_enum" NOT NULL DEFAULT 'new', CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buyer" ("id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_0480fc3c7289846a31b8e1bc503" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sell" ("id" SERIAL NOT NULL, "date" date NOT NULL, "price" double precision NOT NULL, "productId" uuid, "buyerId" integer, CONSTRAINT "REL_c3d6246f2344bf0ce5299f65fd" UNIQUE ("productId"), CONSTRAINT "PK_8cc9d759945a4176103696feedf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sell" ADD CONSTRAINT "FK_c3d6246f2344bf0ce5299f65fd4" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sell" ADD CONSTRAINT "FK_c7966be0cd503cbe438010c569f" FOREIGN KEY ("buyerId") REFERENCES "buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sell" DROP CONSTRAINT "FK_c7966be0cd503cbe438010c569f"`);
        await queryRunner.query(`ALTER TABLE "sell" DROP CONSTRAINT "FK_c3d6246f2344bf0ce5299f65fd4"`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2"`);
        await queryRunner.query(`DROP TABLE "sell"`);
        await queryRunner.query(`DROP TABLE "buyer"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_state_enum"`);
        await queryRunner.query(`DROP TABLE "product_image"`);
    }

}
