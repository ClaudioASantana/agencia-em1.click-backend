# UI Requirements

## ADDED Requirements

### Visual Layout

#### Scenario: Product Page Elements

- **Given** the user is viewing an offer
- **Then** they should see the product image, title, original price (strikethrough), current price (highlighted), and description.
- **And** they should see the "Vendido por [Store Name]" card.

### User Actions

#### Scenario: Contact Actions

- **Given** the user clicks "Chamar no WhatsApp"
- **Then** a new tab opens with the `wa.me` link pre-filled with a message about the offer.

#### Scenario: Store Navigation

- **Given** the user clicks "Ir para a Loja"
- **Then** the `AgencyModal` (or Store Page) for that establishment opens.
