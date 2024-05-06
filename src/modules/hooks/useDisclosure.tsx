import { useState } from "react";

const useDisclosure = () => {
  const [open, setOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const toggle = () => {
    setOpen((curr) => !curr);
  };

  const onSuccess = (callback?: () => void) => {
    setIsSuccess(true);

    setTimeout(() => {
      setOpen(false);
      setIsSuccess(false);
      callback && callback();
    }, 3000);
  };

  return {
    open,
    onOpen,
    onClose,
    toggle,
    isSuccess,
    onSuccess,
  };
};

export default useDisclosure;
