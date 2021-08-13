/** @jsx jsx */
import React, {forwardRef, useState} from 'react'
import {css, jsx} from '@emotion/react'
import Arrow from "./Arrow";
import {updateActiveImageIndex} from "./gallerySlice";
import {useDispatch} from "react-redux";
import {SpinnerDiamond} from 'spinners-react';
import './ImageInfo.css';
import FadeIn from "react-fade-in";
import {ReactComponent as ColorIcon} from '../img/chromatic.svg'

const ImageInfo = forwardRef((props, ref) => {
    const image = props.image;
    const dispatch = useDispatch();

    const setActiveImageIndex = (i) => {
        dispatch(updateActiveImageIndex(i));
    }

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

    const [isDisplayedColorized, setIsDisplayedColorized] = useState(false);
    const imageSrc = !isDisplayedColorized ? image.photoUrl : image.colorized.photoUrl;

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
                    <img
                        style={imageStyle}
                        css={ImageCSS}
                        src={imageSrc}
                        onLoad={() => {
                            setIsImageLoaded(true);
                        }}/>
                </FadeIn>
                {image.colorized && <div css={ToolsWrapper}>
                    <ColorIcon css={ColorIconCss}
                        onClick={() => setIsDisplayedColorized(!isDisplayedColorized)}
                    />
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
    height: 70vh;
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
    max-height: 65vh;
`;

const ToolsWrapper = css`
    height: 20px;
    position: absolute;
    top: 30px;
    right: 30px;
`;

const ColorIconCss = css`
    width: 20px;
    height: 20px;
    cursor: pointer;  
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
