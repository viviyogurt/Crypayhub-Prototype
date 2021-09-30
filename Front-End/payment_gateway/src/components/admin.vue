<template>
    <div>
        <br>
        <b-container fluid>
            <b-row class="my-4 ml-1">
                <b-col md="3">
                    Contract Owner:
                    <div :class="isAdmin?'text-success':'text-danger'">
                        [{{matchingMessage}}]
                    </div>
                </b-col>
                <b-col md="7">
                    {{adminAddress}} <br>
                </b-col>
            </b-row>
            <accountRow :senderAccount="senderAccount"></accountRow>
            <div>
                <merchant-add-drop
                        class="my-4"
                        :sender-account="senderAccount"
                        :is-admin="isAdmin">
                </merchant-add-drop>

                <b-card style="background-color: rgba(73, 80, 87, 0.5)" header="Service Fee" class="my-4 text-center">
                    <b-tabs pills card vertical end small>
                        <b-tab title="Set Fee" active>
                            <transactionFeeSetting :sender-account="senderAccount"
                                                   :is-admin="isAdmin"></transactionFeeSetting>
                        </b-tab>
                        <b-tab title="To Whitelist">
                            <whitelistAdd :sender-account="senderAccount" :is-admin="isAdmin"></whitelistAdd>
                        </b-tab>
                        <b-tab title="Out Whitelist">
                            <whitelistRemove :sender-account="senderAccount" :is-admin="isAdmin"></whitelistRemove>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </div>

            <!--            <transactionFeeSetting :sender-account="senderAccount"></transactionFeeSetting>-->
        </b-container>
    </div>
</template>

<script>
    import accountRow from "@/components/general/accountRow";
    import {blockchainUtil} from "@/util/blockchainUtil";
    import transactionFeeSetting from "@/components/admin/txFee/transactionFeeSetting";
    import whitelistAdd from "@/components/admin/txFee/whitelistAdd";
    import whitelistRemove from "@/components/admin/txFee/whitelistRemove";
    import merchantAddDrop from "@/components/admin/merchantMangement/merchantAddDrop";

    export default {
        name: "admin",
        watch: {
            senderAccount: function () {
                this.checkIsAdmin();
            },
            isAdmin: function (newValue) {
                console.log("isAdmin triggle: ", this.isAdmin);
                if (newValue == true) {
                    this.matchingMessage = "Account match";
                }
            }
        },
        components: {
            accountRow,
            transactionFeeSetting,
            whitelistAdd,
            whitelistRemove,
            merchantAddDrop
        },
        props: {
            senderAccount: String
        },
        mounted() {
            blockchainUtil.CPHTContractAdmin().then((resolve) => {
                this.adminAddress = resolve;
            }).catch((err) => {
                alert("Error occur!");
                console.error(err);
            });


        },
        data() {
            return {
                isAdmin: false,
                adminAddress: '',
                matchingMessage: 'Account mismatch',
            }
        },
        methods: {
            async checkIsAdmin() {
                // await blockchainUtil.sleep(300);
                console.log("[admin.vue] sender Account: ", this.senderAccount);
                this.isAdmin = await blockchainUtil.CPHTContractIsAdmin(this.senderAccount);
                console.log("[admin.vue] is admin: ", this.isAdmin);
            }
        }
    }
</script>

<style scoped>
    /*@media only screen and (max-width: 1026px) {*/
    /*    .pcShow {*/
    /*        display: none;*/
    /*    }*/
    /*}*/
</style>