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
                endpoint: new URL(
                    "/repos/microsoft/typescript",
                    "https://api.github.com/"
                ),
            },
        },
    ],
};
