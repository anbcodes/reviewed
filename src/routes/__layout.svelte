<script>
	import '../app.css';
	import { session } from '$app/stores';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});

	const logout = async () => {
		await fetch('/api/session', { method: 'delete' });
		$session = undefined;
	};

	const themes = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter'
	];
</script>

<div class="navbar">
	<div class="flex-1 text-2xl">Reviewed Social</div>
	<div class="flex">
		<a class="btn mr-5" href="/">Home</a>
		{#if $session}
			<a class="btn mr-5" href="/new">Post</a>

			<button class="btn" on:click={logout}>Logout</button>
		{:else}
			<a class="btn" href="/login">Log In</a>
		{/if}
		<select data-choose-theme class="ml-5 select select-primary">
			{#each themes as theme}
				<option value={theme}>{theme[0].toUpperCase() + theme.slice(1)}</option>
			{/each}
		</select>
	</div>
</div>

<slot />
