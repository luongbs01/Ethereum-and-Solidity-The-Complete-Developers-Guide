const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
const { abi, evm } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: "0x" + evm.bytecode.object })
        .send({ from: accounts[0], gas: "3000000" });
});

describe("Lottery Contract", () => {
    it("deploys a contract", () => {
        assert.ok(lottery.options.address);
    });

    it("allows one account to enter", async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei("0.02", "ether"),
            gas: "3000000"
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(players[0], accounts[0]);
        assert.strictEqual(players.length, 1);
    });

    it("allows each account to enter once per lottery", async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei("0.02", "ether"),
                gas: "3000000"
            });
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei("0.02", "ether"),
                gas: "3000000"
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it("allows mutiple accounts to enter", async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei("0.02", "ether"),
            gas: "3000000"
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei("0.02", "ether"),
            gas: "3000000"
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei("0.02", "ether"),
            gas: "3000000"
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.strictEqual(players[0], accounts[0]);
        assert.strictEqual(players[1], accounts[1]);
        assert.strictEqual(players[2], accounts[2]);
        assert.strictEqual(players.length, 3);
    })

    it("requires a minimum amount of ether to enter", async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it("requires at least one participant to pick winner", async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            })
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it("only owner can call pickWinner", async () => {
        try {
            await lottery.methods.pickWinner.send({
                from: accounts[1]
            })
            assert(false)
        } catch (error) {
            assert(error);
        }
    })

    it("send money to the winner and reset the players array", async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei("2", "ether"),
            gas: "3000000"
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei("1.8", "ether"));
    });
});