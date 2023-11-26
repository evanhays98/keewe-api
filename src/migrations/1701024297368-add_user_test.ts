import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '../auth/entities/UserEntity';
import { v4 as uuid } from 'uuid';
import { BalanceEntity } from '../transactions/entities';

const createUser = async (
  pseudo: string,
  mail: string,
  currenciesIds: string[],
  queryRunner: QueryRunner,
) => {
  const user = new UserEntity();
  user.id = uuid();
  user.username = pseudo;
  user.password = 'Password1!';
  user.mail = mail;

  for (const currencyId of currenciesIds) {
    const balance = new BalanceEntity();
    balance.id = uuid();
    balance.amount = 1000;
    balance.ownerId = user.id;
    balance.currencyId = currencyId;
    await queryRunner.manager.save(balance);
  }

  await queryRunner.manager.save(user);
};

export class AddUserTest1701024297368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const currencies = await queryRunner.manager.find('currency_entity');
    const currenciesIds = currencies.map((currency) => currency.id);
    await createUser('User1', 'test@test.com', currenciesIds, queryRunner);
    await createUser('User2', 'test2@test.com', currenciesIds, queryRunner);
    await createUser('User3', 'test3@test.com', currenciesIds, queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
