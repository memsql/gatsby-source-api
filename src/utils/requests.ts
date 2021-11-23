import _ from "lodash";
import { PluginOptionsSchemaArgs } from "gatsby";
import { testPluginOptionsSchema } from "gatsby-plugin-utils";

import { createRequestSchemaShape } from "utils/plugin-schema";

import { PluginContext, PluginOptions } from "types/Context";
import { RequestOptions } from "types/Request";

const requestSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
    Joi.object(createRequestSchemaShape({ Joi }))
        .unknown(true)
        .oxor("entryPoint", "serialize");

export const mapRequest = async (
    request: RequestOptions,
    options: PluginOptions,
    context: PluginContext
): Promise<RequestOptions> => {
    const { reporter, instance } = context;

    const _request: RequestOptions = {
        ...options,
        ...request,
    };

    if (options.fetchOptions || request.fetchOptions) {
        _request.fetchOptions = _.merge(
            _.cloneDeep(options.fetchOptions),
            request.fetchOptions
        );
    }

    if (options.metadata || request.metadata) {
        _request.metadata = _.merge(
            _.cloneDeep(options.metadata),
            request.metadata
        );
    }

    try {
        const { isValid, errors } = await testPluginOptionsSchema(
            requestSchema,
            _request
        );

        if (!isValid) {
            const reporterErrors: Error[] = errors.map(
                (error: string): Error => new Error(error)
            );

            reporter.panic(
                `${instance} invalid request configuration options.\n`,
                reporterErrors
            );
        }
    } catch (err) {
        reporter.panic(
            `${instance} invalid request configuration options.\n`,
            err as Error
        );
    }

    return _request;
};

export const getRequests = async (
    options: PluginOptions,
    context: PluginContext
): Promise<RequestOptions[]> => {
    const { reporter, instance } = context;

    let requests: RequestOptions[] = [options];

    if (options.getRequest) {
        try {
            const request = await options.getRequest(options, context);

            if (_.isArray(request)) {
                reporter.panic(
                    `${instance} \`getRequest\` must return a single request object.\n`
                );
            }

            requests = [request];
        } catch (err) {
            reporter.panic(
                `${instance} An error occurred fetching request options.\n`,
                err as Error
            );
        }
    } else if (options.getRequests) {
        try {
            requests = await options.getRequests(options, context);

            if (!_.isArray(requests)) {
                reporter.panic(
                    `${instance} \`getRequests\` must return an array of request objects.\n`
                );
            }
        } catch (err) {
            reporter.panic(
                `${instance} An error occurred fetching requests array.\n`,
                err as Error
            );
        }
    } else if (options.requests) {
        requests = options.requests;
    }

    return Promise.all(
        requests.map(
            async (request: RequestOptions): Promise<RequestOptions> => {
                return mapRequest(request, options, context);
            }
        )
    );
};
