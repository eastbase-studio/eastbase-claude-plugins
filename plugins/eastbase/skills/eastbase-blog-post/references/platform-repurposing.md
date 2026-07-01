# Reference: Platform repurposing

> **One idea, three platforms, three genuinely different pieces — never the same text
> pasted three times.** Below: the per-platform voice rules, then one worked example (the
> entitlement-bug story from `example-eastbase-post.md`) adapted to each. The source blog
> post stays the canonical version; these are natives, not copies.

## Per-platform voice

**X** — sharp, short, opinionated. One idea, tightly. Lead with the concrete moment or the
counterintuitive line. No thread padding, no "🧵👇," no hook that over-promises the payoff.
A thread is fine when the story genuinely has steps; two good tweets beat a padded ten.

**LinkedIn** — a little more reflective and structured; whitespace between short paragraphs
is fine. Still a real person thinking out loud — **not** guru cadence, not "Agree? 👇," not a
humble-brag disguised as a lesson. End with a real question or takeaway, not bait.

**Reddit** — **discussion-first, never an ad.** This is the strict one:

- Lead with the **real problem, lesson, or question** — *not* the product name.
- Prefer **"I noticed / I built / I learned"** over "check out my product."
- Mention the product **only if it's natural and the subreddit allows it** — many don't.
  When in doubt, leave it out and answer questions in the comments.
- Match the subreddit: a title that reads like a headline gets removed; a title that reads
  like a person asking gets answers.

None of the three should sound like AI-generated engagement bait — and **none carries a link
unless the user explicitly asks**; these drafts start conversations, they don't funnel
clicks.

---

## Worked example — the same story, three ways

Source: "The launch check that caught a free version of my paid product."

### X

> I almost shipped my paid app with the paid features free.
>
> The Pro button was gated in the UI. But the API only checked that you were logged in, not
> that you'd paid. A hidden button isn't access control — anyone in devtools got it free.
>
> Before you launch: call your core endpoint as a free logged-in user. See what happens.

*Tone note:* one idea, the twist up front ("a hidden button isn't access control"), one
practical takeaway. No hashtags, no CTA, no thread padding.

### LinkedIn

> Two days before launching a small paid tool, I found the paid features were free.
>
> Not obviously. The upgrade flow worked, checkout worked, the button was gated. But the
> gate lived in the UI — the API endpoint only checked that you were signed in, not that
> you'd paid. A hidden button isn't access control. Anyone who opened devtools had the paid
> product for nothing.
>
> The fix was ten lines: check entitlement on the server, not in the component. The lesson
> was bigger — the moment a product *feels* finished is exactly when you stop looking at the
> parts a normal click-through never touches.
>
> Before I announce anything now, I do one boring thing: call the core endpoint as a free,
> signed-in user and see what comes back.
>
> What's the check you wish you'd run before a launch?

*Tone note:* reflective, a bit more room to breathe, one genuine closing question. Still a
real person — no guru voice, no emoji ladder.

### Reddit

*(e.g. r/SaaS or r/webdev — title reads like a person, not a headline)*

> **Title:** Shipped a "gated" paid feature that turned out to be free to anyone with
> devtools — how do you catch this stuff before launch?
>
> Was doing a final pass before launching a small paid tool and realized the Pro gate was
> only in the React component that hid the button. The actual API route just checked for a
> session, not for payment. So any logged-in free user could call it directly and get the
> paid output.
>
> Fix was easy once I saw it (check entitlement server-side), but what bothers me is I
> *knew* this in the abstract and still almost shipped it — the app looked done and the demo
> worked, so I stopped looking at the endpoints a normal user never hits.
>
> Curious how others catch this class of thing before launch. Do you have a checklist, tests
> for the "call the paid endpoint as a free user" case, something automated? What actually
> works for you vs. what looked good and you dropped?

*Tone note:* leads with the problem, no product name, no link, ends with a real question that
invites others' experience. This is a discussion, not a promo — which is the only kind of
Reddit post that survives.
