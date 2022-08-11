import { Component } from 'react';
import { Layout } from 'antd';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import Header from '../components/layout/header';
import Navigation from '../components/layout/navigation';
import OrganizationProvider from '../providers/organization';

const languages = ['de', 'en', 'es', 'et', 'fi', 'nl'];

const dynamicActivate = locale => {
  /*const { messages } = import(`@lingui/loader!./locales/${locale}/messages.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);*/
};

// Base layout
class BaseLayout extends Component {
  state = {
    collapsed: false,
    catalogs: {},
    language: localStorage.getItem('language') || 'en',
  };

  async componentDidMount() {
    await dynamicActivate(this.state.language);
  }

  setLanguage = async language => {
    // await this.loadLanguage(language);
    this.setState({ language });
    localStorage.setItem('language', language);
  };

  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
    setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
  };

  render() {
    const { children, location } = this.props;
    const { catalogs, language } = this.state;

    if (location.pathname === '/') {
      return (
        <I18nProvider i18n={i18n} catalogs={catalogs} language={language}>
          <OrganizationProvider>
            <Layout style={{ minHeight: '100vh' }}>
              <Header
                backgroundColor={'#f0f2f5'}
                collapsible={false}
                organizationSelect={false}
                logo={true}
                languages={languages}
                setLanguage={this.setLanguage}
              />
              {children}
            </Layout>
          </OrganizationProvider>
        </I18nProvider>
      );
    } else if (location.pathname.includes('pdf')) {
      return (
        <I18nProvider i18n={i18n} catalogs={catalogs} language={language}>
          {children}
        </I18nProvider>
      );
    } else {
      return (
        <I18nProvider i18n={i18n} catalogs={catalogs} language={language}>
          <OrganizationProvider>
            <Layout style={{ minHeight: '100vh' }}>
              <Navigation collapsed={this.state.collapsed} />
              <Layout
                style={{ marginLeft: this.state.collapsed ? 80 : 200, transition: 'all 0.2s' }}
              >
                <Header
                  collapsed={this.state.collapsed}
                  onToggl={this.toggleSider}
                  languages={languages}
                  setLanguage={this.setLanguage}
                />
                {children}
              </Layout>
            </Layout>
          </OrganizationProvider>
        </I18nProvider>
      );
    }
  }
}

export default BaseLayout;
