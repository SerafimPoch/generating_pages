/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { uniqBy } from 'lodash';
import AsyncSelect from 'react-select/async';
import dynamic from 'next/dynamic';
import { nanoid } from 'nanoid';
import { inject } from 'mobx-react';
import Options from '../shared/Options';
import api from '../../lib/api';
import { LANGUAGES, LANGUAGES_MAP } from '../../lib/constants';
import '../../node_modules/react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

@inject('store')
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {

      data: {
        en: {
          title: '',
          description: '',
          content: '',
        },
        ua: {
          title: '',
          description: '',
          content: '',
        },
        checkboxArray: [
          {
            id: 1, key: 'header', label: 'Header menu', checked: false,
          },
          {
            id: 2, key: 'footer', label: 'Footer menu', checked: false,
          },
        ],
      },

      language: 'en',
      alias: '',
      pages: props.pages,
      id: null,
      editCategory: false,
      coreAliases: [],
      core: '',

    };
  }

  handleChange = (html, field) => {
    const { data, language } = this.state;
    data[language][field] = html;
    this.setState({ data });
  }

  onChangeCheckboxArray = id => {
    const { data } = this.state;
    data.checkboxArray.map((e) => {
      if (e.id === id) {
        e.checked = !e.checked;
      }
      return e;
    });

    this.setState({ data });
  }

  loadOptions = async () => {
    let convertedAliases = [];
    try {
      const aliases = await api.getCoreCategories();
      convertedAliases = uniqBy(aliases.map(e => e.alias.match(/^([^\/]+)/g)).map(e => ({ label: `${e}/`, value: `${e}/` })), 'label');
      this.setState({ coreAliases: convertedAliases });
    } catch (error) {
      console.log(error);
    }

    return convertedAliases;
  }

  save = async () => {
    const { alias, data, core } = this.state;
    try {
      await api.createPage({
        alias: core ? (core.label + alias).replace(/\/$/, '') : alias.replace(/\/$/, ''),
        data,
      });
      await this.updatePagesState();

      this.reset();
    } catch (error) {
      console.log(error);
    }
  }

  update = async () => {
    const {
      id, alias, data, editCategory,
    } = this.state;
    try {
      await api.updatePage({ id, alias, data });

      if (editCategory) {
        await api.updateCategoryPages({ alias: editCategory, new_alias: alias.replace(/\/$/, '') });
      }
      await this.updatePagesState();
      this.reset();
    } catch (error) {
      return console.log(error);
    }
  }

  reset = () => {
    this.setState({
      id: null,
      alias: '',
      data: {
        en: {
          title: '',
          description: '',
          content: '',
        },
        ua: {
          title: '',
          description: '',
          content: '',
        },
        checkboxArray: [
          {
            id: 1, key: 'header', label: 'Header menu', checked: false,
          },
          {
            id: 2, key: 'footer', label: 'Footer menu', checked: false,
          },
        ],
      },

    });
  }

  convertedPages = () => {
    const { pages } = this.state;
    const data = [];

    pages.map((e) => {
      const findCore = e.alias.match(/^([^\/]+)/g).pop();

      if (findCore) {
        data.push({
          id: e.id, core: findCore, alias: e.alias, child: [],
        });

        if (e.alias.includes(findCore)) {
          data.find(v => v.core === findCore && v.child.push(e));
        }
      }

      return '';
    });

    return uniqBy(data, 'core');
  }

  edit = async (page, categoryCore) => {
    this.setState({
      id: page.id,
      data: page.data,
      alias: page.alias,
    }, () => {
      this.scrollToTop();
    });

    if (categoryCore) {
      this.setState({ editCategory: page.alias });
    }
  }

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  remove = async id => {
    try {
      await api.deletePage({ id });
      await this.updatePagesState();
    } catch (error) {
      console.log(error);
    }
  }

  removeAll = async alias => {
    try {
      await api.deleteAllCategoryPages({ alias });
      await this.updatePagesState();
    } catch (error) {
      console.log(error);
    }
  }

  updatePagesState = async () => {
    try {
      const pages = await api.getPages();
      const aliases = await api.getCoreCategories();
      await store.getHeaderLinks();
      this.setState({ pages, coreAliases: aliases });
      this.reset();
    } catch (error) {
      console.log(error);
    }
  }

  imageHandler() {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();

      formData.append('image', file);

      const res = await api.uploadPageImage(formData);

      // Save current cursor state
      const range = this.quill.getSelection(true);

      // Insert temporary loading placeholder image
      this.quill.insertEmbed(range.index, 'image', `${window.location.origin}/images/loaders/placeholder.gif`);

      // Move cursor to right side of image (easier to continue typing)
      this.quill.setSelection(range.index + 1);

      try {
        // eslint-disable-next-line quotes

        if (res) {
          const image = await res;

          // Remove placeholder image
          this.quill.deleteText(range.index, 1);

          // Insert uploaded image
          // this.quill.insertEmbed(range.index, 'image', res.body.image);
          this.quill.insertEmbed(range.index, 'image', image);
        }
      } catch (err) {
        console.log(err);
      }
    };
  }

  render() {
    const {
      data, language, alias, id, coreAliases,
    } = this.state;

    return (
      <>
        <section className="page">
          <h2>SEO dashboard</h2>
          <article className="page__basic">
            <div className="page__basicCont">
              <h3>Basic page parameters</h3>
              <div className="page__pageInfoBlock">
                <AsyncSelect
                  isClearable
                  defaultOptions
                  className="react-select-container"
                  classNamePrefix="react-select"
                  key={JSON.stringify(coreAliases)}
                  loadOptions={this.loadOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  onChange={(value => this.setState({ core: value }))}
                  placeholder="Category"
                />
              </div>
              <input
                className="page__inputField"
                type="text"
                placeholder="Alias"
                value={alias}
                onChange={e => this.setState({ alias: e.target.value })}
              />
            </div>
            <div className="page__additional">
              <h3>Additional</h3>
              {data?.checkboxArray.map(e => (
                <div className="page__checkBoxItem" key={nanoid()}>
                  <input
                    type="checkbox"
                    className="ios8-switch"
                    id={e.label}
                    name={e.label}
                    checked={e.checked}
                    onChange={() => this.onChangeCheckboxArray(e.id)}
                  />
                  <label className="input__label" htmlFor={e.label}>
                    {e.label}
                  </label>
                </div>
              ))}
            </div>
          </article>
          <article className="content">
            <h2>Language</h2>
            <Options
              value={language}
              options={LANGUAGES.map(lang => ({ label: LANGUAGES_MAP[lang], value: lang }))}
              onChange={e => this.setState({ language: e })}
            />
            <h3>SEO</h3>
            <div className="page__basicCont">
              <input
                className="page__inputField"
                type="text"
                value={data[language].title}
                placeholder="Title"
                onChange={e => this.handleChange(e.target.value, 'title')}
              />
              <input
                className="page__inputField"
                type="text"
                value={data[language].description}
                placeholder="Description"
                onChange={e => this.handleChange(e.target.value, 'description')}
              />
            </div>
            <h3>Content</h3>

            <ReactQuill
              ref={(el) => {
                this.quill = el;
              }}
              onChange={html => this.handleChange(html, 'content')}
              value={data[language].content}
              modules={{
                toolbar: {
                  container: [
                    [{ header: '1' }, { header: '2' }],
                    ['bold', 'blockquote'],
                    [{ list: 'ordered' }],
                    ['link', 'image', 'video'],
                    ['clean'],
                    ['code-block'],
                  ],
                  handlers: {
                    image: this.imageHandler,
                  },
                },
              }}
            />
          </article>
          <button className="page__createBtn" type="button" onClick={id ? this.update : this.save}> {id ? 'SAVE' : 'CREATE NEW PAGE' }</button>
        </section>
        {this.convertedPages().map(e => (
          <section className="list" key={nanoid()}>

            <h2>{e.core}</h2>
            <div className="list__cont">
              <span>Alias</span>
              <span>SEO</span>
              <span>Content</span>
              <span>Actions</span>
            </div>

            {e.child
              .sort((a, b) => a.alias.length - b.alias.length)
              .map(child => (
                <div className="list__box" key={nanoid()}>
                  <p>{child.alias}</p>
                  <div>
                    <div>{child.data.en.title || 'No title'}</div>
                    <div>{child.data.en.description || 'No description'}</div>
                  </div>
                  <div>{(child?.data?.en.content.slice(0, 120)) || 'No content'}</div>
                  <button
                    type="button"
                    className="list__btn"
                    onClick={() => this.edit(child, child.alias === e.core && e.child.length > 1)}

                  >
                    Edit
                  </button>
                  <button
                    className="list__btn"
                    type="button"
                    onClick={() => ((e.core === child.alias) && e.child.length > 1
                      ? this.removeAll(e.core)
                      : this.remove(child.id))}
                  >
                    {(e.core === child.alias) && e.child.length > 1 ? 'Remove All' : 'Remove'}
                  </button>
                </div>
              ))}

          </section>
        ))}

      </>
    );
  }
}
