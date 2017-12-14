import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetTreeCoverGainSettings from './widget-tree-gain-settings-component';
import './widget-tree-gain-styles.scss';

class WidgetTreeCoverGain extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      indicators,
      settings,
      getSentence,
      setTreeCoverGainSettingsIndicator
    } = this.props;

    return (
      <div className="c-widget c-widget-tree-cover-gain">
        <WidgetHeader
          title={`TREE COVER GAIN IN ${locationNames.current &&
            locationNames.current.label}`}
          shareAnchor={'tree-cover-gain'}
        >
          <WidgetTreeCoverGainSettings
            type="settings"
            indicators={indicators}
            settings={settings}
            onIndicatorChange={setTreeCoverGainSettingsIndicator}
            isLoading={isLoading}
            locationNames={locationNames}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="container">
            <div className="info">
              <p className="title">Hansen - UMD</p>
              <p
                dangerouslySetInnerHTML={getSentence()} // eslint-disable-line
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCoverGain.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  indicators: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired,
  setTreeCoverGainSettingsIndicator: PropTypes.func.isRequired
};

export default WidgetTreeCoverGain;
