import EurekaClient from 'eureka-js-client';
import {PORT} from "../configuration/constants.js"

const hostName = process.env.HOSTNAME || "localhost"; // TODO, for consistency, rename to HOST_NAME (both here as in docker-compose)
const ipAddress = process.env.IP_ADDRESS || "localhost";
const eurekaHost = process.env.EUREKA_HOST || "localhost";
const eurekaPort = process.env.EUREKA_PORT || 8761;
const eurekaServicePath = process.env.EUREKA_SERVICE_PATH || '/eureka/apps/';

export default new EurekaClient.Eureka({
    instance: {
        app: 'image',
        hostName: hostName,
        ipAddr: ipAddress,
        statusPageUrl: 'http://' + hostName + ':' + PORT + '/status',
        port: {
            '$': PORT,
            '@enabled': 'true',
        },
        vipAddress: "image",
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: eurekaHost,
        port: eurekaPort,
        servicePath: eurekaServicePath
    },
});