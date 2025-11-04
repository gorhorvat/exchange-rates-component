import '@testing-library/jest-dom';
import * as nodeUtil from 'util';
import * as nodeCrypto from 'crypto';

// Handle TextEncoder/TextDecoder for Node.js
if (typeof globalThis.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = nodeUtil;
  globalThis.TextEncoder = TextEncoder as any;
  globalThis.TextDecoder = TextDecoder as any;
}

// Handle crypto for jest environment
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {
    getRandomValues: (buffer: any) => nodeCrypto.randomFillSync(buffer),
  } as any;
}
