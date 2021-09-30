const config = require('./config');

// const primerStringURL = {
//     txQuery: "https://api.covalenthq.com/v1/80001/events/address/0xf9982C402f3742A3d4a488D686cAbAa83Ae0201F/?starting-block=16780000&ending-block=latest&page-number=0&page-size=2&key=ckey_d0c4d4eec025404b887a2522ed3"
// }
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
    CPHT_TestnetEventQuery: (startBlock, pageNum) => {
        return covalentEventQuery(config.networkID, config.CPHT_Addr, startBlock, 'latest',
            pageNum, config.pageSize, config.apiKey);
    },
    blockHeightQuery: () => {
        return covalentBlockQuery(config.networkID, "latest");
    }
}

// const covalentQuery = (networkID, contractAddress,startBlock, endingBlock, pageNum, pageSize, apiKey) => {
//     return `https://api.covalenthq.com/v1/${networkID}/events/address/${contractAddress}/?starting-block=${startBlock}&ending-block=${endingBlock}&page-number=${pageNum}&page-size=${pageSize}&key=${apiKey}`
// }
//
// const CPHT_TestnetEventQuery = (startBlock, pageNum) => {
//     return covalentQuery(config.networkID, config.CPHT_Addr, startBlock, 'latest',
//         pageNum, config.pageSize, config.apiKey);
// }

module.exports = primerUtil;