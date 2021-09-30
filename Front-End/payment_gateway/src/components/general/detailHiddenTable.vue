<template>
    <div style="font-size: medium">
        <div class="text-warning my-1" style="float: right">Total Records: {{rows}}</div>
        <b-table :items="items" :fields="fields" hover responsive dark small>
            <template #cell(showMore)="row">
                <b-button size="sm" @click="row.toggleDetails" class="mr-2" variant="info">
                    Details
                </b-button>
            </template>

            <template #row-details="row">
                <b-card class="card bg-dark border-dark text-light" style="font-size: small">
                    <b-row class="mb-2" v-for="(hiddenField, index) in hiddenFields" :key="index">
                        <b-col sm="4" class="text-sm-right"><b>{{hiddenField}}:</b></b-col>
                        <b-col v-if="hiddenField === 'tx_hash'"><a href="www.yahoo.com.hk"> {{ row.item[hiddenField] }}</a></b-col>
                        <b-col v-else>{{ row.item[hiddenField] }}</b-col>
                    </b-row>
                </b-card>
            </template>
        </b-table>
        <div style="display: flex; justify-content: center">
            <p style="color: var(--secondary); font-size: medium" v-if="rows===0">No Relative Records</p>
        </div>

        <div>
            <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="my-table"
                    size="sm"
                    class="my-0"
            ></b-pagination>
        </div>
    </div>
</template>

<script>
    import {reqRealEnd} from "@/util/http/axioUtil";
    import backendConfig from "@/config/backend";
    import Qs from "qs";

    export default {
        name: "detailHiddenTable",
        props: {
            targetAddress: String,
            fields:Array,
            hiddenFields:Array,
            getRecordsAPI:String,
            countRecordsAPI:String,
            orderByField:String
        },
        watch: {
            targetAddress: async function (account) {
                console.log("watch target address trigger: ", account);
                this.currentPage = null;
                this.items = [];
                if (account !== "-" && account !== '') {
                    let params = {account};
                    this.getRecordNum(params);
                }
            },
            orderByField: async function (orderBy) {
                console.log("order by watcher")
                this.currentPage = null;
                this.items = [];
                if (orderBy !== '') {
                    let params = {orderBy};
                    this.getRecordNum(params);
                }
            },
            currentPage: async function (newPageNum) {
                if(newPageNum === null){
                    return;
                }
                console.log("param validation", this.targeetAddress, this.orderBy);
                if ((this.targetAddress=== '-' || this.targetAddress==='' || typeof (this.targetAddress) === 'undefined')
                    && typeof (this.orderByField) === "undefined"){
                    console.error("Invalid Input Param");
                    return
                }
                let param = {
                    account: this.targetAddress,
                    orderBy: this.orderByField,
                    offset: null,
                }
                if (typeof newPageNum !== undefined && newPageNum >0){
                    param.offset = (newPageNum-1)*this.perPage
                    this.getRecords(param);
                }
            }
        },
        mounted() {

        },
        data() {
            return {
                tableData: [],
                items: [],
                rows: 0,
                perPage: 5,
                currentPage: null
            }
        },
        methods: {
            getRecordNum(params) {
                console.log("getRecordNum Param", params);
                reqRealEnd(
                    "get",
                    backendConfig.backendQueryURL,
                    this.countRecordsAPI + "?" + Qs.stringify(params),
                    null
                ).then((res) => {
                    let result = res.data;
                    console.log("result", result);
                    if(result.code === 0) {
                        this.rows = result.data[0].recordNum;
                        console.log(this.rows);
                        if (this.rows !== 0) {
                            this.currentPage = 1;
                        }
                    }
                    else if (result.code === 1){
                        console.error(result.message);
                    }
                }).catch(e => console.error(e))
            },
            getRecords(params) {
                console.log("Getting records Param", params);
                reqRealEnd(
                    "get",
                    backendConfig.backendQueryURL,
                    this.getRecordsAPI + "?" + Qs.stringify(params),
                    null
                ).then((res) => {
                    let result = res.data;
                    if (result.code === 0) {
                        console.log(result);
                        if (result.data!==[]){
                            this.items = result.data;
                            console.log(this.items);
                        }
                    } else if (result.code === 1) {
                        console.error(result.message);
                    }
                }).catch(e => console.error(e))
            }
        }
    }
</script>

<style scoped>

</style>
