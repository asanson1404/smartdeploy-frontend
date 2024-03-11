import { smartdeploy } from "@/pages";
import { DeployEventData } from '@/mercury_indexer/smartdeploy-api-client';
import { Ok, Err, Version } from 'smartdeploy-client'

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
) {

    if (deployEvents) {
        try {
    
            ///@ts-ignore
            const { result } = await smartdeploy.listDeployedContracts({ start: undefined, limit: undefined });
            const response = result;
    
            if (response instanceof Ok) {
                
                let deployedContracts: DeployedContract[] = [];
    
                const contractArray =  response.unwrap();
    
                ///@ts-ignore
                contractArray.forEach(([name, address], i) => {

                    const eventData: DeployEventData | undefined = deployEvents.find(event => event.contractId == address);
                    
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
                        console.warn("No Deploy event data found for contract ID ", address);
                        const parsedDeployedContract: DeployedContract = {
                            index: i,
                            name: name,
                            address: address,
                            deployer: "no_evt_data",
                            fromPublished: "no_evt_data",
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