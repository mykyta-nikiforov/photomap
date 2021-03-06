/** @jsx jsx */
import React, {useCallback, useEffect, useRef} from 'react'
import {css, jsx} from '@emotion/react'
import {clear, updateActiveImageIndex, updateColorized} from "./gallerySlice";
import {useDispatch, useSelector} from "react-redux";
import CloseButton from "./CloseButton";
import ImageInfo from "./ImageInfo";
import {CSSTransitionGroup} from 'react-transition-group' // ES6
import './Gallery.css';
import ImageThumbnail from "./ImageThumbnail";
import Toggle from 'react-toggle'

/**
 * @function Slider
 */

const Gallery = props => {
    const images = useSelector((state) => state.gallery.images);
    const activeImageIndex = useSelector((state) => state.gallery.activeImageIndex);
    const prevActiveImageIndex = useSelector((state) => state.gallery.prevActiveImageIndex);

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

    // Dispatchers
    const dispatch = useDispatch();

    const closeGallery = () => {
        dispatch(clear());
    }

    const setActive = (i) => {
        const value = activeImageIndex === i ? null : i;
        setActiveImageIndex(value);
    };

    const setActiveImageIndex = (i) => {
        dispatch(updateActiveImageIndex(i));
    }

    // Close on outside click
    const wrapperRef = useRef(null);
    useOutsideClose(wrapperRef);

    // Scroll to opened imageInfo
    const infoBoxRef = useCallback((node) => {
        let timer;
        if (node !== null) {
            let timeoutTime = prevActiveImageIndex === null ? 250 : 0;
            timer = setTimeout(() => {
                node.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            }, timeoutTime);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [prevActiveImageIndex]);

    // Keydown handler: left/right
    function keydownHandler({key}) {
        if (key === "ArrowLeft") {
            setActiveImageIndex(prevImageIndex());
        } else if (key === "ArrowRight") {
            setActiveImageIndex(nextImageIndex());
        }
    }

    const isDisplayColorized = useSelector((state) => state.gallery.isDisplayColorized);

    function handleColorizedToggle() {
        dispatch(updateColorized(!isDisplayColorized));
    }

    useEffect(() => {
        if (activeImageIndex != null) {
            window.addEventListener("keydown", keydownHandler);
            // Remove event listeners on cleanup
            return () => {
                window.removeEventListener("keydown", keydownHandler);
            };
        }
    }, [activeImageIndex]);

    return images.length === 0 ? null : (
        <div css={GalleryContainerCSS} className="galleryContainer">
            <div css={GalleryTopPanel}>
                <div className={'gallery-toolbox'}>
                    <label css={labelCss}>
                        <Toggle
                            defaultChecked={isDisplayColorized}
                            icons={false}
                            onChange={handleColorizedToggle} />
                        <span style={{marginLeft: '3px'}}>?????????????????????????? ????????</span>
                    </label>
                </div>
            </div>
            <CloseButton onClick={closeGallery}/>
            <div class={'images-container'}>
                <ul css={ulCSS} className="itemsContainer">
                    {images.map((image, i) => (
                        <li ref={wrapperRef}>
                            <div css={activeImageIndex === i ? selectedImgCSS : null}>
                                <ImageThumbnail
                                    image={image}
                                    onClick={() => setActive(i)}
                                />
                            </div>
                            <div
                                css={activeImageIndex === i ? SelectedImageInfoContainerCSS : NonSelectedImageInfoContainerCSS}
                            >
                                <CSSTransitionGroup
                                    transitionName="imageInfo"
                                    transitionEnterTimeout={200}
                                    transitionLeaveTimeout={200}
                                    transitionEnter={activeImageIndex !== null && prevActiveImageIndex === null}
                                    transitionLeave={activeImageIndex === null}>
                                    {activeImageIndex === i ? <ImageInfo
                                        ref={infoBoxRef}
                                        key={image.title}
                                        image={image}
                                        arrowsActive={images.length > 1}
                                        prevImageIndex={prevImageIndex()}
                                        nextImageIndex={nextImageIndex()}
                                    /> : null}
                                </CSSTransitionGroup>
                            </div>
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

const GalleryTopPanel = css`
    width: 100%;
    height: 45px;
    background-color:white;
    position: fixed;
    z-index: 500;
`;

const labelCss = css`
    display: flex;  
    align-items: center;
    justify-content: center;
    width: 210px;
`;

const ulCSS = css`
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    gap: 10px;
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

const SelectedImageInfoContainerCSS = css`
                    height: 66vh;
                    z-index: 100;
                    `;

const NonSelectedImageInfoContainerCSS = css`
                    height: 0vh;
                    z-index: 100;
                    `;

export default Gallery
