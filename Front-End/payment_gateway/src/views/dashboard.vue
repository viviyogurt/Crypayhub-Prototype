<template>
    <div>
        <div class="row">
            <div class="col-xl-7">
                <widget></widget>
                <contract-address class="mt-4"></contract-address>
                <explorer class="mt-4"></explorer>
            </div>
            <div class="col-xl-5">
                <whitelist-address class="mt-xl-0 mt-4 mt-lg-4"></whitelist-address>
<!--                <commissionRateList class="my-4"></commissionRateList>-->
            </div>
        </div>
    </div>
</template>

<script>
    import widget from "@/components/dashboard/widget";
    import contractAddress from "@/components/dashboard/contractAddress";
    import whitelistAddress from "@/components/dashboard/whitelistAddress";
    import explorer from "@/components/dashboard/explorer";
    // import commissionRateList from "@/components/dashboard/commissionRateList";
    export default {
        name: "dashboard",
        components:{
            widget,
            contractAddress,
            whitelistAddress,
            explorer,
            // commissionRateList,
        }
    }
</script>

<style scoped>

</style>