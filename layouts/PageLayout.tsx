import clsx from 'clsx';
import React, { useState, useEffect, useCallback, useMemo, ReactNode, Dispatch, SetStateAction } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useStore } from '@stores/useStore.hook';


import useAuthGuard from '@hooks/useAuthGuard.hook';
import useBoardCategorySelectionModalDialog from '@hooks/bagstrap/board/useBoardCategorySelectionModalDialog.hook';

import LoadingSurface from '@common/surface/LoadingSurface';
import Footer from 'elements/Footer';
import {
  useMediaQuery
} from '@mui/material';
import NavigationHeader from 'src/components/header/NavigationHeader';
import BottomTab from 'src/components/mobile/BottomTab';
import { components } from 'src/types/api';


export interface PageLayoutProps extends BaseProps {
  children?: ReactNode;

  loading?: boolean;

  authRequired?: boolean;

  logoOnly?: boolean;

  groupUuid?: string | null;

  topSection?: React.ReactNode;

  noFooter?: boolean;

  mobileSimple?: boolean;

  mobileTab?: boolean;

  postEditPopup?: boolean;

}

const PageLayout: React.FC<PageLayoutProps> = (props): JSX.Element => {
  const {
    children,
    className,
    authRequired,
    loading,
    logoOnly,
    groupUuid,
    topSection,
    noFooter,
    mobileSimple = false,
    mobileTab = true,
    postEditPopup = false,
  } = props;

  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:550px)');
  const [keyword, category] = useMemo(() => {
    const { keyword: _keyword, category: _category } = router.query;
    return [
      Array.isArray(_keyword) ? _keyword[0] : _keyword,
      Array.isArray(_category) ? _category[0] : _category
    ];
  }, [router.query]);

  const [authGuardModalDialogEl, passed] = useAuthGuard(authRequired);
  const [isCategorySelectionOpen, setIsCategorySelectionOpen] = useState(false);

  const categoryUuid = useMemo(() => groupUuid || category, [groupUuid, category]);

  const [
    boardCategorySelectionModalDialogEl,
    openBoardCategorySelectionModalDialog,
    closeBoardCategorySelectionModalDialog,
    setGroupUuid
  ] = useBoardCategorySelectionModalDialog(categoryUuid, groupUuid => {
    router.push(`/board/${groupUuid}`).then(() => {
      closeBoardCategorySelectionModalDialog();
    });
  });

  useEffect(() => {
    if (category) {
      setGroupUuid(category);
    }
  }, [category, setGroupUuid]);

  const onClickCategorySelectionOpen = useCallback(
    () => setIsCategorySelectionOpen(prev => !prev),
    [setIsCategorySelectionOpen]
  );


  return (
    <>
      {authRequired && (
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
      )}

      <div
        className={clsx(
          'relative overflow-x-clip',
          'w-full min-h-screen min-w-[320px] mx-auto',
          'flex flex-col justify-between',
          'scroll-smooth',
          className, isMobile && 'max-w-[550px] mx-auto'
        )}
      >
        {authGuardModalDialogEl}
        {boardCategorySelectionModalDialogEl}

        <div className="flex-1">
          {/* Header */}
          {!logoOnly && !isMobile && <NavigationHeader />}

          {/* body */}
          <main className={`relative w-full mx-auto 4xl:px-60 ${isMobile? 'py-[70px]':'px-20'}`}>
            <div className="flex flex-col sticky top-[144px] left-0 right-0 z-[99]">
              {topSection}
            </div>

            <LoadingSurface open={loading} global />
            {/* {!loading && (authRequired ? passed && children : children)} */}
            {authRequired ? passed && children : children}
          </main>
        </div>
        {/* bottom */}
        {!noFooter && !isMobile && <Footer logoOnly={logoOnly} />}
        {!logoOnly && isMobile && mobileTab && <BottomTab mobileSimple={mobileSimple} postEditPopup={postEditPopup} />}
      </div>
    </>
  );
};

export default observer(PageLayout);