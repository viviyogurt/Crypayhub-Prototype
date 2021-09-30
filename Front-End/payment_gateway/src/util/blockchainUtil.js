import Web3 from "web3";
import {config} from "@/config/config"
import {abi} from "@/config/abi";

// let web3Network = null;
let web3Network = new Web3(new Web3.providers.HttpProvider(config.httpProvider));
let CPHTContract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
let SubscriptionContract = new web3Network.eth.Contract(abi.SUBSCRIPTION, config.contract.SUBSCRIPTION);

const blockchainUtil = {

    blockchainConnection: async function () {
        await window.ethereum
            .request({
                "id": 1,
                "jsonrpc": "2.0",
                "method": "wallet_addEthereumChain",
                "params": [
                    {
                        "chainId": "0x13881",
                        "chainName": "Crypayhub Testnet",
                        "rpcUrls": ["https://matic-mumbai.chainstacklabs.com"],
                        "iconUrls": [
                            "https://xdaichain.com/fake/example/url/xdai.svg",
                            "https://xdaichain.com/fake/example/url/xdai.png"
                        ],
                        "nativeCurrency": {
                            "name": "GAS Token",
                            "symbol": "GAS",
                            "decimals": 18
                        }
                    }
                ]
            }).catch(error => {
            alert(error);
        });
    },
    async tokenRegistry(token){
        try {
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: token.tokenAddress, // The address that the token is at.
                        symbol: token.tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: token.tokenDecimals, // The number of decimals in the token
                        // image: token.tokenImage, // A string url of the token logo
                    },
                },
            });

            if (wasAdded) {
                console.log('Token added');
            } else {
                console.log('Add this token later!');
            }
        } catch (error) {
            alert("Error occur");
            console.log(error);
        }
    },

    web3Initialization(){
        web3Network = new Web3(new Web3.providers.HttpProvider(config.httpProvider));
    },

    getTokenBalance: async function (tokenAddress,account) {
        if (web3Network == null) {
            await this.web3Initialization();
        }
        const contract = new web3Network.eth.Contract(abi.ERC20_ABI, tokenAddress);
        let contractCallPromise = contract.methods.balanceOf(account).call();
        return await this.readContract(contractCallPromise);
    },

    getCPHTTotalSupply: async function () {
        if (web3Network == null) {
            await this.web3Initialization();
        }
        const contract = new web3Network.eth.Contract(abi.ERC20_ABI, config.contract.CPHT);
        let contractCallPromise = contract.methods.totalSupply().call();
        return await this.readContract(contractCallPromise);
    },

    CPHTContractIsAdmin: async function(account){
            let ownerAddress = await this.CPHTContractAdmin();
            return account.toUpperCase() == ownerAddress.toUpperCase();
    },

    CPHTContractAdmin: async function(){
        if (web3Network == null) {
            await this.web3Initialization();
        }
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.owner().call();
        return await this.readContract(contractCallPromise);
    },

    checkPaymentFee: async function(){
        if (web3Network == null) {
            await this.web3Initialization();
        }
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.transactionFee().call();
        return await this.readContract(contractCallPromise);
    },

    checkExceptionWhitelist: async function(){
        if (web3Network == null) {
            await this.web3Initialization();
        }
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.checkExceptionAddressArray().call();
        return await this.readContract(contractCallPromise);
    },

    checkSenderExceptedFeeRate: async function(targetAddress){
        if (web3Network == null) {
            await this.web3Initialization();
        }
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.exceptionAddressListOfSender(targetAddress).call();
        return await this.readContract(contractCallPromise);
    },

    checkReceiverExceptedFeeRate: async function(targetAddress){
        if (web3Network == null) {
            await this.web3Initialization();
        }
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.exceptionAddressListOfReceiver(targetAddress).call();
        return await this.readContract(contractCallPromise);
    },

    checkCommissionInfo: async function(targetAddress){
        if (web3Network == null) {
            await this.web3Initialization();
        }
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.serviceCommission(targetAddress).call();
        return await this.readContract(contractCallPromise);
    },
    getSubscriptionServiceInfo: async function(targetAddress, serviceID){
        const contract = new web3Network.eth.Contract(abi.SUBSCRIPTION, config.contract.SUBSCRIPTION);
        let contractCallPromise = contract.methods.serviceInfo(targetAddress,serviceID).call();
        return await this.readContract(contractCallPromise);
    },
    checkReferredCustommers: async function(targetAddress){
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.checkReferredCustomers(targetAddress).call();
        return await this.readContract(contractCallPromise);
    },
    checkCommissionerInfo: async function(receiver,customer){
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.commissionInfo(receiver,customer).call();
        return await this.readContract(contractCallPromise);
    },
    checkCommissionRateList: async function(){
        const contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let contractCallPromise = contract.methods.checkCommissionSettingArray().call();
        return await this.readContract(contractCallPromise);
    },
    checkMerchantRegistered: async function(merchantAddr){
        console.log("check Merchant registered:", merchantAddr);
        let contractCallPromise = CPHTContract.methods.merchant(merchantAddr).call();
        return await this.readContract(contractCallPromise);
    },
    readContract: async function (contractCallPromise) {
        let resolvedValue = null;
        await contractCallPromise.then((resolved) => {
            resolvedValue = resolved;
        }).catch((error) => {
            alert("Error occur during contract reading");
            console.log(error);
        });
        return resolvedValue;
    },


    //write contract
    approve: async function (userAccount,tokenAddress,spender,tokenAmount){
        let contract = new web3Network.eth.Contract(abi.ERC20_ABI, tokenAddress);
        console.log(userAccount,tokenAmount);
        let params = [{
                from: userAccount,
                to: tokenAddress,
                gas: '0x36c00', // 30400
                gasPrice: '0x9184e72a', // 10000000000000
                // value: '0x9184e72a', // 2441406250
                value: '0x0', // 2441406250
                data: contract.methods.approve(spender,tokenAmount).encodeABI()
        }];
        console.log(params);
        let txHash = await this.contractWrite(params);
        return txHash;
    },

    USDTCPHTSwap: async function (userAccount, tokenAmount){
        // let contract = new web3Network.eth.Contract(abi.swap, config.contract.swap);
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        console.log(userAccount,tokenAmount);
        let params = [{
            from: userAccount,
            // to: config.contract.swap,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            // data: contract.methods.stableCoinToCPHT(tokenAmount).encodeABI()
            data: contract.methods.deposit(tokenAmount).encodeABI()
        }];
        console.log(params);
        let txHash = await this.contractWrite(params);
        return txHash;
    },

    CPHTUSDTSwap: async function (userAccount, tokenAmount){
        // let contract = new web3Network.eth.Contract(abi.swap, config.contract.swap);
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        console.log(userAccount,tokenAmount);
        let params = [{
            from: userAccount,
            // to: config.contract.swap,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            // data: contract.methods.CPHTToStableCoin(tokenAmount).encodeABI()
            data: contract.methods.withdraw(tokenAmount).encodeABI()
        }];
        console.log(params);
        let txHash = await this.contractWrite(params);
        return txHash;
    },

    transfer: async function (userAccount,tokenAddress,receiver,tokenAmount){
        let contract = new web3Network.eth.Contract(abi.ERC20_ABI, tokenAddress);
        console.log(userAccount,tokenAmount);
        let params = [{
            from: userAccount,
            to: tokenAddress,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: contract.methods.transfer(receiver,tokenAmount*(10**6)).encodeABI()
        }];
        console.log(params);
        let txHash = await this.contractWrite(params);
        return txHash;
    },

    updateTransactionFee: async function(txFee,userAccount){
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let params = [{
            from: userAccount,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: contract.methods.setTransactionFee(txFee).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    addToSenderWhiteList: async function(targetAddress,userAccount, feeRate){
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let params = [{
            from: userAccount,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: contract.methods.setWhitelistSender(targetAddress,feeRate).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    addToReceiverWhiteList: async function(targetAddress,userAccount, feeRate){
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let params = [{
            from: userAccount,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: contract.methods.setWhitelistReceiver(targetAddress, feeRate).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    addToReceiverAndSenderWhiteList: async function(targetAddress,userAccount, feeRate){
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let params = [{
            from: userAccount,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: contract.methods.setWhitelistSenderAndReceiver(targetAddress, feeRate).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    updateCommissionInfo: async function(userAccount, newReferralFee, oneTimeAward, validPeriodDay){
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let params = [{
            from: userAccount,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: contract.methods.setServiceCommission(newReferralFee, oneTimeAward, validPeriodDay).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    customerCommissionerMapping: async function(userAccount, customer, commissioner){
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let params = [{
            from: userAccount,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: contract.methods.setCommissioner(customer, commissioner).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    customerCommissionerRemoving: async function(userAccount, customer) {
        let contract = new web3Network.eth.Contract(abi.CPHT, config.contract.CPHT);
        let params = [{
            from: userAccount,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: contract.methods.removeCommissioner(customer).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    addRemoveMerchant: async function(userAccount, merchantAddr, asMerchant){
        let params = [{
            from: userAccount,
            to: config.contract.CPHT,
            gas: '0x36c00', // 30400
            gasPrice: '0x9184e72a', // 10000000000000
            // value: '0x9184e72a', // 2441406250
            value: '0x0', // 2441406250
            data: CPHTContract.methods.setMerchant(merchantAddr, asMerchant).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    setSubscriptionService: async function(userAccount, id, name, fee, period){
        let params = [{
            from: userAccount,
            to: config.contract.SUBSCRIPTION,
            gas: '0x96c00',
            gasPrice: '0x9184e72a',
            value: '0x0', // 2441406250
            data: SubscriptionContract.methods.setSubscriptionServiceInfo(id, name, fee, period).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },
    subscribe: async function(userAccount, serviceProvider, id){
        let params = [{
            from: userAccount,
            to: config.contract.SUBSCRIPTION,
            gas: '0x96c00',
            gasPrice: '0x9184e72a',
            value: '0x0', // 2441406250
            data: SubscriptionContract.methods.subscribe(serviceProvider, id).encodeABI()
        }];
        console.log(params);
        return await this.contractWrite(params);
    },

    contractWrite: async function(params){
        let txHash;
        await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params
            })
            .then((result) => {
                console.log("send trnasaction result");
                console.log(result);
                txHash = result;
            })
            .catch((error) => {
                if (error.code!=4001) {
                    alert("Error occur");
                }
                console.log(error);
            });
        return txHash;
    },

    waitForTxToBeMined: async function(txHash) {
        let txReceipt;
        if (web3Network == null) {
            await this.web3Initialization();
        }
        while (!txReceipt) {
            await this.sleep(10000);
            try {
                txReceipt = await web3Network.eth.getTransactionReceipt(txHash)
                console.log(txReceipt);
            } catch (err) {
                console.error("blockchainUtil.js Error");
                console.error(err);
                // return indicateFailure(err)
            }

        }
        return txReceipt.status;
    },

    sleep: function (delay){
        return new Promise((resolve) => setTimeout(resolve, delay));
    },

    checkIsAddress: function(address){
        return Web3.utils.isAddress(address.toUpperCase());
    },
}

export {blockchainUtil};