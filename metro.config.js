const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// --- Why this override is needed -------------------------------------------
// Firebase packages publish both ESM and CJS builds. Metro can pick the
// wrong (ESM/browser) build for some @firebase/* packages, which creates
// separate module singleton instances — splitting the internal component
// registry. When registerAuth() writes to one registry and initializeAuth()
// reads from another you get "Component auth has not been registered yet".
//
// Strategy:
//  1. firebase/auth → @firebase/auth/dist/rn/index.js
//       The auth RN build calls registerAuth("ReactNative"). Without this,
//       Metro may pick the browser build that registers for the wrong platform.
//
//  2. @firebase/app, @firebase/component, @firebase/util, @firebase/logger
//       → their CJS builds.
//       These packages are the "shared registry" layer. Pinning them to CJS
//       ensures there is exactly ONE singleton registry instance across all
//       Firebase packages. (firebase/app re-exports @firebase/app, so it
//       naturally uses the same CJS instance too.)
//
// NOTE: firebase/firestore and firebase/storage do NOT need overrides.
//       @firebase/firestore already declares "react-native": "dist/index.rn.js"
//       in its package.json, which Metro reads automatically. Adding an
//       explicit override would bypass the firebase/firestore wrapper module
//       and break version registration.
// ---------------------------------------------------------------------------

// @firebase/* internal packages to force to CJS (shared singleton registry)
const internalCjsPackages = [
    '@firebase/app',
    '@firebase/component',
    '@firebase/util',
    '@firebase/logger',
];

const originalResolver = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
    // 1. firebase/auth → React Native build
    if (moduleName === 'firebase/auth') {
        return {
            filePath: path.resolve(
                __dirname,
                'node_modules/@firebase/auth/dist/rn/index.js'
            ),
            type: 'sourceFile',
        };
    }

    // 2. @firebase/* internal packages → CJS builds (shared registry singleton)
    for (const pkg of internalCjsPackages) {
        if (moduleName === pkg) {
            const cjsPath = path.resolve(
                __dirname,
                `node_modules/${pkg}/dist/index.cjs.js`
            );
            try {
                require.resolve(cjsPath);
                return { filePath: cjsPath, type: 'sourceFile' };
            } catch (_) {
                break;
            }
        }
    }

    if (originalResolver) {
        return originalResolver(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
