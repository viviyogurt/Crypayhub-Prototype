const dbUtil = require('../util/dbUtil');
const covalentConfig = require('../../config/covalent')

const lastBlockHeight = async () => {
    let lastBlockHeight = (await dbUtil.query("SELECT MAX(block_height) AS lastBlockHeight FROM Tx"))[0].lastBlockHeight;
    if (lastBlockHeight === null) {
        return covalentConfig.contractDeploymentBlock
    } else {
        return lastBlockHeight + 1;
    }
}

const senderWhitelist = async () => {
    let senderWhitelist = (await dbUtil.query(
        "SELECT \n" +
        "    Tx.tx_hash,\n" +
        "    Tx.block_height,\n" +
        "    Tx.block_signed_at,\n" +
        "    SetWhitelistSender.exceptionAddress,\n" +
        "    SetWhitelistSender.transactionFeeRate\n" +
        "FROM\n" +
        "    SetWhitelistSender\n" +
        "        INNER JOIN\n" +
        "    Tx ON Tx.tx_hash = SetWhitelistSender.tx_hash\n" +
        "GROUP BY SetWhitelistSender.exceptionAddress\n" +
        "HAVING MAX(Tx.block_height) = Tx.block_height\n" +
        "ORDER BY Tx.block_height DESC"
    ));
    return senderWhitelist;
}

const receiverWhitelist = async () => {
    let receiverWhitelist = (await dbUtil.query(
        "SELECT \n" +
        "    Tx.tx_hash,\n" +
        "    Tx.block_height,\n" +
        "    Tx.block_signed_at,\n" +
        "    SetWhitelistReceiver.exceptionAddress,\n" +
        "    SetWhitelistReceiver.transactionFeeRate\n" +
        "FROM\n" +
        "    SetWhitelistReceiver\n" +
        "        INNER JOIN\n" +
        "    Tx ON Tx.tx_hash = SetWhitelistReceiver.tx_hash\n" +
        "GROUP BY SetWhitelistReceiver.exceptionAddress\n" +
        "HAVING MAX(Tx.block_height) = Tx.block_height\n" +
        "ORDER BY Tx.block_height DESC"
    ));
    return receiverWhitelist;
}

const accountCommissioners = async (account, limit, offset) => {
    let sql = "SELECT \n    SetTable.tx_hash,\n    SetTable.block_height,\n    SetTable.block_signed_at,\n    SetTable.account,\n    SetTable.customer,\n    SetTable.commissioner,\n    SetTable.commissionRate,\n    SetTable.oneTimeAward,\n    SetTable.validPeriod\nFROM\n    (SELECT \n        Tx.tx_hash,\n            Tx.block_height,\n            Tx.block_signed_at,\n            SetCommissioner.account,\n            SetCommissioner.customer,\n            SetCommissioner.commissioner,\n            SetCommissioner.commissionRate,\n            SetCommissioner.oneTimeAward,\n            SetCommissioner.validPeriod\n    FROM\n        SetCommissioner\n    INNER JOIN Tx ON Tx.tx_hash = SetCommissioner.tx_hash\n    WHERE\n        account = ?\n    GROUP BY customer , commissioner\n    HAVING MAX(Tx.block_height) = Tx.block_height) AS SetTable\n        LEFT OUTER JOIN\n    (SELECT \n        Tx.block_height,\n            RemoveCommissioner.commissioner,\n            RemoveCommissioner.customer\n    FROM\n        RemoveCommissioner\n    INNER JOIN Tx ON Tx.tx_hash = RemoveCommissioner.tx_hash\n    WHERE\n        account = ?\n    GROUP BY customer , commissioner\n    HAVING MAX(Tx.block_height) = Tx.block_height) AS RemoveTable ON SetTable.customer = RemoveTable.customer\n        AND SetTable.commissioner = RemoveTable.commissioner\nWHERE\n    SetTable.block_height > RemoveTable.block_height\n        OR RemoveTable.block_height IS NULL\nORDER BY block_height\nLIMIT ? OFFSET ?;"
    let params = [account, account, limit, offset]
    let accountCommissioners = (await dbUtil.query(sql, params));
    console.log(sql);
    console.log(params);
    return accountCommissioners;
}

const countCommissioner = async (account) => {
    let sql = "SELECT\n    COUNT(*) As recordNum\nFROM\n    (SELECT\n        Tx.tx_hash,\n            Tx.block_height,\n            SetCommissioner.customer,\n            SetCommissioner.commissioner\n    FROM\n        SetCommissioner\n    INNER JOIN Tx ON Tx.tx_hash = SetCommissioner.tx_hash\n    WHERE\n        account = ?\n    GROUP BY customer , commissioner\n    HAVING MAX(Tx.block_height) = Tx.block_height) AS SetTable\n        LEFT OUTER JOIN\n    (SELECT\n        Tx.block_height,\n            RemoveCommissioner.commissioner,\n            RemoveCommissioner.customer\n    FROM\n        RemoveCommissioner\n    INNER JOIN Tx ON Tx.tx_hash = RemoveCommissioner.tx_hash\n    WHERE\n        account = ?\n    GROUP BY customer , commissioner\n    HAVING MAX(Tx.block_height) = Tx.block_height) AS RemoveTable ON SetTable.customer = RemoveTable.customer\n        AND SetTable.commissioner = RemoveTable.commissioner\nWHERE\n    SetTable.block_height > RemoveTable.block_height\n        OR RemoveTable.block_height IS NULL";
    let params = [account, account]
    let commissionerNum = (await dbUtil.query(sql, params));
    console.log("commissioner num", commissionerNum);
    return commissionerNum;
}

const getCommissionRecords = async (account, limit, offset) => {
    let sql = "SELECT\n    Tx.tx_hash,\n    Tx.block_height,\n    Tx.block_signed_at,\n    DeliverCommission.commissioner,\n    DeliverCommission.commissionFee,\n    DeliverCommission.customer,\n    DeliverCommission.merchant\nFROM\n    DeliverCommission\n        INNER JOIN\n    Tx ON Tx.tx_hash = DeliverCommission.tx_hash\nWHERE\n    commissioner = ?\nORDER BY block_height\nLIMIT ? OFFSET ?;";
    let params = [account, limit, offset];
    let commissionRecords = (await dbUtil.query(sql, params));
    console.log("commission Records", commissionRecords);
    return commissionRecords;
}

const countCommissionRecord = async (account) => {
    let sql = "select count(*) As recordNum from DeliverCommission\nwhere commissioner = ?;";
    let params = [account]
    let commissionRecordNum = (await dbUtil.query(sql, params));
    console.log("commission record num", commissionRecordNum);
    return commissionRecordNum;
}

const getOneTimeAwardRecords = async (account, limit, offset) => {
    let sql = "SELECT\n    Tx.tx_hash,\n    Tx.block_height,\n    Tx.block_signed_at,\n    DeliverOneTimeAward.commissioner,\n    DeliverOneTimeAward.awardAmount,\n    DeliverOneTimeAward.customer,\n    DeliverOneTimeAward.merchant\nFROM\n    DeliverOneTimeAward\n        INNER JOIN\n    Tx ON Tx.tx_hash = DeliverOneTimeAward.tx_hash\nWHERE\n    commissioner = ?\nORDER BY block_height\nLIMIT ? OFFSET ?;";
    let params = [account, limit, offset];
    let awardRecords = (await dbUtil.query(sql, params));
    console.log("award Records", awardRecords);
    return awardRecords;
}

const countOneTimeAwardRecord = async (account) => {
    let sql = "select count(*) As recordNum from DeliverOneTimeAward\nwhere commissioner = ?;";
    let params = [account]
    let awardRecordNum = (await dbUtil.query(sql, params));
    console.log("award record num", awardRecordNum);
    return awardRecordNum;
}

const getServiceInRank = async (orderBy, limit, offset) => {
    let sql = 'SELECT\n    Service.account AS merchant,\n    Service.oneTimeAward,\n    Service.rate as commissionRate,\n    Service.validPeriodDay,\n    Total.totalCommissionDeliver,\n    Total2.totalAwardDeliver\nFROM\n    (SELECT\n        Tx.block_height,\n            SetServiceCommission.account,\n            SetServiceCommission.oneTimeAward,\n            SetServiceCommission.rate,\n            SetServiceCommission.validPeriodDay\n    FROM\n        SetServiceCommission\n    INNER JOIN Tx ON Tx.tx_hash = SetServiceCommission.tx_hash\n    GROUP BY account\n    HAVING MAX(block_height) = block_height) AS Service\n        LEFT OUTER JOIN\n    (SELECT\n        SUM(commissionFee) AS totalCommissionDeliver, merchant\n    FROM\n        DeliverCommission\n    GROUP BY merchant) AS Total ON Total.merchant = Service.account\n\n        LEFT OUTER JOIN\n    (SELECT\n        SUM(awardAmount) AS totalAwardDeliver, merchant\n    FROM\n        DeliverOneTimeAward\n    GROUP BY merchant) AS Total2 ON Total2.merchant = Service.account\n\n    where Service.oneTimeAward > 0 or\n    (Service.rate > 0 and Service.validPeriodDay > 0)\n\n    order by ' + orderBy + ' desc\n    limit ?\n    offset ?;';
    console.log(typeof (orderBy))
    let params = [limit, offset];
    let serviceRecords = (await dbUtil.query(sql,params));
    console.log("service Records", serviceRecords);
    return serviceRecords;
}

const countService = async (account) => {
    let sql = "SELECT\n    count(*) as recordNum\nFROM\n    (SELECT\n        Tx.block_height,\n            SetServiceCommission.account,\n            SetServiceCommission.oneTimeAward,\n            SetServiceCommission.rate,\n            SetServiceCommission.validPeriodDay\n    FROM\n        SetServiceCommission\n    INNER JOIN Tx ON Tx.tx_hash = SetServiceCommission.tx_hash\n    GROUP BY account\n    HAVING MAX(block_height) = block_height) AS Service\n    where Service.oneTimeAward > 0 or\n    (Service.rate > 0 and Service.validPeriodDay > 0);";
    let serviceRecordNum = (await dbUtil.query(sql));
    console.log("service record num", serviceRecordNum);
    return serviceRecordNum;
}

const getSubscriptionServices = async (merchant) => {
    let params = [merchant];
    let sql = "SELECT\n    serviceProvider, serviceIndex, serviceName, fee, period, block_signed_at as publishTime\nFROM\n    SetService\n        INNER JOIN\n    Tx ON Tx.tx_hash = SetService.tx_hash\nWHERE\n    serviceProvider = ?\n    order by Tx.block_signed_at";
    let subscriptionServices = (await dbUtil.query(sql, params));
    return subscriptionServices;
}

const getUserSubscriptions = async (user) => {
    let params = [user];
    let sql = "SELECT\n    recipient as serviceProvider, customer, serviceIndex, price, subscriptionTime, expirationTime\nFROM\n    Subscribe\n        INNER JOIN\n    Tx ON Tx.tx_hash = Subscribe.tx_hash\nWHERE\n    customer = ?\n    order by subscriptionTime";
    let subscribedServices = (await dbUtil.query(sql, params));
    return subscribedServices;
}

module.exports = {
    lastBlockHeight,
    senderWhitelist,
    receiverWhitelist,
    accountCommissioners,
    countCommissioner,
    getCommissionRecords,
    countCommissionRecord,
    getOneTimeAwardRecords,
    countOneTimeAwardRecord,
    getServiceInRank,
    countService,
    getSubscriptionServices,
    getUserSubscriptions
}