const builtinModules = require("module").builtinModules;

/**
 * @typedef {Object} SingpleImportSortParams
 * @property {String[]} sortOrder - the order of any internal imports
 * @property {String[]} initialModuleOrder - the order of any node_modules that
 *  should appear at the top of the module imports
 * @property {Boolean} includeCss - include a rule that sorts S?CSS at the
 *  bottom of the imports list
 * @property {Object} additionalOptions - any additional options that the plugin allows
 *
 * @function
 * @see https://github.com/lydell/eslint-plugin-simple-import-sort/blob/master/examples/.eslintrc.js#L71
 *
 * @param {SingpleImportSortParams} params
 *
 * @returns {Object}
 */
const simpleImportSortOptions = ({
    sortOrder,
    initialModuleOrder = [],
    includeCss = false,
    additionalOptions = {},
}) => {
    const pipedInternalAbsoluteImports = sortOrder.join("|");
    const internalAbsoluteImportGroups = sortOrder.map(dirName => [
        `^${dirName}(\\/.*|$)`,
    ]);

    return {
        groups: [
            // Node.js builtins
            [`^(${builtinModules.join("|")})(/|$)`],
            // Packages order: initialModuleOrder > all the rest.
            [
                ...initialModuleOrder.map(m => `^${m}`),
                // https://regex101.com/r/lhyIM3/1
                `^@?(?!(${pipedInternalAbsoluteImports})$)[a-z0-9_-]+`,
            ],
            // Side effect imports
            ["^\\u0000"],
            // Internal side effect imports
            [`^\\u0000(${pipedInternalAbsoluteImports})(\\/.*|$)`],
            // Internal packages
            ...internalAbsoluteImportGroups,
            // Parent imports. Put `..` last
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Other relative imports. Put same-folder imports and `.` last
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            includeCss && ["^.+\\.s?css$"],
        ].filter(Boolean),

        ...additionalOptions,
    };
};

module.exports = simpleImportSortOptions;
