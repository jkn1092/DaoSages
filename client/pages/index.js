import Head from 'next/head'
import {useAccount} from "wagmi";
import Layout from "@/components/Layout/Layout";
import {Alert, AlertIcon, Text} from "@chakra-ui/react";

export default function Home() {

  const { address, isConnected } = useAccount()

  return (
    <>
      <Head>
        <title>DAO des Sages</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {isConnected ? (
            <Text>Welcome on Alyra DApp !</Text>
        ) : (
            <Alert status='warning' width="50%">
              <AlertIcon />
              Please, connect your Wallet!
            </Alert>
        )}
      </Layout>
    </>
  )
}
