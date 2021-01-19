import React from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Layout from '../layout/Layout';

const AliasPage = ({ store, page }) => {
  const lang = store.language;

  return (
    <Layout>

      <section className="ui-container _padding">
        <Head>
          <title>{page.info.data[lang]?.title || 'PAGE'}</title>
          <meta
            name="description"
            content={page.info.data[lang]?.description || 'PAGE'}
          />
        </Head>

        <div
          className="sk-contentPage"
          dangerouslySetInnerHTML={{ __html: page.info.data[lang]?.content }}
        />

      </section>

    </Layout>
  );
};

export default inject('store')(observer(AliasPage));
