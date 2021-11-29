import * as React from "react";
import { graphql, PageProps } from "gatsby";

import CardGithub, { GithubRepoProps } from "components/CardGithub";
import Layout from "components/Layout";
import PageMeta from "components/PageMeta";

type MultipleRequestsProps = {
    externalRequestsGatsby: GithubRepoProps;
    externalRequestsReact: GithubRepoProps;
    externalRequestsTypescript: GithubRepoProps;
};

const MultipleRequests: React.VFC<PageProps<MultipleRequestsProps>> = ({
    data: {
        externalRequestsGatsby,
        externalRequestsReact,
        externalRequestsTypescript,
    },
}) => (
    <Layout>
        <PageMeta title="Multiple Static Requests" />
        <h2>Multiple Static Requests</h2>

        <CardGithub {...externalRequestsGatsby} />
        <CardGithub {...externalRequestsReact} />
        <CardGithub {...externalRequestsTypescript} />
    </Layout>
);

export default MultipleRequests;

export const query = graphql`
    {
        externalRequestsGatsby {
            name
            link: html_url
            description
            stars: stargazers_count
        }
        externalRequestsReact {
            name
            link: html_url
            description
            stars: stargazers_count
        }
        externalRequestsTypescript {
            name
            link: html_url
            description
            stars: stargazers_count
        }
    }
`;
