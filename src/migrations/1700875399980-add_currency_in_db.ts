import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrencyInDb1700875399980 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add currency EUR
    await queryRunner.query(`
            INSERT INTO currency_entity (id, "createdAt", "updatedAt", active, code, name, symbol, rates)
            VALUES (DEFAULT, now(), now(), true, 'EUR', 'Euro', '€', '{"USD": 1.18, "GBP": 0.86}');
        `);
    // add currency USD
    await queryRunner.query(`
            INSERT INTO currency_entity (id, "createdAt", "updatedAt", active, code, name, symbol, rates)
            VALUES (DEFAULT, now(), now(), true, 'USD', 'US Dollar', '$', '{"EUR": 0.85, "GBP": 0.73}');
        `);
    // add currency GBP
    await queryRunner.query(`
            INSERT INTO currency_entity (id, "createdAt", "updatedAt", active, code, name, symbol, rates)
            VALUES (DEFAULT, now(), now(), true, 'GBP', 'British Pound', '£', '{"EUR": 1.16, "USD": 1.37}');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM currency_entity WHERE code = 'EUR';
        `);
    await queryRunner.query(`
            DELETE FROM currency_entity WHERE code = 'USD';
        `);
    await queryRunner.query(`
            DELETE FROM currency_entity WHERE code = 'GBP';
        `);
  }
}
