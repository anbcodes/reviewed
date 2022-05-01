<script lang="ts">
	import { session } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	export let till: number | Date;
	let timeLeft = +till - +new Date();

	let int = null;
	onMount(() => {
		int = setInterval(() => {
			timeLeft = +till - +new Date();
		});
	});

	onDestroy(() => clearInterval(int));

	const formatDuration = (ms: number) => {
		const sec = Math.floor(ms / 1000);
		const min = Math.floor(sec / 60);

		return `${min}:${(sec % 60).toString(10).padStart(2, '0')}`;
	};
</script>

{#if timeLeft > 0}
	<slot name="timer" timeLeft={formatDuration(timeLeft)}>
		<div class="text-center text-xl">On cooldown for</div>
		<div class="text-center text-2xl">{formatDuration(timeLeft)}</div>
	</slot>
{:else}
	<slot />
{/if}
