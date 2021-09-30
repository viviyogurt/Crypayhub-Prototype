<template>
    <div class="pageContainer">
        <b-card class="cardContainer" bg-variant="dark" text-variant="white">
            <b-overlay :show="show" rounded="sm">
                <div>
                    <b-card-title style="float: left" class="m-2">{{service}}</b-card-title>
                    <b-button v-if="!connected" @click="onClickConnectBtn()" style="float:right;" class="m-2" variant="warning">Wallet Connect</b-button>
                    <b-button v-if="connected" variant="info" style="float:right;" class="m-2">Wallet Connected</b-button>
                </div>
                <div style="clear: both"></div>
                <deposit-withdrawal
                        v-if="service === 'Deposit' || service === 'Withdrawal'"
                        :service="service" :connected="connected" :sender-account="senderAccount">
                </deposit-withdrawal>
                <tokenRegister v-if="service === 'Token'" :sender-account="senderAccount"></tokenRegister>
                <c2bPayment v-if="service==='Flash C2B Payment'" :sender-account="senderAccount"></c2bPayment>
                <admin v-if="service==='Admin'" :sender-account="senderAccount"></admin>
                <merchant v-if="service==='Merchant'" :sender-account="senderAccount"></merchant>
                <referral-commission :sender-account="senderAccount" v-if="service==='Referral Commission System'"></referral-commission>
                <subscriptionService :sender-account="senderAccount" v-if="service==='Subscription Service'"></subscriptionService>
            </b-overlay>
            <alert :show-network-connection-error-alert="showNetworkConectionErrorAlert"></alert>
        </b-card>
    </div>
</template>

<script>
    import {config} from "@/config/config";
    // import tokenSwapModal from "@/components/tokenSwapModal";
    import {blockchainUtil} from "@/util/blockchainUtil";
    import alert from "@/components/general/alert";
    import depositWithdrawal from "@/components/depositWithdrawal";
    import tokenRegister from "@/components/tokenRegister";
    import c2bPayment from "@/components/c2bPayment";
    import admin from "@/components/admin";
    import merchant from "@/components/merchant";
    import referralCommission from "@/components/referralCommission";
    import subscriptionService from "@/components/subscriptionService";


    export default {
        name: 'ConnectBoxContainer',
        components:{
            alert,
            depositWithdrawal,
            tokenRegister,
            c2bPayment,
            admin,
            merchant,
            referralCommission,
            subscriptionService
        },
        props:{
          service:String
        },
        data(){
            return{
                senderAccount:'',
                network:'',
                show: false,
                showNetworkConectionErrorAlert:false,
                connected:false,
                ethereumInit: false
            }
        },
        methods:{
            init(){
                window.ethereum.on('accountsChanged', (_accounts) => {
                    if (typeof (_accounts[0]) !== 'undefined') {
                        this.senderAccount = _accounts[0];
                        this.ethereumInit = true;
                    }else {
                        this.senderAccount = '';
                        this.ethereumInit = false;
                        this.connected = false;
                    }
                });
                window.ethereum.on('chainChanged', (chainId) => {
                    if(chainId == config.chainID){
                        this.show = false;
                        this.showNetworkConectionErrorAlert = false;
                        this.connected = true;
                    }else{
                        this.show = true;
                        this.showNetworkConectionErrorAlert = true;
                        this.connected = false;
                    }
                });
            },
            async onClickConnectBtn(){
                if (window.ethereum!=null) {
                    await blockchainUtil.blockchainConnection();
                    if(this.ethereumInit === false){
                        console.log("init");
                        this.init();
                    }
                    if(window.ethereum.chainId !=config.chainID){
                        console.log("Wrong network, please connect to Mumbai-Testnet network");
                        this.show = true;
                        this.showNetworkConectionErrorAlert = true;
                    }
                    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    this.senderAccount = accounts[0];
                    if (blockchainUtil.checkIsAddress(this.senderAccount) === true){
                        this.connected = true;
                    }
                } else {
                    window.alert("Metamask not been detected. Please installed or activated it at google plugin");
                    return;
                }
                console.log("Web3 for Platform Permissioned Chain initialized successfully");
            },
        }
    }
</script>

<style scoped>

    .noticeBox {
        line-height: 1.05;
        font-size: x-small;
    }

    .submitBtn{
        width: 100%;
    }

</style>