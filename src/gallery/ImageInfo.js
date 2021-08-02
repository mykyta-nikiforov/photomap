/** @jsx jsx */
import React, {forwardRef, useState} from 'react'
import {css, jsx} from '@emotion/react'
import Arrow from "./Arrow";
import {updateActiveImageIndex} from "./gallerySlice";
import {useDispatch} from "react-redux";
import {SpinnerDiamond} from 'spinners-react';
import './ImageInfo.css';
import FadeIn from "react-lazyload-fadein";

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

    return (

        <div css={ImageContentWrapper}
             ref={ref}>
            {arrows}
            <div css={ImageWrapperCSS}>
                <div style={{display: isImageLoaded ? "none" : "inline",
                    position: "absolute",
                    top: "50%"}}>
                    <SpinnerDiamond
                        color={"#424852"}
                        enabled={!isImageLoaded}/>
                </div>
                <div>
                    <FadeIn height={200} duration={50}>
                        {onload => (
                        <img
                            css={ImageCSS}
                            src={props.image.photoUrl}
                            onLoad={() => {
                                setIsImageLoaded(true);
                                onload();
                            }}/>
                            )}
                    </FadeIn>
                </div>
            </div>
            <div css={ImageDataWrapper}>
                <div css={DescriptionCSS} dangerouslySetInnerHTML={{__html: image.description}}/>
                <p><i>Час створення:</i> <span dangerouslySetInnerHTML={{__html: image.dateTimeOriginal}}/></p>
                <p><i>Автор:</i> <span dangerouslySetInnerHTML={{__html: image.author}}/></p>
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
`;

const ImageWrapperCSS = css`
width: 60%;
padding: 4vh 10vh;
text-align: center;
`;

const ImageCSS = css`
    max-width: 100%;
    max-height: 65vh;
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
