import { prisma } from "../config/database";
import * as networkTypes from "../types/networkTypes";

async function createWifi(wifiData: networkTypes.NetworkBody, userId: number ) {

    const wifiInfo = {
        ...wifiData,
        userId
    }

    return prisma.network.create({
        data: wifiInfo
    })
};

async function findWiFiByUserId(userId: number){
    return prisma.network.findMany({
        where: {userId},
        select: {
            id: true,
            title: true,
            network: true,
            password: true,
        }
    })
}

async function findWiFiById(id: number){
    return prisma.network.findFirst({
        where:{id},
        select: {
            id: true,
            title: true,
            network: true,
            password: true,
            userId: true,
        }
    })
};

async function deleteWiFiByIdAndUserId( id: number ) {
    return prisma.network.delete({
        where: {id}
    })
}

const networkRepositories = {
    createWifi,
    findWiFiByUserId,
    findWiFiById,
    deleteWiFiByIdAndUserId,
};

export default networkRepositories;