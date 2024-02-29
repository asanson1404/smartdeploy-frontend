import styles from './style.module.css';

import { useThemeContext } from '../../context/ThemeContext'
import { StateVariablesProps, FetchDatas } from "@/pages";
import { useState, useEffect } from 'react';
import { PublishTabContent } from './publish-tab-content';
import { ToggleButtons, Tab } from './toggle-button-component';
import { Version } from 'smartdeploy-client'
import { PublishedContract, listAllPublishedContracts, getPublishEvents, PublishEventData } from './backend'
import { DeployVersionComponent } from './deploy-components'
import { useWalletContext } from '../../context/WalletContext'

export default function PublishedTab(props: StateVariablesProps) {

    // Import the current Theme
    const { activeTheme } = useThemeContext();
    // Import wallet infos
    const walletContext = useWalletContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<Tab>(Tab.All);
    const [publishedContracts, setPublishedContracts] = useState<PublishedContract[]>([]);
    const [publishEvents, setPublishEvents] = useState<PublishEventData[] | undefined>([]);

    // newPublishEvents is updated when a new event is indexed
    let newPublishEvents = getPublishEvents();
    // Update publishEvents as well
    if (newPublishEvents != publishEvents) {
        setPublishEvents(newPublishEvents);
    }
    //console.log(publishEvents);

    /*useEffect(() => {

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

    }, [props.fetchPublished?.fetch]);*/
    
    if (loading) {

        const content3: JSX.Element[] = [];

        const versions: { version: Version, version_string: string }[] = [
            { version: { major: 1, minor: 0, patch: 0 }, version_string: "v1.0.0" },
            { version: { major: 2, minor: 1, patch: 3 }, version_string: "v2.1.3" },
            { version: { major: 3, minor: 5, patch: 2 }, version_string: "v3.5.2" },
        ];

        content3.push(
            <tr data-theme={activeTheme}>
                <td className={styles.contractCell}>Smartdeploy</td>
                <td>GD2DGTQWRWGEX4K5TFPVPGD6SXRSYTXTFBB2QOU3E4WVBYM7PINJKVVD</td>
                <DeployVersionComponent
                    refetchDeployedContract={props.fetchDeployed as FetchDatas}
                    contract_name="Smartdeploy"
                    versions={versions}
                />
            </tr>
        );
        content3.push(
            <tr data-theme={activeTheme}>
                <td className={styles.contractCell}>testssss</td>
                <td>GD2DGTQWRWGEX4K5TFPVPGD6SXRSYTXTFBB2QOU3E4WVBYM7PINJKVVD</td>
                <DeployVersionComponent
                    refetchDeployedContract={props.fetchDeployed as FetchDatas}
                    contract_name="testssss"
                    versions={versions}
                />
            </tr>
        );

        return (
            <div>
                <ToggleButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                {selectedTab == Tab.All ? (
                    <PublishTabContent title='ALL PUBLISHED CONTRACTS' displayedContracts={content3}/>
                ) : (
                    walletContext.connected ? (
                        content3.length > 0 ? (
                            <PublishTabContent title='MY PUBLISHED CONTRACTS' displayedContracts={content3}/>
                        ) : (
                            <PublishTabContent title='MY PUBLISHED CONTRACTS' displayedContracts="You haven't published or haven't followed any contract yet"/>
                        )
                    ) : (
                        <PublishTabContent title='MY PUBLISHED CONTRACTS' displayedContracts="Wallet not connected. Connect your Stellar account to see your published contracts."/>
                    )
                )}
            </div>
        );
    }

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
                        refetchDeployedContract={props.fetchDeployed as FetchDatas}
                        contract_name={publishedContract.name}
                        versions={versions}
                    />
                </tr>
            );
        });
        
        return(
            <div>
                <ToggleButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                {selectedTab == Tab.All ? (
                    <PublishTabContent title='ALL PUBLISHED CONTRACTS' displayedContracts="All"/>
                ) : (
                    walletContext.connected ? (
                        rows.length > 0 ? (
                            <PublishTabContent title='MY PUBLISHED CONTRACTS' displayedContracts={rows}/>
                        ) : (
                            <PublishTabContent title='MY PUBLISHED CONTRACTS' displayedContracts="You haven't published or haven't followed any contract yet"/>
                        )
                    ) : (
                        <PublishTabContent title='MY PUBLISHED CONTRACTS' displayedContracts="Wallet not connected. Connect your Stellar account to see your deployed contracts."/>
                    )
                )}
            </div>
        )
    }
}