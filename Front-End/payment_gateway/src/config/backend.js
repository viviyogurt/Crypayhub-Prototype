const backend = {
    backendQueryURL:"http://localhost:5001/crypayhub-dev/us-central1",
    backendAPI:{
        getCommissioners:"getCommissioners",
        getSenderWhitelist:"getSenderWhitelist",
        getReceiverWhitelist:"getReceiverWhitelist",
        countCommissioner:"countCommissioner",
        getCommissionRecords:"getCommissionRecords",
        countCommissionRecord:"countCommissionRecord",
        getOneTimeAwardRecords:"getOneTimeAwardRecords",
        countOneTimeAwardRecord:"countOneTimeAwardRecord",
        getServiceInRank:"getServiceInRank",
        countService:"countService",
        getSubscriptionServices:"getSubscriptionServices",
        getUserSubscriptions:"getUserSubscriptions"
    }
}

module.exports = backend;