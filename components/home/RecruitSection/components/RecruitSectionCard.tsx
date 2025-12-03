import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonBase, Stack, Typography } from '@mui/material';
import { IMAGE_DEFAULT_BLUR_DATA_URL } from '@constants/image.constant';
import { AnnounceResponse } from '@generated/graphql';
import announce from '@pages/board/announce';
import CareersMainType from '@mock/careers/types/careersMainType';

export const RecruitSectionCard = (props: {
  recruitment: CareersMainType;
  up425: boolean;
}) => {
  return (
    <Box>
      <Link href={`/careers/${props.recruitment.uuid}`} passHref>
        <ButtonBase
          sx={{
            width: props.up425 ? '390px' : '60vw',
            minHeight: '152px',
            height: '100%',
            display: 'flex',
            border: 1,
            borderRadius: '16px',
            borderColor: '#e2e2e2',
            p: '16px',
            gap: '12px',
            ':hover': {
              boxShadow: '0 0 4px #999' // theme.shadows[20]
            }
          }}
        >
          <Stack height={'100%'} flex={1} alignItems={'start'}>
            <Box
              display={'flex'}
              width={props.up425 ? '390px' : '60vw'}
              height={'100%'}
              px={'16px'}
              justifyContent={'space-between'}
              alignItems={'start'}
            >
              <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'start'}
                alignItems={'start'}
              >
                <Typography fontSize={'13px'}>{props.recruitment.companyName}</Typography>
                <Typography
                  fontSize={props.up425 ? '19px' : '16px'}
                  fontWeight={'bold'}
                  textAlign={'left'}
                  sx={{
                    overflow: 'hidden',
                    WebkitLineClamp: 3,
                    maxLines: 3,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {props.recruitment.title}
                </Typography>
              </Box>
              <Stack direction={'column-reverse'}>
                <Box height={84} width={84} bgcolor={'#F7F7F7'} borderRadius={'16px'}>
                  <Image
                    height={84}
                    width={84}
                    src={
                      props.recruitment.thumbnailUrl ||
                      (props.recruitment.recruitmentJobs &&
                      Object.keys(props.recruitment.recruitmentJobs).length > 0
                        ? `/assets/[career]thumbnail_${Object.keys(props.recruitment.recruitmentJobs)[0]}.png`
                        : '/assets/[career]thumbnail_accounting.png')
                    }
                    style={{
                      objectFit: 'cover',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      aspectRatio: '1 / 1',
                      backgroundColor: 'white'
                    }}
                    // fill
                    alt="employ announcement image"
                    placeholder="blur"
                    blurDataURL={IMAGE_DEFAULT_BLUR_DATA_URL}
                  />
                </Box>
              </Stack>
            </Box>
            <Box flex={1} />
            {props.recruitment.educations.length > 0 && (
              <Box
                display={'flex'}
                mt={'15px'}
                px={'16px'}
                gap={'8px'}
                flexWrap={'wrap'}
                alignItems={'center'}
              >
                {props.recruitment.educations.map(education => (
                  <>
                    <Typography
                      color={'#06C9BB'}
                      fontSize={props.up425 ? '15px' : '12px'}
                      fontWeight={'bold'}
                    >
                      {education.value}
                    </Typography>
                  </>
                ))}
              </Box>
            )}
            <Box
              display={'flex'}
              px={'16px'}
              mt={'8px'}
              gap={'6px'}
              flexWrap={'wrap'}
              alignItems={'center'}
            >
              {Object.keys(props.recruitment.recruitmentJobs || {})
                .flatMap(
                  key =>
                    props.recruitment.recruitmentJobs[key]?.map(item => item.value) || []
                )
                .map((value, idx, arr) => (
                  <>
                    <Typography
                      color={'#7D7C7C'}
                      fontSize={props.up425 ? '13px' : '11px'}
                      fontWeight={'medium'}
                    >
                      {value}
                    </Typography>
                    {idx < arr.length - 1 && (
                      <Typography
                        color="#EEEEEE"
                        fontSize={props.up425 ? '13px' : '11px'}
                      >
                        {'|'}
                      </Typography>
                    )}
                  </>
                ))}
            </Box>
          </Stack>
        </ButtonBase>
      </Link>
    </Box>
  );
};
