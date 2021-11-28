import * as React from "react";
import { graphql, PageProps } from "gatsby";

import CardGithub, { GithubRepoProps } from "components/CardGithub";
import Layout from "components/Layout";
import PageMeta from "components/PageMeta";

type BasicExampleProps = {
    externalBasic: GithubRepoProps;
};

const BasicExample: React.VFC<PageProps<BasicExampleProps>> = ({
    data: { externalBasic },
}) => (
    <Layout>
        <PageMeta title="Basic" />
        <CardGithub {...externalBasic} />
    </Layout>
);

export default BasicExample;

export const query = graphql`
    {
        externalBasic {
            name
            link: html_url
            description
            numWatchers: watchers_count
        }
    }
`;
