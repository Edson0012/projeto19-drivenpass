import { conflictError, notFoundError, unauthorizedError, unprocessableError } from "../middlewares/errorHandlingMiddleware";
import networkRepositories from "../repositories/networkRepositories";
import * as networkTypes from "../types/networkTypes";
import * as cryptrUtils from "../utils/cryptrUtils";

async function registerWifi(wifiData: networkTypes.NetworkBody, userId: number) {

    const hashedPassword = cryptrUtils.returnEncrypt(wifiData.password);

    const wireless = await networkRepositories.createWifi({...wifiData, password: hashedPassword}, userId);

    const wirelressInfo = {
        id: wireless.id,
        title: wireless.title,
        network: wireless.network
    }

    if(!wirelressInfo) throw notFoundError("not found");

    return wirelressInfo;
}

async function allWiFi(userId: number){
    const allWireless = await networkRepositories.findWiFiByUserId(userId);

    if(allWireless.length <= 0) throw notFoundError("wireless not found")

    return allWireless;
}

async function wirelressById (userId: number, id: number) {

    const wireless = await networkRepositories.findWiFiById(id);

    if(!wireless) throw notFoundError("network not found");

    if(wireless.userId !== userId) throw unauthorizedError("the network does not belong to you");

    const wirelessInfo = {
        title: wireless.title,
        network: wireless.network,
    }

    return wirelessInfo
};

async function deleteNetwork(userId: number, id: number){

    const wireless = await networkRepositories.findWiFiById(id);

    if(!wireless) throw notFoundError("network not found");

    if(wireless.userId !== userId) throw unauthorizedError("the network does not belong to you");

   return await networkRepositories.deleteWiFiByIdAndUserId(id);
};

const networkServices = {
    registerWifi,
    allWiFi,
    wirelressById,
    deleteNetwork,
}

export default networkServices;