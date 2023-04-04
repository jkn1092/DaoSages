import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

import {configureChains, createClient, WagmiConfig} from "wagmi";
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import {getDefaultWallets , RainbowKitProvider} from "@rainbow-me/rainbowkit";
import { ChakraProvider } from '@chakra-ui/react'
import {ApolloProvider} from "@apollo/client";
import client from "@/apollo-client";
import {createContext} from "react";

const { chains, provider } = configureChains(
    [hardhat],
    [
      //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function App({ Component, pageProps }) {
  return(
      <ChakraProvider>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <ApolloProvider client={client}>
                    <Component {...pageProps} />
                </ApolloProvider>
            </RainbowKitProvider>
          </WagmiConfig>
      </ChakraProvider>
  )
}
