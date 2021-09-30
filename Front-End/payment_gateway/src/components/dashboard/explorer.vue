<template>
    <div class="card bg-dark border-dark text-light">
        <div class="card-body">
            <h4 class="card-title">Explorer</h4>
            <b-container fluid>
                <b-row class="my-4" v-if="tabIndex===0">
                    <b-col cols="9" md="6">
                        <b-form-input v-model="searchBarInput" :placeholder=searchBarPlaceHolder[tabIndex]
                                      size="sm"></b-form-input>
                    </b-col>
                    <b-col cols="3">
                        <b-button size="sm" @click='onCheckAddressHandle(tabIndex)'>Check</b-button>
                    </b-col>
                </b-row>

                <b-row class="my-4" v-if="tabIndex===1">
                    <b-col cols="12" sm="8" md="6">
                        <b-form-input v-model="searchBarInput" :placeholder=searchBarPlaceHolder[tabIndex]
                                      size="sm"></b-form-input>
                    </b-col>
                    <b-col cols="12" sm="4" md="4" class="mt-2 mt-sm-0">
                        <b-form-select v-model="selected.commissionerEarningFilter"
                                       :options="options.commissionerEarning" size="sm"></b-form-select>
                    </b-col>
                    <b-col cols="4" md="2" class="mt-2 mt-md-0">
                        <b-button size="sm" @click='onCheckAddressHandle(tabIndex)'>Check</b-button>
                    </b-col>
                </b-row>

                <b-row class="my-4" v-if="tabIndex===2">
                    <b-col cols="12" sm="4" md="4" class="mt-2 mt-sm-0">
                        <b-form-select v-model="selected.serviceRankingFilter"
                                       :options="options.serviceRanking" size="sm"></b-form-select>
                    </b-col>
                    <b-col cols="4" md="2" class="mt-2 mt-md-0">
                        <b-button size="sm" @click='orderByOnCheckHandle()'>Check</b-button>
                    </b-col>
                </b-row>

                <b-row class="my-4" v-if="tabIndex===3">
                    <b-col cols="9" md="6">
                        <b-form-input v-model="searchBarInput" :placeholder=searchBarPlaceHolder[tabIndex]
                                      size="sm"></b-form-input>
                    </b-col>
                    <b-col cols="3">
                        <b-button size="sm" @click='checkIsMerchantHandle()'>Check</b-button>
                    </b-col>
                </b-row>

                <b-card no-body bg-variant="dark">
                    <b-tabs pills card small @input="setCurrentTabIndex">
                        <b-tab title="Customer Commissioner Pair" active>
                            <b-card-text v-if="tabIndex===0">
                                <detailHiddenTable
                                        :targetAddress='searchParams[tabIndex]'
                                        :fields="customerCommissionerPair.fields"
                                        :hidden-fields="customerCommissionerPair.hiddenFields"
                                        :getRecordsAPI='backendConfigAPI.getCommissioners'
                                        :countRecordsAPI='backendConfigAPI.countCommissioner'
                                ></detailHiddenTable>
                            </b-card-text>
                        </b-tab>
                        <b-tab title="Commissioner Earning">
                            <b-card-text v-if="tabIndex===1">
                                <detailHiddenTable
                                        :targetAddress="searchParams[tabIndex]"
                                        :fields="onSelected.fields"
                                        :hidden-fields="onSelected.hiddenFields"
                                        :getRecordsAPI='onSelected.RecordsAPI'
                                        :countRecordsAPI='onSelected.CountRecordAPI'
                                ></detailHiddenTable>
                            </b-card-text>
                        </b-tab>
                        <b-tab title="Service Ranking">
                            <b-card-text v-if="tabIndex===2">
                                <detailHiddenTable
                                        :fields="serviceRanking.fields"
                                        :hidden-fields="serviceRanking.hiddenFields"
                                        :getRecordsAPI='backendConfigAPI.getServiceInRank'
                                        :countRecordsAPI='backendConfigAPI.countService'
                                        :orderByField='serviceRanking.orderBy'
                                ></detailHiddenTable>
                            </b-card-text>
                        </b-tab>
                        <b-tab title="Is Merchant">
                            <b-card-text v-if="tabIndex===3" class="px-2">
                                <b-row>
                                    <b-col cols="4" md="3" lg="2">
                                        <small>Address:</small>
                                    </b-col>
                                    <b-col cols="8" md="9" lg="10">
                                        <small>{{checkIsMerchant.result.address===''?"-":checkIsMerchant.result.address}}</small>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col cols="4" md="3" lg="2">
                                        <small>Is Merchant:</small>
                                    </b-col>
                                    <b-col cols="8" md="9" lg="10">
                                        <small>
                                            {{checkIsMerchant.result.isMerchant===null?'-':checkIsMerchant.result.isMerchant}}
                                        </small>
                                    </b-col>
                                </b-row>
                            </b-card-text>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </b-container>
        </div>
    </div>
</template>

<script>
    import detailHiddenTable from "@/components/general/detailHiddenTable";
    import {blockchainUtil} from "@/util/blockchainUtil";
    import backendConfig from "@/config/backend";

    export default {
        name: "explorer",
        components: {
            detailHiddenTable
        },
        watch: {
            'selected.commissionerEarningFilter': function (newValue) {
                this.searchParams[this.tabIndex] = '';
                if (newValue === null) {
                    this.commissionerAddress = '';
                } else if (newValue === 1) {
                    this.onSelected.CountRecordAPI = this.backendConfigAPI.countCommissionRecord;
                    this.onSelected.RecordsAPI = this.backendConfigAPI.getCommissionRecords;
                    this.onSelected.fields = this.commissionerEarning.commission.fields;
                    this.onSelected.hiddenFields = this.commissionerEarning.commission.hiddenFields;
                } else if (newValue === 2) {
                    this.onSelected.CountRecordAPI = this.backendConfigAPI.countOneTimeAwardRecord;
                    this.onSelected.RecordsAPI = this.backendConfigAPI.getOneTimeAwardRecords;
                    this.onSelected.fields = this.commissionerEarning.award.fields;
                    this.onSelected.hiddenFields = this.commissionerEarning.award.hiddenFields;
                }
            },
            tabIndex: function (newValue, oldValue) {
                this.searchParams[oldValue] = '';
                if (oldValue === 1){
                    this.selected.commissionerEarningFilter = null;
                }
            }
        },
        data() {
            return {
                searchBarPlaceHolder: [
                    "0x (Merchant Address)",
                    "0x (Commissioner)",
                    "",
                    "0x (Address to Check)"
                ],
                options: {
                    commissionerEarning: [
                        {value: null, text: 'Please Select Filter'},
                        {value: 1, text: 'Commission'},
                        {value: 2, text: 'Award'}
                    ],
                    serviceRanking:[
                        {value: null, text: 'Please Select Filter'},
                        {value: 1, text: 'Commission Rate'},
                        {value: 2, text: 'Award Amount'},
                        {value: 3, text: 'Total Commission Deliver'},
                        {value: 4, text: 'Total Award Deliver'}
                    ]
                },
                selected: {
                    commissionerEarningFilter: null,
                    serviceRankingFilter:null
                },
                searchParams:[],
                searchBarInput: '',
                tabIndex: 0,
                customerCommissionerPair: {
                    fields: ['customer', 'commissioner', 'showMore'],
                    hiddenFields: ['commissionRate', 'validPeriod', 'oneTimeAward', 'tx_hash', 'block_signed_at', 'block_height']
                },
                commissionerEarning:{
                    commission:{
                        fields: ['merchant', 'commissionFee', 'customer','showMore'],
                        hiddenFields: ['tx_hash', 'block_signed_at', 'block_height']
                    },
                    award:{
                        fields: ['merchant', 'awardAmount', 'customer','showMore'],
                        hiddenFields: ['tx_hash', 'block_signed_at', 'block_height']
                    }
                },
                serviceRanking: {
                    fields: ['merchant', 'commissionRate','oneTimeAward', 'showMore'],
                    hiddenFields: ['validPeriodDay', 'totalCommissionDeliver', 'totalAwardDeliver'],
                    orderBy:''
                },
                backendConfigAPI: backendConfig.backendAPI,
                onSelected:{
                    RecordsAPI: '',
                    CountRecordAPI: '',
                    fields: [],
                    hiddenFields: []
                },
                checkIsMerchant:{
                    addressInput:'',
                    result: {
                        address:'',
                        isMerchant:null
                    }
                }

            }
        },
        methods: {
            onCheckAddressHandle(tabIndex) {
                if (blockchainUtil.checkIsAddress(this.searchBarInput)) {
                    console.log(this.searchBarInput);
                    this.searchParams[tabIndex] = this.searchBarInput.toLowerCase();
                    this.searchBarInput = '';
                } else {
                    alert("Invalid address search bar input for checking!");
                }
            },
            orderByOnCheckHandle(){
                if(this.selected.serviceRankingFilter === 1){
                    this.serviceRanking.orderBy = "commissionRate"
                }else if (this.selected.serviceRankingFilter === 2){
                    this.serviceRanking.orderBy = "oneTimeAward"
                }else if (this.selected.serviceRankingFilter === 3){
                    this.serviceRanking.orderBy = "totalCommissionDeliver"
                }else if (this.selected.serviceRankingFilter === 4){
                    this.serviceRanking.orderBy = "totalAwardDeliver"
                }
            },
            setCurrentTabIndex(tabIndex) {
                this.tabIndex = tabIndex;
            },
            checkIsMerchantHandle(){
                this.onCheckAddressHandle(3);
                blockchainUtil.checkMerchantRegistered(this.searchParams[this.tabIndex]).then((res)=>{
                    this.checkIsMerchant.result.address = this.searchParams[this.tabIndex];
                    this.checkIsMerchant.result.isMerchant = res;
                })
            }
        }
    }
</script>

<style scoped>

</style>