import React, { Component } from 'react';

class All extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: this.props.items
        }

        this.filter = this.filter.bind(this);
    }

    filter(){
        this.setState({items: []});
    }
    render(){
        const Items = ({items}) => (
            <>
              {items.map(item => (
                <div className="item" key={item.id}>
                    <div className="itemImgBox">
                        <img className="itemImg" src="imgPath" alt={item.name}></img>
                        <h4 className="itemPrice">${item.price}</h4>
                    </div>
                    <div className="itemDescBox">
                        <p className="itemDesc">{item.description}</p>
                        <button className="shopButton"></button>
                    </div>
                </div>
              ))}
            </>
        ); 
        
        return(
            <div className="AllItems">
                <Items items={this.state.items} />
                <button onClick={this.filter}></button>
            </div>
        );
    }

    componentDidMount(){

    }
}

export default All;