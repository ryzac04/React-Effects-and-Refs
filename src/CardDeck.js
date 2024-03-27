import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardDeck = () => {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNewDeck();
  }, []);

  const fetchNewDeck = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const data = response.data;
      setDeckId(data.deck_id);
      setRemaining(data.remaining);
      setCards([]);
    } catch (error) {
      console.error('Error creating new deck:', error);
    } finally {
      setLoading(false);
    }
  };

  const drawCard = async () => {
    if (remaining === 0) {
      alert('Error: no cards remaining!');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      const data = response.data;
      if (data.success) {
        setCards([...cards, data.cards[0]]);
        setRemaining(data.remaining);
      } else {
        alert('Error drawing card. Please try again.');
      }
    } catch (error) {
      console.error('Error drawing card:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleDeck = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      const data = response.data;
      setRemaining(data.remaining);
      setCards([]);
      alert('Deck shuffled successfully!');
    } catch (error) {
      console.error('Error shuffling deck:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <button onClick={fetchNewDeck} disabled={loading}>
          {loading ? 'Loading...' : 'New Deck'}
        </button>
        <button onClick={shuffleDeck} disabled={loading}>
          {loading ? 'Shuffling...' : 'Shuffle Deck'}
        </button>
        <hr />
      </div>
      {deckId && (
        <div>
          <p>Cards Remaining: {remaining}</p>
          <button onClick={drawCard} disabled={remaining === 0 || loading}>
            Draw Card
          </button>
          <div>
            {cards.map((card, index) => (
              <img
                key={index}
                src={card.image}
                alt={`${card.value} of ${card.suit}`}
                style={{ width: '100px', margin: '5px' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDeck;