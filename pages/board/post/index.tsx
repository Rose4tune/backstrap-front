import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import BoardPageLayout from '@layouts/BoardPageLayout';

const BoardSearchPage: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      router.replace('/');
    }
  }, [router]);
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <BoardPageLayout />
    </>
  );
};

export default BoardSearchPage;
