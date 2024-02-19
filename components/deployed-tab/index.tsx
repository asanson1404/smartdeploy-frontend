import styles from './style.module.css';

import { FetchDatas } from "@/pages";
import { DeployedContract, listAllDeployedContracts } from './smartdeploy-functions';
import { useState, useEffect } from "react";
import ClipboardIconComponent from './clip-board-component';
import { useThemeContext } from '../ThemeContext'

export default function DeployedTab(props: FetchDatas) {

    // Import the current Theme
    const { activeTheme } = useThemeContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [deployedContracts, setDeployedContracts] = useState<DeployedContract[]>([]);

    useEffect(() => {

        async function fetchDeployedContracts() {
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

    }, [props.fetch]);

    if (loading) return (
        <div className={styles.deployedTabContainer} data-theme={activeTheme}>
            <table className={styles.deployedTabHead}>
                <caption data-theme={activeTheme}>DEPLOYED CONTRACTS</caption>
                <colgroup>
                    <col className={styles.contractCol}></col>
                    <col className={styles.addressCol}></col>
                    <col className={styles.copyCol}></col>
                </colgroup>
                <thead data-theme={activeTheme}>
                    <tr>
                        <th>Contract</th>
                        <th>Address</th>
                        <th className={styles.copyThead}>Copy</th>
                    </tr>
                </thead>
            </table>
            <div className={styles.deployedTabContentContainer}>
                <table className={styles.deployedTabContent}>
                    <colgroup>
                        <col className={styles.contractCol}></col>
                        <col className={styles.addressCol}></col>
                        <col className={styles.copyCol}></col>
                    </colgroup>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
        </div>
    )

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
            <div className={styles.deployedTabContainer} data-theme={activeTheme}>
                <table className={styles.deployedTabHead}>
                    <caption data-theme={activeTheme}>DEPLOYED CONTRACTS</caption>
                    <colgroup>
                        <col className={styles.contractCol}></col>
                        <col className={styles.addressCol}></col>
                        <col className={styles.copyCol}></col>
                    </colgroup>
                    <thead data-theme={activeTheme}>
                        <tr>
                            <th>Contract</th>
                            <th>Address</th>
                            <th className={styles.copyThead}>Copy</th>
                        </tr>
                    </thead>
                </table>
                <div className={styles.deployedTabContentContainer}>
                    <table className={styles.deployedTabContent}>
                        <colgroup>
                            <col className={styles.contractCol}></col>
                            <col className={styles.addressCol}></col>
                            <col className={styles.copyCol}></col>
                        </colgroup>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}