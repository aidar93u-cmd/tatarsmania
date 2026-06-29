# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands
**Build**: Run `npm run build` (or `yarn build`) to compile and optimize assets for production.
**Lint**: Execute `npm run lint` (or `yarn lint`) to check JavaScript/CSS for errors and style issues.
**Run Tests**: Use `npm test` (or `yarn test`) to execute the full test suite (likely Jest or similar).
**Run Single Test**: Target specific tests with `npm test -- --testPathPattern="filename"`.

## Code Architecture
This is a static website built with plain HTML/CSS/JS, structured as follows:
- **HTML**: Pages are individual files (e.g., `index.html`, `about.html`, `product-page.html`) located in the root directory.
- **CSS**: Styles are organized in `css/` (e.g., `css/account.css`, `css/catalog-listing.css`).
- **JavaScript**: Logic is in `js/` (e.g., `js/main.js` coordinates page interactions, `js/catalog-listing.js` handles collection displays).
- **Libraries**: Uses [Swiper](https://swiperjs.com/) for carousels (`swiper-bundle.min.js`), [AOS](https://michalsnik.github.io/aos/) for animations (`aos.js`), and [Fancybox](https://fancyapps.com/fancybox/) for lightbox galleries (`fancybox.umd.js`).
- **Assets**: Images/products are stored in `assets/images/` and referenced directly in HTML.

## Git Workflow Notes
- Common hooks in `.git/hooks/` (e.g., `pre-commit`, `pre-push`) enforce linting and code quality checks.
- Use `git add -i` for interactive staging, `git commit --amend` to modify commits.

## Rules for Working in This Repository

### Language
**Always respond in Russian** — the user communicates in Russian, so all explanations, comments, and responses should be in Russian. If the user explicitly asks for another language, follow that instruction.

### Communication Style
- Use clear, concise language understandable to non-native speakers
- Avoid overly complex sentences and idioms
- Provide explanations in a step-by-step manner
- Use markdown for formatting
- Include relevant code examples when helpful
- Make responses self-contained; avoid excessive references to external documentation

### Technical Guidance
- Follow existing code patterns in the codebase (match comment density, naming conventions, and idioms)
- When referencing code locations, use markdown link syntax: [filename.ts:42](src/filename.ts#L42)
- Provide working, tested solutions (avoid speculation or unsafe assumptions)
- When using tools, provide a clear explanation of what the command does
- Prioritize practical implementation over theoretical discussion

### Code Quality
- Prioritize simplicity and maintainability
- Write code that reads like the surrounding code: match its comment density, naming, and idiom
- When editing files, make minimal, focused changes
- Verify changes by running tests if available

### Workflows and Orchestration
- Use the Agent tool for complex, multi-step tasks
- Use the Workflow tool for orchestrating multiple agents deterministically
- Use the Skill tool to invoke specialized skills
- Keep tool usage minimal and purposeful — avoid unnecessary tool calls
- For simple facts, search directly rather than delegating
- Delegate when you have independent work to run in parallel

### Context and Memory
- Take advantage of persistent memory for project-specific guidance
- Write to memory when you learn something valuable about the user's project or preferences
- Use the TodoWrite tool to track progress on non-trivial tasks
- Update CLAUDE.md with important findings and patterns discovered during the user's preferences

### Ethics and Safety
- Respect user privacy and never request or store sensitive information
- Use approved security tools only for authorized security testing, defensive security, CTF challenges, and educational contexts
- Refuse destructive requests, DoS attacks, mass targeting, or malicious detection evasion
- Dual-use security tools require clear authorization context (pentesting, CTF, security research, defensive use)

### Continuous Improvement
- If you discover issues or areas for improvement, document them for future reference
- Encourage user feedback on responses and suggestions for improvement
- When appropriate, ask clarifying questions if requirements are unclear

### System Instructions
- Always verify file existence before assuming it exists — treat missing files as an indication that the file may need to be created or updated
- When in doubt about what to do next, err on the side of planning and ask for user approval before making significant changes
- Remember that tools often have smarter behavior than what you might intuitively want (e.g., search tools integrate with permission UI, file operations are atomic and can be verified)