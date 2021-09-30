<template>
    <div>
        <br>
        <b-container fluid>
            <accountRow :senderAccount="senderAccount" token-name="CPHT"></accountRow>
            <b-row class="my-4 mx-2">
                <b-col md="3">Target:</b-col>
                <b-col md="7">
                    <b-form-input placeholder="0x (Address)" v-model="targetAddress" size="sm"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="my-4 mx-2">
                <b-col md="3">Amount:</b-col>
                <b-col md="7">
                    <b-form-input placeholder="0" type="number" v-model="amount" size="sm"></b-form-input>
                </b-col>
            </b-row>

            <b-row class="my-4" align-h="end">
                <b-col md="2" align-self="end">
                    <b-button
                            pill
                            class="submitBtn my-2"
                            :disabled="senderAccount=='' ? true : false"
                            :variant="senderAccount==''?'':'success'"
                            @click="submitHandle()">
                        <b-spinner v-if="sendSpinner == true" small></b-spinner>
                        Transfer
                    </b-button>
                </b-col>
            </b-row>

        </b-container>
    </div>
</template>

<script>
    import accountRow from "@/components/general/accountRow";
    import {blockchainUtil} from "@/util/blockchainUtil";
    import {config} from "@/config/config";

    export default {
        name: "c2bPayment",
        components: {
            accountRow
        },
        props: {
            senderAccount: String
        },
        data() {
            return {
                connected: false,
                targetAddress: '',
                amount: null,
                sendSpinner: false
            }
        },
        methods: {
            submitHandle() {
                if (!(parseInt(this.amount) > 0)) {
                    this.$root.$emit('invalidTokenAmountAlert', true);
                    return;
                }
                this.$root.$emit('invalidTokenAmountAlert', false);

                if (!blockchainUtil.checkIsAddress(this.targetAddress)) {
                    this.$root.$emit('invalidAddressAlert', true);
                    return;
                }
                this.$root.$emit('invalidAddressAlert', false);
                this.submit();
            },
            async submit() {
                let txHash = await blockchainUtil.transfer(this.senderAccount, config.contract.CPHT, this.targetAddress, parseInt(this.amount));
                console.log(txHash, "txHash value");
                if (txHash != null) {
                    this.sendSpinner = true;
                    let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                    this.sendSpinner = false;
                    if (txStatus === true) {
                        this.$root.$emit('updateBalance');
                        this.$root.$emit("successAlert", true, `Success to transfer ${this.amount} CPHT to ${this.targetAddress}`);
                    } else {
                        this.$root.$emit('failAlert', true, 'Check your CPHT balance and gas for execution is enough! \n Also, please' +
                            " confirm whether the target address has registered as a merchant");
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>