/* eslint-disable no-undef */
module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 13,
        'sourceType': 'module'
    },
    'rules': {
        'newline-per-chained-call' : ['warn', { 'ignoreChainWithDepth': 1 }],
        'quotes': ['warn', 'single']
    },
    globals: {
        'd3': 'readonly'
    }
};
