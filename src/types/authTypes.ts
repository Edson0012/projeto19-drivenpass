import { User } from "@prisma/client";

export type userBody = Pick<User , "email" | "password">