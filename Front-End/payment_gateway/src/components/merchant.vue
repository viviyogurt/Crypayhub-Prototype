<template>
    <div>
        <br>
        <b-container fluid>
            <b-tabs pills card>
                <b-tab title="Referral Fee" active><b-card-text>
                    <accountRow :senderAccount="senderAccount"></accountRow>
                    <b-row class="my-4 mx-2">
                        <b-col md="3">Commission Rate: </b-col>
                        <b-col md="7">
                            {{defaultReferrerCommission===''?'-':defaultReferrerCommission + " %"}}
                        </b-col>
                    </b-row>
                    <b-row class="my-4 mx-2">
                        <b-col md="3">Award: </b-col>
                        <b-col md="7">
                            {{oneTimeAward===''?'-':oneTimeAward + " CPHT"}}
                        </b-col>
                    </b-row>
                    <b-row class="my-4 mx-2">
                        <b-col md="3">Commission Period : </b-col>
                        <b-col md="7">
                            {{validPeriod===''?'-':validPeriod + " day(s)"}}
                        </b-col>
                    </b-row>
                    <div>
                        <b-card style="background-color: rgba(33, 37, 41, 0.4)" header="Referral Award Setting" class="text-center">
                            <setReferralFee :sender-account="senderAccount"></setReferralFee>
                        </b-card>
                    </div>
                </b-card-text></b-tab>

                <b-tab title="Subscription Service"><b-card-text>
                    <div class="my-3">
                        <accountRow :senderAccount="senderAccount"></accountRow>
                        <b-card style="background-color: rgba(33, 37, 41, 0.4)" header="Create Service For Subscription" class="text-center">
                            <setSubscriptionService :sender-account="senderAccount"></setSubscriptionService>
                        </b-card>
                        <b-card style="background-color: rgba(33, 37, 41, 0.4)" header="Services for Subscription" text-variant="white" class="text-center mt-4">
                            <service-card :senderAccount="senderAccount"></service-card>
                        </b-card>
                    </div>
                </b-card-text></b-tab>
            </b-tabs>
        </b-container>
    </div>
</template>

<script>
    import accountRow from "@/components/general/accountRow";
    import {blockchainUtil} from "@/util/blockchainUtil";
    import setReferralFee from "@/components/merchant/setReferralFee";
    import setSubscriptionService from "@/components/merchant/setSubscriptionService";
    import serviceCard from "@/components/subscription/serviceCard";

    export default {
        name: "merchant",
        components: {
            accountRow,
            setReferralFee,
            setSubscriptionService,
            serviceCard
        },
        props: {
            senderAccount: String
        },
        watch:{
            senderAccount: async function(){
                if(this.senderAccount === ''){
                    this.defaultReferrerCommission = '';
                    this.oneTimeAward = '';
                    this.validPeriod = '';
                    return;
                }
                blockchainUtil.checkCommissionInfo(this.senderAccount).then((resolve) =>{
                    this.defaultReferrerCommission = resolve.commissionRate/10;
                    this.oneTimeAward = resolve.oneTimeAward/(10**6);
                    this.validPeriod = resolve.validPeriodDay;
                }).catch((err)=>{
                    console.error(err);
                });
            }
        },
        mounted(){
            this.$root.$on('refreshCommissionData', (newReferralFee, newOneTimeAward, newValidPeriod) => {
                this.defaultReferrerCommission = newReferralFee;
                this.oneTimeAward = newOneTimeAward;
                this.validPeriod = newValidPeriod;
            });
        },
        data() {
            return {
                connected: false,
                targetAddress: '',
                amount: null,
                sendSpinner: false,
                defaultReferrerCommission:'',
                oneTimeAward:'',
                validPeriod:''
            }
        },
    }
</script>

<style scoped>

</style>