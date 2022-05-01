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
	console.log(posts);
	const previewLength = 50;
</script>

{#if $session}
	<div class="text-5xl text-center pb-3">Welcome back {$session.user.name}!</div>
{:else}
	<div class="text-5xl text-center pb-3">Welcome!</div>
{/if}

{#each posts as post}
	<div class="flex items-center flex-col">
		<div class="card w-1/2 card-bordered card-compact p-5 my-3">
			<div class="card-title flex">
				<div class="pr-5">
					{post.author.name}
				</div>
				{#if post.parent}
					<div class="text-sm font-normal">
						Replying to <a href="/view/{post.parent.id}">
							"{post.parent.content.slice(0, previewLength)}{post.parent.content.length >
							previewLength
								? '...'
								: ''}" - {post.parent.author.name}
						</a>
					</div>
				{/if}
			</div>
			<div class="card-body">
				{post.content}
			</div>
			<div class="card-actions">
				<a href="/reply/{post.id}" class="btn">Reply</a>
				<a href="/view/{post.id}" class="btn">View</a>
			</div>
		</div>
	</div>
{/each}
