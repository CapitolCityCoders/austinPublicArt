import React from 'react';
import ReactDOM from 'react-dom';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import NavBar from './NavBar';
import InfoModal from './InfoModal';
import * as helpers from '../helpers';
import {Link} from 'react-router';

export default class LocationsContainer extends React.Component{
  constructor(props) {
    super(props);
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
  }

  render() {  

    return (
      <div>
        <NavBar />
        {this.props.showInfoModal ?
          <InfoModal 
            onClose={this.props.closeInfoModal} 
            updateCurrent={this.props.updateCurrentArt} 
            currentArt={this.props.currentArt} 
            parseImageUrl={helpers.parseImageUrl}
          /> :
          null}
        <Gmaps
          width={'100vw'}
          height={'100vh'}
          lat={30.274649}
          lng={-97.740370}
          zoom={12}
          loadingMessage={'Be happy'}
          params={{v: '3.exp', key: 'AIzaSyAzhwRABci2uwXxlC07KKYNmOzMde2Z1bY'}}
          onMapCreated={this.onMapCreated}>

          {this.props.gpsCollection.map((artwork, idx) =>
            <Marker
              key={idx}
              lat={artwork.coords.lat}
              lng={artwork.coords.lng}
              draggable={false}
              onClick={this.props.openInfoModal.bind(null, artwork)}
              onDragEnd={this.onDragEnd} />
          )}
        </Gmaps>
      </div>
    );
  }
};
