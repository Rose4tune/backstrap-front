import Box from '@mui/material/Box';
import { Link, Typography, useMediaQuery } from '@mui/material';
import ArrowRightIcon from '@public/icons/arrow-right.svg';

export const SectionHeader = ({
  title,
  content,
  hrefTitle,
  href
}: {
  title: string;
  content: string;
  hrefTitle: string;
  href: string;
}) => {
  const up425 = useMediaQuery('(min-width:425px)');

  return (
    <>
      {!up425 ? (
        <Box
          display={'flex'}
          mt={'4px'}
          gap={'32px'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography fontSize={'22px'} fontWeight={'bold'}>
            {title}
          </Typography>
          <Link href={href} underline={'none'} color={'inherit'}>
            <Box display={'flex'} alignItems={'center'}>
              <Typography fontSize={'15px'} mr={'6px'}>
                {'더보기'}
              </Typography>
              <ArrowRightIcon />
            </Box>
          </Link>
        </Box>
      ) : (
        <>
          {' '}
          <Typography fontSize={'22px'} fontWeight={'bold'}>
            {title}
          </Typography>
          <Box display={'flex'} mt={'4px'} gap={'32px'} alignItems={'center'}>
            <Typography fontSize={'15px'} fontWeight={'medium'}>
              {content}
            </Typography>
            <Link href={href} underline={'none'} color={'inherit'}>
              <Box display={'flex'} alignItems={'center'}>
                <Typography fontSize={'15px'} mr={'6px'}>
                  {hrefTitle}
                </Typography>
                <ArrowRightIcon />
              </Box>
            </Link>
          </Box>
        </>
      )}
    </>
  );
};
