// 短语动词和习语词库
// 用于字幕自动高亮标注

export interface PhraseEntry {
  phrase: string;          // 短语/习语原文
  meaning: string;          // 中文含义
  type: 'phrasal' | 'idiom'; // 类型：短语动词 or 习语
}

// 常见短语动词
export const phrasalVerbs: PhraseEntry[] = [
  // 基础动词组
  { phrase: 'figure out', meaning: '弄清楚，搞懂', type: 'phrasal' },
  { phrase: 'find out', meaning: '发现，找出', type: 'phrasal' },
  { phrase: 'look up', meaning: '查阅，查找', type: 'phrasal' },
  { phrase: 'look after', meaning: '照顾，照料', type: 'phrasal' },
  { phrase: 'look forward to', meaning: '期待，盼望', type: 'phrasal' },
  { phrase: 'look into', meaning: '调查，研究', type: 'phrasal' },
  { phrase: 'look down on', meaning: '轻视，看不起', type: 'phrasal' },
  { phrase: 'look out', meaning: '小心，注意', type: 'phrasal' },
  { phrase: 'look over', meaning: '检查，复习', type: 'phrasal' },
  { phrase: 'look through', meaning: '浏览，快速查看', type: 'phrasal' },
  
  // come 系列
  { phrase: 'come across', meaning: '偶然遇到', type: 'phrasal' },
  { phrase: 'come up with', meaning: '想出，提出', type: 'phrasal' },
  { phrase: 'come out', meaning: '出版，发行；结果是', type: 'phrasal' },
  { phrase: 'come back', meaning: '回来，恢复', type: 'phrasal' },
  { phrase: 'come from', meaning: '来自，源于', type: 'phrasal' },
  { phrase: 'come true', meaning: '实现，成真', type: 'phrasal' },
  { phrase: 'come on', meaning: '快点，加油', type: 'phrasal' },
  { phrase: 'come down', meaning: '下来，降落', type: 'phrasal' },
  { phrase: 'come in', meaning: '进来', type: 'phrasal' },
  { phrase: 'come up', meaning: '出现，发生', type: 'phrasal' },
  
  // get 系列
  { phrase: 'get up', meaning: '起床，起身', type: 'phrasal' },
  { phrase: 'get along', meaning: '相处融洽，进展', type: 'phrasal' },
  { phrase: 'get over', meaning: '克服，恢复', type: 'phrasal' },
  { phrase: 'get rid of', meaning: '摆脱，除去', type: 'phrasal' },
  { phrase: 'get back', meaning: '回来，拿回', type: 'phrasal' },
  { phrase: 'get away', meaning: '离开，逃脱', type: 'phrasal' },
  { phrase: 'get used to', meaning: '习惯于', type: 'phrasal' },
  { phrase: 'get ready', meaning: '准备', type: 'phrasal' },
  { phrase: 'get down', meaning: '下来；使沮丧', type: 'phrasal' },
  { phrase: 'get in', meaning: '进入，到达', type: 'phrasal' },
  { phrase: 'get out', meaning: '出去，离开', type: 'phrasal' },
  { phrase: 'get through', meaning: '通过，度过', type: 'phrasal' },
  { phrase: 'get together', meaning: '聚会，聚集', type: 'phrasal' },
  { phrase: 'get on', meaning: '上车；相处', type: 'phrasal' },
  { phrase: 'get off', meaning: '下车；脱下', type: 'phrasal' },
  
  // take 系列
  { phrase: 'take off', meaning: '起飞；脱下；请假', type: 'phrasal' },
  { phrase: 'take up', meaning: '开始从事；占据', type: 'phrasal' },
  { phrase: 'take out', meaning: '取出；带出去', type: 'phrasal' },
  { phrase: 'take care', meaning: '小心，注意', type: 'phrasal' },
  { phrase: 'take part in', meaning: '参加', type: 'phrasal' },
  { phrase: 'take place', meaning: '发生，举行', type: 'phrasal' },
  { phrase: 'take time', meaning: '花费时间', type: 'phrasal' },
  { phrase: 'take turns', meaning: '轮流', type: 'phrasal' },
  { phrase: 'take advantage of', meaning: '利用', type: 'phrasal' },
  { phrase: 'take charge', meaning: '负责，掌管', type: 'phrasal' },
  { phrase: 'take into account', meaning: '考虑到', type: 'phrasal' },
  { phrase: 'take over', meaning: '接管，接替', type: 'phrasal' },
  
  // put 系列
  { phrase: 'put up', meaning: '举起；建造；张贴', type: 'phrasal' },
  { phrase: 'put off', meaning: '推迟，延期', type: 'phrasal' },
  { phrase: 'put on', meaning: '穿上；上演', type: 'phrasal' },
  { phrase: 'put out', meaning: '熄灭；出版', type: 'phrasal' },
  { phrase: 'put away', meaning: '收起来，存起来', type: 'phrasal' },
  { phrase: 'put down', meaning: '放下；写下', type: 'phrasal' },
  { phrase: 'put forward', meaning: '提出；推荐', type: 'phrasal' },
  { phrase: 'put up with', meaning: '忍受，容忍', type: 'phrasal' },
  
  // give 系列
  { phrase: 'give up', meaning: '放弃', type: 'phrasal' },
  { phrase: 'give in', meaning: '屈服，让步', type: 'phrasal' },
  { phrase: 'give out', meaning: '分发；耗尽', type: 'phrasal' },
  { phrase: 'give away', meaning: '赠送；泄露', type: 'phrasal' },
  { phrase: 'give back', meaning: '归还；恢复', type: 'phrasal' },
  { phrase: 'give rise to', meaning: '引起，导致', type: 'phrasal' },
  
  // make 系列
  { phrase: 'make up', meaning: '组成；编造；化妆', type: 'phrasal' },
  { phrase: 'make out', meaning: '理解；辨认出', type: 'phrasal' },
  { phrase: 'make up for', meaning: '弥补，补偿', type: 'phrasal' },
  { phrase: 'make sense', meaning: '有意义，讲得通', type: 'phrasal' },
  { phrase: 'make sure', meaning: '确保，确认', type: 'phrasal' },
  { phrase: 'make progress', meaning: '取得进步', type: 'phrasal' },
  { phrase: 'make a difference', meaning: '有影响，有区别', type: 'phrasal' },
  { phrase: 'make an effort', meaning: '努力', type: 'phrasal' },
  { phrase: 'make a decision', meaning: '做决定', type: 'phrasal' },
  { phrase: 'make a mistake', meaning: '犯错误', type: 'phrasal' },
  { phrase: 'make money', meaning: '赚钱', type: 'phrasal' },
  { phrase: 'make friends', meaning: '交朋友', type: 'phrasal' },
  
  // go 系列
  { phrase: 'go through', meaning: '经历；仔细检查', type: 'phrasal' },
  { phrase: 'go on', meaning: '继续；发生', type: 'phrasal' },
  { phrase: 'go ahead', meaning: '前进，进行', type: 'phrasal' },
  { phrase: 'go back', meaning: '回去；回顾', type: 'phrasal' },
  { phrase: 'go over', meaning: '复习；检查', type: 'phrasal' },
  { phrase: 'go around', meaning: '四处走动；传播', type: 'phrasal' },
  { phrase: 'go up', meaning: '上升；上涨', type: 'phrasal' },
  { phrase: 'go down', meaning: '下降；被记录', type: 'phrasal' },
  { phrase: 'go off', meaning: '爆炸；响起', type: 'phrasal' },
  { phrase: 'go out', meaning: '出去；熄灭', type: 'phrasal' },
  { phrase: 'go for', meaning: '追求；适用于', type: 'phrasal' },
  { phrase: 'go against', meaning: '违背；反对', type: 'phrasal' },
  { phrase: 'go by', meaning: '时间流逝；经过', type: 'phrasal' },
  { phrase: 'go with', meaning: '与...相配', type: 'phrasal' },
  { phrase: 'go without', meaning: '没有...也行', type: 'phrasal' },
  
  // turn 系列
  { phrase: 'turn on', meaning: '打开', type: 'phrasal' },
  { phrase: 'turn off', meaning: '关闭', type: 'phrasal' },
  { phrase: 'turn up', meaning: '出现；调大', type: 'phrasal' },
  { phrase: 'turn down', meaning: '拒绝；调小', type: 'phrasal' },
  { phrase: 'turn into', meaning: '变成', type: 'phrasal' },
  { phrase: 'turn out', meaning: '结果是；关闭', type: 'phrasal' },
  { phrase: 'turn around', meaning: '转身；好转', type: 'phrasal' },
  { phrase: 'turn over', meaning: '翻转；移交', type: 'phrasal' },
  { phrase: 'turn to', meaning: '转向；求助于', type: 'phrasal' },
  { phrase: 'turn away', meaning: '拒绝；走开', type: 'phrasal' },
  
  // break 系列
  { phrase: 'break up', meaning: '分手；解散', type: 'phrasal' },
  { phrase: 'break down', meaning: '故障；崩溃；分解', type: 'phrasal' },
  { phrase: 'break in', meaning: '闯入；插嘴', type: 'phrasal' },
  { phrase: 'break out', meaning: '爆发', type: 'phrasal' },
  { phrase: 'break through', meaning: '突破', type: 'phrasal' },
  { phrase: 'break away', meaning: '脱离；逃脱', type: 'phrasal' },
  { phrase: 'break into', meaning: '强行进入', type: 'phrasal' },
  
  // carry 系列
  { phrase: 'carry on', meaning: '继续', type: 'phrasal' },
  { phrase: 'carry out', meaning: '执行；完成', type: 'phrasal' },
  { phrase: 'carry over', meaning: '延续', type: 'phrasal' },
  { phrase: 'carry through', meaning: '完成；度过难关', type: 'phrasal' },
  
  // call 系列
  { phrase: 'call back', meaning: '回电话', type: 'phrasal' },
  { phrase: 'call off', meaning: '取消', type: 'phrasal' },
  { phrase: 'call on', meaning: '拜访；号召', type: 'phrasal' },
  { phrase: 'call up', meaning: '打电话；召集', type: 'phrasal' },
  { phrase: 'call for', meaning: '需要；呼吁', type: 'phrasal' },
  
  // bring 系列
  { phrase: 'bring up', meaning: '抚养；提出', type: 'phrasal' },
  { phrase: 'bring about', meaning: '引起，导致', type: 'phrasal' },
  { phrase: 'bring out', meaning: '出版；使显现', type: 'phrasal' },
  { phrase: 'bring in', meaning: '引入；赚取', type: 'phrasal' },
  { phrase: 'bring down', meaning: '降低；击落', type: 'phrasal' },
  { phrase: 'bring together', meaning: '使聚在一起', type: 'phrasal' },
  
  // set 系列
  { phrase: 'set up', meaning: '建立；设置', type: 'phrasal' },
  { phrase: 'set off', meaning: '出发；引爆', type: 'phrasal' },
  { phrase: 'set out', meaning: '出发；开始', type: 'phrasal' },
  { phrase: 'set aside', meaning: '留出；不考虑', type: 'phrasal' },
  { phrase: 'set free', meaning: '释放', type: 'phrasal' },
  { phrase: 'set an example', meaning: '树立榜样', type: 'phrasal' },
  
  // pick 系列
  { phrase: 'pick up', meaning: '捡起；接载；学会', type: 'phrasal' },
  { phrase: 'pick out', meaning: '挑选；辨认出', type: 'phrasal' },
  
  // cut 系列
  { phrase: 'cut off', meaning: '切断；中断', type: 'phrasal' },
  { phrase: 'cut down', meaning: '削减；砍倒', type: 'phrasal' },
  { phrase: 'cut out', meaning: '删除；停止', type: 'phrasal' },
  { phrase: 'cut in', meaning: '插嘴；超车', type: 'phrasal' },
  
  // hand 系列
  { phrase: 'hand in', meaning: '上交', type: 'phrasal' },
  { phrase: 'hand out', meaning: '分发', type: 'phrasal' },
  { phrase: 'hand over', meaning: '移交', type: 'phrasal' },
  
  // stand 系列
  { phrase: 'stand up', meaning: '站起来', type: 'phrasal' },
  { phrase: 'stand for', meaning: '代表；忍受', type: 'phrasal' },
  { phrase: 'stand by', meaning: '支持；待命', type: 'phrasal' },
  { phrase: 'stand out', meaning: '突出；显眼', type: 'phrasal' },
  
  // sit 系列
  { phrase: 'sit down', meaning: '坐下', type: 'phrasal' },
  { phrase: 'sit up', meaning: '坐直；熬夜', type: 'phrasal' },
  { phrase: 'sit back', meaning: '休息；袖手旁观', type: 'phrasal' },
  
  // point 系列
  { phrase: 'point out', meaning: '指出', type: 'phrasal' },
  { phrase: 'point to', meaning: '指向', type: 'phrasal' },
  { phrase: 'point at', meaning: '指着', type: 'phrasal' },
  
  // 其他常见短语
  { phrase: 'grow up', meaning: '成长，长大', type: 'phrasal' },
  { phrase: 'wake up', meaning: '醒来，唤醒', type: 'phrasal' },
  { phrase: 'stay up', meaning: '熬夜', type: 'phrasal' },
  { phrase: 'dress up', meaning: '盛装打扮', type: 'phrasal' },
  { phrase: 'end up', meaning: '最终...', type: 'phrasal' },
  { phrase: 'run out', meaning: '用完，耗尽', type: 'phrasal' },
  { phrase: 'fill out', meaning: '填写', type: 'phrasal' },
  { phrase: 'write down', meaning: '写下', type: 'phrasal' },
  { phrase: 'depend on', meaning: '依赖，取决于', type: 'phrasal' },
  { phrase: 'focus on', meaning: '专注于', type: 'phrasal' },
  { phrase: 'agree with', meaning: '同意', type: 'phrasal' },
  { phrase: 'deal with', meaning: '处理，应对', type: 'phrasal' },
  { phrase: 'wait for', meaning: '等待', type: 'phrasal' },
  { phrase: 'believe in', meaning: '相信，信任', type: 'phrasal' },
  { phrase: 'laugh at', meaning: '嘲笑', type: 'phrasal' },
  { phrase: 'dream of', meaning: '梦想', type: 'phrasal' },
  { phrase: 'care about', meaning: '关心，在意', type: 'phrasal' },
  { phrase: 'think about', meaning: '思考，考虑', type: 'phrasal' },
  { phrase: 'hear about', meaning: '听说', type: 'phrasal' },
  { phrase: 'talk about', meaning: '谈论', type: 'phrasal' },
  { phrase: 'learn from', meaning: '向...学习', type: 'phrasal' },
  { phrase: 'hear from', meaning: '收到...的来信', type: 'phrasal' },
  { phrase: 'pay for', meaning: '为...付款', type: 'phrasal' },
  { phrase: 'show off', meaning: '炫耀', type: 'phrasal' },
  { phrase: 'show up', meaning: '出现，露面', type: 'phrasal' },
  { phrase: 'belong to', meaning: '属于', type: 'phrasal' },
  { phrase: 'add up', meaning: '加起来；合理', type: 'phrasal' },
  { phrase: 'count on', meaning: '依靠，指望', type: 'phrasal' },
  { phrase: 'count down', meaning: '倒计时', type: 'phrasal' },
  { phrase: 'cheer up', meaning: '振作起来', type: 'phrasal' },
  { phrase: 'clean up', meaning: '打扫干净', type: 'phrasal' },
  { phrase: 'catch up', meaning: '赶上，追上', type: 'phrasal' },
  { phrase: 'drop off', meaning: '放下；减少', type: 'phrasal' },
  { phrase: 'drop out', meaning: '退出；退学', type: 'phrasal' },
  { phrase: 'hang out', meaning: '闲逛', type: 'phrasal' },
  { phrase: 'hang up', meaning: '挂断电话', type: 'phrasal' },
  { phrase: 'hold on', meaning: '等一下；坚持', type: 'phrasal' },
  { phrase: 'hold up', meaning: '举起；支撑；延误', type: 'phrasal' },
  { phrase: 'keep on', meaning: '继续', type: 'phrasal' },
  { phrase: 'keep up', meaning: '跟上；保持', type: 'phrasal' },
  { phrase: 'keep off', meaning: '避开；不接近', type: 'phrasal' },
  { phrase: 'knock out', meaning: '击倒；淘汰', type: 'phrasal' },
  { phrase: 'laugh off', meaning: '一笑了之', type: 'phrasal' },
  { phrase: 'lay off', meaning: '裁员', type: 'phrasal' },
  { phrase: 'leave out', meaning: '遗漏；省略', type: 'phrasal' },
  { phrase: 'let down', meaning: '使失望', type: 'phrasal' },
  { phrase: 'lie down', meaning: '躺下', type: 'phrasal' },
  { phrase: 'live on', meaning: '继续存在；以...为生', type: 'phrasal' },
  { phrase: 'live up to', meaning: '不辜负；达到', type: 'phrasal' },
  { phrase: 'look around', meaning: '环顾四周', type: 'phrasal' },
  { phrase: 'mix up', meaning: '混淆；混合', type: 'phrasal' },
  { phrase: 'move on', meaning: '继续前进', type: 'phrasal' },
  { phrase: 'move in', meaning: '搬入', type: 'phrasal' },
  { phrase: 'move out', meaning: '搬出', type: 'phrasal' },
  { phrase: 'nod off', meaning: '打瞌睡', type: 'phrasal' },
  { phrase: 'open up', meaning: '打开；坦诚', type: 'phrasal' },
  { phrase: 'pack up', meaning: '收拾行李', type: 'phrasal' },
  { phrase: 'pass on', meaning: '传递；去世', type: 'phrasal' },
  { phrase: 'pass out', meaning: '昏倒；分发', type: 'phrasal' },
  { phrase: 'pay off', meaning: '还清；成功', type: 'phrasal' },
  { phrase: 'play with', meaning: '玩弄；与...玩耍', type: 'phrasal' },
  { phrase: 'pop up', meaning: '突然出现', type: 'phrasal' },
  { phrase: 'press on', meaning: '继续推进', type: 'phrasal' },
  { phrase: 'pull over', meaning: '靠边停车', type: 'phrasal' },
  { phrase: 'pull out', meaning: '退出；拔出', type: 'phrasal' },
  { phrase: 'push back', meaning: '推迟；反驳', type: 'phrasal' },
  { phrase: 'push up', meaning: '向上推', type: 'phrasal' },
  { phrase: 'react to', meaning: '对...作出反应', type: 'phrasal' },
  { phrase: 'refer to', meaning: '指的是；提及', type: 'phrasal' },
  { phrase: 'reply to', meaning: '回复', type: 'phrasal' },
  { phrase: 'result in', meaning: '导致，结果是', type: 'phrasal' },
  { phrase: 'rule out', meaning: '排除；不考虑', type: 'phrasal' },
  { phrase: 'run into', meaning: '遇到；撞上', type: 'phrasal' },
  { phrase: 'rush out', meaning: '冲出去；赶制', type: 'phrasal' },
  { phrase: 'sell out', meaning: '售罄；背叛', type: 'phrasal' },
  { phrase: 'send in', meaning: '提交；派遣', type: 'phrasal' },
  { phrase: 'send out', meaning: '发出；发送', type: 'phrasal' },
  { phrase: 'settle down', meaning: '定居；平静下来', type: 'phrasal' },
  { phrase: 'shut down', meaning: '关闭', type: 'phrasal' },
  { phrase: 'shut up', meaning: '闭嘴', type: 'phrasal' },
  { phrase: 'sign up', meaning: '报名，注册', type: 'phrasal' },
  { phrase: 'slow down', meaning: '减速；放慢', type: 'phrasal' },
  { phrase: 'snap up', meaning: '抢购', type: 'phrasal' },
  { phrase: 'speed up', meaning: '加速', type: 'phrasal' },
  { phrase: 'split up', meaning: '分手；分裂', type: 'phrasal' },
  { phrase: 'spread out', meaning: '展开；分散', type: 'phrasal' },
  { phrase: 'start over', meaning: '重新开始', type: 'phrasal' },
  { phrase: 'stick to', meaning: '坚持；遵守', type: 'phrasal' },
  { phrase: 'stock up', meaning: '囤货', type: 'phrasal' },
  { phrase: 'stop by', meaning: '顺便拜访', type: 'phrasal' },
  { phrase: 'sum up', meaning: '总结', type: 'phrasal' },
  { phrase: 'switch off', meaning: '关掉', type: 'phrasal' },
  { phrase: 'switch on', meaning: '打开', type: 'phrasal' },
  { phrase: 'take in', meaning: '欺骗；吸收；理解', type: 'phrasal' },
  { phrase: 'take on', meaning: '承担；呈现', type: 'phrasal' },
  { phrase: 'tell apart', meaning: '区分', type: 'phrasal' },
  { phrase: 'think of', meaning: '想到；认为', type: 'phrasal' },
  { phrase: 'think over', meaning: '仔细考虑', type: 'phrasal' },
  { phrase: 'throw away', meaning: '扔掉；浪费', type: 'phrasal' },
  { phrase: 'touch on', meaning: '提及；涉及', type: 'phrasal' },
  { phrase: 'try on', meaning: '试穿', type: 'phrasal' },
  { phrase: 'try out', meaning: '试用；测试', type: 'phrasal' },
  { phrase: 'use up', meaning: '用完', type: 'phrasal' },
  { phrase: 'warm up', meaning: '热身；预热', type: 'phrasal' },
  { phrase: 'wear off', meaning: '逐渐消失', type: 'phrasal' },
  { phrase: 'work out', meaning: '解决；锻炼；成功', type: 'phrasal' },
  { phrase: 'write up', meaning: '写文章描述', type: 'phrasal' },
  { phrase: 'zip up', meaning: '拉上拉链', type: 'phrasal' },
];

// 常见习语
export const idioms: PhraseEntry[] = [
  // 时间相关
  { phrase: 'at least', meaning: '至少', type: 'idiom' },
  { phrase: 'at first', meaning: '首先，最初', type: 'idiom' },
  { phrase: 'at last', meaning: '终于，最后', type: 'idiom' },
  { phrase: 'at once', meaning: '立即，马上', type: 'idiom' },
  { phrase: 'at the same time', meaning: '同时', type: 'idiom' },
  { phrase: 'at the beginning', meaning: '在开始时', type: 'idiom' },
  { phrase: 'at the end', meaning: '最后，最终', type: 'idiom' },
  { phrase: 'at the moment', meaning: '此刻，目前', type: 'idiom' },
  { phrase: 'at the age of', meaning: '在...岁时', type: 'idiom' },
  { phrase: 'at night', meaning: '在夜里', type: 'idiom' },
  { phrase: 'at noon', meaning: '在中午', type: 'idiom' },
  { phrase: 'at present', meaning: '目前，现在', type: 'idiom' },
  
  // 地点相关
  { phrase: 'in front of', meaning: '在...前面', type: 'idiom' },
  { phrase: 'in the front of', meaning: '在...前部', type: 'idiom' },
  { phrase: 'in the middle of', meaning: '在...中间', type: 'idiom' },
  { phrase: 'in the end', meaning: '最后，终于', type: 'idiom' },
  { phrase: 'in fact', meaning: '事实上，实际上', type: 'idiom' },
  { phrase: 'in addition to', meaning: '除了...之外', type: 'idiom' },
  { phrase: 'in order to', meaning: '为了，以便', type: 'idiom' },
  { phrase: 'in order that', meaning: '为了，以便', type: 'idiom' },
  { phrase: 'in danger', meaning: '处于危险中', type: 'idiom' },
  { phrase: 'in trouble', meaning: '陷入困境', type: 'idiom' },
  { phrase: 'in need', meaning: '需要帮助', type: 'idiom' },
  { phrase: 'in general', meaning: '总的来说', type: 'idiom' },
  { phrase: 'in particular', meaning: '尤其，特别', type: 'idiom' },
  { phrase: 'in return', meaning: '作为回报', type: 'idiom' },
  { phrase: 'in advance', meaning: '提前，预先', type: 'idiom' },
  { phrase: 'in charge of', meaning: '负责', type: 'idiom' },
  { phrase: 'in addition', meaning: '此外，另外', type: 'idiom' },
  { phrase: 'in case of', meaning: '万一，如果', type: 'idiom' },
  { phrase: 'in search of', meaning: '寻找', type: 'idiom' },
  { phrase: 'in spite of', meaning: '尽管，虽然', type: 'idiom' },
  { phrase: 'in favor of', meaning: '支持，赞成', type: 'idiom' },
  { phrase: 'in contrast to', meaning: '与...形成对比', type: 'idiom' },
  { phrase: 'in touch with', meaning: '与...联系', type: 'idiom' },
  { phrase: 'in the future', meaning: '在未来', type: 'idiom' },
  { phrase: 'in the past', meaning: '在过去', type: 'idiom' },
  { phrase: 'in the world', meaning: '究竟，到底', type: 'idiom' },
  { phrase: 'in a row', meaning: '连续地', type: 'idiom' },
  { phrase: 'in a way', meaning: '在某种程度上', type: 'idiom' },
  { phrase: 'in no way', meaning: '决不', type: 'idiom' },
  { phrase: 'in other words', meaning: '换句话说', type: 'idiom' },
  { phrase: 'in time', meaning: '及时；最终', type: 'idiom' },
  { phrase: 'in short', meaning: '简言之', type: 'idiom' },
  { phrase: 'in detail', meaning: '详细地', type: 'idiom' },
  
  // on 系列
  { phrase: 'on the way', meaning: '在途中', type: 'idiom' },
  { phrase: 'on the other hand', meaning: '另一方面', type: 'idiom' },
  { phrase: 'on purpose', meaning: '故意地', type: 'idiom' },
  { phrase: 'on time', meaning: '准时', type: 'idiom' },
  { phrase: 'on average', meaning: '平均', type: 'idiom' },
  { phrase: 'on display', meaning: '展出', type: 'idiom' },
  { phrase: 'on sale', meaning: '出售；打折', type: 'idiom' },
  { phrase: 'on duty', meaning: '值班', type: 'idiom' },
  { phrase: 'on business', meaning: '因公出差', type: 'idiom' },
  { phrase: 'on vacation', meaning: '度假', type: 'idiom' },
  { phrase: 'on a diet', meaning: '节食', type: 'idiom' },
  { phrase: 'on fire', meaning: '着火', type: 'idiom' },
  { phrase: 'on one's own', meaning: '独自；独立', type: 'idiom' },
  { phrase: 'on the contrary', meaning: '恰恰相反', type: 'idiom' },
  { phrase: 'on the spot', meaning: '当场；在现场', type: 'idiom' },
  { phrase: 'on the rise', meaning: '在上升', type: 'idiom' },
  { phrase: 'on the decline', meaning: '在下降', type: 'idiom' },
  { phrase: 'on the increase', meaning: '在增加', type: 'idiom' },
  { phrase: 'on the decrease', meaning: '在减少', type: 'idiom' },
  { phrase: 'once in a while', meaning: '偶尔，有时', type: 'idiom' },
  { phrase: 'once upon a time', meaning: '从前', type: 'idiom' },
  { phrase: 'from now on', meaning: '从现在开始', type: 'idiom' },
  { phrase: 'from time to time', meaning: '有时，偶尔', type: 'idiom' },
  { phrase: 'from...to...', meaning: '从...到...', type: 'idiom' },
  
  // 介词短语
  { phrase: 'next to', meaning: '紧挨着', type: 'idiom' },
  { phrase: 'instead of', meaning: '代替，而不是', type: 'idiom' },
  { phrase: 'because of', meaning: '因为，由于', type: 'idiom' },
  { phrase: 'thanks to', meaning: '多亏，由于', type: 'idiom' },
  { phrase: 'according to', meaning: '根据，按照', type: 'idiom' },
  { phrase: 'apart from', meaning: '除了...之外', type: 'idiom' },
  { phrase: 'away from', meaning: '远离', type: 'idiom' },
  { phrase: 'out of', meaning: '从...出来；缺乏', type: 'idiom' },
  { phrase: 'due to', meaning: '由于，因为', type: 'idiom' },
  { phrase: 'prior to', meaning: '在...之前', type: 'idiom' },
  { phrase: 'relative to', meaning: '关于，相对于', type: 'idiom' },
  { phrase: 'close to', meaning: '接近，靠近', type: 'idiom' },
  { phrase: 'up to', meaning: '多达；取决于', type: 'idiom' },
  { phrase: 'down to', meaning: '直到；归结于', type: 'idiom' },
  { phrase: 'by accident', meaning: '偶然，意外地', type: 'idiom' },
  { phrase: 'by mistake', meaning: '错误地', type: 'idiom' },
  { phrase: 'by chance', meaning: '偶然，碰巧', type: 'idiom' },
  { phrase: 'by the way', meaning: '顺便说一下', type: 'idiom' },
  { phrase: 'by means of', meaning: '通过...方式', type: 'idiom' },
  { phrase: 'by no means', meaning: '决不', type: 'idiom' },
  { phrase: 'by all means', meaning: '务必；当然可以', type: 'idiom' },
  { phrase: 'by the time', meaning: '到...时候为止', type: 'idiom' },
  { phrase: 'with the help of', meaning: '在...的帮助下', type: 'idiom' },
  { phrase: 'with regard to', meaning: '关于', type: 'idiom' },
  { phrase: 'with respect to', meaning: '关于', type: 'idiom' },
  { phrase: 'with the exception of', meaning: '除...之外', type: 'idiom' },
  { phrase: 'without doubt', meaning: '毫无疑问', type: 'idiom' },
  { phrase: 'for the sake of', meaning: '为了...起见', type: 'idiom' },
  { phrase: 'for the time being', meaning: '暂时，目前', type: 'idiom' },
  { phrase: 'as well as', meaning: '和，也', type: 'idiom' },
  { phrase: 'as a result', meaning: '结果，因此', type: 'idiom' },
  { phrase: 'as a result of', meaning: '由于...的结果', type: 'idiom' },
  { phrase: 'as a matter of fact', meaning: '事实上', type: 'idiom' },
  { phrase: 'as long as', meaning: '只要', type: 'idiom' },
  { phrase: 'as soon as', meaning: '一...就...', type: 'idiom' },
  { phrase: 'as far as', meaning: '就...而言；直到', type: 'idiom' },
  { phrase: 'as if', meaning: '好像，仿佛', type: 'idiom' },
  { phrase: 'as though', meaning: '好像，仿佛', type: 'idiom' },
  { phrase: 'as usual', meaning: '像往常一样', type: 'idiom' },
  { phrase: 'as always', meaning: '一如既往', type: 'idiom' },
  { phrase: 'such as', meaning: '例如，比如', type: 'idiom' },
  { phrase: 'so far', meaning: '到目前为止', type: 'idiom' },
  { phrase: 'so that', meaning: '以便；结果', type: 'idiom' },
  { phrase: 'so...that', meaning: '如此...以至于', type: 'idiom' },
  { phrase: 'not only...but also', meaning: '不仅...而且', type: 'idiom' },
  { phrase: 'either...or', meaning: '要么...要么', type: 'idiom' },
  { phrase: 'neither...nor', meaning: '既不...也不', type: 'idiom' },
  { phrase: 'no sooner...than', meaning: '一...就...', type: 'idiom' },
  { phrase: 'the more...the more', meaning: '越...越...', type: 'idiom' },
  { phrase: 'so as to', meaning: '为了，以便', type: 'idiom' },
  
  // 独立习语
  { phrase: 'of course', meaning: '当然', type: 'idiom' },
  { phrase: 'more or less', meaning: '或多或少', type: 'idiom' },
  { phrase: 'once again', meaning: '再一次', type: 'idiom' },
  { phrase: 'once more', meaning: '再次', type: 'idiom' },
  { phrase: 'over and over', meaning: '反复地', type: 'idiom' },
  { phrase: 'again and again', meaning: '反复地', type: 'idiom' },
  { phrase: 'time and again', meaning: '屡次，一再', type: 'idiom' },
  { phrase: 'up and down', meaning: '上下；来来往往', type: 'idiom' },
  { phrase: 'back and forth', meaning: '来回地', type: 'idiom' },
  { phrase: 'now and then', meaning: '偶尔，有时', type: 'idiom' },
  { phrase: 'here and there', meaning: '到处，四处', type: 'idiom' },
  { phrase: 'day and night', meaning: '日日夜夜', type: 'idiom' },
  { phrase: 'little by little', meaning: '渐渐地，逐步地', type: 'idiom' },
  { phrase: 'step by step', meaning: '逐步地', type: 'idiom' },
  { phrase: 'one by one', meaning: '一个接一个', type: 'idiom' },
  { phrase: 'side by side', meaning: '并肩；并排', type: 'idiom' },
  { phrase: 'hand in hand', meaning: '手拉手；共同', type: 'idiom' },
  { phrase: 'heart and soul', meaning: '全心全意地', type: 'idiom' },
  { phrase: 'arm in arm', meaning: '臂挽臂', type: 'idiom' },
  { phrase: 'face to face', meaning: '面对面', type: 'idiom' },
  { phrase: 'shoulder to shoulder', meaning: '肩并肩', type: 'idiom' },
  { phrase: 'word for word', meaning: '逐字地', type: 'idiom' },
  { phrase: 'day after day', meaning: '日复一日', type: 'idiom' },
  { phrase: 'year after year', meaning: '年复一年', type: 'idiom' },
  { phrase: 'more and more', meaning: '越来越多', type: 'idiom' },
  { phrase: 'from bad to worse', meaning: '越来越糟', type: 'idiom' },
  { phrase: 'at all costs', meaning: '不惜一切代价', type: 'idiom' },
  { phrase: 'at any rate', meaning: '无论如何', type: 'idiom' },
  { phrase: 'at best', meaning: '最好情况下', type: 'idiom' },
  { phrase: 'at worst', meaning: '最坏情况下', type: 'idiom' },
  { phrase: 'in a hurry', meaning: '匆忙地', type: 'idiom' },
  { phrase: 'in a good mood', meaning: '心情好', type: 'idiom' },
  { phrase: 'in a bad mood', meaning: '心情不好', type: 'idiom' },
  { phrase: 'in high spirit', meaning: '情绪高昂', type: 'idiom' },
  { phrase: 'in low spirit', meaning: '情绪低落', type: 'idiom' },
  { phrase: 'in store', meaning: '即将发生；储存着', type: 'idiom' },
  { phrase: 'in a sense', meaning: '在某种意义上', type: 'idiom' },
  { phrase: 'in a flash', meaning: '瞬间，即刻', type: 'idiom' },
  { phrase: 'in earnest', meaning: '认真地', type: 'idiom' },
  { phrase: 'in hot water', meaning: '处于困境', type: 'idiom' },
  { phrase: 'in deep water', meaning: '陷入困境', type: 'idiom' },
  { phrase: 'on cloud nine', meaning: '非常高兴', type: 'idiom' },
  { phrase: 'out of the question', meaning: '不可能', type: 'idiom' },
  { phrase: 'out of question', meaning: '没问题', type: 'idiom' },
  { phrase: 'under the weather', meaning: '身体不舒服', type: 'idiom' },
  { phrase: 'over the moon', meaning: '非常高兴', type: 'idiom' },
  { phrase: 'a piece of cake', meaning: '小菜一碟', type: 'idiom' },
  { phrase: 'break a leg', meaning: '祝好运', type: 'idiom' },
  { phrase: 'kill two birds with one stone', meaning: '一石二鸟', type: 'idiom' },
  { phrase: 'hit the nail on the head', meaning: '一针见血', type: 'idiom' },
  { phrase: 'let the cat out of the bag', meaning: '泄露秘密', type: 'idiom' },
  { phrase: 'beat around the bush', meaning: '拐弯抹角', type: 'idiom' },
  { phrase: 'bite the bullet', meaning: '硬着头皮', type: 'idiom' },
  { phrase: 'burn the midnight oil', meaning: '熬夜工作', type: 'idiom' },
  { phrase: 'cost an arm and a leg', meaning: '非常昂贵', type: 'idiom' },
  { phrase: 'cry over spilled milk', meaning: '后悔无益', type: 'idiom' },
  { phrase: 'hit the books', meaning: '用功学习', type: 'idiom' },
  { phrase: 'hit the sack', meaning: '去睡觉', type: 'idiom' },
  { phrase: 'hold your horses', meaning: '耐心点', type: 'idiom' },
  { phrase: 'it is a piece of cake', meaning: '小菜一碟', type: 'idiom' },
  { phrase: 'let bygones be bygones', meaning: '既往不咎', type: 'idiom' },
  { phrase: 'make a long story short', meaning: '长话短说', type: 'idiom' },
  { phrase: 'miss the boat', meaning: '错失良机', type: 'idiom' },
  { phrase: 'no pain no gain', meaning: '不劳无获', type: 'idiom' },
  { phrase: 'on the same page', meaning: '意见一致', type: 'idiom' },
  { phrase: 'once in a blue moon', meaning: '千载难逢', type: 'idiom' },
  { phrase: 'open a can of worms', meaning: '自找麻烦', type: 'idiom' },
  { phrase: 'play it by ear', meaning: '随机应变', type: 'idiom' },
  { phrase: 'pull your socks up', meaning: '加把劲', type: 'idiom' },
  { phrase: 'rain cats and dogs', meaning: '倾盆大雨', type: 'idiom' },
  { phrase: 'see eye to eye', meaning: '意见一致', type: 'idiom' },
  { phrase: 'spill the beans', meaning: '泄露秘密', type: 'idiom' },
  { phrase: 'take with a grain of salt', meaning: '半信半疑', type: 'idiom' },
  { phrase: 'the ball is in your court', meaning: '轮到你了', type: 'idiom' },
  { phrase: 'the last straw', meaning: '忍无可忍', type: 'idiom' },
  { phrase: 'through thick and thin', meaning: '历经艰辛', type: 'idiom' },
  { phrase: 'under the table', meaning: '秘密地', type: 'idiom' },
  { phrase: 'when pigs fly', meaning: '绝不可能', type: 'idiom' },
  { phrase: 'you cannot judge a book by its cover', meaning: '不能以貌取人', type: 'idiom' },
  { phrase: 'a drop in the ocean', meaning: '沧海一粟', type: 'idiom' },
  { phrase: 'actions speak louder than words', meaning: '行动胜于言辞', type: 'idiom' },
  { phrase: 'better late than never', meaning: '迟做总比不做好', type: 'idiom' },
  { phrase: 'do not count your chickens before they hatch', meaning: '不要高兴得太早', type: 'idiom' },
  { phrase: 'easy come easy go', meaning: '来得容易去得快', type: 'idiom' },
  { phrase: 'every cloud has a silver lining', meaning: '黑暗中总有一线光明', type: 'idiom' },
  { phrase: 'fortune favors the bold', meaning: '天佑勇者', type: 'idiom' },
  { phrase: 'have your hands full', meaning: '非常忙碌', type: 'idiom' },
  { phrase: 'it is not over until the fat lady sings', meaning: '不到最后不知结果', type: 'idiom' },
  { phrase: 'keep your chin up', meaning: '保持乐观', type: 'idiom' },
  { phrase: 'leave no stone unturned', meaning: '千方百计', type: 'idiom' },
  { phrase: 'look on the bright side', meaning: '看到光明面', type: 'idiom' },
  { phrase: 'make ends meet', meaning: '勉强维持生计', type: 'idiom' },
  { phrase: 'meet halfway', meaning: '妥协，让步', type: 'idiom' },
  { phrase: 'practice makes perfect', meaning: '熟能生巧', type: 'idiom' },
  { phrase: 'put all your eggs in one basket', meaning: '孤注一掷', type: 'idiom' },
  { phrase: 'rise and shine', meaning: '起床了', type: 'idiom' },
  { phrase: 'see you later', meaning: '再见', type: 'idiom' },
  { phrase: 'smooth sailing', meaning: '一帆风顺', type: 'idiom' },
  { phrase: 'the early bird catches the worm', meaning: '早起的鸟儿有虫吃', type: 'idiom' },
  { phrase: 'the tables have turned', meaning: '形势逆转', type: 'idiom' },
  { phrase: 'throw in the towel', meaning: '认输', type: 'idiom' },
  { phrase: 'to make a long story short', meaning: '长话短说', type: 'idiom' },
  { phrase: 'top of the morning', meaning: '早安', type: 'idiom' },
  { phrase: 'turn over a new leaf', meaning: '改过自新', type: 'idiom' },
  { phrase: 'two heads are better than one', meaning: '三个臭皮匠赛过诸葛亮', type: 'idiom' },
  { phrase: 'variety is the spice of life', meaning: '变化是生活的调味品', type: 'idiom' },
  { phrase: 'well begun is half done', meaning: '良好的开端是成功的一半', type: 'idiom' },
  { phrase: 'what is done cannot be undone', meaning: '覆水难收', type: 'idiom' },
  { phrase: 'you reap what you sow', meaning: '种瓜得瓜种豆得豆', type: 'idiom' },
  { phrase: 'all of a sudden', meaning: '突然', type: 'idiom' },
  { phrase: 'as a rule', meaning: '通常，一般来说', type: 'idiom' },
  { phrase: 'as a whole', meaning: '总体上', type: 'idiom' },
  { phrase: 'beyond doubt', meaning: '毫无疑问', type: 'idiom' },
  { phrase: 'beyond question', meaning: '毫无疑问', type: 'idiom' },
  { phrase: 'by and large', meaning: '总的来说', type: 'idiom' },
  { phrase: 'by degrees', meaning: '逐渐地', type: 'idiom' },
  { phrase: 'for good', meaning: '永久地', type: 'idiom' },
  { phrase: 'for free', meaning: '免费', type: 'idiom' },
  { phrase: 'for instance', meaning: '例如', type: 'idiom' },
  { phrase: 'for real', meaning: '真的', type: 'idiom' },
  { phrase: 'in place', meaning: '在适当的位置；准备就绪', type: 'idiom' },
  { phrase: 'in private', meaning: '私下地', type: 'idiom' },
  { phrase: 'in public', meaning: '公开地', type: 'idiom' },
  { phrase: 'in the dark', meaning: '不知道', type: 'idiom' },
  { phrase: 'in the least', meaning: '一点，丝毫', type: 'idiom' },
  { phrase: 'in the long run', meaning: '从长远来看', type: 'idiom' },
  { phrase: 'in the name of', meaning: '以...的名义', type: 'idiom' },
  { phrase: 'in the shade', meaning: '在阴凉处', type: 'idiom' },
  { phrase: 'in the sun', meaning: '在阳光下', type: 'idiom' },
  { phrase: 'on the defensive', meaning: '处于防御状态', type: 'idiom' },
  { phrase: 'on the offensive', meaning: '处于进攻状态', type: 'idiom' },
  { phrase: 'on the safe side', meaning: '为安全起见', type: 'idiom' },
  { phrase: 'on the whole', meaning: '总的来说', type: 'idiom' },
  { phrase: 'to a certain extent', meaning: '在某种程度上', type: 'idiom' },
  { phrase: 'to some extent', meaning: '在某种程度上', type: 'idiom' },
  { phrase: 'to a large extent', meaning: '在很大程度上', type: 'idiom' },
  { phrase: 'under the circumstances', meaning: '在这种情况下', type: 'idiom' },
];

// 合并所有短语
export const allPhrases: PhraseEntry[] = [...phrasalVerbs, ...idioms];

// 创建用于快速匹配的字典（按长度降序排列，避免部分匹配问题）
export function buildPhraseMap(): Map<string, PhraseEntry> {
  const map = new Map<string, PhraseEntry>();
  // 按长度降序排列，这样优先匹配更长的短语
  const sortedPhrases = [...allPhrases].sort((a, b) => b.phrase.length - a.phrase.length);
  for (const phrase of sortedPhrases) {
    const key = phrase.phrase.toLowerCase();
    if (!map.has(key)) {
      map.set(key, phrase);
    }
  }
  return map;
}

// 高亮文本中的短语动词和习语
export interface HighlightedSegment {
  text: string;
  segments: Array<{
    start: number;
    end: number;
    phrase: PhraseEntry;
  }>;
}

// 对文本进行高亮处理
export function highlightPhrases(text: string): HighlightedSegment {
  const phraseMap = buildPhraseMap();
  const segments: HighlightedSegment['segments'] = [];
  
  // 将文本转为小写进行匹配
  const lowerText = text.toLowerCase();
  
  for (const [phrase, entry] of phraseMap) {
    let startIndex = 0;
    while (true) {
      const index = lowerText.indexOf(phrase, startIndex);
      if (index === -1) break;
      
      // 检查是否在单词边界内（避免部分单词匹配）
      const beforeChar = index > 0 ? lowerText[index - 1] : ' ';
      const afterChar = index + phrase.length < lowerText.length 
        ? lowerText[index + phrase.length] 
        : ' ';
      
      const beforeIsWordChar = /[a-zA-Z]/.test(beforeChar);
      const afterIsWordChar = /[a-zA-Z]/.test(afterChar);
      
      // 如果前后都不是字母，则这是一个完整的短语匹配
      if (!beforeIsWordChar && !afterIsWordChar) {
        segments.push({
          start: index,
          end: index + phrase.length,
          phrase: entry,
        });
      }
      
      startIndex = index + 1;
    }
  }
  
  // 按起始位置排序
  segments.sort((a, b) => a.start - b.start);
  
  // 合并重叠的片段（保留较长的）
  const mergedSegments: HighlightedSegment['segments'] = [];
  for (const seg of segments) {
    if (mergedSegments.length === 0) {
      mergedSegments.push(seg);
    } else {
      const last = mergedSegments[mergedSegments.length - 1];
      if (seg.start < last.end) {
        // 重叠：保留较长的
        if (seg.end > last.end) {
          last.end = seg.end;
          last.phrase = seg.phrase;
        }
      } else {
        mergedSegments.push(seg);
      }
    }
  }
  
  return {
    text,
    segments: mergedSegments,
  };
}

// 获取匹配到的短语列表
export function getMatchedPhrases(text: string): PhraseEntry[] {
  const highlighted = highlightPhrases(text);
  return highlighted.segments.map(s => s.phrase);
}

// 导出短语总数统计
export function getPhraseStats() {
  return {
    phrasalVerbs: phrasalVerbs.length,
    idioms: idioms.length,
    total: allPhrases.length,
  };
}
