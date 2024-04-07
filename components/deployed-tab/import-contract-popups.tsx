import styles from './style.module.css'
import Popup from "reactjs-popup";
import { useState, Dispatch, SetStateAction, ChangeEvent, useEffect } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useWalletContext } from "@/context/WalletContext";
import { ImportArgsObj, importContract } from './backend';


export function ImportPopup({
    importPopup,
    setImportPopup
}: {
    importPopup: boolean,
    setImportPopup: Dispatch<SetStateAction<boolean>>
}) {

    // Import the current Theme
    const { activeTheme } = useThemeContext();

    // Import wallet infos
    const walletContext = useWalletContext();

    const [deployedName, setDeployedName] = useState<string>("");
    const [contractId, setContractId] = useState<string>("");
    const [admin, setAdmin] = useState<string>("");
    const [isImporting, setIsImporting]   = useState<boolean>(false);
    const [bumping, setBumping] = useState<boolean | null>(null);
    const [showBumpingPopup, setShowBumpingPopup] = useState<boolean>(false);
    const [conditionalImportButtonCss, setConditionalImportButtonCss] = useState<boolean>(false);

    useEffect(() => {
        if (bumping != null) {
            setConditionalImportButtonCss(true);
        } else {
            setConditionalImportButtonCss(false);
        }
    }, [bumping]);

    const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDeployedName(e.target.value);
    }

    const handleIdInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setContractId(e.target.value);
    }

    const handleAdminInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAdmin(e.target.value);
    }

    const importData: ImportArgsObj = {
        deployed_name: deployedName,
        contract_id: contractId,
        admin: admin
    }
  
    return (
        <Popup  open={importPopup} closeOnDocumentClick={false} position={"top center"} offsetY={50} trigger={<div></div>} arrow={false}>
            <div className={styles.popupContainer} data-theme={activeTheme}>
                <button className={styles.close} onClick={() => {setImportPopup(false), setBumping(null)}}>
                    &times;
                </button>
                <div className={styles.header}>Import a deployed contract to <span className={styles.nameColor} data-theme={activeTheme}>SmartDeploy</span></div>
                <div className={styles.content}>
                    <div className={styles.inputsDiv}>
                        <b>Contract instance name:</b>
                        <input 
                            className={styles.input}
                            data-theme={activeTheme}
                            type="text" 
                            spellCheck={false} 
                            placeholder="deployed_name" 
                            value={deployedName}
                            onChange={handleNameInputChange}>
                        </input>
                        <br/>
                        <b>Contract id:</b>
                        <input 
                            className={styles.input}
                            data-theme={activeTheme}
                            type="text" 
                            spellCheck={false} 
                            placeholder="CAYAKCZTR2NKR...." 
                            value={contractId}
                            onChange={handleIdInputChange}>
                        </input>
                        <br/>
                        <b>Contract admin:</b>
                        <input 
                            className={styles.input}
                            data-theme={activeTheme}
                            type="text" 
                            spellCheck={false} 
                            placeholder="GD2DGTQWRWGEX...." 
                            value={admin}
                            onChange={handleAdminInputChange}>
                        </input>
                    </div>
                    <div className={styles.bumpContainer}>
                        <p>Do you want SmartDeploy to automatically bump your contract instance when it arrives at expiration time?</p>
                        <div className={styles.checkboxContainer}>
                            <div>
                                <input 
                                    type='checkbox'
                                    onChange={() => { if(bumping !== true) setBumping(true)} }
                                    onClick={() => { if(bumping === true) setBumping(null)} }
                                    checked={bumping === true}
                                />
                                <label>Yes, I agree to pay bumping fees now</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox'
                                    onChange={() => { if(bumping !== false) setBumping(false)} }
                                    onClick={() => { if(bumping === false) setBumping(null)} }
                                    checked={bumping === false}
                                />
                                <label>No</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    {(!isImporting && !bumping) ? (
                        <>
                            <button className={conditionalImportButtonCss ? styles.button : styles.buttonDisabled}
                                    data-theme={activeTheme}
                                    onClick={async () => {
                                        if (deployedName == "") {
                                            window.alert("Contract name not set. Please enter a name for your contract instance before continuing.")
                                        } else if (contractId == "") {
                                            window.alert("Contract id not set. Please enter a contract id before continuing.")
                                        } else if (admin == "") {
                                            window.alert("Contract admin not set. Please enter a contract admin before continuing.")
                                        }
                                        else {
                                            importContract(
                                                walletContext,
                                                importData,
                                                setDeployedName,
                                                setContractId,
                                                setAdmin,
                                                setIsImporting,
                                                setBumping,
                                            )
                                            setImportPopup(false);
                                        }
                                    }}
                                    disabled={bumping === null}
                            >
                                Import
                            </button>
                            <button className={styles.button} data-theme={activeTheme} onClick={() => {setImportPopup(false); setBumping(null)}}>
                                Cancel
                            </button>
                        </>
                    ) : (!isImporting && bumping) ? (
                        <>
                            <button className={conditionalImportButtonCss ? styles.button : styles.buttonDisabled}
                                    data-theme={activeTheme}
                                    onClick={() => {
                                        if (deployedName == "") {
                                            window.alert("Contract name not set. Please enter a name for your contract instance before continuing.")
                                        } else if (contractId == "") {
                                            window.alert("Contract id not set. Please enter a contract id before continuing.")
                                        } else if (admin == "") {
                                            window.alert("Contract admin not set. Please enter a contract admin before continuing.")
                                        }
                                        else {
                                            setShowBumpingPopup(true)
                                        }
                                    }}
                                    disabled={bumping === null}
                            >
                                Continue
                            </button>
                            <button className={styles.button} data-theme={activeTheme} onClick={() => {setImportPopup(false); setBumping(null)}} disabled={showBumpingPopup}>
                                Cancel
                            </button>

                            {showBumpingPopup && (
                                <BumpingPopup   showBumpingPopup={showBumpingPopup} 
                                                setShowBumpingPopup={setShowBumpingPopup}
                                                setImportPopup={setImportPopup}
                                                setDeployedName={setDeployedName}
                                                setContractId={setContractId}
                                                setAdmin={setAdmin}
                                                setBumping={setBumping}
                                                setIsImporting={setIsImporting}
                                                importData={importData}
                                />
                            )}
                        </>
                    ) : (
                        <button className={styles.buttonWhenDeploying} data-theme={activeTheme}>
                            Importing...
                        </button>
                    )}
                </div>
            </div>
        </Popup>
    );
}

function BumpingPopup({
    showBumpingPopup,
    setShowBumpingPopup,
    setImportPopup,
    setBumping,
    setDeployedName,
    setContractId,
    setAdmin,
    setIsImporting,
    importData
}: {
    showBumpingPopup: boolean
    setShowBumpingPopup: Dispatch<SetStateAction<boolean>>,
    setImportPopup: Dispatch<SetStateAction<boolean>>,
    setDeployedName: Dispatch<SetStateAction<string>>,
    setContractId: Dispatch<SetStateAction<string>>,
    setAdmin: Dispatch<SetStateAction<string>>,
    setBumping: Dispatch<SetStateAction<boolean | null>>,
    setIsImporting: Dispatch<SetStateAction<boolean>>,
    importData: ImportArgsObj
}) {

    const { activeTheme } = useThemeContext();
    const walletContext = useWalletContext();

    enum BumpingSubscription {
        SIX_MONTHS,
        ONE_YEAR,
        TWO_YEAR
    }

    const [isDeploying, setIsDeploying] = useState(false);
    const [bumpingSubscription, setBumpingSubscription] = useState<BumpingSubscription | null>(null);
    const [conditionalImportButtonCss, setConditionalImportButtonCss] = useState<boolean>(false);

    useEffect(() => {
        if (bumpingSubscription != null) {
            setConditionalImportButtonCss(true);
        } else {
            setConditionalImportButtonCss(false);
        }
    }, [bumpingSubscription]);


    return (
        <div style={{position: 'absolute', top: 20, left: 20}}>

        
        <Popup  open={showBumpingPopup} closeOnDocumentClick={false} offsetX={500} offsetY={-150} trigger={<div></div>} arrow={false}>
            <div className={styles.bumpingPopupContainer} data-theme={activeTheme}>
                <button className={styles.close} onClick={() => {setBumpingSubscription(null); setShowBumpingPopup(false)}}>
                    &times;
                </button>
                <div className={styles.header}>Bumping subscription for contract instance <span className={styles.nameColor} data-theme={activeTheme}>{importData.deployed_name}</span> </div>
                <div className={styles.content}>
                    <div className={styles.bumpContainer}>
                        <p>How long do you want us to keep your contract instance alive?</p>
                        <div className={styles.checkboxContainer}>
                            <div>
                            <input 
                                    type='checkbox'
                                    onChange={() => { if(bumpingSubscription !== BumpingSubscription.SIX_MONTHS) setBumpingSubscription(BumpingSubscription.SIX_MONTHS)} }
                                    onClick={() => { if(bumpingSubscription === BumpingSubscription.SIX_MONTHS) setBumpingSubscription(null)} }
                                    checked={bumpingSubscription === BumpingSubscription.SIX_MONTHS}
                                />
                                <label>6 months (xxx XLM)</label>
                            </div>
                            <div>
                            <input 
                                    type='checkbox'
                                    onChange={() => { if(bumpingSubscription !== BumpingSubscription.ONE_YEAR) setBumpingSubscription(BumpingSubscription.ONE_YEAR)} }
                                    onClick={() => { if(bumpingSubscription === BumpingSubscription.ONE_YEAR) setBumpingSubscription(null)} }
                                    checked={bumpingSubscription === BumpingSubscription.ONE_YEAR}
                                />
                                <label>1 year (xxx XLM)</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox'
                                    onChange={() => { if(bumpingSubscription !== BumpingSubscription.TWO_YEAR) setBumpingSubscription(BumpingSubscription.TWO_YEAR)} }
                                    onClick={() => { if(bumpingSubscription === BumpingSubscription.TWO_YEAR) setBumpingSubscription(null)} }
                                    checked={bumpingSubscription === BumpingSubscription.TWO_YEAR}
                                />
                                <label>2 years (xxx XLM)</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    {!isDeploying ? (
                        <>
                            <button className={conditionalImportButtonCss ? styles.button : styles.buttonDisabled}
                                    data-theme={activeTheme}
                                    onClick={async () => {

                                        importContract(
                                            walletContext,
                                            importData,
                                            setDeployedName,
                                            setContractId,
                                            setAdmin,
                                            setIsImporting,
                                            setBumping,
                                        )

                                        setShowBumpingPopup(false);
                                        setImportPopup(false);
                                        
                                    }}
                                    disabled={bumpingSubscription === null}
                            >
                                Import
                            </button>
                            <button className={styles.button} data-theme={activeTheme} onClick={() => {setBumpingSubscription(null); setShowBumpingPopup(false)}}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button className={styles.buttonWhenDeploying} data-theme={activeTheme}>
                            Importing...
                        </button>
                    )}
                </div>
            </div>
        </Popup>
        </div>
    )
}