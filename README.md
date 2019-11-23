# @mathrix-education/sonar-scanner
Install the Sonar Scanner CLI in GitHub Actions workflow.

This project is **not supported** by Sonar Cloud.

Proudly maintained by [Mathieu Bour][1.1], Vice-CTO
[@mathrix-education][1.2].

[1.1]: https://github.com/mathieu-bour
[1.2]: https://github.com/mathrix-education

## Motivations
If the official [SonarSource/sonarcloud-github-action][2.1] action
works perfectly, the fact that it is based on Docker makes it quite
slow since you have to build the Docker image before using it.
Moreover, the official action is mainly build for Sonar Cloud and using
it when hosting your own Sonarqube instance can be quite tricky.

This goal of this action is to provide a fast and reliable way to run
Sonar Scanner on every platform by using the provided JDK.

[2.1]: https://github.com/SonarSource/sonarcloud-github-action

## Usage
### Inputs
See [action.yml](action.yml) for details.

#### version
The `version` is required since it is used to download Sonar Scanner.
You can find the available versions on the official Sonar Scanner
[repository][3.1]

[3.1]: https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/

#### options
The `options` input will set the default sonar-project.properties values
by writing into the `conf/sonar-project.properties` file.
This input is useful if you do not have a `sonar-project.properties`
file in your project.

#### typescript (`true`/`false`, default `false`)
Install TypeScript during the setup. Useful only if you want to analyse
TypeScript code.

#### scan (`true`/`false`, default `false`)
Run the `sonar-scanner` command immediately after the setup.

#### args
Additional flags to append to the `sonar-scanner` command. It will be
ignored if `scan` is set to `false`.

### Examples
To analyse the repository, we would add the following code to our
workflow:

```yaml
- uses: mathrix-education/sonar-scanner@master
  with:
    version: 4.2.0.1873 # required
    typescript: true
    scan: true
    args: --debug
```
