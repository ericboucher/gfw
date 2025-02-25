import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import twitterIcon from 'assets/icons/twitter.svg';
import facebookIcon from 'assets/icons/facebook.svg';

import Switch from 'components/ui/switch';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon/icon';
import Loader from 'components/ui/loader';
import Modal from '../modal';

import './share-styles.scss';

class Share extends PureComponent {
  getContent() {
    const {
      selected,
      loading,
      copied,
      data,
      handleFocus,
      setShareSelected,
      handleCopyToClipboard
    } = this.props;
    const { title, shareUrl, embedUrl, embedSettings } = data || {};

    const inputValue =
      selected === 'embed'
        ? `<iframe width="${embedSettings.width}" height="${
          embedSettings.height
        }" frameborder="0" src="${embedUrl}"></iframe>`
        : shareUrl;

    return (
      <div className="c-share">
        <div className="actions">
          {embedUrl ? (
            <Switch
              className="share-switch-tab"
              theme="theme-switch-light"
              value={selected}
              options={[
                { label: 'LINK', value: 'link' },
                { label: 'EMBED', value: 'embed' }
              ]}
              onChange={
                selected === 'embed'
                  ? () => setShareSelected('link')
                  : () => setShareSelected('embed')
              }
            />
          ) : null}
          <p className="info">
            {selected === 'embed'
              ? 'Click and paste HTML to embed in website'
              : 'Click and paste link in email or IM'}
          </p>
          <div className="input-container">
            <div className="input">
              {loading &&
                selected !== 'embed' && <Loader className="input-loader" />}
              <input
                ref={input => {
                  this.textInput = input;
                }}
                type="text"
                value={!loading ? inputValue : ''}
                readOnly
                onClick={handleFocus}
              />
            </div>
            <Button
              theme="theme-button-medium"
              className="input-button"
              onClick={() => handleCopyToClipboard(this.textInput)}
              disabled={loading}
            >
              {copied ? 'COPIED!' : 'COPY'}
            </Button>
          </div>
        </div>
        <div className="social-container">
          <Button
            extLink={`https://twitter.com/intent/tweet?text=${
              title
            }&via=globalforests&url=${shareUrl}`}
            className="social-button"
            theme="theme-button-light theme-button-grey  square"
            onClick={() =>
              track('shareSocial', {
                label: shareUrl
              })
            }
          >
            <Icon icon={twitterIcon} className="twitter-icon" />
          </Button>
          <Button
            extLink={`https://www.facebook.com/sharer.php?u=${shareUrl}`}
            theme="theme-button-light theme-button-grey square"
            className="social-button"
            onClick={() =>
              track('shareSocial', {
                label: shareUrl
              })
            }
          >
            <Icon icon={facebookIcon} className="facebook-icon" />
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { open, setShareOpen, data } = this.props;
    return (
      <Modal
        isOpen={open}
        contentLabel={`Share: ${data && data.title}`}
        onRequestClose={() => setShareOpen(false)}
        title={this.props.data && this.props.data.title}
      >
        {this.getContent()}
      </Modal>
    );
  }
}

Share.propTypes = {
  open: PropTypes.bool,
  selected: PropTypes.string,
  copied: PropTypes.bool,
  data: PropTypes.object,
  loading: PropTypes.bool,
  setShareOpen: PropTypes.func,
  setShareSelected: PropTypes.func,
  handleFocus: PropTypes.func,
  handleCopyToClipboard: PropTypes.func
};

export default Share;
