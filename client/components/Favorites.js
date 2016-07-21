import React from 'react';
import * as auth from '../models/auth';

import InfoModal from './InfoModal'
import NavBar from './NavBar';

export default class Favorites extends React.Component {
  constructor() {
    super();
    this.state = {
      favs: []
    };
  }

  componentWillMount() {
    let favIds;

    auth.fetchFavs()
      .then(res => {
        favIds = res.map(obj => obj.artId);
        return this.props.gallery.filter(art => favIds.includes(art._id));
      })
      .then(favArts => {
        this.setState({ favs: favArts })
      })
  }

	render() {
		return (
      <div>
        <NavBar />
        <br/>
        <br/>

        {/* Art info modal */}
        {this.props.showInfoModal ?
          <InfoModal 
            onClose={this.props.closeInfoModal} 
            updateCurrent={this.props.updateCurrentArt} 
            currentArt={this.props.currentArt} 
            parseImageUrl={parseImageUrl}
          /> :
          null}

    		<h3>Your Favs!</h3>
    		<div className="favGallery">
          {this.state.favs.length > 0 ?
            this.state.favs.map(art =>
            <div className="soloWork" key={art._id}>
              <h3 className="soloArtTitle">{art['Art Title']}</h3>
              <a 
                href="javascript:void(0)" 
                onClick={this.props.openInfoModal.bind(null, art)} 
                className="artImage"
              >
                <img className='artImage' src={parseImageUrl(art.Images)[0]} />
              </a>
              <div className="soloArtInfo">
                <p>{art['Art Location Name']}</p>
              </div>
            </div>) :
            <span>
              You don't have any favorites yet! 
            </span>}
     		</div>
  		</div>
    )
	}
}

function parseImageUrl(url) {
  return url.split(';');
}

