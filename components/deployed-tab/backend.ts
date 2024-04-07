import { smartdeploy } from "@/pages";
import { DeployEventData, ClaimEventData, bumpContractInstance } from '@/mercury_indexer/smartdeploy-api-client';
import { TimeToLive } from '@/context/TimeToLiveContext'
import { format } from 'date-fns'
import { Ok, Err, Version } from 'smartdeploy-client'
import { WalletContextType } from '@/context/WalletContext'
import { SetStateAction, Dispatch } from "react";

export interface DeployedContract {
    index: number;
    name: string;
    address: string;
    deployer: string;
    fromPublished: string;
    version: Version | undefined;
}

export async function listAllDeployedContracts(
    deployEvents: DeployEventData[] | undefined,
    claimEvents: ClaimEventData[] | undefined,
) {

    if (deployEvents && claimEvents) {
        try {
    
            ///@ts-ignore
            const { result } = await smartdeploy.listDeployedContracts({ start: undefined, limit: undefined });
            const response = result;
    
            if (response instanceof Ok) {
                
                let deployedContracts: DeployedContract[] = [];
    
                const contractArray =  response.unwrap();
    
                ///@ts-ignore
                contractArray.forEach(([name, address], i) => {

                    let eventData: DeployEventData | ClaimEventData | undefined = deployEvents.find(event => event.contractId == address);
                    
                    // Contract deployed with SmartDeploy => trigger a Deploy event
                    if (eventData) {
                        const parsedDeployedContract: DeployedContract = {
                            index: i,
                            name: name,
                            address: address,
                            deployer: eventData.deployer,
                            fromPublished: eventData.publishedName,
                            version: eventData.version
                        }
        
                        deployedContracts.push(parsedDeployedContract);
                    }
                    // If no Deploy events the contract has been claimed 
                    else {
                        eventData = claimEvents.find(event => event.contractId == address);
                        const parsedDeployedContract: DeployedContract = {
                            index: i,
                            name: name,
                            address: address,
                            deployer: eventData!.claimer,
                            fromPublished: eventData!.wasmHash,
                            version: undefined
                        }
        
                        deployedContracts.push(parsedDeployedContract);
                    }
                    
                });
                
                return deployedContracts;
    
            } else if (response instanceof Err) {
                response.unwrap();
            } else {
                throw new Error("listDeployedContracts returns undefined. Impossible to fetch the deployed contracts.");
            }
        } catch (error) {
            console.error(error);
            window.alert(error);
        }
    }
    else {
        return 0;
    }  
}

export function getMyDeployedContracts(deployedContracts: DeployedContract[], address: string) {

    const myDeployedContracts: DeployedContract[] = deployedContracts.filter(deployedContract => deployedContract.deployer === address);
    return myDeployedContracts;

}

export type ImportArgsObj = { 
    deployed_name: string,
    contract_id: string,
    admin: string,
};

export async function importContract(
    walletContext: WalletContextType,
    importData: ImportArgsObj,
    setDeployedName: Dispatch<SetStateAction<string>>,
    setContractId: Dispatch<SetStateAction<string>>,
    setAdmin: Dispatch<SetStateAction<string>>,
    setIsImporting: Dispatch<SetStateAction<boolean>>,
    setBumping: Dispatch<SetStateAction<boolean | null>>,
) {

    // Check if the Wallet is connected
    if (walletContext.address === "") {
        alert("Wallet not connected. Please, connect a Stellar account.");
    }
    // Check is the network is Futurenet
    else if (walletContext.network.replace(" ", "").toUpperCase() !== "TESTNET") {
        alert("Wrong Network. Please, switch to Testnet.");
    }
    else {
        // Check if deployed name contains spaces
        if (importData.deployed_name.includes(' ')) {
            alert("Deployed name cannot includes spaces. Please, remove the spaces.");
        }
        // Check if contract_id contains spaces
        if (importData.contract_id.includes(' ')) {
            alert("Contract Id cannot includes spaces. Please, remove the spaces.");
        }
        // Check if admin contains spaces
        if (importData.admin.includes(' ')) {
            alert("Admin address cannot includes spaces. Please, remove the spaces.");
        }
        // Now that everything is ok, deploy the contract
        else {

            try {
                const tx = await smartdeploy.claimAlreadyDeployedContract(importData);
                await tx.signAndSend();

                setDeployedName("");
                setContractId("");
                setAdmin("");
                setIsImporting(false);
                setBumping(null);

            } catch (error) {
                console.error(error);
                window.alert(error);
                return false;
            }

        }

    }
}

export function formatCountDown(initialTime: number) {

    const days = Math.floor(initialTime / (60 * 60 * 24));
    const hours = Math.floor((initialTime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((initialTime % (60 * 60)) / 60);

    return `${days}d${hours}h${minutes}m`;
}

export async function bumpAndQueryNewTtl(
    contract_id: String,
    ledgers_to_extend: number,
    ttl: TimeToLive,
    newMap: Map<String, TimeToLive>,
) {
    try {
        const datas = await bumpContractInstance(contract_id, ledgers_to_extend);
        if (datas != 0) {
            const newTtl = datas as number;
            const newTtlSec = newTtl * 5;
            const now = new Date();
            const newExpirationDate = format(now.getTime() + newTtlSec * 1000, "MM/dd/yyyy");

            const newValue = {
                ...ttl,
                date: newExpirationDate,
                ttlSec: newTtlSec,
                countdown: formatCountDown(newTtlSec)
            }
            newMap.set(contract_id, newValue);

        }
    } catch (error) {
        console.error(error);
        window.alert(error);
    }
}