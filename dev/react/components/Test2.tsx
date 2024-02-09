import React from "react";

import { useState, useEffect } from "react";

import { dragAndDrop } from "../../../src/react/index";

function Test2(props: { id: string; testDescription: string }) {
  const playingCardAssets = [
    "/cards/10_of_clubs.png",
    "/cards/jack_of_hearts.png",
    "/cards/queen_of_spades.png",
    "/cards/king_of_diamonds.png",
    "/cards/ace_of_clubs.png",
  ];

  const [values, setValues] = useState(playingCardAssets);

  const playingCards = values.map((card: string) => (
    <li className="item" key={card}>
      <img src={card} />
    </li>
  ));

  const list = React.useRef(null);

  useEffect(() => {
    dragAndDrop({
      parent: list,
      values: [values, setValues],
    });
  });

  return (
    <>
      <h3>#{props.id}</h3>
      <h4>{props.testDescription}</h4>
      <ul ref={list} id={props.id}>
        {playingCards}
      </ul>
    </>
  );
}

export default Test2;
