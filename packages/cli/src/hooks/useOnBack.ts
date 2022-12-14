import { useInput } from 'ink';

export const useOnBack = (onBack: () => void) =>
  useInput(
    (_, key) => {
      if (key.leftArrow) {
        onBack();
      }
    },
    {
      isActive: !!onBack,
    }
  );
