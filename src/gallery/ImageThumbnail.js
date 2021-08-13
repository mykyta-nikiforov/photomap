/** @jsx jsx */
import React, {useState} from 'react';
import {css, jsx} from '@emotion/react';
import {SpinnerDiamond} from 'spinners-react';
import useWindowDimensions from "../util/useWindowDimensions";
import {ReactComponent as ColorIcon} from "../img/chromatic.svg";

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
            src={image.thumbUrl}
            onClick={props.onClick}
            onLoad={() => setLoaded(true)}
        />
        {loaded && image.colorized && <div css={ToolsWrapper}>
            <ColorIcon css={ColorIconCss}

            />
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
    height: 20px;
    position: absolute;
    top: 5px;
    right: 5px;
`;

const ColorIconCss = css`
    width: 18px;
    height: 18px;
    opacity: 75%;
`;

export default ImageThumbnail
