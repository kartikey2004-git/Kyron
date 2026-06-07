````text
You are a senior full-stack engineer working on a production-grade repository integration system.

Implement repository usage limits and usage tracking when a user connects a new repository.

## Tasks

### 1. Enforce Repository Limits

Before allowing a repository to be connected, verify whether the user is allowed to connect additional repositories based on their current plan and usage.

Requirements:
- Fetch the authenticated user.
- Fetch the user's current subscription/plan.
- Determine the maximum number of repositories allowed for that plan.
- Check the user's current connected repository count.
- Prevent repository connection if the limit has been reached.
- Return a meaningful error message.
- Do not create the repository record if the limit is exceeded.
- Ensure validation happens server-side.

Example:

```ts
if (currentRepoCount >= plan.maxRepositories) {
  throw new Error(
    "Repository limit reached. Upgrade your plan to connect more repositories."
  );
}
````

---

### 2. Increment Repository Usage Tracking

After a repository is successfully connected:

Requirements:

* Increment the user's repository usage count.
* Update usage atomically to avoid race conditions.
* Ensure usage tracking remains accurate if multiple repositories are connected simultaneously.
* Perform the repository creation and usage update within a database transaction.

Example:

```ts
await prisma.$transaction([
  prisma.repository.create(...),
  prisma.user.update({
    where: { id: userId },
    data: {
      repositoryCount: {
        increment: 1,
      },
    },
  }),
]);
```

---

### 3. Handle Repository Deletion

To keep usage tracking accurate:

Requirements:

* Decrement repository usage count when a repository is removed.
* Prevent negative counts.
* Keep repository count synchronized with actual connected repositories.
* Use transactions for consistency.

Example:

```ts
repositoryCount: {
  decrement: 1,
}
```

---

## Technical Requirements

* Use Prisma ORM.
* Use TypeScript.
* Use database transactions where multiple writes occur.
* Avoid race conditions.
* Keep all validation server-side.
* Return typed errors/responses.
* Follow existing project architecture and service patterns.
* Keep implementation production-ready and scalable.

---

## Edge Cases

Handle:

* User has no subscription.
* User is on a free plan.
* Unlimited repository plans.
* Duplicate repository connection attempts.
* Simultaneous repository connection requests.
* Repository deletion after partial failures.
* Repository count becoming inconsistent with actual repository records.

---

## Deliverables

1. Repository limit validation logic.
2. Plan-based repository quota enforcement.
3. Atomic repository usage increment implementation.
4. Atomic repository usage decrement implementation.
5. Transaction-safe database operations.
6. Proper error handling and user-friendly messages.
7. Fully typed TypeScript implementation.
8. Removal of all TODOs related to repository limits and usage tracking.

```
```
