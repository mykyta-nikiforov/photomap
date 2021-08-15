/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/react'
import leftArrow from '../img/left-arrow.svg'
import rightArrow from '../img/right-arrow.svg'

const Arrow = ({ direction, handleClick }) => (
    <div
        onClick={handleClick}
        css={css`
      display: flex;
      position: absolute;
      top: 50%;
      ${direction === 'right' ? `right: 0px` : `left: 0px`};
      height: 50px;
      width: 50px;
      justify-content: center;
      background: white;
      border-radius: 50%;
      cursor: pointer;
      align-items: center;
      transition: transform ease-in 0.1s;
      z-index: 300;
      &:hover {
        transform: scale(1.1);
      }
      img {
        transform: translateX(${direction === 'left' ? '-2' : '2'}px);
        &:focus {
          outline: 0;
        }
      }
    `}
    >
        {direction === 'right' ? <img src={rightArrow} /> : <img src={leftArrow} />}
    </div>
)

export default Arrow
