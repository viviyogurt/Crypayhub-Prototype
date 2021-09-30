<template>
    <div>
        <b-container fluid>
            <accountRow :sender-account="senderAccount" :token-name="tokenName"></accountRow>

            <b-row class="my-4 mx-2">
                <b-col md="3">
                    <label for="tokenName">Token:</label>
                </b-col>
                <b-col md="7">
                    <b-form-select v-if="service=='Deposit'" id="tokenName" v-model="selected"
                                   :options="depositOptions" size="sm"></b-form-select>
                    <b-form-select v-if="service=='Withdrawal'" id="tokenName" v-model="selected"
                                   :options="withdrawOptions" size="sm"></b-form-select>
                </b-col>
            </b-row>

            <b-row class="my-4 mx-2">
                <b-col md="3">
                    <label for="amount">{{service}} Amount:</label>
                </b-col>
                <b-col md="7">
                    <b-form-input id="amount" placeholder="amount" v-model="tokenAmount" type="number" size="sm"></b-form-input>
                </b-col>
            </b-row>

            <b-row class="mx-2">
                <b-col md="10">
                    <div>
                        <b-card-text v-if="service==='Deposit'" class="noticeBox">
                            All USDT deposits are locked in the smart contract.
                            <br>
                            CPHT would instantly be minted to the depositor accounts when the deposit fund are
                            confirmed.
                            <br>
                            Transactors could withdraw USDT by swaping CPHT and USDT on the withdrawal page.
                        </b-card-text>

                        <b-card-text v-if="service==='Withdrawal'" class="noticeBox">
                            In the swapping process, CPHT will be stored and locked in the pool.
                            <br>
                            USDT from the pool will be transferred to user account.
                        </b-card-text>
                        <div v-if="service=='Deposit'">
                            <a href="#" class="card-link">Buy Token</a>
                            <b-link href="#" class="card-link">Transaction Status</b-link>
                        </div>
                    </div>
                </b-col>
                <b-col md="2" align-self="end">
                    <b-button class="submitBtn my-2" pill :disabled='!connected ? true : false'
                              :variant='!connected?"":"success"' @click="confirmHandle()">Confirm
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
        <tokenSwapModal :account="senderAccount" :contractAddress="selected" :service="service"
                                     :token-amount=tokenAmount></tokenSwapModal>
    </div>
</template>

<script>
    import {config} from "@/config/config";
    import tokenSwapModal from "@/components/depositWithdrawal/tokenSwapModal";
    import accountRow from "@/components/general/accountRow";
    // import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "depositWithdrawal",
        components: {
            tokenSwapModal,
            accountRow
        },
        props: {
            service: String,
            connected: Boolean,
            senderAccount: String,
        },
        watch: {

            // senderAccount: function () {
            //     this.$root.$emit('updateBalance');
            // },
            selected: function () {
                if (this.selected === config.contract.USDT) {
                    this.tokenName = "USDT";
                } else if (this.selected === config.contract.CPHT) {
                    this.tokenName = "CPHT";
                }
            },
            // tokenName: async function () {
            //     await blockchainUtil.sleep(200);
            //     this.$root.$emit('updateBalance');
            // }
        },
        data() {
            return {
                tokenName: '',
                selected: null,
                depositOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: config.contract.USDT, text: 'USDT'},
                ],
                withdrawOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: config.contract.CPHT, text: 'CPHT'},
                ],
                tokenAmount: null
            }
        },
        methods: {
            confirmHandle() {
                if (!(parseInt(this.tokenAmount) > 0)) {
                    console.log("Here", this.selected);
                    this.$root.$emit('invalidTokenAmountAlert', true);
                    return;
                }
                this.$root.$emit('invalidTokenAmountAlert', false);
                if (this.selected == null) {
                    this.$root.$emit('missTokenTypeAlert', true);
                    return;
                }
                this.$root.$emit('missTokenTypeAlert', false);
                this.$bvModal.show('modal-scoped');
            }
        }
    }
</script>

<style scoped>

</style>