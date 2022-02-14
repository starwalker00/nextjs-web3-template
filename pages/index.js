import { Container, Box, Heading, Text, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Head from 'next/head'
import ProfileList from '../components/ProfileList'
import { addresses, abis } from '../contracts';
import { ethers } from 'ethers';

export default function Home({ fallbackData, profileTotalSupply }) {
  return (
    <Container maxWidth='container.lg' m="20px auto">
      <Head>
        <title>Lens Explorer</title>
        <meta name="description" content="search profiles and consult posts of lens protocol users" />
        <link rel="icon" href="/mind.svg" />
      </Head>
      <Box w='100%' m="20px auto" textAlign="center">
        <Heading as="h1" size="xl">
          Lens protocol explorer
        </Heading>
        <Text fontSize='lg' mt="10px" letterSpacing='.15rem'>
          search profiles and consult posts of lens protocol users
        </Text>
      </Box>
      <ProfileList fallbackData={fallbackData} profileTotalSupply={profileTotalSupply} />
      <Box w='100%' m="20px auto" textAlign="center">
        <Text fontSize='xs' mt="1px">
          not affiliated to {' '}
          <Link href='https://lens.dev/' isExternal>
            Lens Protocol <ExternalLinkIcon mx='2px' mb='4px' />
          </Link>
        </Text>
      </Box>
    </Container >
  )
}

export async function getStaticProps() {
  // `getStaticProps` is executed on the server side.
  const provider = new ethers.providers.AlchemyProvider("maticmum");
  const lensHub = new ethers.Contract(addresses.lensHubProxy, abis.lensHubProxy, provider);
  let pageSize = 9;
  let profileTotalSupply = await lensHub.totalSupply();
  let profile;
  let profiles = [];
  let cursor = profileTotalSupply.toNumber()
  for (let profileId = cursor; (profileId > cursor - pageSize) && profileId > 0; profileId--) {
    profile = await lensHub.getProfile(profileId);
    profile = [profileId, ...profile]
    profile[1] = profile[1].toNumber(); // convert toNumber to properly serialize when passing props in fallbackData
    profiles.push(profile);
  }
  // console.log(`fallbackData profiles  : ${JSON.stringify(profiles)}`)
  return {
    props: {
      fallbackData: [profiles],
      profileTotalSupply: cursor
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}