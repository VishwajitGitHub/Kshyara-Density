import { build } from "esbuild";

build({
  entryPoints: ["packages/cli/src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  outfile: "dist/kshyara.js",
  format: "esm",
  sourcemap: true,
  minify: false,
  external: ["fsevents"],
}).catch(() => process.exit(1));
