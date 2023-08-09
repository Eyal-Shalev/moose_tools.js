#!/usr/bin/env -S deno run --allow-read --allow-write=dist --allow-env --allow-run --unstable --allow-net

// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.38.0/mod.ts";
import {assert} from "https://deno.land/std@0.197.0/assert/mod.ts";
import {parse} from "https://deno.land/std@0.197.0/flags/mod.ts";
import * as semver from "npm:semver@7";

await emptyDir("./dist");

const {name, version} = parse(Deno.args, {
	string: ['name', 'version'],
	default: {
		name: 'moose_tools',
		version: '0.0.0-dev',
	}
});

assert(semver.valid(version), `Invalid version: "${version}"`);

await build({
	entryPoints: ["./mod.ts"],
	skipSourceOutput: true,
	outDir: "./dist",
	compilerOptions: {
		target: "ES2022",
	},
	typeCheck: "both",
	shims: {
		// see JS docs for overview and more options
		deno: true,
	},
	package: {
		name,
		version,
		description: "Moose Tools",
		license: "Mozilla Public License 2.0",
		repository: {
			type: "git",
			url: "git+https://github.com/Eyal-Shalev/moose_tools.js.git",
		},
		bugs: {
			url: "https://github.com/Eyal-Shalev/moose_tools.js/issues",
		},
		"engines": {
			"node": ">=16.11.0",
		},
		"keywords": ["utilities"],
	},
	postBuild() {
		// steps to run after building and before running the tests
		Deno.copyFileSync("LICENSE", "dist/LICENSE");
		Deno.copyFileSync("README.md", "dist/README.md");
	},
});
