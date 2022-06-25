import signale from "signale";

const rootLogger = new signale.Signale({
    logLevel: process.env.NODE_ENV === "production" ? "warn" : "info"
});

export function createLogger(name: string) {
    return rootLogger.scope(name
        .replace(process.cwd(), "")
        .replace(/dist|src|\.js/g, "")
        .replace(/(?:\\\\)|\//, " ")
        .replace(/\\|\//g, "_")
    );
}