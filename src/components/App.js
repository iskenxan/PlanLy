/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MenuProvider } from 'react-native-popup-menu';
import { Root } from 'native-base';
import reducers from '../reducers';
import AppRoot from './Root';


class App extends Component {
  getStore = () => createStore(reducers, global.window.__REDUX_DEVTOOLS_EXTENSION__
      && global.window.__REDUX_DEVTOOLS_EXTENSION__())


  render() {
    return (
      <Provider store={this.getStore()}>
        <Root>
          <MenuProvider>
            <AppRoot />
          </MenuProvider>
        </Root>
      </Provider>
    );
  }
}

export default App;
