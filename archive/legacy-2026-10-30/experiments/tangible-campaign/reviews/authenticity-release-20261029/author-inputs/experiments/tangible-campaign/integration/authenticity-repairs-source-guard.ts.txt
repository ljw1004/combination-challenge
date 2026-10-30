import {expectedSourceHashAfterWiderCadence} from './wider-cadence-source-guard.ts';
/** This review candidate adds isolated source only: every predecessor hash
 * still flows through the exact wider-cadence ancestry guard unchanged. */
export function expectedSourceHashAfterAuthenticityRepairs(path:string,parentSha256:string):string {
 return expectedSourceHashAfterWiderCadence(path,parentSha256);
}
