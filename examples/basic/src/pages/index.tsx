import * as React from "react";
import { graphql, PageProps } from "gatsby";

import CardGithub, { GithubRepoProps } from "components/CardGithub";
import Layout from "components/Layout";
import PageMeta from "components/PageMeta";

type BasicExampleProps = {
    externalGithub: GithubRepoProps;
};

const BasicExample: React.VFC<PageProps<BasicExampleProps>> = ({
    data: { externalGithub },
}) => (
    <Layout>
        <PageMeta title="Basic" />
        <CardGithub {...externalGithub} />
    </Layout>
);

export default BasicExample;

export const query = graphql`
    {
        externalGithub {
            name
            link: html_url
            description
            stars: stargazers_count
        }
    }
`;
