import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelName = searchParams.get('channelName');

  if (!channelName) {
    return NextResponse.json({ error: 'channelName is required' }, { status: 400 });
  }

  const appId = "945042339123469f9c78d84be9cef34e";
  const appCertificate = "57a4ccdd9f72479d8efcccbf71f116c2";
  const uid = 0;
  const role = RtcRole.PUBLISHER;
  const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 3600;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return NextResponse.json({ token, uid });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}