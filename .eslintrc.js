module.exports = {
    env: {
        'browser': true,
        'es2021': true,
        'node': true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        'indent': ['warn', 4],
        'quotes': ['error', 'single'],
        //'semi': ['error', 'never'],
        'no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0, maxEOF: 0}],
        'no-trailing-spaces': 'warn',
        'no-multi-spaces': 'warn',
        'block-spacing': 'warn',
        'space-before-blocks': 'warn',
        'space-in-parens': 'warn',
        'no-irregular-whitespace': 'warn',
        'no-var': 'warn',
        'restrict-plus-operands': 0,
        'checkCompoundAssignments': 0,
        'prefer-const':'warn',
        'no-constant-condition': 'off' // Current service worker implementation
    },
    'overrides': [
        {
            'files': ['*.ts'],
            extends: [
                'plugin:@typescript-eslint/recommended-requiring-type-checking'
                // TODO Checkout https://typescript-eslint.io/docs/linting/
            ],
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ['./tsconfig.json']
            },
            rules : {
                'no-constant-condition': 'off' // Current service worker implementation
            }
        }
    ]
}