import styles from './style.module.css';

import { DeployEventData } from '@/mercury_indexer/smartdeploy-api-client';
import { DeployedContract, listAllDeployedContracts, getMyDeployedContracts } from './backend';
import { useState, useEffect } from "react";
import { DeployedTabContent } from './deployed-tab-content';
import { ToggleButtons, Tab } from './toggle-button-component';
import { FcOk } from "react-icons/fc";
import { IoMdCloseCircle } from "react-icons/io";
import ClipboardIconComponent from './clip-board-component';
import { useThemeContext } from '../../context/ThemeContext'
import { useWalletContext } from '../../context/WalletContext'

export default function DeployedTab({
    deployEvents
} : {
    deployEvents: DeployEventData[] | undefined
}) {

    // Import the current Theme
    const { activeTheme } = useThemeContext();
    // Import wallet infos
    const walletContext = useWalletContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<Tab>(Tab.All);
    const [allDeployedContracts, setAllDeployedContracts] = useState<DeployedContract[]>([]);
    const [myDeployedContracts, setMyDeployedContracts] = useState<DeployedContract[] | undefined>([]);

    // useEffect to have All Deployed Contracts
    useEffect(() => {

        async function fetchDeployedContracts() {
            try {
                const datas = await listAllDeployedContracts(deployEvents);
                if (datas != 0) {
                    setAllDeployedContracts(datas as DeployedContract[]);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                window.alert(error);
                setError(true);
            }
        }

        fetchDeployedContracts();

    }, [deployEvents]);

    // useEffect to have My Published Contracts
    useEffect(() => {
        const t = getMyDeployedContracts(allDeployedContracts, walletContext.address);
        if (t != 0) {
            setMyDeployedContracts(t);
        }
    }, [allDeployedContracts])

    if (loading) {

        return (
            <div>
                <ToggleButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                {selectedTab == Tab.All ? (
                    <DeployedTabContent title='ALL DEPLOYED CONTRACTS' displayedContracts="Loading..."/>
                ) : (
                    walletContext.connected ? (
                        <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts="Loading..."/>
                    ) : (
                        <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts="Wallet not connected. Connect your Stellar account to see your deployed contracts."/>
                    )
                )}
            </div>
        )       
    }        

    else if (error) { throw new Error("Error when trying to fetch Deployed Contracts") }

    else if (allDeployedContracts && selectedTab == Tab.All) {    

        const allDeployedContractsRows: JSX.Element[] = [];

        allDeployedContracts.forEach((deployedContract) => {

            var version_string = "no_evt_data";
            if (deployedContract.version) {
                version_string = `v.${deployedContract.version.major}.${deployedContract.version.minor}.${deployedContract.version.patch}`;
            }

            allDeployedContractsRows.push(
                <tr key={deployedContract.index} data-theme={activeTheme}>
                    <td className={styles.contractCell}>{deployedContract.name}</td>
                    <td>{deployedContract.address}</td>
                    <td>
                        <div className={styles.fromTd}>
                            <p>{deployedContract.fromPublished}</p>
                            <p>({version_string})</p>
                        </div>
                    </td>
                    <td>
                        <div className={styles.ttlTd}>
                            <p>03/12/24</p>
                            <p className={styles.bumpLine}><IoMdCloseCircle style={{ fill: 'rgb(224, 16, 16)' }}/>No automatic bump</p>
                        </div>
                    </td>
                </tr>
            );
        });

        return(
            <div>
                <ToggleButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <DeployedTabContent title='ALL DEPLOYED CONTRACTS' displayedContracts={allDeployedContractsRows}/>
            </div>
        )
    }

    else if (myDeployedContracts && selectedTab == Tab.My) {

        const myDeployedContractsRows: JSX.Element[] = [];

        myDeployedContracts.forEach((deployedContract) => {

            var version_string = "no_evt_data";
            if (deployedContract.version) {
                version_string = `v.${deployedContract.version.major}.${deployedContract.version.minor}.${deployedContract.version.patch}`;
            }

            myDeployedContractsRows.push(
                <tr key={deployedContract.index} data-theme={activeTheme}>
                    <td className={styles.contractCell}>{deployedContract.name}</td>
                    <td>{deployedContract.address}</td>
                    <td>
                        <div className={styles.fromTd}>
                            <p>{deployedContract.fromPublished}</p>
                            <p>({version_string})</p>
                        </div>
                    </td>
                    <td>
                        <div className={styles.ttlTd}>
                            <p>03/12/24</p>
                            <p className={styles.bumpLine}><FcOk/>bump in: 18d18h36m</p>
                        </div>
                    </td>
                </tr>
            );
        })

        return(
            <div>
                <ToggleButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                {walletContext.connected ? (
                    myDeployedContracts.length > 0 ? (
                        <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts={myDeployedContractsRows}/>
                    ) : (
                        <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts="You haven't published or deployed any contract yet"/>
                    )
                ) : (
                    <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts="Wallet not connected. Connect your Stellar account to see your deployed contracts."/>
                )}
            </div>
        )
    }

}