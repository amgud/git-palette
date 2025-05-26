Bun.build({
  entrypoints: ['./src/extension.ts'],
  outdir: './dist',
  minify: true,
  format: 'cjs',
  sourcemap: 'linked',
  external: ['vscode'],
  target: 'node',
});
