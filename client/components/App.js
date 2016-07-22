import React from 'react';
import * as art from '../models/art';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tempCollection: [],
      artCollection: [],
      showInfoModal: false,
      currentArt: null,
      gpsCollection: []

    }
  }

  componentDidMount() {
    this._update();
  }

  _openInfoModal(art) {
    this.setState({
      showInfoModal: true,
      currentArt: art
    });
  }

  _closeInfoModal() {
    this.setState({showInfoModal: false});
    this.setState({currentArt: null})
  }

  _update() {
    this._fetchArt()
    .then(() => {
      this._getLikes()
    })
    .then(() => {
      this._addressToGPS()
    })
  }
  
  _fetchArt() {
    return art.getArt()
      .then((artwork) => {
        this.setState({tempCollection: artwork})
      })
  }

  // loop through temp collection
  // for each artwork, address = modified address of that artwork
  // fetch coords using that address
  // push result
  _addressToGPS() {
    var results = []
    this.state.tempCollection.forEach((artwork) => {
        const address = artwork['Art Location Street Address'].replace(/ /g, '+').replace(/;/g, '+')
        if (address.length > 1){
          //do fetch request
          art.getCoords(address)
            .then((res) => {
              var coords = {
                coords: {lat: res.results[0].geometry.location.lat,
                         lng: res.results[0].geometry.location.lng}
              }
              results.push(Object.assign(artwork, coords))
            })
          // when whole collection is complete, set state of gpscollection to results
        }
    })
    this.setState({gpsCollection: results})
  }

  _getLikes() {
    var results = [];
    this.state.tempCollection.forEach((artWork) => {
      art.getLikes(artWork._id)
      .then((likeCount) => {
        results.push(Object.assign(artWork, {likeCount: likeCount.likeCount}))
        if (results.length === this.state.tempCollection.length) {
          this.setState({artCollection: results})
        }
      })
    })
    return;
  }

  _updateCurrentArt(likes) {
    this.setState({currentArt: Object.assign(this.state.currentArt, {likeCount: likes.likeCount})})
  }


  render(){
    //pass down props from App component to each of its routed children
    return (
      <div>
        {this.props.children && React.cloneElement(this.props.children, {
          gallery: this.state.artCollection,
          updateCurrentArt: this._updateCurrentArt.bind(this),
          currentArt: this.state.currentArt,
          showInfoModal: this.state.showInfoModal,
          openInfoModal: this._openInfoModal.bind(this),
          closeInfoModal: this._closeInfoModal.bind(this),
          gpsCollection: this.state.gpsCollection
        })}
      </div>
    )
  }
}
