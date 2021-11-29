import * as React from "react";
import { graphql, PageProps } from "gatsby";

import CardGithub, { GithubRepoProps } from "components/CardGithub";
import Layout from "components/Layout";
import PageMeta from "components/PageMeta";

type DynamicRequestsProps = {
    externalDynamicRequestsGatsby: GithubRepoProps;
    externalDynamicRequestsReact: GithubRepoProps;
    externalDynamicRequestsTypescript: GithubRepoProps;
};

const DynamicRequests: React.VFC<PageProps<DynamicRequestsProps>> = ({
    data: {
        externalDynamicRequestsGatsby,
        externalDynamicRequestsReact,
        externalDynamicRequestsTypescript,
    },
}) => (
    <Layout>
        <PageMeta title="Multiple Dyanmic Requests" />
        <h2>Multiple Dyanmic Requests</h2>

        <CardGithub {...externalDynamicRequestsGatsby} />
        <CardGithub {...externalDynamicRequestsReact} />
        <CardGithub {...externalDynamicRequestsTypescript} />
    </Layout>
);

export default DynamicRequests;

export const query = graphql`
    {
        externalDynamicRequestsGatsby {
            name
            link: html_url
            description
            stars: stargazers_count
        }
        externalDynamicRequestsReact {
            name
            link: html_url
            description
            stars: stargazers_count
        }
        externalDynamicRequestsTypescript {
            name
            link: html_url
            description
            stars: stargazers_count
        }
    }
`;
