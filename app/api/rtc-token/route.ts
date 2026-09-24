import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelName = searchParams.get('channelName');

  if (!channelName) {
    return NextResponse.json({ error: 'channelName is required' }, { status: 400 });
  }

  const appID = process.env.AGORA_APP_ID || "945042339123469f9c78d84befeef34e";
  const appCertificate = process.env.AGORA_APP_CERTIFICATE || "57a4ccdd9f72479d8efcccbf71f116c2";
  const uid = 0;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  return NextResponse.json({ token, uid });
}