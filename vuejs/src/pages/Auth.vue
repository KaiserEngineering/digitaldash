<template>
    <ion-page>
        <ion-content>
            <ion-grid>
                <ion-row-col type="mid-sm">
                    <ion-img src="images/main_logo.png" />
                </ion-row-col>
                <ion-row-col type="mid-md">
                    <ion-item no-padding :style="emailColor">
                        <ion-label position="floating">Email</ion-label>
                        <ion-input :value="emailText" @ionInput="emailText = $event.target.value" />
                    </ion-item>
                    <ion-item no-padding :style="passColor">
                        <ion-label position="floating">Password</ion-label>
                        <ion-input type="password" :value="passText" @ionInput="passText = $event.target.value" />
                    </ion-item>
                </ion-row-col>
                <ion-row-col type="mid-md">
                    <ion-button :disabled="submitDisabled" expand="block" @click="eventLogin">Log in</ion-button>
                </ion-row-col>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script lang='ts'>
import Vue from 'vue'
import userMixin from '@/mixins/userMixin'
import toastMixin from '@/mixins/toastMixin'
import {
    loginFailure,
    loginDataSync
}
from '@/utils/miscFunctions'

export default Vue.extend({

    /**
     * State
     */

    data() {
        return {

        }
    },

    /**
     * Mixins
     */

    mixins: [
        userMixin,
        toastMixin,
    ],

    /**
     * Created
     */

    created() {
        this.$store.dispatch('resetState')
    },

    /**
     * Computed
     */

    computed: {

        /**
         * Submit Disabled
         */

        submitDisabled() {
            return this.emailText == '' || this.passText == ''
        },

    },

    /**
     * Methods
     */

    methods: {

        /**
         * Event: Email login
         */

        async eventLogin() {
            try {
                const res = await this.$api.post('http://localhost:3000/api/login')
                loginDataSync.bind(this)(res, 'email')
            }
            catch (error) {
                loginFailure.bind(this)(error)
            }
        },

        /**
         * Event: Sign up
         */

        eventSignUp() {
            this.$router.push({
                name: 'signup',
                params: {
                    email: this.emailText,
                    password: this.passText,
                    method: 'email',
                    message: 'Please enter info to complete signup',
                }
            })
        }

    },
})
</script>