import { Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';

interface ReviewData {
  title: string;
  content: string;
  userId: string;
  profilePath: string;
  isLight: boolean;
}

export default function ReviewCard({
  title,
  content,
  userId,
  profilePath,
  isLight
}: ReviewData) {
  const up425 = useMediaQuery('(min-width:425px)');

  return (
    <Box
      sx={{
        border: '1px solid rgba(0,203,188,1)',
        background: isLight
          ? 'linear-gradient(151deg, rgba(0,203,188,0.1) 41%, rgba(255,255,255,1) 100%)'
          : 'linear-gradient(151deg, rgba(0,203,188,1) 41%, rgba(67,174,234,1) 100%)',
        width: up425 ? '392px' : '100%',
        height: up425 ? '360px' : null,
        p: '28px',
        mb: '12px',
        mx: up425 ? '5px' : null,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'start',
        borderRadius: '20px'
      }}
    >
      <Typography
        sx={{ color: isLight ? 'black' : 'white', fontSize: '16px', fontWeight: '700' }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: '16px',
          mb: '26px',
          color: isLight ? 'black' : 'white',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        {content}
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <img src={profilePath} alt="profile" />
        <Typography
          sx={{
            ml: '8px',
            color: isLight ? 'black' : 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {userId}
        </Typography>
      </Box>
    </Box>
  );
}
