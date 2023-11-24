import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAuth1700839472135 implements MigrationInterface {
  name = 'UserAuth1700839472135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "base_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "username" character varying NOT NULL,
                "salt" character varying NOT NULL,
                "mail" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"),
                CONSTRAINT "UQ_f512b758ebe5088b7fc0bd57200" UNIQUE ("mail"),
                CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id")
                
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "base_entity"
        `);
  }
}
