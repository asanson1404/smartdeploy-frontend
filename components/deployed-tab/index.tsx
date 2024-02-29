import styles from './style.module.css';

import { FetchDatas } from "@/pages";
import { DeployedContract, listAllDeployedContracts, getDeployEvents, getMyDeployedContracts, DeployEventData } from './backend';
import { useState, useEffect } from "react";
import { DeployedTabContent } from './deployed-tab-content';
import { ToggleButtons, Tab } from './toggle-button-component';
import ClipboardIconComponent from './clip-board-component';
import { useThemeContext } from '../../context/ThemeContext'
import { useWalletContext } from '../../context/WalletContext'

export default function DeployedTab(props: FetchDatas) {

    // Import the current Theme
    const { activeTheme } = useThemeContext();
    // Import wallet infos
    const walletContext = useWalletContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<Tab>(Tab.All);
    const [deployedContracts, setDeployedContracts] = useState<DeployedContract[]>([]);
    const [myDeployedContracts, setMyDeployedContracts] = useState<DeployedContract[] | undefined>([]);
    const [deployEvents, setDeployEvents] = useState<DeployEventData[] | undefined>([]);

    // newDeployEvents is updated when a new event is indexed
    let newDeployEvents = getDeployEvents();
    // Update deployEvents as well
    if (newDeployEvents != deployEvents) {
        setDeployEvents(newDeployEvents);
    }
    //console.log(deployEvents);

    /*useEffect(() => {

        async function fetchDeployedContracts(deployEvents) {
            try {
              const datas = await listAllDeployedContracts();
              setDeployedContracts(datas as DeployedContract[]);
              setLoading(false);
            } catch (error) {
                console.error(error);
                window.alert(error);
                setError(true);
            }
        }

        if (props.fetch === true) {
            setLoading(true);
            fetchDeployedContracts();
            props.setFetch(false);
        }

    }, [props.fetch]);*/

    useEffect(() => {
        if (walletContext.connected) {
            const myContracts = getMyDeployedContracts(deployedContracts, walletContext.address);
            setMyDeployedContracts(myContracts);
        }
    }, [deployedContracts, selectedTab])

    if (loading) {
        const content1: JSX.Element[] = [];

        content1.push(
            <tr data-theme={activeTheme}>
                <td className={styles.contractCell}>smartdeployyyyyyyyyyyyyyyyyyyyyyyyt</td>
                <td>CBXSF7FVBQNLQLNWZLPB7RIVMHBGTEZEWKBELZAX3PKZDSCROIXMV4LA</td>
                <ClipboardIconComponent address="CBXSF7FVBQNLQLNWZLPB7RIVMHBGTEZEWKBELZAX3PKZDSCROIXMV4LA"/>
            </tr>
        );
        content1.push(
            <tr data-theme={activeTheme}>
                <td className={styles.contractCell}>smartdeploy</td>
                <td>CDHEELOMWTX3SMRJ4RMLSIKWMXP62KKWNVJ3BGJQ354MTFK4HMDDOUSE</td>
                <ClipboardIconComponent address="CDHEELOMWTX3SMRJ4RMLSIKWMXP62KKWNVJ3BGJQ354MTFK4HMDDOUSE"/>
            </tr>
        );
    
        const content2: JSX.Element[] = [];
    
        content2.push(
            <tr data-theme={activeTheme}>
                <td className={styles.contractCell}>smartdeployyyyyyyyyyyyyyyyyyyyyyyy</td>
                <td>CDHEELOMWTX3SMRJ4RMLSIKWMXP62KKWNVJ3BGJQ354MTFK4HMDDOUSE</td>
                <ClipboardIconComponent address="CDHEELOMWTX3SMRJ4RMLSIKWMXP62KKWNVJ3BGJQ354MTFK4HMDDOUSE"/>
            </tr>
        );
        content2.push(
            <tr data-theme={activeTheme}>
                <td className={styles.contractCell}>smartdeploy</td>
                <td>CBXSF7FVBQNLQLNWZLPB7RIVMHBGTEZEWKBELZAX3PKZDSCROIXMV4LA</td>
                <ClipboardIconComponent address="CBXSF7FVBQNLQLNWZLPB7RIVMHBGTEZEWKBELZAX3PKZDSCROIXMV4LA"/>
            </tr>
        );
    
        // Vérifier aussi si fetch est toujours utile car normalement le state deployEvents va automatiquement déclencher listAllDeployedContracts
        const content3: JSX.Element[] = [];


        return (
            <div>
                <ToggleButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                {selectedTab == Tab.All ? (
                    <DeployedTabContent title='ALL DEPLOYED CONTRACTS' displayedContracts={content1}/>
                ) : (
                    walletContext.connected ? (
                        content2.length > 0 ? (
                            <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts={content2}/>
                        ) : (
                            <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts="You haven't deployed any contract yet"/>
                        )
                    ) : (
                        <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts="Wallet not connected. Connect your Stellar account to see your deployed contracts."/>
                    )
                )}
            </div>
        )       
    }        

    if (error) { throw new Error("Error when trying to fetch Deployed Contracts") }

    if (deployedContracts) {    

        const rows: JSX.Element[] = [];

        deployedContracts.forEach((deployedContract) => {
            rows.push(
                <tr key={deployedContract.index} data-theme={activeTheme}>
                    <td className={styles.contractCell}>{deployedContract.name}</td>
                    <td>{deployedContract.address}</td>
                    <ClipboardIconComponent address={deployedContract.address}/>
                </tr>
            );
        });

        return(
            <div>
                <ToggleButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                {selectedTab == Tab.All ? (
                    <DeployedTabContent title='ALL DEPLOYED CONTRACTS' displayedContracts={rows}/>
                ) : (
                    walletContext.connected ? (
                        rows.length > 0 ? (
                            <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts={rows}/>
                        ) : (
                            <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts="You haven't deployed any contract yet"/>
                        )
                    ) : (
                        <DeployedTabContent title='MY DEPLOYED CONTRACTS' displayedContracts="Wallet not connected. Connect your Stellar account to see your deployed contracts."/>
                    )
                )}
            </div>
        )
    }

}