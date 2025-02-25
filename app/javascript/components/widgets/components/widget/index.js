import { createElement, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import { setMapSettings } from 'components/map/actions';
import * as ownActions from 'components/widgets/actions';
import WidgetComponent from './component';
import { getWidgetProps } from './selectors';

const actions = {
  ...ownActions,
  setMapSettings
};

const makeMapStateToProps = () => {
  const getWidgetPropsObject = getWidgetProps();
  const mapStateToProps = (state, props) => ({
    ...getWidgetPropsObject(state, props)
  });
  return mapStateToProps;
};

class WidgetContainer extends Component {
  componentDidMount() {
    const {
      getData,
      getWidgetData,
      widget,
      location,
      settings,
      data
    } = this.props;
    const params = { ...location, ...settings };
    if (!data || data.noContent) {
      getWidgetData({ widget, getData, params });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      settings,
      getData,
      getWidgetData,
      widget,
      error
    } = this.props;
    const settingsUpdateBlackList = [
      'year',
      'activeData',
      'weeks',
      'page',
      'highlighted',
      'unit'
    ];
    let changedSetting = '';
    if (settings && prevProps.settings) {
      Object.keys(settings).forEach(s => {
        if (!isEqual(settings[s], prevProps.settings[s])) {
          changedSetting = s;
        }
      });
    }
    const hasSettingsChanged =
      settings &&
      prevProps.settings &&
      changedSetting &&
      !settingsUpdateBlackList.includes(changedSetting);
    const hasLocationChanged = !isEqual(location, prevProps.location);
    const hasErrorChanged =
      prevProps.error !== undefined &&
      !error &&
      !isEqual(error, prevProps.error);
    const params = { ...location, ...settings };
    if (hasSettingsChanged || hasLocationChanged || hasErrorChanged) {
      getWidgetData({ widget, getData, params });
    }
  }

  componentWillUnmount = () => {
    const { widget, setWidgetData } = this.props;
    setWidgetData({ widget, data: {} });
  };

  handleDataHighlight = (highlighted, widget) => {
    const { setWidgetSettings } = this.props;
    setWidgetSettings({
      value: {
        highlighted
      },
      widget
    });
  };

  render() {
    return createElement(WidgetComponent, {
      ...this.props,
      handleDataHighlight: this.handleDataHighlight
    });
  }
}

WidgetContainer.propTypes = {
  settings: PropTypes.object,
  location: PropTypes.object,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  getData: PropTypes.func,
  getWidgetData: PropTypes.func,
  setWidgetData: PropTypes.func,
  setWidgetSettings: PropTypes.func,
  widget: PropTypes.string,
  error: PropTypes.bool
};

export default connect(makeMapStateToProps, actions)(WidgetContainer);
