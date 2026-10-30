/** Notify presentation immediately, including when serialization/storage throws. */
export function saveProgress(write:()=>void,report:(error:string)=>void):string {
  let error='';
  try{write();}catch{error='Progress could not be saved on this device. Export it from the debug menu.';}
  report(error);
  return error;
}
