[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# Repolinter Actions

[![GitHub Marketplace version](https://img.shields.io/github/release/newrelic/repolinter-action.svg?label=Marketplace&logo=github)](https://github.com/marketplace/actions/repolinter-action) ![Release](https://github.com/newrelic/repolinter-action/workflows/Release/badge.svg?event=push) [![codecov](https://codecov.io/gh/newrelic/repolinter-action/branch/main/graph/badge.svg?token=EWYZ7C6RSL)](https://codecov.io/gh/newrelic/repolinter-action) 

This action runs [Repolinter](https://github.com/todogroup/repolinter). This fork extends the original [repolinter-action](https://github.com/newrelic/repolinter-action) by allowing users to automatically create Pull Requests that fix compliance issues. When Repolinter detects missing files or required content, it creates a Pull Request with the necessary files and content based on templates defined in your repolinter configuration.  To enable this feature, your repolinter rules must include `file-name` and `file-content` fields within the options object to specify the target file and its template content. 

##### Currently, only sending PR's are available in this action. If you would like to send an Issue rather than a PR, use the original [repolinter-action](https://github.com/newrelic/repolinter-action). We plan to support both.

## Inputs

```yaml
- uses: DSACMS/repolinter-actions@main
  with:
    # The directory Repolinter should run against. Accepts an absolute path
    # or a path relative to $GITHUB_WORKSPACE.
    #
    # Defaults to $GITHUB_WORKSPACE.
    directory: ''

    # A path to the JSON/YAML Repolinter ruleset to use, relative to the workflow
    # working directory (i.e. under `$GITHUB_WORKSPACE`).
    #
    # This option is mutually exclusive with config_url. If this option and
    # config_url are not specified, Repolinter's default ruleset will be used.
    config_file: ''

    # A URL to pull the JSON/YAML Repolinter ruleset from. This URL must be accessible
    # by the actions runner and return raw JSON file on GET.
    #
    # This option can be used to pull a ruleset from GitHub using the
    # raw.githubusercontent.com URL (ex. https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json).
    #
    # This option is mutually exclusive with config_file. If this option and
    # config_file are not specified, Repolinter's default ruleset will be used.
    config_url: ''

    # Where repolinter-action should put the linting results. There are two
    # options available:
    # * "exit-code": repolinter-action will print the lint output to the console
    #   and set the exit code to result.passed. This output type is most useful for
    #   PR status checks.
    # * "issue": repolinter-action will create a GitHub issue on the current
    #   repository with the repolinter output and always exit 0. See the README for
    #   more details on issue outputting behavior. This output type is ideal for
    #   non-intrusive notification.
    # * "pull-request": repolinter-action will send a PR with the neccessary changes 
    #   based on the repolinter configuration. This output type is ideal for repo owners
    #   who want comprehensive compliance.
    #
    # Default: "exit-code"
    output_type: ''

    # The title to use for the issue created by repolinter-action. This title
    # should indicate the purpose of the issue, as well as that it was created by
    # a bot.
    #
    # This option will be ignored if output_type != "issue".
    #
    # Default: "[Repolinter] Open Source Policy Issues"
    output_name: ''

    # The name to use for the issue label created by repolinter-action. This name
    # should be unique to repolinter-action (i.e. not used by any other issue) to
    # prevent repolinter-action from getting confused.
    #
    # This option will be ignored if output_type != "issue".
    #
    # Default: "repolinter"
    label_name: ''

    # The color to use for the issue label created by repolinter-action. The value
    # for this option should be an unprefixed RRGGBB hex string (ex. ff568a).
    # The default value is a shade of yellow.
    #
    # This option will be ignored if output_type != "issue".
    #
    # Default: "fbca04"
    label_color: ''

    # Personal access token (PAT) used to create an issue on this repository.
    # This token is optional and only required if this actions is configured to
    # output an issue (see `output_type`). This token must have the `public_repo`
    # scope for the current repository in order to work properly.
    #
    # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    #
    # Default: ${{ github.token }}
    token: ''

    # The username associated with the `token` field. Repolinter-action uses
    # this value to determine which issues have been created by itself. Prefix
    # this value with `app/` if `token` is generated from a GitHub app instead
    # of a normal user (see https://docs.github.com/en/github/searching-for-information-on-github/searching-issues-and-pull-requests#search-by-author).
    #
    # Defaults to the username associated with the `GITHUB_TOKEN` provided by Github
    # Actions.
    #
    # Default: app/github-actions
    username: ''

    # The repository name and owner, formatted like so: `owner/repository`.
    # This input determines which repository repolinter-action will create
    # an issue on, if that functionality is enabled.
    #
    # It is recommended that this option is left as the default value.
    #
    # Default: ${{ github.repository }}
    repository: ''
```

## Outputs

| Key           | Type    | Description                                                                                                   |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `passed`      | boolean | A boolean indicating whether or not the ruleset passed, equivalent to `LintResult#passed`.                    |
| `errored`     | boolean | A boolean indicating whether or or not any errors occurred when running repolinter-action                     |
| `json_output` | string? | The JSON-ified repolinter output from `repolinter.jsonFormatter`. Will only be present if `errored` is false. |

## Setting up Repolinter Configuration
To use the PR creation feature, you'll need to modify your repolinter configuration to include two additional fields in the `options` object for each rule:

- `file-name`: Specifies the name of the file to create or update
- `file-content`: Defines the template content to be added

#### Example Configuration
```json
 "rules": {
   "security-file-exists": {
     "level": "error",
     "rule": {
       "type": "file-existence",
       "options": {
         "globsAny": ["{docs/,.github/,}SECURITY.md"],
         "file-name": "SECURITY.md",
         "file-content": "# Security Policy\n\n
         ## Submit a vulnerability: Vulnerability reports can be submitted through Bugcrowd. Reports may be submitted anonymously. If you share contact information, we will acknowledge receipt of your report within 3 business days.
         Review the HHS Disclosure Policy and websites in scope: https://www.hhs.gov/vulnerability-disclosure-policy/index.html."
       }
     }
   },
   "readme-contains-about": {
     "level": "error",
     "rule": {
       "type": "file-contents",
       "options": {
         "globsAll": ["README.md"],
         "content": "about",
         "flags": "i",
         "file-name": "README.md",
         "file-content": "\n## About the Project\n\n
          This project helps you do amazing things by doing this and then achieving that."
       }
     }
   }
 }
```

#### Example Repolinter Configuration Files
- [Reposcaffolder Tier 1](https://github.com/DSACMS/repo-scaffolder/blob/main/tier1/%7B%7Bcookiecutter.project_slug%7D%7D/repolinter.json)


## Usage

### Create a PR based on validation 
The following will run Repolinter and send a PR based on the output when the workflow is manually activated. If the repo is compliant with the repolinter configuration, nothing will be sent otherwise, a PR with the missing files and fields will be sent.
```yaml
name: 'Create a PR based on validation'

on: 
    workflow_dispatch: {} 

jobs:
  repolinter-action:
    runs-on: ubuntu-latest
    name: Run Repolinter
    permissions:
      contents: write
      pull-requests: write
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4
      - name: 'Run Repolinter'
        uses: DSACMS/repolinter-actions@main 
        with:
          output_type: 'pull-request'
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN}}
          # The PAT needs full `repo` scope
```
### Validate master branch with the default ruleset

The following will run Repolinter with the default ruleset on every push to master, and exit with status 1 if the repository does not pass.

```yaml

name: 'Validate master branch with Repolinter'

on:
  push:
    branches:
      - master

jobs:
  repolinter-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: 'Run Repolinter'
        uses: newrelic/repolinter-action@v1

```

### Validate master branch with a remote ruleset

The following will run Repolinter with a [remote ruleset](https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json) on every push to master, and exit with status 1 if the repository does not pass.

```yaml

name: 'Validate master branch with Repolinter'

on:
  push:
    branches:
      - master

jobs:
  repolinter-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: 'Run Repolinter'
        uses: newrelic/repolinter-action@v1
        with:
          config_url: https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json

```

### Open an issue on validation fail

The following will run repolinter with a [remote ruleset](https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json) on every push to master, and open a GitHub issue if the repository does not pass.

```yaml
name: 'Validate master branch with Repolinter'

on:
  push:
    branches:
      - master

jobs:
  # Because the output-type is set to 'issue', this job will always succeed.
  repolinter-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: 'Run Repolinter'
        uses: newrelic/repolinter-action@v1
        with:
          config_url: https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json
          output_type: issue
          # Optionally you can customize the issue and label repolinter-action will create
          output_name: '[Bot] My Issue Title'
          label_name: 'my-repolinter-label'
          label_color: 'ffffff'
```

### Run against another repository

The following will run repolinter with the default ruleset against [aperture-science-incorporated/companion-cube](https://github.com/aperture-science-incorporated/companion-cube) on every push to master of the current repository; if the ruleset does not pass, repolinter-action will open a GitHub issue on companion-cube. Note that a custom personal access token (`MY_TOKEN`) and PAT username (`my-token-username`) must be specified, as `GITHUB_TOKEN` [does not have write permission for repositories other than the current one](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#about-the-github_token-secret).

```yaml
name: Apply Repolinter
on:
  push:
    branches:
      - master

jobs:
  apply-repolinter:
    name: Apply Repolinter Somewhere Else
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
        with:
          repository: aperture-science-incorporated/companion-cube

      - name: Run Repolinter
        uses: newrelic/repolinter-action@develop
        with:
          output_type: issue
          repository: aperture-science-incorporated/companion-cube
          username: my-token-username
          token: ${{ secrets.MY_TOKEN }}
```
## PR Creation Behavior
if `output_type` is set to `pull-request`, repolinter-action will create a PR with the Repolinter output on the cirrent repository. An example PR can be found here: https://github.com/DSACMS/repolinter-actions/pull/2

## Issue Creation Behavior

##### Currently, only sending PR's are available in this action. If you would like to send an Issue rather than a PR, use the original [repolinter-action](https://github.com/newrelic/repolinter-action). We plan to support both.

If `output_type` is set to `issue`, repolinter-action will create a GitHub issue with the Repolinter output on the current repository. An example issue can be found here: https://github.com/aperture-science-incorporated/companion-cube/issues/44.

To prevent unnecessary noise, repolinter-action will first attempt to edit an existing open issue before creating a new one. This check is performed every workflow run, and can be emulated using the following [GitHub search](https://docs.github.com/en/github/searching-for-information-on-github) query:
```
type:issue repo:<the current repo> creator:<username> label:<label-name> state:open sort:author-date-desc
```
If no issues are returned by this query, repolinter-action will create a new one. If more than one issue is returned by this query, repolinter-action will edit the first issue in the list (the issue most recently created) and ignore the others.

### Consistency

As GitHub Actions can run many workflows in parallel, repolinter-action runs may happen in a different order than commits occurred. To prevent out-of-order action runs from generating issue noise, repolinter-action will first search the body of the most recently created repolinter-action issue (open or closed) for a magic string containing the [`GITHUB_RUN_NUMBER`](https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables#about-environment-variables) of the last run that updated the issue. If the run number present in the issue is greater than the local `GITHUB_RUN_NUMBER`, repolinter-action will assume that its results are out of date and will not modify the issue. If the magic string is invalid, not present, or contains a lower run number, repolinter-action will assume its results are up to date and perform its modifications. This magic string is encoded as follows:
```md
<!-- repolinter-action-workflow-number:<GITHUB_RUN_NUMBER> -->
```

## Contributing

We encourage your contributions to improve Repolinter Action! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com.

## License

repolinter-action is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

> This repo also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the [third-party-notices](./THIRD_PARTY_NOTICES.md) document.
 
 ## Core Team
 An up-to-date list of core team members can be found in [MAINTAINERS.md](MAINTAINERS.md). At this time, the project is still building the core team and defining roles and responsibilities. We are eagerly seeking individuals who would like to join the community and help us define and fill these roles. 
 
 ## Policies
 
 ### Security and Responsible Disclosure Policy
 *Submit a vulnerability:* Vulnerability reports can be submitted through [Bugcrowd](https://bugcrowd.com/cms-vdp). Reports may be submitted anonymously. If you share contact information, we will acknowledge receipt of your report within 3 business days.
For more information about our Security, Vulnerability, and Responsible Disclosure Policies, see [SECURITY.md](SECURITY.md). 
 
 ## Public Domain
 This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/) as indicated in [LICENSE](LICENSE).
All contributions to this project will be released under the CC0 dedication. By submitting a pull request or issue, you are agreeing to comply with this waiver of copyright interest.
 
 ### Software Bill of Materials (SBOM)
A Software Bill of Materials (SBOM) is a formal record containing the details and supply chain relationships of various components used in building software.
In the spirit of [Executive Order 14028 - Improving the Nation's Cyber Security](https://www.gsa.gov/technology/it-contract-vehicles-and-purchasing-programs/information-technology-category/it-security/executive-order-14028), a SBOM for this repository is provided here: https://github.com/{repo_org}/{repo_name}/network/dependencies.
For more information and resources about SBOMs, visit: https://www.cisa.gov/sbom.