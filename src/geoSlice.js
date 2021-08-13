import {createSlice} from '@reduxjs/toolkit'
import {sliderEndYear, sliderStartYear} from './leftPanel/LeftPanel'

export const geoSlice = createSlice({
    name: 'geo',
    initialState: {
        gson: null,
        filtered: null
    },
    reducers: {
        set: {
            reducer: (state, action) => {
                state.gson = action.payload;
            },
        },
        filterByYears: {
            reducer: (state, action) => {
                const startYear = action.payload[0];
                const endYear = action.payload[1];
                const gson = JSON.parse(JSON.stringify(state.gson));
                if (startYear !== sliderStartYear || endYear !== sliderEndYear) {
                    gson.features = gson.features.filter(function (feature) {
                        return feature.properties.years.some(element => {
                            return element >= startYear && element <= endYear;
                        });
                    });
                }
                state.filtered = gson;
            }
        }
    },
})
// Action creators are generated for each case reducer function
export const {set, filterByYears} = geoSlice.actions
export default geoSlice.reducer
