import { CartContextProvider } from '@/components/context/CartContext';
import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react";

export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <CartContextProvider>
      <Component {...pageProps}/>
      </CartContextProvider>
    
    </SessionProvider>
  )
}