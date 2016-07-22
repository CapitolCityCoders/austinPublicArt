import React from 'react';
import ReactSpinner from 'react-spinjs';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import * as auth from '../models/auth'


export default class LoginModal extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoading: false,
      username: null,
      password: null,
      showError: false,
      showSuccess: false,
    }

  }

  showError() {
    this.setState({showError: true})
  }

  showSuccess(){
    this.setState({showSuccess: true})
  }

  load() {
    this.setState({isLoading: true});
    setTimeout(() => {
      this.setState({isLoading: false});
    }, 1500);
  }


  render() {
    return <ModalContainer onClose={this.props.onClose}>
      {this.state.isLoading ?
        <ReactSpinner color="white"/>
        :
        <ModalDialog onClose={this.props.onClose} className="example-dialog">
          <form name="loginForm" onSubmit={(e) => {
            e.preventDefault();
            auth.login({username: this.state.username, password: this.state.password})
             .then((x) => {
              if(x === 'Success') {
                this.setState({showError: false});
                this.props.onClose(true);
                this.props.fetchUser()
              } else {
                this.setState({showError: x.statusText})
              }
          })
            this.load.call(this);
          }}>
            <h1>Login</h1>
            <p>Username:</p>
            <input type="text" name="username" onChange={(e) => this.setState({username: e.target.value})}/>
            {this.state.showError ? <p className="errorMessage">{this.state.showError}</p> : ''}
            <p>Password:</p>
            <input type="password" name="password" onChange={(e) => this.setState({password: e.target.value})}/>
            <p><button type="submit">Submit</button></p>
          </form>
        </ModalDialog>
      }
    </ModalContainer>;
  }
}
