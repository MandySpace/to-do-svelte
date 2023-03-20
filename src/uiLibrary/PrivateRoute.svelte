<script lang="ts">
  import { navigate, Route } from "svelte-routing";
  import Login from "../routes/Login.svelte";

  export let path: string;
  let renderPrivateRoute = false;

  $: if (!window.localStorage.getItem("token")) {
    navigate("/login");
  } else {
    renderPrivateRoute = true;
  }
</script>

<Route {path}>
  {#if renderPrivateRoute}
    <slot />
  {:else}
    <Login />
  {/if}
</Route>
