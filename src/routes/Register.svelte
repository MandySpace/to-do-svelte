<script lang="ts">
  import { registerUser } from "../services/authServices";
  import type { RegisterPayload } from "../types/authTypes";
  import { toast, token, user } from "../stores";
  import { Link, navigate } from "svelte-navigator";
  import Spinner from "../uiLibrary/Spinner.svelte";
  import EyeSVG from "../assets/eye.svg";
  import EyeOffSVG from "../assets/eyeOff.svg";

  let loading = false;
  let usernameInputRef: HTMLInputElement | null = null;
  let passwordInputRef: HTMLInputElement | null = null;
  let showPassword = false;

  const registerForm: RegisterPayload = {
    username: null,
    password: null,
  };

  let registerFormError = {
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
      const response = await registerUser(registerForm);
      if (response.status === 201) {
        window.localStorage.setItem("token", response.data.token);
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
      if (
        err.response.data?.code === 11000 &&
        err.response.data?.keyPattern.hasOwnProperty("username")
      ) {
        errorMsg = "Username is already taken!";
      } else if (err.response.data?.message) {
        errorMsg = err.response.data?.message.split(": ").at(-1);
      } else {
        errorMsg = "Something went wrong";
      }

      toast.set({
        message: errorMsg,
        severity: "error",
      });
    } finally {
      loading = false;
    }
  };

  const validateForm = () => {
    let error = false;

    if (!registerForm.username) {
      registerFormError.username = "Username is required";
      error = true;
      usernameInputRef?.focus();
    }

    if (!!registerForm.username && registerForm.username.length < 5) {
      registerFormError.username = "Username must be minimum 5 char long";
      error = true;
      usernameInputRef?.focus();
    }

    if (!registerForm.password) {
      registerFormError.password = "Password is required";
      error = true;
      passwordInputRef?.focus();
    }

    if (!!registerForm.password && registerForm.password.length < 7) {
      registerFormError.password = "Password must be minimum 7 char long";
      error = true;
      passwordInputRef?.focus();
    }

    return error;
  };

  $: if (
    Boolean(registerFormError.username) &&
    Boolean(registerForm.username)
  ) {
    if (registerForm.username.length < 5) {
      registerFormError.username = "Username must be minimum 5 char long";
    } else {
      registerFormError.username = null;
    }
  }
  $: if (
    Boolean(registerFormError.password) &&
    Boolean(registerForm.password)
  ) {
    if (registerForm.password.length < 7) {
      registerFormError.password = "Password must be minimum 7 char long";
    } else {
      registerFormError.password = null;
    }
  }
</script>

<div class="form-container">
  <h1>Create an account</h1>
  <p class="sub-title">
    Already have an account? <Link to="/login" replace>Login</Link>
  </p>
  <form action="#">
    <div>
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        bind:value={registerForm.username}
        bind:this={usernameInputRef}
      />
      {#if registerFormError.username}
        <p class="form-error">{registerFormError.username}</p>
      {/if}
    </div>
    <div class="mb">
      <label for="password">Password</label>
      <div class="password-container">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={registerForm.password}
          bind:this={passwordInputRef}
          on:input={(e) => (registerForm.password = e.currentTarget.value)}
        />
        <button
          class="password-eye-btn"
          on:click|preventDefault={() => (showPassword = !showPassword)}
        >
          <img
            src={showPassword ? EyeSVG : EyeOffSVG}
            alt="an eye representing user can see the password"
          />
        </button>
      </div>
      {#if registerFormError.password}
        <p class="form-error">{registerFormError.password}</p>
      {/if}
    </div>
    <button on:click|preventDefault={submitHandler} disabled={loading}>
      {#if loading}
        <Spinner />
      {:else}
        Register
      {/if}</button
    >
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
