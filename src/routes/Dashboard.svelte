<script lang="ts">
  import { navigate } from "svelte-navigator";
  import Tasks from "../components/Tasks.svelte";
  import { getUser as getMe, logoutUser } from "../services/authServices";
  import { toast, token, user } from "../stores";
  import Spinner from "../uiLibrary/Spinner.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    if (!$user) {
      getUser();
    //ayyoo comment
   }
  });

  let loading = false;
  let fetchingUser = false;
  let greeting: string = "";

  const greetUser = () => {
    const date = new Date();
    const currentHour = date.getHours();

    if (currentHour < 12) {
      greeting = "Good morning";
    } else if (currentHour < 17) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    if ($user) {
      greeting =
        greeting +
        `, ${
          $user?.username.charAt(0).toUpperCase() + $user?.username.slice(1)
        }`;
    }
  };

  greetUser();

  const getUser = async () => {
    fetchingUser = true;
    try {
      const response = await getMe();
      if (response.status === 200) {
        user.set(response.data);
        greetUser();
      } else {
        navigate("/login");
      }
    } catch (err) {
      navigate("/login");
    }
    fetchingUser = false;
  };

  const signOutHandler = async () => {
    loading = true;
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        window.localStorage.removeItem("token");
        token.set(null);
        user.set(null);
        navigate("/login");
      } else {
        toast.set({
          message: "Something went wrong",
          severity: "error",
        });
      }
    } catch (err) {
      let errorMsg: string;
      if (err.response.status === 400) {
        errorMsg = "Username or password is incorrect";
      } else if (err.response.data?.message) {
        errorMsg = err.response.data?.message.split(": ").at(-1);
      } else {
        errorMsg = "Something went wrong";
      }
      toast.set({
        message: errorMsg,
        severity: "error",
      });
    }
    loading = false;
  };
</script>

<main>
  <nav>
    <h2>{greeting}</h2>
    <ul>
      <li>
        <button class="secondary-btn" on:click={signOutHandler}
          >{#if loading}
            <Spinner />
          {:else}
            Sign Out
          {/if}
        </button>
      </li>
    </ul>
  </nav>
  <Tasks />
</main>

<style>
  main {
    padding: 2rem 1rem;
  }
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  li {
    list-style: none;
    margin-left: auto;
  }
</style>
