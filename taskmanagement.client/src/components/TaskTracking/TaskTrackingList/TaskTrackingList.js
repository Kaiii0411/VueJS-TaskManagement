import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            mail: 'nghia.nguyen@schooloutfitters.com'
        }
    },

    mounted() {},

    created() {},

    computed: {
        ...mapGetters('user', ['userInfo']),
    },

    methods: {
        ...mapActions('user', ['login']),

        async handleLogin() {
            this.login({mail: this.mail}).then(() => {
                console.log(this.userInfo)
            })
        }
    }
}