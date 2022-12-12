import { User } from "@prisma/client";

export type signInSchema = Pick<User , "email" | "password">


export type signUpSchema = Pick<User , "email" | "password">
