---
id: usage
title: m-agent Usage
sidebar_label: Usage
---

Upon installing m-agent, you can use it to generate a token for your Chaos Experiment. It step will require you to specify an expiry duration for your token. Tokens are valid through a minimum duration of 1 minute to a maximum of 30 days. The token can be generated in two modes:

1. Interactive Mode
2. Non-Interactive Mode

To generate a token in an interactive mode, use the -get-token boolean flag, which will prompt you to select the expiry duration for the token:
```
m-agent -get-token
```

The non-interactive mode can be used to generate token with more flexibility in terms of its expiry duration. Use the -token-expiry-duration flag along with the -get-token flag to use this mode. -token-expiry-duration is a string flag which expects the expiry duration of the token to be specified in the form of a numeric value suffixed with a single alphabet out of 'm' or 'M', 'h' or 'H', and 'd' or 'D' denoting minutes, hours, and days respectively.

For minutes, the corresponding value must lie in between 1 and 60, inclusively. For hours, the corresponding value must lie in the range of 1 to 24, inclusively. Lastly, for days, the corresponding value must lie between 1 to 30, inclusively.

As an instance, to create a token with a validity of 30 minutes, one can use the following command:
```
m-agent -get-token -token-expiry-duration 30m
```

Similarly, a token valid for 15 days from the time of creation can be specified as:
```
m-agent -get-token -token-expiry-duration 15D
```

You can also update the port at which m-agent should listen for the client messages:
```
sudo m-agent -updated-port <NEW_PORT>
sudo systemctl restart m-agent
```
