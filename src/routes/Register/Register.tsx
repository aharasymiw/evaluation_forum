import { FormEvent, useState } from 'react';
import axios from 'axios';

const Register = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();

    const payload = {
      firstName,
      lastName,
      userName,
      email,
      phone,
      password
    };

    axios.post('/api/users/register', payload)
      .then(response => {
        console.log('New user registration successful.', response.data);

        setFirstName('');
        setLastName('');
        setUserName('');
        setEmail('');
        setPhone('');
        setPassword('');

      })
      .catch(error => {
        console.log('Error registering user', error);
        alert(error.response.data.message);
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>

        <label htmlFor="first_name">First Name</label>
        <input type="text" name="first_name" placeholder="Robert" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

        <label htmlFor="last_name">Last Name</label>
        <input type="text" name="last_name" placeholder="Alice" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <label htmlFor="user_name">User Name</label>
        <input type="text" name="user_name" placeholder="secure👍🏻user_01" required value={userName} onChange={(e) => setUserName(e.target.value)} />

        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="you@domain.com" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="phone">Phone Number</label>
        <input type="tel" name="phone" placeholder="555-123-4567" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="l*O9l(lnF56So^O" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
