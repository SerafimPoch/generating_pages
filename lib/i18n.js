const NextI18Next = require('next-i18next').default;
const path = require('path');

module.exports = new NextI18Next({
  defaultLanguage: 'en',
  serverLanguageDetection: true,
  otherLanguages: ['ua'],
  shallowRender: true,
  localePath: path.resolve('public/static/locales'),
  ignoreRoutes: ['/_next/'],
  localeSubpaths: { ua: 'ua' },
});
