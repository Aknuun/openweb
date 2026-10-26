# openweb

Install and manage **OpenCode Web** on Linux servers (systemd).

`openweb` installs the OpenCode CLI when it is missing, creates a hardened
systemd service, asks you to choose the web password, enables the service on
boot, and prints the connection details in color when it is done.

It can serve the **original OpenCode web UI** or a **modified UI** with a few
optional helpers adapted from [CodeHub](https://github.com/Aknuun/codehub).

[نسخه فارسی](README.fa.md)

## Highlights

- Interactive installer (mode, port, address, username, password, features)
- Original UI or modified UI, chosen at install time
- Feature manager to add or remove UI helpers at any time
- `update`, `status`, `logs`, `password` and `uninstall` commands
- Passwords are prompted twice (minimum 8 characters) and never stored in shell history by the installer
- Health checks before reporting success

## Quick install

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb -o /tmp/openweb
chmod +x /tmp/openweb
sudo /tmp/openweb
```

Or run it directly (the password prompt uses `/dev/tty`):

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb | sudo bash
```

The interactive wizard asks for:

1. install mode: original or modified UI
2. features (only for the modified UI)
3. listen address and port
4. web login username
5. password (on first install)

## Install modes

### Original UI

The plain OpenCode web UI, served directly by `opencode web`:

```bash
sudo openweb install --original
```

### Modified UI

The OpenCode UI plus the optional helpers, served through a small nginx front:

```bash
sudo openweb install --modified
sudo openweb install --modified --features usage,reasoning,theme,history,rtl,enter,settings,refresh
```

With `--modified` and no `--features`, all helpers are enabled.

Modified mode needs nginx. It is installed automatically with `apt-get`,
`dnf` or `yum` when it is missing. OpenCode keeps listening on a private
loopback port; nginx is the public listener and injects the UI helper.

## Features

| Name | What it does |
| --- | --- |
| `usage` | Shows consumed tokens and session cost above the composer |
| `reasoning` | Show/hide reasoning summaries from the toolbar |
| `theme` | Day / night theme toggle |
| `history` | Session history (including CLI sessions) with delete |
| `rtl` | RTL / bidi support for the composer input |
| `enter` | Enter inserts a newline; Ctrl+Enter sends |
| `settings` | Settings shortcut in the toolbar |
| `refresh` | Reload-page button in the toolbar |

Use `all` or `none` as shortcuts.

## Managing features

```bash
sudo openweb features                 # interactive checklist
sudo openweb features list            # show current mode and features
sudo openweb features enable rtl,settings
sudo openweb features disable usage
sudo openweb features set all
sudo openweb features set none
sudo openweb features reset           # restore the default feature set
```

Enabling a feature switches the installation to modified mode (and sets up
nginx if needed). Reload the browser tab after changing features.

## Commands

| Command | What it does |
| --- | --- |
| `sudo openweb` | Install or update interactively (default) |
| `sudo openweb install [options]` | Install, reinstall or change settings |
| `sudo openweb update` | Fetch the latest openweb and reapply the current setup |
| `sudo openweb features ...` | List, enable or disable UI helpers |
| `sudo openweb status` | Service state, mode, URL and credentials |
| `sudo openweb logs` | Follow the OpenCode service logs |
| `sudo openweb password` | Change the web password |
| `sudo openweb uninstall` | Stop, disable and remove the service and UI |

### Options

| Option | Default | Description |
| --- | --- | --- |
| `-p, --port <port>` | `5002` | Public port |
| `-H, --hostname <addr>` | `0.0.0.0` | Public bind address |
| `-u, --user <name>` | `root` | Linux user that runs the service |
| `-U, --username <name>` | `opencode` | Web login username |
| `--password <value>` | prompted | Web login password (min 8 chars) |
| `--original` | interactive | Serve the unmodified UI |
| `--modified` | interactive | Serve the modified UI |
| `--features <list>` | all when modified | Comma-separated feature list |
| `--reuse` | off | Reuse the current config and password |
| `-y, --yes` | off | Do not ask for confirmation |
| `--no-color` | off | Disable colored output |

Automation environment variables:

- `OPENWEB_PASSWORD` - password (prefer the prompt)
- `OPENWEB_UI` - `original` or `modified`
- `OPENWEB_FEATURES` - comma-separated feature list
- `OPENWEB_REUSE=1` - reuse the current configuration
- `OPENWEB_SCRIPT_URL` / `OPENWEB_UI_URL` - override the update URLs (forks)

### Examples

```bash
sudo openweb install --port 8080 --username admin
sudo openweb install --hostname 127.0.0.1 --port 3000
sudo openweb install --modified --features usage,reasoning,theme
sudo openweb features disable usage,history
sudo openweb update
sudo openweb status
sudo openweb uninstall
```

## Installed files

| Path | Purpose |
| --- | --- |
| `/etc/systemd/system/openweb.service` | systemd unit |
| `/etc/openweb/config` | non-secret settings (mode, features, ports, ...) |
| `/etc/openweb/password` | web password (`0640`, root + service group) |
| `/usr/local/lib/openweb/run` | launcher that exports the OpenCode auth variables |
| `/usr/local/lib/openweb/ui-base.js` | modified UI helper |
| `/usr/local/lib/openweb/ui.js` | generated helper with the current feature flags |
| `/usr/local/bin/openweb` | management command |
| `/etc/nginx/conf.d/openweb.conf` | nginx front for modified mode |
| `/etc/nginx/conf.d/openweb-upgrade.conf` | WebSocket upgrade map |

OpenCode itself is installed in the service user's home
(`~/.opencode/bin/opencode`) if it is not already available.

## Update

```bash
sudo openweb update
```

This downloads the latest manager and UI helper, then reapplies the current
mode, features, port, address and password. No interactive questions are asked.

## Security

By default the service binds to `0.0.0.0` over plain HTTP with HTTP Basic
Authentication (provided by OpenCode). Before exposing it to the internet:

- put it behind a TLS reverse proxy (Caddy, Nginx, ...)
- allow only the required TCP port in your firewall
- prefer a long, unique password

For local-only access use `--hostname 127.0.0.1`.

The optional UI helper is served from `/__openweb/ui.js` without authentication.
It contains no credentials or session data.

## Migrating from openweb 1.x

Run the new installer over the existing installation:

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb -o /tmp/openweb
chmod +x /tmp/openweb
sudo /tmp/openweb install --reuse
```

The existing password is kept and the mode defaults to original. To switch to
the modified UI:

```bash
sudo openweb install --modified --reuse
# or
sudo openweb features reset
```

## Requirements

- Linux with systemd
- root access
- `bash`, `curl`
- nginx for modified mode (installed automatically on Debian/Ubuntu/RHEL)
- `ss` (iproute2) is optional and used for port checks

## Attribution

The optional UI helper (`openweb-ui.js`) is adapted from
[CodeHub](https://github.com/Aknuun/codehub), MIT licensed.

## License

MIT. This project is not affiliated with the OpenCode project.
