"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
});
prisma.$on('query', (e) => {
    console.log("------------------------");
    console.log('Query: ' + e.query);
    console.log("------------------------");
    console.log('Params: ' + e.params);
    console.log("------------------------");
    console.log('Duration: ' + e.duration + 'ms');
});
exports.default = prisma;
