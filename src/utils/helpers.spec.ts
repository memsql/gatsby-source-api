import {
    getPrettyName,
    isPrimitive,
    PLUGIN_NAME,
    PRETTY_PLUGIN_NAME,
} from "utils/helpers";

describe("helper constants", () => {
    describe("PLUGIN_NAME", () => {
        it("matches the snapshot", () => {
            expect(PLUGIN_NAME).toMatchSnapshot();
        });

        it("matches its pretty snapshot", () => {
            expect(PRETTY_PLUGIN_NAME).toMatchSnapshot();
        });

        it("creates a pretty plugin instance name", () => {
            expect(getPrettyName("test")).toMatchSnapshot();
        });
    });
});

describe("isPrimitive helper", () => {
    it("determines that `string` is primitive", () => {
        expect(isPrimitive("hello")).toBe(true);
    });

    it("determines that `number` is primitive", () => {
        expect(isPrimitive(10)).toBe(true);
    });

    it("determines that `boolean` is primitive", () => {
        expect(isPrimitive(false)).toBe(true);
    });

    it("determines that `Date` is primitive", () => {
        expect(isPrimitive(new Date())).toBe(true);
    });

    it("determines that `array` is not primitive", () => {
        expect(isPrimitive([])).toBe(false);
    });

    it("determines that `object` is not primitive", () => {
        expect(isPrimitive({})).toBe(false);
    });
});
