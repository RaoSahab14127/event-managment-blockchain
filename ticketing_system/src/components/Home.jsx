import React, { useState, useEffect } from "react";
import { getMetaMask } from "../../helpers/web3driver";
import detectEthereumProvider from '@metamask/detect-provider';

import Accordion from 'react-bootstrap/Accordion';
import { appLogger } from "../../helpers/common";

function Home() {
  const [hasProvider, setHasProvider] = useState(null)
  const initialState = { accounts: [] };
  const [wallet, setWallet] = useState(initialState);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);


  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))
    }

    getProvider()
  }, [])

  const updateWallet = async (accounts) => {
    setWallet({ accounts });
  };

  const handleConnect = async () => {
    try {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      updateWallet(accounts);
      document.getElementById("connection-status").innerHTML = "";
    } catch (e) {
      console.log(e);
      console.log("Connection failed")
      document.getElementById("connection-status").innerHTML = "Connection Failed";
    }
    setCurrentAccountIndex(0)
  };

  const changeSelectedWallet = (e) => {
    setCurrentAccountIndex(e.target.value)
  }
  appLogger("wallet data", wallet)
  return (
    <>
      <div>
        {
          wallet.accounts.length > 0
            ? <h2>Your Meta Mask Wallet Is Connected 🦊</h2>
            : <h2>Connect Your Meta Mask Wallet To Proceed 🦊</h2>
        }
      </div>

      {wallet.accounts.length <= 0 ? (
        <button onClick={handleConnect}>Connect MetaMask</button>
      ) : (
        <em class="text-warning">Active Account: <span className="text-orange text-bold">{wallet.accounts[currentAccountIndex]}</span></em>
      )}

      <br />
      <b> select current account</b>
      <input type="number" placeHolder="Account ID" min={0} max={wallet.accounts.length - 1} value={currentAccountIndex} onChange={changeSelectedWallet} />
      <br />

      <div><strong id="connection-status"></strong></div>


      <div className="accounts-list-div">
        {wallet.accounts.length != 0 ?
          <div>
            <h2>Accounts In Your Wallet</h2>
            <ol>
              {
                wallet.accounts.map((item, index) => {
                  return <li id={`${index}`}>{item}</li>
                })
              }
            </ol>
          </div>
          :
          <em class="text-light">Your accounts will be shown here</em>
        }
      </div>

    </>
  );
}

export default Home;
