#[no_mangle]
fn check(current: f64, val: f64, op: u16) -> bool {
    if op == 0x203C {
        return current < val;
     }
     else if op == 0x203E {
        return current > val;
     }
     else if op == 0x203D {
        return current == val;
     }
     else if op == 0x3C3D {
        return current <= val;
     }
     else if op == 0x3E3D {
        return current >= val;
     }
     else
     {
         return false;
     }
}

#[cfg(test)]
mod tests {
    use super::{check};

    #[test]
    fn test_check() {
        let current = 100.0;
        let value   = 200.0;

        assert!(check(current, value, 0x203C));
        assert!(check(current, value, 0x203E) == false);
    }
}

