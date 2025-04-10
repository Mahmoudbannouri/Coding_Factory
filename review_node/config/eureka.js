const { Eureka } = require('eureka-js-client');

// Create an instance of Eureka client using environment variables for configuration
const eurekaClient = new Eureka({
    instance: {
        app: 'reviews-service',
        instanceId: `reviews-service:${process.env.PORT || 8082}`,
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: { '$': process.env.PORT || 8082, '@enabled': true },
        vipAddress: 'reviews-service',
        statusPageUrl: `http://localhost:${process.env.PORT || 8082}/info`,
        healthCheckUrl: `http://localhost:${process.env.PORT || 8082}/health`,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        }
    },
    eureka: {
        host: process.env.EUREKA_HOST || 'localhost',
        port: process.env.EUREKA_PORT || 8761,
        servicePath: '/eureka/apps/',
        registerWithEureka: true,
        fetchRegistry: true,
        heartbeatInterval: 30000,
        registryFetchInterval: 30000
    }
});

// Start Eureka client
eurekaClient.start((error) => {
    if (error) {
        console.error('Eureka client failed to start:', error);
    } else {
        console.log('Eureka client started successfully');
    }
});

module.exports = eurekaClient;
