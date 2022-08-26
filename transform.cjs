const { transform } = require("@swc/core");
const { FormatJSTransformer } = require("@formatjs/swc-plugin");
const path = require("path");
const fs = require("fs");

const filePath = path.resolve(__dirname, "src/index.tsx");
const input = fs.readFileSync(filePath, { encoding: "utf-8" });

transform(input, {
  filename: filePath,
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
      decorators: true,
      dynamicImport: true,
    },
  },
  plugin: (m) => new FormatJSTransformer({}).visitProgram(m),
}).then((output) => {
  console.log(output.code);
});
