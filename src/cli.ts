/* eslint-disable no-process-env */
import * as Path from "node:path";

import * as DatabaseMigrator from "./migrator";

// TODO: add DotEnv support, and add documentation to README.

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const migrationsDir = Path.resolve(
	Path.dirname(new URL(import.meta.url).pathname),
	"migrations"
);
const migrationGlob = "/**/*.[ms].[jt]s";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const database = process.env.DATABASE_NAME;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const host = process.env.DATABASE_HOST;
if (!host) {
	process.stderr.write(`Environment missing DATABASE_HOST\n`);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const password = process.env.DATABASE_ADMIN_PASSWORD;
if (!password) {
	process.stderr.write(`Environment missing DATABASE_ADMIN_PASSWORD\n`);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const port = process.env.DATABASE_PORT
	? parseInt(process.env.DATABASE_PORT)
	: undefined;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const username = process.env.DATABASE_ADMIN_USER;
if (!username) {
	process.stderr.write(`Environment missing DATABASE_ADMIN_USER\n`);
}

if (!(database && host && password && username)) {
	process.exit(1);
}

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
DatabaseMigrator.migrator(
	{
		database,
		dialect: "mysql",
		host,
		password,
		port,
		username,
	},
	migrationsDir,
	Path.join(migrationsDir, migrationGlob)
)
	.then(async (migrator) => {
		await migrator.runAsCLI(process.argv.slice(2));
	})
	.catch((error) => {
		if (error instanceof Error) {
			process.stderr.write(error.stack ?? error.message);
		} else {
			process.stderr.write(String(error));
		}
		process.stderr.write("\n");
		process.exit(1);
	});
