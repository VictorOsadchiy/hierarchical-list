import React from 'react';
import Typography from '@material-ui/core/Typography';
import { DEFAULT_STUB_TEXT } from 'utils/constants';

export type TStub = {
  text?: string;
};

const Stub: React.FC = ({ text = DEFAULT_STUB_TEXT }: TStub) => {
  return (
    <Typography variant="body1" align="center" style={{ color: '#888' }}>
      {text}
    </Typography>
  );
};

export default Stub;
