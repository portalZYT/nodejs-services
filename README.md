Using EggJs framework: https://www.eggjs.org/zh-CN/
分支如下格式: eggjs/dev-* ,主分支 为 eggjs/main
# 数据库脚本(初始化创建用户表)
npx sequelize migration:generate --name=init-users
# 升级数据库(已有数据库脚本，用下面这个命令来执行还原和升级)
npx sequelize db:migrate

# 如果有问题需要回滚，可以通过 `db:migrate:undo` 回退一个变更

# npx sequelize db:migrate:undo

# 可以通过 `db:migrate:undo:all` 回退到初始状态

TODO: logs功能待完善 https://github.com/pinojs/pino