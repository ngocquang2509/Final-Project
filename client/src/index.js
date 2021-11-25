import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reducers from './reducers/index'
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

const ReactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();


const store = createStore(reducers, compose(applyMiddleware(thunk), ReactReduxDevTools))

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root')
);