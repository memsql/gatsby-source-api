import { ErrorCode } from "types/Helpers";

export const Errors: ErrorCode = {
    ENDPOINT: (instance: string) => `${instance} Unexpected \`endpoint\``,
};
