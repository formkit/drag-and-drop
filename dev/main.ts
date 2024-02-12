import { reactive, html } from "https://esm.sh/@arrow-js/core";

import { dragAndDrop } from "../src/index";

const state = reactive({
  playingCards: [
    {
      id: "10_of_clubs",
      src: "/cards/10_of_clubs.png",
    },
    {
      id: "jack_of_hearts",
      src: "/cards/jack_of_hearts.png",
    },
    {
      id: "queen_of_spades",
      src: "/cards/queen_of_spades.png",
    },
  ],
});

const vanillaApp = document.getElementById("app-vanilla");

html`<ul id="vanilla_1">
    ${() =>
      state.playingCards.map((x: { id: string; src: string }) =>
        html`<li id="vanilla_1_${x.id}" class="item">
          <img src="${x.src}" />
        </li>`.key(x)
      )}
  </ul>
  <span id="vanilla_1_values">
    ${() =>
      state.playingCards
        .map((x: { id: string; src: string }) => x.id)
        .join(" ")}
  </span>`(vanillaApp);

const parent = document.getElementById("vanilla_1");

if (!(parent instanceof HTMLElement)) throw new Error("Invalid parent element");

dragAndDrop({
  parent,
  getValues: () => state.playingCards,
  setValues: (newValues) => {
    state.playingCards = newValues;
  },
});
