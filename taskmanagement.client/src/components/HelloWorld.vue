<template>
    <div class="weather-component">
        <div v-if="accountState.isAuthenticated">
            <h1>Welcome, {{ accountState.user?.name }}!</h1>
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
            this.fetchData();
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
                this.post = null;
                this.loading = true;

                axios.get('weatherforecast')
                    .then(response => {
                        this.post = response.data;
                        this.loading = false;
                        return;
                    });
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