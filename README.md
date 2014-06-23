
This is a collection of tests and examples for the WorkerCanvas project, which is
currently being tracked in [Mozilla Bug 709490](https://bugzilla.mozilla.org/show_bug.cgi?id=709490).

WorkerCanvas aims to make WebGL available in WebWorkers for completely parallel graphics rendering.

### Current tests

 * NoWorkers/index.html - Reference test that uses regular WebGL
 * Basic/index.html - Spawns one worker with webgl rendering
 * ManyWorkers/index.html - Controllable creation and of many simultaneous workers
