const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

exports.CPHTCoreEventLogHandle = functions.pubsub.topic('CPHT-Core-EventLog').onPublish(async (message) => {
    await service.publishedLogHandle("CPHT-Core-EventLog", message.json);
});

exports.CPHTSubscriptionEventLogHandle = functions.pubsub.topic('CPHT-Subscription-EventLog').onPublish(async (message) => {
    await service.publishedLogHandle("CPHT-Subscription-EventLog", message.json);
});

////////////////////////////////////////////////////////////////////////////
const service = require('./code/service/service');
const reqConfig = require('./config/req');

exports.syncEventRecords = functions.https.onRequest(async (req, res) => {
    try {
        await service.syncEventRecord(req.query);
        res.status(200).send('Function Run Success');
    }catch (e) {
        console.error(e);
        res.status(500).send('Server Internal Error');
    }
})

exports.getSenderWhitelist = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.getSenderWhitelist();
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.getReceiverWhitelist = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.getReceiverWhitelist();
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.getCommissioners = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.getCommissioners(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.countCommissioner = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.countCommissioner(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.getCommissionRecords = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.getCommissionRecords(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.countCommissionRecord = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.countCommissionRecord(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.getOneTimeAwardRecords = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.getOneTimeAwardRecords(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.countOneTimeAwardRecord = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.countOneTimeAwardRecord(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.getServiceInRank = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.getServiceInRank(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.countService = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.countService(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.getSubscriptionServices = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.getSubscriptionServices(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});

exports.getUserSubscriptions = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', reqConfig.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    try {
        let data = await service.getUserSubscriptions(req.query);
        res.json({code:0, message:"Success", data:data});
    }catch (e) {
        res.json({code:1, message:e});
    }
});