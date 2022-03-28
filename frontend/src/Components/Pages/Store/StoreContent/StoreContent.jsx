import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BACKENDURL } from '../../../App/constants';
import { getReq } from '../../../../Utils';
import StoreItem from './StoreItem';
import StoreMob from './StoreMob';
import StoreEffect from './StoreEffect';
import './StoreContent.scss';

const StoreContent = ({ filterTag, addItemToCart, className }) => {
  const [items, setItems] = useState([]);
  const [effects, setEffects] = useState([]);
  const [mobs, setMobs] = useState([]);

  const fetchShopItems = () => {
    getReq(`${BACKENDURL}/minecraft/items`)
      .then((res) => res.json())
      .then((res) => {
        setItems(res);
      })
      .catch(() => {});
    getReq(`${BACKENDURL}/minecraft/mobs`)
      .then((res) => res.json())
      .then((res) => {
        setMobs(res);
      })
      .catch(() => {});
    getReq(`${BACKENDURL}/minecraft/effects`)
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
    <div className={`StoreContent${className ? ` ${className}` : ''}`}>
      {items.filter((item) => !item.disabled && (filterTag === 'all' || item.type === filterTag)).map((item) => (
        <StoreItem
          item={item}
          addItemToCart={() => addItemToCart({
            ...item, amount: 1, icon: `${BACKENDURL}/images/items/${item.id}.png`, img: `${BACKENDURL}/images/items/${item.id}-full.png`,
          })}
          key={item.id}
        />
      ))}
      {mobs.filter((mob) => !mob.disabled && (filterTag === 'all' || filterTag === 'mobs')).map((mob) => (
        <StoreMob
          mob={mob}
          addItemToCart={() => addItemToCart({
            ...mob, amount: 1, icon: `${BACKENDURL}/images/mobs/${mob.id}.png`, img: `${BACKENDURL}/images/mobs/${mob.id}-full.png`, type: 'mob',
          })}
          key={mob.id}
        />
      ))}
      {effects.filter((effect) => !effect.disabled && (filterTag === 'all' || filterTag === 'effects')).map((effect) => (
        <StoreEffect
          effect={effect}
          addItemToCart={() => addItemToCart({
            ...effect, time: 30, power: 0, icon: `${BACKENDURL}/images/effects/${effect.id}.png`, img: `${BACKENDURL}/images/effects/${effect.id}-full.png`, type: 'effect',
          })}
          key={effect.id}
        />
      ))}
      {items.filter((item) => item.disabled && (filterTag === 'all' || item.type === filterTag)).map((item) => (
        <StoreItem
          item={item}
          addItemToCart={() => addItemToCart({
            ...item, amount: 1, icon: `${BACKENDURL}/images/items/${item.id}.png`, img: `${BACKENDURL}/images/items/${item.id}-full.png`,
          })}
          key={item.id}
        />
      ))}
      {mobs.filter((mob) => mob.disabled && (filterTag === 'all' || filterTag === 'mobs')).map((mob) => (
        <StoreMob
          mob={mob}
          addItemToCart={() => addItemToCart({
            ...mob, amount: 1, icon: `${BACKENDURL}/images/mobs/${mob.id}.png`, img: `${BACKENDURL}/images/mobs/${mob.id}-full.png`, type: 'mob',
          })}
          key={mob.id}
        />
      ))}
      {effects.filter((effect) => effect.disabled && (filterTag === 'all' || filterTag === 'effects')).map((effect) => (
        <StoreEffect
          effect={effect}
          addItemToCart={() => addItemToCart({
            ...effect, time: 30, power: 0, icon: `${BACKENDURL}/images/effects/${effect.id}.png`, img: `${BACKENDURL}/images/effects/${effect.id}-full.png`, type: 'effect',
          })}
          key={effect.id}
        />
      ))}
    </div>
  );
};

StoreContent.propTypes = {
  filterTag: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  addItemToCart: PropTypes.func.isRequired,
};

export default StoreContent;
