const config = require('../../config/covalent');

function covalentEventQuery(networkID, contractAddress,startBlock, endingBlock, pageNum, pageSize, apiKey) {
    let queryStr = `https://api.covalenthq.com/v1/${networkID}/events/address/${contractAddress}/?starting-block=${startBlock}&ending-block=${endingBlock}&page-number=${pageNum}&page-size=${pageSize}&key=${apiKey}`
    console.log(queryStr);
    return queryStr;
}

function covalentBlockQuery(networkID, blockTime) {
    let queryStr = `https://api.covalenthq.com/v1/${networkID}/block_v2/${blockTime}/?&key=ckey_d0c4d4eec025404b887a2522ed3`
    return queryStr;
}

const primerUtil = {
    CPHT_EventQuery: (startBlock, pageNum) => {
        return covalentEventQuery(config.networkID, config.CPHT_Addr, startBlock, 'latest',
            pageNum, config.pageSize, config.apiKey);
    },
    blockHeightQuery: () => {
        return covalentBlockQuery(config.networkID, "latest");
    }
}

module.exports = primerUtil;