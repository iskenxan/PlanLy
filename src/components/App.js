import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import TimeLine from './Timeline';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../reducers';
import AddItemPanel from './AddItemPanel';



class App extends Component {

  render() {
    return (
      <Provider store={createStore(reducers)}>
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.scroll}>
            <TimeLine />
          </ScrollView>
          <AddItemPanel />
        </View>
      </Provider>
    )
  }
}


styles = {
  scroll: {
    padding: 16,
    backgroundColor: '#F4F7F9'
  }
}

export default App;