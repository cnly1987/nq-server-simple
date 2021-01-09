# nq-server-simple

#### 介绍
nq-server-simple  基于nodequery.com的开源客户端开发的服务端,

#### 软件架构
nodejs
sqlite3
mongodb

#### 演示
演示地址:http://www.monitorx.xyz/
![Alt text](http://www.monitorx.xyz/static/assets/images/nodequery/home1.png)
![Alt text](http://www.monitorx.xyz/static/assets/images/nodequery/home2.png)
![Alt text](http://www.monitorx.xyz/static/assets/images/nodequery/home3.png)

#### 安装流程

```shell
yum -y install  nodejs
npm install -g n  #安装n版本管理工具  yarn管理工具 和pm2进程守护工具
n stable
npm install -g yarn pm2

yum -y install git  #安装 git
git clone https://github.com/cnly1987/nq-server-simple.git  #克隆代码
cd nq-server-simple
yarn      #安装依赖
node ace build  #

在.env文件夹按照 格式填写mongodb连接地址。【如何安装mongodb这里就不介绍了】,记得修改下APIKEY

然后把tmp文件夹和.env 拷贝到build文件夹。
.env 文件可以设置运行的端口，自己自行设置。
执行pm2 start build/server.js
然后pm2 list 查看下有没有问题，状态running表示OK了。  默认端口是2323， 地址是127.0.0.1:2323

```


