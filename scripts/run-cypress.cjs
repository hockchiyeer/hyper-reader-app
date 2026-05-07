const { spawn } = require("node:child_process");
const path = require("node:path");
const cypressBin = path.resolve(path.dirname(require.resolve("cypress")), "..", "bin", "cypress");

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(process.execPath, [cypressBin, ...process.argv.slice(2)], {
  env,
  stdio: "inherit"
});

child.on("error", error => {
  console.error(error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
