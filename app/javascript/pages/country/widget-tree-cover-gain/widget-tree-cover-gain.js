import { createElement } from 'react';
import { connect } from 'react-redux';

import {
  getTreeCoverGain,
  getTotalCountriesTreeCoverGain
} from 'services/tree-gain';

import WidgetTreeCoverGainComponent from './widget-tree-cover-gain-component';
import actions from './widget-tree-cover-gain-actions';

export { initialState } from './widget-tree-cover-gain-reducers';
export { default as reducers } from './widget-tree-cover-gain-reducers';
export { default as actions } from './widget-tree-cover-gain-actions';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeCoverGain.isLoading,
  iso: state.root.iso,
  admin1: state.root.admin1,
  countryData: state.root.countryData,
  admin1List: state.root.admin1List,
  totalAmount: state.widgetTreeCoverGain.totalAmount,
  percentage: state.widgetTreeCoverGain.percentage,
  settings: state.widgetTreeCoverGain.settings,
  locations: state.widgetTreeCoverGain.locations
});

const WidgetTreeCoverGainContainer = props => {
  const setInitialData = newProps => {
    setWidgetData(newProps);
  };

  const updateData = newProps => {
    newProps.setTreeCoverGainIsLoading(true);
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    getTreeCoverGain(
      newProps.iso,
      {
        minYear: newProps.settings.startYear,
        maxYear: newProps.settings.endYear
      },
      newProps.settings.canopy,
      newProps.admin1
    ).then(coverGain => {
      getTotalCountriesTreeCoverGain(
        {
          minYear: newProps.settings.startYear,
          maxYear: newProps.settings.endYear
        },
        newProps.settings.canopy
      ).then(totalCoverGain => {
        const percentage =
          coverGain.data.data[0].value / totalCoverGain.data.data[0].value;
        const values = {
          totalAmount: coverGain.data.data[0].value,
          percentage: percentage * 100
        };
        props.setTreeCoverGainValues(values);
      });
    });
  };

  return createElement(WidgetTreeCoverGainComponent, {
    ...props,
    setInitialData,
    updateData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer);
