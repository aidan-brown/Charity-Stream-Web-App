import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import {
  Stream, Store, AdminPanel, Landing,
} from '../Pages';
import Cart from '../Pages/Store/Cart/Cart';
import { msToTime, postReq, useForceUpdate } from '../../Utils';
import { BACKENDURL } from './constants';
// import PlayerData from '../PlayerData';

const App = () => {
  const streamDate = new Date('April 8, 2022 19:00:00');
  const [remainingTime, setRemainingTime] = useState(streamDate - Date.now());
  const [cartItems, setCartItems] = useState([]);
  const [player, setPlayer] = useState('');
  const [showCart, setShowCart] = useState('no');

  const itemAddRef = useRef();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    let lsGet = localStorage.getItem('player');
    if (!player && lsGet) {
      setPlayer(lsGet);
    } else if (player === '') {
      setPlayer('yakman3');
    }
    lsGet = localStorage.getItem('cartItems');
    if (lsGet) {
      setCartItems(JSON.parse(lsGet));
    }
  }, []);

  setTimeout(() => {
    setRemainingTime(streamDate - Date.now());
  }, 1000);

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
    <BrowserRouter>
      <div className="App">
        <Navbar remainingTime={remainingTime} />
        <main className="Content">
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
          <Routes>
            <Route path="/store" element={<Store addItemToCart={addItemToCart} />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route exact path="/stream" element={<Stream setSelectedPlayer={setPlayer} addItemToCart={addItemToCart} />} />
            <Route exact path="/" element={remainingTime > 0 ? <Landing countdown={msToTime(remainingTime)} /> : <Stream setSelectedPlayer={setPlayer} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
