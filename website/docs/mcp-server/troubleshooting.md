---
id: troubleshooting
title: Troubleshooting
---

Common issues and resolutions.

- Authentication failures: verify `LITMUS_ACCESS_TOKEN` is valid and not expired.
- Project not found: confirm `LITMUS_PROJECT_ID` from Chaos Center settings.
- Endpoint connectivity: ensure `CHAOS_CENTER_ENDPOINT` is reachable from where the server runs.
- Missing defaults: set `DEFAULT_INFRA_ID` or pass infrastructure explicitly when executing.
- Claude Desktop not invoking: verify MCP config path and that the binary path is correct.

If issues persist, see the GitHub README Troubleshooting section or open an issue.

## Learn more

- [Installation](./installation)
- [Available Tools](./available-tools)
- [Example Interactions](./examples)
