<template>
    <div>
        <b-container fluid>
            <accountRow :sender-account="senderAccount"></accountRow>
            <b-table small :fields="fields" :items="items" responsive="sm" class="py-3 mx-2" dark>
            </b-table>
            <b-row class="my-4" align-h="end">
                <b-col md="2" align-self="end">
                    <b-button
                            pill
                            class="submitBtn my-2"
                            @click="tokenRegister"
                            :disabled="senderAccount==='' ? true : false"
                            :variant="senderAccount===''?'':'success'">
                        Register
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import {config} from "@/config/config"
    import {api} from "@/util/API";
    import {blockchainUtil} from "@/util/blockchainUtil";
    import accountRow from "@/components/general/accountRow";

    export default {
        name: 'tokenRegister',
        components: {
            accountRow
        },
        props: {
            senderAccount: String
        },
        data() {
            return {
                fields: [
                    'TokenName',
                    'Network',
                    'Address',
                ],
                items: [
                    {
                        TokenName: config.tokenName.USDT,
                        Network: config.networkName,
                        Address: config.contract.USDT
                    },
                    {
                        TokenName: config.tokenName.CPHT,
                        Network: config.networkName,
                        Address: config.contract.CPHT
                    },
                ]
            }
        },
        methods: {
            async tokenRegister() {
                await blockchainUtil.blockchainConnection();
                api.registerUSDT().then((resolve) => {
                    console.log(resolve);
                    api.registerCPHT();
                })
            },
        }
    }
</script>

<style>

</style>
