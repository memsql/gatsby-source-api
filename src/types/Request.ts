import { SourceNodesArgs } from "gatsby";
import { OptionsOfJSONResponseBody } from "got";

import { PluginContext } from "types/Context";
import { Endpoint } from "types/Helpers";
import { FetchResponse, SerializedResponse } from "types/Response";
import { GetSchema, Schema } from "types/Schema";

export type FetchOptions = OptionsOfJSONResponseBody & {
    endpoint: Endpoint;
};

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

export type RequestsCache = RequestOptions[];
