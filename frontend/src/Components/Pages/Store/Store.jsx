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
const Store = ({ addItemToCart }) => {
  const [filterTag, setFilterTag] = useState('all');

  const storeDiv = useRef();

  useEffect(() => {
    const lsGet = localStorage.getItem('filterTag');
    if (lsGet) {
      setFilterTag(lsGet);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('filterTag', filterTag);
  }, [filterTag]);

  return (
    <div className="Store">
      <div className="store-window" ref={storeDiv}>
        <nav className="store-nav bg-csh-secondary-gradient">
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('all')} id="store-all" className="store-link" onClick={() => setFilterTag('all')}>
            <Icon path={mdiScriptText} />
            All
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('tool')} id="a-tools" className="store-link" onClick={() => setFilterTag('tool')}>
            <Icon path={mdiPickaxe} />
            Tools
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('weapon')} id="a-weapons" className="store-link" onClick={() => setFilterTag('weapon')}>
            <Icon path={mdiSwordCross} />
            Weapons
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('armor')} id="a-armor" className="store-link" onClick={() => setFilterTag('armor')}>
            <Icon path={mdiShield} />
            Armor
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('food')} id="a-food" className="store-link" onClick={() => setFilterTag('food')}>
            <Icon path={mdiFoodDrumstick} />
            Food
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('material')} id="a-materials" className="store-link" onClick={() => setFilterTag('material')}>
            <Icon path={mdiSack} />
            Materials
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('effects')} id="a-effects" className="store-link" onClick={() => setFilterTag('effects')}>
            <Icon path={mdiWizardHat} />
            Effects
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('mobs')} id="a-mobs" className="store-link" onClick={() => setFilterTag('mobs')}>
            <Icon path={mdiSkull} />
            Mobs
          </span>
          <span tabIndex={0} role="button" onKeyDown={() => setFilterTag('misc')} id="a-misc" className="store-link" onClick={() => setFilterTag('misc')}>
            <Icon path={mdiFlask} />
            Misc
          </span>
        </nav>
        <div className="store-content">
          <StoreContent filterTag={filterTag} addItemToCart={addItemToCart} />
        </div>
      </div>
    </div>
  );
};

Store.propTypes = {
  addItemToCart: PropTypes.func.isRequired,
};

export default Store;
