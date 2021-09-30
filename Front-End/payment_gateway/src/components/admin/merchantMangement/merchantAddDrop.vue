<template>
    <div>
        <b-card  header="Merchant Management" class="text-center" text-variant="white" style="background-color: rgba(73, 80, 87, 0.5)">
            <b-row class="my-2 mx-1 mx-sm-2 text-left">
                <b-col md="3">Merchant</b-col>
                <b-col md="9">
                    <b-form-input placeholder="0x (Address)" v-model="merchantAddress" size="sm"></b-form-input>
                </b-col>
            </b-row>
            <b-row align-h="end" class="my-2 mx-1 mx-sm-2">
                <b-col cols="6" sm="3" md="2" align-self="end">
                    <b-button
                            pill
                            class="submitBtn my-2"
                            :disabled="isAdmin===false"
                            :variant="isAdmin===false?'':'success'"
                            size="sm"
                            @click="addMerchant()">
                        <b-spinner v-if="addMerchantSpinner == true" small></b-spinner>
                        Add
                    </b-button>
                </b-col>
                <b-col cols="6" sm="3" md="2" align-self="end">
                    <b-button
                            pill
                            class="submitBtn my-2"
                            :disabled="isAdmin===false"
                            :variant="isAdmin===false?'':'success'"
                            size="sm"
                            @click="removeMerchant()">
                        <b-spinner v-if="removeMerchantSpinner == true" small></b-spinner>
                        Remove
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "merchantAddDrop",
        props: {
            senderAccount: String,
            isAdmin: Boolean
        },
        data(){
            return{
                merchantAddress:'',
                addMerchantSpinner: false,
                removeMerchantSpinner: false
            }
        },
        methods:{
            async addMerchant(){
                let merchantAddr = this.merchantAddress;
                if(await (this.validateInput(merchantAddr) === false)){
                    return;
                }
                let isMerchant = await this.checkMerchantRegistered(merchantAddr);
                if(isMerchant === true){
                    window.alert("Merchant already Registered");
                }else if(isMerchant === false){
                    let txHash = await blockchainUtil.addRemoveMerchant(this.senderAccount, merchantAddr, true);
                    if(txHash!=null) {
                        this.addMerchantSpinner = true;
                        let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if (txStatus === true) {
                            window.alert("Add Merchant Success");
                        }
                        this.addMerchantSpinner = false;
                    }
                }else {
                    alert("Error occur in transaction sending");
                    this.addMerchantSpinner = false;
                }

            },
            async removeMerchant(){
                let merchantAddr = this.merchantAddress;
                if(await (this.validateInput(merchantAddr) === false)){
                    return;
                }
                let isMerchant = await this.checkMerchantRegistered(merchantAddr);
                if(isMerchant === false){
                    window.alert("Input Address is not a merchant address");
                }else if(isMerchant === true){
                    let txHash = await blockchainUtil.addRemoveMerchant(this.senderAccount, merchantAddr, false);
                    if(txHash!=null) {
                        this.removeMerchantSpinner = true;
                        let txStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if (txStatus === true) {
                            window.alert("Remove Merchant Success");
                        }
                        this.removeMerchantSpinner = false;
                    }
                }else {
                    alert("Error occur in transaction sending");
                }
            },
            async checkMerchantRegistered(merchantAddr){
                let isMerchant = await blockchainUtil.checkMerchantRegistered(merchantAddr);
                console.log(isMerchant);
                return isMerchant;
            },
            validateInput(address){
                if(blockchainUtil.checkIsAddress(address)!==true){
                    window.alert("Invalid Address Input!");
                    return false;
                }

            }
        }
    }
</script>

<style scoped>

</style>