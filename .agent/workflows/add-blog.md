---
description: Automatically convert plain text to a structured blog post and add it to the portfolio.
---

1. **Extract Content**: Parse the user provided text to identify the Title, Technical Category (e.g., "Web Protocols"), and Body.
2. **Create Markdown File**: Create a new file `docs/[title-slug].md`.
   - Use standard Markdown headers and formatting.
   - Add a sequence or graph diagram if the content describes a flow.
3. **Update Blogs Overview**: Edit `docs/blogs.md` to include the new post.
   - Add a `## [Title]` section.
   - Include the **Technical Deep-Dive** label.
   - Include a short summary and the `{ .md-button }` link to the new file.
4. **Update Navigation**: Add the new page to the `Blogs` section in `mkdocs.yml`.
5. **Notify User**: Confirm completion and provide the local URL.
