import {createSlice} from '@reduxjs/toolkit'

export const gallerySlice = createSlice({
    name: 'gallery',
    initialState: {
        images: [],
        activeImageIndex: null
    },
    reducers: {
        update: {
            reducer: (state, action) => {
                state.images = action.payload;

                if (action.payload.length === 1) {
                    state.activeImageIndex = 0;
                }
            },
        },
        clear: {
            reducer: (state, action) => {
                state.images = [];
                state.activeImageIndex = null;
            }
        },
        updateActiveImageIndex: {
            reducer: (state, action) => {
                state.activeImageIndex = action.payload;
            }
        }
    },
})
// Action creators are generated for each case reducer function
export const {update, clear, updateActiveImageIndex} = gallerySlice.actions
export default gallerySlice.reducer
