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
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

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

    return (

        <div css={ImageContentWrapper}
             ref={ref}>
            {arrows}
            <div css={ImageWrapperCSS}>
                {!isImageLoaded && <div>
                    <SpinnerDiamond
                        color={"#424852"}
                    />
                </div>}
                <FadeIn delay={50}>
                    {!isDisplayComparator ? <img
                        style={imageStyle}
                        css={ImageCSS}
                        src={imageSrc}
                        onLoad={() => {
                            setIsImageLoaded(true);
                        }}/>
                        :
                        <div>
                            <ReactCompareSlider
                                style={{maxHeight: image.height, maxWidth: image.width}}
                                itemOne={<ReactCompareSliderImage src={imageSrc} alt="Оригінальне фото" />}
                                itemTwo={<ReactCompareSliderImage src={image.replicaPhotoUrl} alt="Сучасна репліка" />}
                            />
                        </div>
                    }

                </FadeIn>
                {(image.colorized || image.replicaPhotoUrl) && <div css={ToolsWrapper}>
                    {image.colorized && <ColorIcon title='Кольоризоване фото' css={ToolboxIconCss}
                               onClick={updateImageSrc}
                    />}

                    {image.replicaPhotoUrl && <BeforeAfter title='Порівняти фото' css={ToolboxIconCss}
                                 onClick={handleImageCompare}
                    />}
                </div>}
            </div>
            <div css={ImageDataWrapper}>
                <div css={DescriptionCSS} dangerouslySetInnerHTML={{__html: image.description}}/>
                <p><i>Час створення:</i> <span dangerouslySetInnerHTML={{__html: image.dateTimeOriginal}}/></p>
                {image.author && <p><i>Автор:</i> <span dangerouslySetInnerHTML={{__html: image.author}}/></p>}
                <div><a target="_blank" href={image.url}><small>Детальніше про зображення</small></a></div>
            </div>
        </div>
    );
});

const ImageContentWrapper = css`
    height: 66vh;
    width: calc(100% - 60px);
    position: absolute;
    left: 0;
    display: flex;
    justify-content: center;
    background: #FFF;
    overflow-y: scroll;
    margin: 0px 10px 10px 60px; 
    overflow-x: hidden;
    z-index: 200;
`;

const ImageWrapperCSS = css`
width: 60%;
padding: 4vh 10vh;
display: flex;
align-items: center;
justify-content: center;
position: relative;
`;

const ImageCSS = css`
    max-width: 100%;
    max-height: 62vh;
`;

const ToolsWrapper = css`
    width: 20px;
    position: absolute;
    bottom: 50px;
    right: 30px;
`;

const ToolboxIconCss = css`
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin: 3px 0;
`;

const ImageDataWrapper = css`
    width: 40%;
    margin: 6vh 0;
`;

const DescriptionCSS = css`
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 4vh;
`;

export default ImageInfo
