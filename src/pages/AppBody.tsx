import React from 'react'
import styled from 'styled-components'
import appBackground from '../assets/images/app-background.png'
import frameCorner from '../assets/images/trailer_frame_corner.png'
import buttonBg from '../assets/images/button-background.png'

export const BodyWrapper = styled.div`
  position: relative;
  // max-width: 75%;
  // max-width: 1020px;
  min-height: 620px;
  width: 100%;
  background: url(${appBackground}) no-repeat;
  background-size: cover;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0px;
  padding: 1rem;
`

export const Center = styled.div`
  display: flex;
  margin: 0 auto;
  padding-top: 5px;
  padding-bottom: 5px;
`

export const Footer = styled.div`
  display: flex;
  margin: 0 auto;
`

const ButtonbgItem = styled.img`
  width: 10%;
  margin: 0px 5px;
`;

const StyledBox = styled.div`
  padding: 0;
  margin: 0 auto;
  position: relative;
  max-width: 75%;
  // max-width: 1020px;
  min-height: 620px;
  width: 100%;
  display: inline-block;
  z-index: 0;
  cursor: pointer;
  border: 2px solid #1e9de3;
`

const StyledCornerImage = styled.img`
  position:absolute;
  display:block;
  height:39px;
  width:39px
  @media (max-width: 960px) {
    display: none;
  }
  @media (max-width: 375px) {
    display: none;
  }
`


const StyledSpanTopRight = styled.span`
filter: blur(0);
    top: -22.5px;
    right: -21.5px;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
    position: absolute;
    display: block!important;
    height: 39px;
    width: 39px;
`

const StyledSpanTopLeft = styled.span`
filter: blur(0);
top: -21.5px;
left: -23.5px;
-webkit-transform: rotate(0deg);
transform: rotate(0deg);
    position: absolute;
    display: block!important;
    height: 39px;
    width: 39px;
`

const StyledSpanBottomLeft = styled.span`
bottom: -20.5px;
left: -23.5px;
-webkit-transform: rotate(270deg);
transform: rotate(270deg);
    position: absolute;
    display: block!important;
    height: 39px;
    width: 39px;
`

const StyledSpanBottomRight = styled.span`
bottom: -20.5px;
    right: -23.5px;
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
  return (
    <StyledBox>
      <CornerBox/>
      <BodyWrapper>{children}</BodyWrapper>
      <Footer>
        <Center>Select two token. Press <ButtonbgItem src={buttonBg}/> button to swap.</Center>
      </Footer>
    </StyledBox>
  )
}
