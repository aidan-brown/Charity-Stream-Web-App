import React, { Component } from 'react';
import ImageArray from '../ImageArray'

class All extends Component{
    constructor(props){
        super(props);
        this.state = {
            allItemsList: null,
            allItems: new Array()
        }

        this.renderItems = this.renderItems.bind(this);
    }

    renderItems(){
        if(this.state.allItemsList){
            this.state.allItemsList.innerHTML = '';
            this.state.allItems.forEach(item => {
                let listElement = document.createElement('div');
                listElement.className = `list-element ${item.id}`;

                let imgContainer = document.createElement('div');
                imgContainer.className = 'imgContainer';

                let imgElement = document.createElement('img');
                imgElement.className = 'imgElement';
                //imgElement.src = ImageArray.state[`${item.name}`];
                //console.log(ImageArray.state[`${item.name}`]);
                imgElement.alt = `${item.name}`;

                let priceElement = document.createElement('h4');
                priceElement.className = 'priceElement';
                priceElement.innerHTML = `${item.price}`;

                let descContainer = document.createElement('div');
                descContainer.className = 'descContainer';

                let descElement = document.createElement('p');
                descElement.className = 'descElement';
                descElement.innerHTML = `${item.description}`;

                let addElement = document.createElement('button');
                addElement.className = 'shopButton';

                imgContainer.append(imgElement);
                imgContainer.append(priceElement);

                descContainer.append(descElement);
                descContainer.append(addElement);

                listElement.append(imgContainer);
                listElement.append(descContainer);

                this.state.allItemsList.append(listElement);
            })
        }
    }

    render(){
        return (
            <ul className="allItemsList">

            </ul>
        )   
    }

    componentDidMount(){
        // Sets the items list to the div rendered above
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
    }
}

export default All