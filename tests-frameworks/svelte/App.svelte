<script>
  import { dragAndDrop } from "../../src/svelte/index";
  let a = $state(["10_of_clubs", "jack_of_hearts", "queen_of_spades"]);
  let b = $state(["king_of_diamonds"]);
  window.__svelteAttaches = 0;
  const counted = (att) => (el) => {
    window.__svelteAttaches++;
    return att(el);
  };
</script>

<h2>Svelte</h2>
<ul id="svelte_a" {@attach counted(dragAndDrop(() => a, (v) => (a = v), { group: "svelte" }))}>
  {#each a as card (card)}
    <li id={`svelte_${card}`} class="item">{card}</li>
  {/each}
</ul>
<ul id="svelte_b" style="min-height: 60px" {@attach dragAndDrop(() => b, (v) => (b = v), { group: "svelte" })}>
  {#each b as card (card)}
    <li id={`svelte_${card}`} class="item">{card}</li>
  {/each}
</ul>
<button id="svelte_add" onclick={() => (a = [...a, "ace_of_spades"])}>Add</button>
<span id="svelte_a_values">{a.join(" ")}</span>
<span id="svelte_b_values">{b.join(" ")}</span>
