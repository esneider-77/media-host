import React, { useRef, forwardRef, useImperativeHandle } from 'react';

// Forward ref to allow parent to access iframe DOM node
const MediasoupConnector = forwardRef(
  ({ roomId, style, height = '500px', title = 'Mediasoup Iframe' }, ref) => {
    const iframeRef = useRef();
    useImperativeHandle(ref, () => iframeRef.current);

    // Get 'produce' query param from current location
    const params = new URLSearchParams(window.location.search);

    let src = `https://okmediaserver.zapto.org:4443/?roomId=${roomId}`;

    if (roomId === 'everyone') {
      const produce = params.get('produce');
      src =
        `https://okmediaserver.zapto.org:4443/?roomId=${roomId}` +
        (produce ? `&produce=${encodeURIComponent(produce)}` : '');
    }

    return (
      <iframe
        ref={iframeRef}
        src={src}
        style={{ ...style, border: 'none' }}
        height={height}
        title={title}
        allow="microphone"
      />
    );
  }
);

export default MediasoupConnector;
