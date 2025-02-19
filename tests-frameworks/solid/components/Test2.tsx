import { For } from "solid-js";
import { useDragAndDrop } from "../../../src/solid/index";
import { produce } from "solid-js/store";

type PlayingCard = {
  id: string;
  src: string;
};

function Test2(props: { id: string; testDescription: string }) {
  const playingCardAssets: PlayingCard[] = [
    {
      id: "10_of_clubs",
      src: "/cards/10_of_clubs.png",
    },
    {
      id: "jack_of_hearts",
      src: "/cards/jack_of_hearts.png",
    },
  ];

  const [parent, values, setValues, updateConfig] = useDragAndDrop<
    HTMLUListElement,
    PlayingCard
  >(playingCardAssets);

  const playingCards = (
    <For each={values()}>
      {(card) => (
        <li class="item" id={props.id + "_" + card.id}>
          <img src={card.src} />
        </li>
      )}
    </For>
  );

  function addValue() {
    setValues(
      produce((cards) =>
        cards.push({ id: "queen_of_spades", src: "/cards/queen_of_spades.png" })
      )
    );
  }

  function disable() {
    updateConfig({ disabled: true });
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
        {values()
          .map((x: PlayingCard) => x.id)
          .join(" ")}
      </span>
    </>
  );
}

export default Test2;
