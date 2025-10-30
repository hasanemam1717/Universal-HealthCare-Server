import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

// prisma.$on('query', (e) => {
//     console.log("------------------------");
//     console.log('Query: ' + e.query)
//     console.log("------------------------");
//     console.log('Params: ' + e.params)
//     console.log("------------------------");
//     console.log('Duration: ' + e.duration + 'ms')
// })

export default prisma