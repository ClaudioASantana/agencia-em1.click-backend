# Spec: consumer-follow

## ADDED Requirements

#### Requirement: Follow Establishment

#### Scenario: Successfully following an establishment

- Given I am a logged-in consumer
- When I click follow on a store card
- Then the store is added to my follows list

#### Scenario: Successfully unfollowing an establishment

- Given I follow a store
- When I click unfollow on the store card
- Then the store is removed from my follows list

#### Requirement: Filter Followed Establishments

#### Scenario: Applying the follow filter

- Given I follow a store
- When I apply the "Minhas Lojas" filter
- Then I see only followed stores
