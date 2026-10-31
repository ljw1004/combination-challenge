# V2 verification corrections retained

- The first revision-specific tin-transfer assertion read `Result.transfers`, but transfers are recorded on the accepted `Event`. The test was corrected to inspect the actual event; no runtime/content change was made. The 9-pass/1-fail run remains in `first-revision-event-access-failure.tap`.
- The first full-build invocation used the candidate directory rather than its disposable repository fixture. Its missing-build-script error is retained in `first-build-command-cwd-error.log`.
- A corrected build invocation encountered an execution-transport interruption after content validation. Its partial output is retained in `interrupted-build-transport.log`; it was not counted as a pass. A complete rerun in the same fixture finished with `BUILD_EXIT=0`.
- No failed fresh-player trial was discarded or relabelled. All five v2 CLI smoke sessions explicitly identify the source-aware author.
