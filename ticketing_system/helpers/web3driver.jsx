import Web3, { InvalidValueError } from 'web3';
import EventManagementContract from '../../build/contracts/EventManagement.json';
import { providerType } from '../constants';

/**
 * Detects MetaMask connectivity
 * 
 * @returns boolean
 */
export function getMetaMask(){
    let injectedProvider = false;

    if (typeof window.ethereum !== 'undefined') {
        injectedProvider = true;
        console.log(window.ethereum);
      }
      
    const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false;

    return isMetaMask;
    
}

// TODO: for dapp browsers
export const getWeb3ForDappBrowsers = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        resolve(web3);
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        reject('Non-Ethereum browser detected');
      }
    });
  });

export const getWeb3ForRegularBrowser = (providerURL, type) => {
    switch (type) {
        case providerType.http:
            return new Web3(new Web3.providers.HttpProvider(providerURL));
            break;
        case providerType.webSocket:
            return new Web3(new Web3.providers.WebsocketProvider(providerURL));
            break;
        default:
            throw InvalidValueError("Provider type is invalid")
            break;
    }
    return new Web3(new Web3.providers.HttpProvider(providerURL));
}

export const getOneAccount = (web3, index) => {
    // TODO: take an index and fetch an account from web3 module

}

export const getAllAccounts = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    return accounts;
}

export const getContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = EventManagementContract.networks[networkId];
  return new web3.eth.Contract(
    EventManagementContract.abi,
    deployedNetwork && deployedNetwork.address,
  );
};


