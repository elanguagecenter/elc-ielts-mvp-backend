import { PrismaClient } from "@prisma/client";
import configs from "./configs";

const prisma: PrismaClient = new PrismaClient({
  datasources: {
    db: {
      url: configs.dbUrl,
    },
  },
});

export default prisma;
