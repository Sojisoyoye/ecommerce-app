import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signOut, isAuthenticated } from '../auth';

const isActive = (history, pathname) => {
  if (history.location.pathname === pathname) {
    return { color: '#ff9900' };
  } else {
    return { color: '#000' };
  }
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, '/')} to="/">
          Home
        </Link>
      </li>

      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, '/user/dashboard')}
            to="/user/dashboard"
          >
            Dashboard
          </Link>
        </li>
      )}

      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, '/admin/dashboard')}
            to="/admin/dashboard"
          >
            Dashboard
          </Link>
        </li>
      )}

      {!isAuthenticated() && (
        <Fragment>
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">
              Sign in
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">
              Sign up
            </Link>
          </li>
        </Fragment>
      )}

      {isAuthenticated() && (
        <Fragment>
          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: 'pointer', color: '#000' }}
              onClick={() => signOut(() => history.push('/'))}
            >
              Sign out
            </span>
          </li>
        </Fragment>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
