import _ from "lodash";
import { NodeInput, SourceNodesArgs } from "gatsby";

import {
    createExternalNodeId,
    getNodeName,
    getValidKey,
    isPrimitive,
} from "utils/helpers";

import { PluginContext } from "types/Context";
import { OptionalResponseContext, SimpleResponse } from "types/Response";

export const createNodes = (
    response: OptionalResponseContext,
    context: PluginContext<SourceNodesArgs>
): void => {
    const { actions, createContentDigest } = context;
    const { request, serialized } = response;
    const { name, listKey, typePrefix } = request;

    let entries: SimpleResponse[] = serialized as SimpleResponse[];

    if (_.isPlainObject(serialized)) {
        entries = [serialized as SimpleResponse];
    }

    entries.forEach((entry: SimpleResponse) => {
        let data: SimpleResponse = entry;
        if (isPrimitive(entry) || _.isArray(entry)) {
            data = {
                [listKey || name]: entry,
            };
        }

        data = _.mapKeys(data, (value, key) => getValidKey(key, context));

        const digest: string = createContentDigest(data);

        const node: NodeInput = {
            ...data,
            id: createExternalNodeId(digest, request, context),
            parent: null,
            children: [],
            internal: {
                type: getNodeName(name, typePrefix ? [typePrefix] : []),
                mediaType: "application/json",
                content: JSON.stringify(data),
                contentDigest: digest,
            },
        };

        actions.createNode(node);
    });
};
