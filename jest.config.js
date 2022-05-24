module.exports = {
	collectCoverageFrom: [
		"**/*.{js,jsx,ts,tsx}",
		"!**/*.d.ts",
		"!**/node_modules/**",
	],
	moduleNameMapper: {
		// Handle CSS imports (with CSS modules)
		// https://jestjs.io/docs/webpack#mocking-css-modules
		"^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

		// Handle CSS imports (without CSS modules)
		"^.+\\.(css|sass|scss)$": "<rootDir>/libs/utils/__mocks__/styleMock.js",

		// Handle image imports
		// https://jestjs.io/docs/webpack#handling-static-assets
		"^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": `<rootDir>/libs/utils/__mocks__/fileMock.js`,

		// Handle module aliases
		"^@/(.*)$": "<rootDir>/$1",
		"^@artifacts/(.*)$": "<rootDir>/libs/artifacts/$1",
		"^@providers/(.*)$": "<rootDir>/libs/providers/$1",
		"^@utils$": "<rootDir>/libs/utils",
		"^@utils/(.*)$": "<rootDir>/libs/utils/$1",
	},
	// Add more setup options before each test is run
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/.next/",
		"<rootDir>/libs/tests-old/",
	],
	testEnvironment: "jsdom",
	transform: {
		// Use babel-jest to transpile tests with the next/babel preset
		// https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
		"^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
	},
	transformIgnorePatterns: ["^.+\\.module\\.(css|sass|scss)$"],
	testTimeout: 10000,
	setupFiles: ["<rootDir>/libs/tests/jest.setup.ts"],
};
