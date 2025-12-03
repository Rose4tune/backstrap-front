import Box from '@mui/material/Box';
import Image from 'next/image';
import AuthContext from '@contexts/auth.context';
import { Divider, ListItemButton, Stack, Typography } from '@mui/material';
import { IMAGE_DEFAULT_BLUR_DATA_URL } from '@constants/image.constant';
import HeartIcon from '@public/icons/ic-small-heart.svg';
import CommentIcon from '@public/icons/ic-small-comment.svg';
import { useRouter } from 'next/router';
import React from 'react';
import { BoardSummaryFragment, FaGroupSummaryFragment } from '@generated/graphql';
import { checkAuthenticated } from '@utils/auth/auth.util';
import { setErrorUnauthorizedAction } from '@vars/error.var';
import { renderLineBreak } from '@utils/common/render.util';

export const BoardSectionRow = (props: {
  index: number;
  group: FaGroupSummaryFragment;
  board: BoardSummaryFragment;
  imageUrl: string | null | undefined;
  content: string | undefined;
}) => {
  const router = useRouter();

  const auth = React.useContext(AuthContext);

  return (
    <>
      {props.index != 0 && <Divider />}
      <ListItemButton
        onClick={() => {
          if (!checkAuthenticated(auth.authPayload) && props.group.code == 'INFO') {
            setErrorUnauthorizedAction();
            return;
          }
          router.push(`/board/post/${props.board.uuid}`);
        }}
        sx={{
          '&:hover': {
            borderRadius:
              props.index == 0
                ? '16px 16px 0px 0px'
                : props.index == 4
                  ? '0px 0px 16px 16px'
                  : ''
          }
        }}
      >
        <Box display={'flex'} width={'100%'} gap={'12px'} borderRadius={10}>
          <Stack flex={1}>
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical'
              }}
              fontSize={'17px'}
              fontWeight={'bold'}
            >
              {props.board.title}
            </Typography>

            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical'
              }}
              color={'#6C6C6C'}
              fontSize={'14px'}
            >
              {renderLineBreak(props.content ?? '', 1)}
            </Typography>
            <Box display={'flex'} mt={'8px'} gap={'12px'}>
              <Box display={'flex'} alignItems={'center'}>
                <HeartIcon />
                <Typography ml={'2px'} fontSize={'11px'}>
                  {props.board.likeCount || 0}
                </Typography>
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                <CommentIcon />
                <Typography ml={'2px'} fontSize={'11px'}>
                  {props.board.reviewCount || 0}
                </Typography>
              </Box>
            </Box>
          </Stack>
          <Stack direction={'column-reverse'}>
            {props.imageUrl && (
              <Box height={69} width={95} borderRadius={'16px'}>
                <Image
                  width={95}
                  height={69}
                  src={props.imageUrl || IMAGE_DEFAULT_BLUR_DATA_URL}
                  style={{
                    objectFit: 'cover',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    height: 'auto',
                    width: '100%',
                    aspectRatio: '95/69'
                  }}
                  alt="employ announcement image"
                  placeholder="blur"
                  blurDataURL={IMAGE_DEFAULT_BLUR_DATA_URL}
                  unoptimized
                />
              </Box>
            )}
          </Stack>
        </Box>
      </ListItemButton>
    </>
  );
};
