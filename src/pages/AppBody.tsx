import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import { MainContainer, 
  MainContainerExtraDecorator, 
  MainContainerContentWrapper, 
  FeatureTitle, 
  FeatureChildrenContainer,
  FooterInfo } from '../theme'

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  const theme = useContext(ThemeContext);
  const location = useLocation();
  const result = location.pathname.match(/\/(.*?)\//g);
  const value = (result ? result[0].replace(/\//g, '') : location.pathname.replace(/\//g, ''));
  
  let featureTitle = '';

  switch(value){
      case 'swap':
        featureTitle = 'swap';
      break;
      case 'lm':
        featureTitle = 'liquidity mining';
      break;
      case 'add':
      case 'remove':
      case 'pool':
        featureTitle = 'pool';
      break;
  }

  return (
    <MainContainer className={theme.name}>
      <MainContainerExtraDecorator className={ `top ${theme.name}` }/>
      <MainContainerContentWrapper className={theme.name}>
        <FeatureTitle className={theme.name}>{featureTitle}</FeatureTitle>
        <FeatureChildrenContainer className={theme.name}>
        {children}
        </FeatureChildrenContainer>
        <FooterInfo className={theme.name}>
          <div></div>
          <div className="swapCaption">Select two token. Press "Swap" button to swap.</div>
        </FooterInfo>
      </MainContainerContentWrapper>      
      <MainContainerExtraDecorator className={ `bottom ${theme.name}` }/>
    </MainContainer>   
  );
}
