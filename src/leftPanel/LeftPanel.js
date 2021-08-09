/** @jsx jsx */
import React from 'react';
import {css, jsx} from "@emotion/react";
import Logo from "../img/wikibilhorod_logo.png"

function LeftPanel() {
    return (
        <div css={panelCss}>
            <div css={logoContainerCss}>
                <a target="_blank" href="https://wikibilhorod.info">
                    <img css={logoCss}
                         src={Logo}/>
                </a>
            </div>
            <div css={sloganCss}>Карта старих фотографій<br/>Білгород-Дністровщини</div>
        </div>
    );
}

const panelCss = css`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 50;
    background-color: #fff;
    width: 22vw;
    padding: 1vh;
`;

const logoContainerCss = css`
    width: 30%;
    display: inline-block;
`;

const logoCss = css`
    width: 100%;
`;

const sloganCss = css`
    display: inline-block;
    margin-left: 1vw;
    font-size: 1vw;
    vertical-align: middle;
`;

export default LeftPanel;
