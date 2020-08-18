use pyo3::prelude::*;
use pyo3::wrap_pyfunction;

#[pyfunction]
fn check(current: f64, val: f64, op: u16) -> bool {
  let ret = match op {
    0x203C => current < val,
    0x203E => current > val,
    0x203D => current == val,
    0x3C3D => current <= val,
    0x3E3D => current >= val,
    _      => false
  };
  return ret
}

#[pymodule]
fn libdigitaldash(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_wrapped(wrap_pyfunction!(check)).unwrap();

    Ok(())
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
