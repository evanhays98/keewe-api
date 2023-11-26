import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusPaymentConversion1701015419470
  implements MigrationInterface
{
  name = 'AddStatusPaymentConversion1701015419470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."currency_conversion_entity_status_enum" AS ENUM('pending', 'success', 'failed')
        `);
    await queryRunner.query(`
            ALTER TABLE "currency_conversion_entity"
            ADD "status" "public"."currency_conversion_entity_status_enum" NOT NULL DEFAULT 'success'
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."payment_entity_status_enum" AS ENUM('pending', 'success', 'failed')
        `);
    await queryRunner.query(`
            ALTER TABLE "payment_entity"
            ADD "status" "public"."payment_entity_status_enum" NOT NULL DEFAULT 'success'
        `);
    await queryRunner.query(`
            ALTER TABLE "currency_conversion_entity"
            ALTER COLUMN "rate" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "payment_entity"
            ALTER COLUMN "status" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "currency_conversion_entity"
            ALTER COLUMN "status" DROP DEFAULT
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "currency_conversion_entity"
            ALTER COLUMN "rate"
            SET DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "payment_entity" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."payment_entity_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "currency_conversion_entity" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."currency_conversion_entity_status_enum"
        `);
  }
}
