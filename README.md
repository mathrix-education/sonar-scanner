# @mathrix-education/sonar-scanner
Install the Sonar Scanner CLI in GitHub Actions workflow.

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
## In workflows
See [action.yml](action.yml) for details.
Simply add this step in your workflow `steps`.

```yaml
- uses: mathrix-education/sonar-scanner@master
  with:
    version: 4.2.0.1873 # required
```
