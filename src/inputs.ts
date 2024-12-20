export const enum ActionInputs {
  DIRECTORY = 'directory',
  TOKEN = 'token',
  USERNAME = 'username',
  CONFIG_URL = 'config_url',
  CONFIG_FILE = 'config_file',
  REPO = 'repository',
  OUTPUT_TYPE = 'output_type',
  OUTPUT_NAME = 'output_name',
  PULL_REQUEST_LABELS = 'pull_request_labels',
  ISSUE_LABEL_NAME = 'issue_label_name',
  ISSUE_LABEL_COLOR = 'issue_label_color',
  BASE_BRANCH = "base_branch"
}

export const enum ActionOutputs {
  PASSED = 'passed',
  ERRORED = 'errored',
  JSON_OUTPUT = 'json_output'
}
