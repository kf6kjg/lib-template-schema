import UUID from "pure-uuid";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
interface IdTypeOptions {
	/** If swapFlag is true, and it is by default, the byte order in binary representations will be reversed as per https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html#function_uuid-to-bin */
	swapFlag?: boolean;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
interface IdTypeOptionsSet extends IdTypeOptions {
	swapFlag: boolean;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export class IdType {
	private _id: UUID;
	private _options: IdTypeOptionsSet;

	/** If no parameters are provided a new V4 UUID will be generated. */
	constructor(
		idOrVersion?: string | Buffer | UUID | number,
		options?: IdTypeOptions
	) {
		this._options = {
			swapFlag: true,
			...options,
		};

		if (idOrVersion instanceof UUID) {
			// Copy the value.
			this._id = new UUID().import(idOrVersion.export());
		} else if (idOrVersion instanceof Buffer) {
			if (this._options.swapFlag) {
				this._id = new UUID().import([
					...idOrVersion.slice(4, 8),
					...idOrVersion.slice(2, 4),
					...idOrVersion.slice(0, 2),
					...idOrVersion.slice(8),
				]);
			} else {
				this._id = new UUID().import([...idOrVersion]);
			}
		} else if (typeof idOrVersion === "string") {
			this._id = new UUID(idOrVersion);
		} else {
			this._id = new UUID(idOrVersion ?? 4);
		}
	}

	equal(other: IdType | Buffer): boolean {
		if (other instanceof IdType) {
			return this._id.equal(other._id);
		}

		return this._id.equal(new IdType(other)._id);
	}

	toBinary(): Buffer {
		const exportedId = this._id.export();

		if (this._options.swapFlag) {
			return Buffer.from([
				...exportedId.slice(6, 8),
				...exportedId.slice(4, 6),
				...exportedId.slice(0, 4),
				...exportedId.slice(8),
			]);
		}

		return Buffer.from(exportedId);
	}

	toJSON(): string {
		return this._id.toString();
	}

	toString(): string {
		return this._id.toString();
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export type IdTypeNullable = IdType | null;
