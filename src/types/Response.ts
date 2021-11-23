import { Response } from "got";

import { RequestOptions } from "types/Request";

export type SimpleResponse = Record<string, unknown>;
export type SerializedResponse = SimpleResponse[] | SimpleResponse;

export type FetchResponse = {
    headers?: Response["headers"];
    data: Response<SerializedResponse>["body"];
};

export type NonSerializedResponseContext = {
    request: RequestOptions;
    response: FetchResponse;
};

export type OptionalResponseContext = {
    request: RequestOptions;
    response?: FetchResponse;
    serialized: SerializedResponse;
};

export type SerializedResponseContext = NonSerializedResponseContext & {
    serialized: SerializedResponse;
};
