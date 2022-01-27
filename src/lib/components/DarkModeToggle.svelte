<script lang="ts">
  let theme = 'dark';
  import { fade } from 'svelte/transition';
  import FaSun from 'svelte-icons/fa/FaSun.svelte'
  import FaRegMoon from 'svelte-icons/fa/FaMoon.svelte'
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  const getPrefersDarkMode = () =>
    window ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
  const getStoredTheme = () =>
    localStorage.getItem('theme')

  function setGiscusTheme(theme) {
    function sendMessage(message) {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (!iframe) return;
      iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }
    sendMessage({ setConfig: { theme } });
  }

  const setLightTheme = () => {
    const prism_theme = document.querySelector("#prism-theme");
    prism_theme.href = "/css/prism-light.css"
    document.body.classList.toggle('light', true);
    document.body.classList.toggle('dark', false);
    theme = 'light';
    dispatch('message', {
      theme: theme,
    });
    setGiscusTheme("light")
  };
  const setDarkTheme = () => {
    const prism_theme = document.querySelector("#prism-theme");
    prism_theme.href = "/css/prism-dark.css"
    document.body.classList.toggle('light', false);
    document.body.classList.toggle('dark', true);
    theme = 'dark';
    dispatch('message', {
      theme: theme,
    });
    setGiscusTheme("dark")
  };

  const checkTheme = (_) => {
    const storedTheme = getStoredTheme();
    if (storedTheme === 'light') setLightTheme();
    else if (storedTheme === 'dark') setDarkTheme();
    else if (document.body.classList.contains('light')) setLightTheme();
    else if (document.body.classList.contains('light')) setDarkTheme();
    else if (getPrefersDarkMode()) setDarkTheme();
    else setLightTheme();
  };

  const toggleColorMode = () => {
    if (theme === 'light') {
      setDarkTheme();
    } else if (theme === 'dark') {
      setLightTheme();
    }
    theme = document.body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  };

  import {onMount} from 'svelte'

  onMount(() => {
    checkTheme()
  })

</script>

<button
  on:click={toggleColorMode}
  use:checkTheme
  aria-label="toggle color mode"
>
  {#if theme === 'light'}
    <div in:fade="{{ duration: 200 }}">
      <FaSun />
    </div>
  {:else}
    <div in:fade="{{ duration: 200 }}">
      <FaRegMoon />
    </div>
  {/if}
</button>

<style>
  button {
    text-decoration: none;
    transition: 0.1s;
    padding: 0.75em 1.5em;
    border-radius: 4px;
    background: transparent;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background: var(--bkg-hover);
  }

  button > div {
    height: 1.25rem;
    width: 1.25rem;
    color: var(--text-color);
  }
</style>
