const simpleImportSortOptions = require("./scripts/simple-import-sort");

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    env: {
        es6: true,
        node: true,
        "jest/globals": true,
    },
    settings: {
        jest: {
            version: "detect",
        },
    },
    plugins: [
        "@typescript-eslint",
        "babel",
        "disable",
        "eslint-comments",
        "import",
        "jest",
        "prettier",
        "simple-import-sort",
    ],
    extends: [
        "eslint:recommended",
        "plugin:eslint-comments/recommended",
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    processor: "disable/disable",
    parserOptions: {
        sourceType: "module",
        emcaVersion: 6,
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            modules: true,
        },
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ["./tsconfig.json", "./examples/*/tsconfig.json"],
            },
        },
        {
            files: ["*.js"],
            settings: {
                "disable/plugins": ["@typescript-eslint"],
            },
        },
        {
            files: ["*.spec.ts"],
            rules: {
                "no-import-assign": 0,
            },
            extends: ["plugin:jest/recommended", "plugin:jest/style"],
        },
    ],
    rules: {
        "arrow-parens": [2, "as-needed"],
        eqeqeq: 2,
        "no-undef": 0,
        "no-constant-condition": 0,
        "no-console": 0,
        "no-irregular-whitespace": 0,
        "no-multi-str": 1,
        "no-var": 2,

        "babel/no-invalid-this": 2,
        "babel/semi": [2, "always"],

        "eslint-comments/no-unused-disable": 1,

        "import/first": 2,
        "import/newline-after-import": 1,
        "import/no-duplicates": 2,
        "import/no-extraneous-dependencies": 2,
        "import/no-mutable-exports": 2,
        "import/no-self-import": 2,
        "import/no-useless-path-segments": 2,
        "import/prefer-default-export": 0,

        /**
         * Custom sorting options
         * @see https://github.com/lydell/eslint-plugin-simple-import-sort/blob/master/examples/.eslintrc.js#L71
         */
        "simple-import-sort/imports": [
            2,
            simpleImportSortOptions({
                sortOrder: ["utils", "types"],
                initialModuleOrder: ["lodash"],
            }),
        ],
    },
};
