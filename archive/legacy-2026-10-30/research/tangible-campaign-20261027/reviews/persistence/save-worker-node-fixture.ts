/** Node-only test bridge for the exact browser worker request/codec protocol. */
import {parentPort} from 'node:worker_threads';
import {encodeSaveRequest} from '../../ui/save-worker-core.ts';
parentPort!.on('message', request => parentPort!.postMessage(encodeSaveRequest(request)));
