import _ from "lodash";
import { SourceNodesArgs } from "gatsby";

import { Errors } from "utils/errors";

import { PluginContext } from "types/Context";
import { GraphQLType } from "types/Helpers";
import { FetchOptions, RequestOptions } from "types/Request";

export const ALT_PREFIX = "alt_";
export const PRIMITIVES: string[] = ["string", "boolean", "date"];

// https://regex101.com/r/7q1Hgw/1
export const FIRST_LETTER_REGEX = /^[a-zA-Z]$/i;
export const KEY_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]+$/i;

// TODO: Remove `id` from disallowed keys in gatsby v4
export const DISALLOWED_KEYS: string[] = [
    "id",
    "children",
    "parent",
    "fields",
    "internal",
];

export const isPrimitive = (value: unknown): boolean => {
    return PRIMITIVES.includes(value as string) || value instanceof Date;
};

export const createExternalNodeId = (
    digest: string,
    request: RequestOptions,
    context: PluginContext<SourceNodesArgs>
): string => {
    const { createNodeId } = context;
    const { name, typePrefix } = request;

    return createNodeId(_.camelCase(`${typePrefix}-${name}-${digest}`));
};

export const getNodeName = (
    name: string,
    parents: string[] = []
): GraphQLType => {
    const names: string[] = [...parents, name]
        .filter(Boolean)
        .map((n: string): string => _.upperFirst(_.camelCase(n)));

    return names.join("");
};

export const getEndpoint = (
    request: RequestOptions,
    context: PluginContext<SourceNodesArgs>
): string => {
    const { instance, reporter } = context;

    const fetchOptions: Partial<FetchOptions> = request.fetchOptions || {};
    const requestEndpoint = fetchOptions.endpoint || request.endpoint;

    if (typeof requestEndpoint === "string") {
        return requestEndpoint;
    } else if (requestEndpoint instanceof URL) {
        return requestEndpoint.href;
    }

    reporter.panic(`${instance} An endpoint must be specified`);

    throw Errors.ENDPOINT(instance);
};

export const getValidKey = (
    key: string,
    context: PluginContext<SourceNodesArgs>
): string => {
    const { reporter, instance } = context;

    let alteredKey = _.toString(key);
    let changed = false;

    // Replace invalid characters
    if (!KEY_NAME_REGEX.test(alteredKey)) {
        changed = true;
        alteredKey = alteredKey.replace(/-|__|:|\$|\.|\s/g, "_");
    }

    // Prefix if first character isn't a letter.
    if (!FIRST_LETTER_REGEX.test(alteredKey.slice(0, 1))) {
        changed = true;
        alteredKey = ALT_PREFIX.concat(alteredKey);
    }

    if (DISALLOWED_KEYS.includes(alteredKey)) {
        changed = true;
        alteredKey = ALT_PREFIX.concat(alteredKey);
    }

    if (changed) {
        reporter.verbose(
            `${instance} Object with key \`${key}\` breaks GraphQL naming convention. Renamed to \`${alteredKey}\``
        );
    }

    return alteredKey;
};

export const filterPredicate = <T>(value: T | void): value is T => {
    return value === null || value === undefined ? false : true;
};
