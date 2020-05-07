import Vue from 'vue'
import { dangerComp } from '@/utils/miscFunctions'

export default Vue.extend({

    /**
     * State
     */

    data() {
        const email: string = this.$route.params.email || ''
        return {
            emailText: email,
            passText: this.$route.params.password || '',
            feedbackText: '',
            submitEnabled: false,
            emailDanger: false,
            passDanger: false,
            confirmPassDanger: false,
            firstNameDanger: false,
            lastNameDanger: false,
        }
    },

    /**
     * Computed
     */

    computed: {

        /**
         * Email Color
         */

        emailColor() {
            return dangerComp(this.emailDanger)
        },

        /**
         * Pass Color
         */

        passColor() {
            return dangerComp(this.passDanger)
        },

        /**
         * Confirm Pass Color
         */

        confirmPassColor() {
            return dangerComp(this.confirmPassDanger)
        },

        /**
         * First Name Color
         */

            firstNameColor() {
            return dangerComp(this.firstNameDanger)
            },

            /**
            * Last Name Color
            */

        lastNameColor() {
            return dangerComp(this.lastNameDanger)
        },

    },

    /**
     * Methods
     */

    methods: {
    },

})