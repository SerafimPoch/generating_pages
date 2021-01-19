import React from 'react';
import Head from 'next/head';
import 'normalize.css/normalize.css';
import Header from './Header';

export default ({ children, title, metaDescription }) => (
  <div className="b-root">
    <Head>
      <meta name="title" content={title || ''} />
      <meta name="description" content={metaDescription || ''} />
      <title>Site with page generation</title>
    </Head>
    <Header />
    <div className="b-layout">
      {children}
    </div>
    <footer className="b-layout" />

  </div>
);
