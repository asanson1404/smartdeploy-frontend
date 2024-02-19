import styles from './style.module.css';

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { FaRegClipboard } from "react-icons/fa";
import { MdDone } from "react-icons/md"

type ClipboardIconComponentProps = {
    address: string;
}

async function copyAddr(setCopied: Dispatch<SetStateAction<boolean>> , addr: string) {
    await navigator.clipboard
                             .writeText(addr)
                             .then(() => {
                                setCopied(true);
                             })
                             .catch((err) => {
                                console.error("Failed to copy address: ", err);
                                window.alert(err);
                             });
}

export default function ClipboardIconComponent(props: ClipboardIconComponentProps) {

    const [copied, setCopied] = useState<boolean>(false);
  
    useEffect(() => {
        if(copied === true) {
          const timer = setTimeout(() => {
            setCopied(false)
          }, 1500);
          return () => clearTimeout(timer);
        }
    }, [copied]);
  
    return (
        <>
            {!copied ? (
                <td className={styles.clipboardIconCell}>
                    <FaRegClipboard 
                        className={styles.clipboardIcon}
                        onClick={ () => copyAddr(setCopied, props.address)}
                    />
                </td>
            ) : (
                <td className={styles.clipboardIconCell}>
                    <p className={styles.copiedMessage}><MdDone style={{ marginRight: '0.2rem' }}/>Copied!</p>
                </td>
            )}
        </>
    );
}