import { useAppContext } from '../state';
import useSWRInfinite from "swr/infinite";
import { Box, Button, ButtonGroup, Container, Wrap, Center } from '@chakra-ui/react'
import ProfileItem from '../components/ProfileItem'
import { Spinner } from '@chakra-ui/react'
import { ethers } from 'ethers';
import { useState } from 'react';

const PAGE_SIZE = 9

const getKey = (pageIndex, previousPageData, searchValue, pageSize) => {
    console.log(`pageIndex  : ${JSON.stringify(pageIndex)}`)
    // pageIndex is not incremented properly on first call, idk why, 2 clicks needed on `load more` for 2nd page

    let cursor // is the first profileId to be newly fetched
    if (searchValue) { // user searched for a profileId
        cursor = searchValue
    }
    else if (previousPageData) { // user clicked on `load more`
        let lastDisplayedProfile = previousPageData.slice(-1)
        let lastDisplayedProfileId = lastDisplayedProfile[0]
        cursor = lastDisplayedProfileId[0] - 1 // first profileId of the next page
    } else { // initial loading or reset
        cursor = null
    }
    console.log(`cursor  : ${JSON.stringify(cursor)}`)
    return [cursor, PAGE_SIZE]
    // return searchValue
}

export default function ProfileList({ fallbackData }) {
    // console.log(`fallbackData  : ${JSON.stringify(fallbackData)}`)
    const [searchValue, setSearchValue] = useState(null)
    const { lensHub } = useAppContext();

    const fetcher = async (cursor, pageSize) => {
        console.log("fetcher profile");
        console.log(`cursor  : ${JSON.stringify(cursor)}`)
        let profileTotalSupply = await lensHub.totalSupply();
        if (!cursor) { // set cursor value to max profileId if not provided
            cursor = profileTotalSupply.toNumber()
        }
        // main profile fetching loop
        let profile
        let profiles = []
        for (let profileId = cursor; (profileId > cursor - pageSize) && profileId > 0; profileId--) {
            // console.log(`profileId  : ${JSON.stringify(profileId)}`)
            profile = await lensHub.getProfile(profileId);
            profile = [profileId, ...profile]
            if (ethers.BigNumber.isBigNumber(profile[1])) {
                // data coming from fallback is already a JS number because it was converted 
                // to be able to be serialized when passing props from index.js->getStaticProps
                profile[1] = profile[1].toNumber();
            }
            profiles.push(profile);
            // console.log(`profiles  : ${JSON.stringify(profiles)}`)
        }
        // console.log(`profiles  : ${JSON.stringify(profiles)}`)
        return profiles
    }

    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
        (...args) => getKey(...args, searchValue, PAGE_SIZE),
        fetcher,
        {
            fallbackData: fallbackData,
            revalidateOnMount: true
        }
    );
    if (error) return (
        <Center>
            Failed to load
            {console.log(error)}
        </Center>
    )
    if (!data) return (
        <Center>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='e3cfff'
                size='xl'
            />
        </Center>
    )
    const results = data ? [].concat(...data) : [];
    return (
        <>
            {/* <Box onLoad={() => setSize(size + 1)} d='none'></Box> */}
            <Button m='5'
                onClick={() => {
                    setSearchValue(26);
                    setSize(1)
                }}
                colorScheme='teal' variant='solid'
            >
                SET
            </Button>
            <Wrap spacing='5px' align='center' justify='center'>
                {results &&
                    results.map(
                        (profile, index) => (
                            <ProfileItem profile={profile} key={index} >
                                {/* {console.log(`profile  : ${JSON.stringify(profile)}`)} */}
                            </ProfileItem>
                        )
                    )
                }
            </Wrap>
            <Center m='10'>
                <Button m='5'
                    onClick={() => {
                        setSearchValue(null)
                        setSize(1)
                    }}
                    colorScheme='teal' variant='solid'
                >
                    Reset
                </Button>
                <Button m='5'
                    onClick={() => {
                        setSearchValue(null)
                        setSize(size + 1)
                    }}
                    colorScheme='teal' variant='solid'
                    isLoading={isValidating}
                    loadingText='Loading' spinnerPlacement='start'
                >
                    Load more
                </Button>
            </Center>
        </>
    )

}
