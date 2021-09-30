import {blockchainUtil} from "@/util/blockchainUtil";
import {config} from "@/config/config";

const api = {
    async registerCPHT(){
        await blockchainUtil.tokenRegistry(config.token.CPHT);
    },
    async registerUSDT(){
        await blockchainUtil.tokenRegistry(config.token.USDT);
    },

}

export {api};