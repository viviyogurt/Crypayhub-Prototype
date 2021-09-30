const config = require('./config');
const admin = require('firebase-admin');
const cache = require('./cache');
const ethers = require('ethers');
const abi = require('./abi');
const dbQuery = require('./dbQuery')

//read last event happened block height
async function getDbLatestEventBlockHeight (){
    const dbStat = admin.firestore().collection('stat').doc('dbStat');
    const doc = await dbStat.get();
    if (!doc.exists) {
        throw "DB Stat document not exist";
    } else {
        return doc.data().latestEventBlockHeight;
    }
}

const serviceFunction = {

    //read last recorded block height
    getDbLatestTxBlock: async () => {
        // try {
        const dbStat = admin.firestore().collection('stat').doc('dbStat');
        const doc = await dbStat.get();
        if (!doc.exists) {
            console.log('No dbStat document! Return contract deployment blocks height');
            return config.contractDeploymentBlock;
        } else {
            return doc.data().dbBlockHeight;
        }
    },



    updateDBStat: async (batch, blockHeight, latestEventBlockHeight) => {
        const dbStatRef = admin.firestore().collection('stat').doc('dbStat');
        const doc = await dbStatRef.get();
        if (!doc.exists) {
            if (latestEventBlockHeight == null){
                await batch.set(dbStatRef, {dbBlockHeight: blockHeight});
            }else{
                await batch.set(dbStatRef, {dbBlockHeight: blockHeight, latestEventBlockHeight: latestEventBlockHeight});
            }
            console.log("Create document dbStat, write with block height")
            return true;
        } else {
            if (latestEventBlockHeight == null){
                await batch.update(dbStatRef, {dbBlockHeight: blockHeight});
            }else{
                await batch.update(dbStatRef, {dbBlockHeight: blockHeight, latestEventBlockHeight: latestEventBlockHeight});
            }
            console.log("update db block height")
            return true;
        }
    },

    structEventTxRecord: (record) => {
        let structRecordObj = {
            block_height: record.block_height,
            block_signed_at: record.block_signed_at,
            tx_hash: record.tx_hash,
            // event_names:[],
            // event_values:[]
            // event_params: []
        };
        let eventName = '';
        if (record.decoded !== null) {
            eventName = record.decoded.name;
            let paramObjs = record.decoded.params;
            for (let i = 0; i < paramObjs.length; i++) {
                // structRecordObj.event_params.push({name: paramObjs[i].name, value: paramObjs[i].value});
                // structRecordObj.event_names.push(paramObjs[i].name);
                // structRecordObj.event_values.push(paramObjs[i].value);
                structRecordObj[paramObjs[i].name] = paramObjs[i].value;
            }
        }else{
            let topic0 = record.raw_log_topics[0];
            if (config.topic0Events.hasOwnProperty(topic0) !== true){
                throw "Event not be identified";
            }
            eventName = config.topic0Events[topic0];
            // structRecordObj.event_name = eventName;

            console.log("event Name", eventName);
            let CPHT_ABI = abi.CPHT;
            let iface = new ethers.utils.Interface(CPHT_ABI);
            let result = iface.decodeEventLog(eventName,record.raw_log_data, record.raw_log_topics);
            console.log("current event name", eventName);
            let paramNames = config.eventDecodedParams[eventName].paramNames;
            for (let i=0; i<paramNames.length; i++){
                let decodedParams = {};
                decodedParams.name = paramNames[i];
                console.log(`index: ${i} is big number: ${ethers.BigNumber.isBigNumber(result[i])}`)

                //Handle on big number case, convert it as a string
                if (ethers.BigNumber.isBigNumber(result[i])){
                    decodedParams.value = parseInt(result[i].toString());
                }else {
                    decodedParams.value = result[i];
                }
                // structRecordObj.event_params.push(decodedParams);
                structRecordObj[decodedParams.name] = decodedParams.value;
            }
            console.log("structRecordObj", structRecordObj.event_params);
        }
        // transform address from mixture of uppercase and lowercase to lowercase
        for (let key in structRecordObj) {
            if (structRecordObj.hasOwnProperty(key) && typeof structRecordObj[key] === 'string' && key !== 'event_name') {
                structRecordObj[key] = structRecordObj[key].toLowerCase();
                console.log("To lower case");
            }
        }
        return {structRecordObj,eventName};
    },

    eventsQuery: async (param) => {
        let res = null;
        let latestEventBlockHeight = await getDbLatestEventBlockHeight();
        console.log(param,param.activity, config.query.latestTransferEventRecords, param.activity === config.query.latestTransferEventRecords)
        switch (param.activity) {
            case config.query.latestTransferEventRecords:
                res = await cache.getCachedLatestTransferEvents(latestEventBlockHeight);
                break;
            case config.query.latestWhitelistAddress:
                res = await cache.getCachedLatestSetWhitelistEvents(latestEventBlockHeight);
                break;
            case config.query.accountCommissionerSetRecords:
                if (param.account === null){
                    throw "Invalid Query Param";
                }
                res = dbQuery.eventFilterQuery( config.events.commissionerSet,"account", param.account);
                break;
            default:
                throw "Invalid Query Activity";
        }
        return res;
    },

}

module.exports = serviceFunction;