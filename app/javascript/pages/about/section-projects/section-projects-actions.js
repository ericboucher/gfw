import { createAction, createThunkAction } from 'redux-tools';

import { fetchAllProjects } from 'services/projects';

export const setProjectsLoading = createAction('setProjectsLoading');
export const setProjectsData = createAction('setProjectsData');
export const setCategorySelected = createAction('setCategorySelected');

export const fetchProjects = createThunkAction(
  'fetchProjects',
  () => (dispatch, getState) => {
    const { aboutProjects } = getState();
    if (aboutProjects && !aboutProjects.loading) {
      dispatch(setProjectsLoading({ loading: true, error: false }));
      fetchAllProjects()
        .then(data => {
          const { rows } = data.data;
          const dataParsed =
            rows &&
            rows.map(d => ({
              id: d.organization,
              title: d.organization,
              description: d.story,
              latitude: d.latitude_average,
              longitude: d.longitude_average,
              link: d.link,
              category: d.use_case_type_how_to_portal,
              sgf: d.sgf
            }));
          dispatch(setProjectsData(dataParsed));
        })
        .catch(error => {
          console.error(error);
          dispatch(setProjectsLoading({ loading: false, error: true }));
        });
    }
  }
);
