module.exports = (async function config() {
  const { default: love } = await import('eslint-config-love')

  return [
    {
      ...love,
      files: ['**/*.js', '**/*.ts'],
      ignores: ['**/node_modules/**, **/dist/**', '**/coverage/**'],
      rules: {
        '@typescript-eslint/class-methods-use-this': 'off',
      },
    },
  ]
})()