import React, { useCallback, useEffect, useState } from 'react';
import Three from '@three';

import './index.less';

export default () => {
  const [refEl, setRefEl] = useState(null);
  const refFn = (el: HTMLElement) => setRefEl(el);

  useEffect(() => {
    if (!refEl) { return; }

    const threeInst = new Three(refEl);
    threeInst.init();
  }, [refEl]);

  return <div ref={refFn}></div>;
};
