<template>
    <div class="text-left">
        <!--        <b-card bg-variant="secondary" text-variant="white">-->
        <b-card-text>
            <b-row class="my-2">
                <b-col md="3">Address:</b-col>
                <b-col md="9">
                    <b-form-input placeholder="0x" v-model="addressToWhitelist" size="sm"></b-form-input>
                </b-col>
            </b-row>

        </b-card-text>

        <b-row align-h="end">
            <b-col cols="12" md="4" lg="3">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-2"
                        :disabled="isAdmin==false ? true : false"
                        :variant="isAdmin==false?'':'success'"
                        @click="senderWhitelistSubmitHandle()">
                    <b-spinner v-if="senderWhitelistLoadSpinner == true" small></b-spinner>
                    Set Sender
                </b-button>
            </b-col>
            <b-col cols="12" md="4" lg="3">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-2"
                        :disabled="isAdmin==false ? true : false"
                        :variant="isAdmin==false?'':'success'"
                        @click="receiverWhitelistSubmitHandle()">
                    <b-spinner v-if="receiverWhitelistLoadSpinner == true" small></b-spinner>
                    Set Receiver
                </b-button>
            </b-col>
            <b-col cols="12" md="4" lg="3">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-2"
                        :disabled="isAdmin==false ? true : false"
                        :variant="isAdmin==false?'':'success'"
                        @click="senderAndReceiverWhitelistSubmitHandle()">
                    <b-spinner v-if="senderAndReceiverWhitelistLoadSpinner == true" small></b-spinner>
                    Set Both
                </b-button>
            </b-col>
        </b-row>

        <!--        </b-card>-->
    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "whitelistAdd",
        props: {
            senderAccount: String,
            isAdmin: Boolean
        },
        data() {
            return {
                senderWhitelistLoadSpinner: false,
                receiverWhitelistLoadSpinner: false,
                senderAndReceiverWhitelistLoadSpinner: false,
                addressToWhitelist: ''
            }
        },
        mounted() {

        },
        methods: {
            async senderWhitelistSubmitHandle() {
                if (blockchainUtil.checkIsAddress(this.addressToWhitelist)) {
                    this.senderWhitelistLoadSpinner = true;
                    let txHash = await blockchainUtil.addToSenderWhiteList(this.addressToWhitelist, this.senderAccount, 0);
                    if (txHash != null) {
                        let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if (txStatus === true) {
                            window.alert("Success to add account to sender whitelist!");
                        }
                    }
                    this.senderWhitelistLoadSpinner = false;
                } else {
                    alert("Invalid address input!");
                }
            },
            async receiverWhitelistSubmitHandle() {
                if (blockchainUtil.checkIsAddress(this.addressToWhitelist)) {
                    this.receiverWhitelistLoadSpinner = true;
                    let txHash = await blockchainUtil.addToReceiverWhiteList(this.addressToWhitelist, this.senderAccount, 0);
                    if (txHash != null) {
                        let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if (txStatus === true) {
                            window.alert("Success to add account to receiver whitelist!");
                        }
                    }
                    this.receiverWhitelistLoadSpinner = false;
                } else {
                    alert("Invalid address input!");
                }
            },
            async senderAndReceiverWhitelistSubmitHandle() {
                if (blockchainUtil.checkIsAddress(this.addressToWhitelist)) {
                    this.senderAndReceiverWhitelistLoadSpinner = true;
                    let txHash = await blockchainUtil.addToReceiverAndSenderWhiteList(this.addressToWhitelist, this.senderAccount, 0);
                    if (txHash != null) {
                        let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if (txStatus === true) {
                            window.alert("Success to add account to both sender and receiver whitelist");
                        }
                    }
                    this.senderAndReceiverWhitelistLoadSpinner = false;
                } else {
                    alert("Invalid address input!");
                }
            },

        }
    }
</script>

<style scoped>

</style>