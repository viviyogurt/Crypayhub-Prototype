<template>
    <div class="px-2; px-md-4; text-left">

        <b-card-text class="mx-2">
            <b-container>
                <b-row class="my-2">
                    <b-col md="4" lg="3">Service ID:</b-col>
                    <b-col md="8" lg="9">
                        <b-form-input placeholder="0 - 1000" v-model="subscriptionService.id" type="number" size="sm"></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="my-2">
                    <b-col md="4" lg="3">Service Name:</b-col>
                    <b-col md="8" lg="9">
                        <b-form-input placeholder="Service A" v-model="subscriptionService.name" size="sm"></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="my-2">
                    <b-col md="4" lg="3">Fee:</b-col>
                    <b-col md="8" lg="9">
                        <b-form-input placeholder="(CPHT)" v-model="subscriptionService.fee" type="number" size="sm"></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="my-2">
                    <b-col md="4" lg="3">Charging Period:</b-col>
                    <b-col md="8" lg="9">
                        <b-form-input placeholder="(days)" v-model="subscriptionService.period" type="number" size="sm"></b-form-input>
                    </b-col>
                </b-row>
            </b-container>
        </b-card-text>
        <b-row class="justify-content-end">
            <b-col md="3" lg="2" align-self="end" class="mx-4">
                <b-button
                        pill
                        size="sm"
                        class="submitBtn my-1"
                        :disabled="senderAccount===''"
                        :variant="senderAccount===''?'':'success'"
                        @click="setSubscriptionServiceHandle()">
                    <b-spinner v-if="setSubscriptionServiceSpinner === true" small></b-spinner>
                    Set
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>

    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "setSubscriptionService",
        props: {
            senderAccount: String,
        },
        data() {
            return {
                subscriptionService:{
                    id:null,
                    name:'',
                    fee:null,
                    period:null
                },
                setSubscriptionServiceSpinner:false
            }
        },
        methods: {
            async setSubscriptionServiceHandle(){
                if (this.id === null || this.name === '' || this.fee === null || this.period === null){
                    alert("Invalid Input Value");
                    return;
                }
                try {
                    this.setSubscriptionServiceSpinner = true;
                    let txHash = await blockchainUtil.setSubscriptionService(this.senderAccount, this.subscriptionService.id,
                        this.subscriptionService.name, this.subscriptionService.fee * (10**6), this.subscriptionService.period);
                    let receiptStatus;
                    if (txHash != null) {
                        receiptStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                    }
                    console.log(receiptStatus);
                    if(receiptStatus === true){
                        this.$root.$emit('successAlert', true, "Success to set the service!");
                        setTimeout( () => {
                            this.$root.$emit('updateSubscriptionServices');
                        }, 4000);
                    }else {
                        this.$root.$emit('failAlert', true, "Failed to set the service! Check whether the service ID is already in used");
                    }
                }catch (e) {
                    console.error(e);
                }finally {
                    this.setSubscriptionServiceSpinner = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>