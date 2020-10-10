import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import { signIn, authenticate } from '../auth';
import { isAuthenticated } from '../auth';

const Signin = () => {
  const [values, setValues] = useState({
    email: 'ade@gmail.com',
    password: 'adeola1',
    error: '',
    loading: false,
    redirectToReferrer: false,
  });

  const { email, password, error, loading, redirectToReferrer } = values;
  const { user } = isAuthenticated();

  const handleChange = (value) => (event) => {
    setValues({ ...values, error: false, [value]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signIn({ email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true,
            loading: false,
          });
        });
      }
    });
  };

  const signInForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange('email')}
          value={email}
          type="email"
          className="form-control"
        ></input>
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange('password')}
          value={password}
          type="password"
          className="form-control"
        ></input>
      </div>

      <button onClick={handleSubmit} className="btn btn-primary">
        Sign In
      </button>
    </form>
  );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading....</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }

    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  return (
    <Layout
      title="Sign In"
      description="Sign in to E - commerce App"
      className="container col-md-8 offset-md-2"
    >
      {showLoading()}
      {showError()}
      {signInForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
