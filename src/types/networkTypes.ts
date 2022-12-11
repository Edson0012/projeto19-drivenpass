import { Network } from "@prisma/client";

export type NetworkBody = Omit<Network, "id" | "userId">

export type NetworkData = Omit<Network, "id">