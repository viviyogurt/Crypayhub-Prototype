const select = require('../dao/select');
const insert = require('../dao/insert');
const primerUtil = require('../util/primerUtil');
const axiosUtil = require('../util/axiosUtil');
const serviceUtil = require('../util/serviceUtil');
const dbConfig = require('../../config/db');
const abi = require('../../config/abi');

const syncEventRecord = async (args) => {
    let continues = true;
    let pageNum = 0;
    let newTxRecordsCount = 0;
    let txResult = null;
    let txQuery = "";
    let startBlock = null;
    let latestBlock = null;

    // // init startBlock and latestBlock on new instances
    // let initPromises = [];
    // console.log(`BeforeInit: startBlock = ${startBlock}, latestBlock = ${latestBlock}`);
    // initPromises.push(select.lastBlockHeight());
    // txQuery = primerUtil.blockHeightQuery();
    // console.log(`Block height query string: ${txQuery}`);
    // let latestBlockQueryPromise = axiosUtil('get', txQuery);
    // initPromises.push(latestBlockQueryPromise);
    //
    // const allPromise = Promise.all(initPromises);
    // try {
    //     const values = await allPromise;
    //     console.log("all promise returned values", values);
    //
    //     //case of startBlock and endBlock not yet init
    //     startBlock = values[0];
    //     latestBlock = values[1].data.items[0].height;
    //
    // } catch (error) {
    //     console.log("Error occurred when init startBlock and latestBlock");
    //     throw (error);  // rejectReason of any first rejected promise
    // }
    // console.log(`AfterInit: startBlock = ${startBlock}, latestBlock = ${latestBlock}`);

    if (typeof (args.startblock) == 'undefined' || typeof (args.latestblock) == 'undefined'){
        throw "invalid param input"
    }
    startBlock = args.startblock;
    latestBlock = args.latestblock;

    //write the tx record to db with pagination query
    while (continues) {
        txQuery = primerUtil.CPHT_EventQuery(startBlock, pageNum);
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
        let records = [];
        for (let i = 0; i < txResult.length; i++) {
            let res = serviceUtil.structCovalentRecord(txResult[i]);
            // console.log(res);
            records.push(res);
        }
        try {
            await insert.batchWriteEvents(records);
        }catch (e) {
            console.log(`Fail to write events to DB in batch [start blockheight] = ${startBlock}, [end blockheight] = ${latestBlock}, [pageNum] = ${pageNum}`,e);
        }
        // console.log("records", records);
        newTxRecordsCount += txResult.length;
        pageNum++;
    }
}

const publishedLogHandle = async (topicName,eventLogObj) => {
    // let eventLogObj = JSON.parse(data);
    let record = [];
    if (topicName === "CPHT-Core-EventLog"){
        record.push(serviceUtil.structPublishedLog(eventLogObj, abi.CPHT));
    }else if (topicName === "CPHT-Subscription-EventLog"){
        record.push(serviceUtil.structPublishedLog(eventLogObj, abi.SUBSCRIPTION));
    }else {
        throw "Invalid pubsub topic";
    }
    try {
        await insert.batchWriteEvents(record);
    }catch (e) {
        throw `Fail to write events to DB, event log txHash = ${record[0].tx.tx_hash}`
    }
}

const getSenderWhitelist = async () => {
    try {
        return await select.senderWhitelist();
    }catch (e) {
        console.log(e);
        throw "Server Internal Error";
    }
}

const getReceiverWhitelist = async () => {
    try {
        return await select.receiverWhitelist();
    }catch (e) {
        console.log(e);
        throw "Server Internal Error";
    }
}


/**
 *
 * @returns {Promise<*>}
 * @param args
 */
const getCommissioners = async (args) => {
    if (typeof (args.account) === 'undefined' || !serviceUtil.checkIsAddress(args.account)){
        throw "Invalid Params input";
    }
    try {
        let offset = (typeof args.offset !== 'undefined') ? args.offset : 0
        let data = await select.accountCommissioners(args.account, dbConfig.pageLimit, parseInt(offset));
        serviceUtil.divideToExpectedUnit(
            data,
            {'commissionRate':1, 'oneTimeAward':6}
        )
        return data;
    } catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const countCommissioner = async (args) => {
    if (typeof (args.account) === 'undefined' || !serviceUtil.checkIsAddress(args.account)){
        throw "Invalid Params input";
    }
    try {
        console.log("count commissioner",args.account);
        return await select.countCommissioner(args.account);
    } catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const getCommissionRecords = async (args) => {
    if (typeof (args.account) === 'undefined' || !serviceUtil.checkIsAddress(args.account)){
        throw "Invalid Params input";
    }
    try {
        let offset = (typeof args.offset !== 'undefined') ? args.offset : 0
        let data = await select.getCommissionRecords(args.account, dbConfig.pageLimit, parseInt(offset));
        serviceUtil.divideToExpectedUnit(
            data,
            {'commissionFee':6}
            )
        console.log("data", data)
        return data;
    } catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const countCommissionRecord = async (args) => {
    if (typeof (args.account) === 'undefined' || !serviceUtil.checkIsAddress(args.account)){
        throw "Invalid Params input";
    }
    try {
        return await select.countCommissionRecord(args.account);
    } catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const getOneTimeAwardRecords = async (args) => {
    if (typeof (args.account) === 'undefined' || !serviceUtil.checkIsAddress(args.account)){
        throw "Invalid Params input";
    }
    try {
        let offset = (typeof args.offset !== 'undefined') ? args.offset : 0
        let data = await select.getOneTimeAwardRecords(args.account, dbConfig.pageLimit, parseInt(offset));
        return data;
    } catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const countOneTimeAwardRecord = async (args) => {
    if (typeof (args.account) === 'undefined' || !serviceUtil.checkIsAddress(args.account)){
        throw "Invalid Params input";
    }
    try {
        return await select.countOneTimeAwardRecord(args.account);
    } catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const getServiceInRank = async (args) => {
    if (typeof (args.orderBy) === 'undefined'){
        throw "Invalid Params input";
    }
    console.log(args.orderBy);
    try {
        let offset = (typeof args.offset !== 'undefined') ? args.offset : 0
        let data = await select.getServiceInRank(args.orderBy, dbConfig.pageLimit, parseInt(offset));
        for (let i=0; i<data.length; i++){
            data[i].oneTimeAward = data[i].oneTimeAward/(10**6);
            data[i].commissionRate = data[i].commissionRate/10;
            if (data[i].totalCommissionDeliver === null){
                data[i].totalCommissionDeliver = 0
            }else{
                data[i].totalCommissionDeliver = data[i].totalCommissionDeliver/(10**6);
            }
            if (data[i].totalAwardDeliver === null){
                data[i].totalAwardDeliver = 0;
            }else{
                data[i].totalAwardDeliver = data[i].totalAwardDeliver/(10**6);
            }
        }
        return data;
    } catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const countService = async (args) => {
    try {
        return await select.countService();
    } catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const getSubscriptionServices = async (args) => {
    if (typeof (args.merchant) === 'undefined'){
        throw "Invalid Params input";
    }
    try {
        let data = await select.getSubscriptionServices(args.merchant);
        serviceUtil.divideToExpectedUnit(
            data,
            {'fee':6}
        )
        return data;
    }catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

const getUserSubscriptions = async (args) => {
    if (typeof (args.user) === 'undefined'){
        throw "Invalid Params input";
    }
    try {
        let data = await select.getUserSubscriptions(args.user);
        serviceUtil.divideToExpectedUnit(
            data,
            {'price':6}
        )
        return data;
    }catch (e) {
        console.error(e);
        throw "Server Internal Error";
    }
}

module.exports = {
    syncEventRecord,
    publishedLogHandle,
    getSenderWhitelist,
    getReceiverWhitelist,
    getCommissioners,
    countCommissioner,
    getCommissionRecords,
    countCommissionRecord,
    getOneTimeAwardRecords,
    countOneTimeAwardRecord,
    getServiceInRank,
    countService,
    getSubscriptionServices,
    getUserSubscriptions
};