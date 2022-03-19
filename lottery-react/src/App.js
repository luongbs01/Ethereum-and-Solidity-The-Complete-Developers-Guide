import { useEffect, useRef, useState } from "react";
import initWeb3 from "./utils/web3";
import { abi, contractAddress } from "./utils/lottery"
import './App.css';
const { ethereum } = window;

function App() {
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(false);

  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, useMessage] = useState('');

  const lotteryContract = useRef(null);

  useEffect(async () => {
    if (web3 === null) {
      const webInstance = await initWeb3();
      setWeb3(webInstance);
      if (webInstance !== null) {

        lotteryContract.current = new webInstance.eth.Contract(abi, contractAddress);
        try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0 && ethereum.isConnected()) {
            setConnected(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (connected) {
      async function handler() {
        await getInfo();
      }
      handler();
    }
  }, [connected]);


  const getInfo = async () => {
    const manager = await lotteryContract.current.methods.manager().call();
    const players = await lotteryContract.current.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lotteryContract.current.options.address);
    setManager(manager);
    setPlayers(players);
    setBalance(balance);
  }

  const connectMetamask = async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      setConnected(true);
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setValue('');
    const accounts = await web3.eth.getAccounts();
    await lotteryContract.current.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether")
    })
    await getInfo();
  }

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    lotteryContract.current.events.pickWinnerEvent()
      .on("data", (event) => {
        console.log(event.returnValues);
      });
    await lotteryContract.current.methods.pickWinner().send({
      from: accounts[0]
    })
    await getInfo();
  }

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      {!connected && (
        <button onClick={connectMetamask}>Connect with Metamask</button>
      )}
      {web3 !== null && connected && (
        <>
          <p>
            This contract is managed by {manager}. There are currently {` ${players.length}`} people entered, competing to win {` ${web3.utils.fromWei(balance, "ether")}`} ether!
          </p>
          <form onSubmit={onSubmit}>
            <h4>Wanna try your luck?</h4>
            <div>
              <label>Amount of ether to enter</label>
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </div>
            <button>Enter</button>
          </form>
          <hr />
          <h4>Ready to pick a winner?</h4>
          <button onClick={onClick}>Pick a winner!</button>
        </>
      )}
    </div>
  );
}

export default App;
