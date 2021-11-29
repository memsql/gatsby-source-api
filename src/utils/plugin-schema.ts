import { PluginOptionsSchemaArgs } from "gatsby";
import { Schema } from "gatsby-plugin-utils";

import { DISALLOWED_KEYS, KEY_NAME_REGEX } from "utils/helpers";

const METHODS: string[] = ["head", "options", "get", "post"];

export const createRequestSchemaShape = ({
    Joi,
}: PluginOptionsSchemaArgs): Record<string, Schema> => {
    const endpointSchema = Joi.alternatives().try(
        Joi.string().trim().uri(),
        Joi.object().instance(URL)
    );

    return {
        name: Joi.string()
            .trim()
            .disallow(...DISALLOWED_KEYS)
            .required(),
        endpoint: endpointSchema,
        fetchOptions: Joi.object({
            endpoint: endpointSchema,
            method: Joi.string()
                .trim()
                .valid(...METHODS)
                .default("get"),
        }).unknown(true),
        entryPoint: Joi.alternatives().try(
            Joi.array().items(Joi.string().trim()),
            Joi.string().trim()
        ),
        fetch: Joi.function(),
        serialize: Joi.function(),
        metadata: Joi.object().unknown(true),
        schemas: Joi.alternatives().try(Joi.function(), Joi.any()),
        listKey: Joi.string()
            .trim()
            .pattern(KEY_NAME_REGEX)
            .disallow(...DISALLOWED_KEYS),
        typePrefix: Joi.string()
            .trim()
            .pattern(KEY_NAME_REGEX)
            .disallow(...DISALLOWED_KEYS)
            .default("external"),
        killOnRequestError: Joi.boolean().default(true),
    };
};

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) => {
    const requestSchemaShape = createRequestSchemaShape({ Joi });

    return Joi.object({
        ...requestSchemaShape,
        getRequest: Joi.function(),
        getRequests: Joi.function(),
        serializeAll: Joi.function(),
        requests: Joi.array().items(
            Joi.object(requestSchemaShape)
                .oxor("endpoint", "fetchOptions.endoint")
                .oxor("entryPoint", "serialize")
        ),
    })
        .oxor("endpoint", "fetchOptions.endpoint")
        .oxor("entryPoint", "serialize", "serializeAll")
        .oxor("requests", "getRequest", "getRequests");
};
