import toast from 'react-hot-toast';

export const toastStyles = {
  padding: 8,
  borderRadius: 12,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.07)',
  background: 'var(--background-neutral-global-secondary)',
  minHeight: 40,
  maxHeight: 55,
  gap: 8,
  margin: 0,
  boxShadow:
    '0 -1 19.4 0 rgba(0, 0, 0, 0.04), 0 12 20.9 0 rgba(0, 0, 0, 0.06), 0 3 4.3 0 rgba(0, 0, 0, 0.07)',
  color: 'var(--text-neutral-primary)',
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: -0.15,
  overflow: 'hidden',
};

export const addToastError = (errorText: string) => {
  toast.error(errorText, {
    id: errorText,
    duration: 3000,
    style: toastStyles,
  });
};

export const addToastSuccess = (text: string) => {
  toast.success(text, {
    id: text,
    duration: 3000,
    style: toastStyles,
  });
};
