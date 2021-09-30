const {ethers} = require("ethers");

console.log(ethers.utils.id("SetService(address,uint16,string,uint256,uint256)"));
console.log("----------------------------")
console.log(ethers.utils.id("SetService(address,uint16)"));
console.log(ethers.utils.id("DeleteService(address,uint16)"));
console.log(ethers.utils.id("Subscribe(address,address,uint16,uint256,uint256,uint256)"));
console.log(ethers.utils.id("AutoCharged(address,address,uint16,uint256,uint256)"));
console.log(ethers.utils.id("CancelSubscription(address,uint16,address)"));
console.log(ethers.utils.id("TerminateSubscription(address,uint16,address)"));
console.log("----------------------------")
console.log(ethers.utils.id("OwnershipTransferred(address,address)"));
console.log(ethers.utils.id("Transfer(address,address,uint256)"));
console.log(ethers.utils.id("Approval(address,address,uint256)"));




