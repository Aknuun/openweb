# openweb

نصب و مدیریت **OpenCode Web** روی سرورهای لینوکسی (systemd).

اسکریپت `openweb` در صورت نبود، OpenCode را نصب می‌کند، یک سرویس systemd
ایمن می‌سازد، رمز ورود را از خودتان می‌پرسد، سرویس را در بوت فعال می‌کند و در
پایان همه اطلاعات اتصال را با رنگ‌های مختلف نمایش می‌دهد.

می‌توانید **رابط اصلی OpenCode** یا یک **رابط ویرایش‌شده** با چند قابلیت
اختیاری برگرفته از [CodeHub](https://github.com/Aknuun/codehub) را نصب کنید.

[English version](README.md)

## امکانات

- نصب تعاملی (حالت، پورت، آدرس، نام کاربری، رمز و فیچرها)
- انتخاب رابط اصلی یا ویرایش‌شده هنگام نصب
- مدیر فیچر برای افزودن یا حذف قابلیت‌ها در هر زمان
- دستورهای `update`، `status`، `logs`، `password` و `uninstall`
- پرسیدن دو باره رمز (حداقل ۸ کاراکتر) بدون ذخیره در تاریخچه شل
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
3. آدرس و پورت
4. نام کاربری ورود
5. رمز (در نصب اول)

## حالت‌های نصب

### رابط اصلی

رابط خام OpenCode که مستقیماً توسط `opencode web` ارائه می‌شود:

```bash
sudo openweb install --original
```

### رابط ویرایش‌شده

رابط OpenCode به‌همراه قابلیت‌های اختیاری، از طریق یک فرانت nginx:

```bash
sudo openweb install --modified
sudo openweb install --modified --features usage,reasoning,theme,history,rtl,enter,settings,refresh
```

اگر `--modified` بدون `--features` استفاده شود، همه فیچرها فعال می‌شوند.

حالت ویرایش‌شده به nginx نیاز دارد. اگر نصب نباشد، با `apt-get`، `dnf` یا
`yum` نصب می‌شود. OpenCode روی یک پورت خصوصی loopback گوش می‌دهد و nginx
شنونده عمومی است و اسکریپت رابط را به صفحه تزریق می‌کند.

## فیچرها

| نام | کاربرد |
| --- | --- |
| `usage` | نمایش توکن مصرفی و هزینه سشن بالای کامپوزر |
| `reasoning` | نمایش/پنهان‌کردن خلاصه استدلال از نوار ابزار |
| `theme` | تغییر تم روشن/تاریک |
| `history` | تاریخچه سشن‌ها (شامل CLI) با امکان حذف |
| `rtl` | پشتیبانی راست‌به‌چپ برای ورودی کامپوزر |
| `enter` | Enter خط جدید، Ctrl+Enter ارسال |
| `settings` | میانبر تنظیمات در نوار ابزار |
| `refresh` | دکمه بارگذاری مجدد صفحه |

از `all` و `none` هم می‌توانید استفاده کنید.

## مدیریت فیچرها

```bash
sudo openweb features                 # انتخاب تعاملی
sudo openweb features list            # نمایش حالت و فیچرها
sudo openweb features enable rtl,settings
sudo openweb features disable usage
sudo openweb features set all
sudo openweb features set none
sudo openweb features reset           # بازگشت به مجموعه پیش‌فرض
```

فعال‌کردن هر فیچر، نصب را به حالت ویرایش‌شده می‌برد (و در صورت نیاز nginx را
تنظیم می‌کند). بعد از تغییر فیچرها تب مرورگر را دوباره بارگذاری کنید.

## دستورها

| دستور | کاربرد |
| --- | --- |
| `sudo openweb` | نصب/به‌روزرسانی تعاملی (پیش‌فرض) |
| `sudo openweb install [options]` | نصب، نصب مجدد یا تغییر تنظیمات |
| `sudo openweb update` | دریافت آخرین openweb و اعمال مجدد تنظیمات فعلی |
| `sudo openweb features ...` | مدیریت فیچرهای رابط |
| `sudo openweb status` | وضعیت سرویس، حالت، آدرس و اطلاعات ورود |
| `sudo openweb logs` | مشاهده زنده لاگ‌های OpenCode |
| `sudo openweb password` | تغییر رمز ورود |
| `sudo openweb uninstall` | توقف، غیرفعال‌سازی و حذف سرویس و رابط |

### گزینه‌ها

| گزینه | پیش‌فرض | توضیح |
| --- | --- | --- |
| `-p, --port <port>` | `5002` | پورت عمومی |
| `-H, --hostname <addr>` | `0.0.0.0` | آدرس اتصال عمومی |
| `-u, --user <name>` | `root` | کاربر لینوکسی اجراکننده سرویس |
| `-U, --username <name>` | `opencode` | نام کاربری ورود |
| `--password <value>` | پرسیده می‌شود | رمز ورود (حداقل ۸ کاراکتر) |
| `--original` | تعاملی | رابط اصلی |
| `--modified` | تعاملی | رابط ویرایش‌شده |
| `--features <list>` | همه در حالت modified | فهرست فیچرها با کاما |
| `--reuse` | خاموش | استفاده مجدد از تنظیمات و رمز فعلی |
| `-y, --yes` | خاموش | بدون پرسش تأیید |
| `--no-color` | خاموش | خروجی بدون رنگ |

متغیرهای محیطی برای اتوماسیون:

- `OPENWEB_PASSWORD` - رمز (پرسش تعاملی ترجیح دارد)
- `OPENWEB_UI` - `original` یا `modified`
- `OPENWEB_FEATURES` - فهرست فیچرها با کاما
- `OPENWEB_REUSE=1` - استفاده از تنظیمات فعلی
- `OPENWEB_SCRIPT_URL` / `OPENWEB_UI_URL` - تغییر آدرس به‌روزرسانی (برای فورک)

### مثال‌ها

```bash
sudo openweb install --port 8080 --username admin
sudo openweb install --hostname 127.0.0.1 --port 3000
sudo openweb install --modified --features usage,reasoning,theme
sudo openweb features disable usage,history
sudo openweb update
sudo openweb status
sudo openweb uninstall
```

## فایل‌های نصب‌شده

| مسیر | کاربرد |
| --- | --- |
| `/etc/systemd/system/openweb.service` | یونیت systemd |
| `/etc/openweb/config` | تنظیمات غیرحساس (حالت، فیچرها، پورت‌ها و ...) |
| `/etc/openweb/password` | رمز ورود (`0640`، root و گروه سرویس) |
| `/usr/local/lib/openweb/run` | اجراکننده‌ای که متغیرهای احراز هویت OpenCode را تنظیم می‌کند |
| `/usr/local/lib/openweb/ui-base.js` | کد رابط ویرایش‌شده |
| `/usr/local/lib/openweb/ui.js` | کد تولیدشده با فیچرهای فعلی |
| `/usr/local/bin/openweb` | فرمان مدیریت |
| `/etc/nginx/conf.d/openweb.conf` | فرانت nginx برای حالت ویرایش‌شده |
| `/etc/nginx/conf.d/openweb-upgrade.conf` | map ارتقای WebSocket |

اگر OpenCode از قبل نصب نباشد، در خانه کاربر سرویس
(`~/.opencode/bin/opencode`) نصب می‌شود.

## به‌روزرسانی

```bash
sudo openweb update
```

آخرین نسخه مدیر و کد رابط را دانلود می‌کند و سپس حالت، فیچرها، پورت، آدرس و
رمز فعلی را دوباره اعمال می‌کند. هیچ پرسشی پرسیده نمی‌شود.

## امنیت

به‌صورت پیش‌فرض سرویس روی `0.0.0.0` و روی HTTP ساده با احراز هویت
Basic Auth (از طرف OpenCode) گوش می‌دهد. قبل از قرار دادن روی اینترنت:

- آن را پشت یک ریورس‌پروکسی TLS قرار دهید (Caddy، Nginx و ...)
- فقط پورت لازم را در فایروال باز کنید
- از رمز بلند و یکتا استفاده کنید

برای دسترسی فقط محلی از `--hostname 127.0.0.1` استفاده کنید.

فایل رابط اختیاری از مسیر `/__openweb/ui.js` و بدون احراز هویت ارائه می‌شود؛
هیچ رمز یا داده سشنی در آن نیست.

## مهاجرت از openweb 1.x

نصب‌کننده جدید را روی نصب فعلی اجرا کنید:

```bash
curl -fsSL https://raw.githubusercontent.com/Aknuun/openweb/main/openweb -o /tmp/openweb
chmod +x /tmp/openweb
sudo /tmp/openweb install --reuse
```

رمز فعلی حفظ می‌شود و حالت پیش‌فرض اصلی است. برای رفتن به رابط ویرایش‌شده:

```bash
sudo openweb install --modified --reuse
# یا
sudo openweb features reset
```

## پیش‌نیازها

- لینوکس با systemd
- دسترسی root
- `bash`، `curl`
- nginx برای حالت ویرایش‌شده (نصب خودکار روی Debian/Ubuntu/RHEL)
- `ss` (iproute2) اختیاری است و برای بررسی پورت استفاده می‌شود

## اعتبار

کد رابط اختیاری (`openweb-ui.js`) برگرفته از
[CodeHub](https://github.com/Aknuun/codehub) با مجوز MIT است.

## مجوز

MIT. این پروژه وابسته به پروژه OpenCode نیست.
