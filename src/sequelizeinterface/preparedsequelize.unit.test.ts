import { expect } from "chai";
import { Sequelize } from "sequelize-typescript";
import Sinon from "sinon";

import { preparedSequelize } from "./preparedsequelize";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
describe(new URL(import.meta.url).pathname, () => {
	const sinonSandbox = Sinon.createSandbox();

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	afterEach(() => {
		sinonSandbox.restore();
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	describe(preparedSequelize.name, () => {
		let mockSequelize: Sinon.SinonStubbedInstance<Sequelize>;

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		beforeEach(() => {
			mockSequelize = sinonSandbox.createStubInstance(Sequelize);
		});

		it.skip("needs tests", () => {
			mockSequelize;
			expect(true).to.be.true;
		});
	});
});
