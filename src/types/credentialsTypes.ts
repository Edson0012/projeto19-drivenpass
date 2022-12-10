import { Credential } from "@prisma/client";

export type credentialsData = Omit<Credential, "id" | "userId">;