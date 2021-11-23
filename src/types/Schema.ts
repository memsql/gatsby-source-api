import { Actions, CreateSchemaCustomizationArgs } from "gatsby";

import { PluginContext } from "types/Context";
import { RequestOptions } from "types/Request";

export type Schema = Parameters<Actions["createTypes"]>[0];
export type GetSchema = (
    request: RequestOptions,
    context: PluginContext<CreateSchemaCustomizationArgs>
) => Schema;
