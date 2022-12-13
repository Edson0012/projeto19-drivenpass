import { conflictError, notFoundError, unauthorizedError } from "../middlewares/errorHandlingMiddleware";
import credentialsRepositories from "../repositories/credentialsRepositories";
import * as credentialsTypes from "../types/credentialsTypes";
import cryptrUtils from "../utils/cryptrUtils";

async function createCredentials(userId: number, credentials: credentialsTypes.credentialsData){
   const titleExist = await credentialsRepositories.findTitleCredentials(credentials.title, userId);

   if(titleExist) throw unauthorizedError("you already have a credential with that title");

   const hashedPassword = cryptrUtils.returnEncrypt(credentials.password);

   const created = await credentialsRepositories.createCredential(userId, {...credentials, password: hashedPassword});

   return created;
};

async function allCredentials(userId: number){
  const userAllCrendentials = await credentialsRepositories.findAllCredentials(userId);
  
  for (let i = 0; i < userAllCrendentials.length; i++) {
       const credentials = userAllCrendentials[i];
       credentials.password = cryptrUtils.returnDecrypt(credentials.password);
  }  

  return userAllCrendentials;
};

async function fetchCredentialById(userId: number, id: number) {
    const credentialId = await credentialsRepositories.findCredencialById(id);

    if(!credentialId) throw notFoundError("credential not found");

    if(credentialId.userId !== userId) throw unauthorizedError("the credential belongs to someone else");

    const passwordDecrypted = cryptrUtils.returnDecrypt(credentialId.password)

    const credentialById = {
      username: credentialId.username,
      title: credentialId.title,
      url: credentialId.url,
      password: passwordDecrypted,
    };

    return credentialById
}


async function deleteCredential( userId: number, id: number ){
    const credentialById = await credentialsRepositories.findCredencialById(id);

    console.log(credentialById);

    if(!credentialById) throw notFoundError("credential not found");

    if(credentialById.userId !== userId) throw unauthorizedError("this credential does not belong to you");

    const result = await credentialsRepositories.deleteCredentialById(id);

    return result;
}

const credentialsService = {
    createCredentials,
    allCredentials,
    fetchCredentialById,
    deleteCredential
}

export default credentialsService