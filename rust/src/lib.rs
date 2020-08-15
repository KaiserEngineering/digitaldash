#[no_mangle]
fn check(current: f64, val: f64, op: u16) -> bool {

    match op {
      0x203C => return current < val,
      0x203E => return current > val,
      0x203D => return current == val,
      0x3C3D => return current <= val,
      0x3E3D => return current >= val,
      _      => return false
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    #[test]
    fn test_check() {
        use super::{check};

        let mut operators: HashMap<u16, bool> = HashMap::new();
        operators.insert(0x203C, true);
        operators.insert(0x203E, false);
        operators.insert(0x203D, false);
        operators.insert(0x3C3D, true);
        operators.insert(0x3E3D, false);

        let current = 100.0;
        let value   = 200.0;

        for operator in operators.iter() {
            assert!(check(current, value, *operator.0) == *operator.1);
        }

        let current = 200.0;
        let value   = 200.0;

        assert!(check(current, value, 0x203D) == true);
        assert!(check(current, value, 0x3E3D) == true);
    }
}

