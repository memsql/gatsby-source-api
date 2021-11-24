import _ from "lodash";
import {
    CreateSchemaCustomizationArgs,
    ParentSpanPluginArgs,
    SourceNodesArgs,
} from "gatsby";
import { isGatsbyNodeLifecycleSupported } from "gatsby-plugin-utils";

import { getRequestsCache, setRequestsCache } from "utils/cache";
import { createNodes } from "utils/create-nodes";
import { customFetch, fetchJson, handleRequestError } from "utils/fetch-json";
import { filterPredicate, getPluginContext } from "utils/helpers";
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

export { pluginOptionsSchema } from "utils/plugin-schema";

const handlePluginInit = async (
    gatsbyContext: ParentSpanPluginArgs,
    pluginOptions: PluginOptions
): Promise<void> => {
    const { name } = pluginOptions;

    const pluginContext: PluginContext = getPluginContext(name, gatsbyContext);
    const { instance, reporter } = pluginContext;

    try {
        let requests: RequestOptions[] = await getRequestsCache(
            name,
            pluginContext
        );

        if (!requests?.length) {
            requests = await getRequests(pluginOptions, pluginContext);
        }

        await setRequestsCache(name, requests, pluginContext);
    } catch (err) {
        reporter.panic(
            `${instance} An error occurred getting request(s)`,
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
    const { name } = pluginOptions;

    const pluginContext: PluginContext<SourceNodesArgs> =
        getPluginContext<SourceNodesArgs>(name, gatsbyContext);

    const { instance, reporter } = pluginContext;

    const requests: RequestOptions[] = await getRequestsCache(
        name,
        pluginContext
    );

    const timer = reporter.activityTimer(instance);
    timer.start();

    try {
        const responses: (SerializedResponseContext | void)[] =
            await Promise.all(
                requests.map(
                    async (
                        request: RequestOptions
                    ): Promise<SerializedResponseContext | void> => {
                        const { fetch } = request;

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
                            } else {
                                handleRequestError(request, pluginContext);
                            }
                        } catch (err) {
                            handleRequestError(request, pluginContext, err);
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
            `${instance} An error occurred fetching JSON data.\n`,
            err as Error
        );
    }

    timer.end();
};

export const createSchemaCustomization = async (
    gatsbyContext: CreateSchemaCustomizationArgs,
    pluginOptions: PluginOptions
): Promise<void> => {
    const { name, serializeAll } = pluginOptions;

    const pluginContext: PluginContext<CreateSchemaCustomizationArgs> =
        getPluginContext<CreateSchemaCustomizationArgs>(name, gatsbyContext);

    const { actions } = pluginContext;

    const requests: RequestOptions[] = await getRequestsCache(
        name,
        pluginContext
    );

    let _requests: RequestOptions[] = requests;
    if (serializeAll) {
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
