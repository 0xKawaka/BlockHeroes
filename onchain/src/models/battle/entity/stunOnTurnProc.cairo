#[derive(Copy, Drop, Serde, Introspect)]
pub struct StunOnTurnProc {
    pub duration: u8,
    pub stunned: bool,
}

fn new(duration: u8) -> StunOnTurnProc {
    StunOnTurnProc {
        duration: duration,
        stunned: false,
    }
}

trait StunOnTurnProcTrait {
    fn proc(ref self: StunOnTurnProc);
    fn setStunned(ref self: StunOnTurnProc, duration: u8);
    fn isStunned(self: StunOnTurnProc) -> bool;
    fn updateStunned(ref self: StunOnTurnProc);
}

impl StunOnTurnProcImpl of StunOnTurnProcTrait {
    fn proc(ref self: StunOnTurnProc) {
        if self.duration > 0 {
            self.duration -= 1;
            if self.duration == 0 {
                self.stunned = false;
            }
        }
    }

    fn setStunned(ref self: StunOnTurnProc, duration: u8) {
        if self.duration < duration {
            self.duration = duration;
            self.stunned = true;
        }
    }

    fn isStunned(self: StunOnTurnProc) -> bool {
        return self.stunned;
    }

    fn updateStunned(ref self: StunOnTurnProc) {
        if self.duration > 0 {
            self.stunned = true;
        } else {
            self.stunned = false;
        }
    }
}