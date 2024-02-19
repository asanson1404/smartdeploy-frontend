import styles from './style.module.css'

import { useThemeContext } from '../ThemeContext'
import { UserWalletInfo, FetchDatas } from "@/pages"
import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react'
import Popup from 'reactjs-popup'
import Dropdown from 'react-dropdown'
import { BsSendPlus } from 'react-icons/bs'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'

import { deploy, DeployArgsObj } from './smartdeploy-functions'
import { Version } from 'smartdeploy-client'

type DeployVersionProps = {
    userWalletInfo: UserWalletInfo;
    refetchDeployedContract: FetchDatas;
    contract_name: string;
    selected_version: {version: Version, version_string: string};
}

function DeployIconComponent(props: DeployVersionProps) {

    // Import the current Theme
    const { activeTheme } = useThemeContext();

    const [wouldDeploy, setWouldDeploy]   = useState<boolean>(false); 
    const [deployedName, setDeployedName] = useState<string>("");
    const [isDeploying, setIsDeploying]   = useState<boolean>(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDeployedName(e.target.value);
    }
  
    return (
        <>
            {!wouldDeploy ? (
                <td className={styles.deployIconCell}>
                    <BsSendPlus
                        className={styles.deployIcon}
                        onClick={() => setWouldDeploy(true) }
                    />
                </td>
            ) : (
                <>
                    <td className={styles.deployIconCell}>
                        <p className={styles.deployingMessage}>Deploying...</p>
                    </td>
                    <Popup  open={wouldDeploy} closeOnDocumentClick={false}>
                        <div className={styles.popupContainer} data-theme={activeTheme}>
                            <button className={styles.close} onClick={() => setWouldDeploy(false)}>
                                &times;
                            </button>
                            <div className={styles.header}>Deploy <span className={styles.nameColor} data-theme={activeTheme}>{props.contract_name} ({props.selected_version.version_string})</span> </div>
                            <div className={styles.content}>
                                <p className={styles.mainMessage}><b>You are about to create an instance of <span className={styles.nameColor} data-theme={activeTheme}>{props.contract_name}</span> published contract where you will be the owner.</b><br/></p>
                                <div className={styles.deployedNameDiv}>
                                    <b>Please choose a contract instance name:</b>
                                    <input 
                                        className={styles.deployedNameInput}
                                        data-theme={activeTheme}
                                        type="text" 
                                        spellCheck={false} 
                                        placeholder="deployed_name" 
                                        value={deployedName}
                                        onChange={handleInputChange}>
                                    </input>
                                </div>
                            </div>
                            <div className={styles.buttonContainer}>
                                {!isDeploying ? (
                                    <>
                                        <button className={styles.button} 
                                                data-theme={activeTheme}
                                                onClick={() => {

                                                    setIsDeploying(true);

                                                    const argsObj: DeployArgsObj = {
                                                        contract_name: props.contract_name,
                                                        version: props.selected_version.version,
                                                        deployed_name: deployedName,
                                                        owner: props.userWalletInfo.address,
                                                        salt: undefined,
                                                        init: undefined
                                                    }

                                                    deploy(
                                                        props.userWalletInfo,
                                                        props.refetchDeployedContract,
                                                        setIsDeploying,
                                                        setDeployedName,
                                                        setWouldDeploy,
                                                        argsObj
                                                    );
                                                }}
                                        >
                                            Deploy
                                        </button>
                                        <button className={styles.button} data-theme={activeTheme} onClick={() => setWouldDeploy(false)}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className={styles.buttonWhenDeploying} data-theme={activeTheme}>
                                        Deploying...
                                    </button>
                                )}
                            </div>
                        </div>
                    </Popup>
                </>
            )}
        </>
    );
}

type DeployProps = {
    userWalletInfo: UserWalletInfo;
    refetchDeployedContract: FetchDatas;
    contract_name: string;
    versions: {version: Version, version_string: string}[];
}

export function DeployVersionComponent(props: DeployProps) {

    // The default selected version is the last one
    const defaultSelectedVersion = {
        version: props.versions[0].version,
        version_string: props.versions[0].version_string
    };

    const [selectedVersion, setSelectedVersion] = useState<{version: Version, version_string: string}>(defaultSelectedVersion);

    return (
        <>
            <td>
                <VersionDropdownButton
                    versions={props.versions}
                    selected_version={selectedVersion}
                    set_selected_version={setSelectedVersion}
                />
            </td>
            <DeployIconComponent
                userWalletInfo={props.userWalletInfo}
                refetchDeployedContract={props.refetchDeployedContract}
                contract_name={props.contract_name}
                selected_version={selectedVersion}
            />
        </>
    )
}

type VersionDropdownProps = {
    versions: {version: Version, version_string: string}[];
    selected_version: {version: Version, version_string: string};
    set_selected_version: Dispatch<SetStateAction<{version: Version, version_string: string}>>;
}

export function VersionDropdownButton(props: VersionDropdownProps) {

    const versions: string[] = [];

    props.versions.forEach((version) => {
        versions.push(version.version_string);
    });

    return(
        <div>
            <Dropdown
                className={styles.dropdownContainer}
                controlClassName={styles.dropdownControl}
                menuClassName={styles.dropdownMenu}
                options={versions}
                placeholder={versions[0]}
                arrowClosed={<IoMdArrowDropdown/>}
                arrowOpen={<IoMdArrowDropup/>}
                onChange={(version) => {
    
                    const newSelectedVersionString = version.value;
                    
                    const [major, minor, patch] = version.value.split('.').slice(1);
                    const newSelectedVersion: Version = {
                        major: parseInt(major),
                        minor: parseInt(minor),
                        patch: parseInt(patch),
                    }
                    
                    props.set_selected_version({version: newSelectedVersion, version_string: newSelectedVersionString});
                }}
            />
        </div>
    )
}