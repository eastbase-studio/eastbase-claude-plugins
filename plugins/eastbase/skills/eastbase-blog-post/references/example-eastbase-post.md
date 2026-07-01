# Reference: A worked Eastbase post

> **⚠ This is ONE post in the Eastbase voice — not a template to fill in.** It exists to
> calibrate *voice and structure*: how it opens on a real moment, stays useful without
> selling, mentions the product once and naturally, and admits what's still uncertain. Copy
> the **voice and the moves**, not the topic or the specifics. A real post is built from the
> project's own material.

---

## The launch check that caught a free version of my paid product

I almost shipped PostParrot with the paid features unlocked for everyone.

Not in an obvious way. The "Pro" button was gated, the upgrade flow worked, the checkout
was wired to Lemon Squeezy. If you used the app like a normal person, everything looked
correct. The problem was one layer down: the generate endpoint only checked that you were
*signed in*, not that you'd *paid*. The Pro check lived in the React component that hid the
button — and a hidden button is not access control. Anyone who opened devtools and called
the API directly got the paid product for free.

I found it two days before launch, and I found it because I made the tooling look for it.

### What actually happened

I've been building a small habit at Eastbase: before I announce anything, I run the change
through a pre-launch checklist — not a vibe check, an actual pass over the launch surface.
Auth, billing, the core flow, env, the public claims. For a paid AI tool, two of those
matter more than the rest: can someone get the paid thing without paying, and can someone
run up my API bill.

The check flagged both.

The first was the entitlement bug above. The fix was small — load the user's Pro status on
the server, in the route handler, and reject the request if it's missing. Maybe ten lines.
The bug was never that the fix was hard; it was that the check was in the wrong place, and
nothing had made me look at the right place until I sat down and asked, specifically, "can
a signed-in free user call this endpoint?"

The second was worse in a quieter way. The generate endpoint looped over however many posts
you asked for and called the model once per post. The count came straight from the request
body. No upper bound, no per-user rate limit, no cap on output length. On a normal day, fine.
On a Product Hunt day, with a few hundred curious people and one person typing `500` into
the request, that's a real bill with my name on it. I did the rough math once I saw it: at a
few cents per post, one bored person looping the endpoint could spend more in an afternoon
than the tool would make in its first week. I clamped the count to fourteen, set a token
ceiling, and added a basic per-user limit — none of it clever, all of it the kind of
guardrail you only think to add after you've pictured the bad version.

### Why I'm writing this down

Neither of these is a clever bug. They're the boring kind — the kind you know about in the
abstract and still ship, because the app *looked* done and the demo worked. That's the
whole trap. The moment a product feels finished is exactly when you stop looking at the
parts a normal click-through never touches.

What helped wasn't a security audit. I didn't have time for one and PostParrot didn't need
one. What helped was a short, specific list of the questions that actually sink a small SaaS
launch, asked out loud, against the real code — not "is this secure" but "can a free user
hit this exact endpoint."

I've since folded that list into a launch-check skill my coding agent runs on request, so
the next launch gets the same pass without me having to remember it. But honestly, a text
file with ten pointed questions would have caught both of these. The skill is just the
version that doesn't depend on me being disciplined at 11pm.

### The part I'm still unsure about

Where this lives long-term, I don't know yet. Right now the check is something I trigger by
hand. The obvious next step is to make it run automatically before a deploy — but I've been
burned by checks that cry wolf until you stop reading them, so I'd rather it stay sharp and
occasional than become CI noise. My current guess is that the pass earns its place precisely
because it's rare: I run it when I'm about to do something hard to undo — point a domain at a
thing, take someone's money — and the day it becomes a step I click through on autopilot is
the day it stops catching anything. I'll probably get that balance wrong once or twice before
it's right.

### If you're launching something small

You don't need my tooling. You need the fifteen minutes and the specific questions. Before
you announce:

- Take the one action your product is *for* and call its API directly as a free, signed-in
  user. If you get the paid result, your gate is in the UI, not the server.
- Find every place you call a paid API (AI or otherwise) on user input, and ask what happens
  if someone sends a big number. If there's no cap, add one.

That's it. Those two took me twenty minutes to fix and would have been a genuinely bad first
day if a stranger had found them before I did.

---

## Why this post works

- **Opens on the real moment**, first line — "I almost shipped PostParrot with the paid
  features unlocked." No scene-setting, no "in today's world."
- **Useful without the product.** The two concrete checks at the end work for anyone
  launching anything; the reader wins even if they never touch Eastbase.
- **One natural product mention.** The skill shows up once, mid-story, *and immediately
  undercuts itself* ("a text file with ten questions would have caught both") — that honesty
  is what keeps it from reading as an ad.
- **Admits uncertainty on purpose** — the "part I'm still unsure about" section names a real
  open question and a tradeoff, instead of pretending the system is solved.
- **Specific, not broad** — devtools, the request body, `500`, "maybe ten lines," Product
  Hunt. The specifics are the credibility.
- **No hype, no invented metrics.** No "10x safer," no fake user counts. The soft close is a
  practical takeaway, not a CTA.
- **Sounds like a builder wrote it at their desk**, which is the entire bar.
