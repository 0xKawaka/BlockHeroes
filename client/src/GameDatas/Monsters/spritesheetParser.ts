const animsByEntityName: {
  [key: string]: {[key: string]:{start:number, end:number}},
} = {  
  "hunter": {
    idle:{start:0, end:11},
    hurt:{start:12, end:17},
    die:{start:18, end:36},
    skill2: {start:37, end:48},
    jump_up: {start:49, end:51},
    jump: {start:52, end:73},
    skill1: {start:74, end:83},
    attack: {start:84, end:98},
    run: {start:99, end:108},
  },
  "priest": {
    idle:{start:0, end:7},
    hurt:{start:8, end:14},
    die:{start:15, end:30},
    skill2: {start:31, end:48},
    skill1: {start:49, end:60},
    attack: {start:61, end:68},
  },
  "assassin": {
    idle:{start:0, end:7},
    hurt:{start:8, end:13},
    die:{start:14, end:32},
    skill2: {start:33, end:62},
    jump: {start:63, end:65},
    skill1: {start:66, end:80},
    attack: {start:81, end:87},
    run: {start:88, end:95},
    roll: {start:96, end:101},
  },
  "knight": {
    idle:{start:0, end:7},
    hurt:{start:8, end:13},
    die:{start:14, end:26},
    skill2: {start:27, end:44},
    jump: {start:45, end:64},
    skill1: {start:65, end:72},
    attack: {start:73, end:83},
    run: {start:83, end:90},
  },
  "diana": {
    idle:{start:0, end:9},
    hurt:{start:10, end:15},
    die:{start:19, end:28},
    jump: {start:29, end:38},
    attack: {start:59, end:67},
    skill2: {start:69, end:78},
    skill1: {start:79, end:87},
    run: {start:39, end:42},
  },
  "elric": {
    idle:{start:0, end:9},
    hurt:{start:12, end:17},
    die:{start:24, end:34},
    run: {start:36, end:38},
    jump: {start:48, end:54},
    jumpStart: {start:48, end:49},
    jumpLoop: {start:50, end:52},
    jumpEnd: {start:53, end:54},
    attack: {start:60, end:65},
    skill2: {start:72, end:83},
    skill1: {start:84, end:91},
  },
  "nereus": {
    idle:{start:0, end:9},
    hurt:{start:16, end:21},
    die: {start:32, end:43},
    run: {start:48, end:50},
    jumpStart: {start:64, end:65},
    jumpLoop: {start:66, end:68},
    jumpEnd: {start:69, end:70},
    attack: {start:80, end:88},
    skill1: {start:96, end:106},
    skill2: {start:112, end:127},
  },
  "rex": {
    idle:{start:0, end:10},
    hurt:{start:25, end:30},
    die: {start:50, end:58},
    run: {start:75, end:77},
    jumpStart: {start:100, end:101},
    jumpLoop: {start:102, end:104},
    jumpEnd: {start:105, end:106},
    attack: {start:125, end:133},
    skill1: {start:175, end:195},
    skill2: {start:150, end:174},
  },
  "celeste": {
    idle:{start:0, end:10},
    hurt:{start:11, end:16},
    die: {start:22, end:32},
    run: {start:33, end:35},
    jumpStart: {start:44, end:45},
    jumpLoop: {start:46, end:48},
    jumpEnd: {start:49, end:50},
    attack: {start:55, end:60},
    skill1: {start:66, end:73},
    skill2: {start:66, end:73},
  },
  "oakheart": {
    idle:{start:0, end:10},
    hurt:{start:12, end:17},
    die:{start:24, end:32},
    run: {start:36, end:38},
    jump: {start:48, end:54},
    jumpStart: {start:48, end:49},
    jumpLoop: {start:50, end:52},
    jumpEnd: {start:53, end:54},
    attack: {start:60, end:69},
    skill2: {start:72, end:83},
    skill1: {start:84, end:95},
  },
  "sylvara": {
    idle:{start:0, end:11},
    hurt:{start:13, end:18},
    die: {start:26, end:36},
    run: {start:39, end:42},
    jump: {start:52, end:58},
    jumpStart: {start:52, end:53},
    jumpLoop: {start:54, end:56},
    jumpEnd: {start:57, end:58},
    attack: {start:65, end:77},
    skill1: {start:65, end:77},
    skill2: {start:65, end:77},
  },
  "bane": {
    idle:{start:0, end:11},
    hurt:{start:15, end:20},
    die: {start:30, end:44},
    run: {start:45, end:47},
    jumpStart: {start:60, end:61},
    jumpLoop: {start:62, end:64},
    jumpEnd: {start:65, end:66},
    attack: {start:75, end:85},
    skill1: {start:75, end:85},
    skill2: {start:75, end:85},
  },
  "ember": {
    idle:{start:0, end:11},
    hurt:{start:21, end:26},
    die: {start:42, end:49},
    run: {start:63, end:65},
    jumpStart: {start:84, end:85},
    jumpLoop: {start:86, end:88},
    jumpEnd: {start:89, end:90},
    attack: {start:105, end:114},
    skill1: {start:105, end:114},
    skill2: {start:126, end:146},
  },
  "molten": {
    idle:{start:0, end:11},
    hurt:{start:19, end:24},
    die: {start:38, end:53},
    run: {start:57, end:59},
    jumpStart: {start:76, end:77},
    jumpLoop: {start:78, end:80},
    jumpEnd: {start:81, end:82},
    attack: {start:95, end:103},
    skill1: {start:114, end:124},
    skill2: {start:133, end:151},
  }

}

export {animsByEntityName}
