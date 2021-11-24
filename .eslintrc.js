const internalAbsoluteImportOrder = ["utils", "types"];

const pipedInternalAbsoluteImports = internalAbsoluteImportOrder.join("|");
const internalAbsoluteImportGroups = internalAbsoluteImportOrder.map(
    dirName => [`^${dirName}(\\/.*|$)`]
);

module.exports = {
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
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-var-requires": 0,
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
            {
                groups: [
                    // Node.js builtins
                    [`^(${require("module").builtinModules.join("|")})(/|$)`],
                    // Packages `react` > proptypes > classnames > lodash > all the rest.
                    [
                        "^lodash",
                        // https://regex101.com/r/lhyIM3/1
                        `^@?(?!(${pipedInternalAbsoluteImports})$)[a-z0-9_-]+`,
                    ],
                    // Side effect imports
                    ["^\\u0000"],
                    // Internal side effect imports
                    // https://regex101.com/r/oDACXy/1
                    [
                        `^\\u0000(${pipedInternalAbsoluteImports})(\\/(.(?!.*(\\.s?css)))*|$)`,
                    ],
                    // Internal packages
                    ...internalAbsoluteImportGroups,
                    // Parent imports. Put `..` last
                    ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                    // Other relative imports. Put same-folder imports and `.` last
                    ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                ],
            },
        ],
    },
};
