<template>
    <div>
        <!--        <b-card bg-variant="secondary" text-variant="white">-->
        <b-card-text>
            <b-row class="my-4">
                <p>Cancel referral fee will set the default commission fee to 0. It means
                the fee receiver will not deliver any commission as recommendation award.</p>
            </b-row>

        </b-card-text>

        <b-row align-h="end">

            <b-col md="4" align-self="end">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-2"
                        :disabled="senderAccount==='-'"
                        :variant="senderAccount==='-'?'':'success'"
                        @click="updateCommissionInfoHandle()">
                    <b-spinner v-if="cancelReferralFeeSpinner == true" small></b-spinner>
                    cancel
                </b-button>
            </b-col>
        </b-row>


        <!--        </b-card>-->
    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "cancelReferralFee",
        props: {
            senderAccount: String,
        },
        data() {
            return {
                cancelReferralFeeSpinner:false
            }
        },
        mounted() {

        },
        methods: {
            async updateCommissionInfoHandle(){
                    this.cancelReferralFeeSpinner = true;
                    let txHash = await blockchainUtil.updateCommissionInfo(this.senderAccount,0);
                    if (txHash != null) {
                        let receiptStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if(receiptStatus === true){
                            this.$root.$emit('refreshCommissionData', 0);
                        }
                    }
                    this.cancelReferralFeeSpinner = false;
            },

        }
    }
</script>

<style scoped>

</style>