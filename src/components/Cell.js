import React from 'react'


export default class Cell extends React.Component{
    render(){
        return(
           
            <div className="Cell" style={{
                left: `${this.props.size*this.props.x +1}px`,
                top: `${this.props.size*this.props.y + 1}px`,
                width: `${this.props.size -1}px`,
                height: `${this.props.size-1}px`
            }}>
            
            </div>
        )
    }
}