import { LinkCopyToastContainer } from './LinkCopyToast.style';

interface LinkCopyToastProps {
  message: string;
  isVisible: boolean;
}

const LinkCopyToast = ({ message, isVisible }: LinkCopyToastProps) => {
  return <LinkCopyToastContainer isVisible={isVisible}>{message}</LinkCopyToastContainer>;
};

export default LinkCopyToast;
