# UI Components Library

Интегрированные UI компоненты из src/components, адаптированные для работы без Zustand.

## Базовые компоненты

### BaseButton
Универсальная кнопка с различными стилями.

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
Круглая кнопка для иконок.

```tsx
import { CircleButton } from './ui';

<CircleButton onClick={handleClick} label="Settings">
  ⚙️
</CircleButton>
```

### Textarea
Текстовое поле с поддержкой Enter для отправки.

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
Однострочное текстовое поле.

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
Переключатель (toggle switch).

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
Анимированный индикатор загрузки.

```tsx
import { Loader } from './ui';

<Loader
  size={32}
  color="primary" // primary | white | green | black
  visible={isLoading}
/>
```

### ProgressBar
Прогресс-бар с таймером.

```tsx
import { ProgressBar } from './ui';

<ProgressBar
  duration={5000}
  onComplete={handleComplete}
  isText={true}
/>
```

### Space
Компонент для добавления отступов.

```tsx
import { Space } from './ui';

<Space size={20} /> // вертикальный отступ
<Space size={20} horizontal /> // горизонтальный отступ
```

## Использование

Все компоненты экспортируются из `./ui/index.ts`:

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

## Стили

Компоненты используют CSS модули из `src/components/ui/*/styles.module.css`.
Убедитесь, что все стили правильно подключены в вашем проекте.

