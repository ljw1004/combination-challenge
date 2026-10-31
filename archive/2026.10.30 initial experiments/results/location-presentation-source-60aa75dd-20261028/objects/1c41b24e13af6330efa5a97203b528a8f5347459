import {encodeSave, type SaveEnvelope} from './save-codec.ts';

export type SaveRequest = {type: 'encode'; revision: number; snapshot: SaveEnvelope};
export type SaveReply =
 | {type: 'encoded'; revision: number; encoded: string}
 | {type: 'encode-error'; revision: number; message: string};

/** Kept free of Worker globals so the real wire protocol is directly testable. */
export function encodeSaveRequest(request: SaveRequest): SaveReply {
 try {
  if (!request || request.type !== 'encode' || !Number.isSafeInteger(request.revision) || request.revision < 1) {
   throw new Error('Invalid campaign save request');
  }
  return {type: 'encoded', revision: request.revision, encoded: encodeSave(request.snapshot)};
 } catch (error) {
  return {type: 'encode-error', revision: request?.revision ?? 0, message: error instanceof Error ? error.message : String(error)};
 }
}
