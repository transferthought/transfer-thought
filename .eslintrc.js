module.exports = {
    root: true,
    env: {
        node: true,
        jest: true
    },
    extends: [
        'plugin:vue/recommended',
        '@vue/airbnb',
    ],
    rules: {
        "vue/html-indent": ["error", 4],
        indent: ['error', 4],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'max-len': ["error", { "code": 160 }],
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
