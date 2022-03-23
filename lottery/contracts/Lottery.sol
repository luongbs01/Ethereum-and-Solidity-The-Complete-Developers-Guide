// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    mapping(address => bool) public isPlayer;
    mapping(address => uint256) public valueOf;

    event pickWinnerEvent(address winner, uint256 totalValue);

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(!isPlayer[msg.sender], "You have entered the lottery");
        require(
            msg.value > .01 ether,
            "A minumun payment of .01 ether must be sent to enter the lottery"
        );

        isPlayer[msg.sender] = true;
        valueOf[msg.sender] = msg.value;
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
        require(players.length > 0, "There is no player entered the lottery");
        uint256 index = random() % players.length;
        address contractAddress = address(this);
        emit pickWinnerEvent(address(players[index]), contractAddress.balance);
        players[index].transfer(contractAddress.balance);
        for (uint256 i = 0; i < players.length; i++) {
            delete isPlayer[address(players[i])];
            delete valueOf[address(players[i])];
        }
        players = new address payable[](0);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    modifier onlyOwner() {
        require(msg.sender == manager, "Only owner can call this function.");
        _;
    }
}
