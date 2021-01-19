import React from 'react';
import Layout from '../components/layout/Layout';
import ControlPanel from '../components/pages/ControlPanel';
import api from '../lib/api';

const Pages = ({ pages }) => (
  <Layout>
    <ControlPanel pages={pages} />
  </Layout>
);

export async function getServerSideProps() {
  const pages = await api.getPages();

  return {
    props: { pages },
  };
}

export default Pages;
