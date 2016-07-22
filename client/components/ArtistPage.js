import React from 'react'

import InfoModal from './InfoModal'
import NavBar from './NavBar'
import * as helpers from '../helpers'

export default class ArtistPage extends React.Component {

  componentWillMount() {
    this.props.closeInfoModal()
  }

  render() {
    // filter gallery collection by selected artist name
    let arts = this.props.gallery.filter(art => 
      art['Artist Full Name'] === this.props.params.artistName
    )

    return (
      <div className="wallpaper">
        <NavBar />
        <br/>
        <br/>

        {/* Art info modal */}
        {this.props.showInfoModal ?
          <InfoModal 
            onClose={this.props.closeInfoModal} 
            updateCurrent={this.props.updateCurrentArt} 
            currentArt={this.props.currentArt} 
            parseImageUrl={helpers.parseImageUrl}
          /> :
          null}

        {arts.map(art => 
          <div key={art._id} className="soloWork">
            <h3 className="soloArtTitle">{art['Art Title']}</h3>
            <a 
              href="javascript:void(0)" 
              onClick={this.props.openInfoModal.bind(null, art)} 
              className="artImage"
            >
              <img className='artImage' src={helpers.parseImageUrl(art.Images)[0]} />
            </a>
            <div className="soloArtInfo">
              <p>{art['Art Location Name']}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}
