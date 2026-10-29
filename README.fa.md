# openweb

نصب و مدیریت **OpenCode Web** روی سرور لینوکسی با systemd.

اسکریپت پیش‌نیازها (`curl`، `npm` و ...) را بدون پرسش نصب می‌کند، آخرین نسخه
OpenCode را می‌آورد، سرویس وب را با HTTPS خودکار روی `<public-ip>.nip.io` بالا
می‌آورد و در بوت فعال می‌کند. اجرای دوباره چیزی را خراب نمی‌کند.

## نصب

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb | sudo bash
```

مدیریت بعد از نصب: `sudo openweb` (پنل) و `sudo openweb update` (به‌روزرسانی).

[English version](README.md)

## مجوز

MIT. رابط اختیاری برگرفته از [CodeHub](https://github.com/Aknuun/codehub) است.
