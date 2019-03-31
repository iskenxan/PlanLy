import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from '../reducers';


/* eslint-disable no-underscore-dangle */
const preloadedState = global.window.__REDUX_DEVTOOLS_EXTENSION__
    && global.window.__REDUX_DEVTOOLS_EXTENSION__();
/* eslint-enable */

const persistConfig = {
  key: 'root',
  storage,
};


const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  persistedReducer,
  preloadedState,
);


const persistor = persistStore(store);


module.exports = {
  store,
  persistor,
};
