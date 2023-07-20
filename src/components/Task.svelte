<script lang="ts">
  import { editTask, removeTask } from "../services/taskServices";
  import ConfirmationModal from "../uiLibrary/ConfirmationModal.svelte";
  import { toast } from "../stores";
  import DeleteSVG from "../assets/delete.svg";
  import CheckSVG from "../assets/check.svg";
  import ArrowBackSVG from "../assets/arrowBack.svg";
  import type { TaskType } from "../types/taskTypes";
  import Spinner from "../uiLibrary/Spinner.svelte";
  import Portal from "../uiLibrary/Portal.svelte";

  export let task = null;
  export let tasks: TaskType[];

  let isDeleteModalOpen = false;
  let taskIdToDelete: string | null = null;
  let isDeleting = false;

  let isEditingTask = false;

  const deleteTask = async () => {
    isDeleting = true;
    try {
      const response = await removeTask(taskIdToDelete);
      if (response.status === 200) {
        isDeleting = false;
        tasks = tasks.filter((task) => task._id !== response.data._id);
      } else {
        toast.set({
          message: "Something went wrong!",
          severity: "error",
        });
      }
    } catch (err) {
      let message: string = "Something went wrong!";
      if (err.response.status === 404) {
        message = "Task cannot be found!";
      }
      toast.set({
        message,
        severity: "error",
      });
    }
    isDeleting = false;
  };

  const editTaskStatus = async (taskId: string, isCompleted: boolean) => {
    isEditingTask = true;
    try {
      const response = await editTask(taskId, isCompleted);
      if (response.status === 200) {
        isEditingTask = false;
        tasks = tasks.filter((task) => task._id !== response.data._id);
      } else {
        toast.set({
          message: "Something went wrong!",
          severity: "error",
        });
      }
    } catch (err) {
      let message: string = "Something went wrong!";
      if (err.response.status === 404) {
        message = "Task cannot be found!";
      }
      toast.set({
        message,
        severity: "error",
      });
    }
    isEditingTask = false;
  };

  const openDeleteModal = (taskId: string) => {
    isDeleteModalOpen = true;
    taskIdToDelete = taskId;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen = false;
    taskIdToDelete = null;
  };
</script>

<p>{task.description}</p>
<div class="item-actions-container">
  <button
    class="action-btn"
    on:click={editTaskStatus.call(null, task._id, !task.completed)}
    disabled={isEditingTask}
  >
    {#if isEditingTask}
      <Spinner />
    {:else}
      <div class={task.completed ? "cross-icon" : "check-icon"}>
        <img
          src={task.completed ? ArrowBackSVG : CheckSVG}
          alt="a tick mark denoting a task will be marked as complete"
        />
      </div>
    {/if}
  </button>
  <button
    class="action-btn"
    on:click={openDeleteModal.call(null, task._id)}
    disabled={isDeleting}
  >
    {#if isDeleting}
      <Spinner />
    {:else}
      <div class="delete-icon">
        <img
          src={DeleteSVG}
          alt="a girl looking at a worm through a magnifying glass"
        />
      </div>
    {/if}
  </button>
</div>

{#if isDeleteModalOpen}
  <Portal>
    <ConfirmationModal
      title="Are you sure you want to delete this task?"
      onConfirmation={deleteTask}
      closeModal={closeDeleteModal}
    />
  </Portal>
{/if}

<style>
  .item-actions-container {
    display: flex;
    align-items: center;
  }

  .action-btn {
    position: relative;
    cursor: pointer;
    min-width: 50px;
    aspect-ratio: 1/1;
    border-radius: 3px;
    background-color: transparent;
  }

  .action-btn:hover img {
    transform: scale(1.1);
  }

  img {
    transition: all 0.2s;
  }

  .action-btn:hover div::after {
    position: absolute;
    /* width: 100%; */
    font-size: 12px;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, 50%);
  }

  .action-btn:hover .delete-icon::after {
    content: "Delete";
  }

  .action-btn:hover .check-icon::after {
    content: "Complete";
  }

  .action-btn:hover .cross-icon::after {
    content: "Move to Pending";
  }

  @media (max-width: 600px) {
    .item-actions-container img {
      width: 24px;
    }
    p {
      word-break: break-word;
      font-size: 1.6rem;
    }
    .action-btn {
      min-width: 20px;
    }
  }
</style>
