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
  }
}

export {animsByEntityName}
