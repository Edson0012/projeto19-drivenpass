import dotenv from "dotenv";
import pg from "pg";
import pkg from "@prisma/client";

dotenv.config();

// Postgres Client
const { Pool } = pg;

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Prisma Client
const { PrismaClient } = pkg;

export let prisma = new PrismaClient(); 

export function connectDb(): void{
  prisma;
}

export async function disconnectDB(): Promise<void>{
 await prisma?.$disconnect();
}