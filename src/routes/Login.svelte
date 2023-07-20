<script lang="ts">
  import { loginUser } from "../services/authServices";
  import type { LoginPayload } from "../types/authTypes";
  import { token, user } from "../stores";
  import { Link, navigate } from "svelte-navigator";
  import Spinner from "../uiLibrary/Spinner.svelte";
  import { toast } from "../stores";
  import EyeSVG from "../assets/eye.svg";
  import EyeOffSVG from "../assets/eyeOff.svg";

  let loading = false;
  let usernameInputRef: HTMLInputElement | null = null;
  let passwordInputRef: HTMLInputElement | null = null;
  let showPassword = false;

  const loginForm: LoginPayload = {
    username: null,
    password: null,
  };

  let loginFormError = {
    username: null,
    password: null,
  };

  const submitHandler = async () => {
    const error = validateForm();
    if (error) {
      return;
    }
    loading = true;
    try {
      const response = await loginUser(loginForm);
      if (response.status === 200) {
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("refreshToken", response.data.refreshToken);
        window.localStorage.setItem("expiresIn", response.data.expiresIn);
        token.set(response.data.token);
        user.set(response.data.user);
        navigate("/", { replace: true });
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

  const validateForm = () => {
    let error = false;

    if (!loginForm.username) {
      loginFormError.username = "Username is required";
      error = true;
      usernameInputRef?.focus();
    }

    if (!!loginForm.username && loginForm.username.length < 5) {
      loginFormError.username = "Username must be minimum 5 char long";
      error = true;
      usernameInputRef?.focus();
    }

    if (!loginForm.password) {
      loginFormError.password = "Password is required";
      error = true;
      passwordInputRef?.focus();
    }

    if (!!loginForm.password && loginForm.password.length < 7) {
      loginFormError.password = "Password must be minimum 7 char long";
      error = true;
      passwordInputRef?.focus();
    }

    return error;
  };

  $: if (Boolean(loginFormError.username) && Boolean(loginForm.username)) {
    if (loginForm.username.length < 5) {
      loginFormError.username = "Username must be minimum 5 char long";
    } else {
      loginFormError.username = null;
    }
  }
  $: if (Boolean(loginFormError.password) && Boolean(loginForm.password)) {
    if (loginForm.password.length < 6) {
      loginFormError.password = "Password must be minimum 6 char long";
    } else {
      loginFormError.password = null;
    }
  }
</script>

<div class="form-container">
  <h1>Login</h1>
  <p class="sub-title">
    Don't have an account? <Link to="/register" replace>Register</Link>
  </p>
  <form action="#">
    <div>
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        bind:value={loginForm.username}
        bind:this={usernameInputRef}
      />
      {#if loginFormError.username}
        <p class="form-error">{loginFormError.username}</p>
      {/if}
    </div>
    <div class="mb">
      <label for="password">Password</label>
      <div class="password-container">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={loginForm.password}
          bind:this={passwordInputRef}
          on:input={(e) => (loginForm.password = e.currentTarget.value)}
        />
        <button
          class="password-eye-btn"
          type="button"
          on:click|preventDefault={() => (showPassword = !showPassword)}
        >
          <img
            src={showPassword ? EyeSVG : EyeOffSVG}
            alt="an eye representing user can see the password"
          />
        </button>
      </div>
      {#if loginFormError.password}
        <p class="form-error">{loginFormError.password}</p>
      {/if}
    </div>
    <button
      type="submit"
      on:click|preventDefault={submitHandler}
      disabled={loading}
    >
      {#if loading}
        <Spinner />
      {:else}
        Login
      {/if}
    </button>
  </form>
</div>

<style>
  .sub-title {
    margin-bottom: 2rem;
  }
  .mb {
    margin-bottom: 1.5rem;
  }
  .password-container {
    position: relative;
    padding-bottom: 0rem;
  }
  .password-container button {
    position: absolute;
    right: 0%;
    top: 50%;
    transform: translateY(-50%);
    padding-right: 10px;
    cursor: pointer;
  }
</style>
