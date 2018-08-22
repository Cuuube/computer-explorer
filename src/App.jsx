import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// import Comp from './component/Comp.jsx';
import FileList from './component/FileList.jsx';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Computer Explorer</h1>
                </header>
                <FileList></FileList>
                
            </div>
        );
    }
}


export default App;
