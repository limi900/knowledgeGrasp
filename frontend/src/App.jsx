import { useState } from 'react'
import './App.css'
import SignUpPage from "./authenticationPages/SignUpPage.jsx";
import LoginPage from "./authenticationPages/LoginPage.jsx";
import UnidentifiedUserPage from './authenticationPages/UnidentifiedUserPage';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>  
      <UnidentifiedUserPage></UnidentifiedUserPage>
      {/* <SignUpPage></SignUpPage>
      <LoginPage></LoginPage> */}
    </>
  )
}

export default App
