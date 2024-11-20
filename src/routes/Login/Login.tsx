import { FormEvent, useState } from 'react';
import axios from 'axios';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();

    const payload = {
      email,
      password
    };

    axios.post('/api/users/login', payload)
      .then(response => {
        console.log('User login successful.', response.data);

        setEmail('');
        setPassword('');

      })
      .catch(error => {
        console.log('Error logging in user', error);
        alert("Error logging in user.  Please try again.  If the problem persists, please contact support.")
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>

        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="you@domain.com" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="l*O9l(lnF56So^O" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Login;
