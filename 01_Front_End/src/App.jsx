import { useState } from 'react'
import './App.css'
import { Component } from 'react'
import Navigation from './Components/Navigation/Navigation.jsx'


class App extends Component {
  render () {
    return (
      <div classname='App'>
        <Navigation />
        {/* <Logo />
        <ImageLinkForm />
        <FaceRecognition /> */}
      </div>
    );
  }
}
export default App;
