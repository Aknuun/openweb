# openweb

Install and manage **OpenCode Web** on Linux servers (systemd).

`openweb` installs the OpenCode web service, asks you to choose the web
password, can enable **automatic HTTPS on a free `<public-ip>.nip.io` domain**
with Let's Encrypt, enables the service on boot, and prints the connection
details in color when it is done.

It can serve the **v1.19.4 UI + custom helpers** or the **native OpenCode v2 UI**.
v2 shares sessions with the v2 CLI server; the custom helpers are v1-only.

[نسخه فارسی](README.fa.md)

## Highlights

- **v2 native UI with CLI session sync** (recommended for v2 users)
- Optional **v1.19.4 UI + custom helpers** (usage, reasoning, theme, history, ...)
- Numbered control panel when you run `openweb` with no arguments
- Automatic HTTPS: nip.io domain + Let's Encrypt certificate + renewal hook
- Feature manager with numbered toggles (`openweb features 1 3 5`)
- Quick enable/disable by number (`openweb on 2 4`, `openweb off 1`)
- `update`, `status`, `logs`, `password` and `uninstall` commands
- Optional agent skill packs: **agent-skills** and **graphify**
- Passwords are prompted twice (minimum 8 characters)
- Health checks before reporting success

## Web engine and session sync

OpenCode v2 stores sessions in `session_v2`, while the v1 web UI reads the
legacy `session` table. A v1 web UI and a v2 CLI do **not** share new sessions.

Choose the web engine at install time:

```bash
# v2 native UI: sessions shared with the v2 CLI server
sudo openweb install --web v2

# v1.19.4 + custom UI helpers: sessions shared with a v1 CLI only
sudo openweb install --web v1 --modified
```

| Mode | UI | Session sync | Custom helpers |
| --- | --- | --- | --- |
| `--web v2` | native OpenCode v2 | with the v2 CLI server | v2 quick toolbar (reasoning/theme/history/settings/refresh); native progress/session list |
| `--web v1` | v1.19.4 + custom | with a v1 CLI | usage, reasoning, theme, history, RTL, ... |

The interactive wizard asks for the web engine; the current installation uses
v2. Switch later with:

```bash
sudo openweb install --web v2 --reuse
sudo openweb install --web v1 --modified --reuse
```

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

1. web engine: v2 native UI (CLI session sync) or v1.19.4 + custom UI
2. for v1: install mode (original or modified) and features
3. plain HTTP address and port
4. web login username
5. TLS mode (Let's Encrypt is the default)
6. HTTPS domain (default: `<public-ip>.nip.io`; press Enter to accept)
7. Let's Encrypt email (optional)
8. password (on first install)

On a normal public server this gives you:

```text
https://203.0.113.10.nip.io/
```

## Install modes

### v2 native UI (session sync)

The OpenCode v2 web UI, sharing sessions with the v2 CLI server:

```bash
sudo openweb install --web v2
```

v2 includes its own progress indicator, session list, themes and language
support, and openweb injects a quick toolbar into the v2 titlebar
(reasoning/theme/history/settings/refresh). The v1 feature toggles are disabled.

### v1 original UI

The plain v1.19.4 OpenCode web UI (for use with a v1 CLI):

```bash
sudo openweb install --web v1 --original
```

### v1 modified UI

The v1.19.4 UI plus the optional helpers, served through a small nginx front:

```bash
sudo openweb install --web v1 --modified
sudo openweb install --web v1 --modified --features usage,reasoning,theme,history,rtl,enter,settings,refresh,progress,sync
```

With `--modified` and no `--features`, all helpers are enabled.

## Automatic HTTPS with nip.io

The interactive installer enables HTTPS by default:

- domain: `<public-ip>.nip.io` (works without buying a domain)
- certificate: Let's Encrypt via certbot
- HTTP port 80 is used for the ACME challenge and redirects to HTTPS
- HTTPS port 443
- a renewal deploy hook reloads nginx automatically

Non-interactive examples:

```bash
# v2 native UI + automatic <public-ip>.nip.io + Let's Encrypt
sudo openweb install --web v2 --yes --nip-io

# v1 modified UI + automatic HTTPS
sudo openweb install --web v1 --modified --yes --nip-io

# v1 modified UI with a specific domain
sudo openweb install --web v1 --modified --domain 203.0.113.10.nip.io --tls letsencrypt

# custom certificate
sudo openweb install --web v1 --modified --domain code.example.com --tls custom \
  --tls-cert /etc/ssl/code.example.com/fullchain.pem \
  --tls-key /etc/ssl/code.example.com/privkey.pem

# plain HTTP only
sudo openweb install --web v1 --modified --tls http
```

Ports 80 and 443 must be reachable for Let's Encrypt. If certificate issuance
fails, check DNS and TCP port 80, or use `--tls custom` / `--tls http`.

The plain HTTP listener (default `0.0.0.0:5002`) can stay enabled next to
HTTPS. Use `--hostname 127.0.0.1` to keep it local only.

## Features (v1 modified UI only)

These toggles are for `--web v1 --modified`. The v2 native UI has its own
progress indicator, session list, theme and language support, plus a v2 quick
toolbar; `openweb features` explains this when v2 is active.

### v2 quick toolbar

In `--web v2`, openweb injects a small toolbar into the OpenCode v2 titlebar:

- reasoning/thinking visibility (v2 timeline detail)
- day / night theme
- session history (including CLI sessions) with open/navigate
- settings
- reload

It reuses the v2 server password already stored by the browser. No extra
credentials are required.

| # | Name | What it does |
| --- | --- | --- |
| 1 | `usage` | Consumed tokens and session cost above the composer |
| 2 | `reasoning` | Show/hide reasoning summaries from the toolbar |
| 3 | `theme` | Day / night theme toggle |
| 4 | `history` | Session history (including CLI sessions) with delete |
| 5 | `rtl` | RTL / bidi support for the composer input |
| 6 | `enter` | Enter inserts a newline; Ctrl+Enter sends |
| 7 | `settings` | Settings shortcut in the toolbar |
| 8 | `refresh` | Reload-page button in the toolbar |
| 9 | `progress` | Progress bar and loading overlay for requests |
| 10 | `sync` | Auto-refresh after being away to stay in sync |

## Managing features

Run without arguments to open the numbered feature manager:

```bash
sudo openweb features
```

```text
================= Feature manager =================
 UI mode: modified

   1) [x] Usage at a glance (tokens + cost)
   2) [x] Reasoning summaries toggle
   3) [ ] Day / night theme toggle
   ...
  11) Enable all
  12) Disable all
  13) Reset to defaults
  14) Apply and exit
   0) Cancel

Select one or more numbers (for example 1 3 5) [14]:
```

You can enter several numbers at once. Direct commands:

```bash
sudo openweb features 1 3 5        # toggle features 1, 3 and 5
sudo openweb on 2 4                # quick-enable by number
sudo openweb on 9 10               # progress bar + auto-sync
sudo openweb off 1                 # quick-disable by number
sudo openweb features enable 2,4   # names also work
sudo openweb features disable 1
sudo openweb features set 1 3 5    # replace the selection by number
sudo openweb features set all
sudo openweb features set none
sudo openweb features reset
sudo openweb features list
```

Reload the browser tab after changing features.

## Optional agent skills

```bash
sudo openweb addons status
sudo openweb addons install              # both packs
sudo openweb addons install agent-skills
sudo openweb addons install graphify
```

- **agent-skills** ([addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)):
  25 engineering workflow skills plus shared references, installed globally in
  `~/.config/opencode/skills/` and `~/.config/opencode/references/`.
- **graphify** ([Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)):
  installs `uv` when needed, the `graphifyy` CLI, the OpenCode skill + plugin,
  and links `graphify` into `/usr/local/bin`.

Start a new OpenCode session after installing. Code parsing in graphify is
local; docs/PDF/image ingestion may use a configured model or API key.

Requirements: network access, `curl`, `python3`; `uv` (and Python 3.12) are
installed automatically by the graphify add-on.

## Control panel

Run `sudo openweb` with no command to get the numbered panel:

```text
================= OpenCode Web =================
 Control panel

  1) Install / reinstall
  2) Features (enable / disable)
  3) Status
  4) Change password
  5) Update
  6) Logs
  7) Uninstall
  0) Exit
```

## Commands

| Command | What it does |
| --- | --- |
| `sudo openweb` | Numbered control panel |
| `sudo openweb install [options]` | Install, reinstall or change settings |
| `sudo openweb update` | Fetch the latest openweb and reapply the current setup |
| `sudo openweb addons ...` | Install optional agent skills (agent-skills, graphify) |
| `sudo openweb features ...` | Numbered feature manager / direct toggles |
| `sudo openweb on <numbers>` | Quick-enable features |
| `sudo openweb off <numbers>` | Quick-disable features |
| `sudo openweb status` | Service state, HTTPS URL and credentials |
| `sudo openweb logs` | Follow OpenCode and nginx logs |
| `sudo openweb password` | Change the web password |
| `sudo openweb uninstall` | Stop, disable and remove the service and UI |

### Options

| Option | Default | Description |
| --- | --- | --- |
| `-p, --port <port>` | `5002` | Plain HTTP port |
| `-H, --hostname <addr>` | `0.0.0.0` | Plain HTTP bind address |
| `-u, --user <name>` | `root` | Linux user that runs the service |
| `-U, --username <name>` | `opencode` | Web login username |
| `--password <value>` | prompted | Web login password (min 8 chars) |
| `--web <v1\|v2>` | interactive / v1 | Web engine (v2 shares sessions with the CLI) |
| `--original` | interactive | Serve the unmodified UI |
| `--modified` | interactive | Serve the modified UI |
| `--features <list>` | all when modified | Comma-separated feature list |
| `--domain <domain>` | `<public-ip>.nip.io` | HTTPS domain |
| `--tls <mode>` | `http` non-interactive | `letsencrypt`, `custom` or `http` |
| `--email <email>` | empty | Let's Encrypt account email |
| `--tls-cert <path>` | | Certificate for `--tls custom` |
| `--tls-key <path>` | | Private key for `--tls custom` |
| `--https-port <port>` | `443` | HTTPS port |
| `--reuse` | off | Reuse the current config and password |
| `-y, --yes` | off | Do not ask for confirmation |
| `--no-color` | off | Disable colored output |

Automation environment variables:

- `OPENWEB_PASSWORD` - password (prefer the prompt)
- `OPENWEB_WEB` - `v1` or `v2`
- `OPENWEB_UI` - `original` or `modified` (v1 only)
- `OPENWEB_FEATURES` - comma-separated v1 feature list
- `OPENWEB_DOMAIN` - HTTPS domain
- `OPENWEB_TLS` - `letsencrypt`, `custom` or `http`
- `OPENWEB_EMAIL` - Let's Encrypt email
- `OPENWEB_TLS_CERT` / `OPENWEB_TLS_KEY` - custom certificate
- `OPENWEB_HTTPS_PORT` - HTTPS port
- `OPENWEB_REUSE=1` - reuse the current configuration
- `OPENWEB_SCRIPT_URL` / `OPENWEB_UI_URL` - override update URLs (forks)
- `OPENWEB_OPENCODE_VERSION` - private OpenCode version (default `1.19.4`)

## OpenCode versions

- `--web v2` uses the system OpenCode v2 (or installs a private v2 copy) and
  serves the native v2 UI. Sessions are shared with the v2 CLI server through
  the `session_v2` table.
- `--web v1` uses a private v1.19.4 copy in
  `/usr/local/lib/openweb/opencode`. The modified UI requires v1. Sessions sync
  only with a v1 CLI (`session` table).
- The system `opencode` CLI is **never** modified.
- The launcher auto-detects v1 (`web`) and v2 (`serve`).

Use v2 for CLI session sync; use v1 only if you need the custom helpers and
run a v1 CLI.

## Installed files

| Path | Purpose |
| --- | --- |
| `/etc/systemd/system/openweb.service` | systemd unit |
| `/etc/openweb/config` | non-secret settings (mode, features, TLS, ports) |
| `/etc/openweb/password` | web password (`0640`, root + service group) |
| `/usr/local/lib/openweb/run` | launcher with the OpenCode auth variables |
| `/usr/local/lib/openweb/opencode` | private OpenCode v1.19.4 (when used) |
| `/usr/local/lib/openweb/ui-base.js` | modified UI helper |
| `/usr/local/lib/openweb/ui.js` | generated helper with current feature flags |
| `/usr/local/bin/openweb` | management command |
| `/etc/nginx/conf.d/openweb.conf` | HTTP, HTTPS and ACME server blocks |
| `/etc/nginx/conf.d/openweb-upgrade.conf` | WebSocket upgrade map |
| `/etc/letsencrypt/renewal-hooks/deploy/openweb` | reload nginx after renewal |

## Update

```bash
sudo openweb update
```

Downloads the latest manager and UI helper, then reapplies the current mode,
features, TLS settings, ports and password. No interactive questions are asked.

## Security

HTTPS is recommended and is the interactive default. Before exposing the
service to the internet:

- use Let's Encrypt (or your own certificate)
- allow TCP 80 and 443 in the firewall (plus the plain HTTP port if you keep it)
- prefer a long, unique password

For local-only access use `--hostname 127.0.0.1`.

The optional UI helper is served from `/__openweb/ui.js` without authentication.
It contains no credentials or session data.

## Migrating from openweb 2.0

If you already have a working installation:

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb -o /tmp/openweb
chmod +x /tmp/openweb
sudo /tmp/openweb install --reuse --domain <your-domain>.nip.io --tls letsencrypt --web v2
```

This keeps the password and switches to the v2 native UI with CLI session
sync. It also replaces an old manual `/etc/nginx/conf.d/openweb-tls.conf` with
the managed HTTPS configuration. To keep the custom v1 UI instead, use
`--web v1 --modified` and a v1 CLI.

## Requirements

- Linux with systemd
- root access
- `bash`, `curl`, `openssl`, `python3`
- `uv` is installed automatically for the graphify add-on
- nginx for modified mode or HTTPS (installed automatically on Debian/Ubuntu/RHEL)
- certbot for Let's Encrypt (installed automatically)
- ports 80 and 443 reachable for Let's Encrypt
- `ss` (iproute2) is optional and used for port checks

On SELinux systems (for example RHEL), allow nginx to connect to the loopback
upstream:

```bash
sudo setsebool -P httpd_can_network_connect 1
```

## Attribution

The optional UI helper (`openweb-ui.js`) is adapted from
[CodeHub](https://github.com/Aknuun/codehub), MIT licensed.

## License

MIT. This project is not affiliated with the OpenCode project.
