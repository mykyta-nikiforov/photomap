/** @jsx jsx */
import React, {useState} from 'react';
import {css, jsx} from '@emotion/react';
import {SpinnerDiamond} from 'spinners-react';
import useWindowDimensions from "../util/useWindowDimensions";
import {ReactComponent as ColorIcon} from "../img/chromatic.svg";
import {ReactComponent as BeforeAfter} from '../img/before-after.svg'
import {useSelector} from "react-redux";

const ImageThumbnail = props => {
    const image = props.image;

    const isDisplayColorized = useSelector((state) => state.gallery.isDisplayColorized);
    const thumbUrl = isDisplayColorized && image.colorized ? image.colorized.thumbUrl : image.thumbUrl ;

    // Loaded state
    const [loaded, setLoaded] = useState(false);
    const imageStyle = !loaded ? {display: "none"} : {};

    // Count image width
    const {windowHeight} = useWindowDimensions();
    const heightInPixels = windowHeight * imageHeightInVh / 100;
    const ratio = heightInPixels / image.height;
    const widthInPixels = image.width * ratio;

    const imageContainerStyle = {
        width: widthInPixels,
        height: heightInPixels,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    };

    return (<div style={imageContainerStyle}>
        {!loaded &&
            <SpinnerDiamond
                color={"#424852"}
            />
        }

        <img
            css={imgCSS}
            style={imageStyle}
            src={thumbUrl}
            onClick={props.onClick}
            onLoad={() => setLoaded(true)}
        />
        {loaded && (image.colorized || image.replicaPhotoUrl) && <div css={ToolsWrapper}>
            {image.colorized && <ColorIcon title='Кольоризоване фото' css={IconCss}/>}
            {image.replicaPhotoUrl && <BeforeAfter title='Доступне фотопорівняння' css={IconCss}/>}
        </div>}
    </div>)
}

const imageHeightInVh = '25';

export const imgCSS = {
    'height': imageHeightInVh + 'vh',
    'object-fit': 'cover',
    'vertical-align': 'bottom',
    'cursor': 'pointer'
};

const ToolsWrapper = css`
    height: 23px;
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: rgba(255, 255, 255, .7);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const IconCss = css`
    width: 18px;
    height: 18px;
    opacity: 75%;
    margin: 0 2px;
`;

export default ImageThumbnail
