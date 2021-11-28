import * as React from "react";

import "./CardGithub.css";

export type GithubRepoProps = {
    name: string;
    link: string;
    description: string;
    numWatchers: number;
};

export type CardGithubProps = GithubRepoProps & {
    className?: string;
};

const CardGithub: React.VFC<CardGithubProps> = ({
    name,
    link,
    description,
    numWatchers,
}) => (
    <div className="card-github-component">
        <a href={link} className="title">
            {name}
        </a>

        {description && <p className="description">{description}</p>}

        <p className="watchers">Watchers: {numWatchers}</p>
    </div>
);

export default CardGithub;
