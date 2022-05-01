<script lang="ts">
	import { session, page } from '$app/stores';
	import { goto } from '$app/navigation';

	let email: string;
	let password: string;

	let error = '';

	const login = async () => {
		const res = await fetch('/api/session', {
			method: 'post',
			body: JSON.stringify({
				email,
				password
			})
		});

		const data = await res.json();

		if (data.error) {
			error = data.error;
			return;
		}
		$session = data.session;
		if ($page.url.searchParams.get('to')) {
			goto($page.url.searchParams.get('to'));
		} else {
			goto('/');
		}
	};
</script>

<div class="card p-10">
	{#if error}
		<div class="text-error">{error}</div>
	{/if}

	<a
		href="/signup{$page.url.searchParams.get('to')
			? `?to=${$page.url.searchParams.get('to')}`
			: ''}"
		class="link-secondary">Signup instead</a
	>

	<label for="email" class="label">Email</label>
	<input class="input input-bordered" bind:value={email} name="email" type="email" />
	<label for="password" class="label">Password</label>
	<input class="input input-bordered mb-5" bind:value={password} name="password" type="password" />
	<button class="btn" on:click={login}>Log in</button>
</div>
