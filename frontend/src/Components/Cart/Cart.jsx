import React, { Component } from 'react';

class Cart extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: {}
        }
    }
    render(){
        return(
            <div className="Cart">
                <ul className="allItemsList">

                </ul>
                <div className="shoppingCart">
                    
                </div>
            </div>
        )
    }
}

export default Cart;