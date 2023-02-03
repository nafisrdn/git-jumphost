### Example of using docker run:

#### Build
```
docker build -t webhook-listener:latest .
```

#### Run
```
docker run `
 --name webhook-listener `
 -d `
 -e PORT=8080 `
 -e SOURCE_REPO_URL=gitlab.com/user1/source.git `
 -e TARGET_REPO_URL=gitlab.com/user2/target.git `
 -e SOURCE_BRANCH=main `
 -e TARGET_BRANCH=main `
 -e SOURCE_GIT_USERNAME=user1 `
 -e SOURCE_GIT_PASSWORD=password1 `
 -e TARGET_GIT_USERNAME=user2 `
 -e TARGET_GIT_PASSWORD=password2 `
 -p 8080:8080 webhook-listener:latest `
 ./init.sh
 ```