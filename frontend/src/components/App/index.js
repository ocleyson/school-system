import React, { Component } from 'react';
import GlobalStyle from '../../styles/global';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../store';
import NavBar from '../NavBar';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div style={{height: '100%'}}>
            <GlobalStyle/>
            <NavBar idToken={this.props.idToken} />
            {this.props.children}
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;