# gdutday-uniapp 
前人栽树  后人乘凉  拥抱开源  
如果喜欢点个 Star 拜托拜托这对我们真的很重要  

<img src="https://gdutday.gitee.io/textpage/images/pic14.jpg" width="200px" height="200px"></img>  
微信扫码体验!!

## 写在前面
这里的内容和项目的结构没什么关系,主要说下之后 gdutday 维护问题.目前 gdutday 由广东工业大学电子科技协会(后文简称电协)负责后期运营,具体小程序运营和最高权限管理由电协网络组 [@elcbng](https://github.com/elcbng)完成.gdutday-wechat 承诺一年内至少不会做盈利相关的东西,免费的优质推广可以会考虑(如公益服务、学生心理健康教育推广).

## 项目架构与成员
本项目前端部分使用基于 [vue.js](https://github.com/vuejs/vue) 跨平台框架 [uniapp](https://github.com/dcloudio/uni-app) 开发 wechat 的小程序服务.目前提供课表查询、校内绩点、入馆二维码、校园导览等服务.项目架构大体满足 uniapp 的项目架构,除去部分不由 node 管理的一些JavaScript SDK 放置在了 js_sdk 目录,以及项目开始书写是在我们大一时期,大家的代码能力以及编程能力不足,造成了许多代码冗余和部分历史遗留问题,这部分欢迎大家重构.由于在地图导览中引入了腾讯地图sdk使得其在其他平台上的体验无法那么优质,以及国内绝大多数用户都习惯使用微信小程序,所以兼容微信平台.

感谢本 repo 的初创者
- 策划/产品[@Muzhou233](https://github.com/Muzhou233)
- 后端/运维/产品[@Cerbur](https://github.com/Cerbur)
- 前端[@xingxinglieo](https://github.com/xingxinglieo)
- 爬虫[@YangZeqin](https://github.com/YangZeqin)
- 后端[@seehin](https://github.com/seehin)

## 如何参与开发
如果你是前端,可以选择学习 [vue.js](https://github.com/vuejs/vue) 和跨平台框架 [uniapp](https://github.com/dcloudio/uni-app).fork or download 本 repo.然后使用 [hbuilderx](https://dcloud.io/hbuilderx.html) 集成uniapp开发工具进行项目的构建,最后通过 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 进行调试.如果开发的功能不错想让更多的同学使用,可以选择 pull request 与本项目合并,或者选择自行运营自己的小程序.  

如果你是后端,可以选择关注本 organization 的其他与后端有关的 repo, 然后选择去阿里云或腾讯云使用学生优惠购买10月一个月的服务器跑这些后台.  

如果你是产品,可以给本项目提 issue 进行功能上和设计上的改进和建议.  

## 开发规划和主线
1. 产品的第一个主线是基于OCR技术的校内失物招领(暂命名为千寻系统).OCR是针对校园卡等学校内常丢的东西优化的.用户仅仅拍一张校卡照片上传后端,即可获取卡号,名字以及对人照片进行打码处理.上传学号,如果被捡到此校卡对人也同样在使用本软件.将会直接发一条消息推送到此用户,更加便捷的找到丢校卡的人.  
2. 这个项目的构思的时候,学校并没有开始使用趣拓校园.那时候就很想做一个活动的发布平台,很多那种文娱活动是不会发布到班级的通知群的,所以想做一个能有什么活动,活动有多少时长,活动的时间进行展示的平台,然后如果想参加这个活动,可以**直接添加到课程表中**来提醒自己不会遗忘.对于各个发布互动的协会组织也能快速了解到参与到人数,对场地进行对应的新规划.与此同时也给普通的人有个约人的平台,比方说,可以发布一个打球的活动,想打球的同学就可以参与.此后还能对这个互动发布一些图片或者心得,作为类朋友圈的一种社交方式.  
3. 最后的最后的主线,就是我们大一的时候深受通知群的困扰,我们特别希望能有一个更友好的方式来解决部门班级一些开会安排的适宜.这里的逻辑大概就是,普通的用户可以创建一个team,其他用户可以加入到这个 team 之中,team 的拥有者发布会议或者活动安排给所有的用户.用户将进行确认,如果同意将会把这个行程添加到日常表中,如果拒绝会返回信息给 team 拥有者,team 拥有者能查看到所有人的确认状态,来更高
