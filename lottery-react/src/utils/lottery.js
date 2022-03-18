export const contractAddress = "0x73a7eA449F4BBd330B061d36BFF87e7F1E722C51";

export const abi = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
        anonymous: false,
        inputs: [[Object], [Object]],
        name: 'pickWinnerEvent',
        type: 'event'
    },
    {
        inputs: [],
        name: 'enter',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getPlayers',
        outputs: [[Object]],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getTotalValue',
        outputs: [[Object]],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [[Object]],
        name: 'isPlayer',
        outputs: [[Object]],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'manager',
        outputs: [[Object]],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'pickWinner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [[Object]],
        name: 'players',
        outputs: [[Object]],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [[Object]],
        name: 'valueOf',
        outputs: [[Object]],
        stateMutability: 'view',
        type: 'function'
    }
];