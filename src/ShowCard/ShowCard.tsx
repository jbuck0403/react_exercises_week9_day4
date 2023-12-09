import { useEffect, useState } from "react";
import GetCard from "./GetCard";
import "./ShowCard.css";

const cardFinder = new GetCard();

const ShowCard = () => {
  const [classes, setClasses] = useState<string[]>([]);
  const [cardsToShow, setCardsToShow] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTimer, setSearchTimer] = useState<number | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setClasses(await cardFinder.classes());
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const timerID = setTimeout(() => {
      const searchCards = async () => {
        if (searchInput == "") {
          setCardsToShow([]);
        } else setCardsToShow(await cardFinder.cardSearch(searchInput));
      };

      searchCards();
    }, 1500);

    setSearchTimer(timerID);
  }, [searchInput]);

  const fetchClassCards = async (className: string) => {
    const classCards: string[] = await cardFinder.allCardsByClass(className);

    setCardsToShow(classCards);
  };

  const displayClasses = () => {
    return classes.map((className, idx) => {
      return (
        <div
          key={`class${idx}`}
          onClick={() => fetchClassCards(className)}
          className="class-list"
        >
          {className}
        </div>
      );
    });
  };

  const displayCards = () => {
    return cardsToShow.map((card, idx) => {
      return <img src={card} key={`card${idx}`} className="card" />;
    });
  };

  return (
    <>
      <div className="card-lookup-container">
        <div className="class-container">{displayClasses()}</div>
        <form
          className="input-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="input-field">
            <input
              type="text"
              id="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search all cards..."
            />
          </div>
        </form>
        <div className="displayed-cards-container">
          {cardsToShow.length > 0 ? displayCards() : "Nothing to see here..."}
        </div>
      </div>
    </>
  );
};
export default ShowCard;
