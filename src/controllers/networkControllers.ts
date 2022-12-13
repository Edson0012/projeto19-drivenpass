import { Request, Response } from "express";
import httpStatus, { BAD_REQUEST } from "http-status";
import networkServices from "../services/networkServices";
import * as networkTypes from "../types/networkTypes";

export async function postRegisterWifi(req: Request, res:Response) {
    const wifiData = req.body as networkTypes.NetworkBody; 
    const { user } = res.locals;
    
    try{

        const wireless = await networkServices.registerWifi(wifiData, user.userId);

        return res.status(httpStatus.OK).send(wireless);

    }catch (error){

        return res.status(httpStatus.NOT_FOUND).send(error);
    }
};

export async function getAllNetworks(req: Request, res: Response){
    const { user } = res.locals;

    try{

        const allWireless = await networkServices.allWiFi(user.userId)

        return res.status(httpStatus.OK).send(allWireless);

    }catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
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

        if(error.type === "error_unauthorized"){
            return res.status(httpStatus.UNAUTHORIZED).send(error.message);
        }
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
    }
};