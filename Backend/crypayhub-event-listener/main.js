const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const pubsubHelper = require('./publish')
require('console-stamp')(console, '[HH:MM:ss.l]');

let web3;
function initWeb3() {
    web3 = createAlchemyWeb3(
        "wss://polygon-mumbai.g.alchemy.com/v2/eRgMBrV8GJ4KmewwL7R4jQ6tnXzY95v5",
    )
}
function setupEventlogSubscription() {
    web3.eth.subscribe('logs', {
        address: '0x5021c4891A26771ECc9837a74F9c84569228877b',
        topics: [
            [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',

                '0x4320debfb5c56d20b12fce1fc5ab82a9f530df7b2d87ba7df8e60bef2f79d1de',
                '0x1c846dde577cff05269ffeb28bd63a1df09fab50cda3c4710e260a610d8f8845',
                '0x938955bb7381540df249778717bd36e57d62ceb59bc2ff40052db7885d7d231a',
                '0x261505bda6238fe11546a160676153426f33830f6a45adf6213b2c7aa763e7e2',
                '0xe7ad0f12faac931eacd956cbdfc5bafe8fb4cc0f0f6cb714446518aead67389f',
                '0x6e2975eed9452c3ca32d5a9447c131d8e6dacb73ba85e452899a6f9fb48176e7',
                '0x317ee1e0b0b1c14465dc087aa3a92fcdfc3c9710a15603f420929a3d7b5aa1e4',
                '0x07b4267d07ddf24802bf943493f122fd74bb136d1bc2058882fbd8aee53dc7e7',
                '0xae492330a9893d2815f2f8ef5524f91965faae96e691d3ab9744d75e745af097',
                '0xf29cb896428e089ea0c50341d03a3887b72f2c59aad004aa2c6331787e0f6be0'
            ]
        ]
    }, function (error, result) {
        if (!error) {
            pubsubHelper.publishMessage(JSON.stringify(result), "CPHT-Core-EventLog").then((res) => {
                console.log(`event log message be published`);
            }).catch((err) => {
                console.error(err);
                console.error(`event message: `, result);
            })
        }
    }).on("connected", function (subscriptionId) {
        console.log("on connected", subscriptionId);
        console.log(`success to connected`);
    })

//////////////////////////////////////////////////
    web3.eth.subscribe('logs', {
        address: '0x89355F4CfD8406Ee816c06169C7d9C3387ac3E55',
        topics: [
            [
                // '0xc9e32e8412cdc8f594a709df81e0336e00b94a780d381819d085c7dab57413c8',
                '0xaafdef2d0bd40402ebda61f7f5199951bad067c9aee235c57d37782c61c133bb',
                '0x660b69f7e8de7893a3a131ff79d22a36d7d85b5bd9c62bb8cd1c6057e11ffc75',
                '0x8644aa902a811587bfa21f97e226b8df7b409c3d5ca8f456975bbf9ed0e0fe4a',
                '0x79030d8afa44cf6868051f41e02cf855247d8a993cf977d48a90bc573b8502ae',
                '0x846d686f2cc9d43fe7ef2a65c45cc534decbfd3d49312a40b6e30d724c7f6470',
                '0xcb81f932201e5ac71554b57d6a418440828a8b4b6b9a8c5ffa9c0a1db7c672d6'
            ]
        ]
    }, function (error, result) {
        if (!error) {
            pubsubHelper.publishMessage(JSON.stringify(result), "CPHT-Subscription-EventLog").then((res) => {
                console.log(` event log message be published`);
            }).catch((err) => {
                console.error(err);
                console.error(`event message: `, result);
            })
        }
    }).on("connected", function (subscriptionId) {
        console.log(`on connected`, subscriptionId);
        console.log(`success to connected`);
    })
}

process.on('exit', function(code) {
    console.log(`Kill signal received`);
});

initWeb3();
setupEventlogSubscription();