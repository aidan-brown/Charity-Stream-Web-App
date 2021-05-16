import React, {useState, useEffect, useRef} from 'react';
import StoreContent from './StoreContent/StoreContent';
import Cart from './Cart/Cart';
import './Store.css';
import {JG_FUNDRAISING_ID} from '../../App/constants.js';
import Icon from '@mdi/react';
import { mdiBottleTonic, mdiFoodDrumstick, mdiPickaxe, mdiSack, mdiScriptText, mdiShield, mdiSkull, mdiSword, mdiSwordCross, mdiWizardHat } from '@mdi/js';


function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

/** Responsible for constructing the store page component **/
const Store = ({selectedPlayer}) => {
    const[filterTag, setFilterTag] = useState('all');
    const[cartItems, setCartItems] = useState([]);
    const[player, setPlayer] = useState(selectedPlayer);
    const[showCart, setShowCart] = useState('no');

    const storeDiv = useRef();
    const itemAddRef = useRef();

    const forceUpdate = useForceUpdate();

    useEffect(() => {
        storeDiv.current.style.height = `${window.screen.height * 0.8}px`;

        let lsGet = localStorage.getItem('filterTag');
        if(lsGet){
            setFilterTag(lsGet);
        }
        lsGet = localStorage.getItem('player');
        if(!selectedPlayer && lsGet){
            setPlayer(lsGet);
        } else if(selectedPlayer === ''){
            setPlayer('fastturtle123');
        }
        lsGet = localStorage.getItem('cartItems');
        if(lsGet){
            setCartItems(JSON.parse(lsGet));
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('filterTag', filterTag);
    }, [filterTag])
    useEffect(() => {
        localStorage.setItem('player', player);
    }, [player])
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems])

    const addItemToCart = (item) => {
        if(!cartItems.find(e => e.name === item.name)){
            setCartItems([...cartItems, item]);
        } else {
            if (!('power' in item)){
                changeCartAmount(item, 1);
            } else {
                let time = cartItems.find(e => e.name === item.name).time;
                if(time < 300){
                    changeEffectTime(item, time + 30);
                }
            }
        }

        itemAddRef.current.src = item.img;
        itemAddRef.current.dataset.show = 'yes';
        setTimeout(() => itemAddRef.current.dataset.show = 'no', 100)
    }

    const removeItemFromCart = (item) => {
        let index = cartItems.indexOf(item);
        if(index < cartItems.length){
            let tempArr = [...cartItems];
            tempArr.splice(index, 1);
            setCartItems(tempArr);
        } else {
            console.error('Cart: Index is out of bounds');
        }
    }

    const changeCartAmount = (item, change=0) => {
        let i = cartItems.find(e => e.name === item.name);
        if(i){
            i.amount += change;
            if(i.amount <= 0){
                removeItemFromCart(i);
            } else {
                forceUpdate();
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        } else {
            console.error("Item does not exist in cart");
        }
    } 

    const changeEffectPower = (item, value=0) => {
        let i = cartItems.find(e => e.name === item.name);
        if(i){
            i.power = value;
            forceUpdate();
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
            console.error("Item does not exist in cart");
        }
    } 

    const changeEffectTime = (item, value=30) => {
        let i = cartItems.find(e => e.name === item.name);
        if(i){
            i.time = value;
            forceUpdate();
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
            console.error("Item does not exist in cart");
        }
    } 

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            if(!('power' in item))
                total += (item.amount * item.price);
            else
                total += ((item.power + 1) * (item.time / 30 * item.price));
        });
        return total;
    }

    const proceedToCheckout = () => {
        if(cartItems.length === 0) {
            console.error("No items in cart!");
            return;
        }
        let stringsObj = "";
        for(let i = 0; i < cartItems.length; i++){
            let stringIndividual;
            switch(cartItems[i].type){
                //Need river's input on effect and mob
                /*case "effect":
                    stringIndividual = "effect-";
                    stringIndividual += player;
                    stringIndividual += "-";
                    break;*/
                case "mob":
                    stringIndividual = "summon-";
                    stringIndividual += player;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].name;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].amount;
                    break;
                default:
                    stringIndividual = "give-";
                    stringIndividual += player;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].id;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].amount;
                    stringIndividual += "-";
                    stringIndividual += "1";
                    break;
            }

            if(i !== cartItems.length - 1) stringIndividual += ",";

            console.log(stringIndividual);
            
            stringsObj += stringIndividual;
        }
        console.log(stringsObj);

        let JGURL = "http://link.justgiving.com/v1/fundraisingpage/donate/pageId/" 
            + JG_FUNDRAISING_ID
            + "?amount="
            + calculateTotal()
            + "&currency=USD&reference=bbcsh&message={jsonPOST}{jsonBlock:"
            + stringsObj + "}";

        console.log(JGURL);
    }

    const toggleCartMenu = () => {
        setShowCart(showCart === 'yes' ? 'no' : 'yes');
    }

    return(
        <div className='Store'>
            <button className='bg-csh-tertiary toggle-cart' onClick={toggleCartMenu} data-showcart={showCart}><span className='material-icons'>{showCart === 'yes' ? 'arrow_back' : 'shopping_cart'}</span></button>
            <img className='cart-add-item' ref={itemAddRef} src='' alt='item added to cart' data-show='no'></img>
            <Cart player={player} setPlayer={setPlayer} cartItems={cartItems} changeCartAmount={changeCartAmount} changeEffectPower={changeEffectPower} changeEffectTime={changeEffectTime} removeFromCart={removeItemFromCart} proceedToCheckout={proceedToCheckout} showCart={showCart} calculateTotal={calculateTotal} />
            <div className='store-window' ref={storeDiv}>
                <nav className='store-nav bg-csh-secondary-gradient'>
                    <span id='store-all' className='store-link' onClick={() => setFilterTag('all')}><Icon path={mdiScriptText}></Icon>All</span>
                    <span id='a-tools' className='store-link' onClick={() => setFilterTag('tool')}><Icon path={mdiPickaxe}></Icon>Tools</span>
                    <span id='a-weapons' className='store-link' onClick={() => setFilterTag('weapon')}><Icon path={mdiSwordCross}></Icon>Weapons</span>
                    <span id='a-armor' className='store-link' onClick={() => setFilterTag('armor')}><Icon path={mdiShield}></Icon>Armor</span>
                    <span id='a-food' className='store-link' onClick={() => setFilterTag('food')}><Icon path={mdiFoodDrumstick}></Icon>Food</span>
                    <span id='a-materials' className='store-link' onClick={() => setFilterTag('material')}><Icon path={mdiSack}></Icon>Materials</span>
                    <span id='a-effects' className='store-link' onClick={() => setFilterTag('effects')}><Icon path={mdiWizardHat}></Icon>Effects</span>
                    <span id='a-mobs' className='store-link' onClick={() => setFilterTag('mobs')}><Icon path={mdiSkull}></Icon>Mobs</span>
                </nav>
                <div className='store-content'>
                    <StoreContent filterTag={filterTag} addItemToCart={addItemToCart} />
                </div>
            </div>
        </div>
    );
}

export default Store;