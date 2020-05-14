//Import components
import React, { Component } from 'react';
import Cart from '../../Cart/Cart'
import './All.css'

//Import images
import arrow from '../../../images/arrow.png'
import bow from '../../../images/Bow.png'
import bread from '../../../images/Bread.png'
import diamond_axe from '../../../images/diamond_axe.png'
import diamond_boots from '../../../images/diamond_boots.png'
import diamond_leggings from '../../../images/diamond_leggings.png'
import diamond_chest from '../../../images/diamond_chestplate.png'
import diamond_helm from '../../../images/diamond_helmet.png'
import diamond_pick from '../../../images/diamond_pickaxe.png'
import diamond_shovel from '../../../images/diamond_shovel.png'
import diamond_sword from '../../../images/diamond_sword.png'
import diamond from '../../../images/diamond.png'
import gold_ingot from '../../../images/gold_ingot.png'
import golden_apple from '../../../images/golden_apple.png'
import golden_axe from '../../../images/golden_axe.png'
import golden_boots from '../../../images/golden_boots.png'
import golden_chestplate from '../../../images/golden_chestplate.png'
import golden_god_apple from '../../../images/golden_god_apple.png'
import golden_helmet from '../../../images/golden_helmet.png'
import golden_leggings from '../../../images/golden_leggings.png'
import golden_pickaxe from '../../../images/golden_pickaxe.png'
import golden_shovel from '../../../images/golden_shovel.png'
import iron_axe from '../../../images/iron_axe.png'
import iron_boots from '../../../images/iron_boots.png'
import iron_chestplate from '../../../images/iron_chestplate.png'
import iron_helmet from '../../../images/iron_helmet.png'
import iron_ingot from '../../../images/iron_ingot.png'
import iron_leggings from '../../../images/iron_leggings.png'
import iron_pickaxe from '../../../images/iron_pickaxe.png'
import iron_shovel from '../../../images/iron_shovel.png'
import iron_sword from '../../../images/iron_sword.png'
import leather_boots from '../../../images/leather_boots.png'
import leather_chestplate from '../../../images/leather_chestplate.png'
import leather_helmet from '../../../images/leather_helmet.png'
import leather_leggings from '../../../images/leather_leggings.png'
import steak from '../../../images/steak.png'
import stone_sword from '../../../images/stone_sword.png'

class All extends Component{
    constructor(props){
        super(props);
        this.state = {
            //Store items and the items in cart in state so they update
            allItemsList: null,
            allItems: new Array(),
            itemsInCartList: null,
            itemsInCart: new Array(),

            //Store the image objs in an array for easy access by item.name
            images: {
                "Bow": bow,
                "Iron Ingot": iron_ingot,
                "Gold Ingot": gold_ingot,
                "Diamond": diamond,
                "Iron Pickaxe": iron_pickaxe,
                "Gold Pickaxe": golden_pickaxe,
                "Diamond Pickaxe": diamond_pick,
                "Iron Shovel": iron_shovel,
                "Gold Shovel": golden_shovel,
                "Diamond Shovel": diamond_shovel,
                "Iron Axe": iron_axe,
                "Gold Axe": golden_axe,
                "Diamond Axe": diamond_axe,
                "Bread": bread,
                "Steak": steak,
                "Golden Apple": golden_apple,
                "Golden 'God' Apple": golden_god_apple,
                "Stone Sword": stone_sword,
                "Iron Sword": iron_sword,
                "Diamond Sword": diamond_sword,
                "10x Arrows": arrow,
                "Leather Helmet": leather_helmet,
                "Leather Chestplate": leather_chestplate,
                "Leather Leggings": leather_leggings,
                "Leather Boots": leather_boots,
                "Gold Helmet": golden_helmet,
                "Gold Chestplate": golden_chestplate,
                "Gold Leggings": golden_leggings,
                "Gold Boots": golden_boots,
                "Iron Helmet": iron_helmet,
                "Iron Chestplate": iron_chestplate,
                "Iron Leggings": iron_leggings,
                "Iron Boots": iron_boots,
                "Diamond Helmet": diamond_helm,
                "Diamond Chestplate": diamond_chest,
                "Diamond Leggings": diamond_leggings,
                "Diamond Boots": diamond_boots
            },

            //Fundraising page ID - CURRENTLY SET TO TEST PAGE
            JG_FUNDRAISING_ID: '12995533',

            //Store the player html
            allPlayersList: new Array(),
            allPlayersHtml: null, 
        }

        //Bind functions to this component for 'this.' functionality
        this.renderItems = this.renderItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.checkout = this.checkout.bind(this);
        this.renderPlayers = this.renderPlayers.bind(this);
    }

    checkout(){
        //Assemble a valid url from class variables
        let outUrl = `http://link.justgiving.com/v1/fundraisingpage/donate/pageId/` + this.state.JG_FUNDRAISING_ID;
        let idList = ``;
        let priceList = 0.0;
        let player = document.getElementById('players').value;
        if(this.state.itemsInCart){
            this.state.itemsInCart.forEach(item => {
                idList = idList + `{${item.id}}`;
                priceList += item.price;
            });
        }
        outUrl += '?amount='
        outUrl += priceList.toString();
        outUrl += '&currency=USD&reference=bbcsh&message='
        outUrl += '{user:'
        outUrl += player;
        outUrl += '}'
        outUrl += idList;

        console.log(outUrl);

        window.location = outUrl;
    }

    addToCart(item){
        //Update the state
        this.state.itemsInCart.push(item);
        console.log(`added ${item.name} to cart`);

        //Build the html based on the state
        if(this.state.itemsInCart){
            this.state.itemsInCartList.innerHTML = '';
            this.state.itemsInCart.forEach(item => {
                let listElement = document.createElement('div');
                listElement.className = `list-element-cart ${item.id}`;

                let imgElement = document.createElement('img');
                imgElement.className = `imgElementCart`;
                imgElement.src = this.state.images[`${item.name}`];
                imgElement.alt = `${item.name}`;

                let nameElement = document.createElement('p');
                nameElement.className = `nameElementCart`;
                nameElement.innerHTML = `${item.name}`;

                let priceElement = document.createElement('p');
                priceElement.className = `cartPriceElement`;
                priceElement.innerHTML = `${item.price}`;

                listElement.append(imgElement);
                listElement.append(nameElement);
                listElement.append(priceElement);

                this.state.itemsInCartList.append(listElement);
            });
        }
    }

    renderPlayers(){
        //Build the select list based on the players table
        if(this.state.allItemsList){
            this.state.allPlayersHtml.innerHTML = '';
            this.state.allPlayersList.forEach(player => {
                let playerInList = document.createElement('option');
                playerInList.id = `${player.username}`;
                playerInList.className = "playerListItem";
                playerInList.value = `${player.username}`;
                playerInList.innerHTML = `${player.name}`;

                this.state.allPlayersHtml.append(playerInList);
            })
        }
    }

    renderItems(){
        //Builds the html for each store item from the items table
        if(this.state.allItemsList){
            this.state.allItemsList.innerHTML = '';
            this.state.allItems.forEach(item => {
                let listElement = document.createElement('div');
                listElement.className = `list-element-store ${item.id}`;

                let imgContainer = document.createElement('div');
                imgContainer.className = 'imgContainer';

                let imgElement = document.createElement('img');
                imgElement.className = 'imgElement';
                imgElement.src = this.state.images[`${item.name}`];
                imgElement.alt = `${item.name}`;

                let nameElement = document.createElement('p');
                nameElement.className = `nameElement`;
                nameElement.innerHTML = `${item.name}`;

                let priceElement = document.createElement('p');
                priceElement.className = 'priceElement';
                priceElement.innerHTML = `$${item.price}`;

                let descContainer = document.createElement('div');
                descContainer.className = 'descContainer';

                let descElement = document.createElement('p');
                descElement.className = 'descElement';
                descElement.innerHTML = `${item.description}`;

                let addElement = document.createElement('p');
                addElement.className = 'shopButton';
                addElement.innerHTML = 'Add to Cart';
                addElement.onclick = () => this.addToCart(item);
                

                imgContainer.append(imgElement);
                imgContainer.append(priceElement);
                imgContainer.append(nameElement);

                descContainer.append(descElement);
                descContainer.append(addElement);

                listElement.append(imgContainer);
                listElement.append(descContainer);

                this.state.allItemsList.append(listElement);
            })
        }
    }

    render(){
        //Returns the base html skeleton to be populated by the component
        return (
            <div className="storeAll">
                <div className="titleTextBox">
                    <p className="titleText">All proceeds to charity!</p>
                </div>
                <div className="itemsWrapper">
                    <ul className="allItemsList">

                    </ul>
                    <div className="Cart">
                        <div className="itemsInCartList">
                        
                        </div>
                        <div className="checkoutPlayer">
                            <select className="playerList" id="players">

                            </select>
                        </div>
                        <div className="checkoutBtn" onClick={this.checkout}>
                            <p>Checkout</p>
                        </div>
                    </div>
                </div>
            </div>
            
        )   
    }

    componentDidMount(){

        // Sets the items list to the store items div rendered above
        this.setState({allItemsList: document.querySelector('.allItemsList')}, () => {
            // Hits the backend with a get request for all items and then renders the items when the request s complete
            let req = new XMLHttpRequest();
            req.open('get', 'http://corona.headass.house:8000/items')

            req.onload = () => {
                const response = JSON.parse(req.responseText);
                // If the response has data and a 200 code it uses that data to render all items, if not the response code is logged
                if(response.data && response.code == 200){
                    this.setState({allItems: response.data}, () => this.renderItems());
                }
                else{
                    console.error(response.code);
                }
            };

            req.send();
        })

        // Sets the cart items list to the div rendered above
        this.setState({itemsInCartList: document.querySelector('.itemsInCartList')});

        //Set up the list of players
        this.setState({allPlayersHtml: document.querySelector('.playerList')}, () => {
            // Hits the backend with a get request for all players and then renders the players when the request is complete
            let req = new XMLHttpRequest();
            req.open('get', 'http://corona.headass.house:8000/players')

            req.onload = () => {
                const response = JSON.parse(req.responseText);
                // If the response has data and a 200 code it uses that data to render all items, if not the response code is logged
                if(response.data && response.code == 200){
                    this.setState({allPlayersList: response.data}, () => this.renderPlayers());
                }
                else{
                    console.error(response.code);
                }
            };

            req.send();
        })
    }
}

export default All