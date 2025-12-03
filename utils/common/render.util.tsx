import React from 'react';

export const renderLineBreak = (text: string, truncate?: number): React.ReactNode => {
  var refinedText = text;
  if (text.startsWith('\n')) {
    refinedText = text.substring(1);
  }
  const lines = text.split('\n');
  if (lines.length > 0 && lines[0] == '') {
    lines.shift();
  }

  return refinedText
    .split('\n')
    .slice(0, truncate)
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
};
