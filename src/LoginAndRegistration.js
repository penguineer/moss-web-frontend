import React, { useRef } from 'react';
import backendAxios from './Backend';
import { useNavigate, useLocation } from 'react-router-dom';


function LoginAndRegistration({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef();
  const avatarImage = useRef(null);


  const authenticateWithGithub = () => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect') || '/';
    window.location.href = `http://localhost:8080/auth/github?redirect=${redirect}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const displayName = formData.get('display_name');
    const email = formData.get('email');
    const avatarUrl = formData.get('avatar_url');

    try {
      await backendAxios.post(`/user/register`, {
        display_name: displayName,
        email: email,
        avatar_url: avatarUrl,
      });

      navigate('/');
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const displayWelcomeMessage = () =>
    <div>
      <h1>Welcome, {user.display_name}!</h1>
      <p>You are now logged in.</p>
    </div>;

  const displayRegistrationForm = () => {

    return (
      <div>
        <h1>Register</h1>
        <p>Your authentication was successful, however, you are not yet registered as a user
          on this platform. Please check and submit the following form to complete your registration.</p>
        <form ref={formRef} onSubmit={handleSubmit} className="registration-form">
          <label htmlFor="display_name" className="registration-form">
            <span>Name:</span>
            <input type="text" id="display_name" name="display_name" defaultValue={user.display_name || ''} />
          </label>
          <label htmlFor="email" className="registration-form">
            <span>Email:</span>
            <input type="email" id="email" name="email" defaultValue={user.email || ''} />
          </label>
          <label htmlFor="avatar_url" className="registration-form avatar-field">
            <span>Avatar URL:</span>
            <input type="text" id="avatar_url" name="avatar_url" defaultValue={user.avatar_url} onChange={e => avatarImage.current.src = e.target.value} />
          </label>
          <button type="submit">Submit</button>
          <img ref={avatarImage} src={user.avatar_url} alt="avatar" className="avatar" />
        </form>
      </div>
    );
  };


  const displayLoginButton = () =>
    <div>
      <h1>Login</h1>
      <p>Please log in to continue.</p>
      <p>If you do not have an account, please login with your preferred method
        and you will be forwarded to the registration form after successful authentication.</p>
      <ul>
        <li><button onClick={authenticateWithGithub}><img src={'./github-mark-white.svg'} alt="GitHub Logo" /> Login with GitHub</button></li>
      </ul>
    </div>;

  return (
    <div>
      {user ? (
        user.id ? displayWelcomeMessage() : displayRegistrationForm()
      ) : (
        displayLoginButton()
      )}
    </div>
  );
}

export default LoginAndRegistration;