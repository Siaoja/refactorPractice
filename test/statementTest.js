const test = require('ava');
const {statement} = require('../src/statement');

test('statement case 1. Customer spike without performance.', t => {
    const invoice = {
        'customer': 'spike',
        'performances': [],
    };
    const result = statement(invoice, plays);
    t.is(result, 'Statement for spike\nAmount owed is $0.00\nYou earned 0 credits \n');
})

test('statement case 2. Customer spike has one performance hamlet and the audience is 30.', t => {
    const invoice = {
        'customer': 'spike',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 30,
            },
        ]
    }
    const result = statement(invoice, plays);
    t.is(result, 'Statement for spike\n Hamlet: $400.00 (30 seats)\nAmount owed is $400.00\nYou earned 0 credits \n');
})

test('statement case 3. Customer spike has one performance hamlet and the audience is 31.', t => {
    const invoice = {
        'customer': 'spike',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 31,
            },
        ]
    }
    const result = statement(invoice, plays);
    t.is(result, 'Statement for spike\n Hamlet: $410.00 (31 seats)\nAmount owed is $410.00\nYou earned 1 credits \n');
})

test('statement case 4. Customer spike has one performance as-like and the audience is 20.', t => {
    const invoice = {
        'customer': 'spike',
        'performances': [
            {
                'playID': 'as-like',
                'audience': 20,
            },
        ]
    }
    const result = statement(invoice, plays);
    t.is(result, 'Statement for spike\n As You Like It: $360.00 (20 seats)\nAmount owed is $360.00\nYou earned 4 credits \n');
})

test('statement case 5. Customer spike has one performance as-like and the audience is 21.', t => {
    const invoice = {
        'customer': 'spike',
        'performances': [
            {
                'playID': 'as-like',
                'audience': 21,
            },
        ]
    }
    const result = statement(invoice, plays);
    t.is(result, 'Statement for spike\n As You Like It: $468.00 (21 seats)\nAmount owed is $468.00\nYou earned 4 credits \n');
})

test('statement case 6. Customer spike has three performance.', t => {

    const result = statement(invoice, plays);
    t.is(result, 'Statement for spike\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits \n');
})

test('statement case 7. Customer spike has one performance othello but type is not allow.', t => {

    const plays = {
        'othello': {
            'name': 'Othello',
            'type': 'tragedy1',
        },
    };

    const invoice = {
        'customer': 'spike',
        'performances': [
            {
                'playID': 'othello',
                'audience': 40
            },
        ],
    };

    try {
        statement(invoice, plays);
        t.fail();
    } catch (e) {
        t.is(e.message, 'unknown type: tragedy1');
    }

})

const invoice = {
    'customer': 'spike',
    'performances': [
        {
            'playID': 'hamlet',
            'audience': 55,
        },
        {
            'playID': 'as-like',
            'audience': 35,
        },
        {
            'playID': 'othello',
            'audience': 40,
        },
    ],
};


const plays = {
    'hamlet': {
        'name': 'Hamlet',
        'type': 'tragedy',
    },
    'as-like': {
        'name': 'As You Like It',
        'type': 'comedy',
    },
    'othello': {
        'name': 'Othello',
        'type': 'tragedy',
    },
};