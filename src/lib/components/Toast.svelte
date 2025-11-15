<script lang="ts">
  import { onMount } from 'svelte';

  export let message: string;
  export let duration: number = 3000;
  export let onClose: () => void = () => {};

  let visible = false;

  onMount(() => {
    visible = true;
    const timer = setTimeout(() => {
      visible = false;
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  });
</script>

<div
  class="fixed bottom-4 right-4 z-50 transition-all duration-300"
  class:opacity-0={!visible}
  class:translate-y-2={!visible}
  class:opacity-100={visible}
  class:translate-y-0={visible}
>
  <div class="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>{message}</span>
  </div>
</div>
