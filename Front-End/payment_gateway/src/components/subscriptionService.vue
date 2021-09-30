<template>
    <div>
        <br>
        <b-container fluid>
            <accountRow :sender-account="senderAccount" token-name="CPHT"></accountRow>
            <b-card style="background-color: rgba(33, 37, 41, 0.4)" header="Subscribe" class="text-center">
                <subscribe :senderAccount="senderAccount"></subscribe>
            </b-card>

            <b-card style="background-color: rgba(33, 37, 41, 0.4)" header="Subscribed Service" text-variant="white" class="text-center mt-4">
                <mySubscription :senderAccount="senderAccount"></mySubscription>
            </b-card>
        </b-container>
    </div>
</template>

<script>
    import accountRow from "@/components/general/accountRow";
    import subscribe from "@/components/subscription/subscribe";
    import mySubscription from "@/components/subscription/mySubscription";

    export default {
        name: "subscriptionService",
        components: {
            accountRow,
            subscribe,
            mySubscription
        },
        props: {
            senderAccount: String
        }
    }
</script>

<style scoped>

</style>