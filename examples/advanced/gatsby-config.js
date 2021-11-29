const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});

const GITHUB_API = "https://api.github.com/";
const FETCH_OPTIONS = {
    headers: {
        Accept: "application/vnd.github.v3+json",
        authorization: process.env.GITHUB_TOKEN
            ? `token ${process.env.GITHUB_TOKEN}`
            : undefined,
    },
};

const repositories = [
    {
        org: "microsoft",
        name: "typescript",
    },
    {
        org: "facebook",
        name: "react",
    },
    {
        org: "gatsbyjs",
        name: "gatsby",
    },
];

const getGithubEndpoint = ({ org, name }, endpoint = "") => {
    return new URL(path.join("/repos", org, name, endpoint), GITHUB_API);
};

module.exports = {
    siteMetadata: {
        title: "Gatsby Source API Example (advanced)",
        description:
            "Gatsby based site containing multiple advanced confirguration sets for the gatsby-source-api plugin",
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
                name: "basic",
                endpoint: getGithubEndpoint(repositories[0]),
                fetchOptions: FETCH_OPTIONS,
            },
        },
        {
            resolve: "gatsby-source-api",
            options: {
                name: "multiple-requests",
                requests: repositories.map(repository => {
                    return {
                        name: "requests".concat("-", repository.name),
                        endpoint: getGithubEndpoint(repository),
                        fetchOptions: FETCH_OPTIONS,
                    };
                }),
            },
        },
        {
            resolve: "gatsby-source-api",
            options: {
                name: "multiple-requests-dynamic",
                getRequests: async (pluginOptions, pluginContext) => {
                    // You can optionally get the repository names to use here
                    // aschronously, use the gatsby context reporter to log
                    // something, or get additional data to pass into the
                    // request from somewhere within your application

                    const { name } = pluginOptions;
                    const { reporter, instance } = pluginContext;

                    reporter.info(
                        `${instance} ${name} - getting dynamic requests`
                    );

                    return repositories.map(repository => {
                        return {
                            name: "dynamic-requests".concat(
                                "-",
                                repository.name
                            ),
                            endpoint: getGithubEndpoint(repository),
                            fetchOptions: FETCH_OPTIONS,
                        };
                    });
                },
            },
        },
        // TODO: Add examples for serialization, custom fetching and schema creation
    ],
};
