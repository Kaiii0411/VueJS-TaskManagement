<template>
    <div class="weather-component">
        <div v-if="accountState.isAuthenticated">
            <h1>Welcome, {{ accountState.user?.name }}!</h1>
            <button @click="fetchData">Fetch Data</button>
            <button @click="handleLogout">Log Out</button>
        </div>
        <div v-else>
            <h1>Weather forecast</h1>
            <button @click="handleLogin">Log In</button>
        </div>
        <p>This component demonstrates fetching data from the server.</p>

        <div v-if="loading" class="loading">
            Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationvue">https://aka.ms/jspsintegrationvue</a> for more details.
        </div>

        <div v-if="post" class="content">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="forecast in post" :key="forecast.date">
                        <td>{{ forecast.date }}</td>
                        <td>{{ forecast.temperatureC }}</td>
                        <td>{{ forecast.temperatureF }}</td>
                        <td>{{ forecast.summary }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="js">
    import { msalService } from '../config/msalService'
    import { state } from '../config/msalConfig'

    import { defineComponent } from 'vue';
    import axios from 'axios';

    export default defineComponent({
        data() {
            return {
                loading: false,
                post: null,
                accountState: state,
                msal: msalService()
            };
        },
        created() {
            // fetch the data when the view is created and the data is
            // already being observed
            this.initialize();
            //this.fetchData();
        },
        watch: {
            // call again the method if the route changes
            '$route': 'fetchData'
        },
        methods: {
            async handleLogin() {
                try {
                    await this.msal.login()
                } catch (error) {
                    console.error('Login error:', error)
                }
            },

            handleLogout() {
                try {
                    this.msal.logout()
                } catch (error) {
                    console.error('Logout error:', error)
                }
            },

            async initialize() {
                try {
                    await this.msal.initialize()
                    await this.msal.handleRedirect() 
                } catch (error) {
                    console.error('Initialization error:', error)
                }
            },

            fetchData() {
                try {
                    this.post = null;
                    this.loading = true;

                    // Extract the token from Vuex store
                    //const tokenResponse = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTmdoaWEgTmd1eWVuIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlciIsImV4cCI6MTcyMjE3MjI5NiwiaXNzIjoiaHR0cHM6Ly93d3cuc2Nob29sb3V0Zml0dGVycy5jb20vIiwiYXVkIjoiaHR0cHM6Ly93d3cuc2Nob29sb3V0Zml0dGVycy5jb20vIn0.wF62utM_H4IyZo4GLnjPs5g6Xga8hvm7WSBahsIxIAE';
                    const tokenResponse = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTmdoaWEgTmd1eWVuIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3MjIxNzIxNDcsImlzcyI6Imh0dHBzOi8vd3d3LnNjaG9vbG91dGZpdHRlcnMuY29tLyIsImF1ZCI6Imh0dHBzOi8vd3d3LnNjaG9vbG91dGZpdHRlcnMuY29tLyJ9.YqQKRVfsjFEGDC86RnOdiRMsgkTMiXMBCIE68YStbFU';
                    console.log('Token:', tokenResponse);

                    // Make the HTTP GET request
                    axios.get('weatherforecast', {
                        headers: {
                            'Authorization': `Bearer ${tokenResponse}`,
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        this.post = response.data;
                        this.loading = false;
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        this.loading = false; // Ensure loading state is reset in case of an error
                    });
                } catch (error) {
                    console.error('Unexpected error:', error);
                    this.loading = false; // Ensure loading state is reset in case of an unexpected error
                }
            }
        },
    });
</script>

<style scoped>
th {
    font-weight: bold;
}
tr:nth-child(even) {
    background: #F2F2F2;
}

tr:nth-child(odd) {
    background: #FFF;
}

th, td {
    padding-left: .5rem;
    padding-right: .5rem;
}

.weather-component {
    text-align: center;
}

table {
    margin-left: auto;
    margin-right: auto;
}
</style>