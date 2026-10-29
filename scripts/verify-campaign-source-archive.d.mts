export type SourceArchiveVerification = {
 report: {sourceSealSha256:string;declaredSourceInputs:number;materializedFiles:number;rawObjects:number;encodedObjects:number;verifiedBytes:number;materializedAt:string|null};
 index: {sourceSealSha256:string;files:Record<string,{object:string;sha256:string;bytes:number;mode:'100644'|'100755'}>};
};
export function verifySourceArchive(options?:{materialize?:string;archive?:"current"|"predecessor"|"intermediate"}):SourceArchiveVerification;
