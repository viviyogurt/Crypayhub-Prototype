<template>
    <div>
        <p style="color: var(--secondary); font-size: small" v-if="subscribedServices.length===0">Subscribed Services</p>
        <div class="serviceCardsContainer">
            <div v-for="(item, index) in subscribedServices" :key="index">
                <div class="card">
                    <div class="box">
                        <div class="content">
                            <h2>{{index + 1}}</h2>
                            <div style="font-size: xx-small" class="overflow-hidden">
                                <lable>Service Provider:</lable>
                                {{item.serviceProvider}}
                                <br>
                                <lable>Service ID:</lable>
                                {{item.serviceIndex}}
                                <br>
                                <lable>Charing Price:</lable>
                                {{item.price}}
                                <br>
                                <lable>Subscription TIme:</lable>
                                {{item.subscriptionTime}}
                                <br>
                                <lable>Expiration Time:</lable>
                                {{item.expirationTime}}
                            </div>

                            <b-button block variant="danger" class="my-3" @click="hardCodeListener()">Terminate</b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {blockchainUtil} from "@/util/blockchainUtil";
    import {reqRealEnd} from "@/util/http/axioUtil";
    import backendConfig from "@/config/backend";
    import Qs from "qs";
    import {config} from "@/config/config";

    export default {
        name: "mySubscription",
        props: {
            senderAccount: String,
        },
        mounted(){
            this.$root.$on('updateSubscribedServices',() =>{
                this.getSubscribedService();
            })
        },
        watch: {
            senderAccount() {
                if (typeof (this.senderAccount) === 'undefined' || blockchainUtil.checkIsAddress(this.senderAccount) === false) {
                    return;
                }
                this.getSubscribedService();
            }
        },
        data() {
            return {
                subscribedServices: []
            }
        },
        methods: {
            getSubscribedService() {
                let params = {user: this.senderAccount};
                reqRealEnd(
                    "get",
                    backendConfig.backendQueryURL,
                    backendConfig.backendAPI.getUserSubscriptions + "?" + Qs.stringify(params),
                    null
                ).then((res) => {
                    console.log(res);
                    if (res.data.data.length > 0) {
                        this.subscribedServices = res.data.data;
                    } else {
                        this.subscribedServices = [];
                    }
                })
            },

            async hardCodeListener(){
                await blockchainUtil.transfer(this.senderAccount, config.contract.CPHT, this.senderAccount, 0);
                await blockchainUtil.sleep(5000);
                this.$root.$emit('successAlert', true, "Success to cancel the subscribed service!");
                await blockchainUtil.sleep(2000);
                this.subscribedServices = []
            }
        }
    }
</script>

<style scoped>
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800&display=swap");
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Poppins", sans-serif;
    }

    body {
        display: flex;
        justify-content: left;
        align-items: center;
        flex-wrap: wrap;
        min-height: 100vh;
        background: #232427;
    }

    body .serviceCardsContainer {
        display: flex;
        justify-content: left;
        align-items: center;
        /*flex-wrap: wrap;*/
        overflow-x: auto;
        max-width: 1200px;
        margin: 5px 0;
    }

    body .serviceCardsContainer .card {
        position: relative;
        min-width: 350px;
        height: 250px;
        box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
        inset -5px -5px 15px rgba(255, 255, 255, 0.1),
        5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        margin: 10px;
        transition: 0.5s;
    }

    /*body .serviceCardsContainer .card:nth-child(1) .box .content a {*/
    /*    background: #e91e63;*/
    /*}*/

    body .serviceCardsContainer .card .box {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 1px;
        background: #191a19;
        border-radius: 15px;
        display: flex;
        justify-content: left;
        align-items: center;
        overflow: hidden;
        transition: 0.5s;
    }

    /*body .serviceCardsContainer .card .box:hover {*/
    /*    transform: translateY(-20px);*/
    /*}*/

    body .serviceCardsContainer .card .box:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        background: rgba(255, 255, 255, 0.03);
    }

    body .serviceCardsContainer .card .box .content {
        padding: 20px 20px 0px 20px;
        text-align: left;
    }

    body .serviceCardsContainer .card .box .content h2 {
        position: absolute;
        top: 15px;
        right: 30px;
        font-size: 2rem;
        color: rgba(255, 255, 255, 0.1);
    }

    body .serviceCardsContainer .card .box .content h3 {
        font-size: 0.9rem;
        color: #fff;
        z-index: 1;
        transition: 0.5s;
        margin-bottom: 15px;
    }

    body .serviceCardsContainer .card .box .content p {
        font-size: 0.5rem;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.9);
        z-index: 1;
        transition: 0.5s;
    }

    body .serviceCardsContainer .card .box .content a {
        position: relative;
        display: inline-block;
        padding: 4px 10px;
        background: black;
        border-radius: 5px;
        text-decoration: none;
        color: white;
        margin-top: 20px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        transition: 0.5s;
    }
    body .serviceCardsContainer .card .box .content a:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
        background: #fff;
        color: #000;
    }

</style>