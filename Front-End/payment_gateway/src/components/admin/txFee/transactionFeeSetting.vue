<template>
    <div class="text-left">
        <b-card-text>
            <b-row class="my-2">
                <b-col cols="12" md="4">Transaction Rate:</b-col>
                <b-col cols="6" md="8">{{transactionFee}}</b-col>
            </b-row>
            <b-row class="my-2">
                <b-col md="4">New Rate:</b-col>
                <b-col md="8">
                    <b-form-input id="amount" placeholder="1.00" v-model="newTransactionFee"
                                  type="number" size="sm"></b-form-input>
                </b-col>
            </b-row>
        </b-card-text>

        <b-row align-h="end">
            <b-col cols="12" md="4" lg="3" align-self="end">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-2"
                        :disabled="isAdmin===false ? true : false"
                        :variant="isAdmin===false?'':'success'"
                        @click="submitHandle()">
                    <b-spinner v-if="loadSpinner === true" small></b-spinner>
                    Set
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "transactionFeeSetting",
        props: {
            senderAccount: String,
            isAdmin: Boolean
        },
        data() {
            return {
                loadSpinner: false,
                transactionFee: null,
                newTransactionFee: null
            }
        },
        mounted() {
            blockchainUtil.checkPaymentFee().then((resolve) => {
                this.transactionFee = (parseFloat(resolve)) / 10 + " %";
            }).catch((err) => {
                alert("Error occur!");
                console.error(err);
            })
        },
        methods: {
            async submitHandle() {
                if (parseFloat(this.newTransactionFee) >= 0) {
                    let txFee = parseInt(parseFloat(this.newTransactionFee) * 100 / 10);
                    if (txFee === this.transactionFee) {
                        alert("Updated transaction fee same as current value!");
                        return;
                    }
                    this.loadSpinner = true;
                    let txHash = await blockchainUtil.updateTransactionFee(txFee, this.senderAccount);
                    if (txHash != null) {
                        let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if (txStatus === true) {
                            window.alert("Set transaction fee success!");
                        }
                    }
                    this.loadSpinner = false;
                    this.transactionFee = txFee / 10 + ' %';

                } else {
                    alert("Transaction Fee should not be smaller than 0!");
                }
            }
        }
    }
</script>

<style scoped>

</style>