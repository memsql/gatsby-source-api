import { ParentSpanPluginArgs, SourceNodesArgs } from "gatsby";

import { RequestOptions } from "types/Request";
import {
    NonSerializedResponseContext,
    SerializedResponse,
} from "types/Response";

export type PluginOptions = RequestOptions & {
    getRequest?: (
        options: PluginOptions,
        context: PluginContext
    ) => Promise<RequestOptions>;
    getRequests?: (
        options: PluginOptions,
        context: PluginContext
    ) => Promise<RequestOptions[]>;
    serializeAll?: (
        responses: NonSerializedResponseContext[],
        context: PluginContext<SourceNodesArgs>
    ) => Promise<SerializedResponse>;
    requests?: RequestOptions[];
};

export type PluginContext<C = ParentSpanPluginArgs> = C & {
    instance: string;
};
