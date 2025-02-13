import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ['**/.eslintrc.js'],
    },
    ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslintEslintPlugin,
        },

        languageOptions: {
            globals: {
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'module',

            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: '/home/juan/Documents/dev/typescript/meddyg/ngdose-v3/restapi',
            },
        },

        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            'array-callback-return': 1,
            semi: ['warn', 'always'],
            'no-void': 0,
            '@typescript-eslint/no-confusing-void-expression': 0,
            'prettier/prettier': 2,
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/ban-ts-comment': 'error',
            'no-case-declarations': 'warn',
            'no-sparse-arrays': 'warn',
            'no-regex-spaces': 'error',
            'use-isnan': 'error',
            'no-fallthrough': 'error',
            'no-empty-pattern': 'error',
            'no-redeclare': 'error',
            'no-self-assign': 'error',
            '@typescript-eslint/semi': 0,
            '@typescript-eslint/indent': 0,
            'eslint@typescript-eslint/member-delimiter-style': 0,
            strict: 'error',
            '@typescript-eslint/strict-boolean-expressions': 0,
            '@typescript-eslint/prefer-nullish-coalescing': 0,
            '@typescript-eslint/no-non-null-assertion': 0,

            'sort-imports': [
                'warn',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                },
            ],

            'no-undef': 'off',
        },
    },
];
