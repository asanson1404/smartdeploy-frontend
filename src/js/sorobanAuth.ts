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

async function getUserContracts({
  start,
  limit,
}: {
  start?: number;
  limit?: number;
}): Promise<Array<[string, string]>> {
  const contractsResult = await list_deployed_contracts({
    start,
    limit,
  });

  const userContracts = contractsResult.unwrap();

  return userContracts;
}

async function checkFreighterPresence() {
  window.hasFreighter = await isConnected();
  const freighterButton = document.getElementById("freighterButton");
  const freighterMessage = document.getElementById("freighterMessage");

  if (window.hasFreighter) {
    if (freighterButton) {
      freighterButton.removeAttribute("disabled");
    }
    if (freighterMessage) {
      freighterMessage.textContent = "Freighter is installed.";
    }
  } else {
    if (freighterButton) {
      freighterButton.setAttribute("disabled", "true");
    }
    if (freighterMessage) {
      freighterMessage.textContent = "Please install Freighter to continue.";
    }
  }
}

async function checkUserAndRender() {
  if (window.hasFreighter) {
    try {
      const [sorobanUserAddress, freighterNetwork] = await Promise.all([
        getPublicKey(),
        getNetworkDetails(),
      ]);

      window.sorobanUserAddress = sorobanUserAddress;
      window.freighterNetwork = freighterNetwork;

      if (window.sorobanUserAddress) {
        await ensureAccountFunded(window.sorobanUserAddress);

        const userContracts = await getUserContracts({ start: 0, limit: 100 });

        const userAddressElement = document.getElementById("userAddress");
        if (userAddressElement) {
          userAddressElement.textContent = window.sorobanUserAddress;
        }

        const userContractsElement = document.getElementById("userContracts");
        if (userContractsElement) {
          userContractsElement.innerHTML = "";

          if (userContracts.length > 0) {
            const table = document.createElement("table");
            table.className =
              "uk-table uk-table-striped uk-table-condensed uk-text-nowrap";
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            const contractHeader = document.createElement("th");
            contractHeader.textContent = "Contract";
            const addressHeader = document.createElement("th");
            addressHeader.textContent = "Address";
            headerRow.appendChild(contractHeader);
            headerRow.appendChild(addressHeader);
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            userContracts.forEach(([name, address]) => {
              const row = document.createElement("tr");
              const contractCell = document.createElement("td");
              contractCell.textContent = name;
              const addressCell = document.createElement("td");
              addressCell.className = "contract-address-text";
              addressCell.textContent = address;
              row.appendChild(contractCell);
              row.appendChild(addressCell);
              tbody.appendChild(row);
            });
            table.appendChild(tbody);
            userContractsElement.appendChild(table);
          } else {
            userContractsElement.textContent = "No contracts to display.";
          }
        }
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }
  render();
}

(window as any).checkUserAndRender = checkUserAndRender;

(window as any).checkFreighterPresence = checkFreighterPresence;

checkFreighterPresence();

const freighterButton = document.getElementById("freighterButton");
if (freighterButton) {
  freighterButton.addEventListener("click", checkUserAndRender);
}
