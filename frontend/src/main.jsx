
import ReactDOM from 'react-dom/client'
import App from './styledFrontend/App'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
// import SignIn from './styledFrontend/Auth.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
)
