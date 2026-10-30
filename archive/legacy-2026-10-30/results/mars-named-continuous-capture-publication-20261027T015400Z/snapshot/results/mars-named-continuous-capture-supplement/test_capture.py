"""Operator validation only; not fresh-player material."""
import pathlib,json,tempfile,subprocess,sys,unittest,importlib.util
from capture import capture,find_host
H=find_host();spec=importlib.util.spec_from_file_location('frozenhost',H);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Tests(unittest.TestCase):
 def test_full_control_exact_every_request(self):
  with tempfile.TemporaryDirectory(prefix='mars-capture-validation-') as d:
   game=m.Game();requests=[{'op':'help'},{'op':'view'},{'op':'partners','a':'broken-radio'},{'op':'next'},{'op':'combine','a':'no-such-thing','b':'cable'}]
   route=json.loads((H.parents[1]/'mars-named-two-mission-candidate/simple-tool-route.json').read_text())
   requests += [{'op':x['action']['type'],**{k:v for k,v in x['action'].items() if k not in ('type','at')}} for x in route['trace']]
   requests += [{'op':'next'},{'op':'view'},{'op':'saved','level':game.content['levels'][0]['id']}]
   for cmd in requests:
    raw=json.dumps(cmd,separators=(',',':'));result=capture(d,raw,H)
    self.assertEqual(result.returncode,0);self.assertEqual(result.stderr,b'');self.assertEqual(json.loads(result.stdout),game.command(cmd))
   records=[json.loads(x) for x in (pathlib.Path(d)/'transcript.jsonl').read_text().splitlines()]
   self.assertEqual(len(records),len(requests))
   for cmd,r in zip(requests,records):
    self.assertEqual(r['requestJSON'],cmd);self.assertEqual(r['requestText'],json.dumps(cmd,separators=(',',':')));self.assertEqual(r['exitCode'],0);self.assertEqual(r['stderr'],'')
   self.assertEqual(records[3]['stateBeforeSHA256'],records[3]['stateAfterSHA256'])
   state=json.loads((pathlib.Path(d)/'state.json').read_text());self.assertEqual(state,game.state);self.assertTrue(state['finished'])
 def test_malformed_json_and_cli_stdout(self):
  with tempfile.TemporaryDirectory(prefix='mars-capture-validation-') as d:
   r=capture(d,'{bad',H);self.assertFalse(json.loads(r.stdout)['ok']);self.assertFalse((pathlib.Path(d)/'state.json').exists())
   records=[json.loads(x) for x in (pathlib.Path(d)/'transcript.jsonl').read_text().splitlines()];self.assertEqual(records[0]['requestText'],'{bad');self.assertIsNone(records[0]['requestJSON'])
   r=subprocess.run([sys.executable,str(pathlib.Path(__file__).with_name('capture.py')),'--run-dir',d,'--command','{"op":"help"}'],capture_output=True)
   record=json.loads((pathlib.Path(d)/'transcript.jsonl').read_text().splitlines()[-1]);self.assertEqual(r.stdout.decode(),record['stdout']);self.assertEqual(r.stderr.decode(),record['stderr']);self.assertEqual(r.returncode,record['exitCode'])
 def test_fatal_host_diagnostics_private(self):
  with tempfile.TemporaryDirectory(prefix='mars-capture-validation-') as d:
   state=pathlib.Path(d)/'state.json';state.write_text('{bad state')
   r=subprocess.run([sys.executable,str(pathlib.Path(__file__).with_name('capture.py')),'--run-dir',d,'--command','{"op":"view"}'],capture_output=True)
   self.assertNotEqual(r.returncode,0);self.assertEqual(r.stderr,b'');self.assertNotIn(b'Traceback',r.stdout);self.assertNotIn(b'harness.py',r.stdout)
   log=json.loads((pathlib.Path(d)/'transcript.jsonl').read_text());self.assertIn('Traceback',log['stderr']);self.assertEqual(log['exitCode'],r.returncode);self.assertEqual(log['stateBeforeSHA256'],log['stateAfterSHA256'])
if __name__=='__main__':unittest.main(verbosity=2)
