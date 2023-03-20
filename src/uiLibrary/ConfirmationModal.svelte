<script lang="ts">
  import { fade } from "svelte/transition";
  import clickOutside from "../actions/clickOutside";

  export let title: string;
  export let onConfirmation: () => Promise<void>;
  export let closeModal: () => void;

  const confirmationHandler = () => {
    onConfirmation();
    closeModal();
  };
</script>

<div
  class="modal-backdrop"
  in:fade={{ duration: 150 }}
  out:fade={{ duration: 150 }}
/>
<div
  class="modal"
  use:clickOutside
  on:clickedOutside={closeModal}
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200 }}
>
  <h2>{title}</h2>
  <div class="modal-btns">
    <button on:click={confirmationHandler}>Yes</button>
    <button class="secondary-btn" on:click={closeModal}>No</button>
  </div>
</div>

<style>
  .modal-backdrop {
    min-height: 100%;
    position: absolute;
    inset: 0;
    background-color: black;
    opacity: 0.7;
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--secondary);
    max-width: 40rem;
    min-height: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 40px 20px;
    border-radius: var(--border-radius);
  }

  h2 {
    text-align: center;
  }

  .modal-btns {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
</style>
