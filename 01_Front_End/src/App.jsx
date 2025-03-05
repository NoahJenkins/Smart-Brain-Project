import { useState } from 'react'
import './App.css'
import { Component } from 'react'
import Navigation from './Components/Navigation/Navigation.jsx'
import Logo from './Components/Logo/logo.jsx'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.jsx'
import Rank from './Components/Rank/Rank.jsx'
import 'tachyons'
import ParticlesBG from 'particles-bg'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <ParticlesBG className="particles" type="cobweb" bg={true} color="FFFFFF" />
        <Navigation />
        <Logo />
        <Rank/>
        <ImageLinkForm />
        {/* <FaceRecognition /> */}
      </div>
    );
  }
}
export default App;
