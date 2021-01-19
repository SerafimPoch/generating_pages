/* eslint-disable no-undef */
import React from 'react';
import App from 'next/app';
import { Provider } from 'mobx-react';
import { initializeStore } from '../store/store';
import { appWithTranslation } from '../lib/i18n';
import '../styles/main.scss';

class MyApp extends App {
  static async getInitialProps({ Component, ctx, ctx: { req } }) {
    let language = '';
    const store = initializeStore();
    ctx.store = store;

    if (req) {
      language = req.i18n.language;
    }

    const pageProps = {
      namespacesRequired: ['common'],
    };

    try {
      Object.assign(
        pageProps,
        (Component.getInitialProps && await Component.getInitialProps(ctx)) || {},
      );
      if (Component.namespacesRequired) {
        pageProps.namespacesRequired.push(...Component.namespacesRequired);
      }
    } catch (e) {
      if (e.response && e.response.status) {
        return { error: e.response.status, initialState: store, pageProps };
      }
    }

    return {
      pageProps,
      initialState: store,
      language,
    };
  }

  constructor(props) {
    super(props);
    const isServer = !process.browser;
    this.store = isServer ? props.initialState : initializeStore(props.initialState);
    this.language = props.language;
    this.pageProps = props.pageProps;
    if (!isServer) {
      window.store = this.store;
    }
  }

  async componentDidMount() {
    this.store.setLanguage(this.language);
    await this.store.getHeaderLinks();
  }

  render() {
    const { Component, pageProps = {} } = this.props;
    return (
      <Provider store={this.store}>
        <Component {...pageProps} />
      </Provider>

    );
  }
}

export default appWithTranslation(MyApp);
