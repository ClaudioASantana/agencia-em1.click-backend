# Design: Manage My Stores UI

## Visual Design

Based on the provided reference, the UI uses a clean, card-based layout with a "crachá" (ID card) aesthetic.

### Layout Structure

1.  **Page Header**:
    - Title: "Gerenciar Minhas Unidades"
    - Subtitle: "Visualize e administre todos os seus pontos de venda cadastrados."
    - Action: "Adicionar Nova Loja" (Green Button, Right-aligned).
2.  **Filter Bar** (Card-like container):
    - Input: "Nome da Unidade" (Icon: Search).
    - Input: "Cidade/Bairro" (Icon: MapPin).
    - Select: "Status" (Default: "Todos os Status").
    - Action: "Filtrar" (Black Button).
    - Action: Refresh Icon Button.
3.  **Content Grid**:
    - Responsive Grid (1 column mobile, 2 tablet, 3 desktop).
    - **Store Card**:
      - **Header**: Left: Store Logo/Icon (Square with rounded corners). Right: Status Badge (e.g., "ATIVO" green, "INATIVO" gray, "MANUTENÇÃO" yellow).
      - **Body**:
        - Store Name (Bold).
        - Address (Icon: MapPin, text-gray-500).
        - Stats Row: "Encartes" (Count + "Ativos"), "Visitas" (Count).
      - **Footer**: Divided into 3 segments for actions.
        - Left: View (Eye Icon).
        - Center: Edit (Pencil Icon).
        - Right: Delete (Trash Icon).
    - **Add Unit Card** (Placeholder):
      - Dashed border.
      - Centered "Plus" icon.
      - Text: "Adicionar Unidade".
      - Subtext: "Cadastre uma nova filial em sua rede."

## Component Mapping (Shadcn/Vue)

- **Card**: `Card`, `CardHeader`, `CardContent`, `CardFooter`.
- **Inputs**: `Input` with `prefix-icon` slot.
- **Select**: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`.
- **Button**: `Button` (variants: default, outline, ghost).
- **Badge**: `Badge` (custom variants for status colors).
- **Icons**: `LucideVueNext` (`Search`, `MapPin`, `Filter`, `RotateCcw`, `Plus`, `Eye`, `Edit2`, `Trash2`, `Store`).

## UX Patterns

- **Hover Effects**: Cards should have a subtle hover lift or border color change.
- **Feedback**: Delete action should prompt confirmation.
- **Empty State**: If no stores found, show the "Add Unit" card prominently or a specific empty state message.
