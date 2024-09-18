<script lang="ts">
	import '../app.postcss';
	import * as Menubar from '$lib/components/ui/menubar';
	import toast, { Toaster } from 'svelte-french-toast';

	let { children } = $props();

	let title = 'KE Digital Dash';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="flex h-screen flex-col overflow-x-hidden container">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>Menu</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item><a href="/">Home</a></Menubar.Item>
				<Menubar.Item><a href="advanced">Advanced</a></Menubar.Item>
				<Menubar.Separator />
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>

	<Toaster></Toaster>

	{@render children()}
</div>
