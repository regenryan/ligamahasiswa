# Google Sheets Schema

Create these tabs in the Liga Mahasiswa Malaysia Google Sheet.
Headers must match exactly (case-sensitive, underscores).
Pages support both old and new column names for backwards compatibility.

---

## Users
```
id, name, email, phone, password_hash, chapter_slug, role, status, member_id, avatar_url, created_at, updated_at
```
- `role`: "user" | "committee" | "admin"
- `status`: "pending" | "approved" | "rejected"
- `password_hash`: salted SHA-256 (`salt:hash`)

## Chapters
```
slug, name, full_name, description, established, members_count, Instagram, Facebook, Twitter, WhatsApp, email, website, President_name, President_email
```

## Campaigns
```
slug, chapter_slug, title, description, status, demands, timeline, has_ticker, likes, created_at
```
- `demands`: JSON array string, e.g. `["Demand 1", "Demand 2"]`
- `timeline`: JSON array string, e.g. `[{"date":"2024-01","text":"Launched"}]`
- `has_ticker`: "true" or "false"
- Code also reads `summary` (alias for `description`)

## Events
```
slug, chapter_slug, title, description, date, time, location, location_url, type, status, likes, created_at
```
- `type`: "Forum" | "Assembly" | "Dialogue"
- Code also reads `blurb` (alias for `description`) and `place` (alias for `location`)

## RSVPs
```
id, user_id, event_slug, status, created_at
```

## Statements
```
slug, chapter_slug, title, content, author, date, status, created_at
```

## Gallery
```
id, chapter_slug, image_url, caption, likes, created_at
```

## Products
```
slug, name, tag, price, chapter_slug, description, imageUrl, member_only, stock, status, created_at
```
- `member_only`: "true" or "false"
- `status`: "active" | "archived"

## Orders
```
id, hitpay_id, amount, currency, payment_method, payment_status, items, buyer_email, buyer_name, created_at
```

## Zines
```
slug, title, author, chapter_slug, content, excerpt, likes, status, created_at
```
- `status`: "pending" | "approved" | "rejected"

## Likes
```
id, user_id, target_type, target_slug, created_at
```
- `target_type`: "zine" | "campaign" | "event" | "gallery"

## PRK_Nominations
```
id, name, chapter_slug, position, platform, email, status, created_at
```
- Code also reads `statement` (alias for `platform`) and `user_id` (alias for `name`)

## Newsletter
```
id, email, name, chapter_slug, created_at
```

## Contact
```
id, name, email, subject, message, created_at
```

## News
```
outlet, title, url, image_url, fetched_at
```

## Constitution
```
id, section, title, content, order
```
- Code also reads `version` (alias for `order`)

## Committee
```
id, chapter, title, name, email, created_at
```
