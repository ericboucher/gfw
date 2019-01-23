export default {
  widget: 'firesAlerts',
  title: 'Fire Alerts in {location}',
  large: true,
  categories: ['climate'],
  options: {
    years: true
  },
  analysis: true,
  types: ['country'],
  admins: ['adm0'],
  layers: [],
  colors: 'fires',
  metaKey: 'source-insights-glad-alerts',
  sortOrder: {
    summary: 100,
    forestChange: 100
  },
  sentences: {
    cumulative_deforestation: `By week {weeknum} of {year}, there were {alerts} 
confirmed alerts and {loss} of tree cover loss, comprising {budget} of 
the annual budget.`,
    cumulative_emissions: `By week {weeknum} of {year}, there were {alerts} 
confirmed alerts and {emissions} CO\u2082 emissions, comprising {budget} of 
the annual budget.`
  },
  whitelists: {
    adm0: [
      'BRA',
      'BRN',
      'BDI',
      'CMR',
      'CAF',
      'COD',
      'GNQ',
      'GAB',
      'IDN',
      'MYS',
      'PNG',
      'PER',
      'COG',
      'RWA',
      'SGP',
      'TLS'
    ]
  }
};
