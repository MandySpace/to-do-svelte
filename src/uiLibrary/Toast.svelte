<script lang="ts">
  import { toast } from "../stores";
  import type { ToastType } from "../types/toastTypes";
  import { fly, fade } from "svelte/transition";
  import { flip } from "svelte/animate";

  let toasts = [];

  const COLOR_MAP = {
    success: "forestgreen",
    warning: "goldenrod",
    error: "tomato",
  };

  const addToast = (toast: ToastType) => {
    toasts.push(toast);
    toasts = toasts;

    setTimeout(() => {
      toasts = toasts.filter(
        (toastInArray) => toastInArray.message !== toast.message
      );
    }, toast.duration ?? 3000);
  };

  $: if ($toast) {
    addToast($toast);
  }
</script>

<div class="toast-container">
  {#each toasts as toast (toast.message)}
    <div
      class="toast"
      style:background-color={COLOR_MAP[toast.severity]}
      in:fly={{ y: 50, duration: 500 }}
      out:fade
      animate:flip={{ duration: 1000 }}
    >
      <p>
        {toast.message}
      </p>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 20rem;
  }

  .toast {
    min-height: 3rem;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    padding-left: 0.5rem;
    animation: right-to-left 0.5s cubic-bezier(0.54, 1, 0.59, 1.17) forwards;
  }
</style>
