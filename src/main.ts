// Earlier surfaces remain accessible for comparison with the shared canvas.
const experiment=new URLSearchParams(location.search).get('experiment');
if(experiment==='flood'){
  await import('./flood-main.ts');
}else if(experiment==='joinery'){
  await import('./joinery.ts');
}else if(experiment==='hands'){
  await import('./workbench.ts');
}else{
  await import('./constellation.ts');
}
export {};
