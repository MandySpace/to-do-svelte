<script lang="ts">
  import { navigate, Route } from "svelte-routing";

  export let path: string;

  if (!window.localStorage.getItem("token")) {
    navigate("login");
  }
</script>

<Route {path}>
  <slot />
</Route>
