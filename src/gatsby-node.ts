import _ from "lodash";
import chalk from "chalk";
import {
    CreateSchemaCustomizationArgs,
    ParentSpanPluginArgs,
    SourceNodesArgs,
} from "gatsby";
import { isGatsbyNodeLifecycleSupported } from "gatsby-plugin-utils";

import { createNodes } from "utils/create-nodes";
import { customFetch, fetchJson, killRequestOnError } from "utils/fetch-json";
import { filterPredicate } from "utils/helpers";
import { getRequests } from "utils/requests";
import { getSerializedResponses, serializeResponse } from "utils/responses";

import { PluginContext, PluginOptions } from "types/Context";
import { RequestOptions } from "types/Request";
import {
    FetchResponse,
    OptionalResponseContext,
    SerializedResponse,
    SerializedResponseContext,
} from "types/Response";
import { GetSchema } from "types/Schema";

const PRETTY_PLUGIN_NAME = chalk.cyan("gatsby-source-api");

type CacheInstance = {
    instanceName: string;
    requests: RequestOptions[];
};

type PluginCache = {
    [name: string]: CacheInstance;
};

const PLUGIN_CACHE: PluginCache = {};

export { pluginOptionsSchema } from "utils/plugin-schema";

const handlePluginInit = async (
    gatsbyContext: ParentSpanPluginArgs,
    pluginOptions: PluginOptions
): Promise<void> => {
    const { reporter } = gatsbyContext;
    const { name } = pluginOptions;

    PLUGIN_CACHE[name] = {
        instanceName: "",
        requests: [],
    };

    const instance: string = chalk.yellow(name);
    const instanceName = `${PRETTY_PLUGIN_NAME} ${instance}`;
    PLUGIN_CACHE[name].instanceName = instanceName;

    const pluginContext: PluginContext = {
        ...gatsbyContext,
        instance: instanceName,
    };

    let requests: RequestOptions[] = [];
    try {
        requests = await getRequests(pluginOptions, pluginContext);
        PLUGIN_CACHE[name].requests = requests;
    } catch (err) {
        reporter.panic(
            `${instanceName} An error occurred getting the requests`,
            err as Error
        );
    }
};

export const onPreInit = async (
    gatsbyContext: ParentSpanPluginArgs,
    pluginOptions: PluginOptions
): Promise<void> => {
    if (isGatsbyNodeLifecycleSupported("onPluginInit")) {
        return;
    }

    await handlePluginInit(gatsbyContext, pluginOptions);
};

export const onPluginInit = async (
    gatsbyContext: ParentSpanPluginArgs,
    pluginOptions: PluginOptions
): Promise<void> => {
    if (isGatsbyNodeLifecycleSupported("onPluginInit")) {
        await handlePluginInit(gatsbyContext, pluginOptions);
    }
};

export const sourceNodes = async (
    gatsbyContext: SourceNodesArgs,
    pluginOptions: PluginOptions
): Promise<void> => {
    const { reporter } = gatsbyContext;
    const { requests, instanceName } = PLUGIN_CACHE[pluginOptions.name];

    const pluginContext: PluginContext<SourceNodesArgs> = {
        ...gatsbyContext,
        instance: instanceName,
    };

    const timer = reporter.activityTimer(instanceName);
    timer.start();

    try {
        const responses: (SerializedResponseContext | void)[] =
            await Promise.all(
                requests.map(
                    async (
                        request: RequestOptions
                    ): Promise<SerializedResponseContext | void> => {
                        const { fetch, killOnRequestError } = request;

                        try {
                            let response: FetchResponse | void;

                            if (fetch) {
                                response = await customFetch(
                                    request,
                                    pluginContext
                                );
                            } else {
                                response = await fetchJson(
                                    request,
                                    pluginContext
                                );
                            }

                            if (response) {
                                const serialized: SerializedResponse =
                                    await serializeResponse(
                                        request,
                                        response,
                                        pluginContext
                                    );

                                return {
                                    request,
                                    response,
                                    serialized,
                                };
                            } else if (killOnRequestError) {
                                killRequestOnError(request, pluginContext);
                            }
                        } catch (err) {
                            if (killOnRequestError) {
                                killRequestOnError(request, pluginContext, err);
                            }
                        }
                    }
                )
            );

        const responsesWithData: SerializedResponseContext[] =
            responses.filter<SerializedResponseContext>(filterPredicate);

        const serializedResponses: OptionalResponseContext[] =
            await getSerializedResponses(
                requests,
                responsesWithData,
                pluginOptions,
                pluginContext
            );

        serializedResponses.forEach(
            (response: OptionalResponseContext): void => {
                createNodes(response, pluginContext);
            }
        );
    } catch (err) {
        reporter.panic(
            `${instanceName} An error occurred fetching JSON data.\n`,
            err as Error
        );
    }

    timer.end();
};

export const createSchemaCustomization = (
    gatsbyContext: CreateSchemaCustomizationArgs,
    pluginOptions: PluginOptions
): void => {
    const { actions } = gatsbyContext;
    const { requests, instanceName } = PLUGIN_CACHE[pluginOptions.name];

    const pluginContext: PluginContext<CreateSchemaCustomizationArgs> = {
        ...gatsbyContext,
        instance: instanceName,
    };

    let _requests: RequestOptions[] = requests;
    if (pluginOptions.serializeAll) {
        _requests = [pluginOptions];
    }

    _requests.forEach((request: RequestOptions): void => {
        const { schema } = request;

        if (schema) {
            if (_.isFunction(schema)) {
                const getSchema: GetSchema = schema;
                actions.createTypes(getSchema(request, pluginContext));
            } else {
                actions.createTypes(schema);
            }
        }
    });
};
