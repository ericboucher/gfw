import { createSelector, createStructuredSelector } from 'reselect';
import bbox from 'turf-bbox';
import lineString from 'turf-linestring';

import {
  getActiveDatasetsFromState,
  getBasemap
} from 'components/map/selectors';

import { descriptions, topics, stories } from './sections';

const selectSection = (state, { exploreType }) => exploreType;
const selectPTWLoading = state => state.ptw && state.ptw.loading;
const selectPTWData = state => {
  const { data } = state.ptw || {};

  return (
    data &&
    data.map(d => {
      const bboxCoords = d.bbox.slice(0, 4);
      const bboxFromCoords = bbox(lineString(bboxCoords));
      const reverseBbox = [
        bboxFromCoords[1],
        bboxFromCoords[0],
        bboxFromCoords[3],
        bboxFromCoords[2]
      ];

      return {
        id: d.cartodb_id,
        image: d.image,
        imageCredit: d.image_source,
        title: d.name,
        summary: d.description,
        buttons: [
          {
            text: 'READ MORE',
            extLink: d.link,
            theme: 'theme-button-light theme-button-small'
          },
          {
            text: 'VIEW ON MAP',
            theme: 'theme-button-small'
          }
        ],
        payload: {
          mergeQuery: true,
          map: {
            datasets: [
              // admin boundaries
              {
                dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
                layers: [
                  '6f6798e6-39ec-4163-979e-182a74ca65ee',
                  'c5d1e010-383a-4713-9aaa-44f728c0571c'
                ],
                opacity: 1,
                visibility: true
              },
              // GLADs
              {
                dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
                layers: [
                  '581ecc62-9a70-4ef4-8384-0d59363e511d',
                  'dd5df87f-39c2-4aeb-a462-3ef969b20b66'
                ],
                opacity: 1,
                visibility: true
              }
            ],
            bbox: reverseBbox,
            basemap: {
              value: 'default'
            },
            label: 'default'
          }
        }
      };
    })
  );
};

const selectedData = createSelector([selectPTWData], ptw => ({
  topics: Object.values(topics),
  placesToWatch: ptw,
  stories: Object.values(stories)
}));

const getCardsData = createSelector(
  [selectSection, selectedData],
  (section, data) => {
    if (!data) return null;
    return data[section];
  }
);

const getLoading = createSelector(
  [selectSection, selectPTWLoading],
  (section, ptwLoading) => {
    if (section === 'topics') return false;
    return ptwLoading;
  }
);

const getDescription = createSelector(
  [selectSection],
  section => descriptions[section]
);

const getCurrentMapPayload = createSelector(
  [getActiveDatasetsFromState, getBasemap],
  (datasets, basemap) => ({
    datasets,
    basemap
  })
);

export const mapStateToProps = createStructuredSelector({
  data: getCardsData,
  section: selectSection,
  description: getDescription,
  mapState: getCurrentMapPayload,
  loading: getLoading
});
