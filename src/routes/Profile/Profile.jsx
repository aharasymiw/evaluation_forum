import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { UserContext } from '../../App';

function Profile() {

  const { user, setUser } = useContext(UserContext);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');

  const fetchUserDetails = () => {
    axios.get('/api/users/')
      .then(response => {
        let userDetails = response.data
        console.log('userDetails', userDetails);
        setFirstName(userDetails.firstName);
        setLastName(userDetails.lastName);
        setUsername(userDetails.username);
        setEmail(userDetails.email);
        setMemberNumber(userDetails.memberNumber || '');
        setPhotoUrl(userDetails.photoUrl || '');
        setBio(userDetails.bio || '');
      })
      .catch(error => {
        console.log('Error fetching user', error);
        alert(error.response.data.message);

      })
  }

  useEffect(fetchUserDetails, []);

  function handleSubmit(evt) {
    evt.preventDefault();

    const payload = {
      firstName,
      lastName,
      memberNumber,
      photoUrl,
      bio
    };

    axios.patch('/api/users/', payload)
      .then(response => {
        console.log('Success updating user', response);
      })
      .catch(error => {
        console.log('Error updating user', error);
        alert(error.response.data.message);
      })

  }

  return (
    <>
      <h2>Profile</h2>

      <form onSubmit={handleSubmit}>

        {user.id &&
          <div>

            <label htmlFor="first_name">
              <p>First Name:</p>
              <input type="text" name="first_name" placeholder="Eva" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>

            <label htmlFor="last_name">
              <p>Last Name:</p>
              <input type="text" name="last_name" placeholder="Luator" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>

            <p>User Name:</p>
            <p>{username}</p>

            <p>Email:</p>
            <p>{email}</p>

            <label htmlFor="member_number">
              <p>Member Number:</p>
              <input type="text" name="member_number" value={memberNumber} onChange={(e) => setMemberNumber(e.target.value)} />
            </label>

            <label htmlFor="photo_url">
              <p>Photo Url:</p>
              <input type="text" name="photo_url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
            </label>

            <label htmlFor="bio">
              <p>Bio:</p>
              <textarea type="text" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows="20" cols="30" />
            </label>

          </div>
        }

        <button type="submit">Update</button>
      </form>

    </>
  );
}

export default Profile;
