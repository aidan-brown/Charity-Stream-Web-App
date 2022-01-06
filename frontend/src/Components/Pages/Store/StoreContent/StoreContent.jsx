import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BACKENDURL } from '../../../App/constants';
import StoreItem from './StoreItem';
import StoreMob from './StoreMob';
import StoreEffect from './StoreEffect';
import './StoreContent.css';

const StoreContent = ({ filterTag, addItemToCart }) => {
  const [items, setItems] = useState([]);
  const [effects, setEffects] = useState([]);
  const [mobs, setMobs] = useState([]);

  const fetchShopItems = () => {
    fetch(`${BACKENDURL}/items`)
      .then((res) => res.json())
      .then((res) => {
        setItems(res);
      })
      .catch(() => {});
    fetch(`${BACKENDURL}/mobs`)
      .then((res) => res.json())
      .then((res) => {
        setMobs(res);
      })
      .catch(() => {});
    fetch(`${BACKENDURL}/effects`)
      .then((res) => res.json())
      .then((res) => {
        setEffects(res);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchShopItems();

    const shopPoll = setInterval(fetchShopItems, 10000);
    return () => {
      clearInterval(shopPoll);
    };
  }, []);

  return (
    <div className="StoreContent">
      {items.filter((item) => item.disabled === 0 && (filterTag === 'all' || item.type === filterTag)).map((item) => (
        <StoreItem
          item={item}
          addItemToCart={() => addItemToCart({
            ...item, amount: 1, icon: `${BACKENDURL}/images/items/${item.id}.png`, img: `${BACKENDURL}/images/items/${item.id}-full.jpg`,
          })}
          key={item.id}
        />
      ))}
      {mobs.filter((mob) => mob.disabled === 0 && (filterTag === 'all' || filterTag === 'mobs')).map((mob) => (
        <StoreMob
          mob={mob}
          addItemToCart={() => addItemToCart({
            ...mob, amount: 1, icon: `${BACKENDURL}/images/mobs/${mob.id}.png`, img: `${BACKENDURL}/images/mobs/${mob.id}-full.jpg`, type: 'mob',
          })}
          key={mob.id}
        />
      ))}
      {effects.filter((effect) => effect.disabled === 0 && (filterTag === 'all' || filterTag === 'effects')).map((effect) => (
        <StoreEffect
          effect={effect}
          addItemToCart={() => addItemToCart({
            ...effect, time: 30, power: 0, icon: `${BACKENDURL}/images/effects/${effect.id}.png`, img: `${BACKENDURL}/images/effects/${effect.id}-full.jpg`, type: 'effect',
          })}
          key={effect.id}
        />
      ))}
      {items.filter((item) => item.disabled === 1 && (filterTag === 'all' || item.type === filterTag)).map((item) => (
        <StoreItem
          item={item}
          addItemToCart={() => addItemToCart({
            ...item, amount: 1, icon: `${BACKENDURL}/images/items/${item.id}.png`, img: `${BACKENDURL}/images/items/${item.id}-full.jpg`,
          })}
          key={item.id}
        />
      ))}
      {mobs.filter((mob) => mob.disabled === 1 && (filterTag === 'all' || filterTag === 'mobs')).map((mob) => (
        <StoreMob
          mob={mob}
          addItemToCart={() => addItemToCart({
            ...mob, amount: 1, icon: `${BACKENDURL}/images/mobs/${mob.id}.png`, img: `${BACKENDURL}/images/mobs/${mob.id}-full.jpg`, type: 'mob',
          })}
          key={mob.id}
        />
      ))}
      {effects.filter((effect) => effect.disabled === 1 && (filterTag === 'all' || filterTag === 'effects')).map((effect) => (
        <StoreEffect
          effect={effect}
          addItemToCart={() => addItemToCart({
            ...effect, time: 30, power: 0, icon: `${BACKENDURL}/images/effects/${effect.id}.png`, img: `${BACKENDURL}/images/effects/${effect.id}-full.jpg`, type: 'effect',
          })}
          key={effect.id}
        />
      ))}
    </div>
  );
};

StoreContent.propTypes = {
  filterTag: PropTypes.string.isRequired,
  addItemToCart: PropTypes.func.isRequired,
};

export default StoreContent;
