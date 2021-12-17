<script lang="ts">
  import Header from "$lib/header/Header.svelte";
  import "../app.css";
  import Nav from '$lib/Nav.svelte';
</script>

<div>
  <Header>
  </Header>
  <main>
    <slot />
  </main>
</div>
