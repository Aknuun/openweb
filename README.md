# openweb

Install and manage **OpenCode Web** on a Linux server with systemd.

The script installs the prerequisites (`curl`, `npm`, ...) without asking,
installs the latest OpenCode, serves the web UI with automatic HTTPS on
`<public-ip>.nip.io`, and enables it on boot. Re-running it is safe.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb | sudo bash
```

Manage it afterwards with `sudo openweb` (panel) and `sudo openweb update`.

[Persian version](README.fa.md)

Updates and support: [Telegram @openWEBcode](https://t.me/openWEBcode)

## License

MIT. The optional UI helper is derived from [CodeHub](https://github.com/Aknuun/codehub).
