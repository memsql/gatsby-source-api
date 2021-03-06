const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});

module.exports = {
    siteMetadata: {
        title: "Gatsby Source API Example (basic)",
        description:
            "Gatsby based site containing a basic confirguration example for the gatsby-source-api plugin",
    },
    plugins: [
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: "gatsby-source-api",
                start_url: "/",
                background_color: "#663399",
                icon: "static/images/gatsby-icon.png",
            },
        },
        "gatsby-plugin-react-helmet",
        {
            resolve: "gatsby-source-api",
            options: {
                name: "github",
                endpoint: new URL(
                    "/repos/microsoft/typescript",
                    "https://api.github.com/"
                ),
                fetchOptions: {
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        authorization: process.env.GITHUB_TOKEN
                            ? `token ${process.env.GITHUB_TOKEN}`
                            : undefined,
                    },
                },
            },
        },
    ],
};
