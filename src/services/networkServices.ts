import { conflictError, notFoundError, unauthorizedError } from "../middlewares/errorHandlingMiddleware";
import networkRepositories from "../repositories/networkRepositories";
import * as networkTypes from "../types/networkTypes";
import * as cryptrUtils from "../utils/cryptrUtils";

async function registerWifi(wifiData: networkTypes.NetworkBody, userId: number) {
    if(!wifiData.network || !wifiData.password || !wifiData.title) throw conflictError("requires all parameters filled");

    const hashedPassword = cryptrUtils.returnEncrypt(wifiData.password);

    await networkRepositories.createWifi({...wifiData, password: hashedPassword}, userId);
}

async function allWiFi(userId: number){
    const allWireless = await networkRepositories.findWiFiByUserId(userId);

    if(!allWireless) throw notFoundError("could not find any wifi");

    for (let i = 0; i < allWireless.length; i++) {

        const wireless = allWireless[i];
        wireless.password = cryptrUtils.returnDecrypt(wireless.password);

    }

    return allWireless;
}

async function wirelressById (userId: number, id: number) {
    if(!id) throw notFoundError("parameter not found");

    const wireless = await networkRepositories.findWiFiById(id);

    if(!wireless) throw notFoundError("network not found");

    if(wireless.userId !== userId) throw unauthorizedError("the network does not belong to you");

    const passwordDecrypted = cryptrUtils.returnDecrypt(wireless.password);
    const wirelessInfo = {
        ...wireless,
        password: passwordDecrypted
    }

    return wirelessInfo
};

async function deleteNetwork(userId: number, id: number){
    if(!id) throw notFoundError("parameter not found");

    const wireless = await networkRepositories.findWiFiById(id);

    if(!wireless) throw notFoundError("network not found");

    if(wireless.userId !== userId) throw unauthorizedError("the network does not belong to you");

    await networkRepositories.deleteWiFiByIdAndUserId(id);
};

const networkServices = {
    registerWifi,
    allWiFi,
    wirelressById,
    deleteNetwork,
}

export default networkServices;