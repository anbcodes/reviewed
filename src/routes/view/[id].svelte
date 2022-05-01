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
	<div>
		<div>{post.author.name}</div>
		<div>{post.content}</div>
	</div>
{/if}
