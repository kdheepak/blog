<script lang="ts">
  let theme = "dark";

  import { toast } from "@zerodevx/svelte-toast";
  import { fade } from "svelte/transition";
  import FaSun from "svelte-icons/fa/FaSun.svelte";
  import FaRegMoon from "svelte-icons/fa/FaMoon.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const getPrefersDarkMode = () =>
    window ? window.matchMedia("(prefers-color-scheme: dark)").matches : true;
  const getStoredTheme = () => localStorage.getItem("theme");

  function setGiscusTheme(theme) {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe) return;
    iframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app");
  }

  const setLightTheme = () => {
    document.body.classList.toggle("light", true);
    document.body.classList.toggle("dark", false);
    document.querySelectorAll("[data-theme='light']").forEach((item) => {
      item.style.display = "block";
      if (item.closest("pre")) {
        item.closest("pre").classList.remove("hidden");
        item.closest("pre").previousElementSibling.classList.remove("hidden");
      }
    });
    document.querySelectorAll("[data-theme='dark']").forEach((item) => {
      item.style.display = "block";
      if (item.closest("pre")) {
        item.closest("pre").classList.add("hidden");
        item.closest("pre").previousElementSibling.classList.add("hidden");
      }
    });
    theme = "light";
    dispatch("message", {
      theme: theme,
    });
    setGiscusTheme("light");
  };

  const setDarkTheme = () => {
    document.body.classList.toggle("light", false);
    document.body.classList.toggle("dark", true);
    document.querySelectorAll("[data-theme='light']").forEach((item) => {
      item.style.display = "block";
      if (item.closest("pre")) {
        item.closest("pre").classList.add("hidden");
        item.closest("pre").previousElementSibling.classList.add("hidden");
      }
    });
    document.querySelectorAll("[data-theme='dark']").forEach((item) => {
      item.style.display = "block";
      if (item.closest("pre")) {
        item.closest("pre").classList.remove("hidden");
        item.closest("pre").previousElementSibling.classList.remove("hidden");
      }
    });
    theme = "dark";
    dispatch("message", {
      theme: theme,
    });
    setGiscusTheme("dark");
  };

  const checkTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme === "light") setLightTheme();
    else if (storedTheme === "dark") setDarkTheme();
    else if (document.body.classList.contains("light")) setLightTheme();
    else if (document.body.classList.contains("light")) setDarkTheme();
    else if (getPrefersDarkMode()) setDarkTheme();
    else setLightTheme();
  };

  const toggleColorMode = () => {
    if (theme === "light") {
      setDarkTheme();
    } else if (theme === "dark") {
      setLightTheme();
    }
    theme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", theme);
  };

  const success = (m) =>
    toast.push(m, {
      theme: {
        "--toastColor": theme == "dark" ? "white" : "black",
        "--toastBackground": theme == "dark" ? "#2d2d2d" : "#f5f2f0",
        "--toastBarBackground": theme == "dark" ? "#a0a0a0" : "#303030",
      },
    });

  function init() {
    window.copyCode = (evt, elem) => {
      evt.preventDefault();
      evt.stopPropagation();
      try {
        selectText(elem.parentNode.querySelector("code"));
        document.execCommand("copy");
        window.getSelection();
        success("Copied!");
      } catch (e) {
        console.error("Browser copy command not supported?", e);
      }
    };
  }

  function selectText(node) {
    if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(node);
      range.select();
    } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      console.warn("Could not select text in node: Unsupported browser.");
    }
  }

  import { onMount } from "svelte";

  onMount(() => {
    checkTheme();
    init();
  });
</script>

<button on:click={toggleColorMode} use:checkTheme aria-label="toggle color mode">
  {#if theme === "light"}
    <div in:fade={{ duration: 200 }}>
      <FaSun />
    </div>
  {:else}
    <div in:fade={{ duration: 200 }}>
      <FaRegMoon />
    </div>
  {/if}
</button>

<style>
  button {
    position: fixed;
    text-decoration: none;
    width: 60px;
    height: 60px;
    bottom: 40px;
    right: 40px;
    transition: 0.1s;
    padding: 0.75em 1.5em;
    background: var(--code-bkg-color);
    border-radius: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    text-align: center;
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
