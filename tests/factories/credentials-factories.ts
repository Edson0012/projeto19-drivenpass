import { faker } from "@faker-js/faker";
import { prisma } from "../../src/config/database";
import { Credential, User } from "@prisma/client";
import { createUser } from "./auth-factories";
import cryptrUtils from "@/utils/cryptrUtils";

export type CredentialData = Omit<Credential, "id" | "userId" >;

export function generateValidCredential (){
    return {
        title: faker.name.firstName(),
        username: faker.name.firstName(),
        password: faker.name.firstName(),
        url: faker.internet.avatar(),
    }
};

export async function createCredential(user?: User, credential?: CredentialData){
    const incomingUser = user || await createUser();
    const incomingCredential = credential ||  generateValidCredential();

    const hashedPassword = cryptrUtils.returnEncrypt(incomingCredential.password)

    return  prisma.credential.create({
        data: {
            userId: incomingUser.id,
            title: incomingCredential.title,
            username: incomingCredential.username,
            password: hashedPassword,
            url: incomingCredential.url,
        }
    })
}
