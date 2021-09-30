const decodeConfig = require('../../config/decode');
const abi = require('../../config/abi');
const ethers = require('ethers');

const structCovalentRecord = function (record) {
    let eventName = '';
    let tx = {
        tx_hash: record.tx_hash,
        block_height: record.block_height,
        block_signed_at: record.block_signed_at.slice(0, 19).replace('T', ' '),
    };
    let eventParams = {
        tx_hash: record.tx_hash,
    };

    if (record.decoded !== null) {
        eventName = record.decoded.name;
        let paramObjs = record.decoded.params;
        for (let i = 0; i < paramObjs.length; i++) {
            eventParams[paramObjs[i].name] = paramObjs[i].value;
        }
    } else {
        let topic0 = record.raw_log_topics[0];
        if (decodeConfig.topic0Events.hasOwnProperty(topic0) !== true) {
            throw "Event not be identified";
        }
        eventName = decodeConfig.topic0Events[topic0];
        let CPHT_ABI = abi.CPHT;
        let iface = new ethers.utils.Interface(CPHT_ABI);
        let result = iface.decodeEventLog(eventName, record.raw_log_data, record.raw_log_topics);
        let paramNames = decodeConfig.eventDecodedParams[eventName].paramNames;
        for (let i = 0; i < paramNames.length; i++) {
            let decodedParams = {};
            decodedParams.name = paramNames[i];
            //Handle on big number case, convert it as a string
            if (ethers.BigNumber.isBigNumber(result[i])) {
                decodedParams.value = parseInt(result[i].toString());
            } else {
                decodedParams.value = result[i];
            }
            eventParams[decodedParams.name] = decodedParams.value;
        }
    }
    objValueToLowerCase(tx);
    objValueToLowerCase(eventParams);
    return {eventName, tx, eventParams};
}

const structPublishedLog = function (logObj,abi){
    let tx = {
        tx_hash: logObj.transactionHash,
        block_height: logObj.blockNumber,
        block_signed_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    let eventName = '';
    let eventParams = {
        tx_hash: logObj.transactionHash,
    };
    let topic0 = logObj.topics[0];
    if (decodeConfig.topic0Events.hasOwnProperty(topic0) !== true) {
        throw "Event not be identified";
    }
    eventName = decodeConfig.topic0Events[topic0];
    // let CPHT_ABI = abi.CPHT;
    let iface = new ethers.utils.Interface(abi);
    let result = iface.decodeEventLog(eventName, logObj.data, logObj.topics);
    let paramNames = decodeConfig.eventDecodedParams[eventName].paramNames;
    for (let i = 0; i < paramNames.length; i++) {
        let decodedParams = {};
        decodedParams.name = paramNames[i];
        //Handle on big number case, convert it as a string
        if (ethers.BigNumber.isBigNumber(result[i])) {
            decodedParams.value = parseInt(result[i].toString());
        } else {
            decodedParams.value = result[i];
        }
        eventParams[decodedParams.name] = decodedParams.value;
    }
    return {eventName, tx, eventParams};
}

// transform address from mixture of uppercase and lowercase to lowercase
function objValueToLowerCase (obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        }
    }
}

const checkIsAddress = function (addr){
    let isAddr = ethers.utils.isAddress(addr);
    return isAddr;
}

/**
 *
 * @param dataArray
 * @param keyDivideUnit {propString, unitToDivide}
 */
const divideToExpectedUnit = function (dataArray, keyDivideUnit){
    for (let i=0; i<dataArray.length; i++){
        for (let key in keyDivideUnit) {
            console.log("----- 0", key);
            if (keyDivideUnit.hasOwnProperty(key)) {
                console.log("-----", key);
                dataArray[i][key] = (dataArray[i][key] / (10**keyDivideUnit[key]));
                console.log("data clean", dataArray[i][key]);
            }
        }
    }
}

module.exports = {structCovalentRecord, structPublishedLog, checkIsAddress, divideToExpectedUnit};
