import { reactive, html } from "https://esm.sh/@arrow-js/core";

import { initParent } from "../src/index";

const state = reactive({
  playingCards: [
    "/cards/10_of_clubs.png",
    "/cards/jack_of_hearts.png",
    "/cards/queen_of_spades.png",
    "/cards/king_of_diamonds.png",
    "/cards/ace_of_clubs.png",
  ],
});

const vanillaApp = document.getElementById("app-vanilla");

html`<ul id="parent_vanilla">
  ${() =>
    state.playingCards.map((x: string) =>
      html`<li id="palying_cards_vanilla_1'" class="item">
        <img src="${x}" />
      </li>`.key(x)
    )}
</ul>`(vanillaApp);

const parent = document.getElementById("parent_vanilla");

if (!(parent instanceof HTMLElement)) throw new Error("Invalid parent element");

initParent({
  parent,
  getValues: () => state.playingCards,
  setValues: (parent, newValues) => {
    state.playingCards = newValues;
  },
});
