import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';
import thresholds from 'data/thresholds.json';
import units from 'data/units.json';
import variables from 'data/variables.json';
import sources from 'data/sources.json';
import periods from 'data/periods.json';
import extentYears from 'data/extent-years.json';
import tscDriverGroups from 'data/tsc-loss-groups.json';
import types from 'data/types.json';
import weeks from 'data/weeks.json';
import datasets from 'data/datasets.json';
import ifl from 'data/ifl.json';

export default {
  forestTypes: forestTypes.filter(f => !f.hidden),
  landCategories: landCategories.filter(l => !l.hidden),
  thresholds,
  units,
  periods,
  extentYears,
  tscDriverGroups,
  types,
  weeks,
  datasets,
  variables,
  sources,
  ifl
};
