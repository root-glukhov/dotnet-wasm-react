import React, {ChangeEvent, useEffect} from 'react';
import {WorkerCompressionResult, WorkerMessage, WorkerMessageType} from "./workers/events";

function App() {
  const [nativeWorker, setNativeWorker] = React.useState<Worker>();
  const [nativeResult, setNativeResult] = React.useState<string>();

  useEffect(() => {
    const nativeWorker = new Worker(new URL('workers/native-worker', import.meta.url), {type: "module"});
    nativeWorker.onmessage = handleNativeWorkerMessage
    setNativeWorker(nativeWorker);

    return () => {
      nativeWorker.removeEventListener('message', handleNativeWorkerMessage);
    }
  }, []);

  function handleNativeWorkerMessage(event: MessageEvent<WorkerMessage<unknown>>) {
    const workerEvent = event.data;
    if (workerEvent.type == WorkerMessageType.StartedCompression) {
        setNativeResult("Started Compressing")
    } else if (workerEvent.type == WorkerMessageType.FinishedCompression) {
      const result = workerEvent.data as WorkerCompressionResult;
      setNativeResult(`Native Worker finished Compressing to ${result.data.length} bytes in ${result.time} ms`)
    }
  };

  async function handleNativeUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if ((!files || files.length < 0)) {
      setNativeResult("Hmm you didn't chose a file")
    } else {
      nativeWorker?.postMessage(files[0])
    }
  }


  return (
    <div>
      <div>
        <span>WASM .NET Compress</span>
        <input type="file" onChange={handleNativeUpload}/>
      </div>
      <div>
        {nativeResult}
      </div>
    </div>
  );
}

export default App;
