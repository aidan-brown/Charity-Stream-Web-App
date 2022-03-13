import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import {
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
import Cart from './Cart/Cart';
import './Store.css';
import { AWSURL, JG_FUNDRAISING_ID } from '../../App/constants';

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value + 1); // update the state to force render
}

const ID_TO_INTERVAL = {
  256: 'iron_shovel',
  257: 'iron_pickaxe',
  258: 'iron_axe',
  262: 'arrow',
  261: 'bow',
  264: 'diamond',
  265: 'iron_ingot',
  266: 'gold_ingot',
  267: 'iron_sword',
  272: 'stone_sword',
  276: 'diamond_sword',
  277: 'diamond_shovel',
  278: 'diamond_pickaxe',
  279: 'diamond_axe',
  284: 'gold_shovel',
  285: 'gold_pickaxe',
  286: 'gold_axe',
  297: 'bread',
  298: 'leather_helmet',
  299: 'leather_chestplate',
  300: 'leather_leggings',
  301: 'leather_boots',
  306: 'iron_helmet',
  307: 'iron_chestplate',
  308: 'iron_leggings',
  309: 'iron_boots',
  310: 'diamond_helmet',
  311: 'diamond_chestplate',
  312: 'diamond_leggings',
  313: 'diamond_boots',
  314: 'golden_helmet',
  315: 'golden_chestplate',
  316: 'golden_leggings',
  317: 'golden_boots',
  '322-0': 'golden_apple',
  '322-1': 'golden_god_apple',
  364: 'cooked_beef',
};

/** Responsible for constructing the store page component * */
const Store = ({ selectedPlayer }) => {
  const [filterTag, setFilterTag] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [player, setPlayer] = useState(selectedPlayer);
  const [showCart, setShowCart] = useState('no');

  const storeDiv = useRef();
  const itemAddRef = useRef();

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    storeDiv.current.style.height = `${window.screen.height * 0.8}px`;

    let lsGet = localStorage.getItem('filterTag');
    if (lsGet) {
      setFilterTag(lsGet);
    }
    lsGet = localStorage.getItem('player');
    if (!selectedPlayer && lsGet) {
      setPlayer(lsGet);
    } else if (selectedPlayer === '') {
      setPlayer('fastturtle123');
    }
    lsGet = localStorage.getItem('cartItems');
    if (lsGet) {
      setCartItems(JSON.parse(lsGet));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('filterTag', filterTag);
  }, [filterTag]);
  useEffect(() => {
    localStorage.setItem('player', player);
  }, [player]);
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const removeItemFromCart = (item) => {
    const index = cartItems.indexOf(item);
    if (index < cartItems.length) {
      const tempArr = [...cartItems];
      tempArr.splice(index, 1);
      setCartItems(tempArr);
    }
  };

  const changeCartAmount = (item, change = 0) => {
    const i = cartItems.find((e) => e.displayName === item.displayName);
    if (i) {
      i.amount += change;
      if (i.amount <= 0) {
        removeItemFromCart(i);
      } else {
        forceUpdate();
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }
    }
  };

  const changeEffectPower = (item, value = 0) => {
    const i = cartItems.find((e) => e.displayName === item.displayName);
    if (i) {
      i.power = value;
      forceUpdate();
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  };

  const changeEffectTime = (item, value = 30) => {
    const i = cartItems.find((e) => e.displayName === item.displayName);
    if (i) {
      i.time = value;
      forceUpdate();
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      // eslint-disable-next-line no-mixed-operators
      if (!('power' in item)) { total += (item.amount * item.price); } else { total += ((item.power + 1) * (item.time / 30 * item.price)); }
    });
    return total;
  };

  const addItemToCart = (item) => {
    if (!item.disabled) {
      if (!cartItems.find((e) => e.displayName === item.displayName)) {
        setCartItems([...cartItems, item]);
      } else if (!('power' in item)) {
        changeCartAmount(item, 1);
      } else {
        const { time } = cartItems.find((e) => e.displayName === item.displayName);
        if (time < 300) {
          changeEffectTime(item, time + 30);
        }
      }

      itemAddRef.current.src = item.icon;
      itemAddRef.current.dataset.show = 'yes';
      setTimeout(() => { itemAddRef.current.dataset.show = 'no'; }, 100);
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0 || calculateTotal() < 2) return;

    let stringsObj = '';
    cartItems.forEach((cartItem, i) => {
      let stringIndividual;
      switch (cartItem.type) {
        case 'effect':
          // id, time, power
          stringIndividual = `effect-${player}-${cartItem.id}-${cartItem.time}-${cartItem.power}`;
          break;
        case 'mob':
          // id, loop, dataTags
          stringIndividual = `summon-${player}-${cartItem.id}-${cartItem.amount}-${cartItem.optionalDataTag}`;
          break;
        default:
          // id, amount (items)
          stringIndividual = `give-${player}-${ID_TO_INTERVAL[cartItem.id]}-${cartItem.amount}-1`;
          break;
      }

      if (i !== cartItems.length - 1) stringIndividual += ',';

      stringsObj += stringIndividual;
    });

    const JGURL = `http://link.justgiving.com/v1/fundraisingpage/donate/pageId/${
      JG_FUNDRAISING_ID
    }?amount=${
      calculateTotal()
    }&currency=USD&reference=bbcsh&message={jsonPOST}{jsonBlock:${
      stringsObj}}`;

    fetch(AWSURL, {
      method: 'POST',
      body: JSON.stringify({
        jsonBlock: stringsObj,
      }),
    });

    window.open(JGURL, '_blank');
  };

  const toggleCartMenu = () => {
    setShowCart(showCart === 'yes' ? 'no' : 'yes');
  };

  return (
    <div className="Store">
      <button type="button" className="bg-csh-tertiary toggle-cart" onClick={toggleCartMenu} data-showcart={showCart}><span className="material-icons">{showCart === 'yes' ? 'arrow_back' : 'shopping_cart'}</span></button>
      <img className="cart-add-item" ref={itemAddRef} src="" alt="item added to cart" data-show="no" />
      <Cart
        player={player}
        setPlayer={setPlayer}
        cartItems={cartItems}
        changeCartAmount={changeCartAmount}
        changeEffectPower={changeEffectPower}
        changeEffectTime={changeEffectTime}
        removeFromCart={removeItemFromCart}
        proceedToCheckout={proceedToCheckout}
        showCart={showCart}
        calculateTotal={calculateTotal}
      />
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
        </nav>
        <div className="store-content">
          <StoreContent filterTag={filterTag} addItemToCart={addItemToCart} />
        </div>
      </div>
    </div>
  );
};

Store.propTypes = {
  selectedPlayer: PropTypes.string.isRequired,
};

export default Store;
