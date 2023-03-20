declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    "on:clickedOutside"?: (event: any) => any;
  }
}
