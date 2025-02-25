import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { CancelToken } from 'axios';
import { track } from 'app/analytics';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';

import Component from './component';

import { mapStateToProps } from './selectors';

class SearchMenu extends PureComponent {
  componentDidMount() {
    const { search, locations } = this.props;
    if (search && (!locations || !locations.length)) {
      this.handleGetLocations(search);
    }
  }

  componentDidUpdate(prevProps) {
    const { search, lang } = this.props;
    if (search && lang !== prevProps.lang) {
      this.handleGetLocations(search);
    }
  }

  handleGetLocations = debounce(search => {
    if (this.searchFetch) {
      this.searchFetch.cancel();
    }
    this.searchFetch = CancelToken.source();
    this.props.getLocationFromSearch({
      search,
      lang: this.props.lang,
      token: this.searchFetch.token
    });
    track('mapMenuSarch', {
      label: search
    });
  }, 500);

  handleSearchChange = value => {
    const { setMenuSettings, setMenuLoading } = this.props;
    setMenuSettings({ search: value });
    if (value) {
      setMenuLoading(true);
      this.handleGetLocations(value);
    }
  };

  render() {
    return createElement(Component, {
      ...this.props,
      handleSearchChange: this.handleSearchChange
    });
  }
}

SearchMenu.propTypes = {
  getLocationFromSearch: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setMenuLoading: PropTypes.func,
  search: PropTypes.string,
  locations: PropTypes.array,
  lang: PropTypes.string
};

export default connect(mapStateToProps, { onInfoClick: setModalMetaSettings })(
  SearchMenu
);
