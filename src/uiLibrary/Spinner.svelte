<script lang="ts">
  export let size: "sm" | "lg" = "sm";
</script>

<div
  class="lds-ring"
  style:width={size === "sm" ? "16px" : "40px"}
  style:height={size === "sm" ? "16px" : "40px"}
>
  <div
    style:width={size === "sm" ? "20px" : "40px"}
    style:height={size === "sm" ? "20px" : "40px"}
  />
  <div
    style:width={size === "sm" ? "20px" : "40px"}
    style:height={size === "sm" ? "20px" : "40px"}
  />
  <div
    style:width={size === "sm" ? "20px" : "40px"}
    style:height={size === "sm" ? "20px" : "40px"}
  />
  <div
    style:width={size === "sm" ? "20px" : "40px"}
    style:height={size === "sm" ? "20px" : "40px"}
  />
</div>

<style>
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 1rem;
    height: 1rem;
  }
  .lds-ring div {
    display: block;
    position: absolute;
    width: 1.3rem;
    height: 1.3rem;
    margin: 1px;
    border: 2px solid #fff;
    border-radius: 100px;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.15s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.1s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.05s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
