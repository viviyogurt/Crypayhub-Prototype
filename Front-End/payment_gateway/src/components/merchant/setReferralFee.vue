<template>
    <div class="px-2; px-md-4; text-left">
        <b-card-text class="mx-2">
            <b-row class="my-2">
                <b-col md="4" lg="3">Referral Fee:</b-col>
                <b-col md="8" lg="9">
                    <b-form-input placeholder="0 - 60 (%)" v-model="referralFee" type="number" size="sm"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="my-2">
                <b-col md="4" lg="3">One Time Award:</b-col>
                <b-col md="8" lg="9">
                    <b-form-input placeholder="0 (CPHT)" v-model="oneTimeAward" type="number" size="sm"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="my-2">
                <b-col md="4" lg="3">Valid Period:</b-col>
                <b-col md="8" lg="9">
                    <b-form-input placeholder="(days)" v-model="validPeriod" type="number" size="sm"></b-form-input>
                </b-col>
            </b-row>
        </b-card-text>
        <b-row class="justify-content-end">
            <b-col md="3" lg="2" align-self="end">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-1"
                        :disabled="senderAccount===''"
                        :variant="senderAccount===''?'':'success'"
                        @click="updateCommissionInfoHandle()">
                    <b-spinner v-if="setCommissionSpinner === true" small></b-spinner>
                    Update
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "setReferralFee",
        props: {
            senderAccount: String,
        },
        data() {
            return {
                referralFee:null,
                oneTimeAward:null,
                validPeriod:null,
                setCommissionSpinner:false
            }
        },
        mounted() {

        },
        methods: {
            async updateCommissionInfoHandle(){
                console.log("new ReferralFee", this.referralFee);
                if(this.referralFee>=0 && this.referralFee<60 && this.oneTimeAward!=null && this.validPeriod!=null){
                    this.setCommissionSpinner = true;
                    let txHash = await blockchainUtil.updateCommissionInfo(this.senderAccount,parseFloat(this.referralFee)*10, this.oneTimeAward*(10**6), this.validPeriod);
                    let receiptStatus;
                    if (txHash != null) {
                        receiptStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                    }
                    if(receiptStatus === true){
                        this.$root.$emit('refreshCommissionData', this.referralFee,this.oneTimeAward, this.validPeriod);
                        this.$root.$emit('successAlert', true, "Success to set the referral award!")
                    }else {
                        alert("Failed to set commission info:" +
                            "\n1. The setter must be a registered merchant. " +
                            "\n2. Check your input commission rate is between 0% - 60%");
                    }
                    this.setCommissionSpinner = false;
                }else{
                    window.alert("Invalid referral fee input");
                }
            }
        }
    }
</script>

<style scoped>

</style>