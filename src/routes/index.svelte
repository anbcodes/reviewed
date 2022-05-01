<script context="module" lang="ts">
	export const load = async ({ fetch }) => {
		return {
			props: {
				posts: (await (await fetch('/api/feed')).json()).posts
			}
		};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
	export let posts: any[] = [];
	$: console.log($session);
	const logout = async () => {
		await fetch('/api/session', { method: 'delete' });
		$session = undefined;
	};
</script>

<div class="navbar">
	<div class="flex-1 text-2xl">Reviewed Social</div>
	<div class="flex">
		{#if $session}
			<a class="btn mr-5" href="/new">Post</a>

			<button class="btn" on:click={logout}>Logout</button>
		{:else}
			<a class="btn" href="/login">Log In</a>
		{/if}
	</div>
</div>

{#if $session}
	<div class="text-5xl text-center">Welcome back {$session.user.name}!</div>
{:else}
	<div class="text-5xl text-center">Welcome!</div>
{/if}

{#each posts as post}
	<div>
		<div>
			{post.author.name}
		</div>
		<div>
			{post.content}
		</div>
	</div>
{/each}
