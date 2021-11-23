import { SourceNodesArgs } from "gatsby";
import { OptionsOfJSONResponseBody } from "got";

import { PluginContext } from "types/Context";
import { Endpoint } from "types/Helpers";
import { FetchResponse } from "types/Response";
import { GetSchema, Schema } from "types/Schema";

export type FetchOptions = OptionsOfJSONResponseBody & {
    endpoint: Endpoint;
};

export type SimpleResponse = Record<string, unknown>;
export type SerializedResponse = SimpleResponse[] | SimpleResponse;

export type RequestOptions = {
    name: string;
    endpoint?: Endpoint;
    fetchOptions?: FetchOptions;
    entryPoint?: string | string[];
    fetch?: <T = SerializedResponse>(
        request: RequestOptions,
        context: PluginContext<SourceNodesArgs>
    ) => Promise<T>;
    serialize?: (
        response: FetchResponse,
        request: RequestOptions,
        context: PluginContext<SourceNodesArgs>
    ) => Promise<SerializedResponse>;
    metadata?: Record<string, unknown>;
    schema?: Schema | GetSchema;
    listKey?: string;
    typePrefix?: string;
    killOnRequestError?: boolean;
};
