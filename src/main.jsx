import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Preloader, { usePreloader } from './components/Preloader.jsx'
import './index.css'

const Root = () => {
  const { show, finish } = usePreloader();
  return (
    <>
      {show && <Preloader onFinish={finish} />}
      <div style={show ? { visibility: 'hidden' } : undefined}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
