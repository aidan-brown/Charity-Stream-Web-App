import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import {
  Stream, Store, AdminPanel, Landing, DonationConfirmation,
} from '../Pages';
import Cart from '../Pages/Store/Cart/Cart';
import { getUrl, postReq } from '../../Utils';
import CookieDisclaimer from '../CookieDisclaimer';

const App = () => {
  const [streamStarted, setStreamStarted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [player, setPlayer] = useState('');
  const [showCart, setShowCart] = useState('no');
  const [popup, setPopup] = useState({ closed: true });
  const [popupClosed, setPopupClosed] = useState();
  const [popupWaitInt, setPopupWaitInt] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  const itemAddRef = useRef();
  const popupRef = useRef(popup);
  const popupBlur = useRef();

  useEffect(() => {
    if (localStorage.getItem('mcs-authHeader')) setIsAdmin(true);

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

  useEffect(() => {
    localStorage.setItem('player', player);
  }, [player]);
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const focusPopup = () => popupRef.current.focus();

  useEffect(() => {
    if (popupClosed) {
      popupBlur.current.className = popupBlur.current.className.replace('on', 'off');
      popupBlur.current.removeEventListener('click', focusPopup);
      clearInterval(popupWaitInt);
      setPopupWaitInt();
      setPopupClosed();
    } else if (popupClosed !== undefined) {
      popupBlur.current.className = popupBlur.current.className.replace('off', 'on');
      popupBlur.current.addEventListener('click', focusPopup);
      if (!popupWaitInt) {
        setPopupWaitInt(setInterval(() => {
          if (popupRef.current.closed) {
            setPopupClosed(true);
          }
        }, 1000));
      }
    }
  }, [popupClosed]);

  const removeItemFromCart = (index) => () => {
    setCartItems([...cartItems.slice(0, index), ...cartItems.slice(index + 1)]);
  };

  const changeCartAmount = (i) => (change = 0) => {
    if (cartItems[i].amount + change <= 0) {
      removeItemFromCart(i);
    } else {
      setCartItems(cartItems.map((itm, j) => (
        i === j
          ? { ...itm, amount: itm.amount + change }
          : itm
      )));
    }
  };

  const changeEffectPower = (i) => (power = 0) => {
    setCartItems(cartItems.map((itm, j) => (i === j ? { ...itm, power } : itm)));
  };

  const changeEffectTime = (i) => (time = 30) => {
    setCartItems(cartItems.map((itm, j) => (i === j ? { ...itm, time } : itm)));
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
      const i = cartItems.findIndex((e) => e.displayName === item.displayName);
      if (i < 0) {
        setCartItems([...cartItems, item]);
      } else if (!('power' in item)) {
        changeCartAmount(i)(1);
      } else {
        const { time } = cartItems.find((e) => e.displayName === item.displayName);
        if (time < 120) {
          changeEffectTime(i)(time + 15);
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

    postReq(`${getUrl()}/verify-checkout`, JSON.stringify(reqJSON))
      .then((res) => res.text())
      .then((JG_URL) => {
        setCartItems([]);
        setPopupClosed(false);
        const newPopup = window.open(JG_URL, 'targetWindow',
          `popup,
          width=483,
          height=680,
          left=${(window.screen.width / 2) - 241.5},
          top=${(window.screen.height / 2) - 340},
        `);
        popupRef.current = newPopup;
        setPopup(newPopup);
      });
  };

  const toggleCartMenu = () => {
    setShowCart(showCart === 'yes' ? 'no' : 'yes');
  };

  const CartComponents = () => (
    <span>
      <button type="button" className="bg-csh-tertiary toggle-cart " onClick={toggleCartMenu} data-showcart={showCart}><span className="material-icons">{showCart === 'yes' ? 'arrow_back' : 'shopping_cart'}</span></button>
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
    </span>
  );

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar isAdmin={isAdmin} streamStarted={streamStarted} />
        <main className="Content">
          <Routes>
            <Route
              exact
              path="/stream"
              element={(
                <span>
                  {CartComponents()}
                  <Stream setSelectedPlayer={setPlayer} addItemToCart={addItemToCart} />
                </span>
            )}
            />
            <Route
              path="/store"
              element={(
                <span>
                  {CartComponents()}
                  <Store addItemToCart={addItemToCart} />
                </span>
            )}
            />
            <Route path="/donation-confirmation/:donationID/:checkoutID" element={<DonationConfirmation />} />
            <Route path="/admin-panel" element={<AdminPanel setIsAdmin={setIsAdmin} />} />
            <Route
              exact
              path="/"
              element={!streamStarted ? <Landing setStreamStarted={setStreamStarted} /> : (
                <span>
                  {CartComponents()}
                  <Stream setSelectedPlayer={setPlayer} addItemToCart={addItemToCart} />
                </span>
              )}
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <span className="popup-blur off" ref={popupBlur}>
        <p className="popup-message bg-csh-secondary">
          Please continue in the new window
          <br />
          Click here if it hasn&apos;t popped up
        </p>
      </span>
      <CookieDisclaimer />
    </BrowserRouter>
  );
};

export default App;
