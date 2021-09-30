const config = {

        chainID: 0x13881,
        networkName: "Mumbai TestNet",
        httpProvider:"https://polygon-mumbai.infura.io/v3/c4cafd80cc1e437c8f0fbfd5d972cf3d",
        contract: {
            USDT:'0x415cCa4B51552c9854CfF03656a38dD8664a087A',
            CPHT:'0x5021c4891A26771ECc9837a74F9c84569228877b',
            SUBSCRIPTION:'0x89355F4CfD8406Ee816c06169C7d9C3387ac3E55'
        },
        tokenName:{
          USDT:"USDT",
          CPHT:"CPHT"
        },
        token:{
            USDT:{
                tokenAddress:"0x415cCa4B51552c9854CfF03656a38dD8664a087A",
                tokenSymbol: 'USDT',
                tokenDecimals: 6,
                tokenImage: 'http://placekitten.com/200/300'
            },
            CPHT:{
                tokenAddress:"0x5021c4891A26771ECc9837a74F9c84569228877b",
                tokenSymbol: 'CPHT',
                tokenDecimals: 6,
                tokenImage: 'http://placekitten.com/200/300'
            }
        },

}

export {config};