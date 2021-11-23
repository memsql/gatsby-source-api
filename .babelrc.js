module.exports = {
    presets: [["@babel/preset-typescript"], ["babel-preset-gatsby-package"]],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ["./src"],
                extensions: [".ts"]
            },
        ],
    ],
};
