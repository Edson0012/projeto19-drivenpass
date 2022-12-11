import { Request, Response } from "express";
import httpStatus from "http-status";
import credentialsService from "../services/credentialsServices";

export async function postCredentialsByUser( req: Request, res: Response ) {
  const credentials = req.body;
  const { user } = res.locals;
  

try{
      const result = await credentialsService.createCredentials(user.id, credentials);

      return res.status(httpStatus.OK).send(result);
    } catch(error: any) {
      if(error.type === "error_not_found"){
        return res.status(httpStatus.NOT_FOUND).send(error.message);
      }

      if(error.type === "error_unauthorized"){
        return res.status(httpStatus.UNAUTHORIZED).send(error.message);
      }
      return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}

export async function getAllCredentials(req: Request, res: Response) {
  const { user } = res.locals;

  try {
    const allCredentials = await credentialsService.allCredentials(user.id);

    res.status(httpStatus.OK).send(allCredentials);
  } catch (error: any) {
    if(error.type === "error_not_found"){
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function getCredentialById(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { user } = res.locals;

  try {
    const credential = await credentialsService.fetchCredentialById(user.id, id)

    res.status(200).send(credential);
  } catch (error: any) {
    if(error.type === "error_not_found"){
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function deleteCredentialById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { user } = res.locals;

  try {
    
    await credentialsService.deleteCredential(user.id, id)

    res.status(httpStatus.OK).send("Credencial Deleted");
  } catch (error: any) {
    if(error.type === "error_not_found"){
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}