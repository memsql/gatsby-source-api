const path = require("path");

const _ = require("lodash");

exports.onCreateWebpackConfig = gatsbyContext => {
    const { actions, getConfig } = gatsbyContext;

    const config = getConfig();

    actions.setWebpackConfig({
        resolve: {
            ...config.resolve,
            modules: _.uniq([
                ...(config.resolve.modules || []),
                path.resolve(__dirname, "src"),
                "node_modules",
            ]),
        },
    });
};
