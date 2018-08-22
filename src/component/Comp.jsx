
import React, { Component } from 'react';

export default class Comp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addonValue: 0,
            baseValue: Number(this.props.base),
        };
    }
    resetState = () => {
        this.setState({
            addonValue: 0,
            baseValue: Number(this.props.base),
        })
    }
    handleClickButton() {
        return (e) => {
            this.setState((prevState, props) => ({
                baseValue: prevState.baseValue + 1,
            }))
        };
    }
    handleInput = ({ target }) => {
        this.setState({
            addonValue: Number(target.value),
        })
    }
    get value() {
        let { addonValue, baseValue } = this.state;
        return addonValue + baseValue;
    }
    render() {
        return (
            <h1>
                <p>总值为{this.value}， 基准值为{this.state.baseValue}</p>
                <input type="number" onChange={this.handleInput} value={this.state.addonValue} />
                <button onClick={this.handleClickButton()}>Click Me add base</button>
                <br />
                <button onClick={this.resetState}>Reset state</button>
            </h1>
        )
    }
}

// ReactDOM.render(
//   <Comp base={ 5 }></Comp>,
//   document.getElementById('root'),
// );
