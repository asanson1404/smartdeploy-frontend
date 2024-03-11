import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import endpoints from '@/endpoints.config';
import { Version, Update, ContractMetadata } from 'smartdeploy-client'

export interface PublishEventData {
    publishedName: string;
    author: string;
    hash: string;
    repo: ContractMetadata;
    kind: Update;
    [key: string]: string | ContractMetadata | Update;
}

export function getPublishEvents() {

    // Fetch publish events data every 5 seconds
    const { data } = useQuery({
        queryKey: ['publish_events'],
        queryFn: async () => {
            try {
                const res = await axios.get(endpoints.publish_events);

                var publishEvents: PublishEventData[] = [];
                
                ///@ts-ignore
                res.data.forEach((publishEvent) => {

                    const parsedPublishEvent: PublishEventData = {
                        publishedName: "",
                        author: "",
                        hash: "",
                        repo: { repo: ""},
                        kind: { tag: "Patch", values: undefined},
                    }

                    ///@ts-ignore
                    publishEvent.map.forEach((eventField) => {
                        var symbol: string = eventField.key.symbol;

                        if (symbol === 'author') {
                            parsedPublishEvent.author = eventField.val.address;
                        } else if (symbol === 'hash') {
                            parsedPublishEvent.hash = eventField.val.bytes;
                        } else if (symbol === 'kind') {
                            parsedPublishEvent.kind = { tag: eventField.val.vec[0].symbol, values: undefined} as Update;
                        } else if (symbol === 'published_name') {
                            parsedPublishEvent.publishedName = eventField.val.string;
                        } else {
                            parsedPublishEvent.repo = { repo: eventField.val.map[0].val.string } as ContractMetadata;
                        }

                    })
                    publishEvents.push(parsedPublishEvent);
                })
                return publishEvents;

            } catch (error) {
                console.error("Error to get the Publish events", error);

            }
        },
        refetchInterval: 5000,
        
    });

    return data;
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

export async function subscribeBump(id: String) {

    const url = endpoints.subscribe_ledger_expiration + '/' + id;

    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error to subscribe to Ledger Instance Expiration:", error);
        window.alert("Error to subscribe to Ledger Instance Expiration. The problem comes from the Smart Deploy API");
        return 0;
    }

}

export async function readTtl(id: String) {

    const url = endpoints.read_ttl + '/' + id;
    
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error to read Ledger Instance Expiration:", error);
        window.alert("Error to read Ledger Instance Expiration. The problem comes from the Smart Deploy API");
        return 0;
    }

}