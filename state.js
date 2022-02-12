import { createContext, useContext } from 'react';
import { addresses, abis } from './contracts';
import { ethers } from 'ethers';

const provider = new ethers.providers.AlchemyProvider("maticmum");
const lensHub = new ethers.Contract(addresses.lensHubProxy, abis.lensHubProxy, provider);

const AppContext = createContext();

export function AppWrapper({ children }) {
    let sharedState = {
        "language": "en",
        "lensHub": lensHub
    }

    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}