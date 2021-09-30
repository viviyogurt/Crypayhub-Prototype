/**
 *
 * eventRecord contain tx_hash field
 */

const config = require('./config');
const dbQuery = require('./dbQuery');

let cacheObj = {
    transferEvent:[],
    whitelistAddress:{
        setExceptionTxFeeSender:[],
        setExceptionTxFeeReceiver:[],
    }
}

let cachedBlockHeight;

// let cacheEventLatestBlock = {
//     transferEvent:null
// }

// let cacheBufferObj = {
//     transferEvent : [],
// }
//
// function setCacheRecord(cachingBufferQueue, maxLength, eventRecord) {
//     if(cachingBufferQueue.length < maxLength){
//         cachingBufferQueue.unshift(eventRecord);
//     }else{
//         cachingBufferQueue.pop();
//         cachingBufferQueue.unshift(eventRecord);
//     }
// }

const caching = {

    // addEventRecordToCache: (eventRecord) => {
    //     setCacheRecord(cacheBufferObj.transferEvent, config.cacheRecordsNum.transferEvent, eventRecord);
    // },
    //
    // commitCacheRecord:() => {
    //     cacheObj = {...cacheBufferObj};
    // },
    //
    // rollBackCacheBuffer:() => {
    //     cacheBufferObj = {...cacheObj};
    // },

    getCacheData:() => {
        return cacheObj;
    },

    getCachedLatestTransferEvents: async (latestEventBlockHeight) => {
        await cachedRecordUpToDateHandle(latestEventBlockHeight);
        console.log("return cached transfer event records");
        return cacheObj.transferEvent;
    },

    getCachedLatestSetWhitelistEvents: async (latestEventBlockHeight) => {
        await cachedRecordUpToDateHandle(latestEventBlockHeight);
        console.log("return cached transfer event records");
        return cacheObj.whitelistAddress;
    }
}

async function cachedRecordUpToDateHandle(latestEventtBlockHeight){
    let promiseGetRecords = []
    if (latestEventtBlockHeight !== cachedBlockHeight) {
        promiseGetRecords.push(updateTransfer());
        promiseGetRecords.push(updateSetWhitelistReceiver());
        promiseGetRecords.push(updateSetWhitelistSender());
    }
    const allPromise = Promise.all(promiseGetRecords);
    await allPromise;
    cachedBlockHeight = latestEventtBlockHeight;
    return null;
}

async function updateTransfer(){
    let transferEventRecords = await dbQuery.eventLatestRecordsQuery(config.eventName.Transfer);
    console.log("set db transfer event records to cache");
    cacheObj.transferEvent = transferEventRecords;
}

async function updateSetWhitelistReceiver(){
    let setExceptionTxFeeSenderEventRecords = await dbQuery.eventLatestRecordsQuery(config.eventName.SetWhitelistSender);
    console.log("set db sender tx fee exception event records to cache");
    cacheObj.whitelistAddress.setExceptionTxFeeSender = setExceptionTxFeeSenderEventRecords;
}

async function updateSetWhitelistSender(){
    let setExceptionTxFeeReceiverEventRecords = await dbQuery.eventLatestRecordsQuery(config.eventName.SetWhitelistReceiver);
    console.log("set db receiver tx fee exception event records to cache");
    cacheObj.whitelistAddress.setExceptionTxFeeReceiver = setExceptionTxFeeReceiverEventRecords;
}

module.exports = caching;