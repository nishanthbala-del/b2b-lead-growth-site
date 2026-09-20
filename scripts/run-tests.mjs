// The test runner, wrapped — because `node --test` can exit 0 while a whole test file failed.
//
// MEASURED on Node v24.13.1, 2026-09-20. A `describe()` block that throws while the runner is
// COLLECTING tests (an import error, a bad helper, a typo in setup — the ordinary way a test file
// breaks) is reported in a trailing "✖ failing tests:" section, but it is NOT counted in the
// `fail` tally and it does NOT change the exit code. The run prints:
//
//     ℹ pass 214   ℹ fail 0        and exits 0
//
// while every assertion in that file silently never ran. This was not hypothetical: the guard in
// tests/offer-integrity.test.ts hit exactly this case (`ReferenceError: read is not defined`) and
// the suite reported 214 passing, 0 failing, exit 0. It was only caught by grepping for the
// test's name. A verification layer that can go green while a file failed to load makes every
// regression test in this repo unfalsifiable — the tests are not wrong, they are absent.
//
// So this spawns the runner, passes its output through untouched, and fails the run if EITHER
// the exit code is non-zero OR the runner printed a failing-tests section.

import { spawn } from "node:child_process";

const args = [
  "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
  "--test",
  ...(process.argv.slice(2).length ? process.argv.slice(2) : ["tests/**/*.test.ts"]),
];

const child = spawn(process.execPath, args, { stdio: ["inherit", "pipe", "pipe"] });

let out = "";
for (const [stream, sink] of [
  [child.stdout, process.stdout],
  [child.stderr, process.stderr],
]) {
  stream.on("data", (c) => {
    out += c.toString();
    sink.write(c);
  });
}

child.on("close", (code) => {
  // The spec reporter emits this heading only when at least one test OR suite failed.
  const reportedFailure = /^✖ failing tests:/m.test(out);
  if (code === 0 && reportedFailure) {
    process.stderr.write(
      "\n" +
        "run-tests: the runner exited 0 but printed a failing-tests section.\n" +
        "run-tests: that is the Node behaviour this wrapper exists for — a suite threw while being\n" +
        "run-tests: collected, so its assertions never ran and were never counted. Treating as FAILED.\n",
    );
    process.exit(1);
  }
  process.exit(code ?? 1);
});
