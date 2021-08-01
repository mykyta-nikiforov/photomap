import {configureStore} from '@reduxjs/toolkit'
import galleryReducer from './gallery/gallerySlice'

export default configureStore({
    reducer: {
        gallery: galleryReducer,
    }
})
