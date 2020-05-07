<template>
    <ion-page>
        <ion-main-header title="Settings" :menu="true" :back="true" />
        <ion-content>
            <ion-grid>
                <ion-row-col type="mid-md">
                    <ion-item no-padding :style="firstNameColor">
                        <ion-label position="floating">First name</ion-label>
                        <ion-input :value="firstNameText" @ionInput="firstNameText = $event.target.value"  />
                    </ion-item>
                    <ion-item no-padding :style="lastNameColor">
                        <ion-label position="floating">Last name</ion-label>
                        <ion-input :value="lastNameText" @ionInput="lastNameText = $event.target.value" />
                    </ion-item>
                    <ion-item no-padding :style="emailColor">
                        <ion-label position="floating">Email</ion-label>
                        <ion-input :value="emailText" @ionInput="emailText = $event.target.value" />
                    </ion-item>
                </ion-row-col>
                <ion-row-col type="mid-md">
                    <ion-button :disabled="submitDisabled" expand="block" @click="eventSaveSettings">Save changes</ion-button>
                </ion-row-col>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script lang='ts'>
import Vue from 'vue'
import userMixin from '@/mixins/userMixin'
import toastMixin from '@/mixins/toastMixin'
import validation from 'mongoose-auto-api.validation'

export default Vue.extend({
	/**
	 * State
	 */

	data() {
		return {
			emailText: this.$store.state.email,
			firstNameText: this.$store.state.first_name,
			lastNameText: this.$store.state.last_name,
			confirmPassText: '',
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
	 * Computed
	 */

	computed: {

		/**
		 * Submit Disabled
		 */

		submitDisabled() {
			return this.emailText == '' || this.firstNameText == '' || this.lastNameText == ''
		},

	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Event: Save Settings
		 */

		eventSaveSettings() {
			try {
					const firstNameVal: any = validation.requiredVal(
						this.firstNameText,
						'first name'
					)
					const lastNameVal: any = validation.requiredVal(
						this.lastNameText,
						'last name'
					)
					const emailVal: any = validation.userVal(
						this.emailText,
						'email'
					)
					this.firstNameDanger = !firstNameVal.valid
					this.lastNameDanger = !lastNameVal.valid
					this.emailDanger = !emailVal.valid
					const validations: Array<any> = [
						firstNameVal,
						lastNameVal,
						emailVal,
					]
					const valResults: any = validation.joinValidations(validations)
					if (valResults.messages.length > 0) {
						this.feedbackText = valResults.messages.length >= 3 ? valResults.messages.slice(0, 2).join(' ') : valResults.messages.join(' ')
						this.toastDanger(this.feedbackText)
					}
					else {
						this.$store.dispatch('updateData', {
							email: this.emailText,
							first_name: this.firstNameText,
							last_name: this.lastNameText,
						})
						this.feedbackText = 'Settings updated successfully'
						this.toastSuccess(this.feedbackText)
					}
			}
			catch (error) {
				console.error(error)
				this.feedbackText = 'Could not update information, please try again'
				this.toastDanger(this.feedbackText)
			}
		},

	},
})
</script>