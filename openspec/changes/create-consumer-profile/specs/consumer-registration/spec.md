# Spec: Consumer Registration

## ADDED Requirements

#### Requirement: Registration Page

The `vitrine-frontend` MUST provide a public registration page at `/register` that collects Name, Email, and Password.

#### Scenario: Successful Registration

- Given a user enters valid credentials.
- When they submit.
- Then a `CONSUMER` account is created.
