export {};

declare global {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	type KeysOfType<T, U> = {
		[K in keyof T]: T[K] extends U ? K : never;
	}[keyof T];

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	type RequiredKeys<T> = Exclude<
		KeysOfType<T, Exclude<T[keyof T], undefined>>,
		undefined
	>;

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	 * Remove all fields that are optional or undefinable from type.
	 */
	type ExcludeOptionalProps<T> = Pick<T, RequiredKeys<T>>;

	type ExcludeRequiredProps<T> = Omit<T, RequiredKeys<T>>;

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	 * Make nullable in T those types that are optional or able to be undefined
	 */
	// Thank you https://medium.com/@michael.durling/good-stuff-7d0910d7176d
	type OptionalToNullable<T> = {
		[P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
			? T[P]
			: Exclude<T[P], undefined> | null;
	};

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	 * Make optional in T those types that are assignable to U
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type Optional<T, U extends keyof any> = Omit<T, U> & Partial<T>;

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	 * Make all properties in T and its descendants readonly
	 */
	type ReadonlyRecursive<T> = {
		readonly // eslint-disable-next-line @typescript-eslint/ban-types
		[P in keyof T]: T[P] extends object ? ReadonlyRecursive<T[P]> : T[P];
	};

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	 * Require that at least one of the types in the union Keys be specified in T
	 */
	type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
		T,
		Exclude<keyof T, Keys>
	> &
		{
			[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
		}[Keys];

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	 * Cast all keys of T that extend A into keys that extend B
	 */
	type TransformAll<T, A, B> = {
		[P in keyof T]: T[P] extends A ? B : T[P];
	};
}
