import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { addHyperFrame, getHyperFrame } from '../../hyperframes';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';
  let frame: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  } else {
    return new NextResponse('Message not valid', { status: 500 });
  }


  //if (!isValid) {
  //  return new NextResponse('Message not valid', { status: 500 });
  //}



  let state = { frame: 'start' };

  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    // Note that this error will always be triggered by the first frame
    console.error(e);
  }

  

  if (!frame) {
    return new NextResponse('Frame not found', { status: 404 });
  }
  
  // There should always be a button number
  if (!message?.button) {
    return new NextResponse('Button not found', { status: 404 });
  }

  return new NextResponse(getHyperFrame(frame as string, text || '', message?.button));

  /*
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `State: ${state}`,
        },
        {
          action: 'link',
          label: 'OnchainKit',
          target: 'https://onchainkit.xyz',
        },
        {
          action: 'post_redirect',
          label: 'Dog pictures',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-1.png`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
  */
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
