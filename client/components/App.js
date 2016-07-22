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
      gpsCollection: [],
      locationPhotos: []
    }
  }

  componentWillMount() {
    this._update();
  }

  _openInfoModal(art) {
    this.setState({
      showInfoModal: true,
      currentArt: art
    });
    //console.log(this.state.gpsCollection)
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
      return this._addressToGPS()
    })
    .then((result) => {
        this._getLocationPhotos(result)
    })
  }
  
  _fetchArt() {
    return art.getArt()
      .then((artwork) => {
        this.setState({tempCollection: artwork})
      })
  }

  _addressToGPS() {
    var results = []
    this.state.tempCollection.forEach((artwork) => {
        const address = artwork['Art Location Street Address'].replace(/ /g, '+').replace(/;/g, '+')
        if (address.length > 1){
          art.getCoords(address)
            .then((res) => {
              var place_id = null
              if (res.results[0].place_id) {
                place_id = res.results[0].place_id
              }
              var coords = {
                coords: {place_id: place_id,
                         lat: res.results[0].geometry.location.lat,
                         lng: res.results[0].geometry.location.lng}
              }
              results.push(Object.assign(artwork, coords))
            })
        }
    })
    this.setState(function(previousState, currentProps) {
      return {gpsCollection: results};
    }, function(){
      console.log('this happened!', this.state.gpsCollection)
    })
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',results)
    return results;
  }

  _getLocationPhotos(collection){
    var results = [];
    console.log('in _getLocationPhotos. collection: ', collection)
    collection.forEach((artwork) => {
      console.log('in 4 Each')
      var place_id = artwork.coords.place_id
      var width = 600
      art.getPhotos(place_id, width)
        .then((res) => {
          var photos = {
            photos: res.result.photos
          }
          console.log(photos)
          results.push(Object.assign(artwork, photos))
        })
    })
    this.setState({locationPhotos: results})
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
          gpsCollection: this.state.gpsCollection,
          locationPhotos: this.state.locationPhotos
        })}
      </div>
    )
  }
}
