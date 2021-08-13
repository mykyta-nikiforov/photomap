import {configureStore} from '@reduxjs/toolkit'
import galleryReducer from './gallery/gallerySlice'
import geoReducer from './geoSlice'

export default configureStore({
    reducer: {
        gallery: galleryReducer,
        geo: geoReducer,
    }
})
