import { useCallback, useMemo, useState } from 'react';

import { useEditTimeTableMutation } from '@generated/graphql';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { OverlayPosition } from 'elements/Overlay';
import TimeTableList from './TimeTableList';
import TimeTableSettingOverlay from './TimeTableSettingOverlay';
import TimeTable from 'public/icons/timetable.svg';

interface ButtonsProps {}

function TimeTableButtons({}: ButtonsProps) {
  const { currentTimeTable, setCurrentTimeTable, timeTablesAction, timeTables } =
    useTimeTableContext();

  const [showTimeTableList, setShowTimeTableList] = useState(true);
  const [showTimeTableSetting, setShowTimeTableSetting] = useState(false);

  const [editTimeTable] = useEditTimeTableMutation();

  const TimeTableIcon = useMemo(
    () => <TimeTable className="[&>path]:fill-[#ffffff] w-[16px] h-[16px]" />,
    []
  );

  const handleShowTimeTableList = useCallback(
    (show: boolean) => () => {
      setShowTimeTableList(show);
      if (show) {
        setShowTimeTableSetting(false);
      }
    },
    []
  );

  const handleShowTimeTableSettingOverlay = useCallback(
    (show: boolean) => () => {
      setShowTimeTableSetting(show);
      if (show) {
        setShowTimeTableList(false);
      }
    },
    []
  );

  const handleClickFavorite = useCallback(() => {
    if (currentTimeTable) {
      editTimeTable({
        variables: {
          input: {
            uuid: currentTimeTable.uuid,
            isFavorite: !currentTimeTable.isFavorite
          }
        },
        onCompleted: data => {
          setCurrentTimeTable(data.editTimeTable);
          timeTablesAction?.upsert(currentTimeTable.uuid, data.editTimeTable);
        }
      });
    }
  }, [currentTimeTable, editTimeTable, setCurrentTimeTable, timeTablesAction]);

  return (
    <>
      {/* <div className="flex flex-wrap gap-2 ">
        <Button
          className={clsx(
            'flex-[1_1_35%] text-[14px] hover:bg-[#000000]/75 py-1.5',
            'transition-all duration-500 ease-in-out'
          )}
          buttonStyle={
            currentTimeTable?.isFavorite ? ButtonStyle.DarkHighlight : ButtonStyle.Dark
          }
          LeftIcon={StarIcon}
          text="메인 시간표"
          onClick={handleClickFavorite}
        />
        <Button
          className="flex-[1_1_35%] text-[14px] hover:bg-[#000000]/75"
          buttonStyle={ButtonStyle.Dark}
          LeftIcon={TimeTableIcon}
          text="시간표 목록"
          onClick={handleShowTimeTableList(!showTimeTableList)} //
        />
      </div> */}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TimeTableList
          show={showTimeTableList}
          placement={OverlayPosition.BOTTOM}
          onHide={handleShowTimeTableList(false)}
        />
      </div>

      <TimeTableSettingOverlay
        show={showTimeTableSetting}
        placement={OverlayPosition.BOTTOM}
        onHide={handleShowTimeTableSettingOverlay(false)}
      />
    </>
  );
}

export default TimeTableButtons;
