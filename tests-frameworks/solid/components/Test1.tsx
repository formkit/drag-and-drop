import { createSignal, createEffect, For } from "solid-js";

import { dragAndDrop } from "../../../src/solid/index";

function Test1(props: { id: string; testDescription: string }) {
  const playingCardAssets = [
    {
      id: "10_of_clubs",
      src: "/cards/10_of_clubs.png",
    },
    {
      id: "jack_of_hearts",
      src: "/cards/jack_of_hearts.png",
    },
  ];

  const [values, setValues] = createSignal(playingCardAssets);

  const [parent, setParent] = createSignal<HTMLElement | null>(null);

  const playingCards = (
    <For each={values()}>
      {card=>(
        <li class="item" id={props.id + "_" + card.id}>
          <img src={card.src} />
        </li>
      )}
    </For>
  )

  createEffect(() => {
    dragAndDrop({
      parent,
      state: [values, setValues],
    });
  });

  function addValue() {
    setValues([
      ...values(),
      { id: "queen_of_spades", src: "/cards/queen_of_spades.png" },
    ]);
  }

  function disable() {
    dragAndDrop({
      parent,
      state: [values, setValues],
      disabled: true,
    });
  }
  return (
    <>
      <h3>#{props.id}</h3>
      <h4>{props.testDescription}</h4>
      <ul id={props.id} ref={setParent}>
        {playingCards}
      </ul>
      <button id={props.id + "_add_value"} onClick={addValue}>
        Add value
      </button>
      <button id={props.id + "_disable"} onClick={disable}>
        Disable
      </button>
      <span id={props.id + "_values"}>
        {values().map((x: { id: string; src: string }) => x.id).join(" ")}
      </span>
    </>
  );
}

export default Test1;
