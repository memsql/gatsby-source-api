import _ from "lodash";
import { SourceNodesArgs } from "gatsby";

import { PluginContext, PluginOptions } from "types/Context";
import { RequestOptions } from "types/Request";
import {
    FetchResponse,
    NonSerializedResponseContext,
    OptionalResponseContext,
    SerializedResponse,
    SerializedResponseContext,
} from "types/Response";

export const serializeResponse = async (
    request: RequestOptions,
    response: FetchResponse,
    context: PluginContext<SourceNodesArgs>
): Promise<SerializedResponse> => {
    const { reporter, instance } = context;

    if (request.serialize) {
        return request.serialize(response, request, context);
    } else {
        const entryKey = "data";

        let entryPoint: string[] = [entryKey];
        if (request.entryPoint) {
            if (_.isArray(request.entryPoint)) {
                entryPoint = entryPoint.concat(request.entryPoint);
            } else {
                entryPoint = entryPoint.concat(_.toPath(request.entryPoint));
            }

            if (!_.has(response, entryPoint)) {
                let entryPointStr: RequestOptions["entryPoint"] =
                    request.entryPoint;

                if (_.isArray(request.entryPoint)) {
                    entryPointStr = `[${_.toString(request.entryPoint)}]`;
                }

                reporter.warn(
                    `${instance} entryPoint \`${entryPointStr}\` does not exist in response body`
                );
            }
        }

        return _.get(response, entryPoint, response);
    }
};

export const getSerializedResponses = async (
    requests: RequestOptions[],
    responses: SerializedResponseContext[],
    options: PluginOptions,
    context: PluginContext<SourceNodesArgs>
): Promise<OptionalResponseContext[]> => {
    const { serializeAll } = options;
    const { reporter, instance } = context;

    const multipleRequests = requests.length > 1;

    let serializedResponses: OptionalResponseContext[] = responses;

    if (multipleRequests && serializeAll) {
        const nonSerializedResponses: NonSerializedResponseContext[] =
            responses.map(({ request, response }) => ({
                request,
                response,
            }));

        try {
            const serialized: SerializedResponse = await serializeAll(
                nonSerializedResponses,
                context
            );

            serializedResponses = [
                {
                    request: options,
                    serialized,
                },
            ];
        } catch (err) {
            reporter.panic(
                `${instance} An error occurred running serializeAll.\n`,
                err as Error
            );
        }
    }

    return serializedResponses;
};
