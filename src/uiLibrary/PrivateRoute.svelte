<script lang="ts">
  import { navigate, Route } from "svelte-routing";
  import { onMount } from "svelte";

  export let path: string;

  onMount(() => {
    if (!window.localStorage.getItem("token")) {
      navigate("login");
    }
  });
</script>

<Route {path}>
  <slot />
</Route>
