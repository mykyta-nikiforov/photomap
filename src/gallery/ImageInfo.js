/** @jsx jsx */
import React, {useEffect, useRef} from 'react'
import {css, jsx} from '@emotion/react'
import Arrow from "./Arrow";
import {updateActiveImageIndex} from "./gallerySlice";
import {useDispatch} from "react-redux";

const ImageInfo = props => {
    const dispatch = useDispatch();

    const setActiveImageIndex = (i) => {
        dispatch(updateActiveImageIndex(i));
    }

    let arrows = null;
    if (props.arrowsActive) {
        arrows = <div>
            <Arrow direction="left" handleClick={() => setActiveImageIndex(props.prevImageIndex)}/>
            <Arrow direction="right" handleClick={() => setActiveImageIndex(props.nextImageIndex)}/>
        </div>;
    }
    const image = props.image;

    function keydownHandler({key}) {
        if (key === "ArrowLeft") {
            setActiveImageIndex(props.prevImageIndex);
        } else if (key === "ArrowRight") {
            setActiveImageIndex(props.nextImageIndex);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", keydownHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", keydownHandler);
        };
    }, []);

    const infoBoxRef = useRef(null)
    useEffect(() => {
        infoBoxRef.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }, [image]);

    return (

            <div css={ImageContentWrapper} ref={infoBoxRef}>
                {arrows}
                <div css={ImageWrapperCSS}>
                    <img css={ImageCSS} src={props.image.photoUrl}/>
                </div>
                <div css={ImageDataWrapper}>
                    <div css={DescriptionCSS} dangerouslySetInnerHTML={{__html: image.description}}/>
                    <p><i>Час створення:</i> <span dangerouslySetInnerHTML={{__html: image.dateTimeOriginal}}/></p>
                    <p><i>Автор:</i> <span dangerouslySetInnerHTML={{__html: image.author}}/></p>
                    <div><a target="_blank" href={image.url}><small>Детальніше про зображення</small></a></div>
                </div>
            </div>
    );
}

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
