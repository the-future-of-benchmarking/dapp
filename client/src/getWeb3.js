import Web3 from "web3";


const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        
        try {
          console.log("window.ethereum")
        const web3 = new Web3(window.ethereum);
        console.log("a")
        
        

        let accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if(accounts.length === 0){
          alert("Select an account")
        }
        

        let reqAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        

          // Accounts now exposed
          resolve({web3, ethereum: window.ethereum, accounts: reqAccounts});
        } catch (error) {
          alert("Zugriff auf MetaMask fehlgeschlagen, bitte Seite neu laden")
          reject(error);
          
        }
      }
      // Fallback to localhost; use dev console port by default...
      else {
        alert("Zugriff auf geeignete Ethereum Erweiterung (wie z.B. MetaMask) fehlgeschlagen. Bitte installieren sie MetaMask")
      }
    });
  });

export default getWeb3;
