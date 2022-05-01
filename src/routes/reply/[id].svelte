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
	import { session } from '$app/stores';
	import Cooldown from '$lib/Cooldown.svelte';

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

		$session.user.lastPosted = new Date();

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

		<Cooldown till={+$session.user.lastPosted + 1000 * 60 * 10}>
			<div slot="timer" let:timeLeft>
				<div class="text-center text-xl">You can't post again for another</div>
				<div class="text-center text-2xl">{timeLeft}</div>
			</div>
			<div class="card w-2/5 card-bordered card-compact p-5 my-3">
				<div class="card-title">Your Reply</div>
				<textarea class="card-body textarea mb-2" bind:value={content} />
				<div class="card-actions">
					<button class="btn" on:click={reply}>Reply</button>
				</div>
			</div>
		</Cooldown>
	</div>
{/if}
