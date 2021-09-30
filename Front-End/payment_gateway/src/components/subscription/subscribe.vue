<template>
    <div class="px-2; px-md-4; text-left">
        <b-card-text class="mx-2">
            <b-row class="my-2">
                <b-col md="4" lg="3">Service Provider:</b-col>
                <b-col md="8" lg="9">
                    <b-form-input placeholder="0x (address)" v-model="serviceProvider" size="sm"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="my-2">
                <b-col md="4" lg="3">Service ID:</b-col>
                <b-col md="8" lg="9">
                    <b-form-input placeholder="0" v-model="serviceID" type="number" size="sm"></b-form-input>
                </b-col>
            </b-row>
        </b-card-text>
        <b-row class="justify-content-end">
            <b-col md="3" lg="2" align-self="end" class="mx-2">
                <b-button
                        size="sm"
                        class="submitBtn my-1"
                        :disabled="senderAccount===''"
                        :variant="senderAccount===''?'':'info'"
                        @click="getServiceInfoHandle()">
<!--                    <b-spinner v-if="setCommissionSpinner === true" small></b-spinner>-->
                    Show Service
                    <b-icon icon="arrow-down-circle" scale="1" variant="light"></b-icon>
                </b-button>
            </b-col>
        </b-row>
        <div v-if="serviceInfo!==null" class="mt-3">
            <b-card class="card bg-dark border-dark text-light">
                <div v-if="serviceInfo!==null && serviceInfo.isSet===true">
                    <b-row class="mb-2">
                        <b-col md="3">Service Name:</b-col>
                        <b-col md="9">{{serviceInfo.serviceName}}</b-col>
                    </b-row>
                    <b-row class="mb-2">
                        <b-col md="3">Service Fee:</b-col>
                        <b-col md="9">{{serviceInfo.serviceFee + " CPHT"}}</b-col>
                    </b-row>
                    <b-row class="mb-2">
                        <b-col md="3">Charging Period:</b-col>
                        <b-col md="9">{{serviceInfo.period + " days"}}</b-col>
                    </b-row>
                    <b-row>
                        <b-button variant="primary" class="mt-1 mx-2" size="sm" @click="subscribeHandle()">
                            <b-spinner v-if="subscribeSpinner === true" small></b-spinner>
                            Subscribe
                        </b-button>
                    </b-row>
                </div>
                <div v-if="serviceInfo!==null && serviceInfo.isSet===false" class="my-0" style="display: flex; justify-content: center">
                    <p style="color: var(--secondary); font-size: medium; text-align: center">Service Not Existed</p>
                </div>
            </b-card>
        </div>

    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "subscribe",
        props: {
            senderAccount: String,
        },
        data() {
            return {
                serviceProvider:'',
                serviceID:null,
                serviceInfo:null,
                subscribeSpinner:false
            }
        },
        mounted() {
            console.log()
        },
        methods: {
            getServiceInfoHandle(){
                if(this.serviceProvider!=='' &&blockchainUtil.checkIsAddress(this.serviceProvider) && this.serviceID >= 0){
                    blockchainUtil.getSubscriptionServiceInfo(this.serviceProvider, this.serviceID).then((res)=>{
                        this.serviceInfo = res;
                        this.serviceInfo.serviceFee = this.serviceInfo.serviceFee / (10**6);
                    })
                }else {
                    this.$root.$emit("failAlert", true, "Invalid Input");
                }
            },
            async subscribeHandle(){
                if(this.serviceProvider!=='' &&blockchainUtil.checkIsAddress(this.serviceProvider) && this.serviceID >= 0){
                    let txHash = await blockchainUtil.subscribe(this.senderAccount, this.serviceProvider, this.serviceID);
                    this.subscribeSpinner = true;
                    let receiptStatus;
                    if (txHash != null) {
                        receiptStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                    }
                    if (receiptStatus === true){
                        this.$emit('successAlert', true, "Success to Subscribe To "+this.serviceInfo.serviceName);
                    }else {
                        this.$root.$emit('failAlert', true, "Check Whether The Service Is Already Be Subscribed");
                    }
                    this.subscribeSpinner = false;
                }else {
                    this.$root.$emit("failAlert", true, "Invalid Input");
                }
            }
        }
    }
</script>

<style scoped>

</style>