import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { CancelToken } from 'axios';
import reducerRegistry from 'app/registry';

import { setMapSettings } from 'components/map/actions';
import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import { getRecentImageryProps } from './selectors';

const actions = {
  ...ownActions,
  setMapSettings
};

const mapStateToProps = getRecentImageryProps;

class RecentImageryContainer extends PureComponent {
  componentDidMount = () => {
    const {
      active,
      position,
      dates,
      settings,
      getRecentImageryData
    } = this.props;
    if (this.getDataSource) {
      this.getDataSource.cancel();
    }
    this.getDataSource = CancelToken.source();
    if (active) {
      getRecentImageryData({
        ...position,
        start: dates.start,
        end: dates.end,
        bands: settings.bands,
        token: this.getDataSource.token
      });
    }
  };

  componentDidUpdate = prevProps => {
    const {
      active,
      dataStatus,
      activeTile,
      sources,
      dates,
      settings,
      getRecentImageryData,
      getMoreTiles,
      positionInsideTile,
      position,
      loadingMoreTiles,
      resetRecentImageryData,
      error
    } = this.props;

    const isNewTile =
      activeTile &&
      !!activeTile.url &&
      (!prevProps.activeTile || activeTile.url !== prevProps.activeTile.url);

    // get data if activated or new props
    if (
      (active &&
        (active !== prevProps.active ||
          (!positionInsideTile &&
            !isEqual(positionInsideTile, prevProps.positionInsideTile)) ||
          !isEqual(settings.date, prevProps.settings.date) ||
          !isEqual(settings.weeks, prevProps.settings.weeks) ||
          !isEqual(settings.bands, prevProps.settings.bands))) ||
      (!error && !isEqual(error, prevProps.error))
    ) {
      if (this.getDataSource) {
        this.getDataSource.cancel(
          'Cancelling duplicate fetch for recent imagery'
        );
      }
      this.getDataSource = CancelToken.source();
      getRecentImageryData({
        ...position,
        start: dates.start,
        end: dates.end,
        bands: settings.bands,
        token: this.getDataSource.token
      });
    }

    // get the rest of the tiles
    if (
      dataStatus &&
      !dataStatus.haveAllData &&
      !loadingMoreTiles &&
      active &&
      activeTile
    ) {
      getMoreTiles({
        sources,
        dataStatus,
        bands: settings.bands
      });
    }

    // if new tile update on map
    if (active && isNewTile) {
      this.setTile();
    }

    if (!active && active !== prevProps.active) {
      this.removeTile();
      resetRecentImageryData();
    }
  };

  setTile = debounce(() => {
    const { datasets, activeTile, recentImageryDataset } = this.props;
    if (recentImageryDataset && activeTile && activeTile.url) {
      const activeDatasets =
        datasets &&
        !!datasets.length &&
        datasets.filter(d => !d.isRecentImagery);
      const recentDataset = {
        dataset: recentImageryDataset.dataset,
        layers: [recentImageryDataset.layer],
        visibility: true,
        opacity: 1,
        isRecentImagery: true,
        params: {
          url: activeTile.url
        }
      };
      this.props.setMapSettings({
        datasets: activeDatasets
          ? activeDatasets.concat(recentDataset)
          : [recentDataset]
      });
    }
  }, 200);

  removeTile() {
    const { datasets, setRecentImagerySettings } = this.props;
    const activeDatasets =
      datasets && !!datasets.length && datasets.filter(d => !d.isRecentImagery);
    this.props.setMapSettings({
      datasets: activeDatasets || []
    });
    setRecentImagerySettings({
      selectedIndex: 0,
      selected: null
    });
  }

  render() {
    return null;
  }
}

RecentImageryContainer.propTypes = {
  position: PropTypes.object,
  loadingMoreTiles: PropTypes.bool,
  active: PropTypes.bool,
  dataStatus: PropTypes.object,
  activeTile: PropTypes.object,
  positionInsideTile: PropTypes.bool,
  sources: PropTypes.array,
  dates: PropTypes.object,
  settings: PropTypes.object,
  getRecentImageryData: PropTypes.func,
  getMoreTiles: PropTypes.func,
  datasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  recentImageryDataset: PropTypes.object,
  resetRecentImageryData: PropTypes.func,
  setRecentImagerySettings: PropTypes.func,
  error: PropTypes.bool
};

reducerRegistry.registerModule('recentImagery', {
  actions: ownActions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(RecentImageryContainer);
