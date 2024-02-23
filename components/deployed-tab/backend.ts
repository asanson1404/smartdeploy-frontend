import { smartdeploy } from "@/pages";
import { Ok, Err, Version } from 'smartdeploy-client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import endpoints from '@/endpoints.config';

export interface DeployedContract {
    index: number;
    name: string;
    address: string;
}

export async function listAllDeployedContracts() {

    try {

        ///@ts-ignore
        const { result } = await smartdeploy.listDeployedContracts({ start: undefined, limit: undefined });
        const response = result;

        if (response instanceof Ok) {
            
            let deployedContracts: DeployedContract[] = [];

            const contractArray =  response.unwrap();

            ///@ts-ignore
            contractArray.forEach(([name, address], i) => {

                const parsedDeployedContract: DeployedContract = {
                    index: i,
                    name: name,
                    address: address.toString(),
                }

                deployedContracts.push(parsedDeployedContract);
                
            });
            
            //console.log(deployedContracts);
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

export interface DeployEventData {
    publishedName: string;
    deployedName: string;
    version: Version;
    deployer: string;
    contractId: string;
    [key: string]: string | Version;
}

export function getDeployEvents() {

    // Fetch deploy events data every 5 seconds
    const { data } = useQuery({
        queryKey: ['deploy_events'],
        queryFn: async () => {
            try {
                const res = await axios.get(endpoints.deploy_events);

                var deployEvents: DeployEventData[] = [];

                ///@ts-ignore
                res.data.forEach((deployEvent) => {

                    const parsedDeployEvent: DeployEventData = {
                        publishedName: "",
                        deployedName: "",
                        version: { major: 0, minor: 0, patch: 0 },
                        deployer: "",
                        contractId: "",
                    }

                    ///@ts-ignore
                    deployEvent.map.forEach((eventField) => {
                        var symbol: string = eventField.key.symbol;

                        if (symbol == "contract_id") {
                            parsedDeployEvent.contractId = eventField.val.address;
                        } else if (symbol === 'deployed_name') {
                            symbol = 'deployedName';
                            parsedDeployEvent.deployedName = eventField.val.string;
                        } else if (symbol === 'deployer') {
                            parsedDeployEvent.deployer = eventField.val.address;
                        } else if (symbol ==='version') {
                            ///@ts-ignore
                            eventField.val.map.forEach((versionField) => {
                                var versionSymbol: string = versionField.key.symbol;
                                if (versionSymbol ==='major') {
                                    parsedDeployEvent.version.major = versionField.val.u32;
                                } else if (versionSymbol ==='minor') {
                                    parsedDeployEvent.version.minor = versionField.val.u32;
                                } else {
                                    parsedDeployEvent.version.patch = versionField.val.u32;
                                }
                            });
                        } else {
                            parsedDeployEvent.publishedName = eventField.val.string;
                        }
                        
                    })
                    deployEvents.push(parsedDeployEvent);
                })
                return deployEvents;

            } catch (error) {
                console.error("Error to get the Deploy events", error);
            }
        },
        refetchInterval: 5000,
    });

    return data;
}