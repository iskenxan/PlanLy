import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../reducers';
import Root from './Root'


class App extends Component {

  getStore = () => {
    return createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__
      && window.__REDUX_DEVTOOLS_EXTENSION__())
  }


  render() {
    return (
      <Provider store={this.getStore()}>
        <Root />
      </Provider>
    )
  }

}

export default App;