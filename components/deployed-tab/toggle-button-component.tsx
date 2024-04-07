import styles from './style.module.css'
import { useThemeContext } from '../../context/ThemeContext'
import { useWalletContext } from '@/context/WalletContext';
import { Dispatch, SetStateAction } from "react";
import { useState } from 'react';
import { ImportPopup } from './import-contract-popups';

export enum Tab {
    All,
    My,
}

export function ToggleButtons({
    selectedTab,
    setSelectedTab
}: {
    selectedTab: Tab,
    setSelectedTab: Dispatch<SetStateAction<Tab>>
}) {

    // Import the current Theme
    const { activeTheme } = useThemeContext();

    // Import wallet infos
    const walletContext = useWalletContext();

    const [importPopup, setImportPopup]   = useState<boolean>(false);

    return (
        <>
        <div className={styles.toggleTabContainer}>
            <div className={selectedTab == Tab.All ? styles.allContractsButtonSelected : styles.allContractsButtonNotSelected}
                 data-theme={activeTheme}
                 onClick={() => { setSelectedTab(Tab.All) }}
            >
                All Contracts
            </div>
            <div className={selectedTab == Tab.My ? styles.myContractsButtonSelected : styles.myContractsButtonNotSelected}
                 data-theme={activeTheme}
                 onClick={() => { setSelectedTab(Tab.My) }}
            >
                My Contracts
            </div>
            <div className={styles.importContractsButton}
                 data-theme={activeTheme}
                 onClick={ () => {
                    if (walletContext.connected) {
                        setImportPopup(true);
                    } else {
                        window.alert("Please connect your wallet to import a contract");
                    }
                 }}
            >
                Import Contract
            </div>
        </div>
        <ImportPopup importPopup={importPopup} setImportPopup={setImportPopup} />
        </>
    )
}