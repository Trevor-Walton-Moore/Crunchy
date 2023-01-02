import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import '../css/Auth.css'

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='login-main'>

      <div className='login-div'>
        <div className='login-title'>
          Sign in or register
        </div>
        <form
          className='login-form'
          onSubmit={onLogin}>
          <div className='auth-form-children'>
            <div className='returning-or-new-customer'>
              I'm a Returning Customer
            </div>
            <div>
              {errors.map((error, ind) => (
                <div
                  className='error'
                  key={ind}>
                  {error}
                </div>
              ))}
            </div>
            {/* <div> */}
            {/* <label htmlFor='email'></label> */}
            <input
              className='auth-input'
              name='email'
              type='text'
              placeholder='Email Address'
              value={email}
              onChange={updateEmail}
            />
            {/* </div> */}
            {/* <div> */}
            {/* <label htmlFor='password'></label> */}
            <input
              className='auth-input'
              name='password'
              type='password'
              placeholder='Password'
              value={password}
              onChange={updatePassword}
            />
            <NavLink
              className='forgot-password'
              to='coming-soon'>
              Forgot your password?
            </NavLink>
            <button
              className='login-button-page'
              type='submit'>
              Sign In
            </button>
            {/* </div> */}
          </div>
        </form>
      </div>
      <div className='signup-div'>
        <div className='returning-or-new-customer'>
          I'm a New Customer
        </div>
        <div className='create-account-paragraph'>
          Creating an account is fast, easy, and free.
          You'll be able to manage your autoships,
          track your orders, write reviews, and more!
        </div>
        <NavLink
          className='create-account-button'
          to='/sign-up'>
          Create Account
        </NavLink>
      </div>
    </div>
  );
};

export default LoginForm;
