import React from "react";

import { useState, useEffect } from "react";

import { dragAndDrop } from "../../../src/react/index";

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
    {
      id: "queen_of_spades",
      src: "/cards/queen_of_spades.png",
    },
  ];

  const [values, setValues] = useState(playingCardAssets);

  const listRef = React.useRef(null);

  const playingCards = values.map((card: { id: string; src: string }) => (
    <li className="item" key={card.id} id={props.id + "_" + card.id}>
      <img src={card.src} />
    </li>
  ));

  useEffect(() => {
    dragAndDrop({
      parent: listRef,
      state: [values, setValues],
    });
  }, []);

  return (
    <>
      <h3>#{props.id}</h3>
      <h4>{props.testDescription}</h4>
      <ul id={props.id} ref={listRef}>
        {playingCards}
      </ul>
      <span id={props.id + "_values"}>
        {values.map((x: { id: string; src: string }) => x.id).join(" ")}
      </span>
    </>
  );
}

export default Test2;
