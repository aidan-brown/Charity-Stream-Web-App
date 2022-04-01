import React from 'react';
import { itemSymbols } from '../assets/images';

const ItemSymbols = (type, rating = 1, fillEmpty = false) => {
  const symbols = [];
  let count = rating;
  if (rating) {
    for (let i = 0; i < Math.floor(count / 2); i += 1) {
      symbols.push(<img key={i + type + Math.random()} src={itemSymbols[type]} alt={type} />);
    }
    if (count % 2 !== 0) symbols.push(<img key={`half-${type}${Math.random()}`} src={itemSymbols[`${type}Half`]} alt={type} />);
  }
  if (fillEmpty) {
    count = !count ? 10 : 10 - Math.ceil(count / 2);

    for (let i = 0; i < count; i += 1) {
      symbols.push(<img key={i + type + Math.random()} src={itemSymbols[`${type}Empty`]} alt={type} />);
    }
  }
  return (
    <>
      {symbols}
    </>
  );
};

export default ItemSymbols;
