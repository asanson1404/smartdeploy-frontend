import styles from './style.module.css';

import { useThemeContext } from '../ThemeContext'
import { StateVariablesProps, FetchDatas } from "@/pages";
import { useState, useEffect } from 'react';
import { Version } from 'smartdeploy-client'
import { PublishedContract, listAllPublishedContracts } from './smartdeploy-functions'
import { DeployVersionComponent } from './deploy-components'


export default function PublishedTab(props: StateVariablesProps) {

    // Import the current Theme
    const { activeTheme } = useThemeContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [publishedContracts, setPublishedContracts] = useState<PublishedContract[]>([]);

    useEffect(() => {

        async function fetchPublishedContracts() {
            try {
              const datas = await listAllPublishedContracts();
              setPublishedContracts(datas as PublishedContract[]);
              setLoading(false);
            } catch (error) {
                console.error(error);
                window.alert(error);
                setError(true);
            }
        }

        if (props.fetchPublished?.fetch === true) {
            setLoading(true);
            fetchPublishedContracts();
            props.fetchPublished.setFetch(false);
        }

    }, [props.fetchPublished?.fetch]);
    
    if (loading) return (
        <div className={styles.publishedTabContainer} data-theme={activeTheme}>
            <table className={styles.publishedTabHead}>
                <caption data-theme={activeTheme}>PUBLISHED CONTRACTS</caption>
                <colgroup>
                    <col className={styles.contractCol}></col>
                    <col className={styles.authorCol}></col>
                    <col className={styles.versionCol}></col>
                    <col className={styles.deployCol}></col>
                </colgroup>
                <thead data-theme={activeTheme}>
                    <tr>
                        <th>Contract</th>
                        <th>Author</th>
                        <th>Version</th>
                        <th>Deploy</th>
                    </tr>
                </thead>
            </table>
            <div className={styles.publishedTabContentContainer}>
                <table className={styles.publishedTabContent}>
                    <colgroup>
                        <col className={styles.contractCol}></col>
                        <col className={styles.authorCol}></col>
                        <col className={styles.versionCol}></col>
                        <col className={styles.deployCol}></col>
                    </colgroup>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
        </div>
    );

    else if (error) { throw new Error("Error when trying to fetch Published Contracts");}

    else if (publishedContracts) {

        const rows: JSX.Element[] = [];

        publishedContracts.forEach((publishedContract) => {

            const versions: {version: Version, version_string: string}[] = [];

            publishedContract.versions.forEach((obj) => {

                // Version obj
                const version = obj.version;

                // Version string
                const major = version.major;
                const minor = version.minor;
                const patch = version.patch;
                const version_string = `v.${major}.${minor}.${patch}`;

                versions.push({version, version_string});
            })
            versions.reverse();
            
            rows.push(
                <tr key={publishedContract.index} data-theme={activeTheme}>
                    <td className={styles.contractCell}>{publishedContract.name}</td>
                    <td>{publishedContract.author}</td>
                    <DeployVersionComponent
                        userWalletInfo={props.walletInfo}
                        refetchDeployedContract={props.fetchDeployed as FetchDatas}
                        contract_name={publishedContract.name}
                        versions={versions}
                    />
                </tr>
            );
        });
        
        return(
            <div className={styles.publishedTabContainer} data-theme={activeTheme}>
                <table className={styles.publishedTabHead}>
                    <caption data-theme={activeTheme}>PUBLISHED CONTRACTS</caption>
                    <colgroup>
                        <col className={styles.contractCol}></col>
                        <col className={styles.authorCol}></col>
                        <col className={styles.versionCol}></col>
                        <col className={styles.deployCol}></col>
                    </colgroup>
                    <thead data-theme={activeTheme}>
                        <tr>
                            <th>Contract</th>
                            <th>Author</th>
                            <th>Versions</th>
                            <th>Deploy</th>
                        </tr>
                    </thead>
                </table>
                <div className={styles.publishedTabContentContainer}>
                    <table className={styles.publishedTabContent}>
                        <colgroup>
                            <col className={styles.contractCol}></col>
                            <col className={styles.authorCol}></col>
                            <col className={styles.versionCol}></col>
                            <col className={styles.deployCol}></col>
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