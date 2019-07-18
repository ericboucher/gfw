import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { CancelToken } from 'axios';
import reducerRegistry from 'app/registry';

import { setSubscribeSettings } from 'components/modals/subscribe/actions';
import { setSaveAOISettings } from 'components/modals/save-aoi/actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getAnalysisProps } from './selectors';
import AnalysisComponent from './component';

class AnalysisContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getAnalysis: PropTypes.func,
    endpoints: PropTypes.array,
    clearAnalysis: PropTypes.func,
    setAnalysisLoading: PropTypes.func,
    analysisLocation: PropTypes.object,
    aois: PropTypes.array
  };

  componentDidMount() {
    const { endpoints, location, analysisLocation } = this.props;
    const hasLocationChanged = !isEqual(
      { ...location, endpoints },
      analysisLocation
    );
    if (
      hasLocationChanged &&
      location.type &&
      location.adm0 &&
      endpoints &&
      endpoints.length
    ) {
      this.handleFetchAnalysis(location, endpoints);
    }
  }

  componentDidUpdate(prevProps) {
    const { location, endpoints, aois } = this.props;
    const activeArea = aois.find(a => a.id === location.adm0);
    const parsedLocation =
      location.type === 'aoi'
        ? {
          ...location,
          type: 'geostore',
          adm0: activeArea && activeArea.geostore
        }
        : location;

    // get analysis if location changes
    if (
      parsedLocation.type &&
      parsedLocation.adm0 &&
      endpoints &&
      endpoints.length &&
      (!isEqual(endpoints, prevProps.endpoints) ||
        !isEqual(parsedLocation, prevProps.location))
    ) {
      this.handleFetchAnalysis(parsedLocation, endpoints);
    }
  }

  componentWillUnmount() {
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
  }

  handleFetchAnalysis = (location, endpoints) => {
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
    this.analysisFetch = CancelToken.source();
    this.props.getAnalysis({
      endpoints,
      ...location,
      token: this.analysisFetch.token
    });
  };

  handleCancelAnalysis = () => {
    const { clearAnalysis, setAnalysisLoading } = this.props;
    clearAnalysis();
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
    setAnalysisLoading({ loading: false, error: '', errorMessage: '' });
  };

  render() {
    return createElement(AnalysisComponent, {
      ...this.props,
      handleFetchAnalysis: this.handleFetchAnalysis,
      handleCancelAnalysis: this.handleCancelAnalysis
    });
  }
}

reducerRegistry.registerModule('analysis', {
  actions,
  reducers,
  initialState
});

export default connect(getAnalysisProps, {
  ...actions,
  setSubscribeSettings,
  setSaveAOISettings
})(AnalysisContainer);
