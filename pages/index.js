import { Container, Box, Heading } from '@chakra-ui/react'
import Head from 'next/head'
import ProfileList from '../components/ProfileList'

export default function Home() {
  return (
    <Container maxWidth='container.lg' m="20px auto">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box w='100%' m="20px auto">
        <Heading as="h1" size="xl" textAlign="center">
          Chakra Example
        </Heading>
      </Box>
      <ProfileList />
    </Container >
  )
}
