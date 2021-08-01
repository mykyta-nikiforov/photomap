/** @jsx jsx */
import React from "react";
import {css, jsx} from '@emotion/react'
import {ReactComponent as IconSvg} from "../img/close.svg";


const CloseButton = (props) => {
    return (
        <button css={ButtonCSS} onClick={props.onClick}>
            <IconSvg css={IconSvgCSS}/>
        </button>
    );
}

const ButtonCSS = css`
    position: fixed;
    top: 10px;
    right: 15px;
    z-index: 200;
    opacity: 0.9;
    img:hover {
        color: #505050;
    }
`;

const IconSvgCSS = css`
    width: 35px;
    &:hover {
    fill: #505050
    }
`;

export default CloseButton
