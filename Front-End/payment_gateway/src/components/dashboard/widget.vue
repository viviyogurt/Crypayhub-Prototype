<template>
    <div class="row">
        <div class="col-md-4" v-for="(data, index) in statData" :key="index">
            <div class="card border-dark">
                <div class="card-body bg-dark text-light">
                    <div class="media">
                        <div class="media-body overflow-hidden">
                            <p class="text-truncate font-size-14 mb-2">{{data.title}}</p>
                            <h4 class="mb-0">$ {{data.value}}</h4>
                        </div>
                    </div>
                </div>

<!--                <div class="card-body border-top py-3">-->
<!--                    <div class="text-truncate">-->
<!--            <span class="badge badge-soft-success font-size-11">-->
<!--              <i class="mdi mdi-menu-up"></i>-->
<!--&lt;!&ndash;              {{data.subvalue}}&ndash;&gt;-->
<!--                Address:-->
<!--            </span>-->
<!--                        <span class="text-muted ml-2">From previous period</span>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";
    import {config} from "@/config/config";

    export default {
        name: "widget",
        data() {
            return {
                statData: [
                    {
                        title: "USDT Locked",
                        value: "-",
                        subvalue: " 2.4% "
                    },
                    {
                        title: "CPHT Total Supply",
                        value: "-",
                        subvalue: " 2.4% "
                    },
                    {
                        title: "Transaction Volume (24h)",
                        icon: "ri-briefcase-4-line",
                        value: "-",
                        subvalue: " 2.4% "
                    }
                ]
            };
        },
        mounted(){
            blockchainUtil.getTokenBalance(config.contract.USDT,config.contract.CPHT).then(
                (resolve) => {
                    this.statData[0].value = resolve/(10**6);
                }
            )
            blockchainUtil.getCPHTTotalSupply().then(
                (resolve) => {
                    this.statData[1].value = resolve/(10**6);
                }
            )
        }
    }
</script>

<style scoped>

</style>