import { smartdeploy } from "@/pages";
import { Ok, Err } from 'smartdeploy-client'

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