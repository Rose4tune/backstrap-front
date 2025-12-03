import clsx from "clsx";

import BagstrapSymbolGradientLogo from "@public/logos/logo-bagstrap-symbol-gradient.svg";

export interface ErrorMessageProps {
  text?: React.ReactNode;
}

const ErrorMessage = (props: ErrorMessageProps): JSX.Element => {
  const { text } = props;

  return (
    <div className={clsx("flex-center flex-col gap-5 px-4 py-12", "lg:py-40")}>
      <BagstrapSymbolGradientLogo />
      <p className="text-primary-dark-light typo-body4 font-bold text-center">
        {text}
      </p>
    </div>
  );
};

export default ErrorMessage;
