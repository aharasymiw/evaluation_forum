import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { UserContext } from '../../App';

const Register = () => {

  let navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(evt) {
    evt.preventDefault();

    const payload = {
      firstName,
      lastName,
      username,
      email,
      password
    };

    axios.post('/api/users/register', payload)
      .then(response => {
        console.log('New user registration successful.', response.data);

        setUser({
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          username: response.data.username,
          email: response.data.email,
          photoUrl: response.data.photoUrl,
          isVerified: false
        });

        setFirstName('');
        setLastName('');
        setUsername('');
        setEmail('');
        setPassword('');

        navigate("/verify-email");
      })
      .catch(error => {
        console.log('Error registering user', error);
        alert(error.response.data.message);
      })
  }

  return (
    <>

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <label htmlFor="first_name">
          <p>First Name:</p>
          <input type="text" name="first_name" placeholder="Robert" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>

        <label htmlFor="last_name">
          <p>Last Name:</p>
          <input type="text" name="last_name" placeholder="Alice" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>

        <label htmlFor="username">
          <p>User Name:</p>
          <input type="text" name="username" placeholder="secure👍🏻user_01" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label htmlFor="email">
          <p>Email:</p>
          <input type="email" name="email" placeholder="you@example.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label htmlFor="password">
          <p>Password:</p>
          <input type="password" name="password" placeholder="l*O9l(lnF56So^O" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
