## Template SQL schema definition and migration control library

## Migrations

Once the application is started it will automatically run the migrations in the `migrations` folder. Thus when writing a migration you only need to deal with converting existing tables or data.

Only migrations that have never been run before on the database will be executed.

### Seeders

Seeders are to provide new starting data to the database. If you are changing existing data that probably belongs in a migration.

Seeders run in sync with migrations, thus seeders provide data at the version of the database they were initially created to operate against. As a consequence a seeder can be simply considered to be a special case of a migration that only adds data.

Only seeders that have never been run before on the database will be executed.

### Creating a migration or seeder

Create new migrations using either the VSCode `Create new migration` task or by executing the following command from the project root folder:

```sh
DATABASE_NAME=test DATABASE_HOST=localhost DATABASE_ADMIN_PASSWORD=password DATABASE_ADMIN_USER=root DATABASE_PORT=3306 npm run -- migration create --name yourMigrationName
```

The result will be a new migration TypeScript file in `src/migrations`.

Be sure to manually edit the relevant models to match.

## Principles of good migration design

TODO
