const eslintConfig = require("../eslint-config");

module.exports = {
    ...eslintConfig,
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ["./tsconfig.json"],
            },
        },
    ],
};
