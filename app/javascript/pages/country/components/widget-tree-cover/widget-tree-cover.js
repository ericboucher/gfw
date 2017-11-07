import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

import {
  getTotalCover,
  getTotalIntactForest
} from '../../../../services/tree-cover';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeCover.isLoading,
  isUpdating: state.widgetTreeCover.isUpdating,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryRegions: state.root.countryRegions,
  countryData: state.root.countryData,
  totalCover: state.widgetTreeCover.totalCover,
  totalIntactForest: state.widgetTreeCover.totalIntactForest,
  totalNonForest: state.widgetTreeCover.totalNonForest,
  locations: state.widgetTreeCover.locations,
  canopies: state.widgetTreeCover.canopies,
  settings: state.widgetTreeCover.settings
});

const WidgetTreeCoverContainer = (props) => {
  const setInitialData = (props) => {
    setWidgetData(props);
  };

  const updateData = (props) => {
    props.setTreeCoverIsUpdating(true);
    setWidgetData(props);
  };

  const setWidgetData = (props) => {
    getTotalCover(props.iso, props.countryRegion, props.settings.canopy)
      .then((totalCoverResponse) => {
        getTotalIntactForest(props.iso, props.countryRegion)
          .then((totalIntactForestResponse) => {
            const totalCover = Math.round(totalCoverResponse.data.data[0].value),
              totalIntactForest = Math.round(totalIntactForestResponse.data.data[0].value),
              totalNonForest = Math.round(props.countryData.area_ha) - (totalCover + totalIntactForest),
              values = {
                totalCover: totalCover,
                totalIntactForest:  totalIntactForest,
                totalNonForest: totalNonForest,
                locations: [
                  {
                    value: 'all',
                    label: 'All Region'
                  },
                  {
                    value: 'managed',
                    label: 'Managed'
                  },
                  {
                    value: 'protected_areas',
                    label: 'Protected Areas'
                  },
                  {
                    value: 'ifls',
                    label: 'IFLs'
                  }
                ]
              };
            props.setTreeCoverValues(values);
          });
      });
  };

  const viewOnMap = () => {
    props.setLayer('forest2000');
  };

  return createElement(WidgetTreeCoverComponent, {
    ...props,
    setInitialData,
    updateData,
    viewOnMap
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
