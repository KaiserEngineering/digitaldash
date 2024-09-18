<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data }: { data: { config: Config; constants: any } } = $props();

	let configString = $state(JSON.stringify(data.config, null, 2));

	function isValidJson(content: string): boolean {
		try {
			JSON.parse(content);
			return true;
		} catch (e) {
			return false;
		}
	}

	let invalid = $derived(isValidJson(configString));
</script>

<form method="POST" class="col-12 advanced" action="?/updateConfig">
	{#if invalid}
		<div class="alert alert-danger">Invalid JSON</div>
	{/if}

	<textarea name="config" class="form-control" bind:value={configString} />

	<button disabled={invalid} class="mt-2 form-control" type="submit">Save</button>

	<button class="mt-2 form-control" type="submit" formaction="?/reset">Reset To Default</button>
</form>

<style>
	textarea {
		width: 100%;
		height: 500px;
	}
</style>
