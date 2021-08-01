import {configureStore} from '@reduxjs/toolkit'
import galleryReducer from './slider/gallerySlice'

export default configureStore({
    reducer: {
        gallery: galleryReducer,
    }
})
