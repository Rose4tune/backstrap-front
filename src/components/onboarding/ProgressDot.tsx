export default function ProgressDot({ step }: { step: number }) {
  const defaultStyle = 'w-[8px] h-[8px] rounded-full bg-gray-30';
  const nowStepStyle = defaultStyle + ' bg-normal';
  return (
    <div className="flex gap-[8px]">
      {[...Array(5)].map((_, idx) => {
        if (idx === step) return <div key={idx} className={nowStepStyle} />;
        else return <div key={idx} className={defaultStyle} />;
      })}
    </div>
  );
}
