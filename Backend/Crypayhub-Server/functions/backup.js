const functions = require("firebase-functions");
const admin = require('firebase-admin');
const axiosUtil = require('./axiosUtil');
const primerUtil = require('./primerUtil');
const serviceFunction = require('./serviceFunction');
const config = require('./config');
const cache = require('./cache');

admin.initializeApp();

exports.syncBlockchainTx = functions.https.onRequest(async (req, res) => {
// exports.syncBlockchainTx = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
    let continues = true;
    let pageNum = 0;
    let newTxRecordsCount = 0;
    let txResult = null;
    let txQuery = "";
    let startBlock = null;
    let latestBlock = null;
    let latestEventBlockHeight = null;

    // init startBlock and latestBlock on new instances
    let initPromises = [];
    console.log(`BeforeInit: startBlock = ${startBlock}, latestBlock = ${latestBlock}`);

    initPromises.push(serviceFunction.getDbLatestTxBlock());

    txQuery = primerUtil.testnetBlockHeightQuery();
    console.log(`Block height query string: ${txQuery}`);
    let latestBlockQueryPromise = axiosUtil('get', txQuery);
    initPromises.push(latestBlockQueryPromise);

    const allPromise = Promise.all(initPromises);
    try {
        const values = await allPromise;
        console.log("all promise returned values", values);

        //case of startBlock and endBlock not yet init
        startBlock = values[0] + 1;
        latestBlock = values[1].data.items[0].height;

    } catch (error) {
        console.error("Error occurred when init startBlock and latestBlock",error);  // rejectReason of any first rejected promise
        res.status(500).send('Failed to initialized start block and end block param');
    }
    console.log(`AfterInit: startBlock = ${startBlock}, latestBlock = ${latestBlock}`);
    //write the tx record to db with pagination query
    while (continues) {
        txQuery = primerUtil.CPHT_TestnetEventQuery(startBlock, pageNum);
        console.log(`Event query str: ${txQuery}`);
        txResult = (await axiosUtil('get', txQuery)).data.items;

        //for situation with no tx happened in the queried block period
        if (txResult.length === 0) {
            continues = false;
            console.log("Tx event records up to date");
            break;
        }

        //write record to db in batch with atomic db transaction operation
        //data model: events => event_type, event_records => txHash
        const batch = admin.firestore().batch();
        for (let i = 0; i < txResult.length; i++) {
            let res = serviceFunction.structEventTxRecord(txResult[i]);
            let eventRecord = res.structRecordObj;
            let docRef = admin.firestore().collection('events').doc(res.eventName)
                .collection('eventRecords').doc();
            batch.set(docRef, eventRecord);

            //eventRecord to txHashAndEventRecord
            eventRecord.tx_hash = txResult[i].tx_hash;
            latestEventBlockHeight = eventRecord.block_height;
            // cache.addEventRecordToCache(eventRecord);
        }
        try {
            await serviceFunction.updateDBStat(batch, latestBlock, latestEventBlockHeight);
            await batch.commit();
            // cache.commitCacheRecord();
        } catch (e) {
            console.error(`Error when batch writing records to db: [startBlock] = ${startBlock}, [endBlock] = ${latestBlock}, 
                            [pageSize] = ${config.pageSize}, [page] = ${pageNum}`, e);
            // cache.rollBackCacheBuffer();
        }
        //update tx record count and the pageNum for next paginated query
        newTxRecordsCount += txResult.length;
        pageNum++;
    }

    //update start block for start block caching to prevent db startBlock state query of the current instance
    //update db blockHeight record to share the block height state between instances
    console.log(`Latest block write to db: ${latestBlock}`);
    // try {
    //     await serviceFunction.updateDBStat(latestBlock, latestEventBlockHeight);
    //     console.log("latest event block height", latestEventBlockHeight);
    // }catch (e) {
    //     console.log("Fail to update dbStat",e);
    // }

    res.json({result: `${newTxRecordsCount} tx records added`, cacheObj: cache.getCacheData()});
    // console.log({result: `${newTxRecordsCount} tx records added`, cacheObj: cache.getCacheData()});
    // return true;
})

exports.getEventRecords = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', config.allowedOrigin);
    res.set('Access-Control-Allow-Credentials', 'true');
    serviceFunction.eventsQuery(req.query).then((resolved) => {
        res.json(resolved);
    }).catch((err) => {
        console.log("Fail to get event records", err);
        res.status(500).send('Server Error Occurred');
    })
})

const ethers = require('ethers');
const abiData = require('./abi'); // Contract ABI
const web3eth = require('web3-eth');
const web3 = require('web3');


let mysql = require('mysql');
const dbUtil = require('./code/util/dbUtil');
exports.test = functions.https.onRequest( async (req, res) => {

    let DBConn = new dbUtil.DBUnity(await dbUtil.getConnection());
    await DBConn.beginTransaction();
    try{
        let query1=await DBConn.query("select username from user");
        if(!query1.success){
            DBConn.rollback()
            return [];
        }
        let query2=await DBConn.query("insert into test2(str) values('huv')");
        if(!query2.success){
            DBConn.rollback()
            return [];
        }
        DBConn.commit()
    }catch (e) {

    }

    let insertParam = {tx_hash:"0x5291b816dccd6fe40980598215b8133c382d7932f0720d8a5d5d2ed91ce09f18", block_height:17503552, block_signed_at:new Date().toJSON().slice(0, 19).replace('T', ' ')}
    dbUtil.query('insert into Tx set ?',insertParam).then((res) => {
        console.log("resolve:", res);
    }).catch((err) => {
        console.log("err:", err);
    })
    res.status(200).send();
})


exports.test2 = functions.https.onRequest( async (req, res) => {
    let insertParam = {tx_hash:"0x5291b816dccd6fe40980598215b8133c382d7932f0720d8a5d5d2ed91ce09f18", block_height:17503552, block_signed_at:new Date().toJSON().slice(0, 19).replace('T', ' ')}
    dbUtil.query('insert into Tx set ?',insertParam).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
    res.status(200).send();
});
////////////////////////////////////////////////////////////////////////////
const service = require('./code/service/service');
const reqConfig = require('./config/req');

exports.syncEventRecords = functions.https.onRequest(async (req, res) => {
    try {
        await service.syncEventRecord();
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
