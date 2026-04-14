/**
 * Seed initial blog posts for wedding30s.
 * Idempotent: re-running upserts by (slug, locale).
 *
 * Cluster prioritario aprobado por la cúpula 2026-04-14:
 * 9 artículos EN + 9 ES pareados via translatedSlug.
 *
 * Usage:
 *   npx tsx src/server/scripts/seed-blog.ts
 */
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { query, execute } from '../db/index.js';

interface SeedPost {
  slug: string;
  locale: 'es' | 'en';
  title: string;
  description: string;
  content_html: string;
  hero_image?: string | null;
  translated_slug?: string | null;
  published_at: string;
}

// ============================================================================
// EN cluster
// ============================================================================

const EN_DIGITAL_INVITATION_IDEAS = `
<p>Paper invitations still have their charm. They also cost between two and five euros per guest, take three weeks to print and ship, and become useless the moment you need to update the venue or the time. A growing number of couples are skipping them in favour of formats that live online — and the change is not just about saving money.</p>

<p>Here are twelve digital wedding invitation formats couples are using in 2026, with the trade-offs of each one and an honest take on when each makes sense.</p>

<h2>1. The single-page wedding website</h2>

<p>One clean URL like <code>wedding30s.com/sara-and-mike</code> with everything in one scroll: hero photo, date, location, story, programme, RSVP, directions and menu. No login needed. Guests open the link, read it on their phone in two minutes, RSVP without thinking.</p>

<p>This is the format we recommend by default at Wedding30s, because it covers what 90% of couples need without forcing guests to learn anything new. The trade-off: a wedding website lives forever on the same URL, so pick the slug carefully.</p>

<h2>2. The QR code on a physical card</h2>

<p>You print a small card (or a fridge magnet) with a single QR code that opens the wedding website. Combines the keepsake feel of paper with the convenience of a link.</p>

<p>This is the most common compromise we see: 70% of the budget of a paper invitation, and full digital functionality. The catch is testing the QR before printing — we have seen couples print a QR that resolved to a 404.</p>

<h2>3. The animated invitation card</h2>

<p>A short animation shared on WhatsApp or as a story. Names appear, the date floats in, the venue fades up. Lighter than a video, more memorable than a still image.</p>

<p>Best for couples who want something playful. It works as a teaser, but it should always link to a full wedding website where guests can RSVP — the animation alone does not collect responses.</p>

<h2>4. The interactive RSVP page</h2>

<p>Guests confirm attendance, choose their menu (with allergies), say if they are bringing a plus one, and leave a message. You see every response in real time on a private dashboard.</p>

<p>Any wedding above 30 guests benefits from this. Tracking it on a spreadsheet works for a while, then someone replies twice or forgets to mention they are vegetarian and the system breaks down. The interactive RSVP page replaces that mess with one form.</p>

<h2>5. The Spotify playlist invitation</h2>

<p>You share a Spotify playlist as the invitation, with the cover art set to your wedding details. Guests can add their own song requests for the dancefloor.</p>

<p>It is more of a teaser than a full invitation — guests still need a place to RSVP — but it is a memorable extra that costs nothing and tells everyone something about the two of you.</p>

<h2>6. The Instagram story invitation</h2>

<p>A 3-frame story shared on your private account, with the link sticker pointing at the wedding website. Guests tap, see the page, RSVP.</p>

<p>The downside is obvious: stories disappear in 24 hours. Almost every couple who picks this also sends a follow-up via WhatsApp the next day. Use it as an announcement, not as the main invitation.</p>

<h2>7. The personalised page for VIPs</h2>

<p>One general wedding website for everyone, plus a small set of personalised pages for parents, witnesses and very close friends with a private message at the top.</p>

<p>It is a small touch that makes important guests feel different. We have seen couples write five lines for each VIP and it took them less than an hour total.</p>

<h2>8. The bilingual wedding website</h2>

<p>One wedding website with two language versions, perfect for international couples or for weddings with guests from multiple countries. Guests pick the language at the top.</p>

<p>If half your family speaks English and half speaks Spanish, this is the only format that does not leave anyone reading a translated WhatsApp message. The two versions need to be kept in sync, but the wedding website builder handles it for you.</p>

<h2>9. The countdown wedding website</h2>

<p>The website includes a live countdown. Some couples reveal new content as the date gets closer — the menu in week minus eight, the programme in week minus four, the venue parking details in week minus one.</p>

<p>It works well for destination weddings, where guests need to plan flights and accommodation in stages. The risk is dumping everything at once and losing the drip-feed effect.</p>

<h2>10. The illustrated wedding page</h2>

<p>A custom illustration of the venue or the couple as the hero image of the wedding website. Feels personal, looks timeless, ages well in photos and screenshots.</p>

<p>Budget for it: between 80 and 300 euros for a freelance illustrator on Fiverr or Behance, plus six weeks of lead time. Worth it if you plan to use the same illustration on the menu cards and the thank-you notes.</p>

<h2>11. The map-first invitation</h2>

<p>The wedding website opens on a map of the venue, with the date and the names overlaid. Useful for destination weddings or for venues that are tricky to find.</p>

<p>This works as the hero of the page, not as the only thing on it — guests still need to scroll to the RSVP and the menu. We have seen couples treat the map as a mini-feature inside the page rather than the front door.</p>

<h2>12. The full wedding website (the safe pick)</h2>

<p>If you can only choose one format, choose this one. A clean URL, a hero photo, the date, the venue, an RSVP form, the menu, the programme, and the gallery for after the wedding. It works on every phone, every browser, no app required.</p>

<p><a href="/create">You can build yours in five minutes</a> with our wizard. Pick a template, fill in your names, upload one photo, and the website is ready to share. You only pay (49€, one time) when you publish.</p>

<h2>So which one should you actually pick?</h2>

<p>If you are reading this with a wedding in less than six months and a guest list above 30 people, pick option 12 and add option 4 (the interactive RSVP). That covers the practical side of inviting people without spreadsheets and chase emails.</p>

<p>If you have more time and a smaller, more curated guest list, options 7 and 11 add a personal layer that guests remember. And if you are an international couple, option 8 is non-negotiable.</p>

<p>Whatever you pick, the rule that matters is this: every guest, no matter their age or how comfortable they are with phones, should be able to read the invitation and respond in under two minutes. If your format passes that test, it works.</p>
`;

const EN_HOW_TO_CREATE_5_MIN = `
<p>Most wedding planning advice assumes you have an unlimited Saturday afternoon and the patience of a saint. Building the wedding website is one of the few tasks where that is not true: the technical part can take five minutes if the tool is built for it, and the content part can take another twenty if you have your details ready.</p>

<p>This is the exact path we recommend if you are starting from zero today.</p>

<h2>Before you open the builder</h2>

<p>Have these eight things on a phone note or a piece of paper. They are the only inputs the wedding website needs to be ready to publish.</p>

<ol>
  <li>Both names, in the order you want them shown</li>
  <li>The date of the wedding</li>
  <li>The full address of the venue (or two addresses if the ceremony and the reception are in different places)</li>
  <li>One photo of the two of you that you actually like</li>
  <li>An email where guests can reach you in case they have questions</li>
  <li>The dietary options you are offering at the dinner (meat / fish / vegetarian / vegan)</li>
  <li>A short two-line story about how you met, or just a sentence — anything is better than blank</li>
  <li>The deadline for confirming attendance (we recommend three weeks before the wedding)</li>
</ol>

<p>Five minutes of preparation here saves twenty minutes of going back and forth inside the builder. Trust us.</p>

<h2>Step 1: Pick a template (60 seconds)</h2>

<p>Open <a href="/create">the wizard</a>. You will see four templates: Classic Garden, Romantic Blush, Modern Dark and Minimal White. They all have the same structure underneath — what changes is the colour palette and the typography.</p>

<p>Pick the one that feels closest to the venue. If your wedding is outdoors in May, Classic Garden is hard to beat. If you are doing an evening reception in a hotel, Modern Dark looks more grown up. There is no wrong answer — you can change it later in three clicks.</p>

<h2>Step 2: Names, date, venue (90 seconds)</h2>

<p>Fill the four required fields. The wizard shows you a live preview as you type, so you can see the names appearing in the hero exactly as they will look to your guests. If you want to swap "and" for "&", do it now and stop worrying.</p>

<p>For the venue, paste the Google Maps link. The wizard extracts the address automatically and embeds the map at the bottom of the page. Guests will see the directions inside the wedding website, no need to copy-paste anywhere.</p>

<h2>Step 3: Upload your photo (60 seconds)</h2>

<p>One photo of the two of you. Not five, not ten — one. The hero of the wedding website is the photo that everyone sees first, and the rule is the same as on a dating app: the best photo carries 80% of the impression.</p>

<p>It does not have to be professional. We have seen wedding pages built with a phone selfie that look great because the couple was happy in the photo. If you have an engagement photo, even better. Drop it on the wizard, crop it inside, done.</p>

<h2>Step 4: Programme and dietary options (90 seconds)</h2>

<p>The programme is just a list: ceremony at 17:00, cocktail at 18:30, dinner at 20:00. Three lines is enough. Guests need to know when to arrive and when the dinner starts, not a minute-by-minute breakdown.</p>

<p>The dietary options matter more than the programme. Pick the categories you are offering, and the wizard adds them to the RSVP form so guests can mark their choice. If your venue offers four dishes, list four. If it is a buffet, you can skip this step entirely and just write "buffet menu, all dietary needs covered" in the venue notes.</p>

<h2>Step 5: Preview, share, publish (40 seconds)</h2>

<p>The preview button shows you exactly what your guests will see. Open it in a phone — that is where 90% of guests will read it. If something looks off, fix it. The whole wedding website lives behind one URL.</p>

<p>You can share the preview link with your partner, your parents, anyone you want feedback from, before you pay. We recommend a 24-hour cooling period: build it, share with two trusted people, sleep on it, publish the next day. The cost of waiting is zero. The cost of publishing something with a typo and then having to update it after a hundred people already have the link is real.</p>

<p>When you are ready, click publish. The 49€ payment goes through Polar (one-time, no subscription, no hidden fees), and your wedding website goes live at the URL you picked. Done.</p>

<h2>What you can change after you publish</h2>

<p>Almost everything. Programme, menu, story, photos, gallery, dietary options, even the template — all of it lives in your private dashboard. The URL stays the same, so guests never have to update anything on their side.</p>

<p>What you cannot change after publishing is the slug — the part of the URL that comes after wedding30s.com/. Pick it carefully when you build the page. Short, memorable, easy to spell over the phone.</p>

<h2>What if I want to take longer?</h2>

<p>You can. The wizard saves automatically, so you can leave it half-built and come back tomorrow. Some couples spend an hour fine-tuning the colours, the typography, the gallery layout — that is fine. The point of the five-minute promise is that there is no obstacle if you are short on time.</p>

<p><a href="/create">Open the wizard now</a> and see how far you can get in five minutes. The preview is free; you only pay when you press publish.</p>
`;

const EN_RSVP_ONLINE = `
<p>The RSVP is the single most stressful part of wedding planning that nobody warns you about. You send the invitation. People reply on WhatsApp, on email, on Instagram DMs, in person at coffee. Some confirm and forget to mention they are vegetarian. Others say "of course we are coming" and disappear for two months. By the time the venue asks for a final headcount, you have a spreadsheet with three different versions of the same answer for half your guests.</p>

<p>This is exactly the problem an RSVP wedding website is built to solve. Here is what one should actually include in 2026, and what you can safely skip.</p>

<h2>The five fields that matter</h2>

<p>An RSVP form does not need to be complicated. The fields that make a real difference for the wedding planning are exactly five.</p>

<p><strong>Name</strong> — Guests type their full name, exactly how they want it on the seating chart. Do not assume you remember the spelling of every cousin.</p>

<p><strong>Attending: yes / no / maybe</strong> — A simple three-option choice. "Maybe" exists because some guests need to check flights or kids' schedules and want to confirm later — better to have a tracked maybe than no answer at all.</p>

<p><strong>Plus one (if you allow it)</strong> — A toggle plus a name field if active. The plus one rule should be set by you, not negotiated case by case in the form.</p>

<p><strong>Dietary preference</strong> — A dropdown with the menu options you are offering. Three to five categories is the sweet spot: meat, fish, vegetarian, vegan, kids menu. Add a free-text field for allergies.</p>

<p><strong>Optional message</strong> — A small text box where guests can write a personal note. You will be surprised how many take the time to use it. Some couples print the messages and bind them as a wedding day keepsake.</p>

<p>Anything beyond these five fields tends to make guests close the form. We have seen couples ask for hotel preferences, transport options, song requests and ice-breaker questions — and the response rate dropped by 30% compared to the simpler version.</p>

<h2>What guests hate about RSVP forms</h2>

<p>We have run informal user testing on a few dozen real wedding RSVP flows. The complaints are surprisingly consistent.</p>

<p><strong>Forms that ask to create an account.</strong> Nobody wants to sign up for a service to confirm a wedding. Every minute you add to the RSVP is a guest who closes the tab. The form should work on the first tap, no login required.</p>

<p><strong>Forms with mandatory phone number.</strong> Same problem. The bride already has the number, asking for it inside the form looks like a mailing list trap.</p>

<p><strong>Forms that do not confirm the submission.</strong> A guest taps submit, the page reloads, and nothing happens. Did it work? Should they try again? A confirmation message ("Thank you, we have your reply") is the difference between a peaceful evening and an inbox full of "did my reply go through?".</p>

<p><strong>Forms that look broken on a phone.</strong> 90% of RSVPs happen on a phone, on the toilet, in the gap between two work meetings. If the form requires zooming or horizontal scrolling, the guest gives up.</p>

<h2>What happens after they hit submit</h2>

<p>The guest sees a thank-you message. You receive a notification in your private dashboard. The new RSVP shows up in the guest list with the date, the choices and the message. You can filter by attending / not attending, sort by submission date, export to CSV if your venue needs the headcount in a spreadsheet.</p>

<p>This is what makes online RSVP genuinely useful: not the form itself, but what happens with the data afterwards. A spreadsheet with 100 guests is unmanageable. A live dashboard with the same 100 guests, sorted and filtered, is the difference between sleeping at night and refreshing your email.</p>

<h2>The deadline question</h2>

<p>Set the RSVP deadline three weeks before the wedding. Not two — three. Here is why: at three weeks before the wedding, you still need to give the venue the final headcount, finalise the seating chart, print the place cards, and chase the late replies. Two weeks is too tight. Three weeks gives you a buffer.</p>

<p>The wedding website should show the countdown to the deadline, not just the date. "Reply before March 15" is less powerful than "Reply in 12 days". A live countdown reminds guests they are running out of time without you having to send a reminder.</p>

<h2>What about late replies?</h2>

<p>You will have late replies. Every wedding does. The smart move is to set the form to keep accepting submissions even after the deadline, and just remove the countdown from the page. That way, the guests who realise on day -10 that they forgot can still confirm without having to text you in panic.</p>

<p>The dashboard shows you who replied after the deadline so you can flag them in your seating planning. Some couples chase them with a friendly "we noticed you replied late, can we still count on you?" message. Most just absorb them into the headcount and move on.</p>

<h2>Building it without writing any code</h2>

<p>You do not need to build any of this from scratch. <a href="/create">Wedding30s</a> includes the RSVP form, the dashboard, the menu choices, the dietary tracking and the export to CSV by default. You fill in your details, you publish the wedding website, the form is live. 49€ one time, no subscription.</p>

<p>The setup takes five minutes. The peace of mind it gives you in the last month before the wedding is hard to put a price on, but if we had to: it is the difference between sleeping eight hours a night and refreshing your email at 2am.</p>
`;

const EN_FREE_VS_PAID = `
<p>"Free wedding website" is one of the most searched wedding planning queries on Google. It is also the source of more than half of the regret stories we hear from couples who tried to save 49€ and ended up with a slow, ad-covered page that crashed two days before the wedding.</p>

<p>This is an honest comparison of free and paid wedding website builders in 2026. We sell a paid one, so take everything we say with a pinch of salt — but we have also tried the free options ourselves, and the trade-offs are real on both sides.</p>

<h2>What "free" actually means</h2>

<p>Most free wedding website builders fall into one of three categories.</p>

<p><strong>Free with ads.</strong> The wedding website is free, but the platform shows ads on the page. Sometimes wedding-related ads, sometimes random ones. The day before her wedding, a friend of ours discovered the page was showing ads for funeral services.</p>

<p><strong>Free with limits.</strong> The free tier covers a basic page with the names, the date, and a contact email. Anything useful — the RSVP form, the menu choices, the gallery — costs extra. By the time you add what you actually need, the "free" page has become a 30-40€ subscription.</p>

<p><strong>Free as a loss leader.</strong> The platform gives the wedding website away for free, but tries to upsell you a paid wedding planner subscription, photo book service, gift list, or honeymoon registry. The wedding website is bait for a longer funnel. If you are happy with the upsell, fine. If not, the experience feels pushy.</p>

<h2>What you actually pay for</h2>

<p>A paid wedding website like ours costs 49€, one time, no subscription. What you get for that:</p>

<ul>
  <li>A clean URL with no ads of any kind</li>
  <li>An RSVP form with menu choices and dietary tracking</li>
  <li>A private dashboard where you see the responses in real time</li>
  <li>The gallery for after the wedding</li>
  <li>Custom colours, typography, and one of four templates</li>
  <li>A wedding website that stays online for years, not until a free trial expires</li>
</ul>

<p>49€ is roughly the cost of one paper invitation for ten guests. It is also less than what most couples spend on the bouquet ribbons. In wedding budget terms, it is invisible.</p>

<h2>When free actually makes sense</h2>

<p>We are not going to pretend free is always wrong. There are situations where a free option is the right call.</p>

<p><strong>You have a guest list of under 20 people.</strong> If you are doing a tiny ceremony with the immediate family, you do not need an RSVP form, you do not need a menu chooser, you do not need a gallery. A free page with the date and the venue is enough. Send it, done.</p>

<p><strong>The wedding is in less than two weeks.</strong> If you are eloping or organising a quick reception, a free wedding website skips the payment step and the configuration. The trade-off is clear: less customisation, but you do not need it.</p>

<p><strong>You are testing an idea.</strong> Some couples build a free draft to see if the format works for them, then publish a paid version a few days later. The free draft is a sandbox, not the real invitation.</p>

<h2>When paid is the right move</h2>

<p>If any of these apply, paid is going to save you more than 49€ in stress, time and embarrassment.</p>

<p><strong>Your guest list is above 30 people.</strong> Tracking RSVPs on a spreadsheet stops working at around 30 guests. The platform's RSVP form replaces the spreadsheet and the chase emails.</p>

<p><strong>You need menu choices.</strong> Free wedding websites rarely include menu management. You will end up tracking dietary preferences in WhatsApp screenshots, which is exactly the situation you wanted to avoid.</p>

<p><strong>You care about how it looks.</strong> Free templates usually look free. Wedding photos and your personal taste deserve a presentation that does not scream "made on a free website builder".</p>

<p><strong>You will share the URL with people you want to impress.</strong> Parents, in-laws, witnesses, employer. The first impression of the wedding is the website. Make it count.</p>

<h2>The hidden costs of free</h2>

<p>Free is rarely free. The costs you do not see in the price tag:</p>

<p>Time. Free builders are built for the casual user, which means there is no support, no documentation, and no human to call when something breaks. You spend three hours figuring out why the date is showing in the wrong format.</p>

<p>Lock-in. Some free platforms add their branding to the URL or to the page header. You cannot remove it without paying. By the time you decide to upgrade, you have already shared the link with 80 guests.</p>

<p>Reliability. The free tier has lower uptime guarantees than the paid one. Two years from now, when you want to show your wedding photos to your in-laws, the page might be gone.</p>

<h2>The bottom line</h2>

<p>If you are doing a small wedding, free works. If you are doing a wedding with 30+ guests and you want the RSVP, the menu, the gallery, the directions and a clean URL that lasts, the 49€ of a paid wedding website is among the cheapest things on the wedding budget.</p>

<p>You can <a href="/create">try our wedding website builder for free</a> — the preview costs zero, you only pay when you publish. So you can compare it to the free options on its own terms before deciding.</p>
`;

const EN_GUEST_LIST_ONLINE = `
<p>The wedding guest list starts as a piece of paper on the kitchen table with two columns and twenty names. Three weeks later, it is a Google Sheet with sixteen tabs, four duplicates, two arguments about plus ones, and a cousin nobody can remember inviting. There is a better way.</p>

<p>This is how we recommend managing the wedding guest list online without spreadsheets, scaling cleanly from 20 to 200 people.</p>

<h2>Why spreadsheets stop working at 30 guests</h2>

<p>A spreadsheet is great for the first iteration. You start with the obvious names, you add as you go, you cross things out. Then someone replies on WhatsApp, you forget to update the sheet, the sheet is now wrong. You add a column for "RSVP status", another for "dietary needs", another for "plus one yes/no". Now the sheet has 14 columns and you cannot read it on a phone.</p>

<p>The break point is around 30 guests. Below that, a spreadsheet works. Above, every change becomes a tax on your time and an opportunity to introduce errors.</p>

<h2>What a guest list dashboard does instead</h2>

<p>An online guest list inside the wedding website does the same thing as a spreadsheet — list of names, RSVP status, dietary needs, plus ones — but with three big differences.</p>

<p>It updates itself. When a guest fills the RSVP form, the entry appears in the dashboard with the date, the menu choice and the message. You do not type anything.</p>

<p>It is sortable and filterable. Show only the confirmed guests, only the vegetarians, only the kids, only the ones who replied late. With one click. Spreadsheets can do this in theory but in practice nobody filters their wedding sheet.</p>

<p>It is exportable. When the venue asks for the final headcount in a CSV, you click export. Done in five seconds.</p>

<h2>Plus ones: the real source of family drama</h2>

<p>Plus ones are where most guest list arguments happen. Some couples allow them by default, others restrict them, others negotiate case by case. Whatever you decide, the rule should be set in the form, not in your head.</p>

<p>If you allow plus ones, the form has a toggle plus a name field. If the toggle is on, the guest adds the plus one's name. The dashboard shows you both names and counts them as two seats.</p>

<p>If you do not allow plus ones, the toggle is hidden. Guests cannot add a plus one. They might still ask you on WhatsApp, but at least the official answer is "the form does not allow it" — which is easier to defend than "we said no to your face".</p>

<p>For the awkward middle ground (some guests yes, others no), the trick is to set the rule per guest before you send the invitation. The platform lets you pre-create guest entries with plus-one allowed or not, and the link you send each one knows the answer in advance.</p>

<h2>Dietary tracking without WhatsApp screenshots</h2>

<p>Dietary preferences in a spreadsheet are a nightmare. People send you WhatsApp messages with "vegetarian", "no nuts", "lactose intolerant but I can have small amounts of cheese", and you copy-paste them into a row that will be unreadable in a week.</p>

<p>The form solves this with a dropdown of menu options (matching the categories your venue offers) plus a free text field for allergies. Each row in the dashboard shows the menu choice and the allergy notes side by side. You filter by category to give the catering team a clean count.</p>

<p>For the wedding day, you can print one page per table with the names, menu choices and allergies, sorted by seat. The catering team gets exactly what they need, no spreadsheets to interpret on the fly.</p>

<h2>The chase list (and how to keep it kind)</h2>

<p>Every wedding has guests who do not reply. Some forgot, some are conflict-averse, some genuinely lost the link. By the time the deadline passes, you have a chase list of 5 to 15 people.</p>

<p>The dashboard shows you exactly who has not replied yet. Send them one friendly message — short, no guilt-tripping, just "the venue needs the final number tomorrow, can you let us know?". Most of them reply within a day. The ones who do not, you mark as "not coming" and move on.</p>

<p>Avoid the temptation to send a reminder to everyone "just in case". You will annoy the guests who already replied, and you will make the guests who have not feel cornered. Targeted reminders work; mass reminders backfire.</p>

<h2>The day before the wedding</h2>

<p>Twenty-four hours before the wedding, the dashboard becomes the source of truth. You print the seating chart, the menu choices per table, and the allergy notes. The venue gets one final headcount export. You stop worrying.</p>

<p>Anything that arrives after that point — late confirmations, sudden cancellations, a cousin showing up with an uninvited friend — is handled in person, not in the system. The dashboard's job is done.</p>

<h2>Set it up in one afternoon</h2>

<p>The whole guest list dashboard is included in any wedding website on <a href="/create">Wedding30s</a>. You build the page in five minutes, the RSVP form is live, the dashboard fills itself as guests reply. No spreadsheets, no copy-paste, no WhatsApp screenshots. 49€ one time, no subscription.</p>

<p>If you are six months out from the wedding and you have not started managing the guest list, today is the day. Open the wizard, fill in the basics, share the link with your closest five guests as a test. By the end of the week, you will know exactly who is in.</p>
`;

const EN_SAVE_THE_DATE = `
<p>The Save the Date is supposed to be the easy part of wedding planning. You announce the date, people put it in the calendar, you go back to dealing with the venue. In practice, most couples spend two weeks deciding what format to use, send the announcement late, and end up with three guests who book conflicting trips because the message got lost in a WhatsApp group of 80 people.</p>

<p>Here is the honest comparison of the three formats actually working in 2026: email, WhatsApp, and the wedding website link.</p>

<h2>Email</h2>

<p>Email is the format your parents expect you to use. It is also the one your guests are least likely to read.</p>

<p>The open rate of personal emails between friends in 2026 is somewhere around 30 to 40%. Wedding-related emails do better — closer to 60% — but that still leaves a third of your guests who do not see the message in the first three days. By the time they open it, the date is already buried in their inbox.</p>

<p>The case for email: it works for older relatives who do not use WhatsApp, it gives you a record of who you sent it to, and the message format allows for a longer announcement with more context. The case against: it feels formal in a way that does not match the rest of modern wedding communication.</p>

<p>Use email if your guest list includes people who are over 65 and who you know read their inbox daily. For everyone else, there are better options.</p>

<h2>WhatsApp</h2>

<p>WhatsApp is the default in most countries where weddings happen at scale. It is fast, it is read within the hour, it allows for a quick reply, and it does not feel awkward.</p>

<p>The problem with WhatsApp is that the message disappears the moment another conversation pushes it down. Three days after the announcement, half your guests cannot find the date because they did not save it, and they are not going to scroll up through 800 messages to look.</p>

<p>The trick that works: send the WhatsApp announcement as a single short message with one clear thing — the date — and one link to where guests can read the full details. That way, the WhatsApp message is the announcement, and the link is the reference they can come back to whenever they need it.</p>

<p>Avoid sending the Save the Date as a long WhatsApp message with the venue, the menu, the parking and the gift list. Nobody reads paragraphs in a chat. The message gets ignored, and you end up answering the same five questions individually.</p>

<h2>The wedding website link (the right answer)</h2>

<p>The format that works in 2026 is a hybrid: send a short WhatsApp message (or email, for the older relatives) with one sentence and one link. The link points to the wedding website, where the full details live and update over time.</p>

<p>The first version of the website only needs three things: the names, the date, and a "more details coming soon" line. You build it in five minutes, you publish it, you share the link. As you confirm the venue, the menu and the programme, you update the page. Guests who already saved the link see the updates whenever they visit.</p>

<p>This solves the disappearing-message problem of WhatsApp and the formality problem of email at the same time. The WhatsApp message is the alert ("we are getting married, save the date, full details here"), the wedding website is the source of truth ("here is everything we know so far").</p>

<h2>What goes in the first version of the website</h2>

<p>The Save the Date version of the website needs less than the final invitation. Five things are enough.</p>

<ol>
  <li>Both names, in the hero</li>
  <li>The date, big and clear</li>
  <li>The city or region (you do not need the exact venue yet)</li>
  <li>One photo of the two of you</li>
  <li>A "we will share more details soon" line at the bottom</li>
</ol>

<p>That is it. No RSVP yet, no menu, no programme. Those come later, when the venue is locked and the budget is clear. The Save the Date is just the heads-up: this is happening, mark the calendar.</p>

<h2>Timing</h2>

<p>Send the Save the Date six to twelve months before the wedding. Earlier than that, guests forget. Later than that, you risk people booking other plans before they have your date.</p>

<p>For destination weddings, send it nine to twelve months ahead — guests need time to plan flights, accommodation and time off work. For local weddings, six to eight months is fine. For weddings happening in the busy June-September window, lean towards the longer end.</p>

<h2>The follow-up message</h2>

<p>Two months after the Save the Date, send a quick follow-up: "Hey, just a reminder — our wedding is on date X, and we will be sending the full invitation in a few weeks. The latest details are at wedding30s.com/your-names." Two sentences, no formality, just a nudge.</p>

<p>This works because it reminds people without asking anything from them. The full invitation comes a few weeks later with the RSVP, and by then the date is already in their head.</p>

<h2>Build the first version today</h2>

<p>If you are reading this and you have not announced the date yet, the fastest way to do it is to <a href="/create">build the wedding website now</a>. Five minutes of setup, you only pay 49€ when you publish, and the link works as the anchor for every other communication you send between today and the wedding.</p>

<p>The Save the Date is the easy part. Make it easier.</p>
`;

const EN_MENU_SELECTION_ONLINE = `
<p>"What menu would you like for our guests?" is one of the questions venues ask early in the planning, and the answer becomes a logistical headache about three months later when it is time to gather everyone's choices. Most couples handle it badly, not because they are disorganised, but because the tools they use are not built for it.</p>

<p>Here is the realistic way to manage online wedding menu selection in 2026, including the small details that decide whether the catering team thanks you or curses you on the wedding day.</p>

<h2>The two ways venues handle menus</h2>

<p>Most wedding venues offer one of two menu structures, and your tools should match whichever one yours uses.</p>

<p><strong>Fixed menu, no choices.</strong> Everyone gets the same starter, main and dessert. Easy. The only thing you need to track is allergies and intolerances, not preferences.</p>

<p><strong>Multi-choice menu, guests pick.</strong> The venue offers two or three options for the main course (meat / fish / vegetarian, sometimes vegan), and you need to give them the count of each one before the wedding.</p>

<p>If you are in the second case — and most couples are — you need a system to collect the choices, summarise them, and hand the venue a clean count. A spreadsheet works for 20 guests. It stops working at 50.</p>

<h2>The form fields that matter</h2>

<p>The menu section of the RSVP form should have exactly two fields. Anything more and guests start dropping off.</p>

<p><strong>Menu choice (dropdown).</strong> A clean dropdown with the categories your venue offers. Three to five options. Each option has a clear name and, ideally, a one-line description: "Beef tenderloin with roasted vegetables", not just "Meat option".</p>

<p><strong>Allergies and intolerances (free text).</strong> A single text field where guests type whatever the catering team needs to know. "Lactose intolerant, can have small amounts of butter" is the kind of detail that saves the venue a phone call.</p>

<p>That is it. Do not add "I love spicy food" or "I prefer cooked vegetables". Catering teams cannot personalise individual plates that finely, and the more questions you ask, the more guests skip the menu section entirely.</p>

<h2>Kids and special menus</h2>

<p>If you are offering a kids menu, treat it as a separate option in the dropdown, not a checkbox somewhere else. Parents need to choose it explicitly: "Kids menu (under 12)". Some venues also offer a "light menu" or a "vegan menu" — same rule, separate option.</p>

<p>The trap to avoid: assuming all kids automatically get the kids menu. Some 11-year-olds want the adult main, some 4-year-olds need to be tracked separately because the kitchen handles them differently. Let the parent choose.</p>

<h2>What to show the venue</h2>

<p>Two days before the wedding, the venue asks you for the final menu count. They want a number per category, not a list of names. The dashboard should give you that count with one click — group by menu choice, sum, done.</p>

<p>Some venues also want the names per table, with allergies. For that, you generate a per-table sheet showing each guest, their menu choice, and the allergy notes. The catering team uses that sheet on the day to know what plate goes where.</p>

<p>Both views — the count and the per-table sheet — are built into <a href="/create">Wedding30s</a> by default. You filter, you export, you send the file to the venue. Five minutes of work the day before the wedding.</p>

<h2>The "I will decide on the day" guest</h2>

<p>You will have at least one. The guest who fills the RSVP, marks "attending", and leaves the menu choice empty with the implicit assumption that they will decide on the day.</p>

<p>This is a problem because catering teams need the count in advance to order the food. The solution is built into the form: make the menu choice mandatory if "attending = yes". Guests cannot submit the form without picking a menu. They will pick something, even if they end up swapping it on the day.</p>

<p>For the rare case where someone genuinely does not know, add a default option called "I'll go with the recommendation" and pre-assign it to the most popular dish. The venue can plan around that, and the guest gets a plate they did not have to think about.</p>

<h2>Common mistakes</h2>

<p><strong>Asking for menu choices before the menu is final.</strong> If the venue is still tweaking the dishes a month before the wedding, do not push the menu form to guests yet. Wait until the menu is locked, then send it. Guests who already RSVP'd can come back and update their choice.</p>

<p><strong>Mixing the menu choice with other questions.</strong> Some couples bundle the menu with "favourite song", "preferred drink", "do you need a chair lift". Each extra question lowers the completion rate. Keep menu and song requests separate, on different sections of the page if you must include both.</p>

<p><strong>Not telling guests when the menu choice closes.</strong> Set a clear deadline (typically the same as the RSVP deadline, three weeks before the wedding) and show the countdown on the page. Most guests respond to time pressure better than to friendly reminders.</p>

<h2>The 49€ that prevents the headache</h2>

<p>You can build all of this in a spreadsheet plus WhatsApp screenshots plus a manual count on the day. You can also <a href="/create">use a wedding website builder that handles it by default</a>, for 49€ one time, and spend the saved hours on something that matters more — like writing your vows.</p>

<p>The menu selection is one of the small unglamorous tasks of wedding planning that decides whether the day feels organised or chaotic. The tool you pick to handle it makes more difference than the dish you pick to serve.</p>
`;

const EN_PHOTO_GALLERY_QR = `
<p>One of the most underrated parts of a wedding website is the part nobody builds before the wedding: the photo gallery for the day after. Couples spend weeks designing the invitation page and then forget that the same URL is going to host hundreds of photos that guests will share with each other for years.</p>

<p>This is how to set up a wedding photo gallery that lives on the wedding website, collects photos from guests automatically, and uses a QR code on the day so nobody needs to download an app.</p>

<h2>Why an app is the wrong answer</h2>

<p>You will see a lot of "wedding photo sharing apps" advertised online. Most of them follow the same pattern: guests download an app on the day, sign up with email, find the wedding by code, upload photos. The flow has six steps and a dozen friction points. The result is that 30% of guests upload photos and 70% give up.</p>

<p>The reason is simple. Guests at a wedding are wearing tight clothes, have one hand holding a drink, and are surrounded by people they have not seen in years. Asking them to install an app, sign up, find the right wedding and learn a new interface is asking too much.</p>

<p>The format that actually works in 2026 is a QR code on the table, a wedding website URL, and a photo upload form that works on the first tap with no signup.</p>

<h2>The QR code on the table</h2>

<p>You print a small card (or a stand) with one QR code and one line of text: "Scan to share your photos". The QR code opens the photo upload page of the wedding website. The guest takes a photo, taps upload, done.</p>

<p>The whole flow is three taps, no signup, no app, no friction. Older guests who do not normally use QR codes follow the others — once one person at the table figures it out, the rest copy.</p>

<p>Print the card on the same paper as the menu cards. Put one on each table. Some couples also leave a stack at the bar and the entrance for guests who are not at a table at the moment they want to share a photo.</p>

<h2>What gets uploaded vs what you keep</h2>

<p>Guest photos are great because they capture moments the official photographer misses — the spontaneous reactions, the dance floor shots, the kids running around, the late-night chaos. They are also unfiltered, which means some of them will be blurry, badly framed, or show people with their eyes closed.</p>

<p>The wedding website should accept everything and let you decide what to keep later. A "moderation" view in the dashboard shows you all uploaded photos and lets you approve, hide or delete. Approved photos appear in the public gallery. Hidden ones stay in your private dashboard for memory's sake.</p>

<p>The rule we see working: approve generously. Even bad photos have a story. Three years from now, the blurry shot of your uncle dancing badly is going to be funnier than the perfect studio portrait.</p>

<h2>The "photo of the day" feature</h2>

<p>One small touch that works well: after the wedding, you pick one guest photo per day for the first month and feature it at the top of the gallery. Guests get a notification when their photo is featured. The engagement spike is real — they share the link again, and the wedding website gets a second wave of visitors.</p>

<p>Some couples turn this into a small game. The guest whose photo is featured the most times gets a prize (a bottle of wine, a thank-you card, whatever fits the budget). It is a nice excuse to extend the wedding day into the weeks after.</p>

<h2>Privacy: who sees what</h2>

<p>Wedding photos are personal. The default setting on a wedding website should be that the gallery is only visible to people who have the link, not indexed by search engines. Anyone you sent the wedding website to can see the gallery. Anyone Googling your names cannot.</p>

<p>For couples who want extra privacy — typically those with public-facing jobs or who have guests with privacy concerns — you can set the gallery to require a password. The password lives in the wedding website, the URL is shared as before, but the gallery section asks for a code before showing photos. Less convenient, more private.</p>

<h2>What happens to the photos a year later</h2>

<p>The photos stay on the wedding website. The URL keeps working. You can come back five years from now and the gallery is still there, in the same place, with the same photos. This is the part that surprises couples the most: a wedding website is not a one-day thing. It is a permanent record of the day, with the photos, the menu, the messages from guests, the program.</p>

<p>We have couples who built their wedding website on Wedding30s in 2024 and still send the link to people they meet who ask "how was the wedding?". The 49€ one-time cost makes it possible to keep the website running indefinitely without a subscription.</p>

<h2>Set it up in one click</h2>

<p>The photo gallery, the QR code generator, the moderation view and the privacy settings are all included in <a href="/create">Wedding30s</a> by default. You build the wedding website in five minutes, you print the QR card the week before the wedding, and the gallery fills itself on the day.</p>

<p>If you are reading this with the wedding still weeks away, today is a good day to print the QR cards. If you are reading it the day after the wedding, you can still set up the gallery now and ask guests to upload retroactively. Most will, especially the ones who took the most photos.</p>
`;

const EN_ETIQUETTE = `
<p>"What should I include on the wedding website?" is the question that stalls most couples between deciding to build one and actually publishing it. The honest answer is shorter than people expect: a wedding website needs five things, and everything else is optional and often a mistake.</p>

<p>Here is what to include on a wedding website in 2026, and the things you should skip even though every wedding blog tells you to include them.</p>

<h2>The five things you actually need</h2>

<p><strong>Names, date, venue.</strong> The hero of the page. Big, clear, readable in two seconds on a phone screen. If a guest opens the page and cannot answer "who, when, where" without scrolling, the page is broken.</p>

<p><strong>RSVP form with menu choices.</strong> One form, three to five fields, no signup required. This is where the wedding website earns its keep — every other format (paper, email, WhatsApp) makes RSVP collection harder than it needs to be.</p>

<p><strong>Directions to the venue.</strong> A map embed, the address in plain text, and a link to Google Maps. Some couples add the parking instructions if the venue is tricky. That is enough.</p>

<p><strong>Programme.</strong> Three to five lines: ceremony at 17:00, cocktail at 18:30, dinner at 20:00, dancing from 23:00. Do not write a minute-by-minute schedule. Guests need to know when to arrive and when to leave, not when the second course is served.</p>

<p><strong>A short story about you two.</strong> Two paragraphs, three at most. How you met, when you decided to get married, what you are looking forward to. Not a memoir, just enough that a guest who only knows one of you gets a sense of the other.</p>

<p>Five things. That is the whole wedding website. Everything else is optional, and most of it is a mistake.</p>

<h2>The things to skip</h2>

<p>Here is what wedding blogs and Pinterest tell you to include that you should not.</p>

<p><strong>The "love story" timeline with photos from every year of the relationship.</strong> Cute idea, almost nobody scrolls through it. The story belongs in two short paragraphs in the centre of the page, not in a horizontal slider with twelve photos.</p>

<p><strong>The detailed playlist of the wedding music.</strong> Guests do not care what songs are playing during the cocktail. The DJ knows the playlist; the website does not need it.</p>

<p><strong>The hashtag instructions.</strong> If you want a hashtag, mention it once at the bottom of the page. Do not dedicate a section to "How to use #SaraAndMike2026 on Instagram". Guests who use hashtags know how. Guests who do not are not going to start.</p>

<p><strong>The list of vendors with logos.</strong> The florist, the DJ, the photographer, the caterer. This is something the wedding industry recommends because it gets vendors free advertising. Your guests do not care.</p>

<p><strong>The page about the bridal party.</strong> "Meet the bridesmaids" with photos and bios is fine if your wedding website is a fan club. For a wedding invitation, it is filler.</p>

<p><strong>The gift registry as the main attraction.</strong> Some couples make the registry the second-most prominent section of the page. It feels off. The registry should be a small footer link, not a hero section.</p>

<h2>What to do with the gift registry question</h2>

<p>The gift registry is the most controversial element of a wedding website. Some cultures expect it as the centrepiece. Others find it tacky to mention at all. The middle path is what most couples land on: a small section near the bottom of the page with one line and one link.</p>

<p>"We are not expecting gifts, but if you would like to contribute to our honeymoon, you can do it here." Done. Two sentences, one link. No need for product photos, no need for a list, no need for an explanation.</p>

<p>If you are doing a traditional registry, the same rule: one line, one link, not a hero section.</p>

<h2>Dress code</h2>

<p>Include the dress code if it is not obvious from the venue. "Cocktail attire", "smart casual", "garden-friendly shoes" — one line, no photo examples. Guests can Google what cocktail attire looks like; they do not need a Pinterest board.</p>

<p>Skip the dress code section entirely if your wedding is "wear what you want" or if the venue makes it self-explanatory (a beach wedding does not need a dress code section).</p>

<h2>Children</h2>

<p>If your wedding is adults-only, say it once on the page, near the RSVP. Direct, no apology, no long explanation. "Our wedding is an adults-only celebration. We hope you can join us." Three sentences max.</p>

<p>The mistake is dedicating a whole section to it with reasons. You do not need to justify the decision. Guests respect the line, parents make childcare arrangements, life goes on.</p>

<h2>What about FAQ sections?</h2>

<p>FAQ sections look organised but read like contracts. Most "wedding FAQ" pages list questions like "Can I bring a plus one?" and "Where can I park?" — questions that should be answered earlier on the page, not relegated to a section nobody reads.</p>

<p>If you find yourself writing a FAQ, the page is wrong. Move the answers to the relevant sections (plus ones in the RSVP, parking in the directions) and delete the FAQ.</p>

<h2>Less is more, every time</h2>

<p>The best wedding websites we see are short. Names, date, venue, RSVP, directions, programme, story. Six sections, each one short. The whole page reads in three minutes on a phone, the guest replies in another minute, and they remember the wedding details because there is nothing else competing for their attention.</p>

<p>The worst wedding websites are the ones that try to be everything: a love story, a vendor list, a song timeline, a fashion guide, a FAQ, a photo gallery from the engagement, a countdown, and a map. The page takes ten minutes to read and the RSVP gets buried under filler.</p>

<p>If you want the short version: <a href="/create">build a wedding website in five minutes</a>, fill in the five things you actually need, publish, and resist the temptation to add more. The discipline is the design.</p>
`;

// ============================================================================
// ES cluster — same topics, paired via translatedSlug
// ============================================================================

const ES_DIGITAL_INVITATION_IDEAS = `
<p>Las invitaciones de papel siguen siendo bonitas. También cuestan entre dos y cinco euros por invitado, tardan tres semanas en imprimirse y enviarse, y dejan de servir en cuanto necesitas cambiar el lugar o la hora. Cada vez más parejas las están dejando atrás por formatos que viven online — y no solo es por ahorrar dinero.</p>

<p>Aquí van doce formatos de invitación de boda digital que están funcionando en 2026, con los pros y contras de cada uno y cuándo tiene sentido elegirlos.</p>

<h2>1. La web de boda en una sola página</h2>

<p>Una URL clara como <code>wedding30s.com/sara-y-miguel</code> con todo en un único scroll: foto, fecha, ubicación, vuestra historia, programa, RSVP, cómo llegar y menú. Sin login. Los invitados abren el enlace, lo leen en el móvil en dos minutos, confirman sin pensar.</p>

<p>Es el formato que recomendamos por defecto en Wedding30s, porque cubre lo que el 90% de las parejas necesitan sin obligar a los invitados a aprender nada nuevo. La pega: una web de boda vive para siempre en la misma URL, así que elegid el slug con calma.</p>

<h2>2. El código QR en una tarjeta de papel</h2>

<p>Imprimís una tarjeta pequeña (o un imán de nevera) con un único código QR que abre la web de boda. Combina la sensación de regalo físico con la comodidad de un enlace.</p>

<p>Es el compromiso más habitual que vemos: el 70% del coste de una invitación de papel y el 100% de la funcionalidad digital. La trampa es probar el QR antes de imprimir — hemos visto parejas imprimir un QR que apuntaba a un 404.</p>

<h2>3. La invitación animada</h2>

<p>Una animación corta que se comparte por WhatsApp o como story. Los nombres aparecen, la fecha flota, el lugar se desvanece. Más ligera que un vídeo, más memorable que una imagen estática.</p>

<p>Va bien para parejas que quieren algo divertido. Funciona como teaser, pero siempre debería enlazar a una web de boda completa donde los invitados puedan confirmar — la animación sola no recoge respuestas.</p>

<h2>4. La página de RSVP interactiva</h2>

<p>Los invitados confirman asistencia, eligen menú (con alergias), dicen si traen acompañante y dejan un mensaje. Vosotros veis cada respuesta en tiempo real en un panel privado.</p>

<p>Cualquier boda con más de 30 invitados se beneficia de esto. Llevarlo en una hoja de cálculo funciona durante un tiempo, hasta que alguien contesta dos veces o se le olvida mencionar que es vegetariano y el sistema se rompe. La página de RSVP interactiva sustituye ese caos por un único formulario.</p>

<h2>5. La invitación en forma de playlist de Spotify</h2>

<p>Compartís una playlist de Spotify como invitación, con la portada modificada con los datos de vuestra boda. Los invitados pueden añadir sus propias canciones para la pista de baile.</p>

<p>Es más un teaser que una invitación completa — los invitados siguen necesitando un sitio donde confirmar — pero es un extra que cuesta cero y cuenta algo de los dos.</p>

<h2>6. La invitación como story de Instagram</h2>

<p>Una story de tres frames en vuestra cuenta privada, con un sticker de enlace que apunta a la web de boda. Los invitados tocan, ven la página, confirman.</p>

<p>El problema es obvio: las stories desaparecen en 24 horas. Casi todas las parejas que la eligen también mandan un seguimiento por WhatsApp al día siguiente. Usadla como anuncio, no como invitación principal.</p>

<h2>7. Páginas personalizadas para los VIP</h2>

<p>Una web de boda general para todo el mundo, más unas cuantas páginas personalizadas para padres, padrinos y amigos cercanos con un mensaje privado arriba.</p>

<p>Es un detalle pequeño que hace que los invitados importantes se sientan diferentes. Hemos visto parejas escribir cinco líneas para cada VIP y tardar menos de una hora en total.</p>

<h2>8. La web de boda bilingüe</h2>

<p>Una sola web de boda con dos versiones de idioma, perfecta para parejas internacionales o para bodas con invitados de varios países. Los invitados eligen el idioma arriba.</p>

<p>Si la mitad de la familia habla español y la otra mitad inglés, este es el único formato que no deja a nadie leyendo un WhatsApp traducido. Las dos versiones tienen que mantenerse sincronizadas, pero el constructor de webs se encarga de eso por vosotros.</p>

<h2>9. La web de boda con cuenta atrás</h2>

<p>La web incluye una cuenta atrás en directo. Algunas parejas revelan contenido nuevo según se acerca la fecha — el menú en la semana menos ocho, el programa en la menos cuatro, los detalles del aparcamiento en la menos uno.</p>

<p>Funciona bien para bodas de destino, donde los invitados necesitan planificar vuelos y alojamiento por fases. El riesgo es soltar todo de golpe y perder el efecto goteo.</p>

<h2>10. La página ilustrada</h2>

<p>Una ilustración personalizada del lugar o de la pareja como imagen principal de la web. Se siente personal, envejece bien en fotos y capturas.</p>

<p>Presupuesto: entre 80 y 300 euros por una ilustradora freelance en Fiverr o Behance, más seis semanas de plazo. Vale la pena si pensáis usar la misma ilustración en las cartas de menú y en las notas de agradecimiento.</p>

<h2>11. La invitación que abre con un mapa</h2>

<p>La web de boda abre con un mapa del lugar, con la fecha y los nombres superpuestos. Útil para bodas de destino o para sitios difíciles de encontrar.</p>

<p>Funciona como héroe de la página, no como única cosa en ella — los invitados aún necesitan bajar al RSVP y al menú. Hemos visto parejas tratar el mapa como una mini-función dentro de la página, no como la puerta de entrada.</p>

<h2>12. La web de boda completa (la apuesta segura)</h2>

<p>Si solo podéis elegir un formato, elegid este. URL clara, foto principal, fecha, lugar, formulario de RSVP, menú, programa y galería para después de la boda. Funciona en cualquier móvil, cualquier navegador, sin app.</p>

<p><a href="/create">Podéis montar la vuestra en cinco minutos</a> con nuestro asistente. Elegís plantilla, ponéis vuestros nombres, subís una foto y la web está lista para compartir. Solo pagáis (49€, una vez) cuando publicáis.</p>

<h2>¿Cuál elegir entonces?</h2>

<p>Si estáis leyendo esto con menos de seis meses para la boda y una lista de más de 30 invitados, elegid la opción 12 y añadid la 4 (RSVP interactivo). Eso cubre el lado práctico de invitar a gente sin hojas de cálculo ni emails de seguimiento.</p>

<p>Si tenéis más tiempo y una lista más reducida, las opciones 7 y 11 añaden un toque personal que los invitados recuerdan. Y si sois una pareja internacional, la 8 no es opcional.</p>

<p>Sea cual sea la opción que escojáis, la regla que importa es esta: cualquier invitado, sea cual sea su edad o cuán cómodo se sienta con el móvil, debería poder leer la invitación y responder en menos de dos minutos. Si vuestro formato pasa esa prueba, funciona.</p>
`;

const ES_HOW_TO_CREATE_5_MIN = `
<p>La mayoría de los consejos sobre planificar una boda asumen que tenéis un sábado entero libre y la paciencia de un santo. Montar la web de boda es una de las pocas tareas donde eso no es verdad: la parte técnica puede llevar cinco minutos si la herramienta está pensada para ello, y la parte de contenido otros veinte si tenéis los datos a mano.</p>

<p>Este es el camino exacto que recomendamos si empezáis desde cero hoy.</p>

<h2>Antes de abrir el asistente</h2>

<p>Tened estas ocho cosas apuntadas en una nota del móvil o en un papel. Son los únicos datos que la web de boda necesita para estar lista para publicar.</p>

<ol>
  <li>Vuestros dos nombres, en el orden que queráis que aparezcan</li>
  <li>La fecha de la boda</li>
  <li>La dirección completa del lugar (o dos direcciones si la ceremonia y el banquete están en sitios distintos)</li>
  <li>Una foto de los dos que os guste de verdad</li>
  <li>Un email donde los invitados puedan escribiros si tienen dudas</li>
  <li>Las opciones de menú que vais a ofrecer (carne / pescado / vegetariano / vegano)</li>
  <li>Una historia corta de dos líneas sobre cómo os conocisteis, o solo una frase — cualquier cosa es mejor que dejarlo en blanco</li>
  <li>La fecha límite para confirmar (recomendamos tres semanas antes de la boda)</li>
</ol>

<p>Cinco minutos de preparación aquí ahorran veinte minutos de ir y venir dentro del asistente. De verdad.</p>

<h2>Paso 1: Elegir plantilla (60 segundos)</h2>

<p>Abrid <a href="/create">el asistente</a>. Veréis cuatro plantillas: Classic Garden, Romantic Blush, Modern Dark y Minimal White. Todas tienen la misma estructura por debajo — lo que cambia es la paleta de colores y la tipografía.</p>

<p>Elegid la que sintáis más cercana al lugar. Si vuestra boda es al aire libre en mayo, Classic Garden es difícil de superar. Si tenéis un banquete de noche en un hotel, Modern Dark queda más adulto. No hay respuesta incorrecta — podéis cambiarla luego en tres clics.</p>

<h2>Paso 2: Nombres, fecha, lugar (90 segundos)</h2>

<p>Rellenad los cuatro campos obligatorios. El asistente os enseña una previsualización en directo mientras escribís, así que veis los nombres apareciendo en la portada exactamente como los van a ver vuestros invitados. Si queréis cambiar el "y" por un "&", hacedlo ahora y dejad de darle vueltas.</p>

<p>Para el lugar, pegad el enlace de Google Maps. El asistente extrae la dirección automáticamente e incrusta el mapa al final de la página. Los invitados verán cómo llegar dentro de la propia web, sin tener que copiar y pegar nada.</p>

<h2>Paso 3: Subir la foto (60 segundos)</h2>

<p>Una foto de los dos. No cinco, no diez — una. La portada de la web es la foto que todo el mundo ve primero, y la regla es la misma que en una app de citas: la mejor foto se lleva el 80% de la primera impresión.</p>

<p>No tiene que ser profesional. Hemos visto webs de boda hechas con un selfie del móvil que quedan genial porque la pareja sale feliz. Si tenéis una foto del compromiso, mejor todavía. Soltadla en el asistente, recortadla dentro, listo.</p>

<h2>Paso 4: Programa y opciones de menú (90 segundos)</h2>

<p>El programa es solo una lista: ceremonia a las 17:00, cóctel a las 18:30, cena a las 20:00. Tres líneas son suficientes. Los invitados necesitan saber cuándo llegar y cuándo empieza la cena, no el desglose minuto a minuto.</p>

<p>Las opciones de menú importan más que el programa. Elegid las categorías que vais a ofrecer y el asistente las añade al formulario de RSVP para que los invitados marquen su elección. Si el lugar ofrece cuatro platos, listad cuatro. Si es un buffet, podéis saltaros este paso entero y poner "menú buffet, todas las dietas cubiertas" en las notas del lugar.</p>

<h2>Paso 5: Vista previa, compartir, publicar (40 segundos)</h2>

<p>El botón de vista previa os muestra exactamente lo que verán los invitados. Abridla en el móvil — ahí es donde el 90% de los invitados van a leerla. Si algo se ve raro, ajustadlo. Toda la web vive detrás de una sola URL.</p>

<p>Podéis compartir el enlace de la vista previa con vuestra pareja, vuestros padres, cualquiera de quien queráis opinión, antes de pagar. Recomendamos un periodo de enfriamiento de 24 horas: la montáis, la enseñáis a dos personas de confianza, dormís sobre ello, publicáis al día siguiente. El coste de esperar es cero. El coste de publicar con un typo y luego tener que actualizar después de que cien personas ya tengan el enlace es real.</p>

<p>Cuando estéis listos, pulsáis publicar. El pago de 49€ se hace por Polar (una vez, sin suscripción, sin trampas), y la web sale online en la URL que hayáis elegido. Listo.</p>

<h2>Lo que se puede cambiar después de publicar</h2>

<p>Casi todo. Programa, menú, historia, fotos, galería, opciones de menú, incluso la plantilla — todo vive en vuestro panel privado. La URL no cambia, así que los invitados nunca tienen que actualizar nada por su lado.</p>

<p>Lo que no se puede cambiar después de publicar es el slug — la parte de la URL que va después de wedding30s.com/. Elegidlo con cabeza al construir la página. Corto, fácil de recordar, fácil de deletrear por teléfono.</p>

<h2>¿Y si quiero tomarme más tiempo?</h2>

<p>Podéis. El asistente guarda automáticamente, así que podéis dejarlo a medio hacer y volver mañana. Algunas parejas pasan una hora ajustando colores, tipografía, distribución de la galería — está bien. La idea de la promesa de cinco minutos es que no haya obstáculo si vais cortos de tiempo.</p>

<p><a href="/create">Abrid el asistente ahora</a> y ved hasta dónde llegáis en cinco minutos. La vista previa es gratis; solo pagáis cuando dais a publicar.</p>
`;

const ES_RSVP_ONLINE = `
<p>El RSVP es la parte más estresante de planificar una boda de la que nadie os avisa. Mandáis la invitación. La gente os contesta por WhatsApp, por email, por DMs de Instagram, en persona tomando un café. Algunos confirman y se les olvida mencionar que son vegetarianos. Otros os dicen "claro que vamos" y desaparecen dos meses. Para cuando el lugar os pide el número final, tenéis una hoja de cálculo con tres versiones distintas de la misma respuesta para la mitad de los invitados.</p>

<p>Este es exactamente el problema que una web de boda con RSVP está pensada para resolver. Aquí va lo que debería incluir en 2026, y lo que podéis saltaros sin miedo.</p>

<h2>Los cinco campos que importan</h2>

<p>Un formulario de RSVP no necesita ser complicado. Los campos que marcan la diferencia para planificar la boda son exactamente cinco.</p>

<p><strong>Nombre</strong> — Los invitados escriben su nombre completo, exactamente como queréis que aparezca en el seating. No deis por hecho que recordáis cómo se escribe el nombre de cada primo.</p>

<p><strong>Asistencia: sí / no / tal vez</strong> — Una elección simple de tres opciones. "Tal vez" existe porque algunos invitados necesitan revisar vuelos o agendas con los niños y prefieren confirmar más tarde — mejor un "tal vez" registrado que ninguna respuesta.</p>

<p><strong>Acompañante (si lo permitís)</strong> — Un toggle más un campo de nombre cuando está activo. La regla del acompañante la marcáis vosotros, no se negocia caso por caso en el formulario.</p>

<p><strong>Preferencia de menú</strong> — Un desplegable con las opciones que ofrecéis. De tres a cinco categorías es lo ideal: carne, pescado, vegetariano, vegano, menú infantil. Añadid un campo de texto libre para alergias.</p>

<p><strong>Mensaje opcional</strong> — Una pequeña caja de texto donde los invitados pueden dejar una nota. Os sorprenderá cuántos se toman el tiempo de hacerlo. Algunas parejas imprimen los mensajes y los encuadernan como recuerdo del día.</p>

<p>Cualquier cosa más allá de estos cinco campos hace que los invitados cierren el formulario. Hemos visto parejas pedir preferencias de hotel, opciones de transporte, peticiones de canciones y preguntas para romper el hielo — y la tasa de respuesta cayó un 30% comparada con la versión sencilla.</p>

<h2>Lo que los invitados odian de los formularios de RSVP</h2>

<p>Hemos hecho pruebas informales con unas cuantas docenas de flujos de RSVP reales. Las quejas son sorprendentemente consistentes.</p>

<p><strong>Formularios que piden crear cuenta.</strong> Nadie quiere registrarse en un servicio para confirmar una boda. Cada minuto que añadís al RSVP es un invitado que cierra la pestaña. El formulario debería funcionar al primer toque, sin login.</p>

<p><strong>Formularios con teléfono obligatorio.</strong> Mismo problema. Los novios ya tienen el número, pedirlo dentro del formulario parece una trampa para una lista de correo.</p>

<p><strong>Formularios que no confirman el envío.</strong> Un invitado pulsa enviar, la página recarga y no pasa nada. ¿Funcionó? ¿Lo intento otra vez? Un mensaje de confirmación ("Gracias, hemos recibido tu respuesta") es la diferencia entre una tarde tranquila y una bandeja de entrada llena de "¿llegó mi respuesta?".</p>

<p><strong>Formularios que se ven rotos en el móvil.</strong> El 90% de los RSVP se hacen en el móvil, en el baño, en el hueco entre dos reuniones. Si el formulario obliga a hacer zoom o a desplazarse en horizontal, el invitado se rinde.</p>

<h2>Qué pasa después de pulsar enviar</h2>

<p>El invitado ve un mensaje de gracias. Vosotros recibís una notificación en vuestro panel privado. El nuevo RSVP aparece en la lista de invitados con la fecha, las elecciones y el mensaje. Podéis filtrar por confirmados / no confirmados, ordenar por fecha de envío, exportar a CSV si el lugar necesita el número en una hoja.</p>

<p>Esto es lo que hace que el RSVP online sea de verdad útil: no el formulario en sí, sino lo que pasa con los datos después. Una hoja de cálculo con 100 invitados es inmanejable. Un panel en directo con los mismos 100, ordenado y filtrado, es la diferencia entre dormir por la noche y refrescar el correo.</p>

<h2>La pregunta de la fecha límite</h2>

<p>Poned la fecha límite de RSVP tres semanas antes de la boda. No dos — tres. Os explicamos por qué: a tres semanas todavía tenéis que dar el número final al lugar, cerrar el seating, imprimir las tarjetas de los sitios, y perseguir a los rezagados. Dos semanas es muy ajustado. Tres da margen.</p>

<p>La web debería mostrar una cuenta atrás hasta la fecha límite, no solo la fecha. "Confirma antes del 15 de marzo" tiene menos fuerza que "Quedan 12 días". Una cuenta atrás en directo recuerda a los invitados que se les acaba el tiempo sin que vosotros tengáis que mandar un mensaje.</p>

<h2>¿Y los rezagados?</h2>

<p>Los habrá. En todas las bodas. La jugada inteligente es dejar el formulario aceptando envíos incluso después de la fecha límite, y simplemente quitar la cuenta atrás de la página. Así, los invitados que se den cuenta el día -10 de que se les olvidó pueden confirmar sin tener que escribiros en pánico.</p>

<p>El panel os enseña quién respondió tarde para que lo marquéis en el seating. Algunas parejas los persiguen con un mensaje amable de "vimos que respondiste tarde, ¿podemos contar contigo?". La mayoría los absorbe en el conteo y sigue.</p>

<h2>Construirlo sin tocar código</h2>

<p>No tenéis que construir nada de esto desde cero. <a href="/create">Wedding30s</a> incluye el formulario, el panel, las elecciones de menú, el control de alergias y la exportación a CSV por defecto. Rellenáis los datos, publicáis la web, el formulario está vivo. 49€ una vez, sin suscripción.</p>

<p>El setup tarda cinco minutos. La tranquilidad mental que os da en el último mes antes de la boda no tiene precio fácil, pero si tuviéramos que ponerlo: es la diferencia entre dormir ocho horas por noche y refrescar el correo a las dos de la mañana.</p>
`;

const ES_FREE_VS_PAID = `
<p>"Web de boda gratis" es una de las búsquedas más populares de Google relacionadas con bodas. También es la fuente de más de la mitad de las historias de arrepentimiento que oímos de parejas que intentaron ahorrarse 49€ y acabaron con una página lenta, llena de anuncios, que se cayó dos días antes de la boda.</p>

<p>Esta es una comparación honesta entre constructores de webs de boda gratuitos y de pago en 2026. Vendemos uno de pago, así que tomáoslo con la sal correspondiente — pero también hemos probado los gratis nosotros, y los compromisos son reales por ambos lados.</p>

<h2>Qué significa "gratis" en realidad</h2>

<p>Casi todos los constructores gratuitos caen en una de tres categorías.</p>

<p><strong>Gratis con anuncios.</strong> La web es gratis, pero la plataforma muestra anuncios en la página. A veces relacionados con bodas, a veces aleatorios. El día antes de su boda, una amiga nuestra descubrió que su página estaba mostrando anuncios de servicios funerarios.</p>

<p><strong>Gratis con límites.</strong> El plan gratuito cubre una página básica con los nombres, la fecha y un email de contacto. Cualquier cosa útil — el RSVP, el menú, la galería — se paga aparte. Para cuando añadís lo que de verdad necesitáis, lo "gratis" se convierte en una suscripción de 30-40€.</p>

<p><strong>Gratis como gancho.</strong> La plataforma regala la web pero intenta venderos una suscripción de planificador, álbum de fotos, lista de regalos o registro de luna de miel. La web es el cebo de un funnel más largo. Si os apetece el upsell, bien. Si no, la experiencia se siente forzada.</p>

<h2>Por qué se paga</h2>

<p>Una web de boda de pago como la nuestra cuesta 49€, una vez, sin suscripción. Lo que entra:</p>

<ul>
  <li>Una URL limpia sin anuncios de ningún tipo</li>
  <li>Formulario de RSVP con elección de menú y control de alergias</li>
  <li>Un panel privado donde veis las respuestas en tiempo real</li>
  <li>Galería para después de la boda</li>
  <li>Colores, tipografía y elección entre cuatro plantillas</li>
  <li>Una web que se queda online durante años, no hasta que caduque una prueba gratuita</li>
</ul>

<p>49€ es más o menos el coste de una invitación de papel para diez invitados. También es menos de lo que la mayoría de parejas gastan en las cintas del ramo. En el presupuesto de una boda, es invisible.</p>

<h2>Cuándo gratis tiene sentido</h2>

<p>No vamos a fingir que gratis siempre está mal. Hay situaciones donde una opción gratuita es la decisión correcta.</p>

<p><strong>Lista de menos de 20 invitados.</strong> Si tenéis una ceremonia pequeña con la familia inmediata, no necesitáis formulario de RSVP, no necesitáis selector de menú, no necesitáis galería. Una página gratis con la fecha y el lugar es suficiente. Mandadla, listo.</p>

<p><strong>La boda es en menos de dos semanas.</strong> Si os fugáis o estáis organizando una recepción rápida, una web gratis ahorra el paso del pago y la configuración. El compromiso está claro: menos personalización, pero no la necesitáis.</p>

<p><strong>Estáis probando una idea.</strong> Algunas parejas montan un borrador gratis para ver si el formato les funciona, y publican una versión de pago unos días después. El borrador gratis es un sandbox, no la invitación real.</p>

<h2>Cuándo pagar es lo correcto</h2>

<p>Si cualquiera de estas situaciones os aplica, pagar va a ahorraros más de 49€ en estrés, tiempo y vergüenza.</p>

<p><strong>Tenéis más de 30 invitados.</strong> Llevar el RSVP en una hoja de cálculo deja de funcionar a partir de los 30. El formulario de la plataforma sustituye la hoja y los emails de seguimiento.</p>

<p><strong>Necesitáis selección de menú.</strong> Las webs gratuitas casi nunca incluyen gestión de menú. Acabaréis llevando las preferencias de comida en capturas de WhatsApp, que es justo la situación que queríais evitar.</p>

<p><strong>Os importa cómo se ve.</strong> Las plantillas gratuitas suelen verse gratuitas. Las fotos de vuestra boda y vuestro gusto personal merecen una presentación que no grite "hecho en un constructor gratis".</p>

<p><strong>Vais a compartir la URL con gente a la que queréis impresionar.</strong> Padres, suegros, padrinos, jefe. La primera impresión de la boda es la web. Que cuente.</p>

<h2>Los costes ocultos de lo gratis</h2>

<p>Lo gratis casi nunca es gratis. Los costes que no veis en la etiqueta:</p>

<p>Tiempo. Los constructores gratuitos están pensados para el usuario casual, lo que significa que no hay soporte, ni documentación, ni un humano al que llamar cuando algo se rompe. Pasáis tres horas averiguando por qué la fecha sale en formato raro.</p>

<p>Lock-in. Algunas plataformas gratuitas añaden su marca en la URL o en la cabecera. No la podéis quitar sin pagar. Para cuando decidís actualizar, ya habéis compartido el enlace con 80 invitados.</p>

<p>Fiabilidad. El plan gratuito tiene menos garantías de uptime que el de pago. Dentro de dos años, cuando queráis enseñarles las fotos de la boda a vuestros suegros, la página puede haber desaparecido.</p>

<h2>El resumen</h2>

<p>Si la boda es pequeña, gratis funciona. Si tenéis 30+ invitados y queréis el RSVP, el menú, la galería, las direcciones y una URL limpia que dure, los 49€ de una web de pago son de las cosas más baratas en el presupuesto.</p>

<p>Podéis <a href="/create">probar nuestro constructor gratis</a> — la vista previa cuesta cero, solo pagáis al publicar. Así podéis compararla con las opciones gratuitas en sus propios términos antes de decidir.</p>
`;

const ES_GUEST_LIST_ONLINE = `
<p>La lista de invitados de la boda empieza siendo un papel en la mesa de la cocina con dos columnas y veinte nombres. Tres semanas después es una hoja de cálculo con dieciséis pestañas, cuatro duplicados, dos discusiones sobre acompañantes y un primo del que nadie recuerda haber invitado. Hay una manera mejor.</p>

<p>Así es como recomendamos llevar la lista de invitados online sin hojas de cálculo, escalando bien desde 20 hasta 200 personas.</p>

<h2>Por qué las hojas de cálculo dejan de funcionar a los 30 invitados</h2>

<p>Una hoja de cálculo va bien para la primera iteración. Empezáis con los nombres obvios, vais añadiendo, vais tachando. Luego alguien os contesta por WhatsApp, se os olvida actualizar la hoja, y la hoja ya está mal. Añadís una columna para "estado RSVP", otra para "alergias", otra para "acompañante sí/no". Ahora la hoja tiene 14 columnas y no se ve bien en el móvil.</p>

<p>El punto de quiebre está sobre los 30 invitados. Por debajo, una hoja funciona. Por encima, cada cambio es un impuesto sobre vuestro tiempo y una oportunidad de cometer errores.</p>

<h2>Qué hace un panel de invitados en su lugar</h2>

<p>Un panel de invitados dentro de la web de boda hace lo mismo que una hoja — lista de nombres, estado RSVP, alergias, acompañantes — pero con tres diferencias importantes.</p>

<p>Se actualiza solo. Cuando un invitado rellena el formulario, la entrada aparece en el panel con la fecha, la elección de menú y el mensaje. Vosotros no escribís nada.</p>

<p>Es ordenable y filtrable. Mostrad solo confirmados, solo vegetarianos, solo niños, solo los que respondieron tarde. Con un clic. Las hojas pueden hacer esto en teoría pero en la práctica nadie filtra su hoja de boda.</p>

<p>Es exportable. Cuando el lugar os pide el número final en un CSV, le dais a exportar. Cinco segundos.</p>

<h2>Acompañantes: la fuente real del drama familiar</h2>

<p>Los acompañantes son donde ocurren la mayoría de las discusiones de lista. Algunas parejas los permiten por defecto, otras los limitan, otras los negocian caso por caso. Decidáis lo que decidáis, la regla debe estar en el formulario, no en vuestra cabeza.</p>

<p>Si los permitís, el formulario tiene un toggle más un campo de nombre. Si el toggle está activo, el invitado añade el nombre del acompañante. El panel os muestra los dos nombres y los cuenta como dos plazas.</p>

<p>Si no los permitís, el toggle no aparece. Los invitados no pueden añadir acompañante. Igual os preguntan por WhatsApp, pero al menos la respuesta oficial es "el formulario no lo permite" — más fácil de defender que "te dije que no a la cara".</p>

<p>Para el caso intermedio (algunos invitados sí, otros no), el truco es marcar la regla por invitado antes de mandar la invitación. La plataforma os deja crear las entradas de invitados de antemano con acompañante permitido o no, y el enlace que mandáis a cada uno ya sabe la respuesta.</p>

<h2>Alergias sin capturas de WhatsApp</h2>

<p>Las alergias en una hoja de cálculo son una pesadilla. La gente os manda mensajes de WhatsApp con "vegetariano", "sin frutos secos", "intolerante a la lactosa pero puedo comer pequeñas cantidades de queso", y vosotros lo copiáis a una fila que en una semana será ilegible.</p>

<p>El formulario lo resuelve con un desplegable de opciones de menú (igual que las categorías que ofrece el lugar) más un campo de texto libre para alergias. Cada fila del panel muestra la elección de menú y las notas de alergia juntas. Filtráis por categoría para darle al equipo de catering un conteo limpio.</p>

<p>Para el día de la boda podéis imprimir una página por mesa con los nombres, las elecciones de menú y las alergias, ordenadas por sitio. El equipo de catering recibe exactamente lo que necesita, sin hojas que interpretar sobre la marcha.</p>

<h2>La lista de seguimiento (y cómo mantenerla amable)</h2>

<p>Toda boda tiene invitados que no contestan. Algunos se olvidaron, otros evitan el conflicto, otros perdieron el enlace de verdad. Para cuando pasa la fecha límite, tenéis una lista de 5 a 15 personas pendientes.</p>

<p>El panel os enseña exactamente quién no ha respondido. Mandadles un mensaje amable — corto, sin culpa, solo "el lugar necesita el número final mañana, ¿podéis confirmarnos?". La mayoría contesta en un día. Los que no, los marcáis como "no vienen" y seguís.</p>

<p>Resistid la tentación de mandar un recordatorio a todo el mundo "por si acaso". Vais a molestar a los que ya respondieron, y a los que no van a sentirse acorralados. Los recordatorios dirigidos funcionan; los masivos rebotan.</p>

<h2>El día antes de la boda</h2>

<p>Veinticuatro horas antes de la boda, el panel se convierte en la fuente de la verdad. Imprimís el seating, las elecciones de menú por mesa y las notas de alergia. El lugar recibe una exportación final. Dejáis de preocuparos.</p>

<p>Cualquier cosa que llegue después de ese punto — confirmaciones tardías, cancelaciones de última hora, un primo que aparece con un amigo no invitado — se gestiona en persona, no en el sistema. El trabajo del panel ya está hecho.</p>

<h2>Montadlo en una tarde</h2>

<p>Todo el panel de invitados está incluido en cualquier web de boda en <a href="/create">Wedding30s</a>. Montáis la página en cinco minutos, el formulario está vivo, el panel se llena solo según los invitados van respondiendo. Sin hojas de cálculo, sin copy-paste, sin capturas de WhatsApp. 49€ una vez, sin suscripción.</p>

<p>Si estáis a seis meses de la boda y aún no habéis empezado a llevar la lista, hoy es el día. Abrid el asistente, rellenad lo básico, compartid el enlace con vuestros cinco invitados más cercanos como prueba. Para el final de la semana, sabréis exactamente quién está dentro.</p>
`;

const ES_SAVE_THE_DATE = `
<p>El Save the Date debería ser la parte fácil de planificar una boda. Anunciáis la fecha, la gente la apunta en el calendario, vosotros volvéis a pelear con el lugar. En la práctica, la mayoría de las parejas se pasa dos semanas decidiendo qué formato usar, mandan el aviso tarde y acaban con tres invitados que reservan viajes que solapan porque el mensaje se perdió en un grupo de WhatsApp de 80 personas.</p>

<p>Aquí va la comparación honesta de los tres formatos que están funcionando en 2026: email, WhatsApp y el enlace a la web de boda.</p>

<h2>Email</h2>

<p>El email es el formato que vuestros padres esperan que uséis. También es el que vuestros invitados tienen menos probabilidades de leer.</p>

<p>La tasa de apertura de emails personales entre amigos en 2026 está sobre el 30-40%. Los emails relacionados con bodas suben — más bien al 60% — pero eso aún deja a un tercio de los invitados sin verlo en los primeros tres días. Para cuando lo abren, la fecha ya está enterrada en la bandeja.</p>

<p>El argumento a favor del email: funciona para los familiares mayores que no usan WhatsApp, deja constancia de a quién se lo habéis mandado, y el formato permite un mensaje más largo con más contexto. El argumento en contra: se siente formal de una manera que no encaja con el resto de la comunicación moderna de boda.</p>

<p>Usad email si vuestra lista incluye gente de más de 65 años que sabéis que lee su correo todos los días. Para el resto, hay opciones mejores.</p>

<h2>WhatsApp</h2>

<p>WhatsApp es lo de defecto en la mayoría de los países donde se hacen bodas con cierto volumen. Es rápido, se lee en una hora, permite respuesta inmediata y no se siente raro.</p>

<p>El problema de WhatsApp es que el mensaje desaparece en cuanto otra conversación lo empuja hacia abajo. Tres días después del anuncio, la mitad de los invitados no encuentra la fecha porque no la guardó, y no van a hacer scroll por 800 mensajes para buscarla.</p>

<p>El truco que funciona: mandad el aviso por WhatsApp como un único mensaje corto con una sola cosa clara — la fecha — y un enlace a donde se puede leer todo. Así, el mensaje de WhatsApp es el aviso, y el enlace es la referencia a la que pueden volver siempre que lo necesiten.</p>

<p>Evitad mandar el Save the Date como un mensaje largo de WhatsApp con el lugar, el menú, el aparcamiento y la lista de regalos. Nadie lee párrafos en un chat. El mensaje se ignora y acabáis respondiendo las mismas cinco preguntas individualmente.</p>

<h2>El enlace a la web de boda (la respuesta correcta)</h2>

<p>El formato que funciona en 2026 es híbrido: mandad un mensaje corto por WhatsApp (o email, para los familiares mayores) con una frase y un enlace. El enlace lleva a la web de boda, donde viven los detalles completos y se actualizan con el tiempo.</p>

<p>La primera versión de la web solo necesita tres cosas: los nombres, la fecha y una línea de "más detalles pronto". La montáis en cinco minutos, la publicáis, compartís el enlace. Según vais cerrando el lugar, el menú y el programa, actualizáis la página. Los invitados que ya guardaron el enlace ven las novedades cuando lo visitan.</p>

<p>Esto resuelve a la vez el problema del mensaje que desaparece en WhatsApp y el problema de la formalidad del email. El WhatsApp es la alerta ("nos casamos, guardad la fecha, todos los detalles aquí"), la web es la fuente de la verdad ("aquí está todo lo que sabemos hasta ahora").</p>

<h2>Qué va en la primera versión de la web</h2>

<p>La versión Save the Date de la web necesita menos que la invitación final. Cinco cosas son suficientes.</p>

<ol>
  <li>Vuestros dos nombres, en la portada</li>
  <li>La fecha, grande y clara</li>
  <li>La ciudad o región (no necesitáis el lugar exacto todavía)</li>
  <li>Una foto de los dos</li>
  <li>Una línea de "compartiremos más detalles pronto" abajo</li>
</ol>

<p>Eso es todo. Sin RSVP aún, sin menú, sin programa. Eso viene después, cuando el lugar esté cerrado y el presupuesto esté claro. El Save the Date es solo el aviso: esto va a pasar, marcad el calendario.</p>

<h2>Cuándo mandarlo</h2>

<p>Mandad el Save the Date entre seis y doce meses antes de la boda. Antes de eso, los invitados se olvidan. Después, arriesgáis a que la gente reserve otros planes antes de tener vuestra fecha.</p>

<p>Para bodas de destino, mandadlo entre nueve y doce meses antes — los invitados necesitan tiempo para planificar vuelos, alojamiento y vacaciones. Para bodas locales, seis a ocho meses está bien. Para bodas en la ventana ocupada de junio a septiembre, tirad por el lado largo.</p>

<h2>El mensaje de seguimiento</h2>

<p>Dos meses después del Save the Date, mandad un seguimiento rápido: "Recordatorio — nuestra boda es el día X, en unas semanas mandaremos la invitación completa. Lo último está en wedding30s.com/vuestros-nombres". Dos frases, sin formalidad, solo un empujoncito.</p>

<p>Funciona porque recuerda a la gente sin pedirles nada. La invitación completa llega unas semanas después con el RSVP, y para entonces la fecha ya está en la cabeza.</p>

<h2>Montad la primera versión hoy</h2>

<p>Si estáis leyendo esto y aún no habéis anunciado la fecha, la manera más rápida de hacerlo es <a href="/create">montar la web de boda ahora</a>. Cinco minutos de configuración, solo pagáis 49€ cuando publicáis, y el enlace funciona como ancla para todas las demás comunicaciones que mandéis entre hoy y la boda.</p>

<p>El Save the Date es la parte fácil. Hacedla más fácil.</p>
`;

const ES_MENU_SELECTION_ONLINE = `
<p>"¿Qué menú queréis para vuestros invitados?" es una de las preguntas que el lugar os hace al principio de la planificación, y la respuesta se convierte en un dolor de cabeza logístico unos tres meses más tarde, cuando toca recopilar la elección de cada uno. La mayoría de las parejas lo gestiona mal, no porque sean desorganizadas, sino porque las herramientas que usan no están pensadas para esto.</p>

<p>Aquí va la manera realista de gestionar la selección de menú online en 2026, incluyendo los pequeños detalles que deciden si el equipo de catering os agradece o os maldice el día de la boda.</p>

<h2>Las dos formas en que los lugares manejan los menús</h2>

<p>La mayoría de los lugares ofrecen una de estas dos estructuras de menú, y vuestras herramientas deberían encajar con la que use el vuestro.</p>

<p><strong>Menú fijo, sin elecciones.</strong> Todo el mundo recibe el mismo entrante, el mismo plato principal y el mismo postre. Fácil. Lo único que tenéis que llevar son las alergias e intolerancias, no preferencias.</p>

<p><strong>Menú con elecciones, los invitados eligen.</strong> El lugar ofrece dos o tres opciones para el plato principal (carne / pescado / vegetariano, a veces vegano), y tenéis que darles el conteo de cada una antes de la boda.</p>

<p>Si estáis en el segundo caso — y la mayoría de las parejas lo están — necesitáis un sistema para recoger las elecciones, resumirlas y entregar al lugar un conteo limpio. Una hoja de cálculo va bien para 20 invitados. Deja de funcionar a los 50.</p>

<h2>Los campos del formulario que importan</h2>

<p>La sección de menú del formulario de RSVP debe tener exactamente dos campos. Cualquier cosa más y los invitados empiezan a abandonar.</p>

<p><strong>Elección de menú (desplegable).</strong> Un desplegable limpio con las categorías que ofrece vuestro lugar. De tres a cinco opciones. Cada opción tiene un nombre claro y, idealmente, una línea de descripción: "Solomillo de ternera con verduras asadas", no solo "Opción carne".</p>

<p><strong>Alergias e intolerancias (texto libre).</strong> Un único campo de texto donde los invitados escriben lo que el catering necesita saber. "Intolerante a la lactosa, puede tomar pequeñas cantidades de mantequilla" es el tipo de detalle que ahorra una llamada telefónica.</p>

<p>Eso es. No añadáis "me gusta el picante" o "prefiero las verduras cocinadas". El catering no puede personalizar platos individuales con ese nivel de detalle, y cuantas más preguntas hacéis, más invitados se saltan la sección de menú entera.</p>

<h2>Niños y menús especiales</h2>

<p>Si ofrecéis menú infantil, tratadlo como una opción separada en el desplegable, no como un check en otro sitio. Los padres tienen que elegirlo explícitamente: "Menú infantil (menores de 12)". Algunos lugares también ofrecen "menú ligero" o "menú vegano" — misma regla, opción separada.</p>

<p>La trampa a evitar: dar por hecho que todos los niños reciben automáticamente el menú infantil. Algunos de 11 quieren el plato principal de adulto, algunos de 4 hay que llevarlos por separado porque la cocina los gestiona distinto. Dejad que el padre elija.</p>

<h2>Qué enseñar al lugar</h2>

<p>Dos días antes de la boda, el lugar os pide el conteo final. Quiere un número por categoría, no una lista de nombres. El panel debería daros ese conteo con un clic — agrupar por elección de menú, sumar, listo.</p>

<p>Algunos lugares también quieren los nombres por mesa, con alergias. Para eso, generáis una hoja por mesa con cada invitado, su elección de menú y las notas de alergia. El equipo de catering usa esa hoja el día para saber qué plato va dónde.</p>

<p>Las dos vistas — el conteo y la hoja por mesa — están integradas en <a href="/create">Wedding30s</a> por defecto. Filtráis, exportáis, mandáis el archivo al lugar. Cinco minutos de trabajo el día antes.</p>

<h2>El invitado del "lo decido el día"</h2>

<p>Vais a tener al menos uno. El invitado que rellena el RSVP, marca "asisto" y deja la elección de menú vacía con el supuesto implícito de que decidirá el día.</p>

<p>Esto es un problema porque el catering necesita el conteo por adelantado para pedir la comida. La solución va integrada en el formulario: hacer que la elección de menú sea obligatoria si "asisto = sí". Los invitados no pueden enviar el formulario sin elegir menú. Elegirán algo, aunque acaben cambiándolo el día.</p>

<p>Para el caso raro del que de verdad no sabe, añadid una opción por defecto llamada "elijo lo que recomendéis" y pre-asignádsela al plato más popular. El catering puede planificar alrededor de eso, y el invitado recibe un plato sin tener que pensarlo.</p>

<h2>Errores comunes</h2>

<p><strong>Pedir las elecciones de menú antes de que el menú esté cerrado.</strong> Si el lugar todavía está retocando los platos a un mes de la boda, no empujéis aún el formulario de menú a los invitados. Esperad a que esté cerrado, luego mandadlo. Los que ya hayan respondido pueden volver a actualizar su elección.</p>

<p><strong>Mezclar la elección de menú con otras preguntas.</strong> Algunas parejas juntan el menú con "canción favorita", "bebida preferida" o "necesitas ascensor". Cada pregunta extra baja la tasa de respuesta. Mantened el menú y las peticiones de canciones separadas, en secciones distintas de la página si tenéis que incluir las dos.</p>

<p><strong>No avisar de cuándo se cierra la elección.</strong> Poned una fecha clara (típicamente la misma que la del RSVP, tres semanas antes de la boda) y enseñad la cuenta atrás en la página. La mayoría de los invitados responden mejor a la presión de tiempo que a recordatorios amables.</p>

<h2>Los 49€ que evitan el dolor de cabeza</h2>

<p>Podéis montar todo esto en una hoja de cálculo más capturas de WhatsApp más un conteo manual el día. También podéis <a href="/create">usar un constructor de webs de boda que lo haga por defecto</a>, por 49€ una vez, y dedicar las horas ahorradas a algo que importe más — como escribir vuestros votos.</p>

<p>La selección de menú es una de las pequeñas tareas poco glamurosas de planificar una boda que decide si el día se siente organizado o caótico. La herramienta que elijáis para llevarla marca más diferencia que el plato que elijáis para servir.</p>
`;

const ES_PHOTO_GALLERY_QR = `
<p>Una de las partes más infravaloradas de una web de boda es la parte que nadie monta antes de la boda: la galería de fotos para el día después. Las parejas pasan semanas diseñando la página de la invitación y luego se olvidan de que la misma URL va a alojar cientos de fotos que los invitados se compartirán durante años.</p>

<p>Así es como montar una galería de fotos de boda que vive en la web, recoge fotos de los invitados automáticamente y usa un código QR el día para que nadie tenga que descargar una app.</p>

<h2>Por qué una app no es la respuesta</h2>

<p>Veréis muchas "apps de fotos de boda" anunciadas online. La mayoría siguen el mismo patrón: los invitados descargan una app el día, se registran con email, encuentran la boda con un código, suben fotos. El flujo tiene seis pasos y una docena de puntos de fricción. El resultado es que el 30% de los invitados sube fotos y el 70% se rinde.</p>

<p>La razón es simple. Los invitados de una boda llevan ropa apretada, tienen una mano sosteniendo una bebida y están rodeados de gente que no han visto en años. Pedirles que instalen una app, se registren, encuentren la boda correcta y aprendan una interfaz nueva es pedir demasiado.</p>

<p>El formato que de verdad funciona en 2026 es un código QR en la mesa, una URL de web de boda, y un formulario de subida de fotos que va al primer toque sin registro.</p>

<h2>El código QR en la mesa</h2>

<p>Imprimís una tarjetita (o un soporte) con un único QR y una línea de texto: "Escanea para compartir tus fotos". El QR abre la página de subida de fotos de la web. El invitado hace una foto, le da a subir, listo.</p>

<p>Todo el flujo son tres toques, sin registro, sin app, sin fricción. Los invitados mayores que normalmente no usan QR siguen al resto — en cuanto uno de la mesa lo entiende, los demás copian.</p>

<p>Imprimid la tarjeta en el mismo papel que las cartas de menú. Poned una en cada mesa. Algunas parejas también dejan un montón en la barra y en la entrada para los invitados que no estén en una mesa en el momento que quieran compartir una foto.</p>

<h2>Qué se sube vs qué guardáis</h2>

<p>Las fotos de los invitados son geniales porque capturan momentos que el fotógrafo oficial pierde — las reacciones espontáneas, los planos de la pista, los niños corriendo, el caos de madrugada. También son sin filtros, lo que significa que algunas saldrán movidas, mal encuadradas o con gente con los ojos cerrados.</p>

<p>La web de boda debería aceptar todo y dejaros decidir luego qué guardar. Una vista de "moderación" en el panel os enseña todas las fotos subidas y os deja aprobar, ocultar o borrar. Las aprobadas aparecen en la galería pública. Las ocultas se quedan en vuestro panel privado para el recuerdo.</p>

<p>La regla que funciona: aprobad con generosidad. Hasta las fotos malas tienen una historia. Dentro de tres años, la foto movida de vuestro tío bailando mal será más graciosa que el retrato perfecto de estudio.</p>

<h2>La función "foto del día"</h2>

<p>Un detalle pequeño que funciona bien: después de la boda, elegís una foto de invitado por día durante el primer mes y la destacáis arriba en la galería. Los invitados reciben una notificación cuando su foto sale destacada. El pico de engagement es real — vuelven a compartir el enlace, y la web recibe una segunda ola de visitas.</p>

<p>Algunas parejas convierten esto en un juego. El invitado cuya foto sale destacada más veces gana un premio (una botella de vino, una tarjeta de agradecimiento, lo que entre en el presupuesto). Es una excusa simpática para alargar el día de la boda durante las semanas siguientes.</p>

<h2>Privacidad: quién ve qué</h2>

<p>Las fotos de boda son personales. La opción por defecto en una web de boda debería ser que la galería solo es visible para gente que tiene el enlace, no indexada por buscadores. Cualquiera a quien hayáis mandado la web puede ver la galería. Cualquiera que busque vuestros nombres en Google no.</p>

<p>Para parejas que quieran privacidad extra — típicamente las que tienen trabajos públicos o invitados con preocupaciones de privacidad — podéis poner la galería detrás de una contraseña. La contraseña vive en la web, la URL se comparte como antes, pero la sección de galería pide un código antes de mostrar fotos. Menos cómodo, más privado.</p>

<h2>Qué pasa con las fotos un año después</h2>

<p>Las fotos se quedan en la web de boda. La URL sigue funcionando. Podéis volver dentro de cinco años y la galería seguirá ahí, en el mismo sitio, con las mismas fotos. Esta es la parte que más sorprende a las parejas: una web de boda no es una cosa de un día. Es un registro permanente del día, con las fotos, el menú, los mensajes de los invitados, el programa.</p>

<p>Tenemos parejas que montaron su web en Wedding30s en 2024 y siguen mandando el enlace a gente que conocen y pregunta "¿qué tal la boda?". El coste de 49€ una vez hace posible mantener la web online indefinidamente sin suscripción.</p>

<h2>Configuradlo en un clic</h2>

<p>La galería de fotos, el generador de QR, la vista de moderación y los ajustes de privacidad están todos incluidos en <a href="/create">Wedding30s</a> por defecto. Montáis la web en cinco minutos, imprimís la tarjeta del QR la semana antes de la boda, y la galería se llena sola el día.</p>

<p>Si estáis leyendo esto con la boda aún a semanas vista, hoy es un buen día para imprimir las tarjetas del QR. Si lo estáis leyendo el día después de la boda, podéis montar la galería ahora y pedir a los invitados que suban fotos retroactivamente. La mayoría lo hará, sobre todo los que más fotos sacaron.</p>
`;

const ES_ETIQUETTE = `
<p>"¿Qué tengo que poner en la web de boda?" es la pregunta que paraliza a la mayoría de las parejas entre decidir que van a montar una y publicarla de verdad. La respuesta honesta es más corta de lo que la gente espera: una web de boda necesita cinco cosas, y todo lo demás es opcional y a menudo un error.</p>

<p>Aquí va lo que poner en una web de boda en 2026, y las cosas que deberíais saltaros aunque todos los blogs de boda os digan lo contrario.</p>

<h2>Las cinco cosas que de verdad necesitáis</h2>

<p><strong>Nombres, fecha, lugar.</strong> La portada de la página. Grande, claro, legible en dos segundos en pantalla de móvil. Si un invitado abre la página y no puede contestar "quién, cuándo, dónde" sin hacer scroll, la página está rota.</p>

<p><strong>Formulario de RSVP con elección de menú.</strong> Un formulario, tres a cinco campos, sin registro. Aquí es donde la web de boda se gana el sueldo — cualquier otro formato (papel, email, WhatsApp) hace que recoger los RSVP sea más difícil de lo necesario.</p>

<p><strong>Cómo llegar al lugar.</strong> Un mapa incrustado, la dirección en texto plano, y un enlace a Google Maps. Algunas parejas añaden las indicaciones de aparcamiento si el sitio es complicado. Eso es suficiente.</p>

<p><strong>Programa.</strong> Tres a cinco líneas: ceremonia a las 17:00, cóctel a las 18:30, cena a las 20:00, baile desde las 23:00. No escribáis un horario minuto a minuto. Los invitados necesitan saber cuándo llegar y cuándo irse, no cuándo se sirve el segundo plato.</p>

<p><strong>Una historia corta sobre los dos.</strong> Dos párrafos, tres como mucho. Cómo os conocisteis, cuándo decidisteis casaros, qué os hace ilusión. No unas memorias, solo lo justo para que un invitado que solo conoce a uno de los dos se haga una idea del otro.</p>

<p>Cinco cosas. Esa es toda la web de boda. Todo lo demás es opcional, y la mayoría es un error.</p>

<h2>Las cosas a saltar</h2>

<p>Esto es lo que los blogs de boda y Pinterest os dicen que incluyáis y que no deberíais.</p>

<p><strong>La línea temporal de "nuestra historia de amor" con fotos de cada año de la relación.</strong> Idea bonita, casi nadie hace scroll por ella. La historia va en dos párrafos cortos en el centro de la página, no en un slider horizontal con doce fotos.</p>

<p><strong>La playlist detallada de la música de la boda.</strong> A los invitados no les importa qué canciones sonarán durante el cóctel. El DJ sabe la playlist; la web no la necesita.</p>

<p><strong>Las instrucciones del hashtag.</strong> Si queréis un hashtag, mencionadlo una vez al final de la página. No dediquéis una sección a "Cómo usar #SaraYMiguel2026 en Instagram". Los invitados que usan hashtags ya saben. Los que no, no van a empezar.</p>

<p><strong>La lista de proveedores con logos.</strong> La floristería, el DJ, el fotógrafo, el catering. Esto es algo que la industria de la boda recomienda porque les da publicidad gratis. A vuestros invitados no les importa.</p>

<p><strong>La página del séquito.</strong> "Conoce a las damas de honor" con fotos y bios está bien si vuestra web de boda es un club de fans. Para una invitación de boda, es relleno.</p>

<p><strong>La lista de regalos como protagonista.</strong> Algunas parejas hacen de la lista de regalos la segunda sección más prominente de la página. Se siente raro. La lista de regalos debería ser un enlace pequeño en el pie, no una sección principal.</p>

<h2>Qué hacer con la pregunta de la lista de regalos</h2>

<p>La lista de regalos es el elemento más controvertido de una web de boda. Algunas culturas la esperan como pieza central. Otras encuentran de mal gusto mencionarla. El camino del medio es donde aterriza la mayoría: una pequeña sección cerca del final de la página con una línea y un enlace.</p>

<p>"No esperamos regalos, pero si queréis contribuir a nuestra luna de miel, podéis hacerlo aquí." Listo. Dos frases, un enlace. Sin necesidad de fotos de productos, sin necesidad de una lista, sin necesidad de explicación.</p>

<p>Si optáis por la lista tradicional, la misma regla: una línea, un enlace, no una sección principal.</p>

<h2>Código de vestimenta</h2>

<p>Incluid el código de vestimenta si no es obvio por el lugar. "Cóctel", "smart casual", "calzado para jardín" — una línea, sin fotos de ejemplo. Los invitados pueden googlear cómo es un cóctel; no necesitan un tablero de Pinterest.</p>

<p>Saltaos la sección de código de vestimenta entera si vuestra boda es "venid como queráis" o si el lugar lo deja claro por sí mismo (una boda en la playa no necesita sección de código de vestimenta).</p>

<h2>Niños</h2>

<p>Si vuestra boda es solo para adultos, decidlo una vez en la página, cerca del RSVP. Directo, sin disculpas, sin explicaciones largas. "Nuestra boda es solo para adultos. Esperamos que podáis acompañarnos." Tres frases máximo.</p>

<p>El error es dedicar una sección entera con razones. No tenéis que justificar la decisión. Los invitados respetan la línea, los padres organizan el cuidado de los niños, la vida sigue.</p>

<h2>¿Y las secciones de FAQ?</h2>

<p>Las FAQ parecen organizadas pero leen como contratos. La mayoría de las páginas de "FAQ de boda" listan preguntas como "¿Puedo traer acompañante?" y "¿Dónde puedo aparcar?" — preguntas que deberían responderse antes en la página, no relegadas a una sección que nadie lee.</p>

<p>Si os encontráis escribiendo una FAQ, la página está mal. Mover las respuestas a las secciones relevantes (los acompañantes al RSVP, el aparcamiento a las direcciones) y borrad la FAQ.</p>

<h2>Menos es más, siempre</h2>

<p>Las mejores webs de boda que vemos son cortas. Nombres, fecha, lugar, RSVP, cómo llegar, programa, historia. Seis secciones, cada una corta. Toda la página se lee en tres minutos en el móvil, el invitado responde en otro minuto, y recuerdan los detalles porque no hay nada más compitiendo por su atención.</p>

<p>Las peores webs de boda son las que intentan ser de todo: una historia de amor, una lista de proveedores, una línea temporal de canciones, una guía de moda, una FAQ, una galería de fotos del compromiso, una cuenta atrás y un mapa. La página tarda diez minutos en leerse y el RSVP queda enterrado bajo el relleno.</p>

<p>Si queréis la versión corta: <a href="/create">montad la web en cinco minutos</a>, rellenad las cinco cosas que de verdad necesitáis, publicad, y resistid la tentación de añadir más. La disciplina es el diseño.</p>
`;

// ============================================================================
// Cluster definition with paired translations
// ============================================================================

const POSTS: SeedPost[] = [
  // 1. Digital invitation ideas
  {
    slug: 'digital-wedding-invitation-ideas',
    locale: 'en',
    title: 'Digital Wedding Invitation Ideas: 12 Modern Formats Couples Are Using in 2026',
    description: 'Twelve digital wedding invitation formats actually working in 2026 — wedding websites, QR codes, RSVP forms, bilingual pages and more. Honest pros and cons.',
    published_at: '2026-03-15T09:00:00Z',
    translated_slug: 'ideas-invitaciones-de-boda-digitales',
    content_html: EN_DIGITAL_INVITATION_IDEAS,
  },
  {
    slug: 'ideas-invitaciones-de-boda-digitales',
    locale: 'es',
    title: 'Ideas de invitaciones de boda digitales: 12 formatos que están funcionando en 2026',
    description: 'Doce formatos de invitación de boda digital que de verdad funcionan en 2026 — webs, códigos QR, formularios de RSVP, páginas bilingües y más. Pros y contras honestos.',
    published_at: '2026-03-15T09:00:00Z',
    translated_slug: 'digital-wedding-invitation-ideas',
    content_html: ES_DIGITAL_INVITATION_IDEAS,
  },

  // 2. How to create wedding website in 5 minutes
  {
    slug: 'how-to-create-wedding-website-in-5-minutes',
    locale: 'en',
    title: 'How to Create Your Wedding Website in 5 Minutes (No Design Skills Required)',
    description: 'A step-by-step guide to building your wedding website in five minutes. What to prepare, what to skip, and how to publish without overthinking it.',
    published_at: '2026-03-19T10:00:00Z',
    translated_slug: 'como-crear-web-de-boda-en-5-minutos',
    content_html: EN_HOW_TO_CREATE_5_MIN,
  },
  {
    slug: 'como-crear-web-de-boda-en-5-minutos',
    locale: 'es',
    title: 'Cómo crear tu web de boda en 5 minutos (sin saber de diseño)',
    description: 'Guía paso a paso para montar tu web de boda en cinco minutos. Qué preparar, qué saltarte y cómo publicarla sin darle vueltas.',
    published_at: '2026-03-19T10:00:00Z',
    translated_slug: 'how-to-create-wedding-website-in-5-minutes',
    content_html: ES_HOW_TO_CREATE_5_MIN,
  },

  // 3. RSVP online
  {
    slug: 'wedding-website-with-rsvp-online',
    locale: 'en',
    title: 'Wedding Website with RSVP: What Couples Actually Need in 2026',
    description: 'What an online RSVP form should include, what to skip, and how to keep guests from abandoning the form. Real lessons from running RSVP flows on real weddings.',
    published_at: '2026-03-22T11:00:00Z',
    translated_slug: 'web-de-boda-con-rsvp-online',
    content_html: EN_RSVP_ONLINE,
  },
  {
    slug: 'web-de-boda-con-rsvp-online',
    locale: 'es',
    title: 'Web de boda con RSVP: lo que las parejas necesitan de verdad en 2026',
    description: 'Lo que un formulario de RSVP online debería incluir, qué saltarse y cómo evitar que los invitados abandonen. Lecciones reales de gestionar RSVP en bodas de verdad.',
    published_at: '2026-03-22T11:00:00Z',
    translated_slug: 'wedding-website-with-rsvp-online',
    content_html: ES_RSVP_ONLINE,
  },

  // 4. Free vs paid
  {
    slug: 'free-vs-paid-wedding-website',
    locale: 'en',
    title: 'Free vs Paid Wedding Websites: Honest Comparison for 2026',
    description: 'When a free wedding website is enough, when it backfires, and what you actually pay for in a paid one. Honest comparison from someone who sells one.',
    published_at: '2026-03-25T09:30:00Z',
    translated_slug: 'web-de-boda-gratis-vs-pago',
    content_html: EN_FREE_VS_PAID,
  },
  {
    slug: 'web-de-boda-gratis-vs-pago',
    locale: 'es',
    title: 'Web de boda gratis vs de pago: comparación honesta para 2026',
    description: 'Cuándo una web de boda gratis es suficiente, cuándo te explota en la cara, y por qué se paga en una de pago. Comparación honesta de quien vende una.',
    published_at: '2026-03-25T09:30:00Z',
    translated_slug: 'free-vs-paid-wedding-website',
    content_html: ES_FREE_VS_PAID,
  },

  // 5. Manage guest list online
  {
    slug: 'manage-wedding-guest-list-online',
    locale: 'en',
    title: 'How to Manage Your Wedding Guest List Online (Without Spreadsheets)',
    description: 'Why spreadsheets stop working at 30 guests, and the online dashboard that replaces them. Plus ones, dietary tracking, late repliers and the day before the wedding.',
    published_at: '2026-03-29T10:30:00Z',
    translated_slug: 'gestionar-lista-de-invitados-online',
    content_html: EN_GUEST_LIST_ONLINE,
  },
  {
    slug: 'gestionar-lista-de-invitados-online',
    locale: 'es',
    title: 'Cómo gestionar la lista de invitados de tu boda online (sin hojas de cálculo)',
    description: 'Por qué las hojas de cálculo dejan de funcionar a los 30 invitados y el panel online que las sustituye. Acompañantes, alergias, rezagados y el día antes de la boda.',
    published_at: '2026-03-29T10:30:00Z',
    translated_slug: 'manage-wedding-guest-list-online',
    content_html: ES_GUEST_LIST_ONLINE,
  },

  // 6. Save the date digital
  {
    slug: 'save-the-date-digital-email-whatsapp-website',
    locale: 'en',
    title: 'Save the Date Digital: Email, WhatsApp or Wedding Website?',
    description: 'Honest comparison of the three formats actually working in 2026 for sending Save the Date messages. When to use each one, and the hybrid that wins.',
    published_at: '2026-04-02T09:15:00Z',
    translated_slug: 'save-the-date-digital-email-whatsapp-web',
    content_html: EN_SAVE_THE_DATE,
  },
  {
    slug: 'save-the-date-digital-email-whatsapp-web',
    locale: 'es',
    title: 'Save the Date digital: ¿email, WhatsApp o web de boda?',
    description: 'Comparación honesta de los tres formatos que de verdad funcionan en 2026 para mandar Save the Date. Cuándo usar cada uno y el híbrido que gana.',
    published_at: '2026-04-02T09:15:00Z',
    translated_slug: 'save-the-date-digital-email-whatsapp-website',
    content_html: ES_SAVE_THE_DATE,
  },

  // 7. Menu selection online
  {
    slug: 'online-wedding-menu-selection',
    locale: 'en',
    title: 'Online Wedding Menu Selection: How to Let Guests Choose Their Plate',
    description: 'How to collect menu choices online without spreadsheet chaos. Form fields that work, common mistakes, and what to hand the venue two days before.',
    published_at: '2026-04-05T10:45:00Z',
    translated_slug: 'menu-de-boda-eleccion-online',
    content_html: EN_MENU_SELECTION_ONLINE,
  },
  {
    slug: 'menu-de-boda-eleccion-online',
    locale: 'es',
    title: 'Elección de menú de boda online: cómo dejar que los invitados elijan',
    description: 'Cómo recoger las elecciones de menú online sin caos de hojas de cálculo. Campos que funcionan, errores comunes y qué entregar al lugar dos días antes.',
    published_at: '2026-04-05T10:45:00Z',
    translated_slug: 'online-wedding-menu-selection',
    content_html: ES_MENU_SELECTION_ONLINE,
  },

  // 8. Photo gallery QR
  {
    slug: 'wedding-photo-gallery-qr-code',
    locale: 'en',
    title: 'Wedding Photo Gallery with QR Code: Skip the App, Use Your Wedding Website',
    description: 'How to set up a wedding photo gallery that collects guest photos via QR code, with no app and no signup. The format that actually gets photos uploaded.',
    published_at: '2026-04-09T11:30:00Z',
    translated_slug: 'galeria-fotos-boda-codigo-qr',
    content_html: EN_PHOTO_GALLERY_QR,
  },
  {
    slug: 'galeria-fotos-boda-codigo-qr',
    locale: 'es',
    title: 'Galería de fotos de boda con código QR: olvídate de la app, usa tu web',
    description: 'Cómo montar una galería de fotos de boda que recoge las fotos de los invitados con un QR, sin app y sin registro. El formato que de verdad funciona.',
    published_at: '2026-04-09T11:30:00Z',
    translated_slug: 'wedding-photo-gallery-qr-code',
    content_html: ES_PHOTO_GALLERY_QR,
  },

  // 9. Wedding website etiquette
  {
    slug: 'wedding-website-etiquette',
    locale: 'en',
    title: 'Wedding Website Etiquette: What to Include (And What to Skip)',
    description: 'The five things a wedding website actually needs and the eight wedding-blog favourites you should skip. Less is more, every time.',
    published_at: '2026-04-13T10:00:00Z',
    translated_slug: 'etiqueta-web-de-boda-que-incluir',
    content_html: EN_ETIQUETTE,
  },
  {
    slug: 'etiqueta-web-de-boda-que-incluir',
    locale: 'es',
    title: 'Etiqueta de la web de boda: qué incluir (y qué saltarse)',
    description: 'Las cinco cosas que una web de boda de verdad necesita y los ocho favoritos de los blogs de boda que deberíais saltaros. Menos es más, siempre.',
    published_at: '2026-04-13T10:00:00Z',
    translated_slug: 'wedding-website-etiquette',
    content_html: ES_ETIQUETTE,
  },
];

async function seed() {
  for (const post of POSTS) {
    const existing = (await query(
      'SELECT id FROM blog_posts WHERE slug = ? AND locale = ? LIMIT 1',
      [post.slug, post.locale],
    )) as { id: string }[];

    if (existing.length > 0) {
      await execute(
        `UPDATE blog_posts
         SET title = ?, description = ?, content_html = ?, hero_image = ?, translated_slug = ?, published_at = ?
         WHERE id = ?`,
        [
          post.title,
          post.description,
          post.content_html,
          post.hero_image ?? null,
          post.translated_slug ?? null,
          new Date(post.published_at),
          existing[0].id,
        ],
      );
      console.log(`updated: ${post.locale}/${post.slug}`);
    } else {
      const id = randomUUID();
      await execute(
        `INSERT INTO blog_posts (id, slug, locale, title, description, content_html, hero_image, translated_slug, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          post.slug,
          post.locale,
          post.title,
          post.description,
          post.content_html,
          post.hero_image ?? null,
          post.translated_slug ?? null,
          new Date(post.published_at),
        ],
      );
      console.log(`created: ${post.locale}/${post.slug}`);
    }
  }
  console.log(`Seed complete: ${POSTS.length} posts (${POSTS.filter(p => p.locale === 'en').length} EN + ${POSTS.filter(p => p.locale === 'es').length} ES)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
