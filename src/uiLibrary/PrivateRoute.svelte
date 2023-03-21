<script lang="ts">
  import { navigate, Route } from "svelte-navigator";
  import { token } from "../stores";

  export let path: string;

  $: if (!$token) {
    navigate("/login", { replace: true });
  }
</script>

<Route {path}>
  {#if $token}
    <slot />
  {/if}
</Route>
