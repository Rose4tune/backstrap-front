import { FaGroupSummaryFragment } from '@generated/graphql';

import DropdownSelectInput from '@common/input/DropdownSelectInput';
import { useMemo } from 'react';
import { useStore } from '@stores/useStore.hook';

export interface BoardCategorySelectionInputProps {
  faGroups: FaGroupSummaryFragment[];

  uuid?: string;

  onChange?: (uuid: string) => void;

  blacklist?: string[];
}

const BoardCategorySelectionInput = (props: BoardCategorySelectionInputProps) => {
  const { faGroups, uuid, onChange, blacklist } = props;
  const { MeStore } = useStore();
  const isAdmin = useMemo(() => MeStore.isAdmin, [MeStore.isAdmin]);
  return (
    <div className="">
      <div className="flex-between h-8 mt-2">
        <span className="text-point-blue font-bold text-[13px]">CATEGORY</span>
      </div>
      <div className="py-2">
        <DropdownSelectInput
          placeholder="카테고리 선택"
          options={faGroups.map(faGroup => ({
            label: faGroup.name ?? faGroup.uuid,
            value: faGroup.uuid,
            isDisabled: isAdmin
              ? faGroup.name == '오늘의 베스트끈'
              : blacklist?.includes(faGroup.uuid)
          }))}
          value={uuid}
          onChange={evt => {
            onChange?.(evt.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default BoardCategorySelectionInput;
