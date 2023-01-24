import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MyThemeContextProvider } from "../store/myThemeContext";
import MainLayout from '../components/layout/MainLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MyThemeContextProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
   
    </MyThemeContextProvider>
  )

}

export default MyApp
