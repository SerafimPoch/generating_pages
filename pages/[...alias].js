import React from 'react';
import Error from 'next/error';
import PropTypes from 'prop-types';
import api from '../lib/api';
import AliasPage from '../components/pages/AliasPage';

const Alias = ({ page, errorCode }) => {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <AliasPage page={page} />
  );
};

export async function getServerSideProps({ params: { alias } }) {
  const page = {};
  const errorCode = 404;

  if (Array.isArray(alias)) {
    const coreAlias = alias[1];

    if (coreAlias === 'api') {
      return {
        props: { errorCode },
      };
    }

    page.info = await api.getPageByAlias(alias.filter(e => (e !== 'en' && e !== 'ua')).join('--slash--'));
  }

  if (!page.info) {
    return {
      props: { errorCode },
    };
  }

  return { props: { page } };
}

Alias.propTypes = {
  page: PropTypes.object,
  errorCode: PropTypes.number,
};

Alias.defaultProps = {
  page: {},
  errorCode: 0,

};

export default Alias;
