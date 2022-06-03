import * as FindUp from "find-up";
import { DataType, Sequelize, SequelizeOptions } from "sequelize-typescript";
import WKX from "wkx";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export { Sequelize } from "sequelize-typescript";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
type GeoJSONValue = {
	crs?: {
		type: string;
		properties: {
			name: string;
		};
	};
};

export type PreparedSequelizeOptions = Required<
	Pick<SequelizeOptions, "dialect" | "username" | "password" | "host">
> &
	Partial<Omit<SequelizeOptions, "dialectOptions" | "modelMatch" | "models">>;

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// HACK: From https://github.com/sequelize/sequelize/issues/9786#issuecomment-474122602, plus a lot of my own reworking. ~Ricky
DataType.GEOMETRY.prototype._stringify = function _stringify(
	value: GeoJSONValue,
	options: { escape: (param: string) => string }
): string {
	if (this.srid) {
		return `ST_GeomFromText(${options.escape(
			WKX.Geometry.parseGeoJSON(value).toWkt()
		)}, ${this.srid})`;
	}
	return `ST_GeomFromText(${options.escape(
		WKX.Geometry.parseGeoJSON(value).toWkt()
	)})`;
};
DataType.GEOMETRY.prototype._bindParam = function _bindParam(
	value: GeoJSONValue,
	options: { bindParam: (param: string) => string }
): string {
	if (this.srid) {
		return `ST_GeomFromText(${options.bindParam(
			WKX.Geometry.parseGeoJSON(value).toWkt()
		)}, ${this.srid})`;
	}
	return `ST_GeomFromText(${options.bindParam(
		WKX.Geometry.parseGeoJSON(value).toWkt()
	)})`;
};

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export async function preparedSequelize(
	options: PreparedSequelizeOptions
): Promise<Sequelize> {
	const modelsdir = await FindUp.findUp("models", {
		type: "directory",
	});

	process.stderr.write("preparedSequelize called\n");

	return new Sequelize({
		models: modelsdir ? [modelsdir] : [],
		modelMatch: (filename, member): boolean =>
			member === filename || member.toLowerCase() === filename,
		dialectOptions: {
			typeCast: (
				field: { type: string; string: () => string },
				next: () => unknown
			): unknown => {
				if (field.type === "DATETIME" || field.type === "TIMESTAMP") {
					const date = new Date(field.string() + "Z");
					return isNaN(date.getTime()) ? undefined : date;
				}
				return next();
			},
		},
		define: {
			charset: "utf8mb4",
			collate: "utf8mb4_0900_ai_ci",
		},
		logging: false,
		...options,
	});
}
