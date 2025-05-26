Bun.build({
  entrypoints: ['./src/extension.ts'],
  outdir: './dist',
  minify: true,
  sourcemap: 'external',
  external: ['vscode'],
  target: 'node',
});
