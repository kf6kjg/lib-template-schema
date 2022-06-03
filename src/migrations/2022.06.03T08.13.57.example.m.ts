import { DataTypes, QueryInterface } from "sequelize";

import { HelloTag, HelloTags_Create } from "../models"; // Be warned: the model isn't initialized, so only some things will work.

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const DATABASE_NAME = "example";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export async function up(queryInterface: QueryInterface): Promise<void> {
	await down(queryInterface);

	await queryInterface.createDatabase(DATABASE_NAME, {
		charset: "utf8mb4",
		collate: "utf8mb4_0900_ai_ci",
	});

	await queryInterface.createTable(HelloTag.tableName, {
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: queryInterface.sequelize.literal("CURRENT_TIMESTAMP)"),
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		deletedReason: {
			type: DataTypes.STRING(64),
			allowNull: true,
		},
		id: {
			allowNull: false,
			defaultValue: queryInterface.sequelize.literal("UUID_TO_BIN(UUID())"),
			primaryKey: true,
			type: DataTypes.STRING(16, true),
		},
		name: {
			allowNull: false,
			type: DataTypes.TEXT("medium"),
		},
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	await queryInterface.sequelize.transaction(async (transaction) => {
		const records: HelloTags_Create[] = [
			{
				name: "John Smith",
			},
		];
		await queryInterface.bulkInsert(HelloTag.tableName, records, {
			transaction,
		});
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export async function down(queryInterface: QueryInterface): Promise<void> {
	await queryInterface.dropDatabase(DATABASE_NAME);
}
