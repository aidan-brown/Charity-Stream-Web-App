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
import { useSearchParams } from 'react-router-dom';
import { postReq } from '../../../Utils';
import StoreContent from './StoreContent/StoreContent';
import Cart from './Cart/Cart';
import './Store.scss';
import { BACKENDURL } from '../../App/constants';

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value + 1); // update the state to force render
}

/** Responsible for constructing the store page component * */
const Store = ({ selectedPlayer }) => {
  const [filterTag, setFilterTag] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [player, setPlayer] = useState(selectedPlayer);
  const [showCart, setShowCart] = useState('no');
  const [searchParams, setSearchParams] = useSearchParams();

  const storeDiv = useRef();
  const itemAddRef = useRef();
  const forceUpdate = useForceUpdate();

  const donationID = searchParams.get('donationId');
  const checkoutID = searchParams.get('checkoutId');

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

    if (donationID && checkoutID) {
      const reqJSON = {
        donationID,
        checkoutID,
      };
      fetch(`${BACKENDURL}/verify-donation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqJSON),
      })
        .then(() => setSearchParams());
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

    const reqJSON = {
      cart: cartItems,
      username: player,
    };

    postReq(`${BACKENDURL}/verify-checkout`, JSON.stringify(reqJSON))
      .then((res) => res.text())
      .then((JG_URL) => {
        setCartItems([]);
        window.location.replace(JG_URL);
      });
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
