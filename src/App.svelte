<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import PrivateRoute from "./uiLibrary/PrivateRoute.svelte";
  import Toast from "./uiLibrary/Toast.svelte";
</script>

<Router>
  <Route path="register"><Register /></Route>
  <Route path="login"><Login /></Route>
  <PrivateRoute path="/"><Dashboard /></PrivateRoute>
</Router>
<Toast />
