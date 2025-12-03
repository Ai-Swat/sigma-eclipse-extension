# UI Components Library

Simple UI components for the extension.

## Base Components

### BaseButton
Universal button with various styles.

```tsx
import { BaseButton } from './ui';

<BaseButton
  color="primary" // primary | secondary | red | outline | grey | transparent
  size="m" // xs | s | default | m | l | xxs
  onClick={handleClick}
  isDisabled={false}
  label="Click me"
>
  Button Text
</BaseButton>
```

### CircleButton
Circular button for icons.

```tsx
import { CircleButton } from './ui';

<CircleButton onClick={handleClick} label="Settings">
  ⚙️
</CircleButton>
```

### Textarea
Text field with Enter key support for submission.

```tsx
import { Textarea } from './ui';

<Textarea
  value={text}
  onChange={setText}
  onEnter={handleSubmit}
  placeholder="Type message..."
  rows={1}
/>
```

### TextInput
Single-line text field.

```tsx
import { TextInput } from './ui';

<TextInput
  value={text}
  onChange={setText}
  onEnter={handleSubmit}
  placeholder="Enter text..."
  isVisibleError={hasError}
  textError="Error message"
/>
```

### CheckboxToggle
Toggle switch.

```tsx
import { CheckboxToggle } from './ui';

<CheckboxToggle
  checked={isEnabled}
  onChange={setIsEnabled}
  disabled={false}
>
  Enable feature
</CheckboxToggle>
```

### Loader
Animated loading indicator.

```tsx
import { Loader } from './ui';

<Loader
  size={32}
  color="primary" // primary | white | green | black
  visible={isLoading}
/>
```

### ProgressBar
Progress bar with timer.

```tsx
import { ProgressBar } from './ui';

<ProgressBar
  duration={5000}
  onComplete={handleComplete}
  isText={true}
/>
```

### Space
Component for adding spacing.

```tsx
import { Space } from './ui';

<Space size={20} /> // vertical spacing
<Space size={20} horizontal /> // horizontal spacing
```

## Usage

All components are exported from `./ui/index.ts`:

```tsx
import {
  BaseButton,
  CircleButton,
  Textarea,
  TextInput,
  CheckboxToggle,
  Loader,
  ProgressBar,
  Space
} from './ui';
```

## Styles

Components use CSS modules from `src/components/ui/*/styles.module.css`.
Make sure all styles are properly imported in your project.
