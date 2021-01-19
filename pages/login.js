import React, { useState } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Layout from '../components/layout/Layout';

const Login = ({ store }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await store.login(email, password);
      setError(null);
      Router.push('/');
    } catch (err) {
      if (err?.response?.data) {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <Layout>
      <div className="b-main">
        <form onSubmit={onSubmit}>
          {error && <div>{error}</div>}
          <div>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </Layout>
  );
};

Login.propTypes = {
  store: PropTypes.object.isRequired,

};

export default inject('store')(observer(Login));
