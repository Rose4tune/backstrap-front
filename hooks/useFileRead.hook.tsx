import React from "react";

export default function useFileRead(
  file?: File
): [boolean, FileReader["result"] | undefined] {
  const [isLoading, setIsLoading] = React.useState(false);

  const fileReader = React.useMemo(() => {
    const fileReader = new FileReader();

    fileReader.onloadstart = (_) => {
      setIsLoading(true);
    };

    fileReader.onloadend = (_) => {
      setIsLoading(false);
    };

    try {
      file && fileReader.readAsDataURL(file);

      return fileReader;
    } catch (err) {
      console.log(err);
    }

    return;
  }, []);

  return [isLoading, fileReader?.result];
}
