import React, {useState,useEffect} from 'react';
import './profileAdmin.css';
import gravatar from 'gravatar';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminProfile({ user }) {
    const [userCounts, setUserCounts] = useState({});
    
    useEffect(() => {
        axios.get('https://college-backend-tyqu.onrender.com/users/user-count') 
        .then(response => {
            setUserCounts(response.data);
        })
        .catch(error => {
            console.error('Error fetching user counts:', error);
        });
    }, []);

  return (
    <div className="profile-container">
      <div className="profileadmin">
        <ProfileSection user={user} />
        <DonutChart userCounts={userCounts} />
      </div>
    </div>
  );
}

function DonutChart({ userCounts }) {
    const series = [userCounts.collegeS, userCounts.collegeG, userCounts.admin];
    const options = {
      labels: ['College Searching', 'College Going', 'Admins'],
      chart: {
        type: 'donut',
      },
    };
    return (
      <div className="professional" style={{display:"grid", marginTop:"90px", marginBottom:"20px"}}>
        <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '15px', marginBottom: '15px', fontWeight: '500' }}>
            User Distribution
        </p>
        <div style={{ maxHeight: '100%', overflow: 'hidden' }}>
        <ReactApexChart options={options} series={series} type="donut" />
      </div>
      </div>
    );
  }

function ProfileSection({ user }) {
  return (
    <div className="profile_details">
      <ProfilePhotoSection user={user} />
      <ProfileDataSection user={user} />
    </div>
  );
}

function ProfilePhotoSection({ user }) {
  const gravatarUrl = gravatar.url(user.email, { s: 75, r: "pg", d: 'robohash' });
  return (
    <div className="profile_photo">
      <div style={{ borderRadius: '50%', overflow: 'hidden', width: 75, height: 75 }}>
        <img src={gravatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <div>
          <p className="profile_verified">Verified</p>
        </div>
      </div>
    </div>
  );
}

function ProfileDataSection({ user }) {
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);
  const [newUsername, setNewUsername] = useState(user.username);

  const handleNameEdit = () => {
    setIsEditingName(true);
  };
  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
  };

  const handleEmailEdit = () => {
    setIsEditingEmail(true);
  };

  const handleNameSubmit = () => {
    axios
      .patch(`https://college-backend-tyqu.onrender.com/users/profile/updateName/${user.email}`, { name: newName })
      .then(response => {
        console.log(response.data);
        setIsEditingName(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating name:', error);
      });
  };
  const handleUsernameSubmit = () => {
    axios
      .patch(`https://college-backend-tyqu.onrender.com/users/profile/updateUsername/${user.email}`, { username: newUsername })
      .then(response => {
        console.log(response.data);
        setIsEditingUsername(false);
        window.location.reload();
        
      })
      .catch(error => {
        console.error('Error updating username:', error);
      });
  };


  const handleEmailSubmit = () => {
    axios
      .patch(`https://college-backend-tyqu.onrender.com/users/profile/updateEmail/${user.email}`, { newEmail: newEmail })
      .then(response => {
        console.log(response.data);
        setIsEditingEmail(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating email:', error);
      });
  };

  return (
    <div className="professional">
      <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '15px', marginBottom: '15px', fontWeight: '500' }}>
        Personal Details
      </p>
      <div className="professional_details">
        <div>
        <p className="profile_data_rows" style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'black' }}>Your Name</p>

        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '5px' }}>
          {isEditingName ? (
            <>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="profile-data-values" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleNameSubmit();
          }
        }}/>
              <button className="edit-button" onClick={handleNameSubmit}>
                Save
              </button>
            </>
          ) : (
            <>
              <p className="profile-data-values">{user.name}</p>
              <button className="edit-button" onClick={handleNameEdit}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>
      {/* username */}
      <div className="professional_details">
        <div>
          <p className="profile_data_rows" style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'black' }}>Username</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '5px' }}>
          {isEditingUsername ? (
            <>
              <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="profile-data-values" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleUsernameSubmit();
          }
        }}/>
              <button className="edit-button" onClick={handleUsernameSubmit}>
                Save
              </button>
            </>
          ) : (
            <>
              <p className="profile-data-values">{user.username}</p>
              <button className="edit-button" onClick={handleUsernameEdit}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>
      {/* //email */}
      <div className="professional_details">
        <div>
          <p className="profile_data_rows" style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'black' }}>Email</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '5px' }}>
          {/* {isEditingEmail ? (
            <>
              <input type="text" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="profile-data-values" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleEmailSubmit();
          }
        }}/>
              <button className="edit-button" onClick={handleEmailSubmit}>
                Save
              </button>
            </>
          ) : (
            <>
            <button className="edit-button" onClick={handleEmailEdit}>
            Edit
            </button>
            </>
          )} */}
          <p className="profile-data-values">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
  
export default AdminProfile;
