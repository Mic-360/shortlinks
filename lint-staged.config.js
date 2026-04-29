module.exports = {
  '**/*.(ts|tsx)': () => 'bun run typecheck',
  '**/*.(ts|tsx|js|mjs)': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
  '**/*.(md|json)': (filenames) => `prettier --write ${filenames.join(' ')}`,
}
