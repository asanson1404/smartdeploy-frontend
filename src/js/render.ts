import { fill, hide, show } from './domHelpers'
import * as smartdeploy from "smartdeploy";

/**
 * update the html based on user & data state
 */
export default async function render() {
  const allReady = window.hasFreighter &&
    window.sorobanUserAddress &&
    window.freighterNetwork?.network.toUpperCase() === 'FUTURENET'

  if (allReady) {
    //@ts-ignore
    window.smartdeploy = smartdeploy;
    hide('gettingStarted')

    // fill('deployedContracts').with()

    show('allReady')
    show('contractPanel')
  } else {
    if (window.hasFreighter) {
      document.querySelector('#getFreighter')!.classList.add('done');
      document.querySelector('#getFreighterCheck')!.style.display = 'inline';
    }
    if (window.sorobanUserAddress) {
      document.querySelector('#enableFreighter')!.classList.add('done');
      document.querySelector('#enableFreighterCheck')!.style.display = 'inline';
    }
    if (window.freighterNetwork?.network.toUpperCase() === 'FUTURENET') {
      document.querySelector('#selectFuturenet')!.classList.add('done');
      document.querySelector('#selectFuturenetCheck')!.style.display = 'inline';
    }

    hide('allReady')
    hide('contractPanel')
    show('gettingStarted')
  }
}
