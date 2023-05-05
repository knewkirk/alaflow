import React from 'react';

import Lights from './Lights';
import Icon, { IconType } from './Icon';

export default () => (
  <>
    <Lights />
    <Icon
      type={IconType.Spotify}
      position={[6, 2, 0]}
    />
    <Icon
      type={IconType.Soundcloud}
      position={[6, 1, -1.5]}
    />
    <Icon
      type={IconType.Instagram}
      position={[6, 1, 1.5]}
    />
  </>
);
