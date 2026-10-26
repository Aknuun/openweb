# openweb

نصب و مدیریت **OpenCode Web** روی سرورهای لینوکسی (systemd).

اسکریپت `openweb` در صورت نبود، OpenCode را نصب می‌کند، یک سرویس systemd
ایمن می‌سازد، رمز ورود را از خودتان می‌پرسد، سرویس را در بوت فعال می‌کند و در
پایان همه اطلاعات اتصال را با رنگ‌های مختلف نمایش می‌دهد.

[English version](README.md)

## امکانات

- نصب و فعال‌سازی `opencode web` به‌صورت سرویس systemd
- پرسیدن دو باره رمز دلخواه (حداقل ۸ کاراکتر)
- بررسی سلامت سرویس قبل از اعلام موفقیت
- دستورهای مدیریتی: `status`، `logs`، `password`، `uninstall`
- امکان اتصال فقط روی لوکال‌هاست یا عمومی، پورت و نام کاربری دلخواه
- خلاصه رنگی شامل آدرس، نام کاربری، رمز و دستورهای مدیریت

## نصب سریع

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb -o /tmp/openweb
chmod +x /tmp/openweb
sudo /tmp/openweb install
```

یا اجرای مستقیم (پرسش رمز از `/dev/tty` انجام می‌شود):

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb | sudo bash
```

به‌صورت پیش‌فرض روی `0.0.0.0:5002` گوش می‌دهد. برای دسترسی فقط محلی:

```bash
sudo /tmp/openweb install --hostname 127.0.0.1
```

## استفاده

```bash
sudo openweb                     # نصب/به‌روزرسانی (دستور پیش‌فرض)
sudo openweb status              # وضعیت سرویس، آدرس و اطلاعات ورود
sudo openweb logs                # مشاهده زنده لاگ‌ها
sudo openweb password            # تغییر رمز
sudo openweb uninstall           # توقف، غیرفعال‌سازی و حذف سرویس

sudo openweb --help
```

### گزینه‌ها

| گزینه | پیش‌فرض | توضیح |
| --- | --- | --- |
| `-p, --port <port>` | `5002` | پورت گوش‌دادن |
| `-H, --hostname <addr>` | `0.0.0.0` | آدرس اتصال |
| `-u, --user <name>` | `root` | کاربر لینوکسی اجراکننده سرویس |
| `-U, --username <name>` | `opencode` | نام کاربری ورود وب |
| `--password <value>` | پرسیده می‌شود | رمز ورود (حداقل ۸ کاراکتر) |
| `-y, --yes` | خاموش | بدون پرسش تأیید |
| `--no-color` | خاموش | خروجی بدون رنگ |

برای اتوماسیون می‌توانید `OPENWEB_PASSWORD` را تنظیم کنید، اما پرسش تعاملی
بهتر است چون رمز در تاریخچه شل ذخیره نمی‌شود.

### مثال‌ها

```bash
sudo openweb install --port 8080 --username admin
sudo openweb install --hostname 127.0.0.1 --port 3000
sudo openweb status
sudo openweb password
sudo openweb uninstall
```

## فایل‌های نصب‌شده

| مسیر | کاربرد |
| --- | --- |
| `/etc/systemd/system/openweb.service` | یونیت systemd |
| `/etc/openweb/config` | تنظیمات غیرحساس |
| `/etc/openweb/password` | رمز وب (`0640`، root و گروه سرویس) |
| `/usr/local/lib/openweb/run` | اجراکننده‌ای که `OPENCODE_SERVER_USERNAME` و `OPENCODE_SERVER_PASSWORD` را تنظیم می‌کند |
| `/usr/local/bin/openweb` | فرمان مدیریت |

اگر OpenCode از قبل نصب نباشد، در خانه کاربر سرویس
(`~/.opencode/bin/opencode`) نصب می‌شود.

## امنیت

به‌صورت پیش‌فرض سرویس روی `0.0.0.0` و روی HTTP ساده با احراز هویت
Basic Auth گوش می‌دهد. قبل از قرار دادن روی اینترنت:

- آن را پشت یک ریورس‌پروکسی TLS قرار دهید (Caddy، Nginx و ...)
- فقط پورت لازم را در فایروال باز کنید
- از رمز بلند و یکتا استفاده کنید

برای دسترسی فقط محلی از `--hostname 127.0.0.1` استفاده کنید.

## حذف

```bash
sudo openweb uninstall
```

سرویس و تنظیمات حذف می‌شوند؛ CLI اوپن‌کد و سشن‌ها/داده‌های شما دست‌نخورده
می‌مانند.

## پیش‌نیازها

- لینوکس با systemd
- دسترسی root
- `bash`، `curl`، `systemd`
- `ss` (iproute2) اختیاری است و برای بررسی اشغال‌بودن پورت استفاده می‌شود

## مجوز

MIT. این پروژه وابسته به پروژه OpenCode نیست.
