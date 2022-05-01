<script context="module" lang="ts">
	export const load = async ({ fetch, params, session, url }) => {
		if (!session) {
			return {
				redirect: `/login?to=${url}`,
				status: 303
			};
		}

		return {
			props: {
				post: (await (await fetch(`/api/post/${params.id}`)).json()).post
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	export let post;

	let content: string;
	let error: string;

	const reply = async () => {
		const res = await fetch('/api/post', {
			method: 'post',
			body: JSON.stringify({
				content,
				parentId: post.id
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

{#if error}
	<div class="text-error">{error}</div>
{/if}

{#if !post}
	<div class="text-3xl">Post Not Found</div>
	<a href="/">Home</a>
{:else}
	<div class="flex items-center flex-col">
		<div class="w-1/2 text-2xl">Replying to</div>
		<div class="card w-1/2 card-bordered card-compact p-5 my-3">
			<div class="card-title">{post.author.name}</div>
			<div class="card-body">{post.content}</div>
			<div class="card-actions">
				<a class="btn" href="/reply/{post.id}">View</a>
			</div>
		</div>
		<div class="card w-2/5 card-bordered card-compact p-5 my-3">
			<div class="card-title">Your Reply</div>
			<textarea class="card-body textarea mb-2" bind:value={content} />
			<div class="card-actions">
				<button class="btn" on:click={reply}>Reply</button>
			</div>
		</div>
	</div>
{/if}
