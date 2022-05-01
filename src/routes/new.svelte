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
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Load } from '@sveltejs/kit';

	let content: string;

	let error = '';

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
		goto(`/view/${data.post.id}`);
	};
</script>

<div class="card p-10">
	{#if error}
		<div class="text-error">{error}</div>
	{/if}

	<label for="content" class="label">Content</label>
	<textarea class="textarea textarea-bordered mb-5" bind:value={content} name="content" />
	<button class="btn" on:click={create}>Create</button>
</div>
