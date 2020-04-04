import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import All from './StoreTabs/All';
import { connect } from 'react-redux'

class StoreLanding extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let itemList = this.props.items.map(item=>{
            return(
                <div className="item" key={item.id}>
                    <div className="itemImgBox">
                        <img className="itemImg" src={item.img} alt={item.name}></img>
                        <h4 className="itemPrice">${item.price}</h4>
                    </div>
                    <div className="itemDescBox">
                        <p className="itemDesc">{item.description}</p>
                        <button className="shopButton"></button>
                    </div>
                </div>
            )
        })
        return(
            <div className="container">
                <h3 className="center">Our items</h3>
                <div className="box">
                    {itemList}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        items: state.items
         }
    }

export default connect(mapStateToProps)(StoreLanding)