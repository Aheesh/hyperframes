import { getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NEXT_PUBLIC_URL } from './config';

export type HyperFrame = {
    frame: string;
    1: string | ((text: string) => string) | (() => string);
    2?: string | ((text: string) => string) | (() => string);
    3?: string | ((text: string) => string) | (() => string);
    4?: string | ((text: string) => string) | (() => string);
};

const frames: Record<string, HyperFrame> = {};

export function addHyperFrame(label: string, frame: HyperFrame) {
  frames[label] = frame;
}

export function getHyperFrame(frame: string, text: string, button: number) {
    const currentFrame = frames[frame];
    const nextFrameIdOrFunction = currentFrame[button as keyof HyperFrame];
  
    let nextFrameId: string;
    if (typeof nextFrameIdOrFunction === 'function') {
      nextFrameId = nextFrameIdOrFunction(text);
    } else {
      nextFrameId = nextFrameIdOrFunction as string;
    }
  
    if (!frames[nextFrameId]) {
      throw new Error(`Frame not found: ${nextFrameId}`);
    }
  
    return frames[nextFrameId].frame;
  }

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