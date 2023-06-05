import { fill, hide, show } from './domHelpers'
import * as smartdeploy from "smartdeploy"

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
  } else {
    if (window.hasFreighter) {
      document.querySelector('#getFreighter')!.className = 'done'
    }
    if (window.sorobanUserAddress) {
      document.querySelector('#enableFreighter')!.className = 'done'
    }
    if (window.freighterNetwork?.network.toUpperCase() === 'FUTURENET') {
      document.querySelector('#selectFuturenet')!.className = 'done'
    }

    hide('allReady')
    show('gettingStarted')
  }
}
