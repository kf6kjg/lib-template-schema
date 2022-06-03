import {
	PreparedSequelizeOptions,
	Sequelize,
	preparedSequelize,
} from "./preparedsequelize";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export class InitWasNotCalledFirst extends Error {
	constructor() {
		super(
			`Call ${initSingleton.name} before accessing the Sequelize singleton.`
		);
		this.name = InitWasNotCalledFirst.name;
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export class AlreadyInitialized extends Error {
	constructor() {
		super(
			`The Sequelize singleton is only allowed to be initialized a single time. You are probably looking to call ${getSequelizeSingleton.name}() instead of ${initSingleton.name}.`
		);
		this.name = AlreadyInitialized.name;
	}
}

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
let instance: Sequelize;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/**
 * Be sure to call the initSingleton function before calling this function.
 * Throws SequelizeSingletonInitWasNotCalledFirst if executed in the incorrect order.
 *
 * @returns The pre-initialized Sequelize singleton.
 */
export function getSequelizeSingleton(): Sequelize {
	if (instance) {
		return instance;
	}

	throw new InitWasNotCalledFirst();
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/**
 * Creates the Sequelize singleton if it hasn't been initialized already.
 * If called more than once throws SequelizeSingletonAlreadyInitialized.
 *
 * @param dbConnectionOptions The database connection information.
 * @param preparedSequelizeFunc For dependency injection.
 * @returns A reference to the singleton.
 */
export async function initSingleton(
	dbConnectionOptions: PreparedSequelizeOptions,
	preparedSequelizeFunc = preparedSequelize
): Promise<Sequelize> {
	if (instance) {
		throw new AlreadyInitialized();
	}
	instance = await preparedSequelizeFunc(dbConnectionOptions);
	return instance;
}
