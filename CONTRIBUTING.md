# Contributing to Link Shortener

Thanks for taking the time to contribute.

This project is small and straightforward, so the best contributions are focused, well-tested, and easy to review.

## Before you start

Please keep these expectations in mind:

- Keep pull requests small and focused.
- Do not add unnecessary dependencies.
- Avoid unrelated formatting or refactoring in the same PR.
- Make sure your changes work locally before opening a pull request.
- Update documentation when behavior or setup changes.

## Local setup

1. Fork the repository.
2. Clone your fork locally.
3. Install dependencies.
4. Configure the database connection in `.env`.
5. Generate the Prisma client and sync the schema.

```bash
git clone <your-fork-url>
cd link-shortner
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Recommended workflow

Create a branch for your work:

```bash
git checkout -b feature/short-description
```

Make your changes, then run the project checks:

```bash
npm run lint
npm run pretty
```

Commit with a clear message:

```bash
git commit -m "Add slug validation to API route"
```

Push your branch and open a pull request against the main repository.

## Pull request checklist

Before submitting a PR, please confirm that:

- your change solves a specific problem
- the code builds and runs locally
- `npm run lint` passes
- formatting has been applied where needed
- any related documentation has been updated
- the PR description explains what changed and why

## Code guidelines

- Prefer TypeScript-safe changes.
- Reuse existing patterns before introducing new abstractions.
- Preserve the current project structure unless there is a strong reason to change it.
- Keep API behavior explicit and easy to understand.

## Syncing with the main repository

If your branch falls behind, add the original repository as an upstream remote and sync before continuing:

```bash
git remote add upstream <original-repo-url>
git fetch upstream
git merge upstream/main
```

If the default branch for the original repository is different, replace `main` with the correct branch name.

## Good first contribution ideas

- improve the homepage UI
- add a form to create short links
- add URL and slug validation
- improve middleware or API error handling
- add tests for the API route and redirect flow

## Questions or suggestions

If you are planning a larger change, open an issue first or describe the proposal clearly in your pull request so maintainers can review it with the right context.
