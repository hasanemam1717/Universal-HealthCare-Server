import { Server } from 'http';
import app from './app'
import config from './config';



async function main() {
    const server: Server = app.listen(config.port, () => {
        console.log("Sever is running on port ", config.port);
    });
    process.on("uncaughtException", (error) => {
        console.log(error);
        if (server) {
            server.close(() => {
                console.info("Sorry, Server closed for uncaught exception!!");
            })
        }
    })
};

main();