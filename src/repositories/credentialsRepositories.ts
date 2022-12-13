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

async function findCredencialById(id: number) {
  return prisma.credential.findFirst({
    where: {id},
    select: {
      id: true,
      url: true,
      title: true,
      username: true,
      password: true,
      userId: true,
    },
  })
}

async function findAllCredentials(userId: number) {
  return prisma.credential.findMany({
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

async function findCredentialByIdAndUserId(userId: number, id: number) {
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

async function deleteCredentialById( id: number) { 
  return prisma.credential.delete({
    where: { id: id }
  })
};

const credentialsRepositories = {
    findTitleCredentials,
    createCredential,
    findAllCredentials,
    findCredentialByIdAndUserId,
    deleteCredentialById,
    findCredencialById
}

export default credentialsRepositories;