const user_id = supabase.auth.user()?.id

if user_id exist, get/set data to supabase
else get/set to localStorage

---

assume supabase project id: ezterexugkolenowjsex

config.url: https://ezterexugkolenowjsex.supabase.co

Callback URL = config.url + '/auth/v1/callback'

Callback URL for OAuth2: https://ezterexugkolenowjsex.supabase.co/auth/v1/callback

eg: https://ezterexugkolenowjsex.supabase.co/auth/v1/callback


---

setup supabase auth and table:

https://supabase.com/dashboard/project/ezterexugkolenowjsex/auth/providers

- enable `email`, `google`, `github`, `gitlab` with providers info

Enable Custom SMTP with resend.com

---

create 2 database tables

- rushbin-setting

|columns name|type|
| -------- | ------- |
| user_id  | uuid    |
| isAuthHidden  | bool    |
| isSettingHidden  | bool    |
| currentPage  | int2    |
| pageSize  | int2    |
| isEditing  | bool    |
| id  | int8 (default)    |
| created_at  | timestamp (default)    |

- rushbin-data

|columns name|type|
| -------- | ------- |
| user_id  | uuid    |
| val  | text    |
| id  | int8 (default)    |
| created_at  | timestamp (default)    |

authentication -> policies -> create policy for all tables with respective table name:

```
create policy "Enable insert for users based on user_id"
on "public"."rushbin-data"
as PERMISSIVE
for ALL
to authenticated
using (
  (auth.uid() = user_id)
);
```

---

create app from auth providers & fill up Callback URL (for OAuth):

https://console.developers.google.com/apis/credentials/oauthclient

https://github.com/settings/developers

https://gitlab.com/oauth/applications
