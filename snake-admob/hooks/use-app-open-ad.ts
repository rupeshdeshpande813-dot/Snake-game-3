import { AppState, Platform } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';
import { useAppOpenAd } from 'react-native-google-mobile-ads';

const APP_OPEN_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-1768634789706309/1269803532',
  android: 'ca-app-pub-1768634789706309/1269803532',
  default: 'ca-app-pub-1768634789706309/1269803532',
});

export function useAppOpenAdManager() {
  const appOpenAd = useAppOpenAd(APP_OPEN_AD_UNIT_ID);
  const appState = useRef(AppState.currentState);

  const showIfReady = useCallback(() => {
    if (appOpenAd.isLoaded && !appOpenAd.isShowing) {
      appOpenAd.show();
    }
  }, [appOpenAd]);

  useEffect(() => {
    appOpenAd.load();
  }, [appOpenAd]);

  useEffect(() => {
    if (appOpenAd.isLoaded && !appOpenAd.isShowing && AppState.currentState === 'active') {
      showIfReady();
    }
  }, [appOpenAd.isLoaded, appOpenAd.isShowing, showIfReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        showIfReady();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [showIfReady]);

  return appOpenAd;
}
