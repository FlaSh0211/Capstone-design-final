# whereCar

### 아이디어



### 프로젝트 구성

FRONT-END

* `npx create-react-app FRONT-END`

BACK-END

* webframework
  * `yarn add koa`
  * `yarn add koa-router`
* DB
  * MongoDB
  * `yarn add mongoose`

* SocketIO
  * `yarn add soketIO`
* Server
  * `yarn add --dev nodemon`
  * `yarn add dotenv`

Env

* eslint
  * `yarn add --global eslint`
  * `yarn add eslint`
  * `eslint init`

--------------

BACK-END

joi 사용

* What is the joi???
  * <https://thebook.io/006946/ch19/08/02-01/>

* `yarn add joi`

bodypaser

* `yarn add koa-bodyparser`

NODE_PATH=src 추가하기

* `yarn add cross-env`

JWT 사용하기 ( 웹토큰 )

* `yarn add jsonwebtoken`

secret-key 만들기

```javascript
const crypto = require('crypto');

const password = 'abc123';
const secret = 'MySecretKey1$1$234';

const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');

console.log(hashed);
```





--------------

## mongoose study



methods와 statics의 차이

* methods는 새로 만든 객체를 통해 작업을 할 경우 선언해 사용하고, statics는 객체 선언이나 데이터 대입 없이 조회와 같은 기능을 선언해 사용하면 됩니다.

