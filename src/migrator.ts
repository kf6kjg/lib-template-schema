import { QueryInterface } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import { RunnableMigration, UmzugOptions } from "umzug/lib/types";

import {
	PreparedSequelizeOptions,
	preparedSequelize,
} from "./sequelizeinterface";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/**
 * Returns the ready to operate migration interface.
 *
 * If no migrations were found, the exception NoMigrationsFound will be thrown.
 * @param preparedSequelizeFunc For dependency injection.
 */
export async function migrator(
	dbConnectionOptions: PreparedSequelizeOptions,
	migrationsDir: string,
	globPath: string,
	umzugOptions?: Omit<
		UmzugOptions<QueryInterface>,
		"create" | "storage" | "migrations" | "context"
	>,
	preparedSequelizeFunc = preparedSequelize
): Promise<Umzug<QueryInterface>> {
	const sequelize = await preparedSequelizeFunc(dbConnectionOptions);

	return new Umzug<QueryInterface>({
		context: sequelize.getQueryInterface(),
		create: {
			folder: migrationsDir,
			template: (filepath): [string, string][] => {
				return [
					[
						`${filepath}.m.ts`,
						`import { DataTypes, QueryInterface } from "sequelize";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export async function up(queryInterface: QueryInterface): Promise<void> {
	// Write your non-transactional migration code here, e.g. alter/create/drop table, etc.

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	await queryInterface.sequelize.transaction(async transaction => {
		// Write transactional migration code here, e.g. insert, update, delete, etc.
		// Don't forget to pass the transaction variable to the options object of each operation.
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export async function down(queryInterface: QueryInterface): Promise<void> {
	await queryInterface.sequelize.transaction(async transaction => {
		// Rollback your transactional migration changes here, e.g. insert, update, delete, etc.
		// Don't forget to pass the transaction variable to the options object of each operation.
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	// Rollback your non-transactional migration changes here, e.g. alter/create/drop table, etc.
}
`,
					],
				];
			},
		},
		logger: console,
		storage: new SequelizeStorage({ sequelize }),
		migrations: {
			glob: globPath,
			resolve: ({ name, path, context }): RunnableMigration<QueryInterface> => {
				if (!path) {
					return Umzug.defaultResolver({ name, path, context });
				}

				return {
					// Drop the file extension so that old-style JS migrations converted to new-style TS migrations don't try to be re-executed.
					name: name.replace(/\.(?:[cm]?js|ts)$/i, ""),
					down: async (): Promise<void> => {
						const migration = await (import(path) as Promise<{
							down?: (q: QueryInterface) => void | Promise<void>;
						}>);

						return migration.down ? migration.down(context) : undefined;
					},
					up: async (): Promise<void> => {
						const migration = await (import(path) as Promise<{
							up?: (q: QueryInterface) => void | Promise<void>;
						}>);

						return migration.up ? migration.up(context) : undefined;
					},
				};
			},
		},
		...umzugOptions,
	});
}
