import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

import Header from "components/Header";

import "./Layout.css";

const Layout: React.FC = ({ children }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    return (
        <>
            <Header siteTitle={data.site.siteMetadata?.title || "Title"} />
            <div
                style={{
                    margin: "0 auto",
                    maxWidth: 960,
                    padding: "0 1.0875rem 1.45rem",
                }}
            >
                <main>{children}</main>
            </div>
        </>
    );
};

export default Layout;
