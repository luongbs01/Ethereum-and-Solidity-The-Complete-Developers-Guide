// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract Lottey {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(
            msg.value > .01 ether,
            "A minumun payment of .01 ether must be sent to enter the lottery"
        );

        players.push(payable(msg.sender));
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.number, players)
                )
            );
    }

    function pickWinner() public onlyOwner {
        uint256 index = random() % players.length;
        address contractAddress = address(this);
        players[index].transfer(contractAddress.balance);
        players = new address payable[](0);
    }

    function getPlayer() public view returns (address payable[] memory) {
        return players;
    }

    modifier onlyOwner() {
        require(msg.sender == manager, "Only owner can call this function.");
        _;
    }
}
