import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from '../../App';

const VerifyEmail = () => {

  let navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const [attemptedCode, setAttemptedCode] = useState('');

  function handleSubmit(evt) {
    evt.preventDefault();

    const payload = {
      attemptedCode
    };

    axios.post('/api/auth/verify/email', payload)
      .then(response => {
        console.log('New user verification successful.', response.data);

        setUser({...user, isVerified: true});
        setAttemptedCode('');

        navigate("/");
      })
      .catch(error => {
        console.log('Error verifying user', error);
        alert(error.response.data.message);
      })
  }

  return (
    <>

      <h2>Verify Email</h2>

      <p>Please enter the six digit verification code that was sent to {user.email}.
        If you don't see the email in your inbox, please check the spam folder.
      </p>
      <form onSubmit={handleSubmit}>

        <label htmlFor="attempted_code">
          <p>Verification Code:</p>
          <input type="text" name="attempted_code" placeholder="123456" required value={attemptedCode} onChange={(e) => setAttemptedCode(e.target.value)} />
        </label>

        <button type="submit">Verify</button>
      </form>
    </>
  );
};

export default VerifyEmail;
