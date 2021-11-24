import { ErrorCode } from "types/Helpers";

export const Errors: ErrorCode = {
    ENDPOINT: (instance: string) => `${instance} Unexpected \`endpoint\``,
    CACHE_GET: (instance: string) =>
        `${instance} Unable to fetch from Gatsby cache`,
};
