import padStart from 'lodash/padStart';
import uniqueId from 'lodash/uniqueId';
import addMinutes from 'date-fns/addMinutes';
import clsx from 'clsx';
import React from 'react';
import { useField, useFormikContext } from 'formik';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { isNotEmpty, isNotNil } from '@utils/common/base.util';
import { formatDateDisplay } from '@utils/common/date.util';
import { decodeDeadline, encodeDeadlineValues } from '@utils/bagstrap/board/vote.util';

import { DATE_FORMAT_DISPLAY_YYYY_MM_DD_D_A_HH_MI } from '@constants/common/date.constant';
import { BOARD_POST_VOTE_VSCHEMA } from '@constants/vschema/board/board-post-vote.vschema.constant';

import { VoteRegisterDtoInput } from '@generated/graphql';

import MenuIcon from '@public/icons/[board]vote-menu.svg';
import CloseIcon from '@public/icons/close.svg';

import BaseButton from '@common/button/BaseButton';
import BaseFormIndex from '@common/form';
import BaseFormTextField from '@common/form/BaseFormTextField';
import BaseFormMultilineTextField from '@common/form/BaseFormMultilineTextField';
import BaseFormButton from '@common/form/BaseFormButton';
import SwitchInput from '@common/input/SwitchInput';
import MuiDatePickerInput from '@common/input/mui/MuiDatePickerInput';
import MuiSelectInput from '@common/input/mui/MuiSelectInput';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

export interface BoardPostVoteRegisterFormProps {
  formButtonRef?: any;

  initialValues?: VoteRegisterDtoInput;

  onSubmit?: (values: VoteRegisterDtoInput) => void;
}

export type BoardPostVoteRegisterFormDeadlineValues = {
  date: Date | string;

  ampm: string;

  hour: number;

  minute: number;
};

export type BoardPostVoteRegisterFormValues = Pick<VoteRegisterDtoInput, 'title'> & {
  items: {
    id: string;
    value: string;
  }[];

  deadlineValues?: BoardPostVoteRegisterFormDeadlineValues;

  isMultiSelect?: boolean;
};

const BoardPostVoteRegisterForm = (
  props: BoardPostVoteRegisterFormProps
): JSX.Element => {
  const { formButtonRef, onSubmit, initialValues } = props;

  const initialItems = React.useMemo(
    () =>
      Array.from(Array(3)).map(() => ({
        id: uniqueId(),
        value: ''
      })),
    []
  );

  return (
    <BaseFormIndex<BoardPostVoteRegisterFormValues>
      onSubmit={({ title, items, deadlineValues, isMultiSelect }) => {
        onSubmit?.call(null, {
          title,
          contents: items
            .filter(({ value }) => isNotEmpty(value))
            .map(({ value }) => value),
          numChoice: isMultiSelect ? items.length : 1,
          deadline: deadlineValues && encodeDeadlineValues(deadlineValues)
        });
      }}
      validationSchema={BOARD_POST_VOTE_VSCHEMA}
      validateOnMount={false}
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={{
        title: initialValues?.title || '',
        items:
          initialValues?.contents.filter(isNotNil).map(content => ({
            id: uniqueId(),
            value: content
          })) ?? initialItems,
        deadlineValues: initialValues?.deadline && decodeDeadline(initialValues.deadline),
        isMultiSelect: !(
          initialValues?.numChoice == null || initialValues.numChoice === 1
        )
      }}
    >
      {/* title */}
      <BoardPostVoteTitleFormField />

      {/* items */}
      <hr className="border-[#E5E5EB] border-opacity-50 my-3" />
      <BoardPostVoteItemsField />

      {/* etc */}
      <hr className="border-[#E5E5EB] border-opacity-50 my-4" />
      <div className="space-y-4">
        <BoardPostVoteMultiSelectFormField />
        <BoardPostVoteDeadlineFormField />
      </div>

      <BaseFormButton className="!hidden w-0 h-0" ref={formButtonRef} />
    </BaseFormIndex>
  );
};

export default BoardPostVoteRegisterForm;

const BoardPostVoteTitleFormField = (): JSX.Element => {
  const [, { touched, value, error }] = useField('title');

  return (
    <div className="space-y-1">
      <BaseFormMultilineTextField
        name="title"
        maxRows={2}
        placeholder="투표제목"
        inputProps={{
          className: '!font-bold !text-xl !px-0 text-black'
        }}
      />
      {touched && error && !value && <HelperMessage type="error" text={error} />}
    </div>
  );
};

const BoardPostVoteItemsField = (): JSX.Element => {
  const formik = useFormikContext();

  const [{ value: items = [] }, { touched, error }, helper] =
    useField<{ id: string; value: string }[]>('items');

  const [droppableRef, setDroppableRef] = React.useState<HTMLDivElement | null>(null);

  const itemsRef = React.useRef(items);

  React.useEffect(() => {
    if (items.length > itemsRef.current.length) {
      droppableRef?.scrollTo({
        top: droppableRef.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [items.length]);

  // NOTE: 아래 코드 사용 시 무한루프에 빠짐.
  // React.useEffect(() => {
  //   formik.validateField("items");
  // }, [items]);

  return (
    <div className="space-y-2">
      <DragDropContext
        onDragEnd={dropResult => {
          if (dropResult.destination) {
            // reorder
            const newItems = Array.from(items);

            const [removed] = newItems.splice(dropResult.source.index, 1);

            newItems.splice(dropResult.destination.index, 0, removed);

            helper.setValue(newItems);
          }
        }}
      >
        <Droppable droppableId="droppable">
          {(provided, _) => (
            <div
              {...provided.droppableProps}
              ref={ref => {
                provided.innerRef(ref);
                setDroppableRef(ref);
              }}
              className="overflow-y-auto max-h-40 md:max-h-80"
            >
              {items.map((item, index) => {
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, _) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={provided.draggableProps.style}
                        className={clsx(
                          'flex-between gap-2.5 border border-[#E5E5EB] rounded-[4px] px-3 mt-2'
                        )}
                      >
                        <BaseFormTextField
                          name={`items[${index}].value`}
                          placeholder="항목 입력"
                          className="h-10"
                          inputProps={{
                            className:
                              '!font-medium !text-sm placeholder:text-grey2 !px-0'
                          }}
                        />
                        <div className="flex-center gap-[9px]">
                          <BaseButton
                            onClick={() => {
                              itemsRef.current = items;

                              const newItems = Array.from(items);

                              newItems.splice(index, 1);

                              helper.setValue(newItems);
                            }}
                          >
                            <CloseIcon />
                          </BaseButton>
                          <div {...provided.dragHandleProps} className="flex-center">
                            <MenuIcon />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <BaseButton
        fullWidth
        onClick={() => {
          itemsRef.current = items;

          helper.setValue(
            items.concat({
              id: uniqueId(),
              value: ''
            })
          );
        }}
        className="border border-dashed border-grey5 rounded-[4px] bg-grey1 text-grey5 typo-body6 font-medium h-10"
      >
        항목 추가
      </BaseButton>

      {touched && error && <HelperMessage type="error" text={error} />}
    </div>
  );
};

const BoardPostVoteMultiSelectFormField = (): JSX.Element => {
  const [{ value: isMultiSelect = false }, , helper] = useField<boolean>('isMultiSelect');

  return (
    <div className="leading-none flex-between">
      <span className="font-medium typo-body6">복수 선택</span>
      <SwitchInput
        checked={isMultiSelect}
        onChange={checked => {
          helper.setValue(checked);
        }}
        size="md"
      />
    </div>
  );
};

const BoardPostVoteDeadlineFormField = (): JSX.Element => {
  const formik = useFormikContext<BoardPostVoteRegisterFormValues>();

  const { deadlineValues } = formik.values;

  const { deadlineValues: error } = formik.errors;

  const [hasDeadline, setHasDeadline] = React.useState(!!deadlineValues);

  React.useEffect(() => {
    if (hasDeadline) {
      formik.setValues(prev => ({
        ...prev,
        deadlineValues: deadlineValues ?? decodeDeadline(addMinutes(new Date(), 30))
      }));
    } else {
      formik.setFieldValue('deadlineValues', undefined);
    }
  }, [hasDeadline]);

  React.useEffect(() => {
    if (deadlineValues) {
      formik.validateField('deadlineValues');
    }
  }, [deadlineValues]);

  return (
    <div className="space-y-4">
      <div className="leading-none flex-between">
        <span className="font-medium typo-body6">마감시간 설정</span>
        <SwitchInput
          checked={hasDeadline}
          onChange={checked => {
            setHasDeadline(checked);
          }}
          size="md"
        />
      </div>

      {hasDeadline && deadlineValues && (
        <div className="space-y-2.5 animate-fade-in">
          <div className="flex items-center gap-1 font-bold leading-none text-point-blue typo-body8">
            <span>
              투표 마감 시간 :{' '}
              {formatDateDisplay(
                encodeDeadlineValues(deadlineValues),
                DATE_FORMAT_DISPLAY_YYYY_MM_DD_D_A_HH_MI
              )}
            </span>
          </div>

          <div className="gap-1 flex-between">
            <MuiDatePickerInput
              value={deadlineValues.date}
              onChange={evt => {
                formik.setFieldValue('deadlineValues.date', new Date(evt.target.value));
              }}
              onOpen={() => {
                document
                  .querySelector("#headlessui-portal-root div[role='dialog']")
                  ?.scrollTo({
                    top: window.innerHeight
                    // behavior: "smooth",
                  });
              }}
            />
            <MuiSelectInput
              value={deadlineValues.ampm}
              onChange={evt => {
                formik.setFieldValue('deadlineValues.ampm', evt.target.value);
              }}
              options={[
                {
                  label: '오전',
                  value: 'am'
                },
                {
                  label: '오후',
                  value: 'pm'
                }
              ]}
            />
            <MuiSelectInput
              value={deadlineValues.hour}
              onChange={evt => {
                formik.setFieldValue('deadlineValues.hour', Number(evt.target.value));
              }}
              options={Array.from(Array(12)).map((_, i) => ({
                label: `${padStart(String(i + 1), 2, '0')}시`,
                value: i + 1
              }))}
            />
            <MuiSelectInput
              value={deadlineValues.minute}
              onChange={evt => {
                formik.setFieldValue('deadlineValues.minute', Number(evt.target.value));
              }}
              options={Array.from(Array(60)).map((_, i) => ({
                label: `${padStart(String(i), 2, '0')}분`,
                value: i
              }))}
            />
          </div>
          {error && <HelperMessage type="error" text={error as string} />}
        </div>
      )}
    </div>
  );
};
