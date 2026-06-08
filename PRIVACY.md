# Voidlink — Privacy Notice

**Effective: launch.** Last updated: 2026-06.

This Privacy Notice explains what data Voidlink collects, why, where it
goes, and what you can do about it. It is short because Voidlink collects
very little data. We want to keep it that way.

If you are reading this on a regulator's behalf: Voidlink is published by
Richard Martin, sole trader, based in the United Kingdom. We are the data
controller for any personal data described below.

---

## 1. What we collect — in-game (single-player)

**Nothing leaves your machine.**

When you play the single-player game, all your save data — operative
handle, mission history, choices, achievements, settings — is stored
locally on your device, in your browser's `localStorage` (web build) or
your Steam user-data directory (Steam build). It does not travel to us,
to any analytics service, or to any third party.

There is no telemetry. No crash-reporting service is wired in. No "phone
home" check. The game does not need an internet connection to play and
does not initiate one for the single-player mode.

## 2. What we collect — cloud saves (optional, Phase B)

If you opt into cloud saves (a post-launch feature; see the in-game settings
menu), we will store your save file on infrastructure we operate, so that
you can sync it across devices.

To make cloud saves work, we will collect and process:

- **An email address** you provide. This is used to identify the save
  account (one save vault per email). We send a magic-link sign-in email to
  this address. We do not use it for marketing.
- **Your operative handle and save-file blob.** Encrypted in transit (TLS)
  and at rest (server-side AES-256). We can technically read the save
  file's contents; we do not, except for debugging support issues you have
  asked us to investigate, with your consent.

Cloud-save data is hosted on Railway (Hono API + managed Postgres), in the
EU-West region by default. Sub-processors:

- **Railway** (railway.app) — server and database hosting
- **An SMTP relay** (TBD pre-launch — likely Resend or Postmark) — magic
  link delivery only

We will publish the final sub-processor list on this page before cloud
saves launch.

You may delete your cloud-save account at any time via Settings → Account
→ Delete cloud account. Deletion is irreversible and immediate; we keep no
backups beyond seven days for operational recovery.

## 3. What we collect — Steam

If you play the Steam build, Steam itself collects achievement-unlock
events, playtime, and (if you opt in via Steam) crash reports. This is
governed by Valve's privacy policy, not by us. We see only aggregate
achievement-percentage data via the Steamworks dashboard. We do not
receive personally-identifiable information from Steam about individual
players.

## 4. What we collect — multiplayer (post-2028, Phase C)

Multiplayer is a *late* roadmap feature and is not in the launch product.
When multiplayer launches, this Privacy Notice will be updated, the change
will be announced in the in-game patch notes, and players will be asked to
re-accept the EULA. Multiplayer will require an account (email + magic
link, the same mechanism as cloud saves) and will involve sending and
receiving real-time game state to and from other players' clients via a
relay we operate. Details when we have them.

## 5. What we do not do

- No third-party analytics SDKs (no Google Analytics, no Facebook Pixel,
  no Mixpanel, no Sentry-style auto-instrumentation in the binary)
- No fingerprinting
- No ad tracking
- No data sale, ever
- No newsletter signup unless you separately and explicitly opt in via a
  form we publish on the website (which does not exist at launch)

## 6. Your rights

You have the right under UK and EU data-protection law (GDPR, UK GDPR) to:

- Know what data we hold about you
- Ask for a copy of it (data portability)
- Ask us to correct it
- Ask us to delete it
- Withdraw consent for any optional processing

To exercise any of these rights, email **privacy@voidlink.game**. We aim
to respond within 30 days. If you are unhappy with our response, you have
the right to complain to the UK Information Commissioner's Office at
[ico.org.uk](https://ico.org.uk).

## 7. Children

Voidlink is rated 16+ (provisional, pre-rating-board). We do not knowingly
collect personal data from children under 13. If you are a parent and
believe we have, email us and we will delete it.

## 8. Changes to this notice

Substantive changes will be announced in the game's patch notes and shown
on first launch after the change ships. Trivial copy edits will not be.

## 9. Contact

**privacy@voidlink.game** — privacy enquiries
**legal@voidlink.game** — formal data-protection requests, regulator
correspondence

---

*Last updated 2026-06. Effective from launch.*
