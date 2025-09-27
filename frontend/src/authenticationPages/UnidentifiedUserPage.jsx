import { useState } from 'react';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';

import './UnidentifiedUserPage.css'


export default function UnidentifiedUserPage() {

  // used to set the type of form that we want
  const [typeOfAuth, setTypeOfAuth] = useState(null);



  return (
    <div>
        <h1>Welcome to Knowledge Grasp</h1>

        <h2>loremvrevjkef vkruev krfe</h2>
        <p>jrneivn kjreq;a </p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae officia totam maiores cupiditate autem vero quo distinctio, quas eaque itaque pariatur alias consequuntur fugit neque vel a velit assumenda dolores!</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente consequuntur error accusamus iste molestiae enim nostrum? Et asperiores soluta sequi iure labore, praesentium quis, distinctio ipsam facere veniam debitis fugit?</p>

        <p> We hope you have fun while learning</p>

        <h2>Get started!!</h2>


        <div>

        <button onClick={() => setTypeOfAuth("signup")}>Sign Up</button>
        <button onClick={() => setTypeOfAuth("login")}>Log In</button>


        <div>
          {typeOfAuth === "signup" && <SignUpPage />}
          {typeOfAuth === "login" && <LoginPage />}
        </div>
  
      </div>
  </div>



    
  );
}