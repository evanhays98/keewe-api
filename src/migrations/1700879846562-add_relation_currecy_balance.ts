import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationCurrecyBalance1700879846562
  implements MigrationInterface
{
  name = 'AddRelationCurrecyBalance1700879846562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "balance_entity" DROP COLUMN "currencyId"
        `);
    await queryRunner.query(`
            ALTER TABLE "balance_entity"
            ADD "currencyId" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "balance_entity"
            ADD CONSTRAINT "FK_3d642b8e0599eda2c9cb0ead9f8" FOREIGN KEY ("currencyId") REFERENCES "currency_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "balance_entity" DROP CONSTRAINT "FK_3d642b8e0599eda2c9cb0ead9f8"
        `);
    await queryRunner.query(`
            ALTER TABLE "balance_entity" DROP COLUMN "currencyId"
        `);
    await queryRunner.query(`
            ALTER TABLE "balance_entity"
            ADD "currencyId" character varying NOT NULL
        `);
  }
}
