import { AppDataSource } from '../data-source';

export const runMigrations = async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
};

runMigrations()
  .then(() => {
    console.log('Migrations run successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running migrations', error);
    process.exit(1);
  });
