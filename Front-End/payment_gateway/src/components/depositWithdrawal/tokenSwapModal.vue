<template>

    <b-modal id="modal-scoped" size="lg" :title="service" hide-footer centered>

        <template #default="{cancel}">
            <b-progress :value="progress" variant="success"></b-progress>
            <b-card v-if="current_step==0" class="card-style" title="STEP1: Token Approval">
                <b-card-text>Token Amount: {{tokenAmount}}</b-card-text>
                <b-card-text>Contract Address: {{contractAddress}}</b-card-text>
                <b-card-text>Token Spender: {{tokenSpender}} <br> [Swap Contract for token swap]</b-card-text>
                <!--                <b-button variant="secondary" @click="onClickBack">Back</b-button>-->
                <div style="float: right">
                    <b-button v-if="service=='Deposit'" variant="primary" @click="USDTapproveHandle">
                        <b-spinner v-if="approveSpinner == true" small></b-spinner>
                        Approve
                    </b-button>
                    <b-button v-if="service=='Withdrawal'" variant="primary" @click="CPHTapproveHandle">
                        <b-spinner v-if="approveSpinner == true" small></b-spinner>
                        Approve
                    </b-button>
                </div>
            </b-card>
            <b-card v-if="current_step==1" class="card-style" title="STEP2: Token Swap">
                <b-card-text>Token Amount: {{tokenAmount}}</b-card-text>
                <b-card-text>Contract Address: {{contractAddress}}</b-card-text>
                <!--                <b-button variant="secondary" @click="onClickBack">Back</b-button>-->
                <!--                <b-button variant="primary" @click="onClickNext">Next</b-button>-->
                <div style="float: right">
                    <b-button v-if="service=='Deposit'" variant="primary" @click="USDTCPHTSwapHandle">
                        <b-spinner v-if="swapSpinner == true" small></b-spinner>
                        Swap
                    </b-button>
                    <b-button v-if="service=='Withdrawal'" variant="primary" @click="CPHTUSDTSwapHandle">
                        <b-spinner v-if="swapSpinner == true" small></b-spinner>
                        Swap
                    </b-button>
                </div>

            </b-card>
            <b-card v-if="current_step==2" class="card-style" title="Deposit Success">
<!--                <b-card-text>Do something for second step.</b-card-text>-->
                <!--                <b-button variant="secondary" @click="onClickBack">Back</b-button>-->
                <div style="float: right">
                    <b-button variant="primary" @click="cancel(); depositCompleteHandle()" class="flex-column">Close
                    </b-button>
                </div>

            </b-card>
        </template>

    </b-modal>


</template>

<script>
    import {blockchainUtil} from '@/util/blockchainUtil';
    import {config} from '@/config/config';

    export default {
        name: "tokenSwapModal",
        props: {
            account: String,
            service: String,
            tokenAmount: String,
            contractAddress: String
        },
        data() {
            return {
                current_step: 0,
                max_step: 2,
                allowed: false,
                transferred: false,
                tokenSpender: config.contract.swap,
                approveSpinner: false,
                swapSpinner: false
            }
        },
        computed: {
            progress: function () {
                return Math.round(100 / this.max_step) * this.current_step;
            }
        },
        methods: {
            onClickNext: function () {
                this.current_step++;
            },
            depositCompleteHandle: async function () {
                await blockchainUtil.sleep(100);
                this.current_step = 0;
                this.allowed = false;
                this.transferred = false;
            },
            async USDTapproveHandle() {
                // await blockchainUtil.approve(userAccount,tokenAddress,spender,tokenAmount);
                let txHash = await blockchainUtil.approve(this.account, config.contract.USDT, config.contract.CPHT, parseInt(this.tokenAmount) * (10 ** 6));
                console.log("result: ", txHash);
                if (txHash != null) {
                    this.approveSpinner = true;
                    let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                    this.approveSpinner = false;
                    if (txStatus == true) {
                        this.onClickNext();
                    } else {
                        alert("Check your USDT allowance is currently 0 and the gas for execution is enough!");
                    }
                }
            },
            async USDTCPHTSwapHandle() {
                let txHash = await blockchainUtil.USDTCPHTSwap(this.account, parseInt(this.tokenAmount) * (10 ** 6));
                if (txHash != null) {
                    this.swapSpinner = true;
                    let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                    this.swapSpinner = false;
                    if (txStatus === true) {
                        this.$root.$emit('updateBalance');
                        this.onClickNext();
                    } else {
                        alert("Check your USDT allowance is currently 0 and the gas for execution is enough!");
                    }
                }
            },
            async CPHTapproveHandle() {
                let txHash = await blockchainUtil.approve(this.account, config.contract.CPHT, config.contract.CPHT, parseInt(this.tokenAmount) * (10 ** 6));
                console.log("result: ", txHash);
                if (txHash != null) {
                    this.approveSpinner = true;
                    let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                    this.approveSpinner = false;
                    if (txStatus === true) {
                        this.onClickNext();
                    } else {
                        alert("Check your USDT allowance is currently 0 and the gas for execution is enough!");
                    }
                }
            },
            async CPHTUSDTSwapHandle() {
                let txHash = await blockchainUtil.CPHTUSDTSwap(this.account, parseInt(this.tokenAmount) * (10 ** 6));
                if (txHash != null) {
                    this.swapSpinner = true;
                    let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                    this.swapSpinner = false;
                    if (txStatus === true) {
                        this.$root.$emit('updateBalance');
                        this.onClickNext();
                    } else {
                        alert("Check your USDT allowance is currently 0 and the gas for execution is enough!");
                    }
                }
            }
        },
    }
</script>

<style scoped>

</style>