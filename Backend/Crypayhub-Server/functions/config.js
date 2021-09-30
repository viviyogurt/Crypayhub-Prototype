const configParam = {
    apiKey: 'ckey_d0c4d4eec025404b887a2522ed3',
    CPHT_Addr: '0x44ccb1580E8673692c55b1DF9F6Eb59CeE0707F2',
    networkID: '80001',
    pageSize: '30',
    allowedOrigin:"http://localhost:8081",
    contractDeploymentBlock: 16780000,
    cacheRecordsNum: {
        Transfer: 5,
        SetExceptionTxFeeSender: 10,
        SetExceptionTxFeeReceiver: 10
    },
    queryActivityRecordNum: {
        CommissionerSet:10
    },
    eventName: {
        Transfer: 'Transfer',
        SetWhitelistSender:'SetWhitelistSender',
        SetWhitelistReceiver:'SetWhitelistReceiver'
    },
    eventField: {
        block_signed_at: "block_signed_at"
    },
    order: {
        asc: null,
        desc: "desc"
    },
    query: {
        latestTransferEventRecords: "latestTransferEventRecords",
        latestWhitelistAddress:"latestWhitelistAddress",
        accountCommissionerSetRecords:"accountCommissionerSetRecords"
    },
    events:{
        commissionerSet:"CommissionerSet"
    },
    topic0Events: {
        '0x4320debfb5c56d20b12fce1fc5ab82a9f530df7b2d87ba7df8e60bef2f79d1de':"SetMerchant",
        '0x1c846dde577cff05269ffeb28bd63a1df09fab50cda3c4710e260a610d8f8845':"SetServiceCommission",
        '0x938955bb7381540df249778717bd36e57d62ceb59bc2ff40052db7885d7d231a':"SetCommissioner",
        '0x261505bda6238fe11546a160676153426f33830f6a45adf6213b2c7aa763e7e2':"RemoveCommissioner",
        '0xe7ad0f12faac931eacd956cbdfc5bafe8fb4cc0f0f6cb714446518aead67389f':"DeliverCommission",
        '0x6e2975eed9452c3ca32d5a9447c131d8e6dacb73ba85e452899a6f9fb48176e7':"DeliverOneTimeAward",
        '0x317ee1e0b0b1c14465dc087aa3a92fcdfc3c9710a15603f420929a3d7b5aa1e4':"TransferPaymentFee",
        '0x07b4267d07ddf24802bf943493f122fd74bb136d1bc2058882fbd8aee53dc7e7':"SetWhitelistSender",
        '0xae492330a9893d2815f2f8ef5524f91965faae96e691d3ab9744d75e745af097':"SetWhitelistReceiver",
        '0xf29cb896428e089ea0c50341d03a3887b72f2c59aad004aa2c6331787e0f6be0':"SetProxyContractForTransfer"
    },
    eventDecodedParams: {
        SetMerchant: {
            paramNames:["merchantAddr", "isMerchant"],
        },
        SetServiceCommission:{
            paramNames:["account","rate","oneTimeAward", "validPeriodDay"],
        },
        SetCommissioner:{
            paramNames:["account", "customer", "commissioner", "validPeriod", "commissionRate", "oneTimeAward"],
        },
        RemoveCommissioner:{
            paramNames:["account", "customer", "commissioner"],
        },
        DeliverCommission:{
            paramNames:["merchant", "commissioner","customer","commissionFee"],
        },
        DeliverOneTimeAward:{
            paramNames:["merchant", "commissioner", "customer", "awardAmount"],
        },
        TransferPaymentFee:{
            paramNames:["from", "to", "value"],
        },
        SetWhitelistSender:{
            paramNames:["exceptionAddress", "transactionFeeRate"],
        },
        SetWhitelistReceiver:{
            paramNames:["exceptionAddress", "transactionFeeRate"],
        },
        SetProxyContractForTransfer:{
            paramNames:["proxyContract", "isProxyContract"],
        }
    }
}

module.exports = configParam;