import { useAppContext } from '../state';
import useSWRInfinite from "swr/infinite";
import { Box, Button, ButtonGroup, Container, Wrap, Center } from '@chakra-ui/react'
import ProfileItem from '../components/ProfileItem'
import { Spinner } from '@chakra-ui/react'
import { ethers } from 'ethers';

export default function ProfileList({ fallbackData }) {
    // console.log(`fallbackData  : ${JSON.stringify(fallbackData)}`)
    const { lensHub } = useAppContext();
    const profilePerCall = 9;
    const fetcher = async (cursor) => {
        console.log("fetcher profile");
        // console.log(`cursor  : ${JSON.stringify(cursor)}`)
        let profileCount = await lensHub.totalSupply();
        if (cursor == 999999) { cursor = profileCount.toNumber() };
        // console.log(`cursor  : ${JSON.stringify(cursor)}`)
        // console.log(`profileCount  : ${JSON.stringify(profileCount)}`)
        let profile;
        let profiles = [];
        for (let profileId = cursor; profileId > cursor - profilePerCall; profileId--) {
            if (profileId > 0) {
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
            } else {
                break;
            }
        }
        // console.log(`profiles  : ${JSON.stringify(profiles)}`)
        return profiles
    }
    const getKey = (pageIndex, previousPageData) => {
        if (pageIndex === 0) return 999999 // is then transformed into totalNumber of profiles
        if (previousPageData) { // send last profileId as cursor
            let tmp = previousPageData.slice(-1);
            let tmp2 = tmp[0];
            return tmp2[0] - 1
        }
        return previousPageData
    }
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
        getKey,
        fetcher,
        // {
        //     fallbackData: [[[424, 4, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", "teaismyname", "https://ipfs.io/ipfs/bafkreielgktcju7d5fhrp2qjyz42eceub36jieu6763krit4typwloyzvm", "https://ipfs.io/ipfs/bafkreifqovlwobdqouswjjqfop6hxterpxvyykaxcjkybcsc3q7n4uw5ua"], [41, 3, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", "tiltedsquare", "https://ipfs.io/ipfs/bafkreifkmgarpjlu2yyjcdetakuext4nogmk72j4grkm2o6b4jnxsmtwou", "https://ipfs.io/ipfs/bafkreigkkm5mciwfbz7q25frwglpyqu2onmdxhyyjtureyjvzqkcobosje"]]]
        // }
        {
            fallbackData: fallbackData
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
                    onClick={() => setSize(1)}
                    colorScheme='teal' variant='solid'
                >
                    Reset
                </Button>
                <Button m='5'
                    onClick={() => setSize(size + 1)}
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
