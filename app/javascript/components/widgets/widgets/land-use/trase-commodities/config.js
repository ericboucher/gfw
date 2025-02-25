export default {
  widget: 'traseCommodities',
  title: 'Commodities flow from {location}',
  large: true,
  categories: ['land-use'],
  types: ['country'],
  admins: ['adm0'],
  options: {
    startYears: true,
    endYears: true,
    units: ['t', '%'],
    commodities: true
  },
  dataType: 'trase',
  colors: 'extent',
  metaKey: 'widget_trase',
  sortOrder: {
    landUse: 1
  },
  sentence:
    '<a href="https://trase.earth" target="_blank" rel="noopener noreferrer">According to TRASE</a>, from {startYear} to {endYear}, the top sourcing country for {commodity}, including domestic markets, was {source}. The total trade volume was {volume}, which represented {percentage} of total {location} trade.',
  whitelists: {
    adm0: ['BRA', 'PRY', 'COL', 'PER', 'IDN', 'ECU', 'BOL']
  }
};
