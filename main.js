// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
import {dotnet} from './_framework/dotnet.js'

// Temporary fix until https://github.com/dotnet/runtime/issues/91528 is resovled
globalThis.window = globalThis;
let dotnetRuntimePromise = undefined;
let exports = undefined;

export async function initializeRuntimeExports(){
    if (!dotnetRuntimePromise) {
        dotnetRuntimePromise = createRuntime();
        const { getAssemblyExports, getConfig } = await dotnetRuntimePromise;
        const config = getConfig();
        exports = await getAssemblyExports(config.mainAssemblyName);

        console.log(await testFuncAsync());
    }
}

export async function nativeCompress(data) {
    return exports.MainApp.GzipCompress(data);
}

export async function testFuncAsync() {
    return exports.MainApp.TestFuncAsync();
}

async function createRuntime() {
    try {
        return dotnet
            .withDiagnosticTracing(false)
            .withModuleConfig({
                // locateFile: (path, prefix) => {
                //     return '/' + path;
                // }
            })
            .create();
    } catch (err) {
        console.error(err);
        throw err;
    }
}