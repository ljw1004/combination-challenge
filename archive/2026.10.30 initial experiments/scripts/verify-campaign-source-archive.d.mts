export type SourceArchiveVerification = {
 report: {sourceSealSha256:string;declaredSourceInputs:number;materializedFiles:number;rawObjects:number;encodedObjects:number;verifiedBytes:number;materializedAt:string|null};
 index: {objects:Record<string,{kind:"raw-git-object";path:string;bytes:number;sha256:string}|{kind:"preserved-base64";compression:"gzip"|"none";parts:Array<{repositoryPath:string}>}>;sourceSealSha256:string;files:Record<string,{object:string;sha256:string;bytes:number;mode:'100644'|'100755'}>};
};
export function verifySourceArchive(options?:{materialize?:string;archive?:string}):SourceArchiveVerification;
