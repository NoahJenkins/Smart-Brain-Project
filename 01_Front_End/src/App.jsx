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
      isSignedIn: false // Add this to track authentication status
    }
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
    const returnClarifaiRequestOptions = (imageURL) => {
      // Your PAT (Personal Access Token) can be found in the Account's Security section
      const PAT = '2cec7c9fc6be46a4a114a85bbb74d9b0';
      // Specify the correct user_id/app_id pairings
      // Since you're making inferences outside your app's scope
      const USER_ID = 'xvjbvkg3apmd';
      const APP_ID = 'my-first-application-4yrkpc';
      // Change these to whatever model and image URL you want to use
      const MODEL_ID = 'face-detection';
      const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
      const IMAGE_URL = imageURL;
      
      const raw = JSON.stringify({
          "user_app_id": {
              "user_id": USER_ID,
              "app_id": APP_ID
          },
          "inputs": [
              {
                  "data": {
                      "image": {
                          "url": IMAGE_URL
                      }
                  }
              }
          ]
      });
      
      const requestOptions = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Key ' + PAT
          },
          body: raw
      };
      
      return requestOptions
    };
    
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
      .then(response => response.json())
      .then(result => {
        // Check if regions exists before trying to iterate over it
        if (result && result.outputs && result.outputs[0].data && result.outputs[0].data.regions) {
          const regions = result.outputs[0].data.regions;
          
          regions.forEach(region => {
              // Accessing and rounding the bounding box values
              const boundingBox = region.region_info.bounding_box;
              const topRow = boundingBox.top_row.toFixed(3);
              const leftCol = boundingBox.left_col.toFixed(3);
              const bottomRow = boundingBox.bottom_row.toFixed(3);
              const rightCol = boundingBox.right_col.toFixed(3);

              region.data.concepts.forEach(concept => {
                  // Accessing and rounding the concept value
                  const name = concept.name;
                  const value = concept.value.toFixed(4);

                  console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
              });
          });

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
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className='App'>
        <ParticlesBG className="particles" type="cobweb" bg={true} color="FFFFFF" />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        <Logo />
        { route === 'home'
          ? <div>
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
              route === 'register'
              ? <Register onRouteChange={this.onRouteChange} />
              : <SignIn onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}
export default App;
