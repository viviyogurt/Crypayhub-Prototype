<template>
    <div>
        <b-row class="my-4 mx-2">
            <b-col md="3">Account:</b-col>
            <b-col md="7">{{senderAccount===''?'-':senderAccount}}</b-col>
        </b-row>
        <b-row v-if="tokenName!=null" class="my-4 mx-2">
            <b-col md="3">Balance: ({{tokenName===''?'----':tokenName}})</b-col>
            <b-col md="7">{{tokenBalance===''?'-':tokenBalance}}</b-col>
        </b-row>
    </div>
</template>

<script>
    import {config} from "@/config/config";
    import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "accountRow",
        props: {
            senderAccount: String,
            tokenName: String,
        },
        watch: {
            tokenName: function (newTokenName) {
                console.log("token Name change:", newTokenName);
                if (newTokenName !== '' && this.senderAccount !== '') {
                    this.tokenAddressInit();
                    this.tokenUserBalance();
                }
            },
            senderAccount: function (newSenderAccount) {
                console.log("new sender Account", newSenderAccount)
                if (typeof(this.tokenName)!=='undefined' && this.tokenName !== '' && newSenderAccount !== '') {
                    this.tokenAddressInit();
                    this.tokenUserBalance();
                }else {
                    this.tokenBalance = '';
                }
            }
        },
        data() {
            return {
                tokenAddress: '',
                tokenBalance: ''
            }
        },
        mounted() {
            //Initialize token address's value for the case of USDT and CPHT
            this.tokenAddressInit();
            //Set token balance update listener
            this.$root.$on('updateBalance', () => {
                console.log("updateBalance event triggered: ", this.tokenAddress);
                this.tokenUserBalance(this.tokenAddress);
            });
        },
        methods: {
            tokenAddressInit() {
                if (this.tokenName === "USDT") {
                    this.tokenAddress = config.contract.USDT;
                } else if (this.tokenName === "CPHT") {
                    this.tokenAddress = config.contract.CPHT;
                }
            },
            async tokenUserBalance() {
                if (this.tokenAddress === '') {
                    console.error("token address not yet initialized");
                    return;
                }

                if (typeof (this.senderAccount) !=='undefined' || this.senderAccount !== '') {
                    console.log("token address", this.tokenAddress, "sender account", this.senderAccount)
                    blockchainUtil.getTokenBalance(this.tokenAddress, this.senderAccount)
                        .then((resolved) => {
                            this.tokenBalance = (resolved / (10 ** 6)).toFixed(2);
                        }).catch((err) => {
                        console.error(err);
                    });
                } else {
                    this.tokenBalance = '';
                }
            },
        }
    }
</script>

<style scoped>

</style>