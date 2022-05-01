<script context="module" lang="ts">
	export const load: Load = ({ session, url }) => {
		if (!session) {
			return {
				redirect: `/login?to=${url}`,
				status: 303
			};
		} else {
			return {};
		}
	};
</script>

<script lang="ts">
	import Cooldown from '$lib/Cooldown.svelte';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Load } from '@sveltejs/kit';
	import { onDestroy, onMount } from 'svelte';

	let content: string;

	let error = '';

	console.log($session.user);

	const create = async () => {
		const res = await fetch('/api/post', {
			method: 'post',
			body: JSON.stringify({
				content
			})
		});

		const data = await res.json();

		if (data.error) {
			error = data.error;
			return;
		}

		$session.user.lastPosted = new Date();

		goto(`/view/${data.post.id}`);
	};
</script>

{#if error}
	<div class="text-error">{error}</div>
{/if}

<Cooldown till={+$session.user.lastPosted + 1000 * 60 * 10}>
	<div slot="timer" let:timeLeft>
		<div class="text-center text-xl">You can't post again for another</div>
		<div class="text-center text-2xl">{timeLeft}</div>
	</div>
	<div class="card p-10">
		<label for="content" class="label">Content</label>
		<textarea class="textarea textarea-bordered mb-5" bind:value={content} name="content" />
		<button class="btn" on:click={create}>Create</button>
	</div>
</Cooldown>
