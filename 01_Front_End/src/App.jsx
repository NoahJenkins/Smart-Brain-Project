import { useState } from 'react'
import './App.css'
import { Component } from 'react'
import Navigation from './Components/Navigation/Navigation.jsx'
import Logo from './Components/Logo/logo.jsx'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.jsx'
import Rank from './Components/Rank/Rank.jsx'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.jsx'
import SignIn from './Components/SignIn/SignIn.jsx'
import Register from './Components/Register/Register.jsx'
import 'tachyons'
import ParticlesBG from 'particles-bg'

class App extends Component {
  constructor () {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],  // Change from box to boxes (array), this will alow is to store multipel boxes (faces)
      route: 'signin', // Add this to track the current screen: 'signin', 'register', 'home'
      isSignedIn: false, // Add this to track authentication status
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // Add this method to handle route changes
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false });
      route = 'signin';
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  calculateFaceLocations = (data) => {
    if (!data || !data.outputs || !data.outputs[0].data.regions) {
      return [];
    }
    
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    // Map all regions to bounding boxes
    return data.outputs[0].data.regions.map(region => {
      const clarifaiFace = region.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    });
  };

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    if (!this.state.input) {
      console.log('Please enter an image URL');
      return;
    }
    
    console.log('click')
    
    // Call our backend instead of Clarifai directly
    fetch('http://localhost:3000/clarifai-face-detect', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        imageUrl: this.state.input
      })
    })
    .then(response => response.json())
    .then(result => {
      // Check if regions exists before trying to iterate over it
      if (result && result.outputs && result.outputs[0].data && result.outputs[0].data.regions) {
        // If we detect faces, update user's entry count
        if (this.state.user.id) {
          fetch('http://localhost:3000/image', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log);
        }

        // Use the new multi-face methods
        const boxes = this.calculateFaceLocations(result);
        this.displayFaceBoxes(boxes);
      } else {
        console.log('No faces detected in the image or invalid response structure');
        this.setState({boxes: []}); // Reset boxes to empty array
      }
    })
    .catch(error => {
      console.log('error', error);
      this.setState({boxes: []}); // Reset boxes to empty array
    });
  };

  render () {
    const { isSignedIn, imageUrl, route, boxes, user } = this.state;
    return (
      <div className='App'>
        <ParticlesBG className="particles" type="cobweb" bg={true} color="FFFFFF" />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        <Logo />
        { route === 'home'
          ? <div>
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
              route === 'register'
              ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}
export default App;
