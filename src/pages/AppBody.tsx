import React, {  useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { MainContainer, 
  MainContainerExtraDecorator, 
  MainContainerContentWrapper, 
  FeatureTitle, 
  FeatureChildrenContainer } from '../theme'

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  const theme = useContext(ThemeContext);
  var featureTitle = '';
  var value = window.location.href.replace(/(.*)\//, '');
  switch(value){
      case 'swap':
        featureTitle = 'swap';
      break;
      case 'lm':
        featureTitle = 'liquidity mining';
      break;
      case 'add':
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
      </MainContainerContentWrapper>      
      <MainContainerExtraDecorator className={ `bottom ${theme.name}` }/>
    </MainContainer>   
  );
}
