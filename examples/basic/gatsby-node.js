const _ = require("lodash");

exports.onCreateWebpackConfig = gatsbyContext => {
    const { actions, getConfig } = gatsbyContext;

    const config = getConfig();

    config.resolve.modules = _.uniq([
        ...(config.resolve.fallback || {}),
        path.resolve(__dirname, "src"),
        "node_modules",
    ]);

    actions.setWebpackConfig(config);
};
