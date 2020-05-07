import Vue from 'vue'
import { ToastArgs } from '@/utils/miscTypes'

export default Vue.extend({

	/**
	 * State
	 */

	data() {
		return {
			currentToast: null,
		}
	},

	/**
	 * Mounted
	 */

	async mounted() {
		const message = this.$route.params.message || ''
		const color = this.$route.params.color || 'primary'
		const duration = this.$route.params.duration || 'medium'
		if (message != '') {
			const toastTypes: any = {
				'primary': this.toastPrimary,
				'success': this.toastSuccess,
				'warning': this.toastWarning,
				'error': this.toastError,
			}
			await toastTypes[color](message, duration)
		}
	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Success Toast
		 */

		async toastSuccess(message: string, duration: string) {
			await this.toastPrimary(message, 'success', duration, true)
		},

		/**
		 * Warning Toast
		 */

		async toastWarning(message: string, duration: string) {
			await this.toastPrimary(message, 'warning', duration, true)
		},

		/**
		 * Danger Toast
		 */

		async toastDanger(message: string, duration: string) {
			await this.toastPrimary(message, 'danger', duration, false)
		},

		/**
		 * Default Toast
		 */

		async toastPrimary(message: string, color: string = 'primary', duration: string = 'medium', autoClose: boolean = true) {
			const durations: any = {
				'short': 2000,
				'medium': 3500,
				'long': 5000,
			}
			await this.showToast({
				message: message,
				color: color,
				position: 'bottom',
				duration: autoClose ? durations[duration] : 0,
				showCloseButton: true,
			})
		},

		/**
		 * Delete Success Toast
		 */

		async toastSuccessDelete(item: string) {
			await this.toastSuccess(
				`Deleted ${item}`,
				'medium'
			)
		},

		/**
		 * Delete Failure Toast
		 */

		async toastWarningDelete(item: string) {
			await this.toastWarning(
				`Could not delete ${item}`,
				'medium'
			)
		},

		/**
		 * Create Success Toast
		 */

		async toastSuccessCreate(item: string) {
			await this.toastSuccess(
				`Created ${item}`,
				'medium'
			)
		},

		/**
		 * Create Failure Toast
		 */

		async toastWarningCreate(item: string) {
			await this.toastWarning(
				`Could not create ${item}`,
				'medium'
			)
		},

		/**
		 * Show Toast
		 */

		async showToast(args: ToastArgs) {
			if (this.currentToast != null) {
				await this.currentToast.dismiss()
			}
			this.currentToast = await this.$ionic.toastController.create({
				message: args.message,
				color: args.color,
				position: args.position,
				duration: args.duration,
				showCloseButton: args.showCloseButton,
			})
			await this.currentToast.present()
		},

	},
})