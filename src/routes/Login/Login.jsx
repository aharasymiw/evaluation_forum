import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { UserContext } from '../../App';

const Login = () => {

  let navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(evt) {
    evt.preventDefault();

    const payload = {
      username,
      password
    };

    axios.post('/api/users/login', payload)
      .then(response => {
        console.log('User login successful.', response.data);

        setUser({
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          username: response.data.username,
          email: response.data.email,
          photoUrl: response.data.photoUrl,
        });

        setUsername('');
        setPassword('');

        navigate("/");
      })
      .catch(error => {
        console.log('Error logging in user', error);
        alert("Error logging in user.  Please try again.  If the problem persists, please contact support.")
      })
  }

  return (
    <>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <label htmlFor="username">
          <p>Username:</p>
          <input type="text" name="username" placeholder="secure👍🏻user_01" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label htmlFor="password">
          <p>Password:</p>
          <input type="password" name="password" placeholder="l*O9l(lnF56So^O" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
