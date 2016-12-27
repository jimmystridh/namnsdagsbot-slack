# Namnsdagsbot
[![CircleCI](https://circleci.com/gh/jimmystridh/namnsdagsbot-slack.svg?style=svg)](https://circleci.com/gh/jimmystridh/namnsdagsbot-slack)

Announces name days in a slack channel

#How to start
* Clone the repo
* copy .env.sample and nameToUsersMap.sample.json to .env and nameToUsersMap.json and edit
* docker build . -t name-days-slack
* docker run --restart=always -d name-days-slack
