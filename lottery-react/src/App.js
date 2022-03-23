import { useEffect, useRef, useState } from "react";
import { Button, Form, Table, Grid } from "semantic-ui-react";
import initWeb3 from "./utils/web3";
import { abi, contractAddress } from "./utils/lottery"
import './App.css';
import TableOfPlayers from "./components/Table";
const { ethereum } = window;

function App() {
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(false);

  const [winner, setWinner] = useState(null);
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
    const addresses = await lotteryContract.current.methods.getPlayers().call();
    const players = await Promise.all(addresses.map(async (address) => {
      const valueOf = web3.utils.fromWei(await lotteryContract.current.methods.valueOf(address).call(), "ether");
      return { address, valueOf };
    }));
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
        const winner = {
          winner: event.returnValues.winner,
          totalValue: web3.utils.fromWei(event.returnValues.totalValue, "ether")
        };
        setWinner(winner);
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
        <Button onClick={connectMetamask}>Connect with Metamask</Button>
      )}
      {web3 !== null && connected && (
        <>
          <p>
            This contract is managed by {manager}. There are currently {` ${players.length}`} people entered, competing to win {` ${web3.utils.fromWei(balance, "ether")}`} ether!
          </p>
          <h4>Wanna try your luck?</h4>
          <Form onSubmit={onSubmit}>
            <Form.Field>
              <label>Amount of ether to enter</label>
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </Form.Field>
            <Button primary>Enter</Button>
          </Form>
          <Table collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Player</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableOfPlayers players={players}></TableOfPlayers>
            </Table.Body>
          </Table>
          <h4>Ready to pick a winner?</h4>
          <Button onClick={onClick} primary>Pick a winner!</Button>
          {winner && <h4>Winner: {winner.winner}, Prize: {winner.totalValue}</h4>}
        </>
      )}
    </div>
  );
}

export default App;
