<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	let name: string;
	let email: string;
	let password: string;
	let confirmPassword: string;

	let error = '';

	const signup = async () => {
		const res = await fetch('/api/user', {
			method: 'post',
			body: JSON.stringify({
				name,
				email,
				password,
				confirmPassword
			})
		});

		const data = await res.json();

		if (data.error) {
			error = data.error;
			return;
		}
		$session = data.session;
		goto('/');
	};
</script>

<div class="card p-10">
	{#if error}
		<div class="text-error">{error}</div>
	{/if}

	<label for="name" class="label">Name</label>
	<input class="input input-bordered" bind:value={name} name="name" />
	<label for="email" class="label">Email</label>
	<input class="input input-bordered" bind:value={email} name="email" type="email" />
	<label for="password" class="label">Password</label>
	<input class="input input-bordered" bind:value={password} name="password" type="password" />
	<label for="confirmpass" class="label">Confirm Password</label>
	<input
		class="input input-bordered mb-5"
		bind:value={confirmPassword}
		name="confirmpass"
		type="password"
	/>
	<button class="btn" on:click={signup}>Sign up</button>
</div>
