# Registration Specs

## ADDED Requirements

### Requirement: Public Store Owner Registration

The system MUST allow unauthenticated users to register as Store Owners.

#### Scenario: Successful Registration

Given I am an unauthenticated user on the Vitrine home page
When I click "Cadastrar Loja"
And I fill the registration form with valid data
Then a new user account is created with role "STORE_OWNER"
And I receive a success message

#### Scenario: Password Mismatch

Given I am filling the registration form
When I enter passwords that do not match
Then I see a validation error "Senhas não conferem"
And the form is not submitted
