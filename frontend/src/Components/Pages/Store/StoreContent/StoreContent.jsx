import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUrl, getReq } from '../../../../Utils';
import StoreItem from './StoreItem';
import StoreMob from './StoreMob';
import StoreEffect from './StoreEffect';
import './StoreContent.scss';

const StoreContent = ({ filterTag, addItemToCart, className }) => {
  const [items, setItems] = useState([]);
  const [effects, setEffects] = useState([]);
  const [mobs, setMobs] = useState([]);

  const fetchShopItems = () => {
    getReq(`${getUrl()}/minecraft/items`)
      .then((res) => res.json())
      .then((res) => {
        setItems(res);
      })
      .catch(() => {});
    getReq(`${getUrl()}/minecraft/mobs`)
      .then((res) => res.json())
      .then((res) => {
        setMobs(res);
      })
      .catch(() => {});
    getReq(`${getUrl()}/minecraft/effects`)
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
            ...item, amount: 1, icon: `${getUrl()}/images/items/${item.id}.webp`, img: `${getUrl()}/images/items/${item.id}-full.webp`,
          })}
          key={item.id}
        />
      ))}
      {mobs.filter((mob) => !mob.disabled && (filterTag === 'all' || filterTag === 'mobs')).map((mob) => (
        <StoreMob
          mob={mob}
          addItemToCart={() => addItemToCart({
            ...mob, amount: 1, icon: `${getUrl()}/images/mobs/${mob.id}.webp`, img: `${getUrl()}/images/mobs/${mob.id}-full.webp`, type: 'mob',
          })}
          key={mob.id}
        />
      ))}
      {effects.filter((effect) => !effect.disabled && (filterTag === 'all' || filterTag === 'effects')).map((effect) => (
        <StoreEffect
          effect={effect}
          addItemToCart={() => addItemToCart({
            ...effect, time: 30, power: 0, icon: `${getUrl()}/images/effects/${effect.id}.webp`, img: `${getUrl()}/images/effects/${effect.id}-full.webp`, type: 'effect',
          })}
          key={effect.id}
        />
      ))}
      {items.filter((item) => item.disabled && (filterTag === 'all' || item.type === filterTag)).map((item) => (
        <StoreItem
          item={item}
          addItemToCart={() => addItemToCart({
            ...item, amount: 1, icon: `${getUrl()}/images/items/${item.id}.webp`, img: `${getUrl()}/images/items/${item.id}-full.webp`,
          })}
          key={item.id}
        />
      ))}
      {mobs.filter((mob) => mob.disabled && (filterTag === 'all' || filterTag === 'mobs')).map((mob) => (
        <StoreMob
          mob={mob}
          addItemToCart={() => addItemToCart({
            ...mob, amount: 1, icon: `${getUrl()}/images/mobs/${mob.id}.webp`, img: `${getUrl()}/images/mobs/${mob.id}-full.webp`, type: 'mob',
          })}
          key={mob.id}
        />
      ))}
      {effects.filter((effect) => effect.disabled && (filterTag === 'all' || filterTag === 'effects')).map((effect) => (
        <StoreEffect
          effect={effect}
          addItemToCart={() => addItemToCart({
            ...effect, time: 30, power: 0, icon: `${getUrl()}/images/effects/${effect.id}.webp`, img: `${getUrl()}/images/effects/${effect.id}-full.webp`, type: 'effect',
          })}
          key={effect.id}
        />
      ))}
    </div>
  );
};

StoreContent.propTypes = {
  filterTag: PropTypes.string.isRequired,
  className: PropTypes.string,
  addItemToCart: PropTypes.func.isRequired,
};

StoreContent.defaultProps = {
  className: null,
};

export default StoreContent;
