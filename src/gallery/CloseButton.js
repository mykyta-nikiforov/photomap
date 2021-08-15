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
    top: 5px;
    right: 15px;
    z-index: 500;
    opacity: 0.9;
`;

const IconSvgCSS = css`
    fill: #404040;
    width: 35px;
    &:hover {
    fill: #000000
    }
`;

export default CloseButton
