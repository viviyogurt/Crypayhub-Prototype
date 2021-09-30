<template>
    <div class="mx-3 mt-4">
        <b-alert v-model="showNetworkConnectionErrorAlert" class="my-4" variant="danger" dismissible>
            Please switch to Mumbai-Testnet network for crypto deposit.
        </b-alert>
        <b-alert v-model="showInvalidTokenAmountAlert" class="my-4" variant="danger" dismissible>
            Invalid token amount input!
        </b-alert>
        <b-alert v-model="showMissTokenTypeAlert" class="my-4" variant="danger" dismissible>
            Please input your deposit token type!
        </b-alert>
        <b-alert v-model="showInvalidAddressAlert" class="my-4" variant="danger" dismissible>
            Invalid address input!
        </b-alert>

        <b-alert v-model="showSuccessAlert" class="my-1" variant="success" dismissible>
            {{successAlertMsg}}
        </b-alert>
        <b-alert v-model="showFailAlert" class="my-1" variant="danger" dismissible>
            {{failAlertMsg}}
        </b-alert>
    </div>
</template>

<script>
    export default {
        name: "alert",
        props: {
            showNetworkConnectionErrorAlert: Boolean
        },
        data() {
            return {
                showInvalidTokenAmountAlert: false,
                showMissTokenTypeAlert: false,
                showInvalidAddressAlert: false,

                showSuccessAlert:false,
                showFailAlert:false,
                successAlertMsg:'',
                failAlertMsg:''
            }
        },
        mounted() {
            // this.$root.$on('networkConnectionAlert',(isError) => {
            //     this.showNetworkConnectionErrorAlert = isError;
            // });
            this.$root.$on('invalidTokenAmountAlert', (isError) => {
                console.log('event receive: invalidTokenAmountAlert', isError);
                this.showInvalidTokenAmountAlert = isError;
            });
            this.$root.$on('missTokenTypeAlert', (isError) => {
                this.showMissTokenTypeAlert = isError;
            });
            this.$root.$on('invalidAddressAlert', (isError) => {
                this.showInvalidAddressAlert = isError;
            });


            this.$root.$on('successAlert',(isSuccess, msg) =>{
                this.showSuccessAlert = isSuccess;
                this.successAlertMsg = msg;
            })

            this.$root.$on('failAlert',(isFail, msg) =>{
                this.showFailAlert = isFail;
                this.failAlertMsg = msg;
            })

        }
    }
</script>

<style scoped>

</style>