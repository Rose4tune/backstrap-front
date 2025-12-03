import {
  ChangeEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import clsx from 'clsx';

import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { FilterLabels } from '@constants/timetable.constant';
import Close from 'public/icons/close.svg';
import {
  useCategoriesLazyQuery,
  CategoryRefViewDto,
  useSchoolCoursesLazyQuery,
  SchoolCourseSortType,
  SchoolCourseEntityView
} from '@generated/graphql';
import { useStore } from '@stores/useStore.hook';

interface FilteringProps {}

function Filtering({}: FilteringProps) {
  const {
    campus,
    setCampus,
    college,
    setCollege,
    major,
    setMajor,
    search,
    setSearch,
    sorting,
    setSorting,
    setSchoolCourses
  } = useTimeTableContext();
  const { MeStore } = useStore();

  const buttonsRef = useRef<HTMLDivElement>(null);
  const [showFilteringOverlay, setShowFilteringOverlay] = useState(false);
  const [categories, setCategories] = useState<CategoryRefViewDto[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterLabels>(FilterLabels.college);
  const [isSearchActivate, setIsSearchActivate] = useState(false);
  // NOTE: 연세대학교만 캠퍼스 필터링이 있음.
  const hasCampus = true;

  const [getCategories] = useCategoriesLazyQuery();

  const [getSchoolCourses] = useSchoolCoursesLazyQuery();

  const handleShowFilteringOverlay = useCallback(
    (show: boolean) => () => {
      setShowFilteringOverlay(show);
    },
    []
  );

  const onClickFilteringButton = useCallback(
    (label: FilterLabels) => () => {
      if (
        (label === FilterLabels.college && !!!campus) ||
        (label === FilterLabels.major && !(!!campus && !!college))
      ) {
        alert('이전 필터를 먼저 설정해주세요.');
        return;
      }

      const parentUuid =
        label === FilterLabels.campus
          ? null
          : label === FilterLabels.college
            ? campus?.uuid ?? null
            : label === FilterLabels.major
              ? college?.uuid ?? null
              : null;

      getCategories({
        variables: {
          parentUuid
        }
      }).then(data => {
        setCurrentFilter(label);
        setCategories(data.data?.categories ?? []);
        setShowFilteringOverlay(true);
      });
    },
    [MeStore.me, campus, college, getCategories]
  );

  const handleClickCategory = useCallback(
    (category: CategoryRefViewDto, label: FilterLabels) => {
      getSchoolCourses({
        variables: {
          input: {
            categoryRefUuid: category.uuid,
            paginationRequestDto: {
              count: 100
            },
            sortType: SchoolCourseSortType.SubjectName,
            searchKeyword: {
              keyword: ''
            }
          }
        }
      }).then(data => {
        setShowFilteringOverlay(false);
        setSchoolCourses(
          data.data?.schoolCoursesByCursor.data as SchoolCourseEntityView[]
        );

        if (label === FilterLabels.campus) {
          setCampus?.(category);
          setCollege?.(undefined);
          setMajor?.(undefined);
        } else if (label === FilterLabels.college) {
          setCollege?.(category);
          setMajor?.(undefined);
        } else if (label === FilterLabels.major) setMajor?.(category);
        // else if (label === FilterLabels.search) setSearch?.(category.name ?? '')
        // else if (label === FilterLabels.sorting) setSorting?.(category.name ?? '')
      });
    },
    [getSchoolCourses, setCampus, setCollege, setMajor, setSchoolCourses]
  );

  const handleClickButtonClose = useCallback((e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
  }, []);

  const CloseIcon = useMemo(
    () => (
      <Close
        className="cursor-pointer bg-[#C4C4C4] rounded-full"
        onClick={handleClickButtonClose}
      />
    ),
    []
  );

  const renderButtonText = useCallback(
    (text: string) => (
      <span className={clsx('line-clamp-1 text-ellipsis overflow-hidden break-all')}>
        {text}
      </span>
    ),
    []
  );

  const renderSearchInput = useCallback(() => {
    if (isSearchActivate) {
      return (
        <input
          className={clsx('outline-none bg-transparent ')}
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch?.(e.target.value)}
          onBlur={() => setIsSearchActivate(false)}
        />
      );
    } else {
      return renderButtonText(`${FilterLabels.search} : ${search || '전체'}`);
    }
  }, [isSearchActivate, renderButtonText, search, setSearch]);

  return (
    <>
      <div className="box-border px-1 pt-1 text-[14px] text-[#BFBFBF] select-none">
        {/*수업 조회 및 추가*/}
        수업 추가
      </div>
      {/*<div*/}
      {/*  ref={buttonsRef}*/}
      {/*  className={clsx(*/}
      {/*    "flex flex-wrap gap-2",*/}
      {/*    "my-2"*/}
      {/*  )}*/}
      {/*>*/}
      {/*  { hasCampus && <Button*/}
      {/*    className="flex-[1_1_45%] hover:bg-[#000000]/5"*/}
      {/*    buttonStyle={!!campus ? ButtonStyle.Activate : ButtonStyle.Normal}*/}
      {/*    text={renderButtonText(`${FilterLabels.campus} : ${campus?.name || '전체'}`)}*/}
      {/*    onClick={onClickFilteringButton(FilterLabels.campus)}*/}
      {/*    RightIcon={!!campus ? CloseIcon : undefined}*/}
      {/*  />}*/}
      {/*  <Button*/}
      {/*    className="flex-[1_1_45%] hover:bg-[#000000]/5"*/}
      {/*    buttonStyle={!!college ? ButtonStyle.Activate : ButtonStyle.Normal}*/}
      {/*    text={renderButtonText(`${FilterLabels.college} : ${college?.name || '전체'}`)}*/}
      {/*    onClick={onClickFilteringButton(FilterLabels.college)}*/}
      {/*    RightIcon={!!college ? CloseIcon : undefined}*/}
      {/*  />*/}
      {/*  <Button*/}
      {/*    className="flex-[1_1_45%] hover:bg-[#000000]/5"*/}
      {/*    buttonStyle={!!major ? ButtonStyle.Activate : ButtonStyle.Normal}*/}
      {/*    text={renderButtonText(`${FilterLabels.major} : ${major?.name|| '전체'}`)}*/}
      {/*    onClick={onClickFilteringButton(FilterLabels.major)}*/}
      {/*    RightIcon={!!major ? CloseIcon : undefined}*/}
      {/*  />*/}
      {/*  <Button*/}
      {/*    className="flex-[1_1_45%] hover:bg-[#000000]/5 cursor-text"*/}
      {/*    buttonStyle={!!search ? ButtonStyle.Activate : ButtonStyle.Normal}*/}
      {/*    text={renderSearchInput()}*/}
      {/*    onClick={() => setIsSearchActivate(true)}*/}
      {/*    RightIcon={!!search ? CloseIcon : undefined}*/}
      {/*  />*/}
      {/*  <Button*/}
      {/*    className="flex-[1_1_45%] hover:bg-[#000000]/5"*/}
      {/*    buttonStyle={sorting !== CourseSorting.SUBJECT_NAME ? ButtonStyle.Activate : ButtonStyle.Normal}*/}
      {/*    text={renderButtonText(`${FilterLabels.sorting} : ${sorting || '기본'}`)}*/}
      {/*    onClick={() => {}}*/}
      {/*    RightIcon={sorting !== CourseSorting.SUBJECT_NAME ? CloseIcon : undefined}*/}
      {/*  />*/}
      {/*  <Button*/}
      {/*    className="flex-[1_1_45%] hover:bg-[#6990EF]/10"*/}
      {/*    buttonStyle={ButtonStyle.NormalBlue}*/}
      {/*    text="직접 추가"*/}
      {/*    onClick={() => {}}*/}
      {/*  />*/}
      {/*</div>*/}

      {/*<FilteringOverlay*/}
      {/*  show={showFilteringOverlay}*/}
      {/*  placement={OverlayPosition.BOTTOM}*/}
      {/*  onHide={handleShowFilteringOverlay(false)}*/}
      {/*  categories={categories}*/}
      {/*  onClickCategory={handleClickCategory}*/}
      {/*  label={currentFilter}*/}
      {/*/>*/}
    </>
  );
}

export default Filtering;
