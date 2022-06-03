import { expect } from "chai";
import UUID from "pure-uuid";
import Sinon from "sinon";

import { IdType } from ".";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
describe(new URL(import.meta.url).pathname, () => {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	describe(`${IdType.name} testing`, () => {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		afterEach(() => {
			Sinon.restore();
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly ingests a string, no swapping", () => {
			const id = new IdType("00112233-4455-1677-8899-AABBCCDDEEFF", {
				swapFlag: false,
			});

			expect(id.toString()).to.equal("00112233-4455-1677-8899-aabbccddeeff");
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly ingests a string, with swapping", () => {
			const id = new IdType("00112233-4455-1677-8899-AABBCCDDEEFF", {
				swapFlag: true,
			});

			expect(id.toString()).to.equal("00112233-4455-1677-8899-aabbccddeeff");
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly ingests a Buffer, no swapping", () => {
			const importSpy = Sinon.spy(UUID.prototype, "import");

			new IdType(
				Buffer.from([
					0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa,
					0xbb, 0xcc, 0xdd, 0xee, 0xff,
				]),
				{
					swapFlag: false,
				}
			);

			expect(importSpy.args[0][0]).to.deep.equal([
				0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
				0xcc, 0xdd, 0xee, 0xff,
			]);
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly ingests a swapped Buffer", () => {
			const importSpy = Sinon.spy(UUID.prototype, "import");

			new IdType(
				// Value sequence taken from MySQL: UUID_TO_BIN('00112233-4455-1677-8899-aabbccddeeff', 1)
				Buffer.from([
					0x16, 0x77, 0x44, 0x55, 0x00, 0x11, 0x22, 0x33, 0x88, 0x99, 0xaa,
					0xbb, 0xcc, 0xdd, 0xee, 0xff,
				]),
				{
					swapFlag: true,
				}
			);

			// Matches BIN_TO_UUID(X'16774455001122338899aabbccddeeff', 1)
			expect(importSpy.args[0][0]).to.deep.equal([
				0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x16, 0x77, 0x88, 0x99, 0xaa, 0xbb,
				0xcc, 0xdd, 0xee, 0xff,
			]);
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly exports using toBinary, no swapping", () => {
			const exportFake = Sinon.fake.returns([
				0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x16, 0x77, 0x88, 0x99, 0xaa, 0xbb,
				0xcc, 0xdd, 0xee, 0xff,
			]);
			Sinon.replace(UUID.prototype, "export", exportFake);

			const id = new IdType(4, {
				swapFlag: false,
			});

			expect([...id.toBinary()]).to.deep.equal([
				0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x16, 0x77, 0x88, 0x99, 0xaa, 0xbb,
				0xcc, 0xdd, 0xee, 0xff,
			]);
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly exports using toString, no swapping", () => {
			const id = new IdType(
				Buffer.from([
					0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x16, 0x77, 0x88, 0x99, 0xaa,
					0xbb, 0xcc, 0xdd, 0xee, 0xff,
				]),
				{
					swapFlag: false,
				}
			);

			expect(id.toString().toLowerCase()).to.equal(
				"00112233-4455-1677-8899-aabbccddeeff"
			);
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly exports using toBinary, with swapping", () => {
			const exportFake = Sinon.fake.returns([
				0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x16, 0x77, 0x88, 0x99, 0xaa, 0xbb,
				0xcc, 0xdd, 0xee, 0xff,
			]);
			Sinon.replace(UUID.prototype, "export", exportFake);

			const id = new IdType(4, {
				swapFlag: true,
			});

			expect([...id.toBinary()]).to.deep.equal([
				// Value sequence taken from MySQL: UUID_TO_BIN('00112233-4455-1677-8899-aabbccddeeff', 1)
				0x16,
				0x77, 0x44, 0x55, 0x00, 0x11, 0x22, 0x33, 0x88, 0x99, 0xaa, 0xbb, 0xcc,
				0xdd, 0xee, 0xff,
			]);
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly exports using toString, with swapping", () => {
			const id = new IdType(
				Buffer.from([
					// Value sequence taken from MySQL: UUID_TO_BIN('00112233-4455-1677-8899-aabbccddeeff', 1)
					0x16,
					0x77, 0x44, 0x55, 0x00, 0x11, 0x22, 0x33, 0x88, 0x99, 0xaa, 0xbb,
					0xcc, 0xdd, 0xee, 0xff,
				]),
				{
					swapFlag: true,
				}
			);

			expect(id.toString().toLowerCase()).to.equal(
				"00112233-4455-1677-8899-aabbccddeeff"
			);
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly compares an ID to itself", () => {
			const id = new IdType(4);

			expect(id.equal(id)).to.be.true;
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly compares two matched IDs", () => {
			const id1 = new IdType(
				Buffer.from([
					0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa,
					0xbb, 0xcc, 0xdd, 0xee, 0xff,
				]),
				{
					swapFlag: false,
				}
			);
			const id2 = new IdType("00112233-4455-6677-8899-aabbccddeeff");

			expect(id1.equal(id2)).to.be.true;
		});

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		it("correctly compares two different IDs", () => {
			const id1 = new IdType(
				Buffer.from([
					0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa,
					0xbb, 0xcc, 0xdd, 0xee, 0xff,
				]),
				{
					swapFlag: false,
				}
			);
			const id2 = new IdType("00112233-4455-6677-8899-000000000000");

			expect(id1.equal(id2)).to.be.false;
		});
	});
});
