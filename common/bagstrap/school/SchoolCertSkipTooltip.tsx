import clsx from "clsx";

import TooltipBox from "@public/images/[school]tooltip-box.svg";

export interface SchoolCertSkipTooltipProps extends BaseProps {}

const SchoolCertSkipTooltip = (
  props: SchoolCertSkipTooltipProps
): JSX.Element => {
  const { className } = props;

  return (
    <div
      className={clsx(
        "absolute w-[205px] h-[89px] p-3 z-50",
        "flex flex-col justify-between items-center",
        className
      )}
    >
      <TooltipBox className="absolute inset-0" />
      <p className="text-primary typo-body9 font-bold z-50">
        학교인증을 나중으로 미루시겠어요?
        <br />
        가방끈은 학교 인증을 완료한 유저들을 위해
        <br />
        지속적인 편의 기능을 추가하고 있습니다.
      </p>
      <p className="text-grey3 typo-body9 font-bold z-50">
        *가입 후 마이페이지에서 진행 가능합니다.
      </p>
    </div>
  );
};

export default SchoolCertSkipTooltip;

{
}
