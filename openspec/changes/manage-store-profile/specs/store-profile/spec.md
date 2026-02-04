# Capability: Store Profile Management

## ADDED Requirements

### Requirement: Store owners can view their establishment profile data

Store owners must be able to view all their establishment information that appears in the public-facing modal (vitrine-frontend AgencyModal).

#### Scenario: Store owner views their profile

```
GIVEN an authenticated store owner user
WHEN they navigate to /store/profile
THEN they see their establishment data including:
  - Name
  - Description
  - Logo and cover image
  - Location and segment
  - Address and contact details (phone, whatsapp)
  - Business hours
  - Specialties list
  - Social media links (Facebook, Instagram, website)
  - Rating and review count
```

#### Scenario: Admin user cannot access store profile page

```
GIVEN an authenticated admin SaaS user (no establishmentId)
WHEN they attempt to navigate to /store/profile
THEN they are redirected to an appropriate page (e.g., /admin/dashboard)
AND they see a message that this page is for store owners only
```

---

### Requirement: Store owners can update their establishment profile

Store owners must be able to edit and save changes to their establishment profile data.

#### Scenario: Store owner updates basic information

```
GIVEN an authenticated store owner viewing their profile
WHEN they update the description field
AND click "Save Changes"
THEN the changes are persisted to the database
AND they see a success confirmation message
AND the updated data is reflected in the form
```

#### Scenario: Store owner updates contact details

```
GIVEN an authenticated store owner viewing their profile
WHEN they update phone, whatsapp, or address fields
AND click "Save Changes"
THEN the contact information is updated
AND the changes are reflected immediately
```

#### Scenario: Store owner updates business hours

```
GIVEN an authenticated store owner viewing their profile
WHEN they update the business hours field (e.g., "Seg-Sex: 9h-18h")
AND click "Save Changes"
THEN the hours are saved
AND displayed correctly in the profile preview
```

#### Scenario: Store owner manages specialties tags

```
GIVEN an authenticated store owner viewing their profile
WHEN they add or remove specialty tags
AND click "Save Changes"
THEN the specialties list is updated
AND reflected in the profile display
```

#### Scenario: Store owner updates social media links

```
GIVEN an authenticated store owner viewing their profile
WHEN they update Facebook, Instagram, or website URL fields
AND click "Save Changes"
THEN the social media links are saved
AND validated for correct URL format
```

---

### Requirement: Form validation prevents invalid data

The profile edit form must validate all inputs before allowing submission.

#### Scenario: Required fields validation

```
GIVEN an authenticated store owner editing their profile
WHEN they clear a required field (e.g., name or description)
AND attempt to save
THEN they see a validation error message
AND the save operation is prevented
```

#### Scenario: Phone number format validation

```
GIVEN an authenticated store owner editing contact details
WHEN they enter an invalid phone number format
AND attempt to save
THEN they see a format validation error
AND the save operation is prevented
```

#### Scenario: URL format validation for social links

```
GIVEN an authenticated store owner editing social media links
WHEN they enter an invalid URL (e.g., missing protocol or malformed)
AND attempt to save
THEN they see a URL validation error
AND are prompted to enter a valid URL
```

---

### Requirement: Store owners can upload profile images

Store owners must be able to upload and update their establishment logo and cover image.

#### Scenario: Store owner uploads logo image

```
GIVEN an authenticated store owner viewing their profile
WHEN they select a logo image file (PNG/JPG, max 2MB)
AND click upload
THEN the image is uploaded to the server
AND displayed as a preview in the form
AND the logo URL is updated when they save changes
```

#### Scenario: Store owner uploads cover image

```
GIVEN an authenticated store owner viewing their profile
WHEN they select a cover image file (PNG/JPG, max 5MB)
AND click upload
THEN the image is uploaded to the server
AND displayed as a preview
AND the cover image URL is updated on save
```

#### Scenario: Image upload size limit enforcement

```
GIVEN an authenticated store owner attempting to upload an image
WHEN the file exceeds the maximum allowed size
THEN they see an error message indicating the size limit
AND the upload is prevented
```

---

### Requirement: Authorization ensures data security

The system must prevent unauthorized access to establishment data.

#### Scenario: Store owner can only access their own establishment

```
GIVEN an authenticated store owner
WHEN they request establishment data via GET /establishments/me
THEN they receive only their own establishment data (matching user.establishmentId)
AND they cannot access other establishments' data
```

#### Scenario: Unauthorized update attempt is blocked

```
GIVEN an authenticated store owner
WHEN they attempt to update an establishment ID different from their own
THEN the request is rejected with a 403 Forbidden error
AND no data is modified
```

---

## Data Model

### Establishment (existing, being used)

```typescript
interface Establishment {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null; // cover image
  logo: string | null;
  rating: number;
  ratingCount: number;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  hours: string | null;
  specialties: string | null; // JSON array
  locationId: number;
  location: Location;
  segmentId: number;
  segment: Segment;
  users: User[];
  createdAt: Date;
  updatedAt: Date;
}
```

### UpdateEstablishmentDto (new)

```typescript
interface UpdateEstablishmentDto {
  description?: string;
  image?: string; // cover image URL after upload
  logo?: string; // logo URL after upload
  phone?: string;
  whatsapp?: string;
  address?: string;
  hours?: string;
  specialties?: string[]; // will be JSON.stringified
  socialFacebook?: string;
  socialInstagram?: string;
  socialWebsite?: string;
}
```

---

## API Endpoints

### GET` /establishments/me`

Returns the authenticated store owner's establishment data.

**Auth**: Required (JWT)  
**Response**: `200 OK` with Establishment object

### PATCH /establishments/me

Updates the authenticated store owner's establishment data.

**Auth**: Required (JWT)  
**Body**: `UpdateEstablishmentDto`  
**Response**: `200 OK` with updated Establishment object

### POST /establishments/me/upload-logo

Uploads a logo image for the establishment.

**Auth**: Required (JWT)  
**Body**: `multipart/form-data` with `file` field  
**Response**: `200 OK` with `{ logoUrl: string }`

### POST /establishments/me/upload-cover

Uploads a cover image for the establishment.

**Auth**: Required (JWT)  
**Body**: `multipart/form-data` with `file` field  
**Response**: `200 OK` with `{ imageUrl: string }`
