import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MyThemeContextProvider } from "../store/myThemeContext";
import MainLayout from '../components/layout/MainLayout';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
const queryClient = new QueryClient()
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MyThemeContextProvider>
      <MainLayout>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </MainLayout>
   
    </MyThemeContextProvider>
  )

}

export default MyApp
