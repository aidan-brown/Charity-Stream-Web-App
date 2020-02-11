import React, { Component } from 'react';

class All extends Component{
    render(){
        handleEvents = (array) => {
            if(array.length > 0){
             let tempArray = [];
             array.forEach(function(each){
               tempArray.push(<h1>hello {each.name}</h1>);
            })
             return tempArray;
           }
        return(
            <div className="All">
                
            </div>
        );
    }
}

export default All;