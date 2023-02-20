/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import {
  mdiFlask,
  mdiFoodDrumstick,
  mdiPickaxe,
  mdiSack,
  mdiScriptText,
  mdiShield,
  mdiSkull,
  mdiSwordCross,
  mdiWizardHat,
} from '@mdi/js';
import StoreContent from './StoreContent/StoreContent';
import './Store.scss';

/** Responsible for constructing the store page component * */
const Store = ({ addItemToCart, cartItems, setCartItems }) => {
  const [filterTag, setFilterTag] = useState('ALL');

  const storeDiv = useRef();

  useEffect(() => {
    const lsGet = localStorage.getItem('mcs-filterTag');
    if (lsGet) {
      setFilterTag(lsGet);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mcs-filterTag', filterTag);
  }, [filterTag]);

  return (
    <div className="Store">
      <div className="store-window" ref={storeDiv}>
        <nav className="store-nav bg-csh-secondary-gradient">
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('ALL')} id="store-all" className="store-link" onClick={() => setFilterTag('ALL')}>
            <Icon path={mdiScriptText} />
            <p>All</p>
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('TOOL')} id="a-tools" className="store-link" onClick={() => setFilterTag('TOOL')}>
            <Icon path={mdiPickaxe} />
            <p>Tools</p>
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('WEAPON')} id="a-weapons" className="store-link" onClick={() => setFilterTag('WEAPON')}>
            <Icon path={mdiSwordCross} />
            <p>Weapons</p>
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('ARMOR')} id="a-armor" className="store-link" onClick={() => setFilterTag('ARMOR')}>
            <Icon path={mdiShield} />
            <p>Armor</p>
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('FOOD')} id="a-food" className="store-link" onClick={() => setFilterTag('FOOD')}>
            <Icon path={mdiFoodDrumstick} />
            <p>Food</p>
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('MATERIAL')} id="a-materials" className="store-link" onClick={() => setFilterTag('MATERIAL')}>
            <Icon path={mdiSack} />
            <p>Materials</p>
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('EFFECT')} id="a-effects" className="store-link" onClick={() => setFilterTag('EFFECT')}>
            <Icon path={mdiWizardHat} />
            <p>Effects</p>
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('MOB')} id="a-mobs" className="store-link" onClick={() => setFilterTag('MOB')}>
            <Icon path={mdiSkull} />
            <p>Mobs</p>
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('MISC')} id="a-misc" className="store-link" onClick={() => setFilterTag('MISC')}>
            <Icon path={mdiFlask} />
            <p>Misc</p>
          </span>
        </nav>
        <div className="store-content">
          <StoreContent
            filterTag={filterTag}
            addItemToCart={addItemToCart}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        </div>
      </div>
    </div>
  );
};

Store.propTypes = {
  addItemToCart: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired,
  setCartItems: PropTypes.func.isRequired,
};

export default Store;
