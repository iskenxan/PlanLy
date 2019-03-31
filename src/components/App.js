import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { MenuProvider } from 'react-native-popup-menu';
import { Root, Spinner } from 'native-base';
import AppRoot from './Root';
import { store, persistor } from './Store';


const App = () => (
  <Provider store={store}>
    <PersistGate loading={<Spinner />} persistor={persistor}>
      <Root>
        <MenuProvider>
          <AppRoot />
        </MenuProvider>
      </Root>
    </PersistGate>
  </Provider>
);

export default App;
