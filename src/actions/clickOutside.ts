export default function clickOutside(node: HTMLElement) {
  let initialClick = true;
  const handleClick = (e: any) => {
    if (initialClick) {
      initialClick = false;
      return;
    }
    if (!node.contains(e.target))
      node.dispatchEvent(new CustomEvent("clickedOutside"));
  };

  document.addEventListener("click", handleClick);

  return {
    destroy() {
      document.removeEventListener("click", handleClick);
    },
  };
}
