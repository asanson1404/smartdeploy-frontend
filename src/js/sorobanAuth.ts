import {
  getNetworkDetails,
  getPublicKey,
  isConnected,
} from "@stellar/freighter-api";
import render from "./render";
import { Server, list_deployed_contracts } from "smartdeploy";

type RpcError = { code: number; message: string };

function isRpcError(e: unknown): e is RpcError {
  return typeof e === "object" && e !== null && "code" in e && "message" in e;
}

/**
 * Fetch account from {@link HORIZON_URL}.
 * If RPC returns 404 or 405, then the account has not yet been created/funded.
 * In that case, hit {@link FRIENDBOT_URL} to fund it, then re-query RPC to get
 * its up-to-date balance.
 */
async function ensureAccountFunded(publicKey: string): Promise<void> {
  try {
    await Server.getAccount(publicKey);
  } catch (e: unknown) {
    if (isRpcError(e) && e.code === -32600) {
      const { friendbotUrl } = await Server.getNetwork();
      await fetch(`${friendbotUrl}?addr=${publicKey}`);
      await Server.getAccount(publicKey);
    } else {
      // re-throw
      throw e;
    }
  }
}

// get user's deployed contracts
async function getUserContracts(
  userAddress: string
): Promise<Array<[string, string]>> {
  const contractsResult = await list_deployed_contracts({
    start: undefined,
    limit: undefined,
  });

  if (contractsResult.isErr()) {
    throw new Error(contractsResult.unrap_err().message);
  }

  // filter contracts for the ones where the address matches the user's address
  const userContracts = contractsResult
    .unwrap()
    .filter(([, address]) => address === userAddress);

  return userContracts;
}

// on page load, check if user:
// 1. has Freighter installed
// 2. is logged into Freighter
// 3. has Experimental Mode enabled
// 4. has Futurenet selected
// and make sure their account is funded
(async () => {
  window.hasFreighter = await isConnected();
  if (window.hasFreighter) {
    try {
      window.sorobanUserAddress = await getPublicKey();
      window.freighterNetwork = await getNetworkDetails();
      if (window.sorobanUserAddress) {
        await ensureAccountFunded(window.sorobanUserAddress);

        const userContracts = await getUserContracts(window.sorobanUserAddress);
        console.log("User Contracts: ", userContracts);

        // update DOM
        const userAddressElement = document.getElementById("userAddress");
        if (userAddressElement) {
          userAddressElement.textContent = window.sorobanUserAddress;
        }

        const userContractsElement = document.getElementById("userContracts");
        if (userContractsElement) {
          userContractsElement.innerHTML = "";

          // check if there ARE contracts
          if (userContracts.length > 0) {
            // add fetched contracts to the element
            userContracts.forEach(([name, address]) => {
              const listItem = document.createElement("li");
              listItem.textContent = `Contract: ${name}, Address: ${address}`;
              userContractsElement.appendChild(listItem);
            });
          } else {
            // if no contracts
            userContractsElement.textContent = "No contracts to display.";
          }
        }
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }
  render();
})();
