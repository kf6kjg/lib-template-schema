import {
	AllowNull,
	Column,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Sequelize,
	Table,
} from "sequelize-typescript";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/**
 * Defines the fields of the primary key.
 */
export interface HelloTags_Key {
	id: Buffer;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/**
 * Defines all the fields in the table that are not part of the primary key.
 */
interface HelloTags_Base extends HelloTags_Key {
	deletedReason?: string;
	name: string;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/**
 * Defines which fields are needed when creating a new record.
 */
export type HelloTags_Create = Omit<
	HelloTags_Base,
	keyof HelloTags_Key | "deletedReason"
> &
	Partial<HelloTags_Key>;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/**
 * Defines the fields needed when updating a existing record.
 *
 * Note that in updates the value undefined means "don't change",
 * whereas the value null means "remove this".
 */
export type HelloTags_Update = Partial<
	Omit<OptionalToNullable<HelloTags_Base>, keyof HelloTags_Key>
>;

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
@Table({ updatedAt: false })
export class HelloTags
	extends Model<OptionalToNullable<HelloTags_Base>, HelloTags_Create>
	implements OptionalToNullable<HelloTags_Base>
{
	@AllowNull(false)
	@Default(Sequelize.literal("CURRENT_TIMESTAMP"))
	@Column(DataType.DATE)
	createdAt!: Date;

	@AllowNull(true)
	@Column(DataType.DATE)
	deletedAt!: Date | null;

	@AllowNull(true)
	@Column(DataType.STRING(64))
	deletedReason!: string | null; // Fields in a database are never undefined, only nullable.

	@PrimaryKey
	@AllowNull(false)
	@Column(DataType.STRING(16, true))
	@Default(Sequelize.literal("UUID_TO_BIN(UUID())"))
	id!: Buffer; // Learn about storing UUIDs in a fast efficient manner in MySQL: https://dev.mysql.com/blog-archive/mysql-8-0-uuid-support/

	@AllowNull(false)
	@Column(DataType.TEXT("medium"))
	name!: string; // If name was going to be unique, then it'd be the primary key.

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	// Relational connections
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export type HelloTag = HelloTags; // The singular form helps clean up weird looking code.
export const HelloTag = HelloTags;
