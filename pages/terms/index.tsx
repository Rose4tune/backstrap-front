import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import PageLayout from '@layouts/PageLayout';
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";

const TermRedirectionPage: NextPage = () => {
  const navigate = useRouter();

  useEffect(() => {
    // 페이지 로드 시 자동 이동 (히스토리 대체)
    navigate.replace("https://voracious-show-448.notion.site/18a81357f2f8808dbe44ea9479b3aa95?pvs=4");
  }, [navigate]);

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://www.bagstrap.team/term"
          key="canonical"
        />
      </Head>
      <PageLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress/>
        </Box>
      </PageLayout>
    </>
  );
};

export default TermRedirectionPage;
