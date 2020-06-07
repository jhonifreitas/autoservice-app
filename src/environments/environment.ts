// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'http://127.0.0.1:8000/api/v1/',
  // host: 'http://192.168.0.12:8000/api/v1/',
  // host: 'http://45.132.242.190:8080/api/v1/',
  onesignal_key: '974228760707',
  onesignal_id: 'c337d5d7-79cb-43ee-bdd0-b99da7aca831',
  pagseguro_host: 'https://stc.sandbox.pagseguro.uol.com.br'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
