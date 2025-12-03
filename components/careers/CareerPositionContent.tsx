import ReactMarkdown from 'react-markdown';

import {
  CareerPositionContentContainer,
  CareerPositionContentStyledMarkdown
} from './CareerPositionContent.style';

const CareerPositionContent = ({ jobContent }: { jobContent: string }) => {
  return (
    <CareerPositionContentContainer>
      <CareerPositionContentStyledMarkdown>
        <ReactMarkdown>{jobContent}</ReactMarkdown>
      </CareerPositionContentStyledMarkdown>
    </CareerPositionContentContainer>
  );
};

export default CareerPositionContent;
