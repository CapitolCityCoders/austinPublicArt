import React from 'react'
import {Link} from 'react-router'
import ReactSpinner from 'react-spinjs';
import * as auth from '../models/auth'
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';



export default class NavBar extends React.Component {
  constructor() {
    super()
    this.state = {
      showLogin: false,
      showSignup: false,
      showFBLogin: false,
      showError: false,
      loggedIn: document.cookie,
      username: null,
    }
  }

  componentWillMount() {
    if (document.cookie) {
      this.setState({loggedin: true})
      this._fetchUser();
    }
    else {
      this.setState({loggedIn: false})
    }
  }


  _fetchUser() {
    auth.fetchUsername()
      .then((res) => {
        this.setState({ username: res })
      })
  }

  _openLogin() {
    this.setState({showLogin: true});
  }

  _closeLogin(bool) {
    this.setState({loggedIn: bool})
    this.setState({showLogin: false});
  }

  openFBLogin(){
    this.setState({showFBLogin: true});
  }

  closeFBLogin(bool){
    this.setState({loggedIn: bool})
    this.setState({showFBLogin:false});
  }

  _openSignup() {
    this.setState({showSignup: true});
  }

  _closeSignup(bool) {
    this.setState({loggedIn: bool})
    this.setState({showSignup: false});
  }

  logout(name) {
    document.cookie = 'sessionId' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.setState({loggedIn: false})
    this.setState({username: null})
  }




  drawUsername() {
    if(this.state.username) return (<div className='animated bounceInRight'><span className="usernameSpan" >Welcome, {this.state.username}</span></div> );
      else return (<span className="usernameSpan">Welcome Guest</span>)
  }

  //Render the navbar
  render() {
    return(
      <div className="w3-top nav">
        <ul className="w3-navbar w3-black w3-card-2 w3-left-align">
          <li className="w3-hide-medium w3-hide-large w3-opennav w3-right">
            <a className="w3-padding-large" href="javascript:void(0)" title="Toggle Navigation Menu"><i className="fa fa-bars"></i></a>
          </li>
          {/* Populate the navbar items. Use <Link /> from react router to add links to different views. */}
          <li className="w3-hide-small"><Link to={`artists`} className="w3-padding-large" >ARTISTS</Link></li>
          <li className="w3-hide-small"><Link to={`gallery`} className="w3-padding-large">GALLERY</Link></li>
          {this.state.loggedIn ? <li className="w3-hide-small"><Link to={`favorites`} className=" w3-padding-large">FAVORITES</Link></li> : null}
          <li className="w3-hide-small"><Link to={`locations`} className="w3-padding-large">LOCATIONS</Link></li>
          <li className="w3-hide-small w3-dropdown-hover">
            <a className="w3-hover-none w3-padding-large" title="More">ACCOUNT <i className="fa fa-caret-down"></i></a>
            <div className="w3-dropdown-content w3-white w3-card-4">
              {!this.state.loggedIn ? <div><a href="javascript:void(0)" onClick={this._openLogin.bind(this)}>Login</a>
              <a href="javascript:void(0)" onClick={this.openFBLogin.bind(this)}>Facebook Login</a>
              <a href="javascript:void(0)" onClick={this._openSignup.bind(this)}>Signup</a></div> :
              <a href="javascript:void(0)" onClick={this.logout.bind(this)}>Logout</a>}
            </div>
          </li>
          <li className="w3-hide-small w3-right">{this.drawUsername()}</li>
        </ul>
        {this.state.showSignup ?
          <SignUpModal onClose={this._closeSignup.bind(this)} fetchUser={this._fetchUser.bind(this)}/>
        : null}
        {this.state.showLogin ?
          <LoginModal onClose={this._closeLogin.bind(this)} fetchUser={this._fetchUser.bind(this)}/>
        : null}
        {this.state.showFBLogin ?
          <FBModal onClose={this.closeLogin.bind(this)} fetchUser={this.fetchUser.bind(this)}/>
        : null}
      </div>
    )
  }
}

class FBModal extends React.Component{

}



