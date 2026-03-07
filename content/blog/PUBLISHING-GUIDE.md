# How to Publish a Blog Post on AXIONLAB

This guide walks you through creating and publishing a blog post on axionlab.in. No coding knowledge needed.

---

## What You Need

- Access to the **axionlab** GitHub repository
- A way to edit files on GitHub (the browser works fine — no software needed)

---

## Step-by-Step: Publish a New Post

### 1. Go to the Blog Folder on GitHub

Open this link in your browser:

**https://github.com/dhairya2019/axionlab/tree/main/content/blog**

This is where all blog posts live.

### 2. Create a New File

- Click the **"Add file"** button (top right)
- Click **"Create new file"**

### 3. Name Your File

In the file name box at the top, type a name like:

```
my-post-title.mdx
```

**Rules for the file name:**
- Use **lowercase** letters only
- Use **dashes** instead of spaces (`my-post` not `my post`)
- End with `.mdx` (not `.md`, not `.txt`)
- Keep it short but descriptive
- This name becomes part of the URL — `my-post-title.mdx` will be at `axionlab.in/insights/my-post-title`

### 4. Add the Post Header

Every post MUST start with a header block. Copy this template and paste it at the very top of the file:

```
---
title: "Your Post Title Here"
date: "2026-03-08"
description: "A one-line summary of what this post is about."
tags: ["topic1", "topic2"]
author: "AXIONLAB"
---
```

**Fill in each line:**

| Field | What to Write | Example |
|-------|--------------|---------|
| title | The headline of your post (in quotes) | "Why We Switched to Rust" |
| date | Today's date in YYYY-MM-DD format (in quotes) | "2026-03-08" |
| description | A short summary, 1-2 sentences (in quotes) | "A look at our migration from Node.js to Rust for compute-heavy workloads." |
| tags | Topics this post covers (in square brackets, each in quotes, separated by commas) | ["performance", "rust", "systems"] |
| author | Who wrote it (in quotes) | "AXIONLAB" |

**Important:** The three dashes `---` at the top and bottom of this block are required. Do not remove them.

### 5. Write Your Post Content

Below the header block, write your post. You can use plain text, or use simple formatting:

**Bold text:**
```
**this will be bold**
```

**Italic text:**
```
*this will be italic*
```

**Headings** (use these to break your post into sections):
```
## Main Section Heading

### Smaller Sub-Heading
```

**Bullet points:**
```
- First point
- Second point
- Third point
```

**Numbered list:**
```
1. First step
2. Second step
3. Third step
```

**Links:**
```
[click here](https://example.com)
```

**Quotes:**
```
> This is a quote. It will appear indented with a red left border.
```

**Images** (paste an image URL from the web):
```
![description of image](https://example.com/photo.jpg)
```

### 6. Save and Publish

- Scroll down to the bottom of the page
- Under **"Commit changes"**, type a short message like: `Add new blog post: my topic`
- Make sure **"Commit directly to the main branch"** is selected
- Click **"Commit changes"**

That's it. The site will automatically rebuild and your post will be live at **axionlab.in/insights/your-file-name** within 1-2 minutes.

---

## Complete Example

Here is a full blog post file you can copy and modify:

```
---
title: "Why Speed Matters More Than Features"
date: "2026-03-08"
description: "Performance is not a feature. It is the foundation every feature depends on."
tags: ["performance", "engineering"]
author: "AXIONLAB"
---

Every millisecond counts. Users don't wait for slow software — they leave.

## The Real Cost of Latency

A 100ms delay in page load can reduce conversions by 7%. At scale, that translates to millions in lost revenue.

We've seen this firsthand with our commerce clients. The fastest path to more sales is not more features — it is **less wait time**.

## What We Do About It

At AXIONLAB, we profile before we build. Every system has a performance budget:

- Page load: under 1.5 seconds
- API response: under 200ms
- Database queries: under 50ms

> If you can't measure it, you can't improve it.

These are not aspirations. They are hard limits enforced in our CI pipeline.

## Start Fast, Stay Fast

Performance degrades over time unless you actively protect it. We build automated performance regression tests into every project.

Read more about our [approach to engineering](/philosophy).
```

---

## Editing an Existing Post

1. Go to **https://github.com/dhairya2019/axionlab/tree/main/content/blog**
2. Click on the file you want to edit
3. Click the **pencil icon** (top right of the file) to edit
4. Make your changes
5. Scroll down, add a commit message, and click **"Commit changes"**

The updated post will go live within 1-2 minutes.

---

## Deleting a Post

1. Go to the blog folder on GitHub
2. Click on the file you want to remove
3. Click the **three dots menu** (top right) and select **"Delete file"**
4. Commit the change

---

## Tags

Tags help readers filter posts by topic. Use tags from this list when possible to keep things consistent:

| Tag | Use When Writing About |
|-----|----------------------|
| systems | System architecture, infrastructure design |
| performance | Speed, optimization, latency |
| distributed | Microservices, multi-region, event-driven |
| reliability | Uptime, fault tolerance, monitoring |
| commerce | E-commerce, payments, checkout |
| ai | AI agents, LLMs, automation |
| engineering | General engineering practices |

You can create new tags too — just add them in the tags list. They will automatically appear as filter buttons on the blog page.

---

## Troubleshooting

**Post not showing up?**
- Make sure the file ends in `.mdx` (not `.md`)
- Make sure the header block has `---` on its own line at the top and bottom
- Make sure the date is in `"YYYY-MM-DD"` format with quotes
- Wait 1-2 minutes for the site to rebuild

**Formatting looks wrong?**
- Leave a blank line before and after headings (`##`)
- Leave a blank line before and after bullet point lists
- Make sure bold uses two asterisks on each side: `**bold**`

**Need help?**
Reach out to the development team. They can review and fix any issues.
