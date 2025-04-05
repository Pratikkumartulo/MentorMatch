import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import conf from '../config/EnvConfig';

function randomID(len = 5) {
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function VideoConference() {
  const authData = useSelector((state) => state.auth.userData.userData.UserName);
  const navigate = useNavigate();
  const containerRef = React.useRef(null);

  // ✅ Extract username from URL path (e.g., /chat/Patrick_Pratikk4u)
  const path = window.location.pathname;
  const segments = path.split('/');
  const lastUserSegment = segments[segments.length - 2]; // before 'videoconf'
  const roomID = lastUserSegment.split('_').pop() || randomID(5);


  React.useEffect(() => {
    const initMeeting = async () => {
      const appID = Number(conf.appIds);
      const serverSecret = conf.serverSecret;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        randomID(5), // userID
        authData       // username used as room ID
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: 'Room link',
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    };

    initMeeting();
  }, [roomID]);

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
    >
    </div>
  );
}
