/** @jsx jsx */
import React, {useEffect, useRef, useState} from 'react'
import {css, jsx} from '@emotion/react'
import {clear, updateActiveImageIndex} from "./gallerySlice";
import {useDispatch, useSelector} from "react-redux";
import CloseButton from "./CloseButton";
import ImageInfo from "./ImageInfo";

/**
 * @function Slider
 */

const Gallery = props => {
    const dispatch = useDispatch();
    const getWidth = () => window.innerWidth;

    const [state, setState] = useState({
        translate: 0,
        transition: 0.45
    });

    const images = useSelector((state) => state.gallery.images);
    const activeImageIndex = useSelector((state) => state.gallery.activeImageIndex);

    const nextImageIndex = () => {
        if (activeImageIndex === images.length - 1) {
            return 0;
        } else {
            return activeImageIndex + 1;
        }
    }

    const prevImageIndex = () => {
        if (activeImageIndex === 0) {
            return images.length - 1;
        } else {
            return activeImageIndex - 1;
        }
    };

    const closeGallery = () => {
        dispatch(clear());
    }

    const setActive = (i) => {
        const value = activeImageIndex === i ? null : i;
        dispatch(updateActiveImageIndex(value));
    };

    const wrapperRef = useRef(null);
    useOutsideClose(wrapperRef);

    return images.length === 0 ? null : (
        <div css={GalleryContainerCSS} className="galleryContainer">
            <CloseButton onClick={closeGallery}/>
            <div css={ImagesContainerCSS}>
                <ul css={ulCSS} className="itemsContainer">
                    {images.map((image, i) => (
                        <li ref={wrapperRef}>
                            <div css={activeImageIndex === i ? selectedImgCSS : null}>
                                <img css={imgCSS} src={image.thumbUrl} onClick={() => setActive(i)}/>
                            </div>

                            {activeImageIndex === i ? <ImageInfo
                                image={image}
                                arrowsActive={images.length > 1}
                                prevImageIndex={prevImageIndex()}
                                nextImageIndex={nextImageIndex()}
                            /> : null}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

function useOutsideClose(ref) {
    const dispatch = useDispatch();
    useEffect(() => {

        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current
                && (typeof event.target.className === 'string'
                    && (event.target.className.includes("itemsContainer")
                        || event.target.className.includes("galleryContainer")))
                && !ref.current.contains(event.target)) {
                dispatch(clear());
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

const GalleryContainerCSS = css`
    position: relative;
    height: 100vh;
    width: 100vw;
    margin: 0 auto;
    overflow: auto;
    background-color:rgba(0, 0, 0, 0.8);
    z-index: 100;    
`;

const ImagesContainerCSS = css`
    margin: 50px 20px 10px 60px;
`;

const ulCSS = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
`;

const imgCSS = css`
    height: 25vh;
    object-fit: cover;
    vertical-align: bottom;
    cursor: pointer;
`;

const selectedImgCSS = css`
    ::after {
    top: auto;
    border: solid transparent;
    content: '';
    pointer-events: none;
    border-bottom-color: #fff;
    border-width: 15px;
    margin: -17px 0 0 0;
    width: 0;
    height: 0;
    left: calc(50% - 15px);
    position: relative;
    display: block;
    }
`;

export default Gallery
