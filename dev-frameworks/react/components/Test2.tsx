import React from "react";

import { useDragAndDrop } from "../../../src/react/index";

function Test2(props: { id: string; testDescription: string }) {
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

  const [parent, values, setValues, setConfig] = useDragAndDrop<
    HTMLUListElement,
    any
  >(playingCardAssets);

  const playingCards = values.map((card: { id: string; src: string }) => (
    <li className="item" key={card.id} id={props.id + "_" + card.id}>
      <img src={card.src} />
    </li>
  ));

  function addValue() {
    setValues([
      ...values,
      { id: "queen_of_spades", src: "/cards/queen_of_spades.png" },
    ]);
  }

  function disable() {
    setConfig({ disabled: true });
  }

  return (
    <>
      <h3>#{props.id}</h3>
      <h4>{props.testDescription}</h4>
      <ul id={props.id} ref={parent}>
        {playingCards}
      </ul>
      <button id={props.id + "_add_value"} onClick={addValue}>
        Add value
      </button>
      <button id={props.id + "_disable"} onClick={disable}>
        Disable
      </button>
      <span id={props.id + "_values"}>
        {values.map((x: { id: string; src: string }) => x.id).join(" ")}
      </span>
    </>
  );
}

export default Test2;
