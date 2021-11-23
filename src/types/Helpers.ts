import { URL } from "url";

export type ErrorCode = Record<string, (instance: string) => string>;
export type Endpoint = string | URL;

export type GraphQLTypePrimitive =
    | "Boolean"
    | "String"
    | "Int"
    | "Float"
    | "Date";

export type GraphQLType = GraphQLTypePrimitive | string;
