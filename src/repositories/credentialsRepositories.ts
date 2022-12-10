import { prisma } from "../config/database";
import * as credentialsTypes from "../types/credentialsTypes";

async function findTitleCredentials(title: string, userId: number){
    return prisma.credential.findFirst({
        where: {userId, title}
    })
};

async function createCredential(userId: number, credential: credentialsTypes.credentialsData){
  const credentialCreateInfo = {
    ...credential,
    userId
  }  
  return  prisma.credential.create({
    data: credentialCreateInfo
 })
}

export async function findAllCredentials(userId: number) {
  return await prisma.credential.findMany({
    where: { userId },
    select: {
      id: true,
      url: true,
      title: true,
      username: true,
      password: true,
    },
  });
}

export async function findCredentialById(userId: number, id: number) {
  return await prisma.credential.findFirst({
    where: { userId, id },
    select: {
      id: true,
      url: true,
      title: true,
      username: true,
      password: true,
    },
  });
}

const credentialsRepositories = {
    findTitleCredentials,
    createCredential,
    findAllCredentials,
    findCredentialById
}

export default credentialsRepositories;