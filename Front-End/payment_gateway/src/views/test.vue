<template>
    <div>
        <button @click="test()">test</button>
    </div>
</template>

<script>
    const ethers = require('ethers');
    import {abi} from '@/config/abi';
    // import {covalentDataReq} from "@/util/http/axioUtil";
    export default {
        name: "test",
        methods:{
            async test() {
                // covalentDataReq("get","https://api.covalenthq.com","/v1/80001/events/address/0x2f87000893F1398C574137771Ab78c5F7C25176b/?starting-block=16570000&ending-block=latest&match=%7B+++++%22block_signed_at%22%3A+%7B+++++++%22%24gt%22%3A+%222021-01-02%22+++++%7D+++++++%7D&sort=%7B+++++%22block_signed_at%22%3A+-1+%7D&key=ckey_d0c4d4eec025404b887a2522ed3",null);
                // let customHttpProvider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today");
                let abiCPHT = abi.CPHT;
                console.log(abiCPHT);
                let iface = new ethers.utils.Interface(abiCPHT);
                console.log(abiCPHT);
                console.log(iface);
                let result = iface.decodeEventLog("SetMerchant","0x000000000000000000000000b3a86480c98c5ecfb994a68707cb46ce415a7aa60000000000000000000000000000000000000000000000000000000000000000", ["0x4320debfb5c56d20b12fce1fc5ab82a9f530df7b2d87ba7df8e60bef2f79d1de"]);
                console.log(result);
            }
        }
    }
</script>

<style scoped>

</style>