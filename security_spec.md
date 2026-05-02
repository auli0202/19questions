# Security Specification - Proverb App

## Data Invariants
- A user can only access their own progress data (`/users/{userId}`).
- Data must have a strict structure (`starred`, `status`, `srs`, `dailyLog`, `recent`).
- Document IDs must be valid UIDs.

## The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Attempt to write to `/users/someone_else` as `user_1`.
2. **Identity Spoofing (Create)**: Attempt to create `/users/user_2` with `user_1` auth.
3. **Shadow Update**: Attempt to add an `isAdmin` field to the user profile.
4. **ID Poisoning**: Attempt to use a 2KB string as a document ID.
5. **Type Poisoning**: Attempt to set `starred` as a `string` instead of a `map`.
6. **Resource Exhaustion**: Attempt to write a `recent` array with 10,000 items.
7. **Unauthenticated Read**: Attempt to read any user profile without logging in.
8. **Unauthenticated Write**: Attempt to write to any user profile without logging in.
9. **Partial Write (Missing Field)**: Attempt to create a document without the `status` field.
10. **State Shortcut**: (Not highly applicable here, but maybe setting status to an invalid string like 'god_mode').
11. **Email Spoofing**: Attempt to access data by spoofing a token email (if we used email gates).
12. **Blanket List Read**: Attempt to `list` all users in the `/users` collection.

## Test Results Expectation
All of the above payloads should return `PERMISSION_DENIED`.
