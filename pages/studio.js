import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from '../lib/i18n';
import Layout from '../components/layout/Layout';

const Studio = ({ t }) => (
  <Layout>
    <p>{t('studio')}</p>
  </Layout>
);

Studio.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(Studio);
