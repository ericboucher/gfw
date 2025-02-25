export default {
  widget: 'treeLossLocated',
  title: 'Location of tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  options: {
    units: ['ha', '%'],
    forestTypes: ['ifl', 'primary_forest', 'mangroves_2016'],
    landCategories: true,
    thresholds: true,
    startYears: true,
    endYears: true,
    extentYears: true
  },
  colors: 'loss',
  layers: ['loss'],
  datasets: [
    // loss
    {
      dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
      layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6']
    }
  ],
  metaKey: 'widget_tree_cover_loss_location',
  sortOrder: {
    summary: 2,
    forestChange: 3
  },
  sentences: {
    initial:
      'In {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most tree cover loss at {value} compared to an average of {average}.',
    withIndicator:
      'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most tree cover loss at {value} compared to an average of {average}.',
    initialPercent:
      'In {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most relative tree cover loss at {value} compared to an average of {average}.',
    withIndicatorPercent:
      'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most relative tree cover loss at {value} compared to an average of {average}.',
    noLoss: 'There was no tree cover loss identified in {location}.'
  }
};
