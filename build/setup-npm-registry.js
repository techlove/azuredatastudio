/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const fs = require('fs').promises;
const path = require('path');

async function* getYarnLockFiles(dir) {
	const files = await fs.readdir(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = await fs.stat(fullPath);

		if (stat.isDirectory()) {
			yield* getYarnLockFiles(fullPath);
		} else if (file === 'yarn.lock') {
			yield fullPath;
		}
	}
}

async function setup(url, file) {
	let contents = await fs.readFile(file, 'utf8');
	contents = contents.replace(/https:\/\/registry\.[^.]+\.com\//g, url);
	await fs.writeFile(file, contents);
}

async function main(url, dir) {
	const root = dir ?? process.cwd();

	for await (const file of getYarnLockFiles(root)) {
		console.log(`Enabling custom NPM registry: ${path.relative(root, file)}`);
		await setup(url, file);
	}
}

main(process.argv[2], process.argv[3]);
