import { conflictError, notFoundError, unauthorizedError } from "../middlewares/errorHandlingMiddleware";
import credentialsRepositories from "../repositories/credentialsRepositories";
import * as credentialsTypes from "../types/credentialsTypes";
import cryptrUtils from "../utils/cryptrUtils";

async function createCredentials(userId: number, credentials: credentialsTypes.credentialsData){
   if(!credentials) throw notFoundError("requires all fields to be submitted");

   const titleExist = await credentialsRepositories.findTitleCredentials(credentials.title, userId);

   if(titleExist) throw unauthorizedError("you already have a credential with that title");

   const hashedPassword = cryptrUtils.returnEncrypt(credentials.password);

   await credentialsRepositories.createCredential(userId, {...credentials, password: hashedPassword});
};

async function allCredentials(userId: number){
    const userAllCrendentials = await credentialsRepositories.findAllCredentials(userId);

    if(!userAllCrendentials) throw notFoundError("does not have credentials");

    
  for (let i = 0; i < userAllCrendentials.length; i++) {
    const credentials = userAllCrendentials[i];

    credentials.password = cryptrUtils.returnDecrypt(credentials.password);
  }

  return userAllCrendentials;
};

async function fetchCredentialById(userId: number, id: number) {
    const credential = await credentialsRepositories.findCredentialByIdAndUserId(userId, id);
  
    if(!credential) throw notFoundError("credential not found")

    const passwordDecrypted = cryptrUtils.returnDecrypt(credential.password)
    const credentialById = {
      ...credential,
      password: passwordDecrypted,
    };

    return credentialById
}
 
async function deleteCredential( userId: number, id: number ){
    if(!id) throw notFoundError("credential not found");

    const credentialById = await credentialsRepositories.findCredencialById(id);

    if(credentialById?.userId === userId) throw notFoundError("credential not found");


    return await credentialsRepositories.deleteCredentialByIdAndUserId(userId, id);
}

const credentialsService = {
    createCredentials,
    allCredentials,
    fetchCredentialById,
    deleteCredential
}

export default credentialsService