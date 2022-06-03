import { expect } from "chai";

import { IdType } from "../datatypes";

import { HelloTags, HelloTags_Create, HelloTags_Update } from "./hellotags";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
describe(new URL(import.meta.url).pathname, () => {
	let tagId: Buffer;

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	it("can create a record", async () => {
		const tag: HelloTags_Create = {
			name: "Dread Pirate Roberts",
		};
		const result = await HelloTags.create(tag);

		tagId = result.id;
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	it("can modify a record", async () => {
		const tag: HelloTags_Update = {
			name: "Mr. T",
		};
		return expect(
			HelloTags.update(tag, { where: { id: tagId } })
		).to.eventually.deep.equal([1]);
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	it("can not modify the userId", async () => {
		return expect(
			HelloTags.update(
				{ id: new IdType(1).toBinary() },
				{ where: { id: tagId } }
			)
		).to.eventually.be.rejected;
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	it("can remove a record", async () => {
		return expect(
			HelloTags.destroy({
				where: { id: tagId },
			})
		).to.eventually.equal(1);
	});
});
