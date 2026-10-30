import {encodeSaveRequest, type SaveRequest, type SaveReply} from './save-worker-core.ts';

// A dedicated module Worker: neither localStorage nor game/UI state lives here.
const port = globalThis as unknown as {
 onmessage: ((event: MessageEvent<SaveRequest>) => void) | null;
 postMessage(reply: SaveReply): void;
};
port.onmessage = event => port.postMessage(encodeSaveRequest(event.data));
