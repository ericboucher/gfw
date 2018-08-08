import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import helpIcon from 'assets/images/help.png';

import './styles.scss';

class LossStatement extends PureComponent {
  render() {
    const { className } = this.props;

    return (
      <div
        className={`c-loss-statement ${className || ''}`}
        style={{ cursor: `url(${helpIcon}), auto` }}
      >
        Tree cover loss <span>is not always deforestation.</span>
      </div>
    );
  }
}

LossStatement.propTypes = {
  className: PropTypes.string
};

export default LossStatement;
