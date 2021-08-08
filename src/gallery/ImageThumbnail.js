/** @jsx jsx */
import React, {useState} from 'react';
import {jsx} from '@emotion/react';
import {SpinnerDiamond} from 'spinners-react';
import useWindowDimensions from "../util/useWindowDimensions";

const ImageThumbnail = props => {
    const image = props.image;

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
        justifyContent: 'center'
    };

    return (<div style={imageContainerStyle}>
        {!loaded && <div>
            <SpinnerDiamond
                color={"#424852"}
            />
        </div>}

        <img
            css={imgCSS}
            style={imageStyle}
            src={image.thumbUrl}
            onClick={props.onClick}
            onLoad={() => setLoaded(true)}
        />
    </div>)
}

const imageHeightInVh = '25';

export const imgCSS = {
    'height': imageHeightInVh + 'vh',
    'object-fit': 'cover',
    'vertical-align': 'bottom',
    'cursor': 'pointer'
};

export default ImageThumbnail
