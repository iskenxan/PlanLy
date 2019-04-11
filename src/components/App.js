import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { MenuProvider } from 'react-native-popup-menu';
import { Root, Spinner } from 'native-base';
import AppRoot from './Root';
import { store, persistor } from './Store';
import { DARK_BLUE } from '../colors';


const App = () => (
  <Provider store={store}>
    <PersistGate loading={<Spinner color={DARK_BLUE} />} persistor={persistor}>
      <Root>
        <MenuProvider>
          <AppRoot />
        </MenuProvider>
      </Root>
    </PersistGate>
  </Provider>
);

export default App;
