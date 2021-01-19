import React from 'react';
import { inject, observer } from 'mobx-react';
import NextLink from 'next/link';
import { nanoid } from 'nanoid';

import { Link, i18n } from '../../lib/i18n';

const Header = ({ store }) => {
  const logout = () => {
    store.logout();
  };

  const changeLanguage = lang => {
    store.setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const { headerPages, language } = store;

  return (
    <div className="b-layout _header">
      <input type="checkbox" className="b-burger__control" id="b-burger__control" />
      <div className="b-burger">
        <label className="b-button b-burger__button" htmlFor="b-burger__control" />
        <div className="b-burger__menu">
          <Link href="/studio">
            <a>studio</a>
          </Link>
          <Link href="/contact">
            <a>becomeOurClient</a>
          </Link>
          <div className="b-navigation__lang">
            <button type="button" className="b-navigation__item">en</button>
            <button type="button" className="b-navigation__item">ua</button>
          </div>
          {headerPages.map(e => (
            <NextLink href={`${language === 'en' ? '' : language}/${e.alias}`} asPath={`${e.alias}`} key={nanoid()}>
              <a className="b-navigation__item">{e.alias}</a>
            </NextLink>
          ))}
        </div>
      </div>

      <div className="b-navigation">
        <div className="b-navigation__menu">

          <Link href="/studio">
            <a className="b-navigation__item">studio</a>
          </Link>
          <Link href="/contact">
            <a className="b-navigation__item">becomeOurClient</a>
          </Link>
          {headerPages.map(e => (
            <NextLink href={`${language === 'en' ? '' : language}/${e.alias}`} asPath={`${e.alias}`} key={nanoid()}>
              <a className="b-navigation__item">{e.alias}</a>
            </NextLink>
          ))}
        </div>
        {store.token && <button type="button" className="b-button" onClick={logout}>Logout</button>}
        <div className="b-navigation__lang">
          <button
            type="button"
            onClick={() => changeLanguage('en')}
            className="b-navigation__item"
          >
            en
          </button>
          <button
            type="button"
            onClick={() => changeLanguage('ua')}
            className="b-navigation__item"
          >
            ua
          </button>
        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(Header));
