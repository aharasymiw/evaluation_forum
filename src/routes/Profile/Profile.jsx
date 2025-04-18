import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
        setPhone(userDetails.phone);
        setMemberNumber(userDetails.memberNumber);
        setPhotoUrl(userDetails.photoUrl);
        setBio(userDetails.bio);
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
      phone,
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

        {firstName &&
          <div>

            <label htmlFor="first_name">
              <p>First Name:</p>
              <input type="text" name="first_name" placeholder="Robert" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>

            <label htmlFor="last_name">
              <p>Last Name:</p>
              <input type="text" name="last_name" placeholder="Alice" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>

            <p>User Name:</p>
            <p>{username}</p>

            <p>Email:</p>
            <p>{email}</p>

            <label htmlFor="phone">
              <p>Cell Phone Number:</p>
              <input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>

            <label htmlFor="member_number">
              <p>Member Number:</p>
              <input type="text" name="member_number" required value={memberNumber} onChange={(e) => setMemberNumber(e.target.value)} />
            </label>

            <label htmlFor="photo_url">
              <p>Photo Url:</p>
              <input type="text" name="photo_url" required value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
            </label>

            <label htmlFor="bio">
              <p>Bio:</p>
              <textarea type="text" name="bio" required value={bio} onChange={(e) => setBio(e.target.value)} rows="20" cols="30" />
            </label>

          </div>
        }

        <button type="submit">Update</button>
      </form>

    </>
  );
}

export default Profile;
