import clsx from "clsx";

export interface NoticeInfoProps {
  name?: string

  responsive?: boolean
}

const NoticeInfo = (props: NoticeInfoProps): JSX.Element => {
  const { name, responsive = true } = props;

  return (
    <div className={clsx("flex-between pt-4", "md:px-3")}>
      <div
        className={clsx(
          "flex items-center gap-x-1",
          "text-grey5 typo-body9 leading-tight truncate",
          responsive && "md:typo-body7"
        )}
      >
        <b>가방끈지기</b>
      </div>
    </div>
  );
};

export default NoticeInfo;
