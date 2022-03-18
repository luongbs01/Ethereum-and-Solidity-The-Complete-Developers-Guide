import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

const initWeb3 = async () => {
    let web3 = null;

    const provider = await detectEthereumProvider({
        mustBeMetaMask: true
    });

    if (provider) {
        console.log("Metamask Ethereum provider successfully detected!");

        const {ethereum} = window;
        web3 = new Web3(provider);

        ethereum.on("chainChanged", (_chainId) => {
            window.location.reload();
        });

        ethereum.on("disconnect", (_error) => {
            window.location.reload();
        });
    } else {
        console.log("Please install Metamask!");
    }

    return web3;
}

export default initWeb3;