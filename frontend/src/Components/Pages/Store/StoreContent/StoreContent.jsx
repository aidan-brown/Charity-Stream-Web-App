/* eslint-disable react/forbid-prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import StoreItem from './StoreItem';
import StoreMob from './StoreMob';
import StoreEffect from './StoreEffect';
import {
  getMinecraftEffects,
  getMinecraftItems,
  getMinecraftMobs,
} from '../../../../api';
import { getApiUrl } from '../../../../Utils';
import './StoreContent.scss';

const StoreContent = ({
  filterTag, addItemToCart, className, cartItems, setCartItems,
}) => {
  const { data: { data: items = [] } = {} } = useQuery(['items'], () => getMinecraftItems());
  const { data: { data: mobs = [] } = {} } = useQuery(['mobs'], () => getMinecraftMobs());
  const { data: { data: effects = [] } = {} } = useQuery(['effects'], () => getMinecraftEffects());

  const findItem = (id, type) => {
    if (type === 'mob') {
      return mobs.find((mob) => mob.id === id);
    } if (type === 'effect') {
      return effects.find((effect) => effect.id === id);
    }
    return items.find((itm) => itm.id === id);
  };

  useEffect(() => {
    if (items.length !== 0 && mobs.length !== 0 && effects.length !== 0) {
      let updated = false;
      const newCartItems = cartItems
        .filter((item) => {
          if (findItem(item.id, item.type).disabled) updated = true;
          return !findItem(item.id, item.type).disabled;
        })
        .map((item) => {
          const itemLookup = findItem(item.id, item.type);
          if (item.priceOverride !== itemLookup.priceOverride) {
            updated = true;
            return { ...item, priceOverride: itemLookup.priceOverride };
          }
          return item;
        });

      if (updated) {
        setCartItems(newCartItems);
      }
    }
  }, [items, effects, mobs]);

  console.log(items);
  console.log(effects);
  console.log(mobs);

  return (
    <div className={`StoreContent${className ? ` ${className}` : ''}`}>
      {items.filter((item) => !item.disabled && (filterTag === 'all' || item.type === filterTag)).map((item) => (
        <StoreItem
          item={item}
          addItemToCart={() => addItemToCart({
            ...item, amount: 1, icon: `${getApiUrl()}/images/items/${item.id}.webp`, img: `${getApiUrl()}/images/items/${item.id}-full.webp`,
          })}
          key={`${item.id}-${item.type}`}
        />
      ))}
      {mobs.filter((mob) => !mob.disabled && (filterTag === 'all' || filterTag === 'mobs')).map((mob) => (
        <StoreMob
          mob={mob}
          addItemToCart={() => addItemToCart({
            ...mob, amount: 1, icon: `${getApiUrl()}/images/mobs/${mob.id}.webp`, img: `${getApiUrl()}/images/mobs/${mob.id}-full.webp`, type: 'mob',
          })}
          key={`${mob.id}`}
        />
      ))}
      {effects.filter((effect) => !effect.disabled && (filterTag === 'all' || filterTag === 'effects')).map((effect) => (
        <StoreEffect
          effect={effect}
          addItemToCart={() => addItemToCart({
            ...effect, time: 30, power: 0, icon: `${getApiUrl()}/images/effects/${effect.id}.webp`, img: `${getApiUrl()}/images/effects/${effect.id}-full.webp`, type: 'effect',
          })}
          key={`${effect.id}-effect`}
        />
      ))}
    </div>
  );
};

StoreContent.propTypes = {
  filterTag: PropTypes.string.isRequired,
  className: PropTypes.string,
  addItemToCart: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired,
  setCartItems: PropTypes.func.isRequired,
};

StoreContent.defaultProps = {
  className: null,
};

export default StoreContent;
