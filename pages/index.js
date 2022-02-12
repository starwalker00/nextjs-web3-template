import { Container, Box, Heading } from '@chakra-ui/react'
import Head from 'next/head'
import ProfileList from '../components/ProfileList'

export default function Home() {
  return (
    <Container maxWidth='container.lg' m="10">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box w={800} p={4} m="20px auto">
        <Heading as="h1" size="xl" textAlign="center" m={5}>
          Chakra Example
        </Heading>
      </Box>
      <ProfileList />
    </Container >
  )
}
