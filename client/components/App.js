import React from 'react';
import * as art from '../models/art';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tempCollection: [],
      artCollection: [],
      showInfoModal: false,
      currentArt: null
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
    console.log('in app.js', this.state.currentArt)
  }

  _closeInfoModal() {
    console.log('closed')
    this.setState({showInfoModal: false});
    this.setState({currentArt: null})
  }

  _update() {
    this._fetchArt()
    .then(() => {
      this._getLikes()
    });
  }
  
  _fetchArt() {
    return art.getArt()
      .then((artwork) => {
        this.setState({tempCollection: artwork})
      })
  }

  // make new geocoder function, call it in .then inside fetchArt

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
  }

  _updateCurrentArt(likes) {
    this.setState({currentArt: Object.assign(this.state.currentArt, {likeCount: likes.likeCount})})
  }


  render(){
    // pass down props from App component to each of its routed children
    return (
      <div>
        {this.props.children && React.cloneElement(this.props.children, {
          gallery: this.state.artCollection,
          updateCurrentArt: this._updateCurrentArt.bind(this),
          currentArt: this.state.currentArt,
          showInfoModal: this.state.showInfoModal,
          openInfoModal: this._openInfoModal.bind(this),
          closeInfoModal: this._closeInfoModal.bind(this),

        })}
      </div>
    )
  }
}
