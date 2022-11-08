| field | value |
| --- | --- |
| title | Building from source |
| id | building-from-source
| parent | manager |


## Building from source
- Setup the Flutter environment for your [platform](https://docs.flutter.dev/get-started/install).
- Clone the repository
```sh
git clone https://github.com/revanced/revanced-manager.git
```
- Add your GitHub acesss token in `gradle.properties` like [so](https://github.com/revanced/revanced-documentation/wiki/Building-from-source).
- Open a terminal in the workspace directory
- Run this to download packages
```sh
flutter pub get
```
- Then this, it must be run on each time you sync your local repository with the remote's.
```sh
flutter packages pub run build_runner build --delete-conflicting-outputs
```
- Then you can build the application using
```sh
flutter build apk
```