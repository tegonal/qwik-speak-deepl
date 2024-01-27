module.exports = {
    root: true,
    env: {
        es2021: true,
        node: true,
    },
    overrides: [
        {
            files: ['*.{ts,js,mjs,cjs}'],
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:prettier/recommended',
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ['./tsconfig.json'],
            },
            plugins: ['@typescript-eslint'],
            rules: {
                'no-console': 'off',
                '@typescript-eslint/no-unused-vars': ['error'],
                '@typescript-eslint/consistent-type-imports': 'warn',
                '@typescript-eslint/no-explicit-any': 'warn',
            },
        },
    ],
};
