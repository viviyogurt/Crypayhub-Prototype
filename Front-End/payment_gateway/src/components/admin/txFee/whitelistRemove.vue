<template>
    <div class="text-left">
        <b-card-text>
            <b-row class="my-2">
                <b-col md="3">Address:</b-col>
                <b-col md="9">
                    <b-form-input placeholder="0x" v-model="addressToWhitelist" size="sm"></b-form-input>
                </b-col>
            </b-row>

        </b-card-text>


        <b-row align-h="end">

            <b-col cols="12" md="4" lg="3" align-self="end">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-2"
                        :disabled="isAdmin===false"
                        :variant="isAdmin===false?'':'success'"
                        @click="senderWhitelistResetHandle()">
                    <b-spinner v-if="removeSenderLoadSpinner === true" small></b-spinner>
                    Remove Sender
                </b-button>
            </b-col>
            <b-col cols="12" md="4" lg="3" align-self="end">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-2"
                        :disabled="isAdmin===false"
                        :variant="isAdmin===false?'':'success'"
                        @click="receiverWhitelistResetHandle()">
                    <b-spinner v-if="removeReceiverLoadSpinner === true" small></b-spinner>
                    Remove Receiver
                </b-button>
            </b-col>
            <b-col cols="12" md="4" lg="3" align-self="end">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-2"
                        :disabled="isAdmin==false ? true : false"
                        :variant="isAdmin==false?'':'success'"
                        @click="senderAndReceiverWhitelistResetHandle()">
                    <b-spinner v-if="removeSenderAndReceiverLoadSpinner == true" small></b-spinner>
                    Remove Both
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "whitelistRemove",
        props: {
            senderAccount: String,
            isAdmin: Boolean
        },
        data() {
            return {
                // transactionFee:'',
                removeSenderLoadSpinner: false,
                removeReceiverLoadSpinner: false,
                removeSenderAndReceiverLoadSpinner: false,
                addressToWhitelist: ''
            }
        },
        mounted() {

        },
        methods: {

            async senderWhitelistResetHandle() {
                if (blockchainUtil.checkIsAddress(this.addressToWhitelist)) {

                    let txFee = null;
                    await blockchainUtil.checkPaymentFee().then((resolve) => {
                        txFee = (parseFloat(resolve));
                    }).catch((err) => {
                        alert("Error occur!");
                        console.error(err);
                        return;
                    });
                    console.log("Default Transaction Fee", txFee);
                    this.removeSenderLoadSpinner = true;
                    let txHash = await blockchainUtil.addToSenderWhiteList(this.addressToWhitelist, this.senderAccount, txFee);
                    if (txHash != null) {
                        let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if (txStatus === true) {
                            window.alert("Success to remove account from sender whitelist");
                        }
                    }
                    this.removeSenderLoadSpinner = false;

                } else {
                    alert("Invalid address input!");
                }
            },
            async receiverWhitelistResetHandle() {
                if (blockchainUtil.checkIsAddress(this.addressToWhitelist)) {

                    let txFee = null;
                    await blockchainUtil.checkPaymentFee().then((resolve) => {
                        txFee = (parseFloat(resolve));
                    }).catch((err) => {
                        alert("Error occur!");
                        console.error(err);
                        return;
                    });

                    if (txFee != null) {
                        this.removeReceiverLoadSpinner = true;
                        let txHash = await blockchainUtil.addToReceiverWhiteList(this.addressToWhitelist, this.senderAccount, txFee);
                        if (txHash != null) {
                            let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                            if (txStatus === true) {
                                window.alert("Success to remove account from receiver whitelist");
                            }
                        }
                        this.removeReceiverLoadSpinner = false;
                    }
                } else {
                    alert("Invalid address input!");
                }
            },
            async senderAndReceiverWhitelistResetHandle() {

                let txFee = null;
                await blockchainUtil.checkPaymentFee().then((resolve) => {
                    txFee = (parseFloat(resolve));
                }).catch((err) => {
                    alert("Error occur!");
                    console.error(err);
                    return;
                });
                console.log("txFee", txFee);
                if (txFee != null) {
                    if (blockchainUtil.checkIsAddress(this.addressToWhitelist)) {
                        this.removeSenderAndReceiverLoadSpinner = true;
                        let txHash = await blockchainUtil.addToReceiverAndSenderWhiteList(this.addressToWhitelist, this.senderAccount, txFee);
                        console.log(txHash, "txHash value returned");
                        if (txHash != null) {
                            let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                            if (txStatus === true) {
                                window.alert("Success to remvoe account from both sender and receiver whitelist");
                            }
                        }
                        this.removeSenderAndReceiverLoadSpinner = false;
                    } else {
                        alert("Invalid address input!");
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>