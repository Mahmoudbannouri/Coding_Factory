const { Eureka } = require('eureka-js-client');

const eurekaClient = new Eureka({
    instance: {
        app: 'reviews-service',
        instanceId: `reviews-service:${process.env.PORT || 8082}`,
        hostName: process.env.HOSTNAME || 'reviews-service', // Changed to use container hostname
        ipAddr: process.env.IP || 'reviews-service', // Changed for Docker
        port: {
            '$': parseInt(process.env.PORT) || 8082,
            '@enabled': true
        },
        vipAddress: 'reviews-service',
        statusPageUrl: `http://${process.env.HOSTNAME || 'reviews-service'}:${process.env.PORT || 8082}/info`,
        healthCheckUrl: `http://${process.env.HOSTNAME || 'reviews-service'}:${process.env.PORT || 8082}/health`,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        }
    },
    eureka: {
        host: process.env.EUREKA_HOST || 'eureka-server', // Changed to service name
        port: process.env.EUREKA_PORT || 8761,
        servicePath: '/eureka/apps/',
        registerWithEureka: true,
        fetchRegistry: true,
        heartbeatInterval: 30000,
        registryFetchInterval: 30000,
        maxRetries: 10,
        requestRetryDelay: 2000
    }
});
module.exports = eurekaClient;
