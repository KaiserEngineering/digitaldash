import Vue from 'vue'
import {
	AlertTextArgs,
	AlertRadioArgs,
} from '@/utils/miscTypes'

export default Vue.extend({

	/**
	 * State
	 */

	data() {
		return {

		}
	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Alert Text
		 */

		async alertText(args: AlertTextArgs) {
			const alert = await this.$ionic.alertController.create({
				header: args.title,
				message: args.message,
				buttons: ['Cancel', 'Okay']
			})
			await alert.present()
			const res = await alert.onDidDismiss()
			return !(res.role == 'cancel')
		},

		/**
		 * Alert radio
		 */

		async alertRadio(args: AlertRadioArgs) {
			const alert = await this.$ionic.alertController.create({
				header: args.title,
				inputs: args.items,
				buttons: ['Cancel', 'Okay']
			})
			await alert.present()
			return await alert.onDidDismiss()
		}

	},
})