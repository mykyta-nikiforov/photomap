/** @jsx jsx */
import React, {useEffect, useRef, useState} from 'react';
import {css, jsx} from "@emotion/react";
import Logo from "../img/wikibilhorod_logo.png"
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import {useDispatch} from "react-redux";
import {filterByYears} from "../geoSlice";
import './LeftPanel.css';

export const sliderStartYear = 1850;
export const sliderEndYear = 2000;

function LeftPanel() {
    const dispatch = useDispatch();
    const [yearFilterStart, setYearFilterStart] = useState(sliderStartYear);
    const [yearFilterEnd, setYearFilterEnd] = useState(sliderEndYear);
    const [isRangeSliderOpened, setIsRangeSliderOpened] = useState(false);
    const rangeSliderStyle = !isRangeSliderOpened ? {display: "none"} : {};

    const sliderRef = useRef(null);

    const onSliderChange = (data) => {
        setYearFilterStart(parseInt(data[0]));
        setYearFilterEnd(parseInt(data[1]));
    }

    useEffect(() => {
        dispatch(filterByYears([yearFilterStart, yearFilterEnd]))
    }, [yearFilterStart, yearFilterEnd]);

    return (
        <div class="left-panel-wrapper">
            <div css={headerCss}>
                <div css={logoContainerCss}>
                    <a target="_blank" href="https://wikibilhorod.info">
                        <img css={logoCss}
                             src={Logo}/>
                    </a>
                </div>
                <div class="slogan">Карта старих фотографій<br/>Білгород-Дністровщини</div>
            </div>
            <div css={sliderContainerCss}>
                <div css={timeRangeSummary}
                     onClick={() => setIsRangeSliderOpened(!isRangeSliderOpened)}>
                    <div style={{marginRight: "10px"}}>Роки: </div>
                    <div css={timeRangeLabel}>{yearFilterStart}–{yearFilterEnd}</div>
                    <div css={arrowDown}></div>
                </div>
                <div css={sliderCss}
                     style={rangeSliderStyle}>
                    <Nouislider
                        ref={sliderRef}
                        range={{min: sliderStartYear, max: sliderEndYear}}
                        start={[sliderStartYear, sliderEndYear]}
                        step={1}
                        connect
                        onSlide={(data) => onSliderChange(data)}
                    />
                </div>
            </div>
        </div>
    );
}

const headerCss = css`
    background-color: #fff;
    width: 100%;
    padding: 1vh;
`;

const logoContainerCss = css`
    width: 30%;
    display: inline-block;
`;

const logoCss = css`
    width: 100%;
`;

const sliderContainerCss = css`
    margin-right: 40px;
    margin-top: 8px;
    background-color: white;
    padding-bottom: 5px;
`;

const timeRangeSummary = css`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const timeRangeLabel = css`
    font-size: 1.6em;
    text-align: center;
    line-height: 45px;
    display: inline-block;
    user-select: none;
`;

const arrowDown = css`
    margin-top: 10px;
    margin-left: 5px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid #000;
    display: inline-block;
`;

const sliderCss = css`
    margin: 5px 25px;
`;

export default LeftPanel;
