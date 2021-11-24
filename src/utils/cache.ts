import _ from "lodash";

import { Errors } from "utils/errors";
import { PLUGIN_NAME } from "utils/helpers";

import { PluginContext } from "types/Context";
import { RequestsCache } from "types/Request";

export const getCacheKey = (name: string): string => {
    return _.kebabCase(`${PLUGIN_NAME}-${name}`);
};

export const getRequestsCache = async (
    name: string,
    context: PluginContext
): Promise<RequestsCache> => {
    const { cache, reporter, instance } = context;

    const cacheKey: string = getCacheKey(name);

    try {
        return cache.get(cacheKey);
    } catch (err) {
        reporter.panic(
            `${instance} Unable to get request(s) list from cache. Please run \`gatsby clean\` and try again.\n`,
            err as Error
        );
    }

    throw Errors.CACHE_GET(instance);
};

export const setRequestsCache = async (
    name: string,
    requests: RequestsCache,
    context: PluginContext
): Promise<void> => {
    const { cache, reporter, instance } = context;

    const cacheKey: string = getCacheKey(name);

    try {
        return cache.set(cacheKey, requests);
    } catch (err) {
        reporter.panic(
            `${instance} Unable to save request(s) list to cache. Please run \`gatsby clean\` and try again.\n`,
            err as Error
        );
    }
};
