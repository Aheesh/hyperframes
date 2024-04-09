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

  addHyperFrame('start', {
    frame: getFrameHtmlResponse({
      buttons: [
        {
          label: 'Road',
        },
        {
          label: 'Woods',
        },
        {
          label: 'Cave',
        },
        {
          action: 'link',
          label: 'TODO',
          target: 'https://www.google.com',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/frame-1-forest.webp`,
        aspectRatio: '1:1',
      },
      state: { frame: 'start' },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
    1: 'road',
    2: 'woods-bear',
    3: 'cave-1',
  });
  
  addHyperFrame('road', {
    frame: getFrameHtmlResponse({
      buttons: [
        {
          label: 'Go Back',
        },
        {
          label: 'Shack',
        },
        {
          label: 'Forward',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/road.png`,
        aspectRatio: '1:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
    1: 'start',
    2: 'shack',
    3: 'desert-road',
  });

  addHyperFrame('shack', {
    frame: getFrameHtmlResponse({
      buttons: [
        {
          label: 'Go Back',
        },
        {
          label: 'Door',
        },
        {
          label: 'Testing',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/shack.png`,
        aspectRatio: '1:1',
      },
      input: {
        text: 'What is the password?',
      },
      state: { frame: 'shack' },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
    1: 'road',
    2: (text: string) => {
      return text === 'All your Base are belong to you' ? 'key' : 'shack-bad-password';
    },
  });

  addHyperFrame('shack-bad-password', {
    frame: getFrameHtmlResponse({
      buttons: [
        {
          label: 'Go Back',
        },
        {
          label: 'Door',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/shack.png`,
        aspectRatio: '1:1',
      },
      input: {
        text: 'Try again. What is the password?',
      },
      state: { frame: 'shack-bad-password' },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
    1: 'road',
    2: (text: string) => {
      return text === 'All your Base are belong to you' ? 'key' : 'shack-bad-password';
    },
  });
  
  addHyperFrame('key', {
    frame: getFrameHtmlResponse({
      buttons: [
        {
          label: 'Go Back',
        },
        {
          label: 'TODO',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/key.png`,
        aspectRatio: '1:1',
      },
      state: { frame: 'key' },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
    1: 'shack',
  });

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
