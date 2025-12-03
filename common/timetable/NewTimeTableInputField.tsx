import { ChangeEvent, useCallback, useState } from 'react';
import clsx from 'clsx';

import BaseTextInput from '@common/input/BaseTextInput';
import Button, { ButtonStyle } from 'elements/Button';
import { useRegisterTimeTableMutation } from '@generated/graphql';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';

const inputStyles = { className: 'px-1' };

interface NewTimeTableInputFieldProps {
  onHide: () => void;
}

function NewTimeTableInputField({ onHide }: NewTimeTableInputFieldProps) {
  const { currentTimeTableTemplate, setCurrentTimeTable, timeTablesAction } =
    useTimeTableContext();

  const [newTableName, setNewTableName] = useState<string>('');

  const [registerTimeTable] = useRegisterTimeTableMutation();

  const handleInputTimeTableName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTableName(e.target.value);
  }, []);

  const handleCreateNewTimeTable = useCallback(() => {
    if (!!newTableName) {
      if (!currentTimeTableTemplate?.year || !currentTimeTableTemplate?.semester) return;
      registerTimeTable({
        variables: {
          input: {
            year: currentTimeTableTemplate?.year ?? 0,
            semester: currentTimeTableTemplate?.semester ?? 0,
            name: newTableName
          }
        },
        onCompleted: data => {
          const newTimeTable = data?.registerTimeTable;
          if (newTimeTable) {
            setCurrentTimeTable(newTimeTable);
            onHide();
            timeTablesAction?.add(newTimeTable.uuid, newTimeTable);
          }
        }
      });
    }
  }, [
    currentTimeTableTemplate?.semester,
    currentTimeTableTemplate?.year,
    newTableName,
    timeTablesAction,
    registerTimeTable,
    setCurrentTimeTable,
    onHide
  ]);

  return (
    <div className="w-full animate-[fade-in_0.2s_ease-in-out]">
      <div className="text-[14px] text-[#BFBFBF] select-none">새 시간표 이름</div>
      <BaseTextInput
        className={clsx(
          'w-full',
          'border-b border-[#E5E5EB]',
          'focus:border-[#000000] focus:placeholder:text-[#a9a9a9]',
          'placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out',
          'transition-all duration-300 ease-in-out',
          'px-1 py-2',
          'text-[16px]'
        )}
        name="새 시간표 이름"
        value={newTableName}
        onChange={handleInputTimeTableName}
        autoComplete="off"
        placeholder="예) 1픽 시간표"
        inputProps={inputStyles}
      />
      <div className="flex justify-end mt-2">
        <Button
          className="text-[14px] py-1.5 border-[2px] px-2.5 py-1 tracking-wide"
          buttonStyle={!!newTableName ? ButtonStyle.Activate : ButtonStyle.Disabled}
          text="새 시간표 생성"
          onClick={handleCreateNewTimeTable}
        />
      </div>
    </div>
  );
}

export default NewTimeTableInputField;
