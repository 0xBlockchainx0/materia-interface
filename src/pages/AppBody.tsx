import React, {  useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useIsClassicMode } from '../state/user/hooks'
import frameCorner from '../assets/images/trailer_frame_corner.png'
import { Route, Router } from 'react-router-dom'
import { FeatureTitle } from '../theme'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  min-height: 620px;
  width: 100%;
  background-size: cover;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 3px;
  padding: 1rem;
  cursor: auto;
  ${({ theme }) => theme.bodyWrapperBackground}
`

export const ButtonBgItem = styled.img`
  height: 3ch;
  margin: 0px 5px;
`;

const StyledBox = styled.div`
  padding: 0;
  margin: 0 auto;
  position: relative;
  max-width: 1200px;
  @media (max-width: 600px) { max-width: 90% !important; }
  @media (max-width: 1200px) { max-width: 90%; }
  min-height: 620px;
  width: 100%;
  display: inline-block;
  z-index: 0;
  cursor: pointer;
  border-radius: 0px;
  padding: 3px;
  ${({ theme }) => theme.styledBoxBorder}
`

const StyledCornerImage = styled.img`
  position:absolute;  
  height:39px;
  width:39px
  opacity: 0.7;
  @media (max-width: 960px) { display: none; }
  @media (max-width: 375px) { display: none; }
`

const StyledSpanTopRight = styled.span`
  filter: blur(0);
  top: -23px;
  right: -21px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  position: absolute;
  display: block!important;
  height: 39px;
  width: 39px;
`

const StyledSpanTopLeft = styled.span`
  filter: blur(0);
  top: -21px;
  left: -23px;
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  position: absolute;
  display: block!important;
  height: 39px;
  width: 39px;
`

const StyledSpanBottomLeft = styled.span`
  bottom: -22px;
  left: -21px;
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
  position: absolute;
  display: block!important;
  height: 39px;
  width: 39px;
`

const StyledSpanBottomRight = styled.span`
  bottom: -22px;
  right: -22px;
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
  position: absolute;
  display: block!important;
  height: 39px;
  width: 39px;
`
const CornerBox = () => {
  return (
    <>
      <StyledSpanTopRight>
        <StyledCornerImage src={frameCorner} />
      </StyledSpanTopRight>
      <StyledSpanTopLeft>
        <StyledCornerImage src={frameCorner} />
      </StyledSpanTopLeft>
      <StyledSpanBottomLeft>
        <StyledCornerImage src={frameCorner} />
      </StyledSpanBottomLeft>
      <StyledSpanBottomRight>
        <StyledCornerImage src={frameCorner} />
      </StyledSpanBottomRight>
    </>
  )
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  const classicMode = useIsClassicMode();
  const theme = useContext(ThemeContext);
  var bodyTitle = '';
  
  if(window.location.href.indexOf('/swap') > -1) {
    bodyTitle = 'swap';
  }
  else if (window.location.href.indexOf('/lm') > -1) {
    bodyTitle = 'liquidity mining';
  }
  else if (window.location.href.indexOf('/add') > -1) {
    bodyTitle = 'Pool';
  }

  return (
    <StyledBox>
      {!classicMode && (
        <CornerBox />
      )}
      <BodyWrapper>
        <FeatureTitle className={theme.name}>{bodyTitle}</FeatureTitle>        
        {children}
      </BodyWrapper>
    </StyledBox>
  );
}
