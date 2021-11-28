const path = require("path");

const simpleImportSortOptions = require("../scripts/simple-import-sort");

module.exports = {
    plugins: ["react"],
    extends: [
        path.resolve(__dirname, "../.eslintrc.js"),
        "plugin:react/recommended",
    ],
    env: {
        node: false,
        browser: true,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        "jsx-quotes": 2,

        "react/display-name": 0,
        "react/prop-types": 0, // Change to 1 after enabling prop-types

        "react/no-array-index-key": 1,
        "react/no-danger": 1,
        "react/no-deprecated": 1,
        "react/no-did-mount-set-state": 1,
        "react/no-did-update-set-state": 1,
        "react/no-typos": 2,
        "react/no-unescaped-entities": 0,
        "react/no-unknown-property": 2,
        "react/no-unsafe": [2, { checkAliases: true }],
        "react/no-unused-prop-types": 1,
        "react/no-unused-state": 1,

        "react/prefer-es6-class": 1,
        "react/self-closing-comp": 1,
        "react/state-in-constructor": [1, "never"],
        "react/static-property-placement": [1, "property assignment"],
        "react/style-prop-object": 2,
        "react/void-dom-elements-no-children": 2,

        "react/jsx-boolean-value": 1,
        "react/jsx-closing-bracket-location": 1,
        "react/jsx-closing-tag-location": 1,
        "react/jsx-curly-brace-presence": [1, "never"],
        "react/jsx-curly-spacing": 1,
        "react/jsx-equals-spacing": 1,
        "react/jsx-first-prop-new-line": [1, "multiline"],
        "react/jsx-fragments": [1, "syntax"],
        "react/jsx-handler-names": 1,
        "react/jsx-indent": [1, 4],
        "react/jsx-indent-props": 1,
        "react/jsx-max-depth": [1, { max: 12 }],
        "react/jsx-no-bind": [2, { allowArrowFunctions: true }],
        "react/jsx-no-duplicate-props": 1,
        "react/jsx-no-literals": 0,
        "react/jsx-no-script-url": 2,
        "react/jsx-no-target-blank": 1,
        "react/jsx-no-useless-fragment": 1,
        "react/jsx-pascal-case": 2,
        "react/jsx-props-no-multi-spaces": 1,
        "react/jsx-sort-props": [
            1,
            {
                callbacksLast: true,
                shorthandFirst: true,
                ignoreCase: true,
                noSortAlphabetically: true,
                reservedFirst: true,
            },
        ],
        "react/jsx-tag-spacing": 1,
        "react/jsx-wrap-multilines": 1,

        "simple-import-sort/imports": [
            2,
            simpleImportSortOptions({
                sortOrder: ["components", "pages"],
                initialModuleOrder: ["react$", "gatsby", "react", "lodash"],
                includeCss: true,
            }),
        ],
    },
};
