import { expect } from "chai";
import { Sequelize } from "sequelize-typescript";
import Sinon from "sinon";

import { preparedSequelize } from "./preparedsequelize";
import {
	AlreadyInitialized,
	InitWasNotCalledFirst,
	getSequelizeSingleton,
	initSingleton,
} from "./sequelizesingleton";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
describe(new URL(import.meta.url).pathname, () => {
	const sinonSandbox = Sinon.createSandbox();

	const preparedSequelizeStub = sinonSandbox
		.stub<
			Parameters<typeof preparedSequelize>,
			ReturnType<typeof preparedSequelize>
		>()
		.rejects(new Error("Don't trust the defaults"));

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	afterEach(() => {
		sinonSandbox.reset();
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	describe(getSequelizeSingleton.name, () => {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it(`throws error if ${initSingleton.name} is not called first`, () => {
			expect(() => getSequelizeSingleton()).to.throw(InitWasNotCalledFirst);
		});
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	describe(initSingleton.name, () => {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it(`returns the expected Sequelize instance`, async () => {
			const fakeSequelize = {} as Sequelize;
			preparedSequelizeStub.resolves(fakeSequelize);

			return expect(
				initSingleton(
					{
						database: "",
						dialect: "mysql",
						host: "",
						password: "",
						username: "",
					},
					preparedSequelizeStub
				)
			).to.eventually.equal(fakeSequelize);
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it(`throws when called a second time`, async () => {
			return expect(
				initSingleton(
					{
						database: "",
						dialect: "mysql",
						host: "",
						password: "",
						username: "",
					},
					preparedSequelizeStub
				)
			).to.eventually.be.rejectedWith(AlreadyInitialized);
		});
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	describe(getSequelizeSingleton.name, () => {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it(`returns the same instance across multiple calls`, () => {
			const sequelize = getSequelizeSingleton();

			expect(getSequelizeSingleton()).to.equal(sequelize);
			expect(getSequelizeSingleton()).to.equal(sequelize);
		});
	});
});
