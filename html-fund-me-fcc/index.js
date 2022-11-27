// in nodejs
// require()

// in frontend js you cant use require
// we need to use imports

import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connectBtn")
const balanceBtn = document.getElementById("balanceBtn")
const withdrawBtn = document.getElementById("withdrawBtn")
const fundBtn = document.getElementById("fundBtn")

connectBtn.onclick = connect
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw
fundBtn.onclick = fund

// console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectBtn.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectBtn.innerHTML = "Please install MetaMask"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}..`)
    if (typeof window.ethereum !== "undefined") {
        // provider / connection to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // signer / wallet / someone with some gas
        const signer = provider.getSigner()
        console.log(signer)

        // contract that we are interacting with
        // ^ ABI and Address
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // listen for the tx to be mined
            await listenForTxMine(txResponse, provider)
            console.log("Done!")
            // listed for an event
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTxMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}..`)
    // return new Promise()
    // create a listener for blockchain
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Completed with ${txReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing..")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const txResponse = await contract.withdraw()
            await listenForTxMine(txResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
