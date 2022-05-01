<script context="module" lang="ts">
	export const load = async ({ fetch, params }) => {
		return {
			props: {
				post: (await (await fetch(`/api/post/${params.id}`)).json()).post
			}
		};
	};
</script>

<script lang="ts">
	export let post;
</script>

{#if !post}
	<div class="text-3xl">Post Not Found</div>
	<a href="/">Home</a>
{:else}
	<div class="flex items-center flex-col">
		{#if post.parent}
			<div class="card w-2/5 card-bordered card-compact p-5 my-3">
				<div class="card-title">{post.parent.author.name}</div>
				<div class="card-body">{post.parent.content}</div>
				<div class="card-actions">
					<a class="btn" href="/reply/{post.parent.id}">Reply</a>
					<a class="btn" href="/view/{post.parent.id}">View</a>
				</div>
			</div>
		{/if}
		<div class="card w-1/2 card-bordered card-compact p-5 my-3">
			<div class="card-title">{post.author.name}</div>
			<div class="card-body">{post.content}</div>
			<div class="card-actions">
				<a class="btn" href="/reply/{post.id}">Reply</a>
			</div>
		</div>
		{#each post.children as child}
			<div class="card w-2/5 card-bordered card-compact p-5 my-3">
				<div class="card-title">{child.author.name}</div>
				<div class="card-body">{child.content}</div>
				<div class="card-actions">
					<a class="btn" href="/reply/{child.id}">Reply</a>
					<a class="btn" href="/view/{child.id}">View</a>
				</div>
			</div>
		{/each}
	</div>
{/if}
