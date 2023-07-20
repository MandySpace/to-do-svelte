<script lang="ts">
  import { addTask } from "../services/taskServices";
  import { fetchTasks } from "../services/taskServices";
  import { toast } from "../stores";
  import { TasksToDisplayEnum, type TaskType } from "../types/taskTypes";
  import Spinner from "../uiLibrary/Spinner.svelte";
  import Task from "./Task.svelte";
  import { fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import NoCompleteTaskSVG from "../assets/no-complete-task.svg";
  import NoPendingTaskSVG from "../assets/no-pending-task.svg";
  import ErrorTaskSVG from "../assets/error-task.svg";

  let description: string | null = null;
  let tasks: TaskType[] | null = null;
  let isAddingTask = false;
  let tasksToDisplay: TasksToDisplayEnum = TasksToDisplayEnum.PENDING;
  let isLoadingTasks = false;
  let errorFetchingTasks = false;
  let controller: AbortController | null = null;

  const getTasks = async () => {
    isLoadingTasks = true;
    controller?.abort();
    controller = new AbortController();
    try {
      const response = await fetchTasks(
        tasksToDisplay === TasksToDisplayEnum.COMPLETED,
        controller.signal
      );
      if (response.status === 200) {
        const data = response.data;
        if (data.length > 0) {
          tasks = data;
        } else {
          tasks = null;
        }
        errorFetchingTasks = false;
      } else {
        toast.set({
          message: "Something went wrong!",
          severity: "error",
        });
        errorFetchingTasks = true;
      }
    } catch (err) {
      if (err.name === "CanceledError") {
        return;
      }
      errorFetchingTasks = true;
    }
    isLoadingTasks = false;
  };

  const taskHandler = async () => {
    if (isAddingTask) {
      return;
    }
    isAddingTask = true;
    try {
      const response = await addTask({ description });
      if (response.status === 201) {
        if (tasks) {
          tasks.push(response.data);
          tasks = tasks;
        } else {
          tasks = [response.data];
        }
        description = null;
      } else {
        toast.set({
          message: "Something went wrong!",
          severity: "error",
        });
      }
    } catch (err) {
      let message: string = "Something went wrong!";
      if (err.response.status === 400) {
        message = "Task cannot be empty";
      }
      toast.set({
        message,
        severity: "error",
      });
    }
    isAddingTask = false;
  };

  $: tasksToDisplay, getTasks();
</script>

<h1>
  {tasksToDisplay === TasksToDisplayEnum.PENDING
    ? "Let's tackle these tasks"
    : "Your accomplishments"}
</h1>

<form on:submit|preventDefault={taskHandler}>
  <input
    type="text"
    placeholder="Enter a task"
    bind:value={description}
    disabled={isAddingTask}
  />
  <button disabled={!description}>
    {#if isAddingTask}
      <Spinner />
    {:else}
      Add Task
    {/if}
  </button>
</form>

<div class="nav-btns">
  <button
    class="secondary-btn {tasksToDisplay === TasksToDisplayEnum.PENDING
      ? 'active'
      : ''}"
    on:click={() => (tasksToDisplay = TasksToDisplayEnum.PENDING)}
    >Pending Tasks</button
  >
  <button
    class="secondary-btn {tasksToDisplay === TasksToDisplayEnum.COMPLETED
      ? 'active'
      : ''}"
    on:click={() => (tasksToDisplay = TasksToDisplayEnum.COMPLETED)}
    >Completed tasks</button
  >
</div>

<div class="list-container">
  {#if isLoadingTasks}
    <div class="no-tasks-container"><Spinner size="lg" /></div>
  {:else if tasks}
    {#each tasks as task (task._id)}
      <div
        class="list-item"
        in:fly={{ y: 100, duration: 500 }}
        animate:flip={{ duration: 500 }}
        out:fade={{ duration: 200 }}
      >
        <Task {task} bind:tasks />
      </div>
    {/each}
  {:else}
    <div class="no-tasks-container">
      {#if errorFetchingTasks}
        <h2>
          Oops! We encountered an issue while fetching your tasks, please try
          again later!
        </h2>
        <div class="illustration">
          <img
            src={ErrorTaskSVG}
            alt="a lady joining her hands and saying sorry"
          />
        </div>
      {:else}
        <h2>
          Looks like you don't have any {tasksToDisplay ===
          TasksToDisplayEnum.PENDING
            ? "pending"
            : "completed"} tasks!
        </h2>
        <div class="illustration">
          <img
            src={tasksToDisplay === TasksToDisplayEnum.PENDING
              ? NoPendingTaskSVG
              : NoCompleteTaskSVG}
            alt="an illustration to denote that there are no tasks"
          />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .nav-btns {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .active {
    background-color: var(--primary);
  }

  .list-container {
    height: calc(100vh - 300px);
    margin-top: 10px;
    position: relative;
  }

  .list-item {
    background-color: var(--primary);
    min-height: 6.25rem;
    font-size: 2rem;
    margin-bottom: 10px;
    border-radius: var(--border-radius);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  form {
    display: flex;
    gap: 10px;
  }

  input {
    width: 100%;
    padding-left: 10px;
  }

  input:disabled {
    background-color: rgb(228, 228, 228);
  }

  form button {
    flex-basis: 0;
  }

  .no-tasks-container {
    text-align: center;
    margin-top: 3rem;
  }

  h2 {
    text-align: center;
    width: 100%;
  }

  .illustration img {
    width: 50%;
    margin-top: 1rem;
  }

  @media (max-width: 600px) {
    .illustration img {
      width: 80%;
    }
  }
</style>
