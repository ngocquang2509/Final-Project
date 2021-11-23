import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';



const store = createStore(reducers, compose(applyMiddleware(thunk)))

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root')
);