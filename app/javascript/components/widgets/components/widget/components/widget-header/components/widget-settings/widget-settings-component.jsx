import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { track } from 'app/analytics';

import Dropdown from 'components/ui/dropdown';
import Switch from 'components/ui/switch';
import withTooltipEvt from 'components/ui/with-tooltip-evt';

import './widget-settings-styles.scss';

class WidgetSettings extends PureComponent {
  componentDidMount() {
    track('openWidgetSettings', {
      label: `${this.props.widget}`
    });
  }

  getUnitVariable = (items, widget, settings, onSettingsChange, type) => {
    const unit = type === 'categorization system' ? 'source' : type;
    if (items.length <= 1) return null;
    if (items.length === 2) {
      return (
        <Switch
          theme="theme-switch-light"
          label={String(type).toUpperCase()}
          value={settings[unit]}
          options={items}
          onChange={option =>
            onSettingsChange({ value: { [unit]: option }, widget })
          }
        />
      );
    }

    return (
      <Dropdown
        theme="theme-select-light"
        label={unit === 'unit' ? 'UNIT' : 'VARIABLE'}
        value={settings[unit]}
        options={items}
        onChange={option =>
          onSettingsChange({ value: { [unit]: option.value }, widget })
        }
      />
    );
  };

  getExtentYears = (
    extentYears,
    widget,
    loading,
    settings,
    onSettingsChange
  ) => {
    if (extentYears.length === 2) {
      return (
        <Switch
          theme="theme-switch-light"
          label="EXTENT YEAR"
          value={settings.extentYear}
          options={extentYears}
          onChange={option => {
            onSettingsChange({
              value: {
                extentYear: option
              },
              widget
            });
          }}
        />
      );
    }

    return (
      <Dropdown
        theme="theme-select-light"
        label="EXTENT YEAR"
        value={settings.extentYear}
        options={extentYears}
        disabled={loading}
        onChange={option => {
          onSettingsChange({
            value: {
              extentYear: option.value
            },
            widget
          });
        }}
      />
    );
  };

  render() {
    const {
      settings,
      config,
      loading,
      onSettingsChange,
      widget,
      setModalMetaSettings,
      getTooltipContentProps
    } = this.props;
    const {
      units,
      variables,
      sources,
      forestTypes,
      landCategories,
      periods,
      thresholds,
      years,
      startYears,
      endYears,
      tscDriverGroups,
      datasets,
      extentYears,
      types,
      weeks,
      commodities
    } = this.props.options;
    const hasExtraOptions =
      units ||
      variables ||
      periods ||
      years ||
      startYears ||
      endYears ||
      tscDriverGroups ||
      extentYears ||
      datasets ||
      types ||
      weeks ||
      datasets ||
      commodities;

    return (
      <div className="c-widget-settings" {...getTooltipContentProps()}>
        {(!isEmpty(forestTypes) || !isEmpty(landCategories)) && (
          <div className="intersections">
            {!isEmpty(forestTypes) && (
              <Dropdown
                theme="theme-select-light"
                label="FOREST TYPE"
                value={settings.forestType}
                options={forestTypes}
                onChange={option =>
                  onSettingsChange({
                    value: {
                      forestType: (option && option.value) || '',
                      ...(!!(option && option.value === 'ifl') && {
                        extentYear: settings.ifl === '2016' ? 2010 : 2000
                      }),
                      ...(!!(option && option.value === 'primary_forest') && {
                        extentYear: 2000
                      })
                    },
                    widget
                  })
                }
                disabled={loading}
                optionsAction={setModalMetaSettings}
                optionsActionKey="metaKey"
                clearable={
                  settings.hasOwnProperty('clearable') // eslint-disable-line
                    ? settings.clearable
                    : true
                }
                noSelectedValue="All tree cover"
              />
            )}
            {!isEmpty(landCategories) && (
              <Dropdown
                theme="theme-select-light"
                label="LAND CATEGORY"
                value={settings.landCategory}
                options={landCategories}
                onChange={option =>
                  onSettingsChange({
                    value: { landCategory: (option && option.value) || '' },
                    widget
                  })
                }
                disabled={loading}
                optionsAction={setModalMetaSettings}
                optionsActionKey="metaKey"
                clearable={
                  settings.hasOwnProperty('clearable') // eslint-disable-line
                    ? settings.clearable
                    : true
                }
                noSelectedValue="All categories"
              />
            )}
          </div>
        )}
        {hasExtraOptions && (
          <div className="filters">
            {types && (
              <Dropdown
                theme="theme-select-light"
                label="DISPLAY TREES BY"
                value={settings.type}
                options={types}
                disabled={loading}
                onChange={option => {
                  const layers = [...settings.layers];
                  if (layers.length) {
                    const type =
                      settings.type === 'bound2' ? 'species' : 'type';
                    const newType =
                      option.value === 'bound2' ? 'species' : 'type';
                    const activeIndex = settings.layers.indexOf(
                      `plantations_by_${type}`
                    );
                    layers[activeIndex] = `plantations_by_${newType}`;
                  }
                  onSettingsChange({
                    value: {
                      type: option.value,
                      layers
                    },
                    widget
                  });
                }}
                infoAction={() =>
                  setModalMetaSettings('widget_tree_cover_extent')
                }
              />
            )}
            {datasets && (
              <Dropdown
                theme="theme-select-light"
                label="FIRES DATASET"
                value={settings.dataset}
                options={datasets}
                disabled={loading}
                onChange={option =>
                  onSettingsChange({ value: { dataset: option.value }, widget })
                }
              />
            )}
            {commodities && (
              <Dropdown
                theme="theme-select-light"
                label="COMMODITY"
                value={settings.commodity}
                options={commodities}
                disabled={loading}
                onChange={option =>
                  onSettingsChange({
                    value: { commodity: option.value },
                    widget
                  })
                }
              />
            )}
            {tscDriverGroups && (
              <Dropdown
                theme="theme-select-light"
                label="DRIVERS"
                value={settings.tscDriverGroup}
                options={tscDriverGroups}
                disabled={loading}
                onChange={option =>
                  onSettingsChange({
                    value: { tscDriverGroup: option.value },
                    widget
                  })
                }
              />
            )}
            {weeks && (
              <Dropdown
                theme="theme-select-light"
                label="SHOW DATA FOR THE LAST"
                value={settings.weeks}
                options={weeks}
                disabled={loading}
                onChange={option =>
                  onSettingsChange({ value: { weeks: option.value }, widget })
                }
              />
            )}
            {extentYears &&
              settings.forestType !== 'ifl' &&
              settings.forestType !== 'primary_forest' &&
              (config.type !== 'loss' ||
                !settings.unit ||
                (settings.unit === '%' && config.type === 'loss')) &&
              this.getExtentYears(
                extentYears,
                widget,
                loading,
                settings,
                onSettingsChange
              )}
            {units &&
              this.getUnitVariable(
                units,
                widget,
                settings,
                onSettingsChange,
                'unit'
              )}
            {variables &&
              this.getUnitVariable(
                variables,
                widget,
                settings,
                onSettingsChange,
                'variable'
              )}
            {sources &&
              this.getUnitVariable(
                sources,
                widget,
                settings,
                onSettingsChange,
                'categorization system'
              )}
            {periods && (
              <Dropdown
                theme="theme-select-light"
                label="YEAR"
                value={settings.period}
                options={periods}
                onChange={option =>
                  onSettingsChange({ value: { period: option.value }, widget })
                }
              />
            )}
            {years && (
              <Dropdown
                theme="theme-select-light"
                label="YEAR"
                value={settings.year}
                options={years}
                onChange={option =>
                  onSettingsChange({ value: { year: option.value }, widget })
                }
              />
            )}
            {startYears &&
              endYears && (
              <div className="years-select">
                <span className="label">YEARS</span>
                <div className="select-container">
                  <Dropdown
                    className="years-dropdown"
                    theme="theme-dropdown-button"
                    value={settings.startYear}
                    options={startYears}
                    onChange={option =>
                      onSettingsChange({
                        value: { startYear: option.value },
                        widget
                      })
                    }
                    disabled={loading}
                  />
                  <span className="text-date">to</span>
                  <Dropdown
                    theme="theme-dropdown-button"
                    value={settings.endYear}
                    options={endYears}
                    onChange={option =>
                      onSettingsChange({
                        value: { endYear: option.value },
                        widget
                      })
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {thresholds && (
          <Dropdown
            className={hasExtraOptions ? 'threshold-border' : ''}
            theme="theme-dropdown-button canopy-select"
            label="CANOPY DENSITY"
            value={settings.threshold}
            options={thresholds}
            onChange={option =>
              onSettingsChange({ value: { threshold: option.value }, widget })
            }
            disabled={loading}
            infoAction={() => setModalMetaSettings('widget_canopy_density')}
          />
        )}
      </div>
    );
  }
}

WidgetSettings.propTypes = {
  forestTypes: PropTypes.array,
  landCategories: PropTypes.array,
  datasets: PropTypes.array,
  thresholds: PropTypes.array,
  units: PropTypes.array,
  periods: PropTypes.array,
  years: PropTypes.array,
  settings: PropTypes.object,
  config: PropTypes.object,
  startYears: PropTypes.array,
  endYears: PropTypes.array,
  tscDriverGroups: PropTypes.array,
  loading: PropTypes.bool,
  options: PropTypes.object,
  onSettingsChange: PropTypes.func,
  widget: PropTypes.string,
  setModalMetaSettings: PropTypes.func,
  getTooltipContentProps: PropTypes.func.isRequired
};

export default withTooltipEvt(WidgetSettings);
