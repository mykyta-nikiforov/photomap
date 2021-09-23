/** @jsx jsx */
import React from 'react'
import {jsx} from '@emotion/react'
import leftArrow from '../img/left-arrow.svg'
import rightArrow from '../img/right-arrow.svg'
import './Arrow.css'

const Arrow = ({direction, handleClick}) => {
    return (
        <div
            onClick={handleClick}
            className={`arrow-container ${direction === 'left' ? 'left-arrow' : 'right-arrow'}`}
        >
            <img style={{transform: `translateX(${direction === 'left' ? '-2' : '2'}px);`}}
                 src={direction === 'left' ? leftArrow : rightArrow}/>
        </div>
    );
}

export default Arrow
