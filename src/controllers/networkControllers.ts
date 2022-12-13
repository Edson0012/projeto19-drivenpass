import { Request, Response } from "express";
import httpStatus, { BAD_REQUEST } from "http-status";
import networkServices from "../services/networkServices";
import * as networkTypes from "../types/networkTypes";

export async function postRegisterWifi(req: Request, res:Response) {
    const wifiData = req.body as networkTypes.NetworkBody; 
    const { user } = res.locals;
    
    try{

        await networkServices.registerWifi(wifiData, user.userLd);

        return res.status(httpStatus.OK).send("created");

    }catch (error){

        if(error.type === "error_conflict"){
            return res.status(httpStatus.CONFLICT).send(error.message);
        }

        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}

export async function getAllNetworks(req: Request, res: Response){
    const { user } = res.locals;

    try{

        const allWiFi = await networkServices.allWiFi(user.userId)

        return res.status(httpStatus.OK).send(allWiFi);

    }catch (error) {

        if(error.type === "error_not_found"){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
    
        return res.status(BAD_REQUEST).send(error.message);
    }
};

export async function getNetworksById ( req: Request, res: Response ) {
    const { user } = res.locals;
    const id = req.params.id;

    try{
        const wirelessById = await networkServices.wirelressById(user.userId, +id)

        return res.status(httpStatus.OK).send(wirelessById)

    }catch (error){

        if(error.type === "error_not_found"){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }

        return res.status(BAD_REQUEST).send(error.message);
    }
}

export async function deleteNetworkByIdAndUserId ( req: Request, res:Response ){
    const { user } = res.locals;
    const id = req.params.id;

    try{

        await networkServices.deleteNetwork(user.userId, +id);

        return res.status(httpStatus.OK).send("deleted");

    }catch(error){

        if(error.type === "error_not_found"){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
    
          if(error.type === "error_unauthorized"){
            return res.status(httpStatus.UNAUTHORIZED).send(error.message);
        }

        return res.status(BAD_REQUEST).send(error.message);
    }
};