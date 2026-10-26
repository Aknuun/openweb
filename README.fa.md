# openweb

نصب و مدیریت **OpenCode Web** روی سرورهای لینوکسی (systemd).

اسکریپت `openweb` سرویس وب OpenCode را نصب می‌کند، رمز ورود را از شما
می‌پرسد، می‌تواند **HTTPS خودکار روی دامنه رایگان `<public-ip>.nip.io`** با
Let's Encrypt فعال کند، سرویس را در بوت فعال می‌کند و در پایان همه اطلاعات
اتصال را با رنگ‌های مختلف نمایش می‌دهد.

می‌توانید **رابط اصلی OpenCode** یا یک **رابط ویرایش‌شده** با قابلیت‌های
اختیاری برگرفته از [CodeHub](https://github.com/Aknuun/codehub) را نصب کنید.

[English version](README.md)

## امکانات

- پنل کنترل شماره‌دار با اجرای `openweb` بدون هیچ آرگومان
- HTTPS خودکار: دامنه nip.io + گواهی Let's Encrypt + هوک تمدید
- انتخاب رابط اصلی یا ویرایش‌شده هنگام نصب
- مدیر فیچر با انتخاب شماره‌ای (`openweb features 1 3 5`)
- فعال/غیرفعال سریع با شماره (`openweb on 2 4`، `openweb off 1`)
- دستورهای `update`، `status`، `logs`، `password` و `uninstall`
- پرسیدن دو باره رمز (حداقل ۸ کاراکتر)
- بررسی سلامت سرویس قبل از اعلام موفقیت

## نصب سریع

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb -o /tmp/openweb
chmod +x /tmp/openweb
sudo /tmp/openweb
```

یا اجرای مستقیم (پرسش رمز از `/dev/tty` انجام می‌شود):

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb | sudo bash
```

ویزارد تعاملی این موارد را می‌پرسد:

1. حالت نصب: رابط اصلی یا ویرایش‌شده
2. فیچرها (فقط برای رابط ویرایش‌شده)
3. آدرس و پورت HTTP
4. نام کاربری ورود
5. حالت TLS (پیش‌فرض Let's Encrypt)
6. دامنه HTTPS (پیش‌فرض `<public-ip>.nip.io`؛ Enter بزنید)
7. ایمیل Let's Encrypt (اختیاری)
8. رمز (در نصب اول)

روی یک سرور عمومی معمولی این آدرس را می‌گیرید:

```text
https://203.0.113.10.nip.io/
```

## حالت‌های نصب

### رابط اصلی

رابط خام OpenCode:

```bash
sudo openweb install --original
```

### رابط ویرایش‌شده

رابط OpenCode به‌همراه قابلیت‌های اختیاری، از طریق فرانت nginx:

```bash
sudo openweb install --modified
sudo openweb install --modified --features usage,reasoning,theme,history,rtl,enter,settings,refresh,progress,sync
```

اگر `--modified` بدون `--features` استفاده شود، همه فیچرها فعال می‌شوند.

## HTTPS خودکار با nip.io

نصب تعاملی به‌صورت پیش‌فرض HTTPS را فعال می‌کند:

- دامنه: `<public-ip>.nip.io` (بدون نیاز به خرید دامنه)
- گواهی: Let's Encrypt با certbot
- پورت 80 برای چالش ACME و ریدایرکت به HTTPS
- پورت 443 برای HTTPS
- هوک تمدید، nginx را خودکار reload می‌کند

مثال‌های غیرتعاملی:

```bash
# nip.io خودکار + Let's Encrypt
sudo openweb install --modified --yes --nip-io

# وجود دامنه یعنی Let's Encrypt
sudo openweb install --modified --domain 203.0.113.10.nip.io --tls letsencrypt

# گواهی سفارشی
sudo openweb install --modified --domain code.example.com --tls custom \
  --tls-cert /etc/ssl/code.example.com/fullchain.pem \
  --tls-key /etc/ssl/code.example.com/privkey.pem

# فقط HTTP
sudo openweb install --modified --tls http
```

برای Let's Encrypt باید پورت‌های 80 و 443 از بیرون در دسترس باشند. اگر صدور
گواهی شکست خورد، DNS و پورت 80 را بررسی کنید یا از `--tls custom` / `--tls http`
استفاده کنید.

شنونده HTTP ساده (پیش‌فرض `0.0.0.0:5002`) می‌تواند در کنار HTTPS فعال بماند.
برای دسترسی فقط محلی از `--hostname 127.0.0.1` استفاده کنید.

## فیچرها

| # | نام | کاربرد |
| --- | --- | --- |
| 1 | `usage` | توکن مصرفی و هزینه سشن بالای کامپوزر |
| 2 | `reasoning` | نمایش/پنهان‌کردن خلاصه استدلال از نوار ابزار |
| 3 | `theme` | تغییر تم روشن/تاریک |
| 4 | `history` | تاریخچه سشن‌ها (شامل CLI) با امکان حذف |
| 5 | `rtl` | پشتیبانی راست‌به‌چپ برای ورودی کامپوزر |
| 6 | `enter` | Enter خط جدید، Ctrl+Enter ارسال |
| 7 | `settings` | میانبر تنظیمات در نوار ابزار |
| 8 | `refresh` | دکمه بارگذاری مجدد صفحه |
| 9 | `progress` | نوار پیشرفت و اورلی بارگذاری درخواست‌ها |
| 10 | `sync` | رفرش خودکار بعد از بی‌توجهی برای همگام ماندن |

## مدیریت فیچرها

بدون آرگومان اجرا کنید تا مدیر فیچر شماره‌دار باز شود:

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

می‌توانید چند شماره را با هم وارد کنید. دستورهای مستقیم:

```bash
sudo openweb features 1 3 5        # تغییر وضعیت فیچرهای ۱، ۳ و ۵
sudo openweb on 2 4                # فعال‌سازی سریع با شماره
sudo openweb on 9 10               # نوار پیشرفت + همگام‌سازی خودکار
sudo openweb off 1                 # غیرفعال‌سازی سریع با شماره
sudo openweb features enable 2,4   # با نام هم کار می‌کند
sudo openweb features disable 1
sudo openweb features set 1 3 5    # جایگزینی انتخاب با شماره
sudo openweb features set all
sudo openweb features set none
sudo openweb features reset
sudo openweb features list
```

بعد از تغییر فیچرها تب مرورگر را دوباره بارگذاری کنید.

## پنل کنترل

با اجرای `sudo openweb` بدون دستور، پنل شماره‌دار باز می‌شود:

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

## دستورها

| دستور | کاربرد |
| --- | --- |
| `sudo openweb` | پنل کنترل شماره‌دار |
| `sudo openweb install [options]` | نصب، نصب مجدد یا تغییر تنظیمات |
| `sudo openweb update` | دریافت آخرین openweb و اعمال مجدد تنظیمات فعلی |
| `sudo openweb features ...` | مدیر فیچر شماره‌دار / تغییر مستقیم |
| `sudo openweb on <numbers>` | فعال‌سازی سریع فیچرها |
| `sudo openweb off <numbers>` | غیرفعال‌سازی سریع فیچرها |
| `sudo openweb status` | وضعیت سرویس، آدرس HTTPS و اطلاعات ورود |
| `sudo openweb logs` | لاگ‌های OpenCode و nginx |
| `sudo openweb password` | تغییر رمز ورود |
| `sudo openweb uninstall` | توقف، غیرفعال‌سازی و حذف سرویس و رابط |

### گزینه‌ها

| گزینه | پیش‌فرض | توضیح |
| --- | --- | --- |
| `-p, --port <port>` | `5002` | پورت HTTP |
| `-H, --hostname <addr>` | `0.0.0.0` | آدرس اتصال HTTP |
| `-u, --user <name>` | `root` | کاربر لینوکسی اجراکننده سرویس |
| `-U, --username <name>` | `opencode` | نام کاربری ورود |
| `--password <value>` | پرسیده می‌شود | رمز ورود (حداقل ۸ کاراکتر) |
| `--original` | تعاملی | رابط اصلی |
| `--modified` | تعاملی | رابط ویرایش‌شده |
| `--features <list>` | همه در حالت modified | فهرست فیچرها با کاما |
| `--domain <domain>` | `<public-ip>.nip.io` | دامنه HTTPS |
| `--tls <mode>` | `http` غیرتعاملی | `letsencrypt`، `custom` یا `http` |
| `--email <email>` | خالی | ایمیل حساب Let's Encrypt |
| `--tls-cert <path>` | | گواهی برای `--tls custom` |
| `--tls-key <path>` | | کلید خصوصی برای `--tls custom` |
| `--https-port <port>` | `443` | پورت HTTPS |
| `--reuse` | خاموش | استفاده مجدد از تنظیمات و رمز فعلی |
| `-y, --yes` | خاموش | بدون پرسش تأیید |
| `--no-color` | خاموش | خروجی بدون رنگ |

متغیرهای محیطی برای اتوماسیون:

- `OPENWEB_PASSWORD` - رمز (پرسش تعاملی ترجیح دارد)
- `OPENWEB_UI` - `original` یا `modified`
- `OPENWEB_FEATURES` - فهرست فیچرها با کاما
- `OPENWEB_DOMAIN` - دامنه HTTPS
- `OPENWEB_TLS` - `letsencrypt`، `custom` یا `http`
- `OPENWEB_EMAIL` - ایمیل Let's Encrypt
- `OPENWEB_TLS_CERT` / `OPENWEB_TLS_KEY` - گواهی سفارشی
- `OPENWEB_HTTPS_PORT` - پورت HTTPS
- `OPENWEB_REUSE=1` - استفاده از تنظیمات فعلی
- `OPENWEB_SCRIPT_URL` / `OPENWEB_UI_URL` - تغییر آدرس به‌روزرسانی
- `OPENWEB_OPENCODE_VERSION` - نسخه خصوصی OpenCode (پیش‌فرض `1.19.4`)

## نسخه‌های OpenCode

رابط ویرایش‌شده برای رابط وب OpenCode نسخه ۱ ساخته شده است. برای پایداری:

- حالت ویرایش‌شده از یک نسخه خصوصی OpenCode v1.19.4 در
  `/usr/local/lib/openweb/opencode` استفاده می‌کند
- CLI سیستمی `opencode` تغییر نمی‌کند
- حالت اصلی اگر OpenCode سیستمی نسخه ۱ باشد از آن استفاده می‌کند؛ اگر نسخه ۲
  باشد (که وب‌سرور و رابط متفاوتی دارد) از نسخه خصوصی v1 استفاده می‌شود
- اجراکننده در صورت اشاره به باینری v2، خودکار `serve` و برای v1 از `web`
  استفاده می‌کند

این کار باعث می‌شود به‌روزرسانی خودکار OpenCode سرویس وب را خراب نکند.

## فایل‌های نصب‌شده

| مسیر | کاربرد |
| --- | --- |
| `/etc/systemd/system/openweb.service` | یونیت systemd |
| `/etc/openweb/config` | تنظیمات غیرحساس (حالت، فیچرها، TLS، پورت‌ها) |
| `/etc/openweb/password` | رمز ورود (`0640`، root و گروه سرویس) |
| `/usr/local/lib/openweb/run` | اجراکننده با متغیرهای احراز هویت |
| `/usr/local/lib/openweb/opencode` | نسخه خصوصی OpenCode v1.19.4 (در صورت نیاز) |
| `/usr/local/lib/openweb/ui-base.js` | کد رابط ویرایش‌شده |
| `/usr/local/lib/openweb/ui.js` | کد تولیدشده با فیچرهای فعلی |
| `/usr/local/bin/openweb` | فرمان مدیریت |
| `/etc/nginx/conf.d/openweb.conf` | بلاک‌های HTTP، HTTPS و ACME |
| `/etc/nginx/conf.d/openweb-upgrade.conf` | map ارتقای WebSocket |
| `/etc/letsencrypt/renewal-hooks/deploy/openweb` | reload nginx بعد از تمدید |

## به‌روزرسانی

```bash
sudo openweb update
```

آخرین نسخه مدیر و کد رابط را دانلود می‌کند و حالت، فیچرها، تنظیمات TLS،
پورت‌ها و رمز فعلی را دوباره اعمال می‌کند. هیچ پرسشی پرسیده نمی‌شود.

## امنیت

HTTPS توصیه می‌شود و پیش‌فرض نصب تعاملی است. قبل از قرار دادن روی اینترنت:

- از Let's Encrypt (یا گواهی خودتان) استفاده کنید
- پورت‌های 80 و 443 را در فایروال باز کنید (و در صورت نگه‌داشتن، پورت HTTP)
- از رمز بلند و یکتا استفاده کنید

برای دسترسی فقط محلی از `--hostname 127.0.0.1` استفاده کنید.

فایل رابط اختیاری از مسیر `/__openweb/ui.js` و بدون احراز هویت ارائه می‌شود؛
هیچ رمز یا داده سشنی در آن نیست.

## مهاجرت از openweb 2.0

اگر نصب فعلی دارید:

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb -o /tmp/openweb
chmod +x /tmp/openweb
sudo /tmp/openweb install --reuse --domain <your-domain>.nip.io --tls letsencrypt
```

رمز و فیچرها حفظ می‌شوند، فایل دستی قدیمی
`/etc/nginx/conf.d/openweb-tls.conf` با تنظیمات HTTPS مدیریت‌شده جایگزین
می‌شود و برای رابط ویرایش‌شده از نسخه خصوصی v1 استفاده می‌شود.

## پیش‌نیازها

- لینوکس با systemd
- دسترسی root
- `bash`، `curl`، `openssl`
- nginx برای حالت ویرایش‌شده یا HTTPS (نصب خودکار روی Debian/Ubuntu/RHEL)
- certbot برای Let's Encrypt (نصب خودکار)
- دسترسی بیرونی به پورت‌های 80 و 443 برای Let's Encrypt
- `ss` (iproute2) اختیاری است و برای بررسی پورت استفاده می‌شود

روی سیستم‌های SELinux (مثل RHEL) اجازه اتصال nginx به upstream لوکال را بدهید:

```bash
sudo setsebool -P httpd_can_network_connect 1
```

## اعتبار

کد رابط اختیاری (`openweb-ui.js`) برگرفته از
[CodeHub](https://github.com/Aknuun/codehub) با مجوز MIT است.

## مجوز

MIT. این پروژه وابسته به پروژه OpenCode نیست.
