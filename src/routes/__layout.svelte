<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.scss';
	import Nav from '$lib/Nav.svelte';
</script>

<div>
	<Header />
	<main>
		<slot />
	</main>
</div>

<slot />
