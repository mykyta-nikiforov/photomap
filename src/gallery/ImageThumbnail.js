/** @jsx jsx */
import React, {useState} from 'react';
import {css, jsx} from '@emotion/react';
import {SpinnerDiamond} from 'spinners-react';
import useWindowDimensions from "../util/useWindowDimensions";
import {ReactComponent as ColorIcon} from "../img/chromatic.svg";
import {ReactComponent as BeforeAfter} from '../img/before-after.svg'
import {useSelector} from "react-redux";
import './ImageThumbnail.css';

const ImageThumbnail = props => {
    const image = props.image;

    const isDisplayColorized = useSelector((state) => state.gallery.isDisplayColorized);
    const thumbUrl = isDisplayColorized && image.colorized ? image.colorized.thumbUrl : image.thumbUrl ;

    const {windowWidth, windowHeight} = useWindowDimensions();
    const imageHeightInVh = windowWidth < 600 ? '10' : '25';

    // Loaded state
    const [loaded, setLoaded] = useState(false);
    const imageStyle = !loaded ? {display: "none"} : {height: imageHeightInVh + 'vh',
    };

    // Count image width
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
        {loaded && (image.colorized || image.replicaPhotoUrl) && <div class={'tool-wrapper'}>
            {image.colorized && <ColorIcon title='Кольоризоване фото' class={'icon'}/>}
            {image.replicaPhotoUrl && <BeforeAfter title='Доступне фотопорівняння' class={'icon'}/>}
        </div>}
    </div>)
}

const imgCSS = {
    'object-fit': 'cover',
    'vertical-align': 'bottom',
    'cursor': 'pointer'
};

export default ImageThumbnail
