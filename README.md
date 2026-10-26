# openweb

Install and manage **OpenCode Web** on Linux servers (systemd).

`openweb` installs the OpenCode CLI when it is missing, creates a hardened
systemd service, asks you to choose the web password, enables the service on
boot, and prints the connection details in color when it is done.

[نسخه فارسی](README.fa.md)

## Features

- Installs and enables `opencode web` as a systemd service
- Prompts twice for a password of your choice (minimum 8 characters)
- Health-checks the service before reporting success
- Management commands: `status`, `logs`, `password`, `uninstall`
- Loopback-only or public binding, custom port and login username
- Colored summary with URL, username, password and management commands

## Quick install

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb -o /tmp/openweb
chmod +x /tmp/openweb
sudo /tmp/openweb install
```

Or run it directly (the password prompt uses `/dev/tty`):

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb | sudo bash
```

The default listener is `0.0.0.0:5002`. To keep it local only:

```bash
sudo /tmp/openweb install --hostname 127.0.0.1
```

## Usage

```bash
sudo openweb                     # install/update (default command)
sudo openweb status              # service state, URL and credentials
sudo openweb logs                # follow the logs
sudo openweb password            # change the password
sudo openweb uninstall           # stop, disable and remove the service

sudo openweb --help
```

### Options

| Option | Default | Description |
| --- | --- | --- |
| `-p, --port <port>` | `5002` | Port to listen on |
| `-H, --hostname <addr>` | `0.0.0.0` | Address to bind |
| `-u, --user <name>` | `root` | Linux user that runs the service |
| `-U, --username <name>` | `opencode` | Web login username |
| `--password <value>` | prompted | Web login password (min 8 chars) |
| `-y, --yes` | off | Do not ask for confirmation |
| `--no-color` | off | Disable colored output |

For automation you can also set `OPENWEB_PASSWORD`, but the interactive prompt
is preferred because the value does not end up in your shell history.

### Examples

```bash
sudo openweb install --port 8080 --username admin
sudo openweb install --hostname 127.0.0.1 --port 3000
sudo openweb status
sudo openweb password
sudo openweb uninstall
```

## Installed files

| Path | Purpose |
| --- | --- |
| `/etc/systemd/system/openweb.service` | systemd unit |
| `/etc/openweb/config` | non-secret settings |
| `/etc/openweb/password` | web password (`0640`, root + service group) |
| `/usr/local/lib/openweb/run` | launcher that exports `OPENCODE_SERVER_USERNAME` and `OPENCODE_SERVER_PASSWORD` |
| `/usr/local/bin/openweb` | management command |

OpenCode itself is installed in the service user's home
(`~/.opencode/bin/opencode`) if it is not already available.

## Security

By default the service binds to `0.0.0.0` over plain HTTP with HTTP Basic
Authentication. Before exposing it to the internet:

- put it behind a TLS reverse proxy (Caddy, Nginx, ...)
- allow only the required TCP port in your firewall
- prefer a long, unique password

For local-only access use `--hostname 127.0.0.1`.

## Uninstall

```bash
sudo openweb uninstall
```

This removes the service and its configuration. The OpenCode CLI and your
OpenCode sessions/data are kept.

## Requirements

- Linux with systemd
- root access
- `bash`, `curl`, `systemd`
- `ss` (iproute2) is optional and used for a port-in-use check

## License

MIT. This project is not affiliated with the OpenCode project.
