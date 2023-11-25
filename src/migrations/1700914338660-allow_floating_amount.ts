import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowFloatingAmount1700914338660 implements MigrationInterface {
  name = 'AllowFloatingAmount1700914338660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "currency_conversion_entity"
        ADD "rate_new" numeric NOT NULL DEFAULT 0
    `);
    await queryRunner.query(`
        UPDATE "currency_conversion_entity"
        SET "rate_new" = "rate"
    `);
    await queryRunner.query(`
        ALTER TABLE "currency_conversion_entity"
        DROP COLUMN "rate"
    `);
    await queryRunner.query(`
        ALTER TABLE "currency_conversion_entity"
        RENAME COLUMN "rate_new" TO "rate"
    `);

    await queryRunner.query(`
        ALTER TABLE "payment_entity"
        ADD "amount_new" numeric NOT NULL DEFAULT 0
    `);
    await queryRunner.query(`
        UPDATE "payment_entity"
        SET "amount_new" = "amount"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment_entity"
        DROP COLUMN "amount"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment_entity"
        RENAME COLUMN "amount_new" TO "amount"
    `);

    await queryRunner.query(`
        ALTER TABLE "balance_entity"
        ADD "amount_new" numeric NOT NULL DEFAULT 0
    `);
    await queryRunner.query(`
        UPDATE "balance_entity"
        SET "amount_new" = "amount"
    `);
    await queryRunner.query(`
        ALTER TABLE "balance_entity"
        DROP COLUMN "amount"
    `);
    await queryRunner.query(`
        ALTER TABLE "balance_entity"
        RENAME COLUMN "amount_new" TO "amount"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "balance_entity" DROP COLUMN "amount"
        `);
    await queryRunner.query(`
            ALTER TABLE "balance_entity"
            ADD "amount" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "payment_entity" DROP COLUMN "amount"
        `);
    await queryRunner.query(`
            ALTER TABLE "payment_entity"
            ADD "amount" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "currency_conversion_entity" DROP COLUMN "rate"
        `);
    await queryRunner.query(`
            ALTER TABLE "currency_conversion_entity"
            ADD "rate" integer NOT NULL
        `);
  }
}
