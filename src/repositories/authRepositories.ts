import { prisma } from "../config/database";

async function findByEmailUser(email: string){
  return prisma.user.findFirst({
        where: { email }
  })
};

async function createUser(email: string, hashedPassword: string){
return prisma.user.create({
    data:{
        email,
        password: hashedPassword
    }
})
}

async function findUser(email: string) {
 return prisma.user.findUnique({
  where:{ email }
})
};

const authenticationRepositories = {
  findByEmailUser,
  createUser,
  findUser
};

export default authenticationRepositories;