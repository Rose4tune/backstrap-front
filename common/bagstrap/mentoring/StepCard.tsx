import { Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';

interface StepData {
  index: number;
  title: string;
  content: string;
  illustPath: string;
}

export default function StepCard({ index, title, content, illustPath }: StepData) {
  const up425 = useMediaQuery('(min-width:425px)');

  return (
    <Box
      sx={{
        border: '1px solid rgba(0,203,188,1)',
        background:
          'radial-gradient(561.5% 216.86% at 130.6% 126.01%, #EEFFFD 0%, rgba(255, 255, 255, 0.00) 100%)',
        width: up425 ? '50%' : '100%',
        height: up425 ? '360px' : null,
        p: '28px',
        mb: '12px',
        mx: up425 ? '5px' : null,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: '20px'
      }}
    >
      <Box
        sx={{
          bgcolor: '#00CBBC',
          borderTopLeftRadius: '20px',
          borderBottomRightRadius: '20px',

          height: '48px',
          p: '28px',
          position: 'absolute',
          top: '0',
          left: '0',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>
          STEP 0{index}
        </Typography>
      </Box>
      <img src={illustPath} alt="illust" width="120px" height="120px" />
      <Typography
        sx={{ color: 'black', fontSize: '18px', fontWeight: '700', mt: '32px' }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: '8px',
          color: 'black',
          fontSize: '16px',
          fontWeight: '500',
          whiteSpace: 'pre-line',
          textAlign: 'center'
        }}
      >
        {content}
      </Typography>
    </Box>
  );
}
