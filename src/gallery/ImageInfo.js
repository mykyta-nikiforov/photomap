/** @jsx jsx */
import React, {forwardRef, useEffect, useState} from 'react'
import {css, jsx} from '@emotion/react'
import Arrow from "./Arrow";
import {updateActiveImageIndex} from "./gallerySlice";
import {useDispatch, useSelector} from "react-redux";
import {SpinnerDiamond} from 'spinners-react';
import './ImageInfo.css';
import FadeIn from "react-fade-in";
import {ReactComponent as ColorIcon} from '../img/chromatic.svg'
import {ReactComponent as BeforeAfter} from '../img/before-after.svg'
import {ReactCompareSlider, ReactCompareSliderImage} from 'react-compare-slider';
import useWindowDimensions from "../util/useWindowDimensions";
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';

const ImageInfo = forwardRef((props, ref) => {
    const image = props.image;
    const dispatch = useDispatch();

    const setActiveImageIndex = (i) => {
        dispatch(updateActiveImageIndex(i));
    };

    // Arrows
    let arrows = null;
    if (props.arrowsActive) {
        arrows = <div>
            <Arrow direction="left" handleClick={() => setActiveImageIndex(props.prevImageIndex)}/>
            <Arrow direction="right" handleClick={() => setActiveImageIndex(props.nextImageIndex)}/>
        </div>;
    }
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const imageStyle = !isImageLoaded ? {display: "none"} : {};

    // Handle colorized or original
    const isDisplayColorized = useSelector((state) => state.gallery.isDisplayColorized);
    const [isDisplayColorizedLocal, setIsDisplayColorizedLocal] = useState(isDisplayColorized);
    const [isDisplayColorizedLocalUpdated, setIsDisplayColorizedLocalUpdated] = useState(false);
    let imageSrc = image.photoUrl;
    if (image.colorized) {
        if (isDisplayColorizedLocal && isDisplayColorizedLocalUpdated) {
            imageSrc = image.colorized.photoUrl;
        } else if (!isDisplayColorizedLocal && isDisplayColorizedLocalUpdated) {
            imageSrc = image.photoUrl;
        } else if (isDisplayColorized) {
            imageSrc = image.colorized.photoUrl;
        }
    }

    const updateImageSrc = () => {
        setIsDisplayColorizedLocal(!isDisplayColorizedLocal);
        setIsDisplayColorizedLocalUpdated(true);
    };

    // Handle comparator
    const [isDisplayComparator, setIsDisplayComparator] = useState(false);
    const handleImageCompare = () => {
        setIsDisplayComparator(!isDisplayComparator);
    };

    useEffect(() => {
        setIsDisplayColorizedLocal(isDisplayColorized);
        setIsDisplayColorizedLocalUpdated(false);
    }, [isDisplayColorized]);

    // Image sizes
    const {windowHeight, windowWidth} = useWindowDimensions();
    const isMobile = windowWidth < 600;
    const imageHeightInVh = isMobile ? '33' : '62';

    const heightInPixels = windowHeight * imageHeightInVh / 100;
    const ratio = heightInPixels / image.height;
    const widthInPixels = image.width * ratio;

    // Lightbox
    const [lightbox, setLightbox] = useState(false);

    return (
        <div class={'image-arrows-wrapper'}>
            {arrows}
            <div class={'image-content-wrapper'}
                 ref={ref}>
                <div className={'image-wrapper'} style={{height: `${heightInPixels}px`}}>
                    {!isImageLoaded && <div>
                        <SpinnerDiamond
                            color={"#424852"}
                        />
                    </div>}
                    <FadeIn delay={50}>
                        {!isDisplayComparator ? <img
                                style={imageStyle}
                                class={'image'}
                                src={imageSrc}
                                onLoad={() => {
                                    setIsImageLoaded(true);
                                }}
                                onClick={() => {
                                    setLightbox(true);
                                }}
                            />
                            :
                            <div>
                                <ReactCompareSlider
                                    style={{maxHeight: heightInPixels, maxWidth: widthInPixels}}
                                    itemOne={<ReactCompareSliderImage src={imageSrc} alt="Оригінальне фото"/>}
                                    itemTwo={<ReactCompareSliderImage src={image.replicaPhotoUrl}
                                                                      alt="Сучасна репліка"/>}
                                />
                            </div>
                        }
                    </FadeIn>
                    {/* Preload images */}
                    {image.colorized && <img src={image.colorized.photoUrl} style={{display: 'none'}}/>}
                    {image.replicaPhotoUrl && <img src={image.replicaPhotoUrl} style={{display: 'none'}}/>}
                    {(image.colorized || image.replicaPhotoUrl) && <div className={'toolbox-wrapper'}>
                        {image.colorized && <ColorIcon title='Кольоризоване фото' className={'toolbox-icon'}
                                                       onClick={updateImageSrc}
                        />}

                        {image.replicaPhotoUrl && <BeforeAfter title='Порівняти фото' className={'toolbox-icon'}
                                                               onClick={handleImageCompare}
                        />}
                    </div>}
                    {lightbox &&
                    <Lightbox
                        toolbarButtons={[]}
                        mainSrc={imageSrc}
                        imagePadding={isMobile ? 0 : 55}
                        onCloseRequest={() => setLightbox(false)}
                    />
                    }
                </div>
                <div class={'image-data-wrapper'}>
                    <div class={'description'} dangerouslySetInnerHTML={{__html: image.description}}/>
                    <p><i>Час створення:</i> <span dangerouslySetInnerHTML={{__html: image.dateTimeOriginal}}/></p>
                    {image.author && <p><i>Автор:</i> <span dangerouslySetInnerHTML={{__html: image.author}}/></p>}
                    <div><a target="_blank" href={image.url}><small>Детальніше про зображення</small></a></div>
                </div>
            </div>
        </div>
    );
});

export default ImageInfo
