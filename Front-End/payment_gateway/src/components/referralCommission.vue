<template>
    <div>
        <br>
        <b-container fluid>
            <accountRow :senderAccount="senderAccount"></accountRow>
            <b-tabs pills card align="right" small class="px-2; px-md-5" style="background-color: rgba(33, 37, 41, 0.4)">
                <b-tab title="Link up" active>
                        <b-row class="my-2 ">
                            <b-col md="3">Customer:</b-col>
                            <b-col md="9">
                                <b-form-input placeholder="0x (Address)" v-model="customerAddressToLink" size="sm"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="my-2 " >
                            <b-col md="3">Commissioner:</b-col>
                            <b-col md="9">
                                <b-form-input placeholder="0x (Address)" v-model="commissionerAddress" size="sm"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row align-h="end">
                            <b-col md="2" align-self="end" class="mt-3">
                                <b-button
                                        pill
                                        class="submitBtn"
                                        :disabled="senderAccount=='' ? true : false"
                                        :variant="senderAccount==''?'dark':'success'"
                                        @click='submitHandle("Link")'>
                                    <b-spinner v-if="submitSpinner == true" small></b-spinner>
                                    Submit
                                </b-button>
                            </b-col>
                        </b-row>
                </b-tab>
                <b-tab title="Unlink">
                        <b-row class="my-2">
                            <b-col md="3">Customer Address:</b-col>
                            <b-col md="9">
                                <b-form-input placeholder="0x (Address)" v-model="customerAddressToUnlink" size="sm"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row align-h="end">
                            <b-col md="2" class="mt-3" align-self="end">
                                <b-button
                                        pill
                                        class="submitBtn"
                                        :disabled="senderAccount===''"
                                        :variant="senderAccount===''?'dark':'success'"
                                        @click='submitHandle("Unlink")'>
                                    <b-spinner v-if="submitSpinner === true" small></b-spinner>
                                    Submit
                                </b-button>
                            </b-col>
                        </b-row>
                </b-tab>
            </b-tabs>

            <b-button v-b-toggle.commissionerTable variant="primary" class="mx-4 mt-5">View My Commissioners</b-button>
            <b-collapse id="commissionerTable" visible>
                <detailHiddenTable
                        :targetAddress="senderAccount"
                        :fields="customerCommissionerPair.fields"
                        :hidden-fields="customerCommissionerPair.hiddenFields"
                        :getRecordsAPI='customerCommissionerPair.backendConfigAPI.getCommissioners'
                        :countRecordsAPI='customerCommissionerPair.backendConfigAPI.countCommissioner'
                        class="my-4"></detailHiddenTable>
            </b-collapse>
        </b-container>
    </div>
</template>

<script>
    import accountRow from "@/components/general/accountRow";
    import {blockchainUtil} from "@/util/blockchainUtil";
    import detailHiddenTable from "@/components/general/detailHiddenTable";
    import backendConfig from "@/config/backend";

    export default {
        name: "referralCommission",
        components: {
            accountRow,
            detailHiddenTable
        },
        props: {
            senderAccount: String
        },
        data(){
            return{
                commissionerAddress:'',
                customerAddressToLink:'',
                customerAddressToUnlink:'',
                submitSpinner:'',
                customerCommissionerPair:{
                    fields:['customer', 'commissioner', 'showMore'],
                    hiddenFields:['commissionRate', 'validPeriod', 'oneTimeAward', 'tx_hash', 'block_signed_at', 'block_height'],
                    backendConfigAPI:backendConfig.backendAPI
                },
            }
        },
        methods:{
            async submitHandle(tapPage){
                let validationRes = this.dataValidation(tapPage);
                if (validationRes){
                    let txHash;
                    this.submitSpinner = true;
                    if (tapPage === "Link") {
                        txHash = await blockchainUtil.customerCommissionerMapping(this.senderAccount, this.customerAddressToLink, this.commissionerAddress);
                    }else if (tapPage === "Unlink"){
                        txHash = await blockchainUtil.customerCommissionerRemoving(this.senderAccount, this.customerAddressToUnlink);
                    }
                    if(txHash!=null) {
                        let receiptStatus = await blockchainUtil.waitForTxToBeMined(txHash);
                        if (receiptStatus !==true){
                            this.$root.$emit("failAlert", true, "Check that default referral commission rate has set!");
                        }else{
                            this.$root.$emit("successAlert", true, "Success to update customer commissioner pair list!");
                            //trigger watch event of sender account to update the table records
                            blockchainUtil.sleep(5000).then(async ()=>{
                                let temp = this.senderAccount;
                                this.senderAccount = '';
                                await blockchainUtil.sleep(200);
                                this.senderAccount = temp;
                            })

                        }
                    }
                    this.submitSpinner = false;
                }else {
                    this.$root.$emit("failAlert", true,"Invalid address input");
                }
            },
            dataValidation(tapPage){
                if (tapPage === "Link") {
                    return (blockchainUtil.checkIsAddress(this.commissionerAddress) && blockchainUtil.checkIsAddress(this.customerAddressToLink))
                }else if (tapPage === "Unlink"){
                    return (blockchainUtil.checkIsAddress(this.customerAddressToUnlink))
                }
            }
        }
    }
</script>

<style scoped>

</style>