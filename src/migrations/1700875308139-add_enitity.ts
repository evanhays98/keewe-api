import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnitity1700875308139 implements MigrationInterface {
  name = 'AddEnitity1700875308139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "balance_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "ownerId" character varying NOT NULL,
                "currencyId" character varying NOT NULL,
                "amount" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_12ed73eeb1db3cc480a6a0ed73b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "currency_conversion_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "ownerId" character varying NOT NULL,
                "fromCurrencyId" character varying NOT NULL,
                "toCurrencyId" character varying NOT NULL,
                "amount" integer NOT NULL DEFAULT '0',
                "rate" integer NOT NULL,
                CONSTRAINT "PK_5c7c336b132b5647b9a8afadba1" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."currency_entity_code_enum" AS ENUM('USD', 'EUR', 'GBP')
        `);
    await queryRunner.query(`
            CREATE TABLE "currency_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "active" boolean NOT NULL DEFAULT true,
                "code" "public"."currency_entity_code_enum" NOT NULL,
                "name" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "rates" jsonb,
                CONSTRAINT "UQ_3090a4e5dfaa65adeea2513ac30" UNIQUE ("code"),
                CONSTRAINT "PK_01dd40ec85a5fffcd14f8bcf88f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "payment_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "senderId" character varying NOT NULL,
                "recipientId" character varying NOT NULL,
                "currencyId" character varying NOT NULL,
                "amount" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_6c397c81035bd5b42d16ef3bc70" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "payment_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "currency_entity"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."currency_entity_code_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "currency_conversion_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "balance_entity"
        `);
  }
}
