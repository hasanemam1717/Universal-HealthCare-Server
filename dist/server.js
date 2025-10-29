"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
async function main() {
    const server = app_1.default.listen(config_1.default.port, () => {
        console.log("Sever is running on port ", config_1.default.port);
    });
    process.on("uncaughtException", (error) => {
        console.log(error);
        if (server) {
            server.close(() => {
                console.info("Sorry, Server closed for uncaught exception!!");
            });
        }
        process.exit(1);
    });
    process.on("unhandledRejection", (error) => {
        console.log(error);
        if (server) {
            server.close(() => {
                console.info("Sorry, Server closed for unhandled Rejection!!");
            });
        }
        process.exit(1);
    });
}
;
main();
