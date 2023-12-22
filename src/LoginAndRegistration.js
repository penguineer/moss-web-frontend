import React, { useRef } from 'react';
import backendAxios from './Backend';
import { useNavigate, useLocation } from 'react-router-dom';

import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


function LoginAndRegistration({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef();
  const avatarImage = useRef(null);

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

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
    <Panel header={`Welcome, ${user.display_name}!`}>
      <p>You are now logged in.</p>
    </Panel>;

  const displayRegistrationForm = () => {
    return (
      <div>
        <Panel header="Register">
          <p className="m-0 mb-3">Your authentication was successful, however, you are not yet registered as a user
            on this platform. Please check and submit the following form to complete your registration.</p>
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="flex flex-row justify-content-between gap-6">
              <div className="flex-grow-1">
                <span className="p-float-label mt-5">
                  <InputText
                    id="display_name"
                    name="display_name"
                    defaultValue={user.display_name || ''}
                    className="w-full" />
                  <label htmlFor="display_name">Name</label>
                </span>
                <span className="p-float-label mt-5">
                  <InputText
                    id="email"
                    name="email"
                    defaultValue={user.email || ''}
                    className="w-full" />
                  <label htmlFor="email">E-Mail</label>
                </span>
                <span className="p-float-label mt-5">
                  <InputText
                    id="avatar_url"
                    name="avatar_url"
                    defaultValue={user.avatar_url}
                    onChange={e => avatarImage.current.src =
                      e.target.value ? e.target.value : "user-no-avatar.svg"}
                    className="w-full" />
                  <label htmlFor="avatar_url">Avatar URL</label>
                </span>
              </div>
              <div className="flex flex-column justify-content-end">
                <img ref={avatarImage} src={user.avatar_url} alt="avatar" className="avatar-large" />
              </div>
            </div>
            <div className="mt-6 w-full flex justify-content-center">
              <Button type="submit" label="Create an Account" icon="pi pi-check" />
            </div>
          </form>
        </Panel>
      </div>
    );
  }


  const displayLoginButton = () =>
    <Panel header="Login">
      <p className="m-0">You are not logged in.</p>
      <p>If you already have an account, please login with your previously chosen method.</p>
      <p className="mb-6">If you do not have an account, please login with your preferred method
        and you will be forwarded to the registration form after successful authentication.</p>
      <Button
        onClick={authenticateWithGithub}
        label=""
        outlined
        className="w-full">
        <img
          alt="logo"
          src={isDarkMode ? 'github-mark-white.svg' : 'github-mark.svg'}
          className="p-button-icon p-mr-2" />
        <div className="w-full flex flex-row justify-content-center">
          <span className="text-3xl">Login with GitHub</span>
        </div>
      </Button>
    </Panel>;

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