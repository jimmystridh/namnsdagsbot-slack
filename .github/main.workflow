workflow "hadolint docker linting action" {
  on = "push"
  resolves = ["hadolint"]
}

action "hadolint" {
  uses = "burdzwastaken/hadolint-action@master"
  secrets = ["GITHUB_TOKEN"]
  env = {
    HADOLINT_ACTION_DOCKERFILE_FOLDER = "."
  }
}
