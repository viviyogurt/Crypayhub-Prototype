<template>
    <div class="card bg-dark border-dark text-light">
        <div class="card-body">
            <h4 class="card-title">Commission Rate List</h4>

            <div class="table-responsive">
                <table class="table mb-0 table-dark">
                    <thead>
                    <tr>
                        <th>Fee Receiving Account</th>
                        <th>Commission Rate (%)</th>
                    </tr>
                    </thead>
                    <tbody v-for="(data, index) in commissionRateList" :key="index">
                    <tr v-if="data.commissionRate != 0">
                        <td class="tableAddress">{{data.feeReceiver}}</td>
                        <td>{{data.commissionRate}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    // import {blockchainUtil} from "@/util/blockchainUtil";

    export default {
        name: "commissionRateList",
        mounted(){
            // blockchainUtil.checkCommissionRateList().then((commissionList) => {
            //     // console.log(commissionList, "commission list request result");
            //     let count = 0;
            //     for (let i=0; i< commissionList.length; i++){
            //         blockchainUtil.checkCommissionInfo(commissionList[i]).then((commissionRate) => {
            //             let commissionInfo = {};
            //             commissionInfo.feeReceiver = commissionList[i];
            //             commissionInfo.commissionRate = parseFloat(commissionRate.defaultCommissionRate)/10;
            //             this.commissionRateList.push(commissionInfo);
            //             count ++;
            //             if (count == commissionList.length){
            //                 this.$forceUpdate();
            //                 console.log(this.commissionRateList);
            //             }
            //         })
            //     }
            // })
        },
        data(){
            return{
                commissionRateList:[]
            }
        }
    }
</script>

<style scoped>

</style>