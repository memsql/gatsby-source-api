import chalk from "chalk";
import { SourceNodesArgs } from "gatsby";
import got, { Response } from "got";

import { getEndpoint } from "utils/helpers";

import { PluginContext } from "types/Context";
import { FetchOptions, RequestOptions } from "types/Request";
import { FetchResponse, SerializedResponse } from "types/Response";

export const fetchJson = async (
    request: RequestOptions,
    context: PluginContext<SourceNodesArgs>
): Promise<FetchResponse> => {
    const endpoint: string = getEndpoint(request, context);
    const fetchOptions: Partial<FetchOptions> = request.fetchOptions || {};

    const response: Response<SerializedResponse> =
        await got<SerializedResponse>(endpoint, {
            ...fetchOptions,
            responseType: "json",
            retry: 3,
        });

    return {
        headers: response.headers,
        data: response.body,
    };
};

export const customFetch = async (
    request: RequestOptions,
    context: PluginContext<SourceNodesArgs>
): Promise<FetchResponse | void> => {
    const { fetch } = request;

    if (fetch) {
        const response: SerializedResponse = await fetch(request, context);

        return {
            data: response,
        };
    }
};

export const handleRequestError = (
    request: RequestOptions,
    context: PluginContext<SourceNodesArgs>,
    err?: unknown
): void => {
    const { reporter, instance } = context;
    const { name, fetch, killOnRequestError } = request;

    const requestName = chalk.underline(name);

    let errorMessage = `${instance} An error occurred fetching data for ${requestName}`;

    if (!fetch) {
        const endpoint: string = getEndpoint(request, context);
        errorMessage = errorMessage.concat(" ", `at ${endpoint}`);
    }

    reporter[killOnRequestError ? "panic" : "warn"](
        errorMessage.concat("\n"),
        err ? (err as Error) : undefined
    );
};
