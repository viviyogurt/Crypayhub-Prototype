<template>

            <div class="card bg-dark border-dark text-light">
                <div class="card-body">
                    <h4 class="card-title">Contract Address</h4>
                    <p class="card-title-desc">
                        Open source core contracts of the payment system.
                    </p>

                    <div class="table-responsive">
                        <table class="table mb-0 table-dark">
                            <thead>
                            <tr>
                                <th>Contract Name</th>
                                <th>Network</th>
                                <th>Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>USDT</td>
                                <td>Matic</td>
                                <td class="tableAddress">{{contract.USDT}}</td>
                            </tr>
                            <tr>
                                <td>CPHT</td>
                                <td>Matic</td>
                                <td class="tableAddress">{{contract.CPHT}}</td>
                            </tr>
                            <tr>
                                <td>Subscription</td>
                                <td>Matic</td>
                                <td class="tableAddress">{{contract.SUBSCRIPTION}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

</template>

<script>
    /**
     * Basic-table component
     */
    import {config} from "@/config/config";

    export default {
        name:'contractAddress',
        page: {
            title: "Basic Tables",
        },
        data() {
            return {
                contract:config.contract,
                title: "Basic Tables",
                items: [
                    {
                        text: "Tables",
                        href: "/"
                    },
                    {
                        text: "Basic",
                        active: true
                    }
                ]
            };
        }
    };
</script>
