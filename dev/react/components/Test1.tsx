import React from "react";

import { useState, useEffect } from "react";

import { dragAndDrop } from "../../../src/react/index";

function Test1(props: { id: string; testDescription: string }) {
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

  useEffect(() => {
    const el = document.getElementById(props.id);

    if (!(el instanceof HTMLElement)) return;

    dragAndDrop({
      parent: el,
      values: [values, setValues],
    });
  });

  return (
    <>
      <h3>#{props.id}</h3>
      <h4>{props.testDescription}</h4>
      <ul id={props.id}>{playingCards}</ul>
    </>
  );
}

export default Test1;
