import { Dispatch, SetStateAction } from 'react'
import { isConnected } from '@stellar/freighter-api'
import { smartdeploy, FetchDatas } from "@/pages"
import { Ok, Err, Option, Version } from 'smartdeploy-client'
import { WalletContextType } from '@/context/WalletContext'

export interface PublishedContract {
    index: number;
    name: string;
    author: string;
    versions: {
        version: Version,
        hash: string
    }[];
}

export async function listAllPublishedContracts() {

    try {

        ///@ts-ignore
        const {result} = await smartdeploy.listPublishedContracts({ start: undefined, limit: undefined });
        const response = result;

        if (response instanceof Ok) {
            let publishedContracts: PublishedContract[] = [];
            
            const contractArray = response.unwrap();

            ///@ts-ignore
            contractArray.forEach(([name, publishedContract], i) => {

                let versions: {version: Version, hash: string}[] = [];

                ///@ts-ignore
                Array.from(publishedContract.versions).forEach((contractDatas: [Version, any]) => {

                    // Version object
                    const version = contractDatas[0];

                    // hash
                    const hash = contractDatas[1].hash.join('');

                    versions.push({version, hash});
                });

                const parsedPublishedContract: PublishedContract = {
                    index: i,
                    name: name,
                    author: publishedContract.author.toString(),
                    versions: versions
                };
                
                publishedContracts.push(parsedPublishedContract);
            });

            return publishedContracts;

        } else if (response instanceof Err) {
            response.unwrap();
        } else {
            throw new Error("listPublishedContracts returns undefined. Impossible to fetch the published contracts.");
        }
    } catch (error) {
        console.error(error);
        window.alert(error);
    }

}

export type DeployArgsObj = { 
    contract_name: string,
    version: Option<Version>,
    deployed_name: string,
    owner: string,
    salt: Option<Buffer>,
    init: Option<readonly [string, Array<any>]>
};

export async function deploy(
    walletContext: WalletContextType,
    refetchDeployedContract: FetchDatas,
    setIsDeploying: Dispatch<SetStateAction<boolean>>,
    setDeployedName: Dispatch<SetStateAction<string>>,
    setWouldDeploy: Dispatch<SetStateAction<boolean>>,
    argsObj: DeployArgsObj
) {
    
    // Check if the user has Freighter
    if (!(await isConnected())) {
        window.alert("Impossible to interact with Soroban: you don't have Freighter extension.\n You can install the extension here: https://www.freighter.app/");
        setIsDeploying(false);
    }
    else {
        // Check if the Wallet is connected
        if (walletContext.address === "") {
            alert("Wallet not connected. Please, connect a Stellar account.");
            setIsDeploying(false);
        }
        // Check is the network is Futurenet
        else if (walletContext.network.replace(" ", "").toUpperCase() !== "TESTNET") {
            alert("Wrong Network. Please, switch to Testnet.");
            setIsDeploying(false);
        }
        else {
            // Check if deployed name is empty
            if (argsObj.deployed_name === "") {
                alert("Deployed name cannot be empty. Please, choose a deployed name.");
                setIsDeploying(false);
            }
            // Check if deployed name contains spaces
            else if (argsObj.deployed_name.includes(' ')) {
                alert("Deployed name cannot includes spaces. Please, remove the spaces.");
                setIsDeploying(false);
            }
            // Now that everything is ok, deploy the contract
            else {

                try {

                    const tx = await smartdeploy.deploy(argsObj);
                    await tx.signAndSend();
                    refetchDeployedContract.setFetch(true);
                    setDeployedName("");
                    setWouldDeploy(false);
                    

                } catch (error) {
                    console.error(error);
                    window.alert(error);
                }

                setIsDeploying(false);

            }
        }
    }
}