import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Component } from 'react'

class App extends Component {
  render () {
    return (
      <div classname='App'>
        <Navigation />
        <Logo />
        <ImageLinkForm />
        <FaceRecognition />
      </div>
    );
  }
}
export default App;
