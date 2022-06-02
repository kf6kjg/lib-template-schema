// See https://github.com/okonet/lint-staged#configuration
import { ESLint } from "eslint";

const eslint = new ESLint({});

async function asyncFilter(arr, predicate) {
	return Promise.all(arr.map(predicate)).then((results) =>
		arr.filter((_v, index) => results[index])
	);
}

async function filter(prefix, files) {
	const filteredFiles = (
		await asyncFilter(
			files,
			async (file) =>
				!(prefix.startsWith("eslint") && (await eslint.isPathIgnored(file)))
		)
	)
		.map((filename) => `"${filename}"`)
		.join(" ");

	return filteredFiles.length
		? `${prefix} ${filteredFiles}`
		: "echo All files ignored";
}

export default {
	"*.{js,jsm,ts,tsx,md,yml,yaml}": (files) =>
		filter("eslint --cache --cache-location .build/ --max-warnings=0", files),
	".*ignore": (files) => filter("giismudge", files),
};
