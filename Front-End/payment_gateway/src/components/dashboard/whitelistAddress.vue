<template>

    <div class="card bg-dark border-dark text-light">
        <div class="card-body">
            <h4 class="card-title">Whitelist Address</h4>
            <p class="card-title-desc">
                The address in the whitelist could be waved the transaction fee.
            </p>
            <br>
            <div style="font-size: medium">
                <b-table small :fields="whitelistFields" :items="whitelistSenderItems" responsive="sm" dark>
                    <template #cell(transactionFeeRate)="data">
                        {{ data.item.transactionFeeRate / 10 }} %
                    </template>
                </b-table>
                <div></div>
                <br>
                <b-table small :fields="whitelistFields" :items="whitelistReceiverItems" responsive="sm" dark>
                    <template #cell(transactionFeeRate)="data">
                        {{ data.item.transactionFeeRate /10 }} %
                    </template>
                </b-table>
                <span class="text-warning" style="float: right">[Normal Transaction Fee: {{txFee}} %]</span>
            </div>
        </div>
    </div>

</template>

<script>

    import {config} from "@/config/config";
    import backendConfig from "@/config/backend"
    import {blockchainUtil} from "@/util/blockchainUtil";
    import {reqRealEnd} from "@/util/http/axioUtil";

    export default {
        name: 'whitelistAddress',
        data() {
            return {
                contract: config.contract,
                whitelistFields: ['exceptionAddress', 'transactionFeeRate'],
                whitelistSenderItems: [],
                whitelistReceiverItems: [],
                txFee: null
            };
        },
        async mounted() {
            this.txFee = (await blockchainUtil.checkPaymentFee()) / 10;

            let whitelistPromises = [];
            whitelistPromises.push(reqRealEnd(
                "get",
                backendConfig.backendQueryURL,
                backendConfig.backendAPI.getSenderWhitelist,
                null));
            whitelistPromises.push(reqRealEnd(
                "get",
                backendConfig.backendQueryURL,
                backendConfig.backendAPI.getReceiverWhitelist,
                null));
            Promise.all(whitelistPromises).then((res) => {
                this.whitelistSenderItems = [];
                this.whitelistReceiverItems = [];
                this.whitelistRecordsClean(res[0].data.data, this.whitelistSenderItems);
                this.whitelistRecordsClean(res[1].data.data, this.whitelistReceiverItems);
            }).catch((err) => console.error(err));
        },
        methods: {
            whitelistRecordsClean(eventRecords,tableItems){
                for (let key in eventRecords){
                    if (eventRecords[key].transactionFeeRate !== this.txFee){
                        tableItems.push(eventRecords[key]);
                    }
                }
            }
        }
    };
</script>

<style>

</style>
