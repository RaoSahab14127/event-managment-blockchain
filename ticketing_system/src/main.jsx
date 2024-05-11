import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom/client'
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux'
// import store from './store'

import App from './App.jsx'
import './index.css'
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <ToastContainer />
    <App />
    {/* </Provider> */}
  </React.StrictMode>,
)
