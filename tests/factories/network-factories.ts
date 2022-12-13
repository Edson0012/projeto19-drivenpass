import { faker } from "@faker-js/faker";
import { prisma } from "../../src/config/database";
import { Network, User } from "@prisma/client";
import cryptrUtils from "@/utils/cryptrUtils";
import { createUser } from "./auth-factories";

export type NetWorkData = Omit<Network, "id" | "userId" >

export function generateValidNetwork (){
    return {
        title: faker.name.firstName(),
        network: faker.name.firstName(),
        password: faker.name.firstName(),
    }
}

export function generateInvalidNetwork (){
    return {
        [faker.name.firstName()]: faker.name.firstName(),
        network: faker.name.firstName(),
        password: faker.name.firstName(),
    }
}

export async function createNetwork(user?: User, network?: NetWorkData) {
    const incomingUser = user || await createUser();
    const incomingNetwork = network || generateValidNetwork();

    const hashedPassword = cryptrUtils.returnEncrypt(incomingNetwork.password);

    return prisma.network.create({
        data: {
            userId: incomingUser.id,
            title: incomingNetwork.title,
            network: incomingNetwork.network,
            password: hashedPassword,
        }
    });

};