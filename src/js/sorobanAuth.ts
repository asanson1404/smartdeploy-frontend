import UIkit from "uikit";
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

async function checkUserAndRender() {
  window.hasFreighter = await isConnected();
  if (window.hasFreighter) {
    try {
      window.sorobanUserAddress = await getPublicKey();
      window.freighterNetwork = await getNetworkDetails();
      if (window.sorobanUserAddress) {
        await ensureAccountFunded(window.sorobanUserAddress);

        const userContracts = await getUserContracts({
          start: 0,
          limit: 100,
        });

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
            const copyHeader = document.createElement("th");
            copyHeader.textContent = "Copy";
            headerRow.appendChild(contractHeader);
            headerRow.appendChild(addressHeader);
            headerRow.appendChild(copyHeader);
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

              const copyCell = document.createElement("td");
              const copyButton = document.createElement("i");
              copyButton.className = "fa-regular fa-clipboard";
              copyButton.addEventListener("click", function () {
                navigator.clipboard
                  .writeText(address)
                  .then(() => {
                    UIkit.notification({
                      message: "Address copied to clipboard",
                      status: "primary",
                      pos: "top-center",
                      timeout: 2000,
                    });
                  })
                  .catch((err) => {
                    console.error("Failed to copy text: ", err);
                  });
              });
              copyCell.appendChild(copyButton);
              row.appendChild(copyCell);

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

function getBrowserAndPlatform() {
  const { userAgent } = navigator;
  let browserName = "unknown";
  let platform = "unknown";

  // Detect browser
  if (/(chrome|brave)/i.test(userAgent)) {
    browserName = "Chrome/Brave";
  } else if (/firefox/i.test(userAgent)) {
    browserName = "Firefox";
  }

  // Detect platform
  if (/mobi/i.test(userAgent)) {
    platform = "mobile";
  } else {
    platform = "desktop";
  }

  return { browserName, platform };
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    const { browserName, platform } = getBrowserAndPlatform();

    if (platform === "mobile") {
      UIkit.notification({
        message: "Freighter Wallet is not available on mobile devices.",
        status: "danger",
        pos: "top-center",
        timeout: 3000,
      });
    }

    if (browserName !== "Chrome/Brave" && browserName !== "Firefox") {
      UIkit.notification({
        message:
          "Freighter Wallet is only available on Chrome, Brave, or Firefox.",
        status: "danger",
        pos: "top-center",
        timeout: 3000,
      });
    }

    (window as any).checkUserAndRender = checkUserAndRender;
    checkUserAndRender();

    const freighterButton = document.getElementById("freighterButton");

    if (freighterButton) {
      freighterButton.addEventListener("click", async () => {
        const { browserName, platform } = getBrowserAndPlatform();

        if (platform === "mobile") {
          UIkit.notification({
            message: "Freighter Wallet is not available on mobile devices.",
            status: "danger",
            pos: "top-center",
            timeout: 3000,
          });
          return;
        }

        if (browserName !== "Chrome/Brave" && browserName !== "Firefox") {
          UIkit.notification({
            message:
              "Freighter Wallet is only available on Chrome, Brave, or Firefox.",
            status: "danger",
            pos: "top-center",
            timeout: 3000,
          });
          return;
        }

        const isConnectedResult = await isConnected();
        console.log("Freighter connected:", isConnectedResult);
        if (isConnectedResult) {
          UIkit.notification({
            message: "You're already connected to the Freighter Wallet.",
            status: "warning",
            pos: "top-center",
            timeout: 5000,
          });
        } else {
          checkUserAndRender();
        }
      });
    }
  });
}
